// Zobrist hashing

import { Game } from './game.js';

function evaluate(game) {
    // ...
    return 0; // -100 <= result <= 100
}
function findMove(game) {
    const allMoves = game.getAllMoves();
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    return randomMove;
}

export { findMove }