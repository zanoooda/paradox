import { create as createGrid } from './grid.js'
import { Canvas } from './canvas.js'

export class Game {
    constructor() {
        this.grid = createGrid(4);
        this.canvas = new Canvas(Math.min(document.body.getBoundingClientRect().width, document.body.getBoundingClientRect().height));
        document.body.prepend(this.canvas.element);
    }
    play() {
        this.canvas.showGrid(this.grid);
    }
}