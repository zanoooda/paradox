// Zobrist hashing

import { Game } from './game.js';

function evaluate(game) { // -100 <= result <= 100
    let result = 0;
    // ...
    return result;
}
function findMove(game) {
    const allMoves = game.getAllMoves();
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    return randomMove;
}

export { findMove }