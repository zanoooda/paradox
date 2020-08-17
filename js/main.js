import Game from './game.js';
import Canvas from './canvas.js';

let game = new Game();
let canvas = new Canvas(getCanvasSize());
document.body.prepend(canvas.element);
canvas.show(game.state);

function getCanvasSize() {
    let bodyRect = document.body.getBoundingClientRect();
    return Math.min(bodyRect.width, bodyRect.height);
}