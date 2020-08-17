import Game from './game.js';
import Canvas from './canvas.js';
let game = new Game();
let bodyRect = document.body.getBoundingClientRect();
let size = Math.min(bodyRect.width, bodyRect.height);
let canvas = new Canvas(size);
document.body.prepend(canvas.element);
canvas.show(game.state);