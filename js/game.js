//#region grid
const radius = 3,
    directions = [
        [-1, 0], // ↙
        [-1, 1], // ←
        [0, 1],  // ↖
        [1, 0],  // ↗
        [1, -1], // →
        [0, -1]  // ↘
    ],
    forward = directions[4],
    initialItems = createItems(),
    cells = createCells();

function mult(array, scalar) {
    return array.map(i => i * scalar);
}
function getNeighbor(cell, direction) {
    return cell.map((n, i) => n + direction[i]);
}
function getNeighbors(cell) { //
    let neighbors = [];
    for (const direction of directions) {
        let neighbor = getNeighbor(cell, direction);
        neighbor.push(-neighbor[0] - neighbor[1]);
        if (Math.max(...neighbor.map(Math.abs)) <= radius) {
            neighbor.pop();
            neighbors.push(neighbor);
        }
    }
    return neighbors;
}
function getPerimeter(radius) {
    let perimeter = [mult(forward, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex % radius == 0, diameterIndex++) {
        perimeter.push(getNeighbor(perimeter[perimeter.length - 1], directions[directionIndex]));
    }
    return perimeter;
}
function createCells() {
    let cells = [];
    for (let r = 0; r <= radius; r++) {
        cells.push(...getPerimeter(r));
    }
    return cells;
}
//#endregion
function createItems() {
    let items = [[mult(forward, -1)], [mult(forward, 1)]];
    for (const [index, cell] of getPerimeter(radius).entries()) {
        items[index % 2].push(cell);
    }
    return items;
}
function findPairs(items, prevMove) { //
    let pairs = [];
    for(const [itemIndex, item] of items[0].entries()) {
        let neighbors = getNeighbors(item);
        for(const neighborCell of neighbors) {
            let neighborIndex = findItemIndex(neighborCell, items[1]);
            if(neighborIndex != -1) {
                let moves = findMoves([itemIndex, neighborIndex], items, prevMove);
                pairs.push([itemIndex, neighborIndex, moves]);
            }
        }
    }
    return pairs;
}
function findMoves(pair, items, prevMove) {
    let moves = [];
    // ...
    return moves;
}
function updateItems(move, items) {
    // ...
    return items;
}
function findWinner(items) {  
    // -1 (no one), 0, 1, 2 if draw
    return -1;
}
function findItem(cell, items) {
    return items.findIndex(sameItems => findItemIndex(cell, sameItems) != -1);
}
function findItemIndex(cell, items) {
    return items.findIndex(item => item[0] == cell[0] && item[1] == cell[1]);
}
function isLegal(move, items, prevMove) {
    // ...
    return true;
}
class Game {
    constructor() {
        this.items = initialItems;
        this.pairs = findPairs(this.items, null);
        this.history = [];
        this.winner = -1;
    }
    move(pair, direction) { // direction is directions index or -1|6 for switch
        let move = [...pair, direction];
        this.history.push([move, items, pairs]);
        this.items = updateItems(move, this.items);
        this.winner = findWinner(this.items);
        if(this.winner == -1) {
            this.pairs = findPairs(this.items, move);
        }
    }
    getCells() {
        return cells.map(cell => [...cell, findItem(cell, this.items)]);
    }
}

export default Game;