require('requirejs');

function ControlResponse() {

	var _controlID = null;
	var _success = null;

	this.createFromRequest = function(controlResponse) {
		_controlID = controlResponse.control_id;
		_success = controlResponse.success;
	}

	this.createFromParameters = function(controlID, success) {
		_controlID = controlID;
		_success = success;
	}

	this.getControlID = function() {
		return _controlID;
	}

	this.getSuccess = function() {
		return _success;
	}

	this.format = function() {
		return {
			control_id: this.getControlID(),
			success: this.getSuccess(),
		};
	}

	this.create = function(arguments) {
		if (arguments.length == 2) {
			this.createFromParameters(arguments[0], arguments[1]);
		} else {
			this.createFromRequest(arguments[0]);
		}
	}

	this.create(arguments);

}

module.exports = ControlResponse;