const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const ALL_MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER];
const STANDARD_MOVES = [ROCK, PAPER, SCISSORS];
const MAX_SCORE = 1000;

const FRIENDLY = 1, ENEMY = 2, DRAW = 0;

class Bot {

    // noinspection JSMethodCanBeStatic
    makeMove(gamestate) {

        const currentStats = Bot.getCurrentStats(gamestate);

        let rollOverScoreFrequency = Bot.getProjectedRollOverScoreFrequency(currentStats);
        let dynamiteRollOverScoreThreshold = Bot.getDynamiteRollOverScoreThreshold(rollOverScoreFrequency, currentStats);
        let probabilityOfEnemyUsingDynamite = Bot.getProbabilityOfEnemyUsingDynamite(currentStats);

        if (Bot.shouldUseWater(probabilityOfEnemyUsingDynamite)) return WATER;
        else if (Bot.shouldUseDynamite(currentStats, dynamiteRollOverScoreThreshold)) return DYNAMITE;
        else return Bot.getRandomStandardMove();
    }

    static shouldUseWater(probabilityOfEnemyUsingDynamite) {
        return probabilityOfEnemyUsingDynamite > 0.5 && Math.random() > 0.25;
    }

    static shouldUseDynamite(currentStats, dynamiteRollOverScoreThreshold) {
        return currentStats.moveCounts.friendly[DYNAMITE] < 99 &&
            (currentStats.rollOverScore > dynamiteRollOverScoreThreshold
                || currentStats.rollOverScore / dynamiteRollOverScoreThreshold > Math.random() + 0.4) &&
            this.getProbabilityOfEnemyUsingWater(currentStats) < 0.7;
    }

    static getProbabilityOfEnemyUsingDynamite(currentStats) {
        if (currentStats.moveCounts.enemy[DYNAMITE] < 100)
            return currentStats.rollOverScoreCount.enemy.dynamite[currentStats.rollOverScore + 1] /
                currentStats.rollOverScoreCount.total[currentStats.rollOverScore + 1];
        else
            return 0;
    }

    static getProbabilityOfEnemyUsingWater(currentStats) {
        if (currentStats.moveCounts.enemy[WATER] < 100)
            return currentStats.rollOverScoreCount.enemy.water[currentStats.rollOverScore + 1] /
                currentStats.rollOverScoreCount.total[currentStats.rollOverScore + 1];
        else
            return 0;
    }

    static getProjectedRollOverScoreFrequency(currentStats) {
        let rollOverScoreFrequency = [0];
        let frequency = 0;
        let rollOverScore = 0;
        do {
            frequency = Math.floor(currentStats.estimateRoundsLeft * 0.4692 * Math.exp(-1.113 * rollOverScore));
            rollOverScoreFrequency[rollOverScore] = frequency;
            rollOverScore++;
        } while (frequency > 0 || rollOverScore < 4);
        return rollOverScoreFrequency;
    }

    static getDynamiteRollOverScoreThreshold(rollOverScoreFrequency, currentStats) {
        let dynamiteRollOverScoreThreshold = rollOverScoreFrequency.length - 4;
        if (currentStats.estimateRoundsLeft <= currentStats.moveCounts.friendly[DYNAMITE])
            dynamiteRollOverScoreThreshold = 0;
        return dynamiteRollOverScoreThreshold;
    }

    static getRandomStandardMove() {
        return STANDARD_MOVES[Math.floor(Math.random() * STANDARD_MOVES.length)];
    }

    static getCurrentStats(gamestate) {

        // Init stats
        let rollOverScore = 0;
        let score = {friendly: 0, enemy: 0};
        let moveCounts = {friendly: {}, enemy: {}};
        let rollOverScoreCount = {
            total: new Array(10).fill(0),
            friendly: {
                dynamite: new Array(10).fill(0),
                water: new Array(10).fill(0),
            },
            enemy: {
                dynamite: new Array(10).fill(0),
                water: new Array(10).fill(0),
            },
        };
        this.initMoveCounts(moveCounts);

        // Populate stats
        gamestate.rounds.forEach(round => {

            // Update counts
            moveCounts["friendly"][round.p1]++;
            moveCounts["enemy"][round.p2]++;
            rollOverScore++;

            this.updateRollOverScoreCount(rollOverScoreCount, rollOverScore, round);

            switch (this.getWinner(round)) {
                case FRIENDLY:
                    score.friendly += rollOverScore;
                    rollOverScore = 0;
                    break;
                case ENEMY:
                    score.enemy += rollOverScore;
                    rollOverScore = 0;
                    break;
            }
        });

        // Calculate round stats
        let roundCount = gamestate.rounds.length;
        let minimumRoundsLeft = MAX_SCORE - (score.friendly > score.enemy ? score.friendly : score.enemy);
        let estimateRoundsLeft = Math.ceil(minimumRoundsLeft * 1.8);

        return {
            score: score,
            roundCount: roundCount,
            moveCounts: moveCounts,
            rollOverScore: rollOverScore,
            estimateRoundsLeft: estimateRoundsLeft,
            rollOverScoreCount: rollOverScoreCount,
        };
    }

    static initMoveCounts(moveCounts) {
        ALL_MOVES.forEach(move => {
            moveCounts["friendly"][move] = 0;
            moveCounts["enemy"][move] = 0;
        });
    }

    static updateRollOverScoreCount(rollOverScoreCount, rollOverScore, round) {
        rollOverScoreCount.total[Math.min(rollOverScore, rollOverScoreCount.total.length - 1)]++;
        if (round.p1 === DYNAMITE) rollOverScoreCount.friendly.dynamite[Math.min(rollOverScore, rollOverScoreCount.enemy.dynamite.length - 1)]++;
        if (round.p1 === WATER) rollOverScoreCount.friendly.water[Math.min(rollOverScore, rollOverScoreCount.enemy.dynamite.length - 1)]++;
        if (round.p2 === DYNAMITE) rollOverScoreCount.enemy.dynamite[Math.min(rollOverScore, rollOverScoreCount.enemy.dynamite.length - 1)]++;
        if (round.p2 === WATER) rollOverScoreCount.enemy.water[Math.min(rollOverScore, rollOverScoreCount.enemy.dynamite.length - 1)]++;
    }

    static getWinner(round) {
        if (round.p1 === round.p2)
            return DRAW;

        switch (round.p1) {
            case DYNAMITE:
                if (round.p2 === WATER) return ENEMY;
                else return FRIENDLY;
            case WATER:
                if (round.p2 === DYNAMITE) return FRIENDLY;
                else return ENEMY;
            default:
                if (round.p2 === DYNAMITE
                    || (STANDARD_MOVES.indexOf(round.p1) + 1) % 3 === STANDARD_MOVES.indexOf(round.p2))
                    return ENEMY;
                else return FRIENDLY;
        }
    }
}

module.exports = new Bot();