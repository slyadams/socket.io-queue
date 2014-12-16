require('requirejs');
var ClientMessage = require('./client-message.js');
var events = require('events');
var io = require('socket.io-client');


var Client = function(url) {

  // setup event listener
  events.EventEmitter.call(this);
  var self = this;
  var socket = io(url);

  // emit connect
  socket.on('connect', function() {
    self.emit('connect');
  });

  // emit data
  socket.on('data', function(data, ack) {
    self.emit('data', new ClientMessage(data.sequence, data.data, ack));
  });

  // emit retransmit
  socket.on('retransmit', function(data) {
    self.emit('retransmit', data);
  });

  // send retransmit message
  this.retransmit = function(sequence) {
    socket.emit("retransmit", { sequence: sequence});
  }

}

// inherit from EventEmitter
Client.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Client;