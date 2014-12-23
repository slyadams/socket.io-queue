var Connection = require('../lib/connection.js');

describe("Connection", function() {

    var socket, c = null;
    beforeEach(function() {
        socket = {
            emit: function(channel, data) {},
            disconnect: function() {},
            on: function(event) {},
        };

        spyOn(socket, 'emit');
        spyOn(socket, 'disconnect');
        spyOn(socket, 'on');
        c = new Connection(socket, 5, 10);
    });

    it("is created", function() {
        expect(c).toBeDefined();

        var cons = [function() {
            new Connection();
        }].
        forEach(function(f) {
            expect(f).toThrow()
        });
    });

    it("has correct window size", function() {
        expect(c.getWindowSize()).toBe(5);
    });

    it("has buffer", function() {
        expect(c.getBuffer()).toBeDefined();
        expect(c.getBuffer().getBufferStats().size).toBe(10);
    });

    it("doesn't send when empty", function() {
        socket.on.reset();

        var pushes = [function() {
            c.pushData();
        }].
        forEach(function(f) {
            expect(f).toThrow()
        });

        c.sendData();
        expect(socket.emit).not.toHaveBeenCalled();
        expect(socket.on).not.toHaveBeenCalled();
        expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it("sends single buffer message", function() {
        socket.on.reset();
        socket.emit.reset();
        c.pushData({
            a: 1
        });
        expect(socket.emit).toHaveBeenCalledWith('data', {
            sequence: 1,
            data: {
                a: 1
            }
        }, null);
        expect(socket.on).not.toHaveBeenCalled();
        expect(socket.disconnect).not.toHaveBeenCalled();
    });

    it("sends multiple messages", function() {
        socket.on.reset();
        socket.emit.reset();

        // push initial messages
        for (var i = 1; i <= 3; i++) {
            c.pushData({
                a: i
            });
            expect(socket.emit).toHaveBeenCalledWith('data', {
                sequence: i,
                data: {
                    a: i
                }
            }, i % 5 == 0 ? jasmine.any(Function) : null);
        }

        // retransmit part of initial window
        socket.emit.reset();
        c.retransmit();
        for (var i = 1; i <= 3; i++) {
            expect(socket.emit).toHaveBeenCalledWith('data', {
                sequence: i,
                data: {
                    a: i
                }
            }, i % 5 == 0 ? jasmine.any(Function) : null);
        }

        // push more packets
        for (var i = 4; i <= 8; i++) {
            c.pushData({
                a: i
            });
            if (i <= 5) {
                expect(socket.emit).toHaveBeenCalledWith('data', {
                    sequence: i,
                    data: {
                        a: i
                    }
                }, i % 5 == 0 ? jasmine.any(Function) : null);
            } else {
                expect(socket.emit).not.toHaveBeenCalledWith('data', {
                    sequence: i,
                    data: {
                        a: i
                    }
                }, null);
            }
        }

        // invalid ack
        socket.emit.reset();
        c.receiveAck(2);
        expect(socket.emit).not.toHaveBeenCalled();

        // blank ack
        socket.emit.reset();
        var acks = [function() {
            c.receiveAck();
        }].
        forEach(function(f) {
            expect(f).toThrow()
        });
        expect(socket.emit).not.toHaveBeenCalled();

        // valid ack
        socket.emit.reset();
        c.receiveAck(5)
        for (var i = 6; i <= 8; i++) {
            expect(socket.emit).toHaveBeenCalledWith('data', {
                sequence: i,
                data: {
                    a: i
                }
            }, i % 5 == 0 ? jasmine.any(Function) : null);
        }

        // retransmit part of a window
        socket.emit.reset();
        c.retransmit();
        for (var i = 6; i <= 8; i++) {
            expect(socket.emit).toHaveBeenCalledWith('data', {
                sequence: i,
                data: {
                    a: i
                }
            }, i % 5 == 0 ? jasmine.any(Function) : null);
        }

        // push rest of the window
        socket.emit.reset();
        for (var i = 9; i <= 10; i++) {
            c.pushData({
                a: i
            });
            expect(socket.emit).toHaveBeenCalledWith('data', {
                sequence: i,
                data: {
                    a: i
                }
            }, i % 5 == 0 ? jasmine.any(Function) : null);
        }

        // retransmit full window
        socket.emit.reset();
        c.retransmit();
        for (var i = 6; i <= 10; i++) {
            expect(socket.emit).toHaveBeenCalledWith('data', {
                sequence: i,
                data: {
                    a: i
                }
            }, i % 5 == 0 ? jasmine.any(Function) : null);
        }

        expect(socket.on).not.toHaveBeenCalled();
        expect(socket.disconnect).not.toHaveBeenCalled();
    });

});