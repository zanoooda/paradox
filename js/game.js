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
    cells = initCells();

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
function initCells() {
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
function findPairs() {
    let pairs = [];
    // ...
    return pairs;
}
function findMoves(pair, anotherPropToExceptBack) {
    // also except option to make "back" (usethis.history)
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
        this.history = [];
    }

    // move(pair, direction) {
    //     updateItems(pair, direction)
    //     updateHistory(move, items = null, pairs = null)
    //     // ...
    // }
    updateItems(pair, direction) {

    }
    updateHistory(move, items = null, pairs = null) {
        //     this.history.push([...pair, direction]);
        //     // itemsHistory
        //     // pairsHistory
        //     // ...
    }
    winner() { // -1, 0, 1, 2 if nichya
        
    }
    isLegal(move, game) { // [...pair, direction of the move (-1 is switch)]

    }
    findPairs() { // pair = [9, 9, [0, 1, 2, 3, 4, 5]]; // index of items of the first's and second's color item
        return findPairs(this.items);
    }
}

export default Game;