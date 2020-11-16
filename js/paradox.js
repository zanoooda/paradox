// resize fire twice

// TODO: Show message

// Points can be calculated only once
// New state can be crated by old one; and move (state.updateState(move))

import { Game, cells, swap, getNeighbor, getExtendedCell } from './game.js';
import { findMove as findRobotMove } from './robot.js';

const colors = ['red', 'blue'],
    types = { hotSeat: 0, withRobot: 1, online: 2 },
    sqrt3 = Math.sqrt(3);

function getPoint(cell, size) {
    const _cell = getExtendedCell([cell[0], cell[1]]);
    const distance = size / 12;
    const x = (size / 2) + (distance * sqrt3 * (cell[0] + _cell[2] / 2));
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
function getClickedPairIndex(clickPoint, pairs, clickRadius) {
    const distances = pairs.map(pair => getDistance([pair[3], pair[4]], clickPoint));
    const minDistance = Math.min(...distances);
    const minDistancePairIndex = distances.findIndex(distance => distance == minDistance);
    if (minDistance < clickRadius) {
        return minDistancePairIndex;
    }
    else {
        return -1;
    }
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
    switch (that.type) {
        case types.hotSeat:
            continueHotSeat(event, that);
            break;
        case types.withRobot:
            continueWithRobot(event, that);
            break;
        case types.online:
            continueOnline(event, that);
            break;
        default:
            break;
    }
}
function fixOverlaps(clickPoint, clickedMoveDirection, clickedPairIndex, that) {
    if (clickedMoveDirection != null && clickedPairIndex != -1) {
        const clickedMove = that.state.moves.find(move => move[0] == clickedMoveDirection);
        const clickedMovePoint = [clickedMove[1], clickedMove[2]];
        const clickedMoveDirectionDistance = getDistance(clickPoint, clickedMovePoint);
        const clickedPair = that.state.pairs[clickedPairIndex];
        const clickedPairPoint = [clickedPair[3], clickedPair[4]];
        const clickedPairDistance = getDistance(clickPoint, clickedPairPoint);
        const diff = clickedMoveDirectionDistance - clickedPairDistance;
        if (diff > 0) {
            clickedMoveDirection = null;
        }
    }
    return clickedMoveDirection;
}
async function continueHotSeat(event, that) {
    const clickPoint = getClickPoint(event, that.canvas);
    let clickedMoveDirection = getClickedMoveDirection(clickPoint, that.state, that.clickRadius);
    const clickedPairIndex = getClickedPairIndex(clickPoint, that.state.pairs, that.clickRadius);
    clickedMoveDirection = fixOverlaps(clickPoint, clickedMoveDirection, clickedPairIndex, that);
    if (clickedMoveDirection != null) {
        const selectedPair = [
            that.state.pairs[that.state.selectedPairIndex][0],
            that.state.pairs[that.state.selectedPairIndex][1]
        ];
        that.game.move(selectedPair, clickedMoveDirection);
        that.state = new State(that.game, that.size, -1, that.type, null, false);
    }
    else if (clickedPairIndex != -1) {
        that.state = new State(that.game, that.size, clickedPairIndex, that.type, null, false);
    }
    await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
}
async function continueWithRobot(event, that) {
    if (that.game.getCurrentPlayer() == that.player) {
        const clickPoint = getClickPoint(event, that.canvas);
        let clickedMoveDirection = getClickedMoveDirection(clickPoint, that.state, that.clickRadius);
        const clickedPairIndex = getClickedPairIndex(clickPoint, that.state.pairs, that.clickRadius);
        clickedMoveDirection = fixOverlaps(clickPoint, clickedMoveDirection, clickedPairIndex, that);
        if (clickedMoveDirection != null) {
            const selectedPair = [
                that.state.pairs[that.state.selectedPairIndex][0],
                that.state.pairs[that.state.selectedPairIndex][1]
            ];
            that.game.move(selectedPair, clickedMoveDirection);
            that.state = new State(that.game, that.size, -1, that.type, that.player, false);
            await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
            if (that.state.winner != -1) {
                return;
            }
            showSpinner(that.spinner);
            await delay(500);
            await robotPlay(that);
        }
        else if (clickedPairIndex != -1) {
            that.state = new State(that.game, that.size, clickedPairIndex, that.type, that.player, false);
        }
        await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
    }
}
async function continueOnline(event, that) {
    if (that.game.getCurrentPlayer() == that.player) {
        const clickPoint = getClickPoint(event, that.canvas);
        let clickedMoveDirection = getClickedMoveDirection(clickPoint, that.state, that.clickRadius);
        const clickedPairIndex = getClickedPairIndex(clickPoint, that.state.pairs, that.clickRadius);
        clickedMoveDirection = fixOverlaps(clickPoint, clickedMoveDirection, clickedPairIndex, that);
        if (clickedMoveDirection != null) {
            const selectedPair = [
                that.state.pairs[that.state.selectedPairIndex][0],
                that.state.pairs[that.state.selectedPairIndex][1]
            ];
            that.game.move(selectedPair, clickedMoveDirection);
            that.state = new State(that.game, that.size, -1, that.type, that.player, false);
            await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
            if (that.state.winner == -1) {
                showSpinner(that.spinner, 'wait for the partner');
            }
            that.socket.emit('move', [...selectedPair, clickedMoveDirection]);
        }
        else if (clickedPairIndex != -1) {
            that.state = new State(that.game, that.size, clickedPairIndex, that.type, that.player, false);
        }
        await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);


    }
}
async function robotPlay(that) {
    that.lock = true;
    const robotMove = findRobotMove(that.game, that.depth);
    hideSpinner(that.spinner);
    const robotMovePairIndex = that.state.pairs.findIndex(pair => pair[0] == robotMove[0] && pair[1] == robotMove[1]); // dublication
    that.state = new State(that.game, that.size, robotMovePairIndex, that.type, that.player, false);
    await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
    await delay(1000);
    that.game.move([robotMove[0], robotMove[1]], robotMove[2]);
    that.state = new State(that.game, that.size, -1, that.type, that.player, false);
    that.lock = false;
}
function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}
function getCells(game, size) { // getCellsWithItemsAndPoints()
    return cells.map(cell => {
        const point = getPoint([cell[0], cell[1]], size);
        const player = game.findPlayer(cell);
        if (player != -1) {
            const itemIndex = game.findItemIndex(cell, player);
            return [...cell, ...point, player, itemIndex];
        }
        return [...cell, ...point];
    });
}
function showCells(cells, context, cellRadius, playerToHighlight) {
    for (const cell of cells) {
        showCell(cell, context, cellRadius, playerToHighlight);
    }
}
function showCell(cell, context, cellRadius, playerToHighlight) {
    const point = [cell[2], cell[3]];
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    if (typeof cell[4] !== 'undefined') {
        context.fillStyle = colors[cell[4]];
        context.fill();
        if (playerToHighlight == cell[4]) {
            context.beginPath();
            context.arc(...point, cellRadius + (cellRadius / 5), 0, 2 * Math.PI);
            context.closePath();
            context.lineWidth = 2;
            context.strokeStyle = colors[cell[4]];
            context.stroke();
            context.lineWidth = 1;
        }
    }
    else {
        context.strokeStyle = 'lightgray';
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
    context.strokeStyle = 'purple';
    context.stroke();
    context.lineWidth = 1;
}
function getSelectedPairMoves(selectedPairIndex, pairs, cells, size) { // getSelectedPairMoveDirectionsWithPoints()
    if (selectedPairIndex == -1) {
        return [];
    }
    return pairs[selectedPairIndex][2].map(directionIndex => {
        if (directionIndex == swap) {
            const point = [pairs[selectedPairIndex][3], pairs[selectedPairIndex][4]]
            return [directionIndex, ...point];
        }
        const cell0 = cells.find(cell => cell[4] == 0 && cell[5] == pairs[selectedPairIndex][0]);
        const cell1 = cells.find(cell => cell[4] == 1 && cell[5] == pairs[selectedPairIndex][1]);
        const cell0NewPoint = getPoint(getNeighbor(cell0, directionIndex), size);
        const cell1NewPoint = getPoint(getNeighbor(cell1, directionIndex), size);
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
async function showCurrentPlayer(state, context, size, indicator) { // !
    if (
        state.selectedPairIndex == -1 &&
        indicator.style.backgroundColor != colors[state.currentPlayer] &&
        state.winner == -1
    ) {
        hideIndicator(indicator);
        await delay(500);
        showIndicator(indicator, colors[state.currentPlayer]);
    }
}
function showWinner(winner, context, size) {
    if (winner != -1) {
        const midPoint = [size / 2, size / 2];
        const name = colors?.[winner]?.charAt(0)?.toUpperCase() + colors?.[winner]?.slice(1);
        const message = winner == 2 ? `Draw!` : `${name} player win!`;
        context.fillStyle = 'white';
        context.globalAlpha = 0.8;
        context.fillRect(0, 0, size, size);
        context.globalAlpha = 1.0;
        context.fillStyle = 'black';
        context.font = `bold 1em sans`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(message, ...midPoint);
    }
}
function showUndoButton(undoButton, state) {
    undoButton.classList.remove('show');
    if (state.undoButtonVisibility) {
        undoButton.classList.add('show');
    }
}
function showReplayLastMoveButton(replayLastMoveButton, state) {
    replayLastMoveButton.classList.remove('show');
    if (state.replayLastMoveButtonVisibility) {
        replayLastMoveButton.classList.add('show');
    }
}
async function show(state, context, size, cellRadius, clickRadius, indicator, undoButton, replayLastMoveButton) {
    context.clearRect(0, 0, size, size);
    showCells(state.cells, context, cellRadius, state.playerToHighlight);
    showPairs(state.pairs, context, clickRadius);
    showSelectedPair(state, context, size, cellRadius);
    showSelectedPairMoves(state.moves, context, size, clickRadius);
    await showCurrentPlayer(state, context, size, indicator);
    showWinner(state.winner, context, size);
    showUndoButton(undoButton, state);
    showReplayLastMoveButton(replayLastMoveButton, state);
}
function showSpinner(spinner, message) {
    spinner.innerHTML = message ?? '';
    spinner.classList.add('show');
}
function hideSpinner(spinner) {
    spinner.innerHTML = '';
    spinner.classList.remove('show');
}
function attachMessage(spinner, message) {
    spinner.innerHTML += message;
}
function showIndicator(indicator, color) {
    indicator.style.backgroundColor = color;
    indicator.classList.add('show');
}
function hideIndicator(indicator) {
    indicator.style.backgroundColor = 'inherit';
    indicator.classList.remove('show');
}
async function undoClick(that) {
    switch (that.type) {
        case types.hotSeat:
            await undoHotSeat(that);
            break;
        case types.withRobot:
            await undoRobot(that);
            break;
        case types.online:
            break;
        default:
            break;
    }
}
async function undoHotSeat(that) {
    that.lock = true;
    await undo(that);
    that.lock = false;
}
async function undoRobot(that) {
    that.lock = true;
    const undoOnce = that.game.getCurrentPlayer() != that.player;
    await undo(that);
    if (!undoOnce) {
        await delay(500);
        await undo(that);
    }
    that.lock = false;
}
async function undo(that) {
    const prevMove = that.game.getPrevMove();
    // if (lastMove) {
    const selectedPairIndex = that.state.pairs.findIndex(pair => pair[0] == prevMove[0] && pair[1] == prevMove[1]); // dublication
    that.state = new State(that.game, that.size, selectedPairIndex, that.type, that.player, false);
    await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
    await delay(500)
    that.game.undo();
    that.state = new State(that.game, that.size, -1, that.type, that.player, false);
    await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
    // }
}
function replayLastMoveClick(that) {
    replayLastMove(that);
}
async function replayLastMove(that) {
    const lastMove = that.game.history?.[that.game.history.length - 1];
    let _game = new Game(that.game);
    _game.undo();
    const selectedPairIndex = _game.pairs.findIndex(pair => pair[0] == lastMove[0] && pair[1] == lastMove[1]); // dublication
    let _state = new State(_game, that.size, selectedPairIndex, that.type, that.player, that.type == types.hotSeat ? false : true);
    await show(_state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
    await delay(1000);
    await show(that.state, that.context, that.size, that.cellRadius, that.clickRadius, that.indicator, that.undoButton, that.replayLastMoveButton);
}

class Paradox {
    constructor(container, indicator, undoButton, replayLastMoveButton, spinner) {
        this.container = container;
        this.indicator = indicator;
        this.undoButton = undoButton;
        this.spinner = spinner;
        this.replayLastMoveButton = replayLastMoveButton;
        this.size = getSize(this.container);
        this.clickRadius = this.size / 16; // wrap to settings
        this.cellRadius = this.size / 18; // wrap to settings
        this.canvas = createCanvas(this.size);
        this.context = this.canvas.getContext('2d');
        this.depth = 2;

        this.canvas.addEventListener('click', (event) => {
            canvasClick(event, this);
        }, false);
        this.undoButton.addEventListener('click', () => {
            if (this.lock) return;
            undoClick(this);
        }, false);
        this.replayLastMoveButton.addEventListener('click', () => {
            if (this.lock) return;
            replayLastMoveClick(this);
        }, false);

        this.container.innerHTML = '';
        this.container.prepend(this.canvas);
    }
    async playHotSeat() {
        this.type = types.hotSeat;
        this.game = new Game();
        this.state = new State(this.game, this.size, -1, this.type, null, false);
        await show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator, this.undoButton, this.replayLastMoveButton);
    }
    async playWithRobot(player) {
        this.type = types.withRobot;
        this.player = player;
        this.game = new Game();
        this.state = new State(this.game, this.size, -1, this.type, this.player, false);
        if (this.player != 0) {
            await show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator, this.undoButton, this.replayLastMoveButton);
            // this.spinner.classList.add('show');
            showSpinner(this.spinner);
            await delay(500);
            await robotPlay(this);
        }
        await show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator, this.undoButton, this.replayLastMoveButton);
    }
    async playOnline(player, socket) {
        this.type = types.online;
        this.player = player;
        this.socket = socket;
        this.game = new Game();
        this.state = new State(this.game, this.size, -1, types.online, this.player, false);
        await show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator, this.undoButton, this.replayLastMoveButton);
        if (this.player != 0) {
            showSpinner(this.spinner, 'wait for the partner');
        }
    }
    move(move) { // async
        hideSpinner(this.spinner);
        // if move legal and partners turn
        this.game.move(move);
        this.state = new State(this.game, this.size, -1, types.online, this.player, false);
        show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator, this.undoButton, this.replayLastMoveButton); // await
        // else ...
    }
    stop() {
        this.type = null;
        this.socket = null;
        this.player = null;
        this.game = null;
        this.state = null;
        this.indicator.style.backgroundColor = 'inherit';
        this.context.clearRect(0, 0, this.size, this.size);
    }
    resize(size) {
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        this.context = this.canvas.getContext('2d');
        this.clickRadius = this.size / 16; // wrap to settings
        this.cellRadius = this.size / 18; // wrap to settings
        if (this.game) {
            this.state = new State(this.game, this.size, this?.state?.selectedPairIndex ?? -1, this.type, this?.player ?? null, false);
            show(this.state, this.context, this.size, this.cellRadius, this.clickRadius, this.indicator, this.undoButton, this.replayLastMoveButton);
        }
    }
}
class State {
    constructor(game, size, selectedPairIndex, type, player, highlightPlayerCells) {
        this.selectedPairIndex = selectedPairIndex; // -1|0...5
        this.cells = getCells(game, size); // [[cell[0], cell[1], x, y (optonal), player, itemIndex], ...]
        this.pairs = getPairs(game, size); // [[player0ItemIndex, player1ItemIndex, [...legalMoveDirections], x, y], ...]
        this.moves = getSelectedPairMoves(this.selectedPairIndex, this.pairs, this.cells, size); // [[directionIndex, x, y], ...]
        this.undoButtonVisibility = (type == types.hotSeat && game.history.length > 0) ||
            (type == types.withRobot && game.history.length > player + 1);
        this.replayLastMoveButtonVisibility = game.history.length > 0;
        this.currentPlayer = game.getCurrentPlayer();
        this.winner = game.winner; //
        this.playerToHighlight = highlightPlayerCells ? player : null;
    }
}

export { Paradox, showSpinner, hideSpinner, attachMessage };