import Game from "./game.js";

let colors = ['red', 'blue'];
function getPoint(cell, size) {
    let distance = size / 12;
    let x = (size / 2) + (distance * Math.sqrt(3) * (cell[0] + cell[2] / 2));
    let y = (size / 2) + (distance * 3 / 2 * cell[2]);
    return [x, y];
}
function showCell(cell, context, size, cellRadius) {
    cell.splice(2, 0, -cell[1] - cell[0]);
    let point = getPoint(cell, size);
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    if (cell[3] != null) {
        context.fillStyle = colors[cell[3]];
        context.fill();
    } else {
        context.strokeStyle = 'lightgray'
        context.stroke();
    }
    context.fillStyle = 'black';
    context.font = '10px Arial';
    context.fillText(`${cell[0]}, ${cell[1]}, ${cell[2]}`, ...point);
}
function show(state, context, size, cellRadius) {
    for (const item of state) {
        showCell(item, context, size, cellRadius);
    }
}
function cellsWithItems(game) {
    let cellsWithItems = Game.cells.map(cell => [...cell, null]);
    for (const [playerIndex, cells] of game.items.entries()) {
        for (const item of cells) { 
            cellsWithItems.find(cell => // getItem?
                cell[0] == item[0] &&
                cell[1] == item[1]
            )[2] = playerIndex;
        }
    }
    return cellsWithItems;
}
function createCanvas(size) {
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    return canvas;
}
function initSize(container) {
    let rectangle = container.getBoundingClientRect();
    return Math.min(rectangle.width, rectangle.height);
}
export default class Paradox {
    constructor(container) {
        this.size = initSize(container);
        this.canvas = createCanvas(this.size);
        container.prepend(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.cellRadius = this.size / 18;
        //this.colors = colors;
    }
    playHotSeat() {
        this.game = new Game();
        show(cellsWithItems(this.game), this.context, this.size, this.cellRadius); 
    }
    playWithRobot(playerColor) {
        
    }
    playOnline() {
        // connect()
        // findPartner()
        // Decide about first turn (color)
    }
}