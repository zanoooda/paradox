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

function getPerimeter() {

}

let items = [
    [[-1, 1], [3, -3], [1, -3], [-1, -2], [-3, 0], [-3, 2], [-2, 3], [0, 3], [2, 1], [3, -1]], // first color
    [[1, -1], [2, -3], [0, -3], [-2, -1], [-3, 1], [-3, 3], [-1, 3], [1, 2], [3, 0], [3, -2]]  // second color
];

let move = [9, 9, -1]; // ...pair, direction of the move (-1 is switch)

let itemsHistory = [];
let pairsHistory = [];

let item = getItem([-1, 3]);

function isItem(cell) {
    return [...items[0], ...items[1]].findIndex(item =>
        item[0] == cell[0] && item[1] == cell[1]) != -1 ? true : false;
}
function getItem(cell) {
    return items.findIndex(sameColorItems =>
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
        this.items = items;
        //this.directions = directions;
        this.history = []; // pairsHistory
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