require('requirejs');
var Buffer = require('./buffer.js');
var Message = require('./message.js');
var debug = require('debug')('socket.io-queue:connection');

function Connection(socket, windowSize, maxBufferSize) {
	this.socket = socket;
	this.connectionID = Connection.connectionID++;
	this.sequence = 1;
	this.buffer = new Buffer(maxBufferSize);
	var self = this;
	var _window = windowSize;
	var _sent = 0;
	var _waitingAck = null;
	
	this.getBuffer = function() {
    return self.buffer;
	}

	this.getConnectionID = function () {
		return this.connectionID;
	}

	this.getWindowSize = function() {
		return _window;
	}

	// defines if we are currently waiting for an ack
	this.isWaiting = function() {
		return _waitingAck != null;
	}

	// process acknowledgement
	this.receiveAck = function(sequence) {
		if (sequence == _waitingAck) {
			debug(self.getConnectionID() + ' :: Received ack '+sequence);
			//self.waiting = false;
			self.buffer.clearSequence(sequence);
			_waitingAck = null;
			self.sendData();
		} else {
			debug(self.getConnectionID() + ' :: Received invalid ack '+sequence);
		}
	}

	// add data to the buffer for sending
	this.pushData = function(data) {
		try {
			self.buffer.push(new Message(self.sequence++, data));
		} catch (e) {
			debug(self.getConnectionID() + " :: Buffer overflow, closing connection");
			self.socket.emit('err', { code: e.code, message: e.name });
			self.socket.disconnect();
		}
		self.sendData();
	}
	
	// send data from the buffer down the socket
	this.sendData = function() {
		// loop sending unack'd messages until hit random or last message

		// only send stuff if we're not waiting
		if (!self.isWaiting()) {

			var done = false;
			var callback = null;
			
			// loop through buffer
			var length = self.buffer.getLength();
			for (var i = 0; i<length && !done; i++) {
				// if message isn't marked as already sent (i.e. sent and waiting on ack)
				if (!self.buffer.get(i).getSent()) {
					_sent++;
					if (_sent >= _window) {
						// use receiveAck
						callback = self.receiveAck;
						_waitingAck = self.buffer.get(i).getSequence();
						//self.waiting = true;
						done = true;
						_sent = 0;
					}

					// mark message as sent and send it
					self.buffer.get(i).setSent(true);
					socket.emit('data', self.buffer.get(i).get(), callback);
					callback = null;
				}
			}
		}
	}

	// retransmit data
	this.retransmit = function() {
		debug(self.getConnectionID() + " :: Retransmitting");
		self.buffer.unSend(_waitingAck);
		//self.socket.emit("retransmit", { });
		self.sendData();
	}


  /* core socket handlers */
	// on disconnect
	this.socket.on('disconnect', function () {
		debug(self.getConnectionID() + ' :: Disconnected');
	});

  /* retransmit handlers */
	// retransmit channel
	this.socket.on('retransmit', function (data) {
		self.retransmit();
		//var sequence = self.buffer.unSend(data.sequence);
		//debug(self.getConnectionID() + " :: Retransmitting from " + sequence + " from request of "+data.sequence);
	});

  /* debug channel handlers */
	// debug channel
	this.socket.on('debug', function (data) {
		debug(self.getConnectionID() + ' :: ' + data);
	});

  
  /* control channel handlers */
  // debug channel
  this.socket.on('control', function (control) {
    if (control.type = "window") {
    	_window = control.data.size;
    }
  });

	debug(self.getConnectionID() + ' :: Connected ');
}
Connection.connectionID = 0;

module.exports = Connection;