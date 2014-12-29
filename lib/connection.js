var Buffer = require('./buffer.js');
var Message = require('./message.js');
var Control = require('./control.js');
var events = require('events');
var Debug = require('debug');


var debug = new Debug('socket.io-queue:connection');

function Connection(socket, windowSize, maxBufferSize) {

    if (socket == undefined) {
        throw TypeError("Expected socket parameter");
    }

    var self = this;
    var _socket = socket;
    var _connectionID = Connection.connectionID++;
    var _sequence = 1;
    var _buffer = new Buffer(maxBufferSize);
    var _window = windowSize;
    var _sent = 0;
    var _waitingAck = null;
    var _lastAck = 0;
    var _paused = false;

    // setup event listener
    events.EventEmitter.call(this);

    this.getBuffer = function() {
        return _buffer;
    }

    this.getConnectionID = function() {
        return _connectionID;
    }

    this.getWindowSize = function() {
        return _window;
    }

    // defines if we are currently waiting for an ack
    this.isWaiting = function() {
        return _waitingAck != null;
    }

    // defines if we are currently paused
    this.isPaused = function() {
        return _paused;
    }

    // process acknowledgement
    this.receiveAck = function(sequence) {
        if (sequence == undefined) {
            throw new TypeError("Expected integer parameter");
        }
        self.emit('ack', sequence);
        if (sequence == _waitingAck) {
            debug(self.getConnectionID() + ' :: Received ack ' + sequence);
            //self.waiting = false;
            _buffer.clearSequence(sequence);
            _waitingAck = null;
            _lastAck = sequence;
            self.sendData();
        } else {
            debug(self.getConnectionID() + ' :: Received invalid ack ' + sequence);
        }
    }

    // add data to the buffer for sending
    this.pushData = function(data) {
        if (data == undefined) {
            throw new TypeError("Expected integer parameter");
        }
        try {
            _buffer.push(new Message(_sequence++, data));
        } catch (e) {
            debug(self.getConnectionID() + " :: Buffer overflow, closing connection");
            _socket.emit('err', {
                code: e.code,
                message: e.name
            });
            _socket.disconnect();
        }
        self.sendData();
    }

    // send data from the buffer down the socket
    this.sendData = function() {
        // loop sending unack'd messages until hit random or last message

        // only send stuff if we're not waiting
        if (!self.isWaiting() && !self.isPaused()) {

            var done = false;
            var callback = null;

            // loop through buffer
            var length = _buffer.getLength();
            for (var i = 0; i < length && !done; i++) {
                // if message isn't marked as already sent (i.e. sent and waiting on ack)
                if (!_buffer.get(i).getSent()) {
                    _sent++;
                    if (_sent >= _window) {
                        // use receiveAck
                        callback = self.receiveAck;
                        _waitingAck = _buffer.get(i).getSequence();
                        done = true;
                        _sent = 0;
                    }

                    // mark message as sent and send it
                    _buffer.get(i).setSent(true);
                    debug(self.getConnectionID() + " :: " + "Sending sequence " + _buffer.get(i).getSequence());
                    _socket.emit('data', _buffer.get(i).get(), callback);
                    callback = null;
                }
            }
        }
    }

    // retransmit data
    this.retransmit = function() {
        debug(self.getConnectionID() + " :: Retransmitting");
        _sent = 0;
        _buffer.unSend(_lastAck);
        _waitingAck = null;
        //_socket.emit("retransmit", { });
        self.sendData();
    }


    /* core socket handlers */
    // on disconnect
    _socket.on('disconnect', function() {
        self.emit('disconnect');
        debug(self.getConnectionID() + ' :: Disconnected');
    });

    /* retransmit handlers */
    // retransmit channel
    _socket.on('retransmit', function(data) {
        debug(self.getConnectionID() + ' :: Retransmitting');
        self.emit('retransmit');
        self.retransmit();
    });

    /* debug channel handlers */
    // debug channel
    _socket.on('debug', function(data) {
        debug(self.getConnectionID() + ' :: ' + data);
        self.emit('debug', data);
    });


    /* control channel handlers */
    // debug channel
    _socket.on('control', function(control_request) {
        var control = new Control(control_request);
        debug(self.getConnectionID() + ' :: Received control (' + control.getRequest());
        self.emit('control', control);

        switch (control.getControl()) {
            case Control.WINDOW:
                _window = control.getControlParameters().size;
                socket.emit('control', control.getResponse(true));
                break;
            case Control.PAUSE:
                _paused = true;
                socket.emit('control', control.getResponse(true));
                break;
            case Control.RESUME:
                _paused = false;
                socket.emit('control', control.getResponse(true));
                break;
            default:
                debug(self.getConnectionID() + ' :: Invalid control "' + control.getControl() + '"');
                socket.emit('control', control.getResponse(false));
        }
    });

    debug(self.getConnectionID() + ' :: Connected ');
}

Connection.connectionID = 0;

// inherit from EventEmitter
Connection.prototype.__proto__ = events.EventEmitter.prototype;


module.exports = Connection;