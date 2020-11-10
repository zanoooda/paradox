// TODO: Evaluation: (game) => -100|100
// Zobrist hashing for game state comparsing

import { Game } from './game.js';

function findMove(game) {
    const allMoves = game.getAllMoves();
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    return randomMove;
}

export { findMove }