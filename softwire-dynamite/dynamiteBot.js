const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER];

let dynamiteCount = 0;

class Bot {

    makeMove(gameState) {
        if (dynamiteCount < 100 && Math.random() < 0.5) {
            dynamiteCount++;
            return DYNAMITE;
        } else
            return ROCK;
    }
}

module.exports = new Bot();
