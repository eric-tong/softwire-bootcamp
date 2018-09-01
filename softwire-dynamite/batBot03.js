const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const ALL_MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER];
const STANDARD_MOVES = [ROCK, PAPER, SCISSORS];
const MAX_SCORE = 1000;
const MAX_ROUNDS = 2500;

class Bot {

    makeMove(gamestate) {

        // Get stats
        const currentStats = this.getCurrentStats(gamestate);

        // Find frequency of rollOverScore given estimated turns left with empirical formula
        let rollOverScoreFrequency = [0];
        let frequency = 0;
        let rollOverScore = 0;
        do {
            frequency = Math.floor(currentStats.estimateRoundsLeft * 0.4692 * Math.exp(-1.113 * rollOverScore));
            rollOverScoreFrequency[rollOverScore] = frequency;
            rollOverScore++;
        } while (frequency > 0 || rollOverScore < 4);

        // Get threshold for dynamite use
        let dynamiteRollOverScoreThreshold = rollOverScoreFrequency.length - 4;
        if (currentStats.estimateRoundsLeft <= currentStats.moveCounts.friendly[DYNAMITE])
            dynamiteRollOverScoreThreshold = 0;
        // console.log("Rounds left: " + currentStats.estimateRoundsLeft,
        //     " | Threshold: " + dynamiteRollOverScoreThreshold,
        //     " | Dynamites left: " + (100 - currentStats.moveCounts.friendly[DYNAMITE]),
        //     " | Frequencies: " + rollOverScoreFrequency);

        // Find enemy dynamite strategy

        // Find enemy water strategy

        // Decide to use dynamite or water

        if (currentStats.moveCounts.friendly[DYNAMITE] < 99
            && (currentStats.rollOverScore > dynamiteRollOverScoreThreshold
                || currentStats.rollOverScore / dynamiteRollOverScoreThreshold > Math.random() + 0.4
            ))
        {
            // console.log("Roll over score: " + currentStats.rollOverScore,
            //     " | Threshold: " + dynamiteRollOverScoreThreshold);
            return DYNAMITE
        } else
            return this.getRandomStandardMove();
    }

    getCurrentStats(gamestate) {

        // Init stats
        let rollOverScore = 0;
        let score = {friendly: 0, enemy: 0};
        let moveCounts = {friendly: {}, enemy: {}};

        ALL_MOVES.forEach(move => {
            moveCounts["friendly"][move] = 0;
            moveCounts["enemy"][move] = 0;
        });

        // Populate stats
        gamestate.rounds.forEach(round => {

            // Update counts
            moveCounts["friendly"][round.p1]++;
            moveCounts["enemy"][round.p2]++;
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

        // Calculate round stats
        let roundCount = gamestate.rounds.length;
        let minimumRoundsLeft = MAX_SCORE - (score.friendly > score.enemy ? score.friendly : score.enemy);
        let estimateRoundsLeft = Math.ceil(minimumRoundsLeft * 1.8);

        return {
            rollOverScore: rollOverScore,
            roundCount: gamestate.rounds.length,
            estimateRoundsLeft: estimateRoundsLeft,
            score: score,
            moveCounts: moveCounts
        };
    }

    getRandomStandardMove() {
        return STANDARD_MOVES[Math.floor(Math.random() * STANDARD_MOVES.length)];
    }
}

module.exports = new Bot();