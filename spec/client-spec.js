var Client = require('../lib/client.js');


describe("Client tests", function() {

  var socket, c = null;
  beforeEach(function() {
    socket = {
      emit: function(channel, data) {}, 
      disconnect: function() {},
      on: function(event) {},
    };

    spyOn(socket, 'emit');
    spyOn(socket, 'disconnect');
    spyOn(socket, 'on');
    c = new Client('', socket);
  });

  it("Client created", function() {
    expect(c).toBeDefined();
  });

  it("Retransmit", function() {
    c.retransmit();
    expect(socket.emit).toHaveBeenCalledWith('retransmit');
  });

});