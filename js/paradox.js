import Game from "./game.js";
const colors = ['red', 'blue'];
function getPoint(cell, size) { // TODO: Fix distance
    cell.push(-cell[1] - cell[0]);
    let distance = size / 12;
    let x = (size / 2) + (distance * Math.sqrt(3) * (cell[0] + cell[2] / 2));
    let y = (size / 2) + (distance * 3 / 2 * cell[2]);
    return [x, y];
}
function getSize(container) {
    let containerRect = container.getBoundingClientRect();
    return Math.min(containerRect.width, containerRect.height);
}
function createCanvas(size) {
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.addEventListener('click', canvasClick, false);
    return canvas;
}
function canvasClick(event) {
    console.log(`${JSON.stringify(event)}`);
    // ...
}
function showCells(cells, context, size, cellRadius) {
    for (const cell of cells) {
        showCell(cell, context, size, cellRadius);
    }
}
function showCell(cell, context, size, cellRadius) {
    let point = getPoint([cell[0], cell[1]], size);
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    if (cell[2] != -1) { // TODO: if cell[3] exist
        context.fillStyle = colors[cell[2]];
        context.fill();
    } else {
        context.strokeStyle = 'lightgray'
        context.stroke();
    }
    context.fillStyle = 'black';
    context.font = '10px Arial';
    context.fillText(`${cell[0]}, ${cell[1]}, ${-cell[0] - cell[1]}`, ...point);
}
class Paradox {
    constructor(container) {
        this.size = getSize(container);
        this.canvas = createCanvas(this.size);
        container.prepend(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.cellRadius = this.size / 18;
    }
    playHotSeat() {
        this.game = new Game();
        showCells(this.game.getCells(), this.context, this.size, this.cellRadius);
    }
    playWithRobot(playerColor) {
        // ...
    }
    playOnline() {
        // ...
    }
}
export default Paradox;