require('requirejs');
var ClientMessage = require('./client-message.js');
var events = require('events');
var io = require('socket.io-client');
var debug = require('debug')('socket.io-queue:client')

var Client = function(url, socket) {

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

  /* core socket handlers */
  // emit connect
  _socket.on('connect', function() {
    debug("Connected to "+url);
    self.emit('connect');
  });

  // emit disconnect
  _socket.on('disconnect', function() {
    debug("Disconnected from "+url);
    self.emit('disconnect');
  });

  /* data channel handlers */
  // emit data
  _socket.on('data', function(data, ack) {
    debug("Received data "+data.sequence + ", ack required: "+ ack ? true : false);
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
  _socket.on('debug', function (data) {
    debug(data);
  });

  /* control channel handlers */
  // debug channel
  _socket.on('control', function (control) {
    //debug(control);
  });

}

// inherit from EventEmitter
Client.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Client;