const ROCK = "R", PAPER = "P", SCISSORS = "S", DYNAMITE = "D", WATER = "W";
const ALL_MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER];
const STANDARD_MOVES = [ROCK, PAPER, SCISSORS];
const MAX_SCORE = 1000;

const FRIENDLY = 1, ENEMY = 2, DRAW = 0;

function getCurrentStats(gamestate) {

    // Init stats
    let roundCount = gamestate.rounds.length;
    let rollOverScore = 0;
    let score = {friendly: 0, enemy: 0};
    let moveCounts = {friendly: {}, enemy: {}};
    initMoveCounts(moveCounts);

    // Populate stats
    gamestate.rounds.forEach(round => {

        // Update counts
        moveCounts["friendly"][round.p1]++;
        moveCounts["enemy"][round.p2]++;
        rollOverScore++;

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

    return {
        roundCount: roundCount,
        rollOverScore: rollOverScore,
        score: score,
        moveCounts: moveCounts,
    };
}

function initMoveCounts(moveCounts) {
    ALL_MOVES.forEach(move => {
        moveCounts["friendly"][move] = 0;
        moveCounts["enemy"][move] = 0;
    });
}

function get_winner(round) {
    if (round.p1 === round.p2)
        return DRAW;

    switch (round.p1) {
        case DYNAMITE:
            if (round.p2 === WATER) return FRIENDLY;
            else return ENEMY;
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