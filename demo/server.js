// output buffer stats
function print_buffer_stats (connection, stats) {
		console.log(connection.getConnectionID() + ' :: Buffer size ' + stats.length + "/" + stats.size + " (" + stats.sent + " sent / "  + stats.unsent + " unsent)");
}

var Connection = require('../lib/connection.js');
var cli = require('commander');
var io = require('socket.io')();

cli
  .version('0.0.1')
  .option('-p, --port [port]', 'Port, default=8080')
  .option('-d, --delay [delay]', 'Data push delay in ms, default=500')
  .option('-b, --buffer_delay [buffer_delay]', 'Buffer display delay in ms, 0=no output, default=5000')
  .option('-w, --window_size [window_size]', 'Window size, default=5')
  .option('-s, --buffer_size [buffer_size]', 'Max buffer size, default=100')
  .parse(process.argv);

var port  = cli.port || 8080;
var data_delay = cli.delay || 500;
var buffer_display_delay = cli.buffer_delay || 5000;
var window_size = cli.window_size || 5;
var buffer_size = cli.buffer_size || 100;

var nsp = io.of('/nsp');
io.listen(port);

// you can pass in a parameter to control how often to push data

nsp.on('connection', function (socket) {
	var c = new Connection(socket, window_size, buffer_size);
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