var ClientMessage = require('../lib/client-message.js');

describe("Client Message tests", function() {
  var m = new ClientMessage(101, {a: 1});

  it("Client message created", function() {
    expect(m).toBeDefined();
  });

  it("No ack", function() {
    expect(m.needsAck()).toBe(false);
  });

  it("Sequence set correctly", function() {
    expect(m.getSequence()).toBe(101);
  });

  it("Data defined", function() {
    expect(m.getData()).toBeDefined();
  });

  it("No ack done fires", function() {
    expect(m.done()).toBe(undefined);
  });

  var m2 = new ClientMessage(101, {a: 1}, function() { return 123;});

  it("Ack", function() {
    expect(m2.needsAck()).toBe(true);
  });

  it("Ack done fires", function() {
    expect(m2.done()).toBe(123);
  });

});