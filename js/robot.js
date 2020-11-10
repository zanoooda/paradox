// Zobrist hashing

import { Game } from './game.js';

function evaluate(game, player) { // -100 <= result <= 100
    let result = 0;
    if (game.winner == -1) {
        // ...
    }
    else if (game.winner == player) {
        result = 100;
    }
    else {
        result = -100;
    }
    return result;
}
function findMove(game) {
    const robotPlayer = game.getCurrentPlayer();
    const moves = game.getMoves();

    return getRandomMove(game);
}
function getRandomMove(game) {
    const moves = game.getMoves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
}

export { findMove }