var Client = require('../')('client');

var cli = require('commander');

cli
    .version('0.0.1')
    .option('-u, --url [url]', 'URL to connect to, default="ws://localhost:8080/nsp"')
    .option('-d, --process_delay [process_delay]', 'How long to delay processing a message in ms, default=1000')
    .option('-t, --connect_timeout [connect_timeout]', 'How long to wait for a connection, default=5000')
    .option('-r, --reconnection [reconnection]', 'Whether to reconnect automatically, default=1')

.parse(process.argv);

var url = cli.url || 'ws://localhost:8080/';
var process_delay = cli.process_delay || 1000;
var opts = {
    "timeout": cli.connect_timeout || 5000,
    "reconnection": ((cli.reconnection == undefined) || cli.reconnection == "1") ? true : false,
}

var client;

try {
    client = new Client(url, opts);
} catch (e) {
    console.log("Error: " + e.message);
    process.exit();
}

var last_sequence = 0;

client.on('connect', function() {
    console.log('Connected');
});

client.on('connect_error', function(err) {
    console.log("Connection error '" + err + "'");
    process.exit();
});

client.on('disconnect', function() {
    console.log('Disconnected');
});

client.on('data', function(client_message) {
    console.log('Received data ' + client_message.getSequence() + ", ack required=" + client_message.needsAck());

    // simulate processing delay
    setTimeout(function() {
        last_sequence = client_message.getSequence();
        client_message.done();
    }, process_delay);
});

client.on('retransmit', function(data) {
    console.log("Will receive retransmit");
});

client.on('error', function(error) {
    console.log("Received error " + "(" + error.code + ":" + error.message + ")");
});

client.on('control', function(control) {
    console.log("Received control response " + "(" + control.format() + ")");
});

// create key handler
var stdIn = process.stdin;
stdIn.setRawMode(true);
stdIn.setEncoding('utf8');

stdIn.on('data', function(letter) {
    if (letter == 'r') {

    }
    switch (letter) {
        case 't':
            console.log("Asking for retransmission");
            client.retransmit();
            break;
        case 'p':
            console.log("Pausing");
            client.pause();
            break;
        case 'r':
            console.log("Resuming");
            client.resume();
            break;
        case 'd':
            console.log("Debugging");
            client.debug("debug data");
            break;

        case '1':
            client.setWindow(1);
            break;
        case '2':
            client.setWindow(2);
            break;
        case '3':
            client.setWindow(3);
            break;
        case '4':
            client.setWindow(4);
            break;
        case '5':
            client.setWindow(5);
            break;
        case '6':
            client.setWindow(6);
            break;
        case '7':
            client.setWindow(7);
            break;
        case '8':
            client.setWindow(8);
            break;
        case '9':
            client.setWindow(9);
            break;
        case '\u0003':
            process.exit();
            break;
    }
});