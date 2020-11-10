// TODO: clone
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
    let moves = game.getMoves(); // movesWithE
    for (const move of moves) {
        let _game = new Game();
        _game.items = JSON.parse(JSON.stringify(game.items));
        _game.pairs = JSON.parse(JSON.stringify(game.pairs));
        _game.history = JSON.parse(JSON.stringify(game.history));
        _game.winner = game.winner;

        _game.move([move[0], move[1]], move[2]);
        const _e = evaluate(_game, robotPlayer);
        move.push(_e);
    }
    (a, b) => a[diagonal] - b[diagonal] || a[nextDiagonal] - b[nextDiagonal]
    moves.sort((a, b) => a[3] - b[3]);
    console.log(moves[moves.length - 1]);

    return moves[moves.length - 1].slice(0, -1);
}
function getRandomMove(game) {
    const moves = game.getMoves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
}

export { findMove }