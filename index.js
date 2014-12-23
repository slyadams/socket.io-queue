if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./lib/connection.js', './lib/client.js'],

    function(Connection, Client) {
        var constructor = function(type) {
            if (type == 'client') {
                return Client;
            } else if (type == 'server') {
                return Connection;
            } else {
                console.log("Don't recognize type " + type);
                throw TypeError("Expected 'client' or 'server'");
            }
        }

        return constructor;
    }

);