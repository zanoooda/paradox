// TODO: Describe structs or wrap structs to classes with readable props
// TODO: Wrap unreadable/similar/duplicated struct manipulations to readable variables/methods

// Points can be calculated only once
// New state can be crated by old one and [move] (pair and direction) (state.updateState(move))

// TODO: Evaluation: (game) => -100|100
// Zobrist hashing for game state comparsing

import { Game, Grid } from './game.js';

const colors = ['red', 'blue'];

function getPoint(cell, size) { // TODO: Improve (width larger than height of the grid)
    const _cell = Grid.getExtendedCell([cell[0], cell[1]]); //:
    const distance = size / 12; // ?
    const x = (size / 2) + (distance * Math.sqrt(3) * (cell[0] + _cell[2] / 2)); // TODO: Math.sqrt(3) to const
    const y = (size / 2) + (distance * 3 / 2 * _cell[2]);
    return [x, y];
}
function getMidPoint(point0, point1) {
    return [(point0[0] + point1[0]) / 2, (point0[1] + point1[1]) / 2];
}
function getClickPoint(event, canvas) {
    return [
        event.pageX - canvas.offsetLeft - canvas.clientLeft,
        event.pageY - canvas.offsetTop - canvas.clientTop
    ];
}
function getClickedMoveDirection(clickPoint, state, clickRadius) {
    let clickedMoveDirection = null;
    if (state.selectedPairIndex != -1) {
        for (const move of state.moves) {
            if (getDistance([move[1], move[2]], clickPoint) < clickRadius) {
                clickedMoveDirection = move[0];
                break;
            }
        }
    }
    return clickedMoveDirection;
}
function getClickedPairIndex(clickPoint, pairs, clickRadius) { // TODO: Find clothest to click pair that in radius (Click can be overlapped by two pairs)
    return pairs.findIndex(pair => getDistance([pair[3], pair[4]], clickPoint) < clickRadius);
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
function canvasClick(event, that) {
    const clickPoint = getClickPoint(event, that.canvas);
    let clickedMoveDirection = getClickedMoveDirection(clickPoint, that.state, that.clickRadius);
    const clickedPairIndex = getClickedPairIndex(clickPoint, that.state.pairs, that.clickRadius);
    if (clickedMoveDirection != null) {
        const selectedPair = [
            that.state.pairs[that.state.selectedPairIndex][0],
            that.state.pairs[that.state.selectedPairIndex][1]
        ];
        that.game.move(selectedPair, clickedMoveDirection);
        that.state = new State(that.game, that.size, -1);
    }
    else if (clickedPairIndex != -1) {
        that.state = new State(that.game, that.size, clickedPairIndex);
    }
    show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator);
}
async function canvasClickWithRobot(event, that) { // TODO: Wrap dublications
    if (that.game.getCurrentPlayer() == that.me) {
        const clickPoint = getClickPoint(event, that.canvas);
        let clickedMoveDirection = getClickedMoveDirection(clickPoint, that.state, that.clickRadius);
        const clickedPairIndex = getClickedPairIndex(clickPoint, that.state.pairs, that.clickRadius);
        if (clickedMoveDirection != null) {
            const selectedPair = [
                that.state.pairs[that.state.selectedPairIndex][0],
                that.state.pairs[that.state.selectedPairIndex][1]
            ];
            that.game.move(selectedPair, clickedMoveDirection);
            that.state = new State(that.game, that.size, -1);

            //#region robot move
            const allMoves = that.game.getAllMoves();
            const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            const randomMovePairIndex = that.state.pairs.findIndex(pair => pair[0] == randomMove[0] && pair[1] == randomMove[1]);
            that.state = new State(that.game, that.size, randomMovePairIndex);
            show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator);
            await delay(1000);

            that.game.move([randomMove[0], randomMove[1]], randomMove[2]);
            that.state = new State(that.game, that.size, -1);
            //#endregion
        }
        else if (clickedPairIndex != -1) {
            that.state = new State(that.game, that.size, clickedPairIndex);
        }
        show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator);
    }
}
function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
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
    // context.fillStyle = 'black';
    // context.font = '10px sans';
    // context.fillText(`${cell[0]}, ${cell[1]}, ${-cell[0] - cell[1]}`, ...point);
    // if (typeof cell[5] !== 'undefined') {
    //     context.fillText(`index: ${cell[5]}`, point[0], point[1] + 12);
    // }
}
function getPairs(game, size) { // getPairsWithPoints() Another option is to get point by pairs and cells (with points)
    return game.pairs.map((pair) => {
        const cells = [game.items[0][pair[0]], game.items[1][pair[1]]];
        const points = [getPoint(cells[0], size), getPoint(cells[1], size)];
        const point = getMidPoint(points[0], points[1]);
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
    // context.fillStyle = 'black';
    // context.font = '10px sans';
    // context.fillText(`${pair[0]}, ${pair[1]}, [${pair[2]}]`, ...point);
}
function showSelectedPair(state, context, size, cellRadius) {
    if (state.selectedPairIndex != -1) {
        const pair = state.pairs[state.selectedPairIndex];
        const selectedCells = [
            state.cells.find(cell => cell[4] == 0 && cell[5] == pair[0]),
            state.cells.find(cell => cell[4] == 1 && cell[5] == pair[1])
        ];
        for (const cell of selectedCells) {
            showSelectedCell(cell, context, size, cellRadius);
        }
    }
}
function showSelectedCell(cell, context, size, cellRadius) {
    const point = [cell[2], cell[3]];
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    context.lineWidth = size / 36;
    context.strokeStyle = 'purple'
    context.stroke();
    context.lineWidth = 1;
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
        const point = getMidPoint(cell0NewPoint, cell1NewPoint);
        return [directionIndex, ...point];
    });
}
function showSelectedPairMoves(moves, context, size, clickRadius) {
    for (const move of moves) {
        showSelectedPairMove(move, context, size, clickRadius);
    }
}
function showSelectedPairMove(move, context, size, clickRadius) {
    const point = [move[1], move[2]];
    context.beginPath();
    context.arc(...point, size / 144, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = 'black';
    context.fill();
    // context.beginPath();
    // context.arc(...point, clickRadius, 0, 2 * Math.PI);
    // context.closePath();
    // context.strokeStyle = 'green';
    // context.stroke();
}
function showCurrentPlayer(currentPlayerIndex, context, size, indicator) {
    indicator.style.backgroundColor = colors[currentPlayerIndex];
    // console.log(currentPlayerIndex);
}
function show(state, context, size, cellRadius, clickRadius, indicator) {
    context.clearRect(0, 0, size, size);
    showCells(state.cells, context, cellRadius);
    showPairs(state.pairs, context, clickRadius);
    showSelectedPair(state, context, size, cellRadius);
    showSelectedPairMoves(state.moves, context, size, clickRadius);
    showCurrentPlayer(state.currentPlayerIndex, context, size, indicator);
    showWinner(state.winner, context, size);
}
function showWinner(winner, context, size) {
    if (winner != -1) {
        const midPoint = [size / 2, size / 2];
        const name = colors?.[winner]?.charAt(0)?.toUpperCase() + colors?.[winner]?.slice(1);
        const message = winner == 2 ? `Draw!` : `${name} player win!`;
        const fontSize = size / 10;
        context.fillStyle = 'white';
        context.globalAlpha = 0.6;
        context.fillRect(0, 0, size, size);
        context.globalAlpha = 1.0;
        context.fillStyle = 'black';
        context.font = `bold ${fontSize}px serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(message, ...midPoint);
    }
}
class Paradox {
    constructor(container, indicator) {
        this.container = container;
        this.indicator = indicator;

        this.size = getSize(this.container);
        this.clickRadius = this.size / 24;
        this.cellRadius = this.size / 18;
        this.canvas = createCanvas(this.size);
        this.context = this.canvas.getContext('2d');
        // this.container.innerHTML = '';
        this.container.prepend(this.canvas);
    }
    playHotSeat() {
        this.game = new Game();
        this.canvas.addEventListener('click', (event) => {
            canvasClick(event, this);
        }, false);
        this.state = new State(this.game, this.size, -1); // this.state | game.state ? Create state in show(state)?
        show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator);
    }
    async playWithRobot(playerIndex) { // TODO: Implement
        this.game = new Game();
        this.me = playerIndex;
        this.canvas.addEventListener('click', (event) => {
            canvasClickWithRobot(event, this);
        }, false);
        this.state = new State(this.game, this.size, -1); // this.state | game.state ? Create state in show(state)?
        if (this.me != 0) {
            //#region robot move
            const allMoves = this.game.getAllMoves();
            const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            const randomMovePairIndex = this.state.pairs.findIndex(pair => pair[0] == randomMove[0] && pair[1] == randomMove[1]);
            this.state = new State(this.game, this.size, randomMovePairIndex);
            show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator);
            await delay(1000);

            this.game.move([randomMove[0], randomMove[1]], randomMove[2]);
            this.state = new State(this.game, this.size, -1);
            //#endregion
        }
        show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator);
    }
    playOnline() { // TODO: Implement
    }
}
class State { // Can be struct. Otherwise: cells, pairs and moves can be classes. Anyway describe structs
    constructor(game, size, selectedPairIndex) {
        this.cells = getCells(game, size); // [[cell0, cell1, x, y (optonal), playerIndex, itemIndex], ...]
        this.pairs = getPairs(game, size); // [[player0ItemIndex, player1ItemIndex, [...legalMoveDirections], x, y], ...] // size or cells?
        this.selectedPairIndex = selectedPairIndex; // -1|0...
        this.moves = getSelectedPairMoves(this.selectedPairIndex, this.pairs, this.cells, size); // [[directionIndex, x, y], ...]
        this.currentPlayerIndex = game.getCurrentPlayer();
        this.winner = game.winner;
    }
}

export default Paradox;