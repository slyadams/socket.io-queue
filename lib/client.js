var ControlResponse = require('./control-response.js');
var Control = require('./control.js');
var events = require('events');
var Debug = require('debug');
var Utils = require('./utils');
var ClientMessage = require('./client-message.js');
var io = require('socket.io-client');


var debug = new Debug('socket.io-queue:client');

function Client(url_socket, opts) {

    if ((url_socket == undefined) ||
        (typeof(url_socket) != 'string' && typeof(url_socket) != 'object') ||
        (opts != undefined && typeof(opts) != 'object')
    ) {
        throw TypeError("Expected either socket or string with an optional set of options");
    }

    // setup event listener
    events.EventEmitter.call(this);
    var self = this;
    var _url;

    var _connect = function(url, opts) {
        debug("Connecting to '" + url + "'");
        var s = io(url, opts);
        if (s.nsp == "/") {
            return s;
        } else {
            throw new Error("Only the default namespace is supported")
        }
    }

    // send retransmit message
    this.retransmit = function() {
        debug("Will request retransmit");
        var control = new Control(Control.RETRANSMIT, Client.controlID++);
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.setWindow = function(size) {
        if (size == undefined || !Utils.isInt(size) || size <= 0) {
            throw TypeError("Expected positive integer");
        }

        var control = new Control(Control.WINDOW, Client.controlID++, {
            size: size
        });
        debug("Setting window size " + size);
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.pause = function() {
        var control = new Control(Control.PAUSE, Client.controlID++);
        debug("Pausing");
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.resume = function() {
        var control = new Control(Control.RESUME, Client.controlID++);
        debug("Resuming");
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.debug = function(data) {
        debug("Sending debug (" + data + ")");
        _socket.emit('debug', data);
    }

    this.isConnected = function() {
        return _socket.connected;
    }

    this.close = function() {
        _socket.close();
    }

    var _socket
    if (typeof(url_socket) == 'string') {
        _url = url_socket;
        _socket = _connect(_url, opts);
    } else {
        _socket = url_socket;
    }

    var _register_handlers = function(socket) {
        socket.on('disconnect', function() {
            debug("Disconnected from " + _url);
            self.emit('disconnect');
        });

        /* data channel handlers */
        // emit data
        socket.on('data', function(data, ack) {
            debug("Received data " + data.sequence + ", ack required: " + ack ? true : false);
            self.emit('data', new ClientMessage(data.sequence, data.data, ack));
        });


        /* retransmit channel handlers */
        // emit retransmit
        socket.on('retransmit', function() {
            debug("Will receive retransmit");
            self.emit('retransmit');
        });

        /* error channel handlers */
        // emit error
        socket.on('err', function(error) {
            debug("Received error " + "(" + error.code + ":" + error.message + ")");
            self.emit('error', error);
        });

        /* debug channel handlers */
        // debug channel
        socket.on('debug', function(data) {
            debug("Debug: " + data);
            self.emit('debug', data);
        });

        /* control channel handlers */
        // debug channel
        socket.on('control', function(control) {
            var controlResponse = new ControlResponse(control);
            debug("Received control response " + "(" + controlResponse.getControlID() + ":" + controlResponse.getSuccess() + ")");
            self.emit('control', controlResponse);
        });

    }

    /* core socket handlers */
    // connection handler
    _socket.on('connect_error', function(error) {
        debug("Connect error '" + error + "'");
        self.emit('connect_error', error);
    });

    // emit connect
    _socket.on('connect', function() {
        debug("Connected to " + _url);

        _register_handlers(_socket);

        // emit disconnect

        self.emit('connect');
    });

}

Client.controlID = 0;

// inherit from EventEmitter
Client.prototype.__proto__ = events.EventEmitter.prototype;
module.exports = Client;