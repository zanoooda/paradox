// Zobrist hashing

import { Game, getExtendedCell } from './game.js';

let depth = 2;

function evaluateGame(game, player) { // -100 <= result <= 100
    let score = 0;
    if (game.winner == -1) {
        const partner = !!+player ? 0 : 1;
        const playerWeight = game.items[player].map(cell => Math.max(...getExtendedCell(cell).map(Math.abs))).reduce((a, b) => a + b);
        const partnerWeight = game.items[partner].map(cell => Math.max(...getExtendedCell(cell).map(Math.abs))).reduce((a, b) => a + b);
        score = partnerWeight - playerWeight;
    }
    else if (game.winner == player) {
        score = 100;
    }
    else {
        score = -100;
    }
    return score;
}
function evaluateMoves(game, robotPlayer, count = 1) {
    return game.getMoves().map(move => {
        let _game = new Game(game);
        _game.move([move[0], move[1]], move[2]);
        const score = evaluateGame(_game, robotPlayer);
        move.push(score);
        if (count == depth || Math.abs(score) == 100) return move;
        else {
            move.push(evaluateMoves(_game, robotPlayer, count + 1));
            return move;
        }
    });
}
function findMove(game) {
    const robotPlayer = game.getCurrentPlayer();
    let movesWithScores = evaluateMoves(game, robotPlayer);
    movesWithScores.map(move => {
        if (Array.isArray(move[4])) {
            const minScore = Math.min(...move[4].map(m => m[3]));
            move[3] = move[3] < minScore ? move[3] : minScore;
        }
        return move;
    });
    const maxScore = Math.max(...movesWithScores.map(m => m[3]));
    const maxScoredMovies = movesWithScores.filter(m => m[3] == maxScore);
    return getRandomMove(maxScoredMovies).slice(0, 3);
}
function getRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
}

export { findMove }