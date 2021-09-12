const io = require("socket.io-client");
const readline = require('readline')
const port = process.argv[2] || "5050";
const socket = io(`http://localhost:${port}`);

// interface for readline
const readl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// socket io cpturing message event
socket.on('message', (msg) => {
    console.log(msg);
});

// when client disconnect
socket.on('disconnect', function () {
    console.log('Disconnected from server, bye bye..');
});

// listen to inputs
readl.on("line", (input) => {
    socket.emit("message", input);
})