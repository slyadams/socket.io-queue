describe("Index", function() {

    it("creates servers", function() {
        var server = require('../')('server');
        expect(server).toBeDefined();
    });

    it("creates clients", function() {
        var client = require('../')('client');
        expect(client).toBeDefined();

    });

    it("doesn't create anything else", function() {
        var cons = [function() {
                var obj = require('../');
                new a();
            },
            function() {
                var obj = require('../')('abc');
                new a();
            }
        ].forEach(function(f) {
            expect(f).toThrow()
        });
    });

});