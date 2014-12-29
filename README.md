# socket.io-queue

socket-io-queue is a windowed, acknowledgement based message queue using socket.io as a transport. It uses a 
configurable buffer and window and supports retransmits, pausing and resuming. The server module runs in Node and the client module can be used either in Node or in a browser (e.g. using Browserify). 

## How to use

To create a message server:

```js
var Connection = require('require('./')('server');
var io = require('socket.io')();
io.on('connection', function(socket){
  var connection = new Connection(socket, window_size, buffer_size);
});
io.listen(9876);
```

To create a client:

```js
var Client = require('.')('client');
var client = new Client('ws://localhost:9876', {});
```

##API

###Client

Exposed by `require('/.')('client')`.

###Server

Exposed by `require('/.')('server')`.

##Events

The client and server modules emit events.

###Client         
          

* `connect` on client connect
* `disconnect` on client disconnect
* `data` on receipt of a data message, with parameter
** `data_obj` the data object received
* `error` on receipt of an error message, with parameter
** `error_obj` the error object received
* `debug` on receipt of a debug message, with parameter
** `debug_obj` the debug object received
* `control` on receipt of a control response message (i.e. response to a control request), with parameter
** `control_response_obj` the control response object received

###Server

* `disconnect` on client disconnect
* `ack` on receipt of an acknowledgment, with parameter
** `sequence` the sequence number which the client is acknowledging
* `control` on receipt of a control message
** `control_response_obj` the control object received
* `debug` on receipt of a debug message, with parameter
** `debug_obj` the debug object received