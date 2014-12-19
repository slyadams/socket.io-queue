var ControlResponse = require('../lib/control-response.js');

describe("Control Response", function() {

  // First form of constructor
  var cr = new ControlResponse({ control_id: 123, success: false});

  it("Control Response created", function() {
    expect(cr).toBeDefined();
  });

  it("Contents correct", function() {  
    expect(cr.getControlID()).toBe(123);
    expect(cr.getSuccess()).toBe(false);
  });

  it("Format correct", function() {  
    expect(cr.format()).toEqual({ control_id: 123, success: false});
  });

  // Second form of constructor
  var cr2 = new ControlResponse(123, true);

  it("Control Response created", function() {
    expect(cr2).toBeDefined();
  });

  it("Contents correct", function() {  
    expect(cr2.getControlID()).toBe(123);
    expect(cr2.getSuccess()).toBe(true);
  });

  it("Format correct", function() {  
    expect(cr2.format()).toEqual({ control_id: 123, success: true});
  });

});