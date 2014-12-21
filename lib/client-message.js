if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['debug'],

	function(Debug) {

		var debug = new Debug('socket.io-queue:client-message');

		function ClientMessage(sequence, data, ack) {
			var _sequence = sequence;
			var _data = data;
			var _ack = ack;

			// return data
			this.getData = function() {
				return _data;
			}

			// return sequence
			this.getSequence = function() {
				return _sequence;
			}

			// does this message need an ack?
			this.needsAck = function() {
				return typeof(_ack) === typeof(Function);
			}

			// when done() called, send ack if required
			this.done = function() {
				if (this.needsAck()) {
					debug("Sending ack for " + _sequence);
					return _ack(_sequence);
				}
			}

		}

		return (ClientMessage);
	}
);