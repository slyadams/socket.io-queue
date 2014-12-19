var Control = require('../lib/control.js');

describe("Control tests", function() {

  // First form of constructor
  var c = new Control({ control: Control.WINDOW, control_id: 123, control_parameters: { a: 1, b: "string", c: true}});

  it("Control created", function() {
    expect(c).toBeDefined();
  });

  it("Contents correct", function() {
    expect(c.getControl()).toBe(Control.WINDOW);
    expect(c.getControlID()).toBe(123);
    expect(c.getControlParameters()).toEqual({ a: 1, b: "string", c: true});
  });

  it("Requests correct", function() {
    expect(c.getRequest()).toEqual({ control: Control.WINDOW, control_id: 123, control_parameters: { a: 1, b: "string", c: true}});
  });

  it("Responses correct", function() {
    expect(c.getResponse(true)).toEqual({ control_id: 123, success: true});
    expect(c.getResponse(false)).toEqual({ control_id: 123, success: false});
  });


  // Second form of constructor
  var c2 = new Control(Control.WINDOW, 123, { a: 1, b: "string", c: true});

  it("Control created", function() {
    expect(c2).toBeDefined();
  });

  it("Contents correct", function() {
    expect(c2.getControl()).toBe(Control.WINDOW);
    expect(c2.getControlID()).toBe(123);
    expect(c2.getControlParameters()).toEqual({ a: 1, b: "string", c: true});
  });

  it("Requests correct", function() {
    expect(c2.getRequest()).toEqual({ control: Control.WINDOW, control_id: 123, control_parameters: { a: 1, b: "string", c: true}});
  });

  it("Responses correct", function() {
    expect(c2.getResponse(true)).toEqual({ control_id: 123, success: true});
    expect(c2.getResponse(false)).toEqual({ control_id: 123, success: false});
  });

});