var Connection = require('./lib/connection.js');
var Client = require('./lib/client.js');

module.exports = exports = function(type) {
    if (type == 'client') {
        return Client;
    } else if (type == 'server') {
        return Connection;
    } else {
        throw TypeError("Expected 'client' or 'server'");
    }
}
