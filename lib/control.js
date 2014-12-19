require('requirejs');
var ControlResponse = require('./control-response.js');

function Control() {

	var _control = null;
	var _controlID = null;
	var _controlParameters = null;

	this.createFromRequest = function(control) {
		_control = control.control;
		_controlID = control.control_id;
		_controlParameters = control.control_parameters;
	}

	this.createFromParameters = function(control, controlID, controlParameters) {
		_control = control;
		_controlID = controlID;
		_controlParameters = controlParameters;
	}

	this.getControl = function() {
		return _control;
	}

	this.getControlID = function() {
		return _controlID;
	}

	this.getControlParameters = function() {
		return _controlParameters;
	}

	this.getResponse = function(success) {
		return new ControlResponse(this.getControlID(), success).format();
	}

	this.getRequest = function(success) {
		return {
			control: this.getControl(),
			control_id: this.getControlID(),
			control_parameters: this.getControlParameters()
		};
	}

	this.create = function(arguments) {
		if (arguments.length == 1) {
			this.createFromRequest(arguments[0]);
		} else {
			this.createFromParameters(arguments[0], arguments[1], arguments[2]);
		}
	}

	this.create(arguments);

}

Control.WINDOW 	= 	1;
Control.PAUSE 	= 	2;
Control.RESUME 	= 	3;

module.exports = Control;