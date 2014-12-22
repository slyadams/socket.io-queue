var Message = require('../lib/message.js');

describe("Message", function() {
  var m = new Message(101, {a: 7, b: true, c: "string", d: [10,11,12], e: { f: 8}});

  it("is created", function() {
    expect(m).toBeDefined();


   var cons = [function() { new Message(); },
               function() { new Message(1); },
               function() { new Message(0.5, 'string'); },
               function() { new Message(undefined, 'string'); }
              ].forEach(function(f) { expect(f).toThrow() });
  });

  it("defaults correctly", function() {
    expect(m.getSent()).toBe(false);
  });

  it("sends", function() {
    m.setSent(true);
    expect(m.getSent()).toBe(true);
    m.setSent(false);
    expect(m.getSent()).toBe(false);

    var sets = [function() { m.setSent('string') },
                function() { m.setSent(1) },
                function() { m.setSent() }
               ].forEach(function(f) { expect(f).toThrow() });
  });

  it("sets sequence", function() {
    expect(m.getSequence()).toBe(101);
  });

  it("has data", function() {
    expect(m.getData()).toBeDefined();
    expect(m.getData().a).toBe(7);
    expect(m.getData().b).toBe(true);
    expect(m.getData().c).toBe("string");
    expect(m.getData().d).toEqual([10,11,12]);
    expect(m.getData().e).toEqual({f: 8});
  });

});