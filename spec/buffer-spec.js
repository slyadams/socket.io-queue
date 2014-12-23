var Buffer = require('../lib/buffer.js');
var Message = require('../lib/message.js');

describe("Buffer", function() {
    var b = new Buffer();
    var b2 = new Buffer(10);

    it("is created", function() {
        expect(b).toBeDefined();
        expect(b2).toBeDefined();
        var cons = [function() {
                new Buffer(-1);
            },
            function() {
                new Buffer(0.5);
            }
        ].
        forEach(function(f) {
            expect(f).toThrow()
        });
    });

    it("pushes messages", function() {
        b.push(new Message(100, {
            a: 10
        }));
        expect(b.getLength()).toBe(1);
        b.push(new Message(101, {
            a: 11
        }));
        expect(b.getLength()).toBe(2);
        var pushes = [function() {
            b2.push();
        }].
        forEach(function(f) {
            expect(f).toThrow()
        });
        expect(b2.getLength()).toBe(0);
    });

    it("gets messages", function() {
        var m = b.get(0);
        expect(m.getData()).toEqual({
            a: 10
        });
        expect(m.getSequence()).toBe(100);
        var m2 = b.get(1);
        expect(m2.getData()).toEqual({
            a: 11
        });
        expect(m2.getSequence()).toBe(101);

        expect(b.get(2)).toBe(undefined);
        expect(b.get(2.5)).toBe(undefined);
        expect(b.get(-2)).toBe(undefined);
    });

    it("shifts messages", function() {
        var m = b.shift();
        expect(b.getLength()).toBe(1);
        expect(m.getData()).toEqual({
            a: 10
        });
        expect(m.getSequence()).toBe(100);
        expect(b.shift()).toBeDefined();
        expect(b.shift()).toBe(undefined);
    });

    it("clears", function() {
        for (var i = 0; i < 20; i++) {
            b.push(new Message(i, "data"));
        }
        expect(b.getLength()).toBe(20);
        b.clear();
        expect(b.getLength()).toBe(0);
    });

    it("pushes many", function() {
        for (var i = 0; i < 20; i++) {
            b.push(new Message(i, "data"));
        }
        expect(b.getLength()).toBe(20);
    });

    it("sends messages", function() {
        for (var i = 0; i < 11; i++) {
            b.get(i).setSent(true);
            expect(b.get(i).getSent()).toBe(true);
        }
    });

    it("unsends messages", function() {
        var sents = [true, true, true, true, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        b.unSend(4);
        for (var i = 0; i < 20; i++) {
            expect(b.get(i).getSent()).toBe(sents[i]);
        }

        var unsends = [function() {
                b.unSend();
            },
            function() {
                b.unSend(undefined);
            },
            function() {
                b.unSend(-2);
            }
        ].
        forEach(function(f) {
            expect(f).toThrow()
        });

    });

    it("returns stats", function() {
        expect(b.getBufferStats()).toEqual({
            size: 100,
            length: 20,
            sent: 4,
            unsent: 16
        });
    });

    it("clears sequence", function() {
        b.clearSequence(4);
        expect(b.getLength()).toBe(15);
        for (var i = 0; i < b.getLength(); i++) {
            expect(b.get(i).getSequence()).toBe(i + 5);
        }

        var clears = [function() {
                b.clearSequence();
            },
            function() {
                b.clearSequence(undefined);
            },
            function() {
                b.clearSequence(-2);
            }
        ].
        forEach(function(f) {
            expect(f).toThrow()
        });
    });

    it("overflows", function() {
        for (var i = 0; i < 10; i++) {
            b2.push(new Message(i, "data"));
        }
        var overflowPush = function() {
            b2.push(new Message(i, "data"));
        }
        expect(b2.getBufferStats()).toEqual({
            size: 10,
            length: 10,
            sent: 0,
            unsent: 10
        });
        expect(overflowPush).toThrow();
    });

});