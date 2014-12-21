if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([],

	function() {

		function Buffer(maxBufferSize) {
			var _buffer = new Array();
			var _maxBufferSize = maxBufferSize || 100;

			// standard array function
			this.push = function(message) {
				_buffer.push(message);
				if (this.getLength() > maxBufferSize) {
					throw { name: "overflow", code: 100};
				}
			}

			this.shift = function() {
				return _buffer.shift();
			}

			this.get = function(index) {
				return _buffer[index];
			}

			this.getLength = function() {
				return _buffer.length;
			}

			this.clear = function() {
				_buffer.length = 0;
			}

			// delete all messages which are acknowledged (i.e. <= the sequence number in the ack)
			this.clearSequence = function(sequence) {
				while (this.getLength() > 0 && this.get(0).getSequence() <= sequence) {
					this.shift();
				}
			}

			// get buffer stats
			this.getBufferStats = function() {
				var length = this.getLength();
				
				// count unmber of sent/unsent messages
				var sent = 0, unsent = 0;
				for (var i=0; i < length; i++) {
					if (this.get(i).getSent()) {
						sent++;
					} else {
						unsent++;
					}
				}
				return { size: _maxBufferSize, length: length, sent: sent, unsent: unsent}; 
				
			}

			// set sent=false for any sequence numbers >= from_sequence 
			this.unSend = function(fromSequence) {
				var length = this.getLength();
				var sequence = null;
				
				for (var i=0; i < length; i++) {
					var message = this.get(i);
					if (message.getSequence() >= fromSequence) {
						message.setSent(false);
						if (!sequence || message.getSequence() <= sequence) {
							sequence = message.getSequence();
						}
					}
				}
				return sequence;
			}
		}

		return (Buffer);
	}
);