var ControlResponse = require('../lib/control-response.js');

describe("Control Response", function() {

  // First form of constructor
  var cr = new ControlResponse({ control_id: 123, success: false});
  // Second form of constructor
  var cr2 = new ControlResponse(123, true);

  it("is created", function() {
    expect(cr).toBeDefined();
    expect(cr2).toBeDefined();
  });

  it("has content", function() {  
    expect(cr.getControlID()).toBe(123);
    expect(cr.getSuccess()).toBe(false);
    expect(cr2.getControlID()).toBe(123);
    expect(cr2.getSuccess()).toBe(true);
  });

  it("formats correctly", function() {  
    expect(cr.format()).toEqual({ control_id: 123, success: false});
    expect(cr2.format()).toEqual({ control_id: 123, success: true});
  });

});