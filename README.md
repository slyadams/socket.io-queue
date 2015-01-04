# socket.io-queue

socket-io-queue is a windowed, acknowledgement based message queue using socket.io as a transport. It uses a 
configurable buffer and window and supports retransmits, pausing and resuming. The server module runs in Node and the client module can be used either in Node or in a browser (e.g. using Browserify). 

The queue is acknlowdgement based in that if the server sends a certain number of messages (known as the `window`, which is configurable by the user) without receiving an acknlowledgement from the client. When the client sends an acknowledgement is received, if the server is waiting it will resume sending messages, if the server isn't waiting it updates to internally reset the window. During operation the server buffers messages which are cleared once an appropriate acknlowedgement is recevied. The size of this buffer is configurable by the user and once the buffer fills up, the connection is closed and an error event emitted in the server.

The queue allows for the easy implementation of client/server architecture with intelligent flow control based on the rate at which the client can process messages.

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

* `Client(url, opts)` constructs the client module using parameters
    * `url` defines the URL to connect to
    * `opts` (optional) an optional set of parameters which are passed to the socket.io client constructor
* `retransmit()` requests the server to retransmit all messages since the client last sent an acknowledgement
* `setWindow(windowSize)` requests the server to change the window size to `windowSize`
* `pause()` requests the server to pause the stream
* `resume()` requests the server to resume the stream
* `isConnected()` returns whether the client is currently connected
* `close()` closes the client
* `debug(debugObj)` sends `debugObj` to the server using the debug channel 

###Server

Exposed by `require('/.')('server')`.

* `Connection(socket, windowSize, maxBufferSize)` constructs the client module using parameters
    * `socket` a socket.io server socket
    * `windowSize` the initial acknowledgement window size
    * `maxBufferSize` the server's buffer size
* `getConnectionID()` returns a unique internal connection identifier
* `getWindowSize()` returns the current acknowledgement window size
* `isWaiting()` returns whether the server is currently waiting on an acknowledgement before sending more data
* `isPaused()` returns whether the stream is currently paused
* `pushData(dataObj)` pushes `dataObj` into the server's send buffer

##Events

The client and server modules emit events.

###Client         
          
* `connect` on client connect
* `disconnect` on client disconnect
* `data` on receipt of a data message, with parameter
    * `client_message` a Client Message object which has methods
        * `getData` returns the user data sent from the server
        * `getSequence` returns the sequence number of the message
        * `needsAck` returns whether the server requires an acknlowedgement for this message (note that the user shouldn't care about this, and should just use the `done` method)
        * `done` should be called when the client has finished processing the message, internally this will, if required, send an acknowledgement to the server
* `error` on receipt of an error message, with parameter
    * `error_obj` the error object received
* `debug` on receipt of a debug message, with parameter
    * `debug_obj` the debug object received
* `control` on receipt of a control response message (i.e. response to a control request), with parameter
    * `control_response_obj` the control response object received

###Server

* `disconnect` on client disconnect
* `ack` on receipt of an acknowledgment, with parameter
    * `sequence` the sequence number which the client is acknowledging
* `control` on receipt of a control message
    * `control_response_obj` the control object received
* `debug` on receipt of a debug message, with parameter
    * `debug_obj` the debug object received

##Future Plans

Plans to add features to support namespaces, elegant multiplexing and a simple 'query' protocol from client to server.
