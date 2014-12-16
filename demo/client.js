var io = require('socket.io-client');

var socket = io('ws://localhost:8080/nsp');
socket.on('connect', function() {
	console.log('Connected');
});

var last_sequence = 0;

var processData = function(data) {
  // plot point in chart or whatever
  // call some method 'engine.done()''
}

socket.on('data', function(data, callback) {
  console.log('Received data '+data.sequence + ", ack required=" + (callback ? 1 : 0));
  last_sequence = 0;
  if (data.sequence > last_sequence) {
    last_sequence = data.sequence;
  } 
  processData(data);

	if (callback) {
    console.log("Processing");

    // simulate a delay to show processing and the fact that the server stops sending
    setTimeout(function() {
		  callback(data.sequence);
    }, 2500);
  }
});

socket.on('retransmit', function(data) {
  console.log("Will get retransmit from "+data.sequence);
});

var s = process.stdin;
s.setRawMode(true);
s.setEncoding('utf8');

s.on('data', function (letter) {
  if (letter == 'r') {
    var retransmit = last_sequence - 5;
    if (retransmit < 0) {
      retransmit = 0;
    }
    console.log("Asking for retransmission from " + retransmit);
    socket.emit("retransmit", { sequence: 0});
  }  
  if (letter  == '\u0003') {
    process.exit();
  }
});