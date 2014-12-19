require('requirejs');

function ControlResponse(control_response) {

	var _control_id = null;
	var _success = null;

	this.createFromRequest = function(control_response) {
		_control_id = control_response.control_id;
		_success = control_response.success;
	}

	this.createFromParameters = function(control_id, success) {
		_control_id = control_id;
		_success = success;
	}

	this.getControlID = function() {
		return _control_id;
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