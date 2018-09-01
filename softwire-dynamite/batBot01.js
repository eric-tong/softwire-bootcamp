const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const STANDARD_MOVES = [ROCK, PAPER, SCISSORS];

class Bot {

    makeMove(gamestate) {

        // Init moves
        let moves = STANDARD_MOVES;

        // Count past dynamites
        let pastFriendlyDynamites = 0;
        let pastEnemyDynamites = 0;
        gamestate.rounds.forEach(round => {
            if (round.p1 === DYNAMITE) pastFriendlyDynamites++;
            if (round.p2 === DYNAMITE) pastEnemyDynamites++;
        });

        // Add dynamites if I still have dynamites
        // Keep one dynamite to prevent triggering enemy from keeping Water
        if (pastFriendlyDynamites < 99 && Math.random() < 0.5)
            moves = moves.concat(DYNAMITE);

        // Add water if enemy use dynamites systematically
        // if (pastEnemyDynamites < 100)
        //     moves = moves.concat(WATER);

        // If they have dynamites left and game is close to ending, use more water

        // Return random in array
        let move = moves[Math.floor(Math.random() * moves.length)];
        return move;
    }
}

module.exports = new Bot();
