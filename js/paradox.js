import { Game, Grid } from './game.js';
// TODO: Describe structs
const colors = ['red', 'blue'];

function getPoint(cell, size) { // TODO: Improve
    const cell2 = -cell[1] - cell[0]; //:
    const distance = size / 12;
    const x = (size / 2) + (distance * Math.sqrt(3) * (cell[0] + cell2 / 2)); // TODO: Math.sqrt(3) to const
    const y = (size / 2) + (distance * 3 / 2 * cell2);
    return [x, y];
}
function getSize(container) {
    const containerRect = container.getBoundingClientRect();
    return Math.min(containerRect.width, containerRect.height);
}
function createCanvas(size) {
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    return canvas;
}
function canvasClick(event, canvas, context, game, size, cellRadius, clickRadius) { // TODO: Implement
    const point = [
        event.pageX - canvas.offsetLeft - canvas.clientLeft,
        event.pageY - canvas.offsetTop - canvas.clientTop
    ];
    
    game.move([1, 1], -1);
    game.state = new State(game, size);
    context.clearRect(0, 0, canvas.width, canvas.height);
    showCells(game.state.cells, context, cellRadius);
    showPairs(game.state.pairs, context, clickRadius);

    console.log(`${point[0]}, ${point[1]}`);
}
function getCells(game, size) {
    return Grid.cells.map(cell => {
        const point = getPoint([cell[0], cell[1]], size);
        const playerIndex = game.findPlayerIndex(cell);
        if (playerIndex != -1) {
            const itemIndex = game.findItemIndex(cell, playerIndex);
            return [...cell, ...point, playerIndex, itemIndex];
        }
        return [...cell, ...point];
    });
}
function showCells(cells, context, cellRadius) {
    for (const cell of cells) {
        showCell(cell, context, cellRadius);
    }
}
function showCell(cell, context, cellRadius) {
    const point = [cell[2], cell[3]];
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    if (typeof cell[4] !== 'undefined') {
        context.fillStyle = colors[cell[4]];
        context.fill();
    } else {
        context.strokeStyle = 'lightgray'
        context.stroke();
    }
    context.fillStyle = 'black'; // duplicated
    context.font = '10px Arial'; // duplicated
    context.fillText(`${cell[0]}, ${cell[1]}, ${-cell[0] - cell[1]}`, ...point);
    if (typeof cell[5] !== 'undefined') {
        context.fillText(`id: ${cell[5]}`, point[0], point[1] + 12);
    }
}
function getPairs(game, size) { // Another option is to get point by pairs and cells (with points)
    return game.pairs.map((pair) => {
        const cells = [game.items[0][pair[0]], game.items[1][pair[1]]];
        const points = [getPoint(cells[0], size), getPoint(cells[1], size)];
        const point = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
        return [...pair, ...point];
    });
}
function showPairs(pairs, context, clickRadius) {
    for (const pair of pairs) {
        showPair(pair, context, clickRadius);
    }
}
function showPair(pair, context, clickRadius) {
    const point = [pair[3], pair[4]];
    context.beginPath();
    context.arc(...point, clickRadius, 0, 2 * Math.PI);
    context.closePath();
    context.strokeStyle = 'black'
    context.stroke();
    context.fillStyle = 'black'; // duplicated
    context.font = '10px Arial'; // duplicated
    context.fillText(`${pair[0]}, ${pair[1]}, [${pair[2]}]`, ...point);
}
class Paradox {
    constructor(container) {
        this.container = container;
    }
    playHotSeat() {
        this.game = new Game();
        this.size = getSize(this.container);
        this.clickRadius = this.size / 24;
        this.cellRadius = this.size / 18;
        this.canvas = createCanvas(this.size);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('click', (event) => {
            canvasClick(event, this.canvas, this.context, this.game, this.size, this.cellRadius, this.clickRadius) // too many params
        }, false);
        this.container.innerHTML = '';
        this.container.prepend(this.canvas);
        this.game.state = new State(this.game, this.size);
        showCells(this.game.state.cells, this.context, this.cellRadius);
        showPairs(this.game.state.pairs, this.context, this.clickRadius);
    }
    playWithRobot(playerIndex) { // TODO: Implement
    }
    playOnline() { // TODO: Implement
    }
}
class State { // Can be struct
    constructor(game, size) {
        this.cells = getCells(game, size);
        this.pairs = getPairs(game, size); // size or cells? pairs => pairsWithMoves
    }
}

export default Paradox;