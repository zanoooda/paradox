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

function initItems() {
    let items = [[mult(forward, -1)], [mult(forward, 1)]];
    for (const [index, cell] of getPerimeter(radius).entries()) {
        items[index % 2].push(cell);
    }
    return items;
}
function findPairs() {
    let pairs = [];
    let notPairedItems = items;
    for (const item of items) {
        for (const neighborCell of getNeighbors(item)) {
            // let neighborItem = getItem(notPairedItems, neighborCell);
            // if(neighborItem && neighborItem[2] != item[2]) {
            //     pairs.push([item, neighborItem]);
            //     removeItem(notPairedItems, item);
            // }
        }
    }
    return pairs;
}

function isItem(cell) {
    return [...initialItems[0], ...initialItems[1]].findIndex(item =>
        item[0] == cell[0] && item[1] == cell[1]) != -1 ? true : false;
}
function getItem(cell) {
    return initialItems.findIndex(sameColorItems =>
        sameColorItems.findIndex(item =>
            item[0] == cell[0] && item[1] == cell[1]) != -1);
}

class Game {
    //static directions = directions;
    static cells = cells;

    constructor() {
        this.items = initialItems;
        this.history = [];
    }

    move(pair, direction) {
        this.history.push([...pair, direction]);
        // itemsHistory
        // pairsHistory
        // ...
    }
    isLegal(move) { // [...pair, direction of the move (-1 is switch)]

    }
    findPairs() { // pair = [9, 9, [0, 1, 2, 3, 4, 5]]; // index of items of the first's and second's color item
        this.pairs = findPairs(this.items);
    }
    findAllMoves() {
        // also except option to make "back" (usethis.history)
    }
}

export default Game;