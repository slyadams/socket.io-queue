require('requirejs');
var Buffer = require('./buffer.js')
var Message = require('./message.js')

function Connection(socket) {
	this.socket = socket;
	this.connection_id = Connection.connection_id++;
	this.sequence = 1;
	this.buffer = new Buffer();
	var self = this;

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
		console.log(self.connection_id + ' :: Received ack '+sequence);
		self.waiting = false;
		self.buffer.clearSequence(sequence);
		self.send_data();
	}

	// another process acknowledgement, I had two for debugging how the acks work in the protoco
	this.receive_ack2 = function(sequence) {
		console.log(self.connection_id + ' :: Received ack 2 '+sequence);
		self.buffer.clearSequence(sequence);
		self.waiting = false;
		self.send_data();
	}
	
	// add data to the buffer for sending
	this.push_data = function(data) {
		self.buffer.push(new Message(self.sequence++, data));
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
					if (Math.random() < 0.05) {
						// use receive_ack
						callback = self.receive_ack;
						self.waiting = true;
						done = true;
					} else if (Math.random() < 0.05) {
						// use receive_ack2
						callback = self.receive_ack2;
						self.waiting = true;
						done = true;
					} else {
						// use no ack
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
		console.log(self.connection_id + ' :: ' + data);
	});

	// retransmit channel
	this.socket.on('retransmit', function (data) {
		var sequence = self.buffer.unSend(data.sequence);
		console.log("Retransmitting from " + sequence);
		self.socket.emit("retransmit", { sequence: sequence});
		self.send_data();
	});	

	// on disconnect
	this.socket.on('disconnect', function () {
		console.log(self.connection_id + ' :: Disconnected');
	});

	console.log(this.connection_id + ' :: Connected ');

}
Connection.connection_id = 0;

module.exports = Connection;