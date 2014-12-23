var Client = require('../../../')('client');
var client = new Client('ws://localhost:8080/nsp');

client.on('data', function(client_message) {
    console.log("Received data " + client_message.getSequence());
    client_message.done();
});