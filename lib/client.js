require('requirejs');
var ClientMessage = require('./client-message.js');
var events = require('events');
var io = require('socket.io-client');
var debug = require('debug')('socket.io-queue:client')

var Client = function(url) {

  // setup event listener
  events.EventEmitter.call(this);
  var self = this;
  var socket = io(url);
  var _ignore_retransmit_errors = false;


  this.setIgnoreRetransmitErrors = function(ignore_retransmit_errors) {
    _ignore_retransmit_errors = ignore_retransmit_errors;
  }

  this.setIgnoreRetransmitErrors = function(ignore_retransmit_errors) {
    return _ignore_retransmit_errors;
  }

  // emit connect
  socket.on('connect', function() {
    debug("Connected to "+url);
    self.emit('connect');
  });

  // emit disconnect
  socket.on('disconnect', function() {
    debug("Disconnected from "+url);
    self.emit('disconnect');
  });

  // emit data
  socket.on('data', function(data, ack) {
    debug("Received data "+data.sequence + ", ack required: "+ ack ? true : false);
    self.emit('data', new ClientMessage(data.sequence, data.data, ack));
  });

  // emit control
  socket.on('control', function(data) {
    debug("Received control " + data.type + "(" + data.code + ") : " + data.name);
    self.emit('control', data);
  });


  // emit retransmit
  socket.on('retransmit', function(data) {
    debug("Will receive retransmit from "+data.sequence+" from request of "+data.request);
    if (data.sequence != data.request) {
      if (!_ignore_retransmit_errors) {
        debug("Retransmit error which cannot be ignored, closing socket");
        self.emit('retransmit_error', data, false);
        socket.disconnect();
      } else {
        debug("Retransmit error which can be ignored");
        self.emit('retransmit_error', data, true);
      }
    } else {
      self.emit('retransmit', data);
     }
  });

  // send retransmit message
  this.retransmit = function(sequence) {
    debug("Will request retransmit from  "+sequence);
    socket.emit("retransmit", { sequence: sequence});
  }

}

// inherit from EventEmitter
Client.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Client;