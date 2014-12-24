var Client = require('../../../')('client');
var client;
var _data_container = $("#data_container");
var _error_container = $("#error_container");
var _debug_container = $("#debug_container");

function log(container, content) {
    container.prepend("<div>"+content+"</div>");    
}

function setButtonsDisabled(disabled) {
    $(".control-button").attr('disabled', disabled);
}

$(document).ready(function() {

    $("#connect_button").click(function() {
        console.log("Client = "+client);
        if (client == undefined) {
            var _url = "ws://" + $("#url").val();
            console.log("Connecting to '"+_url+"'");
            client = new Client(_url);
            $(this).html("Disconnect");

            client.on('connect', function() {
                log(_debug_container, 'Connected');
                setButtonsDisabled(false);
            });

            client.on('disconnect', function() {
                log(_debug_container, 'Disconnected');
                setButtonsDisabled(true);
            });

            client.on('data', function(client_message) {
                console.log("Received data " + client_message.getSequence());
                log(_data_container, "Received data " + client_message.getSequence());
                if (client_message.done()) {
                    log(_data_container, "Sent ack");
                }
            });

            client.on('error', function(error) {
                log(_error_container, "Received error " + "(" + error.code + ":" + error.message + ")");
            });

            client.on('control', function(control) {
                log(_debug_container, "Received control response " + "(" + control.format() + ")");
            });
        } else {
            console.log("Disconnecting");
            client.close();
            client = undefined;
            $(this).html("Connect");
        }
    });

    $("#pause_button").click(function() {
        if (client) {
            console.log("Pausing");
            client.pause();
        }
    });

    $("#resume_button").click(function() {
        if (client) {
            console.log("Resuming");
            client.resume();
        }
    });

    $("#retransmit_button").click(function() {
        if (client) {
            console.log("Retransmit");
            client.retransmit();
        }
    });

    for (var i=1; i<=10; i++) {
        $("#window_"+i).click(function(window_size) {
            client.setWindow(window_size);
        }.bind(this, i));
    }

});