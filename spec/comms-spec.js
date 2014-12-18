var Connection = require('../lib/connection.js');
var Client = require('../lib/client.js');

var io = require('socket.io')();

describe("Communication", function() {
  
  var nsp = io.of('/nsp');
  io.listen(8080);
  nsp.on('connection', function (socket) {
    var c = new Connection(socket, window_size, buffer_size);y
    console.log("connected");
    //socket.disconnect();
  });

  var client = new Client("ws://localhost:8080/nsp")

});