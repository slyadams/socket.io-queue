var Utils = require('./utils.js');
var ControlResponse = require('./control-response.js');


function Control() {

    var _control = null;
    var _controlID = null;
    var _controlParameters = null;

    var _checkParams = function(control, controlID) {
        if ((control == undefined || !Utils.isInt(control)) ||
            (controlID == undefined || !Utils.isInt(controlID))) {
            throw TypeError(Control.CONSTRUCTOR_TYPE_ERROR);
        }
    }

    this.createFromRequest = function(control) {
        _checkParams(control.control, control.control_id);
        _control = control.control;
        _controlID = control.control_id;
        _controlParameters = control.control_parameters;
    }

    this.createFromParameters = function(control, controlID, controlParameters) {
        _checkParams(control, controlID);
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
        switch (arguments.length) {
            case 1:
                this.createFromRequest(arguments[0]);
                break;
            case 2:
                this.createFromParameters(arguments[0], arguments[1]);
                break;
            case 3:
                this.createFromParameters(arguments[0], arguments[1], arguments[2]);
                break;
            default:
                throw TypeError(Control.CONSTRUCTOR_TYPE_ERROR);
        }
    }

    this.create(arguments);

}

Control.WINDOW = 1;
Control.PAUSE = 2;
Control.RESUME = 3;

Control.CONSTRUCTOR_TYPE_ERROR = "Expected either two integers and an optional object or an object";

module.exports = Control;