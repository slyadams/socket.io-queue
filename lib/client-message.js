var Utils = require('./utils.js');
var Debug = require('debug');

var debug = new Debug('socket.io-queue:client-message');

function ClientMessage(sequence, data, ack) {

    if ((sequence == undefined || !Utils.isInt(sequence)) ||
        (data == undefined) ||
        (ack != undefined && typeof(ack) != typeof(Function))) {
        throw TypeError("Requires integer, data and optional ack callback");
    }

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
            _ack(_sequence);
            return true;
        }
    }

}
module.exports = ClientMessage;