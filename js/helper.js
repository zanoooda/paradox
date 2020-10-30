const radius = 3,
    directions = [
        [-1, 0], // ↙
        [-1, 1], // ←
        [0, 1],  // ↖
        [1, 0],  // ↗
        [1, -1], // →
        [0, -1]  // ↘
    ],
    forward = directions[4];

function getPerimeter(radius) {
    let perimeter = [forward.map(i => i * radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex % radius == 0, diameterIndex++) {
        perimeter.push(getNeighbor(perimeter[perimeter.length - 1], directions[directionIndex]));
    }
    return perimeter;
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

function initItems() {
    let items = [
        [forward.map(i => i * -1)],
        [forward.map(i => i * 1)]];
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
            // let neighborItem = getItemByCell(notPairedItems, neighborCell);
            // if(neighborItem && neighborItem[3] != item[3]) {
            //     pairs.push([item, neighborItem]);
            //     removeItem(notPairedItems, item);
            // }
        }
    }
    return pairs;
}

const initialItems = initItems();

// let initialItems = [
//     [[-1, 1], [3, -3], [1, -3], [-1, -2], [-3, 0], [-3, 2], [-2, 3], [0, 3], [2, 1], [3, -1]], // first color
//     [[1, -1], [2, -3], [0, -3], [-2, -1], [-3, 1], [-3, 3], [-1, 3], [1, 2], [3, 0], [3, -2]]  // second color
// ];

let move = [9, 9, -1]; // ...pair, direction of the move (-1 is switch)

let itemsHistory = [];
let pairsHistory = [];

let item = getItem([-1, 3]);

function isItem(cell) {
    return [...initialItems[0], ...initialItems[1]].findIndex(item =>
        item[0] == cell[0] && item[1] == cell[1]) != -1 ? true : false;
}
function getItem(cell) {
    return initialItems.findIndex(sameColorItems =>
        sameColorItems.findIndex(item =>
            item[0] == cell[0] && item[1] == cell[1]) != -1);
}

let pairs = [
    [9, 5],
    [8, 4]
    // ...
];
let pair = [9, 9]; // index of the first's and second's color item

class Game {
    static directions = directions;
    static getPerimeter(radius) {
        return getPerimeter();
    }

    constructor() {
        this.items = initialItems;
        this.history = [];
    }
    move(pair, direction) {
        this.history.push([...pair, direction]);
    }
    findPairs() {
        this.pairs = findPairs(this.items);
    }
    findAllMoves() {

    }
}

export default Game;