// TODO: Recursion to the width
// Zobrist hashing

import { Game, getExtendedCell } from './game.js';

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
function evaluateMoves(game, robotPlayer, depth, count = 1) {
    return game.getMoves().map(move => {
        let _game = new Game(game);
        _game.move([move[0], move[1]], move[2]);
        const score = evaluateGame(_game, robotPlayer);
        move.push(score);
        if (count == depth || Math.abs(score) == 100) return move;
        else {
            move.push(evaluateMoves(_game, robotPlayer, depth, count + 1));
            if (count % 2 == 1) {
                const minScore = Math.min(...move[4].map(m => m[3]));
                move[3] = move[3] < minScore ? move[3] : minScore;
            }
            else {
                const maxScore = Math.max(...move[4].map(m => m[3]));
                move[3] = move[3] > maxScore ? move[3] : maxScore;
            }
            return move;
        }
    });
}
function findMove(game, depth) {
    const robotPlayer = game.getCurrentPlayer();
    let movesWithScores = evaluateMoves(game, robotPlayer, depth);
    const maxScore = Math.max(...movesWithScores.map(m => m[3]));
    const maxScoredMovies = movesWithScores.filter(m => m[3] == maxScore);
    return getRandomMove(maxScoredMovies).slice(0, 3);
}
function getRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
}

export { findMove }