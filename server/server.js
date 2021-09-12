const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { game } = require("./game");
const port = 5050;
var clients = [];

// add users
function addUser(id) {
    if (clients.length < 2) {
        clients.push(id);
        return true;
    }
    else
        return false;
}

// remove users
function removeUser(id) {
    const index = clients.indexOf(id);
    if (index > -1) {
        clients.splice(index, 1);
        return true;
    }
    return false;
}

// implementing socketio
io.on('connection', (socket) => {

    // only allow two users for tic tac toe
    if (!addUser(socket.id)) {
        io.to(socket.id).emit("message", "Users are full, Please connect after sometime, Thank you.");
        socket.disconnect(true);
    }
    else {
        console.log('a new user connected');
        io.to(socket.id).emit("message", `Your user id is ${socket.id}`);

        // starting game
        game.start();

        // displaying output
        if (clients.length == 2) {
            // restarting game incase of resign a user
            game.resetGame();
            game.changeOutput();

            // storing two users
            game.players = clients;

            //displaying the layout
            io.to(socket.id).emit("message", game.displayOutput); // to user 1
            io.to(game.getAnotherUser(socket.id)).emit("message", game.displayOutput); // to user 2
            io.to(game.getAnotherUser(socket.id)).emit("message", "Another user has joined now you can start"); // informing another user that you can start now playing
        }
        else
            io.to(socket.id).emit("message", "Please wait until another user join game.");


        // read move from client
        socket.on("message", (message) => {

            // if user resign the game 
            if (message == "r") {
                io.to(socket.id).emit("message", "you resign the game so you loss the game, Thank you");
                removeUser(socket.id);
                socket.disconnect(true);
            } else if (message == "y") {
                // restarting game 
                game.resetGame();
                game.changeOutput();

                // storing two users
                game.players = clients;

                //displaying the layout
                io.to(socket.id).emit("message", game.displayOutput); // to user 1
                io.to(game.getAnotherUser(socket.id)).emit("message", game.displayOutput); // to user 2
            } else if (message == "n") {
                io.to(socket.id).emit("message", "you are leaving the game, Thank you");
                removeUser(socket.id);
                socket.disconnect(true);
            } else if (game.box.length <= 9) {
                if (clients.length == 2) {
                    // checking if same user has played move
                    if (game.player != "" && game.player != socket.id && game.error == false) {
                        io.to(socket.id).emit("message", "Please wait, you have already played your move.");
                    } else {
                        game.error = false;
                        game.player = socket.id;
                        game.readMove(parseInt(message));
                        if (game.error) {
                            console.log("Error occored")
                            io.to(game.player).emit("message", game.errorMsg);
                        }
                        else if (game.changePlayer) {
                            console.log(`player changed to ${game.player}`);
                            io.to(game.player).emit("message", game.displayOutput);
                            io.to(game.getAnotherUser(game.player)).emit("message", game.displayOutput);
                            io.to(game.getAnotherUser(game.player)).emit("message", "Please wait, until another user play move..");
                            io.to(game.player).emit("message", game.msg);
                            game.changePlayer = false;
                            game.msg = "";
                        }
                        else if (game.gameEnded) {
                            if (game.gameEnded && game.winner == "") {
                                io.to(socket.id).emit("message", " Game is tied, Try again? y or n? :");
                                io.to(game.getAnotherUser(socket.id)).emit("message", "Game is tied, Try again? y or n? :");
                            } else {
                                io.to(game.winner).emit("message", "Congratulations you won the game..");
                                io.to(game.getAnotherUser(game.winner)).emit("message", "Sorry, you loss the game..");
                                game.winner = "";
                                socket.emit("message", "Restart game? y or n? :");

                            }
                        }
                        else if (game.msg != "") {
                            socket.emit("message", game.msg);
                            game.msg = "";
                        }
                        else {
                            socket.emit("message", game.msg);
                        }
                    }

                } else {
                    io.to(socket.id).emit("message", "Please wait for another user to join, Thank you.");
                }
            }
        });
    }
    socket.on('disconnect', () => {
        // event fired when a user is disconnected from server
        console.log('user disconnected');
        removeUser(socket.id);
    });
});

// running server
server.listen(port, () => {
    console.log(`Server started on ${port} port`);
});