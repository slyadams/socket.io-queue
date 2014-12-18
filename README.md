Retransmit ("retransmit"):

  request:
    {
      // what sequence to retransmit from
      sequence: sequence
    }

  response:
    {
      // what sequence retransmit will be from
      sequence: sequence,

      // requested retransmit sequence (i.e. request.sequence)
      request: data.sequence
    }

Debug ("debug)"

  Any object can be sent


Control ("control")
  {
      type: window
      data: {
        size: integer
      }
    }

Error ("err")
  {
      // error code
      code: code,

      // error message
      message: message
    }
  

data.type + "(" + data.code + ") : " + data.name