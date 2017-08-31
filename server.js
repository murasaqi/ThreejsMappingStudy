'use strict';
var osc = require('node-osc');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketio = require('socket.io')(http);
const PORT = 3333;

var oscServer = new osc.Server(PORT, '192.168.100.100');
console.log("start up");
// console.log(oscServer);




app.use(express.static('docs'));
var server = app.listen(PORT, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);

    var io = socketio.listen(server);



    io.on('connection', (socket) => {
        console.log('a user connected');
        oscServer.on('message', function (msg) {
            console.log('Message:');
            console.log(msg);
            //socket.emit('chat message', $('#m').val());
            socket.emit('msg',msg);

        });
    });
});


