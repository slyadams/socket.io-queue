var Client = require('../lib/client.js');

var cli = require('commander');

cli
  .version('0.0.1')
  .option('-u, --url [url]', 'URL to connect to, default="ws://localhost:8080/nsp"')
  .option('-i, --ignore_retransmit_error [buffer_delay]', 'Whether to ignore retransmit errors, default=0')
  .option('-d, --process_delay [process_delay]', 'How long to delay processing a message in ms, default=1000')
  .parse(process.argv);

var url  = cli.url || 'ws://localhost:8080/nsp';
var process_delay = cli.process_delay || 1000;
var client = new Client(url);
if (cli.ignore_retransmit_error) {
  client.setIgnoreRetransmitErrors(true);
}

// create key handler
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

client.on('connect', function() {
  console.log('Connected');
});

client.on('disconnect', function() {
  console.log('Disconnected');
});

var last_sequence = 0;
client.on('data', function(client_message) {
  console.log('Received data '+client_message.getSequence() + ", ack required=" + client_message.needsAck());

  // simulate processing delay
  setTimeout(function() {
    last_sequence = client_message.getSequence();
    client_message.done();
  }, process_delay);
});

client.on('retransmit', function(data) {
  console.log("Will request retransmit");
});

client.on('error', function(error) {
  console.log("Received error " + "(" + error.code + ":" + error.message + ")");
});

/*client.on('retransmit_error', function(data, can_continue) {
  console.log('Retransmit errors '+can_continue);
  if (!can_continue) {
    process.exit();
  }
});*/

// setup key handlers to send retransmit requests
stdin.on('data', function (letter) {
  if (letter == 'r') {
      console.log("Asking for retransmission");
      client.retransmit();
  }
  if (letter  == '\u0003') {
    process.exit();
  }
});