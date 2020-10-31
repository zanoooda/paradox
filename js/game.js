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
    initialItems = initItems(),
    cells = getCells();

function mult(array, scalar) {
    return array.map(i => i * scalar);
}
function getNeighbor(cell, direction) {
    return cell.map((n, i) => n + direction[i]);
}
function getNeighbors(cell) {
    let neighbors = [];
    for (const direction of directions) {
        let neighbor = getNeighbor(cell, direction);
        if (Math.max(...neighbor.map(Math.abs)) <= radius) {
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
function getCells() {
    let cells = [];
    for (let r = 0; r <= radius; r++) {
        cells.push(...getPerimeter(r));
    }
    return cells;
}
//#endregion
function initItems() {
    let items = [[mult(forward, -1)], [mult(forward, 1)]];
    for (const [index, cell] of getPerimeter(radius).entries()) {
        items[index % 2].push(cell);
    }
    return items;
}
function findPairs(items) {
    let pairs = [];
    // ...
    return pairs;
}
function findMoves(pairs, items, prevMove) {
    // ...
    return pairs;
}

function updateItems(move, items) {
    // ...
    return items;
}
function findWinner(items) {  // -1 (no one), 0, 1, 2 if draw
    return -1;
}
function findItem(cell, items) { // Test
    return items.findIndex(sameColorItems =>
        sameColorItems.findIndex(item =>
            item[0] == cell[0] && item[1] == cell[1]) != -1);
}

class Game {
    static cells = cells;
    constructor() {
        this.items = initialItems;
        this.pairs = findPairs(this.items);
        this.history = [];
    }
    move(pair, direction) {
        let move = [...pair, direction];
        this.history.push([move, items, pairs]);
        this.items = updateItems(move, this.items);
        let winner = findWinner(this.items);
        if(winner == -1) {
            this.pairs = findPairs(this.items);
            this.pairs = findMoves(this.pairs, this.items, move);
        } else {
            alert(`Win!`);
        }
    }
    isLegal(move, items, prevMove) { 
        
    }
}

export default Game;