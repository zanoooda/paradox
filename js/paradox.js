// TODO: Describe structs or wrap structs to classes with readable props
// TODO: Wrap unreadable/similar/duplicated struct manipulations to readable variables/methods
// TODO: Fix -0
// Points can be calculated only once
// New state can be crated by old one and [move] (pair and direction) (state.updateState(move))
// ...

import { Game, Grid } from './game.js';

const colors = ['red', 'blue'];

function getPoint(cell, size) { // TODO: Improve and fix
    const cell2 = -cell[1] - cell[0]; //:
    const distance = size / 12; // ?
    const x = (size / 2) + (distance * Math.sqrt(3) * (cell[0] + cell2 / 2)); // TODO: Math.sqrt(3) to const
    const y = (size / 2) + (distance * 3 / 2 * cell2);
    return [x, y];
}
function getDistance(point0, point1) {
    return Math.sqrt(Math.pow(point0[0] - point1[0], 2) + Math.pow(point0[1] - point1[1], 2));
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
function canvasClick(event, that) { // TODO: Improve (Find clothest to click pair that in radius)
    const point = [
        event.pageX - that.canvas.offsetLeft - that.canvas.clientLeft,
        event.pageY - that.canvas.offsetTop - that.canvas.clientTop
    ];
    let clickedMoveDirection = null; // => that.state.selectedPairIndex != -1
    for (const move of that.state.moves) { // TODO: Wrap to getClickedMoveDirection()
        if (getDistance([move[1], move[2]], point) < that.clickRadius) {
            clickedMoveDirection = move[0];
            break;
        }
    }
    const clickedPairIndex = that.state.pairs.findIndex(pair => getDistance([pair[3], pair[4]], point) < that.clickRadius);
    // TODO: Find clothest to click pair that in radius (Click can be overlapped by two pairs)
    if (clickedMoveDirection != null) { // that.state.selectedPairIndex != -1
        const selectedPair = [
            that.state.pairs[that.state.selectedPairIndex][0],
            that.state.pairs[that.state.selectedPairIndex][1]
        ];
        that.game.move(selectedPair, clickedMoveDirection);
        // TODO: Check winner
        // ...
        that.state = new State(that.game, that.size, -1);
    }
    else if (clickedPairIndex != -1) {
        that.state = new State(that.game, that.size, clickedPairIndex);
    }
    show(that.state, that.context, that.size, that.cellRadius, that.clickRadius);
}
function getCells(game, size) { // getCellsWithItemsAndPoints()
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
    }
    else {
        context.strokeStyle = 'lightgray'
        context.stroke();
    }
    // context.fillStyle = 'black'; // duplicated
    // context.font = '10px Arial'; // duplicated
    // context.fillText(`${cell[0]}, ${cell[1]}, ${-cell[0] - cell[1]}`, ...point);
    // if (typeof cell[5] !== 'undefined') {
    //     context.fillText(`id: ${cell[5]}`, point[0], point[1] + 12);
    // }
}
function getPairs(game, size) { // getPairsWithPoints() Another option is to get point by pairs and cells (with points)
    return game.pairs.map((pair) => {
        const cells = [game.items[0][pair[0]], game.items[1][pair[1]]];
        const points = [getPoint(cells[0], size), getPoint(cells[1], size)];
        const point = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2]; // TODO: Wrap
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
    // context.beginPath();
    // context.arc(...point, clickRadius, 0, 2 * Math.PI);
    // context.closePath();
    // context.strokeStyle = 'purple'
    // context.stroke();
    // context.fillStyle = 'black'; // duplicated
    // context.font = '10px Arial'; // duplicated
    // context.fillText(`${pair[0]}, ${pair[1]}, [${pair[2]}]`, ...point);
}
function showSelectedPair(state, context, cellRadius) {
    if (state.selectedPairIndex != -1) {
        const pair = state.pairs[state.selectedPairIndex];
        const selectedCells = [
            state.cells.find(cell => cell[4] == 0 && cell[5] == pair[0]),
            state.cells.find(cell => cell[4] == 1 && cell[5] == pair[1])
        ];
        for (const cell of selectedCells) {
            showSelectedCell(cell, context, cellRadius);
        }
    }
}
function showSelectedCell(cell, context, cellRadius) {
    const point = [cell[2], cell[3]];
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    context.lineWidth = cellRadius / 2;
    context.strokeStyle = 'purple'
    context.stroke();
    context.lineWidth = 1; //:
}
function getSelectedPairMoves(selectedPairIndex, pairs, cells, size) { // TODO: Improve // getSelectedPairMoveDirectionsWithPoints()
    if (selectedPairIndex == -1) {
        return [];
    }
    return pairs[selectedPairIndex][2].map(directionIndex => {
        if (directionIndex == Grid.swap) {
            const point = [pairs[selectedPairIndex][3], pairs[selectedPairIndex][4]]
            return [directionIndex, ...point];
        }
        const cell0 = cells.find(cell => cell[4] == 0 && cell[5] == pairs[selectedPairIndex][0]);
        const cell1 = cells.find(cell => cell[4] == 1 && cell[5] == pairs[selectedPairIndex][1]);
        const cell0NewPoint = getPoint(Grid.getNeighbor(cell0, directionIndex), size);
        const cell1NewPoint = getPoint(Grid.getNeighbor(cell1, directionIndex), size);
        const point = [(cell0NewPoint[0] + cell1NewPoint[0]) / 2, (cell0NewPoint[1] + cell1NewPoint[1]) / 2]; // TODO: Wrap
        return [directionIndex, ...point];
    });
}
function showSelectedPairMoves(moves, context, clickRadius) {
    for (const move of moves) {
        showSelectedPairMove(move, context, clickRadius);
    }
}
function showSelectedPairMove(move, context, clickRadius) { // TODO: Improve
    const point = [move[1], move[2]];
    context.beginPath();
    context.arc(...point, clickRadius / 3, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = 'green'
    context.fill();
    // const unicodeDirections = ['↙', '←', '↖', '↗', '→', '↘'];
    // const swap = '↔';
    const unicodeDirections = ['⬋', '⬅', '⬉', '⬈', '➡', '⬊'];
    const swap = '⬌';
    context.fillStyle = 'white'; // duplicated
    context.font = '10px Arial'; // duplicated
    context.fillText(`${move[0] == Grid.swap ? swap : unicodeDirections[move[0]]}`, point[0] - 4, point[1] + 2);
    // context.beginPath();
    // context.arc(...point, clickRadius, 0, 2 * Math.PI);
    // context.closePath();
    // context.strokeStyle = 'green'
    // context.stroke();
}
function show(state, context, size, cellRadius, clickRadius) {
    context.clearRect(0, 0, size, size);
    showCells(state.cells, context, cellRadius);
    showPairs(state.pairs, context, clickRadius);
    showSelectedPair(state, context, cellRadius);
    showSelectedPairMoves(state.moves, context, clickRadius);
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
            canvasClick(event, this);
        }, false);
        this.container.innerHTML = '';
        this.container.prepend(this.canvas);
        this.state = new State(this.game, this.size, -1); // this.state | game.state ? Create state in show(state)?
        show(this.state, this.context, this.size, this.cellRadius, this.clickRadius);
    }
    playWithRobot(playerIndex) { // TODO: Implement
    }
    playOnline() { // TODO: Implement
    }
}
class State { // Can be struct but another way cells, pairs and moves can be classes. Anyway describe structs
    constructor(game, size, selectedPairIndex) {
        this.cells = getCells(game, size); // [[cell0, cell1, x, y (optonal), playerIndex, itemIndex], ...]
        this.pairs = getPairs(game, size); // [[player0ItemIndex, player1ItemIndex, [...legalMoveDirections], x, y], ...] // size or cells?
        this.selectedPairIndex = selectedPairIndex; // -1|0...
        this.moves = getSelectedPairMoves(this.selectedPairIndex, this.pairs, this.cells, size); // [[directionIndex, x, y], ...]
    }
}

export default Paradox;