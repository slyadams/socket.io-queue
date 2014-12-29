var Client = require('../../../')('client');
var client;

function log(container, content) {
    container.prepend("<div>" + content + "</div>");
}

function setControlButtonsDisabled(disabled) {
    $(".control-button").attr('disabled', disabled);
}

function setConnectButtonDisabled(disabled) {
    $("#connect_button").attr('disabled', disabled);
}

$(document).ready(function() {

    var _data_container = $("#data_container");
    var _error_container = $("#error_container");
    var _debug_container = $("#debug_container");

    $("#connect_button").click(function() {
        if (client == undefined) {
            setConnectButtonDisabled(true);
            var _url = "ws://" + $("#url").val();
            log(_debug_container, "Connecting to '" + _url + "'");

            try {
                client = new Client(_url, {
                    "reconnection": false,
                    "timeout": 5000,
                    "multiplex": false
                });
            } catch (e) {
                log(_error_container, "Error: " + e.message);
            }

            if (client) {
                client.on('connect', function() {
                    log(_debug_container, 'Connected');

                    $("#connect_button").html("Disconnect");
                    setControlButtonsDisabled(false);
                    setConnectButtonDisabled(false);

                    client.on('disconnect', function() {
                        log(_debug_container, 'Disconnected');
                        setControlButtonsDisabled(true);
                    });

                    client.on('data', function(client_message) {
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

                });

                client.on('connect_error', function(error) {
                    setControlButtonsDisabled(false);
                    setConnectButtonDisabled(false);
                    log(_error_container, "Connect error '" + error + "'");
                    client = undefined;
                });
            } else {
                setConnectButtonDisabled(false);
            }
        } else {
            console.log("Disconnecting");
            client.close();
            client = undefined;
            $("#connect_button").html("Connect");
        }
    });

    $("#pause_button").click(function() {
        if (client) {
            log(_debug_container, "Pausing");
            client.pause();
        }
    });

    $("#resume_button").click(function() {
        if (client) {
            log(_debug_container, "Resuming");
            client.resume();
        }
    });

    $("#retransmit_button").click(function() {
        if (client) {
            log(_debug_container, "Retransmitting");
            client.retransmit();
        }
    });

    for (var i = 1; i <= 10; i++) {
        $("#window_" + i).click(function(window_size) {
            client.setWindow(window_size);
        }.bind(this, i));
    }

});