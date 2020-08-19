import Game from './game.js';
import Canvas from './canvas.js';
function startGame() {
    let game = new Game();
    let size = getCanvasSize();
    let canvas = new Canvas(size);
    document.body.prepend(canvas.element);
    canvas.start(game.state);
}
function getCanvasSize() {
    let bodyRect = document.body.getBoundingClientRect();
    return Math.min(bodyRect.width, bodyRect.height);
}
startGame();