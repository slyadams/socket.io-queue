require('requirejs');

function Message(sequence, data) {
	var _sequence = sequence;
	var _data = data;
	var _sent = false;

	// return structure for transmission
	this.get = function() {
		return {	
			sequence: _sequence,
			data: _data
		}
	}

	// getters and setters
	this.getSent = function() {
		return _sent;
	}

	this.setSent = function(sent) {
		_sent = sent;
	}

	this.getSequence = function() {
		return _sequence;
	}

	this.getData = function() {
		return _data;
	}

}

module.exports = Message;