const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 5050;

// implementing socketio
io.on('connection', (socket) => {
    console.log('a new user connected');

    socket.on('disconnect', () => {
        // event fired when a user is disconnected from server
        console.log('user disconnected');
    });
});

// running server
server.listen(port, () => {
    console.log(`Server started on ${port} port`);
});