var Control = require('../lib/control.js');

describe("Control", function() {

    // First form of constructor
    var c1 = new Control({
        control: Control.WINDOW,
        control_id: 12,
        control_parameters: {
            a: 1,
            b: "string",
            c: true
        }
    });
    var c2 = new Control({
        control: Control.WINDOW,
        control_id: 23
    });
    // Second form of constructor
    var c3 = new Control(Control.WINDOW, 34, {
        a: 2,
        b: "another_string",
        c: false
    });
    var c4 = new Control(Control.WINDOW, 45);

    it("is created", function() {
        expect(c1).toBeDefined();
        expect(c2).toBeDefined();
        expect(c3).toBeDefined();
        expect(c4).toBeDefined();

        var cons = [function() {
                new Control();
            },
            function() {
                new Control(1);
            },
            function() {
                new Control(undefined, 1);
            },
            function() {
                new Control({});
            },
            function() {
                new Control({
                    control: 1
                });
            },
            function() {
                new Control({
                    control_id: 1
                });
            },
            function() {
                new Control({
                    control: 'string',
                    control_id: 1
                });
            },
            function() {
                new Control({
                    control: 1,
                    control_id: false
                });
            }
        ].forEach(function(f) {
            expect(f).toThrow()
        });
    });

    it("has contents", function() {
        expect(c1.getControl()).toBe(Control.WINDOW);
        expect(c1.getControlID()).toBe(12);
        expect(c1.getControlParameters()).toEqual({
            a: 1,
            b: "string",
            c: true
        });

        expect(c2.getControl()).toBe(Control.WINDOW);
        expect(c2.getControlID()).toBe(23);
        expect(c2.getControlParameters()).toBe(undefined);

        expect(c3.getControl()).toBe(Control.WINDOW);
        expect(c3.getControlID()).toBe(34);
        expect(c3.getControlParameters()).toEqual({
            a: 2,
            b: "another_string",
            c: false
        });

        expect(c4.getControl()).toBe(Control.WINDOW);
        expect(c4.getControlID()).toBe(45);
        expect(c4.getControlParameters()).toBe(undefined);
    });

    it("formats requests", function() {
        expect(c1.getRequest()).toEqual({
            control: Control.WINDOW,
            control_id: 12,
            control_parameters: {
                a: 1,
                b: "string",
                c: true
            }
        });
        expect(c2.getRequest()).toEqual({
            control: Control.WINDOW,
            control_id: 23,
            control_parameters: undefined
        });
        expect(c3.getRequest()).toEqual({
            control: Control.WINDOW,
            control_id: 34,
            control_parameters: {
                a: 2,
                b: "another_string",
                c: false
            }
        });
        expect(c4.getRequest()).toEqual({
            control: Control.WINDOW,
            control_id: 45,
            control_parameters: undefined
        });
    });

    it("formats responses", function() {
        expect(c1.getResponse(true)).toEqual({
            control_id: 12,
            success: true
        });
        expect(c1.getResponse(false)).toEqual({
            control_id: 12,
            success: false
        });
        expect(c2.getResponse(true)).toEqual({
            control_id: 23,
            success: true
        });
        expect(c2.getResponse(false)).toEqual({
            control_id: 23,
            success: false
        });
        expect(c3.getResponse(true)).toEqual({
            control_id: 34,
            success: true
        });
        expect(c3.getResponse(false)).toEqual({
            control_id: 34,
            success: false
        });
        expect(c4.getResponse(true)).toEqual({
            control_id: 45,
            success: true
        });
        expect(c4.getResponse(false)).toEqual({
            control_id: 45,
            success: false
        });
    });

});