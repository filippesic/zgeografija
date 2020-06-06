class Rpsgame {
    constructor(p1, p2) {
        this._players = [p1, p2];
        this._turns = [null, null];
        this._points = [0, 0];

        this._sendToPlayers('Zanimljiva geografija pocinje..');

        this._players.forEach((player, idx) => {
            player.on('turn', turn => {
                //console.log(turn, 'turn  server');
                this._onTurn(idx, turn);
            });
        });
    }

    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex].emit('message', msg);
    }

    _sendToPlayers(msg) {
        this._players.forEach(player => {
            player.emit('message', msg);
        })
    }

    _onTurn(playerIndex, turn) {
        this._turns[playerIndex] = turn; // adds a checkedUserInput from the client side
        this._sendToPlayer(playerIndex, `Uneli ste vasa polja`);

        if ((this._turns[0] && this._turns[1]) != null) {
            this._getGameResult();
            this._checkGameOver();
        }
    }

    _checkGameOver() {
        const turns = this._turns;
        if (turns[0] && turns[1]) {
            this._sendToPlayers('Game Over: ', this._points.join(' <---> '));
            this._getGameResult();
            //this._turns = [null, null];
            this._sendToPlayers('<---------------------Next Round--------------------->');
        }
    }

    _getGameResult() {
        let player1Data = this._turns[0];
        let player2Data = this._turns[1];
        console.log(player1Data, 'player1D');
        console.log(player2Data, 'plater2D');


        for (let i = 0; i < player1Data; i++) {
            console.log(i, 'i');
            console.log(player1Data.length, 'playerData length');
            if(player1Data == '') {
                this._points[0] = 0;
                console.log('p1 0');
            }
            if(player2Data == '') {
                this._points[1] = 0;
                console.log('p2 0');
            }
            if (player1Data[i] == player2Data[i] && player2Data != '') {
                this._points[0] += 5;
                this._points[1] += 5;
                console.log('5');
            }
            if (player1Data[i] != player2Data[i]) {
                this._points[0] += 10;
                this._points[1] += 10;
                console.log('10');
            }
            if (player1Data[i] != '' && player2Data[i] == '') {
                this._points[0] += 15;
                console.log('p1 15');
            }
            if (player1Data[i] == '' && player2Data[i] != '') {
                this._points[1] += 15;
                console.log('p2 15');
            }
        }

        console.log(this._points[0] += 5); // ovde radi, a u ifu ne
        console.log(this._points);
        // }
        // const p0 = this._decodeTurn(this._turns[0]);
        // const p1 = this._decodeTurn(this._turns[1]);

        // const distance = (p1 - p0 + 3) % 3;

        // switch (distance) {
        //     case 0:
        //         this._sendToPlayers('Draw!');
        //         break;
        //     case 1:
        //         this._sendWinMessage(this._players[0], this._players[1]);
        //         break;
        //     case 2:
        //         this._sendWinMessage(this._players[1], this._players[0]);
        //         break;
        // }
    }

    _sendWinMessage(winner, loser) {
        winner.emit('message', 'You won!');
        loser.emit('message', 'You lost!');
    }

    // _decodeTurn(turn) {
    //     switch (turn) {
    //         case 'rock':
    //             return 0;
    //         case 'scissors':
    //             return 1;
    //         case 'paper':
    //             return 2;
    //         default:
    //             throw new Error(`Could not decode turn ${turn}`);
    //     }
    // }
}

module.exports = Rpsgame;