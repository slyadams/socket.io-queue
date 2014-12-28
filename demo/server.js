// pretty console print
function consolePrint(conn, data) {
    console.log(conn.getConnectionID() + "::" + data);
}

// output buffer stats
function print_buffer_stats(conn, stats) {
    consolePrint(conn, "Buffer size " + stats.length + "/" + stats.size + " (" + stats.sent + " sent / " + stats.unsent + " unsent)");
}

var Connection = require('../')('server');
var io = require('socket.io')();
var cli = require('commander');

cli
    .version('0.0.1')
    .option('-p, --port [port]', 'Port, default=8080')
    .option('-d, --delay [delay]', 'Data push delay in ms, default=500')
    .option('-b, --buffer_delay [buffer_delay]', 'Buffer display delay in ms, 0=no output, default=5000')
    .option('-w, --window_size [window_size]', 'Window size, default=5')
    .option('-s, --buffer_size [buffer_size]', 'Max buffer size, default=100')
    .parse(process.argv);

var port = cli.port || 8080;
var data_delay = cli.delay || 500;
var buffer_display_delay = cli.buffer_delay || 5000;
var window_size = cli.window_size || 5;
var buffer_size = cli.buffer_size || 100;

//var nsp = io.of('/');
io.listen(port);

// you can pass in a parameter to control how often to push data

io.on('connection', function(socket) {
    var conn = new Connection(socket, window_size, buffer_size);

    conn.on('ack', function(sequence) {
        consolePrint(conn, "Received ack " + sequence);
    });

    conn.on('retransmit', function() {
        consolePrint(conn, "Retransmit requested");
    });

    conn.on('debug', function(data) {
        consolePrint(conn, "Debug (" + data + ")");
    });

    conn.on('control', function(control) {
        consolePrint(conn, "Received control (" + control.getRequest() + ")");
    });

    conn.on('disconnect', function() {
        consolePrint(conn, "Disconnected");
    });

    var push_data_timer = setInterval(function() {
        if (socket.connected) {
            conn.pushData({
                a: "test"
            });
        } else {
            clearInterval(push_data_timer);
        }
    }, data_delay);

    if (buffer_display_delay > 0) {
        var buffer_print_timer = setInterval(function() {
            if (socket.connected) {
                print_buffer_stats(conn, conn.getBuffer().getBufferStats());
            } else {
                clearInterval(buffer_print_timer);
            }
        }, buffer_display_delay);
    }
});