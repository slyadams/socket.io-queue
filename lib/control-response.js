if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./utils.js'],

    function(Utils) {

        function ControlResponse() {

            var _controlID = null;
            var _success = null;

            var _checkParams = function(controlID, success) {
                if ((controlID == undefined || !Utils.isInt(controlID)) ||
                    (success == undefined || typeof(success) != 'boolean')) {
                    throw TypeError(ControlResponse.CONSTRUCTOR_TYPE_ERROR);
                }
            }

            this.createFromRequest = function(controlResponse) {
                _checkParams(controlResponse.control_id, controlResponse.success);
                _controlID = controlResponse.control_id;
                _success = controlResponse.success;
            }

            this.createFromParameters = function(controlID, success) {
                _checkParams(controlID, success);
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
                switch (arguments.length) {
                    case 1:
                        this.createFromRequest(arguments[0]);
                        break;
                    case 2:
                        this.createFromParameters(arguments[0], arguments[1]);
                        break;
                    default:
                        throw TypeError(ControlResponse.CONSTRUCTOR_TYPE_ERROR);
                }
            }

            this.create(arguments);

        }

        ControlResponse.CONSTRUCTOR_TYPE_ERROR = "Expected either an integer and boolean or an object";

        return (ControlResponse);
    }

);