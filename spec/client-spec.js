var Client = require('../lib/client.js');
var Control = require('../lib/control.js');

function _checkControlResult(socket, controlObj, control, controlParameters) {
    expect(controlObj.getControlID()).toBeDefined();
    expect(controlObj.getControl()).toBe(control);

    expect(socket.emit).toHaveBeenCalledWith('control', {
        control: control,
        control_id: controlObj.getControlID(),
        control_parameters: controlParameters
    });

}

describe("Client", function() {

    var socket, c = null;
    beforeEach(function() {
        socket = {
            emit: function(channel, data) {},
            disconnect: function() {},
            on: function(event) {},
            close: function(event) {},
        };

        spyOn(socket, 'emit');
        spyOn(socket, 'disconnect');
        spyOn(socket, 'on');
        spyOn(socket, 'close');
        c = new Client('', socket);
    });

    it("is created", function() {
        expect(c).toBeDefined();
        var cons = [function() {
                new Client();
            },
            function() {
                new Client(12);
            },
            function() {
                new Client('url', 'string');
            }
        ].
        forEach(function(f) {
            expect(f).toThrow()
        });
    });

    it("closes", function() {
        c.close();
        expect(socket.close).toHaveBeenCalled();
    });

    it("retransmits", function() {
        c.retransmit();
        expect(socket.emit).toHaveBeenCalledWith('retransmit');
    });

    it("pauses", function() {
        var control = c.pause();
        _checkControlResult(socket, control, Control.PAUSE, undefined);
    });

    it("resumes", function() {
        var control = c.resume();
        _checkControlResult(socket, control, Control.RESUME, undefined);
    });

    it("sets window", function() {
        var control = c.setWindow(10);
        _checkControlResult(socket, control, Control.WINDOW, {
            size: 10
        });

        var sets = [function() {
                c.setWindow();
            },
            function() {
                c.setWindow(undefined);
            },
            function() {
                c.setWindow(-2);
            },
            function() {
                c.setWindow(4.5);
            }
        ].
        forEach(function(f) {
            expect(f).toThrow()
        });
    });

});