// TODO: Get random move from  moves with the same score
// Zobrist hashing

import { Game, getExtendedCell } from './game.js';

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
function findMove(game) {
    const robotPlayer = game.getCurrentPlayer();
    let moves = game.getMoves();
    for (const move of moves) {
        let _game = new Game(game);
        _game.move([move[0], move[1]], move[2]);
        const score = evaluate(_game, robotPlayer);
        move.push(score);
        // let _moves = _game.getMoves();
        // for (const _move of _moves) {
        //     let __game = new Game();
        //     __game.items = JSON.parse(JSON.stringify(_game.items));
        //     __game.pairs = JSON.parse(JSON.stringify(_game.pairs));
        //     __game.history = JSON.parse(JSON.stringify(_game.history));
        //     __game.winner = _game.winner;

        //     __game.move([_move[0], _move[1]], _move[2]);
        //     const _score = evaluate(__game, robotPlayer);
        //     _move.push(_score);

        //     console.log(`${_move}`);
        // }
        // move.push(_moves);
    }
    (a, b) => a[diagonal] - b[diagonal] || a[nextDiagonal] - b[nextDiagonal]
    moves.sort((a, b) => a[3] - b[3]);
    return moves[moves.length - 1].slice(0, 3);
}
function getRandomMove(game) {
    const moves = game.getMoves();
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return randomMove;
}

export { findMove }