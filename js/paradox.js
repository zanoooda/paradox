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
function itemsOnTheCells(game) {
    let itemsOnTheGrid = Game.getCells().map(cell => [...cell, null]);
    for (let playerIndex = 0; playerIndex < game.items.length; playerIndex++) {
        for (const item of game.items[playerIndex]) { 
            itemsOnTheGrid.find(cell => // getItem
                cell[0] == item[0] &&
                cell[1] == item[1]
            )[2] = playerIndex;
        }
    }
    return itemsOnTheGrid;
}
export default class Paradox {
    constructor(container) {
        let rectangle = container.getBoundingClientRect();
        this.size = Math.min(rectangle.width, rectangle.height);

        this.canvas = document.createElement('canvas'); // TODO: Wrap
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        container.prepend(this.canvas);

        this.context = this.canvas.getContext('2d');
        this.cellRadius = this.size / 18;
        this.colors = colors;

        this.game = new Game();

        this.socket = null;
    }
    playHotSeat() {
        show(itemsOnTheCells(this.game), this.context, this.size, this.cellRadius); 
    }
    playWithRobot(playerColor) {
        
    }
    playOnline() {
        // connect()
        // findPartner()
        // Decide about first turn (color)
    }
}