var Connection = require('../lib/connection.js');
var Client = require('../lib/client.js');
var io = require('socket.io')();

function pushData(connection, num_packets, counter) {
  if (counter <= num_packets) {
    connection.pushData(counter);
    setTimeout(function() {
      pushData(connection, num_packets, counter+1);
    }, 10);
  }
}

describe("Full communication", function() {
  var stubs, client, nsp, captured_data;

  beforeEach(function() {
    client = new Client("ws://localhost:8080/nsp");
    captured_data = [];
    stubs = {
        onData: function(sequence, data, needs_ack) {
          captured_data.push({ sequence: sequence, data: data, needs_ack: needs_ack });
        }
    };

    spyOn(stubs, 'onData').andCallThrough();
    
    client.on('data', function(client_message) {
      stubs.onData(client_message.getSequence(), client_message.getData(), client_message.needsAck());
      client_message.done();
    });

    nsp = io.of('/nsp');
    io.listen(8080);
  });

  afterEach(function() {
    client.close();
    io.close();
  });

  it("streams with acks", function() {

    var _buffer = 5,
        _window = 5,
        _num_packets = 100;

    runs(function() {
      nsp.on('connection', function (socket) {
        var connection = new Connection(socket, _window, _buffer);
        pushData(connection, _num_packets, 1);
      });
    });

    waitsFor(function() {
      return captured_data.length==_num_packets;
    }, "Timed out", 1000+(10*_num_packets));

    runs(function() {
      expect(captured_data.length).toBe(_num_packets);
      for (var i=1; i<=_num_packets; i++) {
        expect(stubs.onData).toHaveBeenCalledWith(i, i, i % _window == 0 ? true : false);
      }
    });

  });

});