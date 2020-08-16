import { Game } from './game.js'
import { Canvas } from './canvas.js'

let game = new Game();

let bodyRect = document.body.getBoundingClientRect();
let sideLength = Math.min(bodyRect.width, bodyRect.height);
let canvas = new Canvas(sideLength);
document.body.prepend(canvas.element);
canvas.showGrid(game.grid);