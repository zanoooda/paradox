import Game from './game.js';
import Canvas from './canvas.js';
function initCanvasSize() {
    let bodyRect = document.body.getBoundingClientRect();
    return Math.min(bodyRect.width, bodyRect.height);
}
let game = new Game(),
    size = initCanvasSize(),
    canvas = new Canvas(size);
document.body.prepend(canvas.element);
canvas.show(game);