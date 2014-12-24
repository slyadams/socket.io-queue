var ControlResponse = require('./control-response.js');
var Control = require('./control.js');
var events = require('events');
var Debug = require('debug');
var Utils = require('./utils');
var ClientMessage = require('./client-message.js');
var io = require('socket.io-client');


var debug = new Debug('socket.io-queue:client');

function Client(url, socket) {

    if ((url == undefined || typeof(url) != 'string') ||
        (socket != undefined && typeof(socket) != 'object')) {
        throw TypeError("Expected string and optionally a socket");
    }

    // setup event listener
    events.EventEmitter.call(this);
    var self = this;
    var _socket = socket || io(url);
    var _ignoreRetransmitErrors = false;

    this.setIgnoreRetransmitErrors = function(ignoreRetransmitErrors) {
        _ignoreRetransmitErrors = ignoreRetransmitErrors;
    }

    this.setIgnoreRetransmitErrors = function(ignoreRetransmitErrors) {
        return _ignoreRetransmitErrors;
    }

    // send retransmit message
    this.retransmit = function() {
        debug("Will request retransmit");
        _socket.emit("retransmit");
    }

    this.setWindow = function(size) {
        if (size == undefined || !Utils.isInt(size) || size <= 0) {
            throw TypeError("Expected positive integer");
        }

        var control = new Control(Control.WINDOW, Client.controlID++, {
            size: size
        });
        debug("Setting window size " + size);
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.pause = function() {
        var control = new Control(Control.PAUSE, Client.controlID++);
        debug("Pausing");
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.resume = function() {
        var control = new Control(Control.RESUME, Client.controlID++);
        debug("Resuming");
        _socket.emit('control', control.getRequest());
        return control;
    }

    this.debug = function(data) {
        debug("Sending debug (" + data + ")");
        _socket.emit('debug', data);
    }

    this.close = function() {
        _socket.close();
    }

    /* core socket handlers */
    // emit connect
    _socket.on('connect', function() {
        debug("Connected to " + url);
        self.emit('connect');
    });

    // emit disconnect
    _socket.on('disconnect', function() {
        debug("Disconnected from " + url);
        self.emit('disconnect');
    });

    /* data channel handlers */
    // emit data
    _socket.on('data', function(data, ack) {
        debug("Received data " + data.sequence + ", ack required: " + ack ? true : false);
        self.emit('data', new ClientMessage(data.sequence, data.data, ack));
    });


    /* retransmit channel handlers */
    // emit retransmit
    _socket.on('retransmit', function() {
        debug("Will receive retransmit");
        self.emit('retransmit');
    });

    /* error channel handlers */
    // emit error
    _socket.on('err', function(error) {
        debug("Received error " + "(" + error.code + ":" + error.message + ")");
        self.emit('error', error);
    });

    /* debug channel handlers */
    // debug channel
    _socket.on('debug', function(data) {
        debug("Debug: " + data);
        self.emit('debug', data);
    });

    /* control channel handlers */
    // debug channel
    _socket.on('control', function(control) {
        var controlResponse = new ControlResponse(control);
        debug("Received control response " + "(" + controlResponse.getControlID() + ":" + controlResponse.getSuccess() + ")");
        self.emit('control', controlResponse);
    });

}

Client.controlID = 0;

// inherit from EventEmitter
Client.prototype.__proto__ = events.EventEmitter.prototype;
module.exports = Client;