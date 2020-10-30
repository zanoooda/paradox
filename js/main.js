import Game from './game.js';
import Board from './board.js';
let bodyRect = document.body.getBoundingClientRect(),
    board = new Board(Math.min(bodyRect.width, bodyRect.height));
board.play(new Game());