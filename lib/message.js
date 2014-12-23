if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./utils.js'],

    function(Utils) {

        function Message(sequence, data) {

            if ((sequence == undefined || !Utils.isInt(sequence)) ||
                (data == undefined)) {
                throw TypeError("Expected integer and any");
            }

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
                if (typeof(sent) != 'boolean') {
                    throw TypeError("Expected boolean")
                }
                _sent = sent;
            }

            this.getSequence = function() {
                return _sequence;
            }

            this.getData = function() {
                return _data;
            }

        }

        return (Message);
    }
);