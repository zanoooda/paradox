import Game from "./game.js";

const colors = ['red', 'blue'];

function getPoint(cell, size) {
    cell.splice(2, 0, -cell[1] - cell[0]);
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
    canvas.addEventListener('click', click, false);
    return canvas;
}
function click(event) {
    alert(`${JSON.stringify(event)}`); // TODO: Alert [point]
}
function showCells(cells, context, size, cellRadius) {
    for (const cell of cells) {
        showCell(cell, context, size, cellRadius);
    }
}
function showCell(cell, context, size, cellRadius) {
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
function selectPair(pair) {
    // ...
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
        showCells(cellsWithItems(this.game), this.context, this.size, this.cellRadius);
    }
    playWithRobot(playerColor) {

    }
    playOnline() {
        // connect()
        // findPartner()
        // Decide about first turn (color)
    }
}

export default Paradox;