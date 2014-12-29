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
          

*`connect` on client connect
*`disconnect`  on client disconnect
*`data` on receipt of a data message, with parameter
**`data_obj` the data object received
*`error` on receipt of an error message, with parameter
**`error_obj` the error object received
*`debug` on receipt of a debug message, with parameter
**`debug_obj` the debug object received
*`control` on receipt of a control response message (i.e. response to a control request), with parameter
*`control_response_obj` the control response object received

###Server

self.emit('disconnect');
self.emit('retransmit');
self.emit('ack', sequence);
self.emit('debug', data);
self.emit('control', control);


##Protocol



Retransmit ("retransmit"):
  request/response: {}

Debug ("debug)"
  Any object can be sent


Control ("control")
  request:
    {
      control_id: control_id,
      control: window
      control_parameters: {
        size: integer
      }
    }

    {
      control_id: control_id,
      control: pause
      control_parameters: { }
    }

    {
      control_id: control_id,
      control: resume
      control_parameters: { }
    }

  response:
    {
      control_id: control_id,
      success: true/false
    }

Error ("err")
  {
      // error code
      code: code,

      // error message
      message: message
    }
  