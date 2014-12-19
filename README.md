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
  