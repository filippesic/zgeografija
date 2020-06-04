const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const clientPath = `${__dirname}/../client`;

const Rpsgame = require('./rps-game');

const app = express(clientPath);
app.use(express.static(clientPath));
const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;

io.on('connection', socket => {
    // console.log('Someone connected');
    // socket.emit('message', 'Hi, you are connected');

    if(waitingPlayer) {
        //start a game
        new Rpsgame(waitingPlayer, socket);
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
        waitingPlayer.emit('message', 'Waiting for an opponent..');
    }

    socket.on('message', text => {
        io.emit('message', text);
    });
});

server.on('error', err => {
    console.log('Server error', err);
});

server.listen(1337, () => {
    console.log('RPS started on 1337');
});