var Buffer = require('../lib/buffer.js');
var Message = require('../lib/message.js');

describe("Buffer tests", function() {
  var b = new Buffer();

  it("Buffer created", function() {
    expect(b).toBeDefined();
  });

  it("Push message", function() {
    b.push(new Message(100, {a:10}));
    expect(b.getLength()).toBe(1);
    b.push(new Message(101, {a:11}));
    expect(b.getLength()).toBe(2);
  });

  it("Getting message", function() {
    var m = b.get(0);
    expect(m.getData()).toEqual({a:10});
    expect(m.getSequence()).toBe(100);
    m = b.get(1);
    expect(m.getData()).toEqual({a:11});
    expect(m.getSequence()).toBe(101);

  });

  it("Shift message", function() {
    var m = b.shift();
    expect(b.getLength()).toBe(1);
    expect(m.getData()).toEqual({a:10});
    expect(m.getSequence()).toBe(100);
  });


  it("Clear buffer", function() {
    b.clear();
    expect(b.getLength()).toBe(0);
  });

  it("Push many", function() {
    for (var i=0; i<20; i++) {
      b.push(new Message(i, "data"));
    }
    expect(b.getLength()).toBe(20);
  });

  it("Send some", function() {
    for (var i=0; i<11; i++) {
      b.get(i).setSent(true);
      expect(b.get(i).getSent()).toBe(true);
    }
  });

  it("Unsend some", function() {
    var sents = [true, true, true, true, false, false, false, false, false, false,
                 false, false, false, false, false, false, false, false, false, false];
    b.unSend(4);
    for (var i=0; i<20; i++) {
      expect(b.get(i).getSent()).toBe(sents[i]);
    }
  });

  it("Buffer stats", function() {
      expect(b.getBufferStats()).toEqual({length: 20, sent: 4, unsent: 16});
  });

  it("Clear sequence", function() {
    b.clearSequence(4);
    expect(b.getLength()).toBe(15);
    for (var i=0; i<b.getLength(); i++) {
      expect(b.get(i).getSequence()).toBe(i+5);
    }
  });

});