//todo: clever debugging, tests, make client module

// output buffer stats
function print_buffer_stats (connection, stats) {
		console.log(connection.getConnectionID() + ' :: Buffer size ' + stats.length + " (" + stats.sent + " sent / "  + stats.unsent + " unsent)");
}

var Connection = require('../lib/connection.js');
var cli = require('commander');
var io = require('socket.io')();

cli
  .version('0.0.1')
  .option('-p, --port [port]', 'Port')
  .option('-d, --delay [delay]', 'Data push delay in ms')
  .option('-b, --buffer_delay [buffer_delay]', 'Buffer display delay in ms, 0=no output')
  .parse(process.argv);

var port  = cli.port || 8080;
var data_delay = cli.delay || 500;
var buffer_display_delay = cli.buffer_delay || 5000;

var nsp = io.of('/nsp');
io.listen(port);

// you can pass in a parameer to control how often to push data

nsp.on('connection', function (socket) {
	var c = new Connection(socket);
	var push_data_timer = setInterval(function() { 
		if (socket.connected) {
			c.push_data({a: "test"});
		} else {
			clearInterval(push_data_timer);
		}
	}, data_delay);

	if (buffer_display_delay > 0) {
		var buffer_print_timer = setInterval(function() {
			if (socket.connected) {
				print_buffer_stats(c, c.getBuffer().getBufferStats()); 
			} else {
				clearInterval(buffer_print_timer);
			}
		}, buffer_display_delay);
	}
});