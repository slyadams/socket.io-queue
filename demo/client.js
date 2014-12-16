var Client = require('../lib/client.js');
var client = new Client('ws://localhost:8080/nsp');

client.on('connect', function() {
  console.log('Connected');
});

client.on('data', function(client_message) {
  console.log('Received data '+client_message.getSequence() + ", ack required=" + client_message.needsAck());
  setTimeout(function() {
    client_message.done();
  }, 1000);
});

client.on('retransmit', function(data) {
  console.log("Will get retransmit from "+data.sequence);
});

var s = process.stdin;
s.setRawMode(true);
s.setEncoding('utf8');

s.on('data', function (letter) {
//  if (letter == 'r') {
/*    var retransmit = last_sequence - 5;
    if (retransmit < 0) {
      retransmit = 0;
    }
    console.log("Asking for retransmission from " + retransmit);
    socket.emit("retransmit", { sequence: 0});
  }  */
  if (letter  == '\u0003') {
    process.exit();
  }
});