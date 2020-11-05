import { Game, Grid } from './game.js';
// TODO: Describe structs or wrap structs to classes with readable props
// TODO: Wrap unreadable struct manipulations to readable variables/methods
// State can be recreated on each click and not be saved at the game
// Cell's points can be calculated only once (also pairs and moves)
// new State can be crated by old one and [move] (pair and direction) (state.updateState(move))
// ...
const colors = ['red', 'blue'];

function getPoint(cell, size) { // TODO: Improve and fix
    const cell2 = -cell[1] - cell[0]; //:
    const distance = size / 12;
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
function canvasClick(event, that) { // TODO: Implement
    const point = [
        event.pageX - that.canvas.offsetLeft - that.canvas.clientLeft,
        event.pageY - that.canvas.offsetTop - that.canvas.clientTop
    ];

    // select or move ...
    const clickedPairIndex = that.game.state.pairs.findIndex(pair => getDistance([pair[3], pair[4]], point) < that.clickRadius);
    const clickedMoveDirection = null; // cklicked point close to allowed direction's (move) point of that.game.state.selectedPairIndex ? value : null
    const unselected = -1;
    if (clickedPairIndex != -1) {
        if (clickedPairIndex === that.game.state.selectedPairIndex) {
            const pair = [that.game.state.pairs[clickedPairIndex][0], that.game.state.pairs[clickedPairIndex][1]];
            that.game.move(pair, Grid.swap);
            that.game.state = new State(that.game, that.size, unselected); // that.game.state.updateState([...pair], Grid.swap);
            // ...
        }
        else { // select
            that.game.state.selectedPairIndex = clickedPairIndex;
            // ...
        }
    }
    else if (clickedMoveDirection != null) {
        const pair = [thst.game.state.pairs[clickedPairIndex][0], thst.game.state.pairs[clickedPairIndex][1]];
        that.game.move(pair, clickedMoveDirection);
        that.game.state = new State(that.game, that.size, unselected); // that.game.state.updateState([...pair], clickedMoveDirection);
        // ...
    }
    // ...
    // moves = getSelectedPairMoves(state) [ directionIndex, x, y ], ... ] // right way because if swap can be last move
    const moves = getSelectedPairMoves(that.state);
    // if clicked on a move => game.move()
    // else if clicked on a pair => select()

    // showState(state, context, cellRadius, clickRadius)
    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
    showCells(that.game.state.cells, that.context, that.cellRadius);
    showPairs(that.game.state.pairs, that.context, that.clickRadius);
    showSelectedPair(that.game.state, that.context, that.cellRadius);
    showSelectedPairMoves(moves, that.context, that.clickRadius);

    console.log(`${point[0]}, ${point[1]}`);
}
function getCells(game, size) { // showCellsAndItems
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
        const point = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2]; // wrap to function
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
    context.strokeStyle = 'purple'
    context.stroke();
    context.fillStyle = 'black'; // duplicated
    context.font = '10px Arial'; // duplicated
    context.fillText(`${pair[0]}, ${pair[1]}, [${pair[2]}]`, ...point);
}
function showSelectedPair(state, context, cellRadius) { // Improve
    if (state.selectedPairIndex != -1) {
        const pair = state.pairs[state.selectedPairIndex];
        const selectedCells = [
            state.cells.find(cell => typeof cell[5] !== 'undefined' && cell[4] == 0 && cell[5] == pair[0]),
            state.cells.find(cell => typeof cell[5] !== 'undefined' && cell[4] == 1 && cell[5] == pair[1])
        ];
        for(const cell of selectedCells) {
            showSelectedCell(cell, context, cellRadius);
        }
    }
}
function showSelectedCell(cell, context, cellRadius) { // Improve
    const point = [cell[2], cell[3]];
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    context.lineWidth = cellRadius / 2;
    context.strokeStyle = 'purple'
    context.stroke();
    context.lineWidth = 1; //:
}
function getSelectedPairMoves(state) { // Implement
    const movesWithPoint = [];
    // ...
    return movesWithPoint;
}
function showSelectedPairMoves(moves, context, clickRadius) { // Implement
    // ...
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

        this.game.state = new State(this.game, this.size, -1); // this.state | game.state ? Create state in show(state)?
        // showState(state, context, cellRadius, clickRadius)
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        showCells(this.game.state.cells, this.context, this.cellRadius);
        showPairs(this.game.state.pairs, this.context, this.clickRadius);
        // showSelectedPair();
        // showSelectedPairMoves();
    }
    playWithRobot(playerIndex) { // TODO: Implement
    }
    playOnline() { // TODO: Implement
    }
}
class State { // Can be struct but another way cells, pairs and moves can be classes
    constructor(game, size, selectedPairIndex) {
        this.cells = getCells(game, size);
        this.pairs = getPairs(game, size); // size or cells? pairs => pairsWithMoves
        this.selectedPairIndex = selectedPairIndex;
    }
}

export default Paradox;