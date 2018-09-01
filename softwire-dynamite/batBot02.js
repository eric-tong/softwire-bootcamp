const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const ALL_MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER];
const STANDARD_MOVES = [ROCK, PAPER, SCISSORS];
const MAX_SCORE = 1000;
const MAX_ROUNDS = 2500;

class Bot {

    makeMove(gamestate) {

        // Get stats
        const currentStats = this.getCurrentStats(gamestate);

        // If no rollover score, use standard moves
        // Else, use dynamite
        let move = "";
        if (currentStats.rollOverScore === 0 || currentStats.counts.friendly[DYNAMITE] >= 99)
            move = STANDARD_MOVES[Math.floor(Math.random() * STANDARD_MOVES.length)];
        else
            move = DYNAMITE;

        return move;
    }

    getCurrentStats(gamestate) {

        // Init stats
        let rollOverScore = 0;
        let score = {friendly: 0, enemy: 0};
        let counts = {friendly: {}, enemy: {}};
        ALL_MOVES.forEach(move => {
            counts["friendly"][move] = 0;
            counts["enemy"][move] = 0;
        });

        // Populate stats
        gamestate.rounds.forEach(round => {

            // Update counts
            counts["friendly"][round.p1]++;
            counts["enemy"][round.p2]++;
            rollOverScore++;

            // Update score
            if (round.p1 !== round.p2) {
                switch (round.p1) {
                    case DYNAMITE:
                        if (round.p2 === WATER) score.enemy += rollOverScore;
                        else score.friendly += rollOverScore;
                        break;
                    case WATER:
                        if (round.p2 === DYNAMITE) score.friendly += rollOverScore;
                        else score.enemy += rollOverScore;
                        break;
                    default:
                        // Enemy wins if it uses dynamite or a move with 1 index above friendly move
                        if (round.p2 === DYNAMITE
                            || (STANDARD_MOVES.indexOf(round.p1) + 1) % 3 === STANDARD_MOVES.indexOf(round.p2))
                            score.enemy += rollOverScore;
                        else score.friendly += rollOverScore;
                }
                rollOverScore = 0;
            }
        });
        return {rollOverScore: rollOverScore, roundCount: gamestate.rounds.length, score: score, counts: counts};
    }
}

module.exports = new Bot();