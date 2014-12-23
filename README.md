# socket.io-queue

socket-io-queue is an windowed, acknowledgement based message queue using socket.io as a transport. It uses a 
configurable buffer and window and supports retransmits, pausing and resuming.

## How to use

To create a message server:

```js
var Connection = require('/lib/connection.js');
var io = require('socket.io')();
io.on('connection', function(socket){
  var connection = new Connection(socket, window_size, buffer_size);
});
io.listen(9876);
```

To create a client:

```js
var Client = require('../lib/client.js');
var client = new Client('ws://localhost:9876');
```

##API

##Events

The client and server modules emit events.

###Client         
          
        self.emit('connect');

        self.emit('disconnect');

        self.emit('data', new ClientMessage(data.sequence, data.data, ack));
self.emit('debug', data);
        self.emit('retransmit');
        self.emit('error', error);

        self.emit('control', control);



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
  