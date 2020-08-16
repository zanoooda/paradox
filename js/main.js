import { Game } from './game.js'
import { Canvas } from './canvas.js'

let game = new Game();

let canvasLength = Math.min(document.body.getBoundingClientRect().width, document.body.getBoundingClientRect().height);
let canvas = new Canvas(canvasLength);
document.body.prepend(canvas.element);
canvas.showGrid(game.grid);