const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE];

let dynamiteCount = 0;

class Bot {

    makeMove(gameState) {
        let move = MOVES[Math.floor(Math.random() * MOVES.length)];
        if (move === DYNAMITE) {
            if (dynamiteCount < 100) dynamiteCount++;
            else return this.makeMove(gameState);
        }
        return move;
    }
}

module.exports = new Bot();
