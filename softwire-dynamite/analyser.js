const gamestate = require('./data/jobot2-lose');

const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const ALL_MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER];
const STANDARD_MOVES = [ROCK, PAPER, SCISSORS];
const MAX_SCORE = 1000;
const MAX_ROUNDS = 2500;

// Init stats
let rollOverScore = 0;
let score = {friendly: 0, enemy: 0};
let moveCounts = {friendly: {}, enemy: {}};
let rollOverScoreCount = {
    total: new Array(10).fill(0),
    friendly: new Array(10).fill(0),
    enemy: new Array(10).fill(0),
};
let analysisCounts = {
    successfulWaterUsage: {friendly: 0, enemy: 0},
};

ALL_MOVES.forEach(move => {
    moveCounts["friendly"][move] = 0;
    moveCounts["enemy"][move] = 0;
});

// Populate stats
gamestate.moves.forEach(round => {

    // Update counts
    moveCounts["friendly"][round.p1]++;
    moveCounts["enemy"][round.p2]++;
    rollOverScore++;

    rollOverScoreCount.total[Math.min(rollOverScore, rollOverScoreCount.total.length - 1)]++;
    if (round.p1 === DYNAMITE) rollOverScoreCount.friendly[Math.min(rollOverScore, rollOverScoreCount.friendly.length - 1)]++;
    if (round.p2 === DYNAMITE) rollOverScoreCount.enemy[Math.min(rollOverScore, rollOverScoreCount.enemy.length - 1)]++;

    if (round.p1 === WATER && round.p2 === DYNAMITE) analysisCounts.successfulWaterUsage.friendly++;
    if (round.p1 === DYNAMITE && round.p2 === WATER) analysisCounts.successfulWaterUsage.enemy++;

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
let roundCount = gamestate.moves.length;
let minimumRoundsLeft = MAX_SCORE - (score.friendly > score.enemy ? score.friendly : score.enemy);
let estimateRoundsLeft = Math.ceil(minimumRoundsLeft * 1.8);

console.log({
    roundCount: roundCount,
    rollOverScore: rollOverScore,
    estimateRoundsLeft: estimateRoundsLeft,
    score: score,
    moveCounts: moveCounts,
    rollOverScoreCount: rollOverScoreCount,
    analysisCounts: analysisCounts,
});
