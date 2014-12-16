require('requirejs');
var Buffer = require('./buffer.js');
var Message = require('./message.js');
var debug = require('debug')('socket.io-queue:connection');


function Connection(socket, window_size, max_buffer_size) {
	this.socket = socket;
	this.connection_id = Connection.connection_id++;
	this.sequence = 1;
	this.buffer = new Buffer(max_buffer_size);
	var self = this;
	var _window = window_size;
	var _sent = 0;

	// defines if we are currently waiting for an ack
	this.waiting = false;
	
	this.getBuffer = function() {
		return self.buffer;
	}

	this.getConnectionID = function () {
		return this.connection_id;
	}

	// process acknowledgement
	this.receive_ack = function(sequence) {
		debug(self.connection_id + ' :: Received ack '+sequence);
		self.waiting = false;
		self.buffer.clearSequence(sequence);
		self.send_data();
	}

	// add data to the buffer for sending
	this.push_data = function(data) {
		try {
			self.buffer.push(new Message(self.sequence++, data));
		} catch (e) {
			debug("Buffer overflow, closing connection");
			self.socket.emit('control', { type: "Error", name: e.name, code: e.code});
			self.socket.disconnect();
		}
		self.send_data();
	}
	
	// send data from the buffer down the socket
	this.send_data = function() {
		// loop sending unack'd messages until hit random or last message

		// only send stuff if we're not waiting
		if (!self.waiting) {

			var done = false;
			var callback = null;
			
			// loop through buffer
			var length = self.buffer.getLength();
			for (var i = 0; i<length && !done; i++) {
				// if message isn't marked as already sent (i.e. sent and waiting on ack)
				if (!self.buffer.get(i).getSent()) {
					_sent++;
					if (_sent >= _window) {
						// use receive_ack
						callback = self.receive_ack;
						self.waiting = true;
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

	// debug channel
	this.socket.on('debug', function (data) {
		debug(self.connection_id + ' :: ' + data);
	});

	// retransmit channel
	this.socket.on('retransmit', function (data) {
		var sequence = self.buffer.unSend(data.sequence);
		debug("Retransmitting from " + sequence + " from request of "+data.sequence);
		self.socket.emit("retransmit", { sequence: sequence, request: data.sequence });
		self.send_data();
	});	

	// on disconnect
	this.socket.on('disconnect', function () {
		debug(self.connection_id + ' :: Disconnected');
	});

	debug(this.connection_id + ' :: Connected ');

}
Connection.connection_id = 0;

module.exports = Connection;