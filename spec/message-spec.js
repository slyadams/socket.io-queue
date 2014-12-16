var Message = require('../lib/message.js');

describe("Message tests", function() {
  var m = new Message(101, {a: 7, b: true, c: "string", d: [10,11,12], e: { f: 8}});

  it("Message created", function() {
    expect(m).toBeDefined();
  });

  it("Sent default to false", function() {
    expect(m.getSent()).toBe(false);
  });

  it("Set Sent", function() {
    m.setSent(true);
    expect(m.getSent()).toBe(true);
    m.setSent(false);
    expect(m.getSent()).toBe(false);
  });

  it("Sequence set correctly", function() {
    expect(m.getSequence()).toBe(101);
  });

  it("Data defined", function() {
    expect(m.getData()).toBeDefined();
  });

  it("Data correct", function() {
    expect(m.getData().a).toBe(7);
    expect(m.getData().b).toBe(true);
    expect(m.getData().c).toBe("string");
    expect(m.getData().d).toEqual([10,11,12]);
    expect(m.getData().e).toEqual({f: 8});
  });

});