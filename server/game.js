'use strict';

class Game {
    constructor() {
        // required variables
        this.box = [];
        this.box[8] = undefined; // making box array of length 9
        this.displayOutput = "";
        this.players = []; // all players
        this.player = ""; // player is socket.id
        this.gameEnded = false; // to check if game is already ended or not
        this.playedBox = []; // to display already played boxes
        this.error = false; // to check if there any error occored
        this.errorMsg = ""; // Error message for user
        this.msg = ""; // to send any message
        this.changePlayer = false;
        this.currentPlayer = false; // to display * and 0
        this.winner = ""; // to show winner
    }

    // this method is to reflact changes in game layout
    changeOutput() {
        this.displayOutput = `${this.displayItem(this.box[0])} | ${this.displayItem(this.box[1])} | ${this.displayItem(this.box[2])}
---------
${this.displayItem(this.box[3])} | ${this.displayItem(this.box[4])} | ${this.displayItem(this.box[5])}
---------
${this.displayItem(this.box[6])} | ${this.displayItem(this.box[7])} | ${this.displayItem(this.box[8])}`;
    }

    // starting game
    start() {
        this.changeOutput();
    }

    endGame() {
        this.gameEnded = true;
    }

    continuePlay() {
        // change layout of game
        this.changeOutput();

        // process game if any 3 move matched for winner
        this.processGame();
        if (!this.gameEnded) {
            // switch player for another user
            this.changeOutput();
            this.player = this.getAnotherUser(this.player);
            this.msg = `Player ${this.player}, Your move? : `;
            this.changePlayer = true;
            this.currentPlayer = this.currentPlayer ? false : true; // change another user
        }
    }

    processGame() {
        // we can justify game after 5 moves
        if (this.playedBox.length >= 5) {
            var checkWin = new Set() // to check in set(duplicate values not allowed)

            // checking vertically
            // col1
            if (this.box[0] && this.box[3] && this.box[6] && (Array.from(checkWin.add(this.box[0]).add(this.box[3]).add(this.box[6])).length === 1)) {
                this.winner = this.getPlayerFromChar(this.box[0]);
                this.endGame();
            }
            checkWin.clear();

            // col2
            if (this.box[1] && this.box[4] && this.box[7] && (Array.from(checkWin.add(this.box[1]).add(this.box[4]).add(this.box[7])).length === 1)) {
                this.winner = this.getPlayerFromChar(this.box[1]);
                this.endGame();
            }
            checkWin.clear();

            // col3
            if (this.box[2] && this.box[5] && this.box[8] && (Array.from(checkWin.add(this.box[2]).add(this.box[5]).add(this.box[8])).length === 1)) {
                this.winner = this.getPlayerFromChar(this.box[2]);
                this.endGame();
            }
            checkWin.clear();

            // checking horizontally
            // row1
            if (this.box[0] && this.box[1] && this.box[2] && (Array.from(checkWin.add(this.box[0]).add(this.box[1]).add(this.box[2])).length === 1)) {
                this.winner = this.getPlayerFromChar(this.box[0]);
                this.endGame();
            }
            checkWin.clear();

            // row2
            if (this.box[3] && this.box[4] && this.box[5] && (Array.from(checkWin.add(this.box[3]).add(this.box[4]).add(this.box[5])).length === 1)) {
                this.winner = this.getPlayerFromChar(this.box[3]);
                this.endGame();
            }
            checkWin.clear();

            //row3
            if (this.box[6] && this.box[7] && this.box[8] && (Array.from(checkWin.add(this.box[6]).add(this.box[7]).add(this.box[8])).length === 1)) {
                this.winner = this.getPlayerFromChar(this.box[6]);
                this.endGame();
            }
            checkWin.clear();

            // checking diagonal 
            if ((this.box[0] && this.box[4] && this.box[8] && (Array.from(checkWin.add(this.box[0]).add(this.box[4]).add(this.box[8])).length === 1)) || (this.box[2] && this.box[4] && this.box[6] && (Array.from(checkWin.add(this.box[2]).add(this.box[4]).add(this.box[6])).length === 1))) {
                this.winner = this.getPlayerFromChar(this.box[4]);
                this.endGame();
            }
            checkWin.clear();
        }
        if (this.gameEnded == false && this.playedBox.length == 9) {
            this.gameEnded = true;
        }
    }

    // helpers
    displayItem(item) {
        return item === undefined ? ' ' : item
    }

    // get winner user
    getPlayerFromChar(char) {
        if (char === '*')
            return (this.players[0] == this.player) ? this.players[1] : this.player;
        else
            return (this.players[0] == this.player) ? this.player : this.players[1];
    }

    // to display on layout
    getCharacter(player) {
        return player ? '*' : '0'
    }


    readMove(position) {

        // check if poosition is eligible
        if ((position > 9) || position < 1) {
            // wrong position
            this.errorMsg = "Wrong position!!! ";
        }
        // check if position is occupied
        if (this.box[(position - 1)] !== undefined) {
            this.error = true;
            this.errorMsg = "Position is already occupied, please try another";
        } else {
            // register move which placed
            this.box[(position - 1)] = this.getCharacter(this.currentPlayer);
            // record move 
            this.recordMove((position - 1), this.currentPlayer);
            // continue playing
            this.continuePlay();
        }
    }

    // record moves
    recordMove(position, player) {
        this.playedBox.push({
            position: position,
            char: this.getCharacter(player),
            player: this.player
        });
    }

    // get another user id by comparing two ids
    getAnotherUser(client) {
        return (this.players[0] == client) ? this.players[1] : this.players[0]
    }

    // reset the game
    resetGame() {
        // required variables
        this.box = [];
        this.box[8] = undefined; // making box array of length 9
        this.displayOutput = "";
        this.players = []; // all players
        this.player = ""; // player is socket.id
        this.gameEnded = false; // to check if game is already ended or not
        this.playedBox = []; // to display already played boxes
        this.error = false; // to check if there any error occored
        this.errorMsg = ""; // Error message for user
        this.msg = ""; // to send any message
        this.changePlayer = false;
        this.currentPlayer = false; // to display * and 0
        this.winner = ""; // to show winner
    }

}

module.exports.game = new Game();