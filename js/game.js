import { create as createGrid } from './grid.js'
import { create as createCanvas, show as showGrid } from './canvas.js'

let grid = createGrid(4);
createCanvas();
showGrid(grid);
