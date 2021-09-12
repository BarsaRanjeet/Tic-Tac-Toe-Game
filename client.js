const io = require("socket.io-client");
const readline = require('readline')
const port = process.argv[2] || "5050";
const socket = io(`http://localhost:${port}`);

const readl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


socket.on('message', (msg) => {
    console.log(msg);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server, bye bye..');
});

// listen to inputs
readl.on("line", (input) => {
    socket.emit("message", input);
})