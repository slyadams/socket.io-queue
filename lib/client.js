require('requirejs');
var io = require('socket.io-client');

var Client = function(url) {
  var socket = io(url);

  socket.on('connect', function() {
    console.log('Connected');
  });

  socket.on('data', function(data, ack) {
    console.log('Received data '+data.sequence + ", ack required=" + (ack ? 1 : 0));

    // execute user's callback

    // execute ack
    if (ack) {
        ack(data.sequence);
    }

  });

  socket.on('retransmit', function(data) {
    console.log("Will get retransmit from "+data.sequence);
  });

}

module.exports = Client;