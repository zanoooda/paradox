// TODO: Get random move from  moves with the same score
// Zobrist hashing

import { Game, getExtendedCell } from './game.js';

const depth = 2;

function evaluate(game, player) { // -100 <= result <= 100
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
        const score = evaluate(_game, robotPlayer);
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
    })
    movesWithScores.sort((a, b) => a[3] - b[3]);
    return movesWithScores[movesWithScores.length - 1].slice(0, 3);
}
function getRandomMove(game) {
    const moves = game.getMoves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
}

export { findMove }