var ClientMessage = require('../lib/client-message.js');

describe("Client Message", function() {
  var m = new ClientMessage(101, {a: 1});
  var m2 = new ClientMessage(101, {a: 1}, function() { return 123;});

  it("is created", function() {
    expect(m).toBeDefined();
    expect(m2).toBeDefined();


    var cons = [function() { new ClientMessage(); }, 
                function() { new ClientMessage(0.5); },
                function() { new ClientMessage(1); },
                function() { new ClientMessage(1, 3, 'string'); }].
              forEach(function(f) { expect(f).toThrow() });
  });

  it("will ack", function() {
    expect(m2.needsAck()).toBe(true);
  });

  it("will not ack", function() {
    expect(m.needsAck()).toBe(false);
  });

  it("acks", function() {
    expect(m2.done()).toBe(123);
  });

  it("doesn't ack", function() {
    expect(m.done()).toBe(undefined);
  });

  it("sets sequence", function() {
    expect(m.getSequence()).toBe(101);
  });

  it("has data", function() {
    expect(m.getData()).toBeDefined();
  });

});