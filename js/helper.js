const radius = 3,
    directions = [
        [-1, 0], // ↙
        [-1, 1], // ←
        [0, 1],  // ↖
        [1, 0],  // ↗
        [1, -1], // →
        [0, -1]  // ↘
    ],
    startDirection = directions[4];

let items = [
    [[-1, 1], [3, -3], [1, -3], [-1, -2], [-3, 0], [-3, 2], [-2, 3], [0, 3], [2, 1], [3, -1]], // first color
    [[1, -1], [2, -3], [0, -3], [-2, -1], [-3, 1], [-3, 3], [-1, 3], [1, 2], [3, 0], [3, -2]]  // second color
];

let move = [9, 5, -1]; // ...pair, direction of the move (-1 is switch)

let itemsHistory = [];
let pairsHistory = [];

let item = getColor([-1, 3]);

function getColor(cell) {
    return items.findIndex(sameItems => 
        sameItems.findIndex(item => 
            item[0] === cell[0] && item[1] === cell[1]) != -1);
}

let pairs = [
    [9, 5],
    [8, 4]
    // ...
];
let pair = [9, 5]; // index of the first's color item, index of the direction with second's color item