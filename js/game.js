// TODO: Hash (findPlayerIndex(), findItemIndex(), findItemWithIndex())
// findWinner: sort items by x, y, z!
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
    inverseDirectionsIndexes = [3, 4, 5, 0, 1, 2],
    forward = directions[4],
    swap = -1,
    initialItems = createItems(),
    cells = createCells();

function mult(array, scalar) {
    return array.map(i => i * scalar);
}
function isExist(cell) {
    const cube = [...cell, -(cell[0] + cell[1])];
    return Math.max(...cube.map(Math.abs)) <= radius
}
function getInverseDirectionIndex(directionIndex) {
    return inverseDirectionsIndexes[directionIndex];
}
function getNeighbor(cell, directionIndex) {
    return cell.map((n, i) => n + directions[directionIndex][i]);
}
function getNeighbors(cell) {
    let neighbors = [];
    for (const [directionIndex, direction] of directions.entries()) {
        const neighbor = getNeighbor(cell, directionIndex);
        if (isExist(neighbor)) {
            neighbors.push(neighbor);
        }
    }
    return neighbors;
}
function getPerimeter(radius) {
    let perimeter = [mult(forward, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex % radius == 0, diameterIndex++) {
        perimeter.push(getNeighbor(perimeter[perimeter.length - 1], directionIndex));
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
function findPairs(items, prevMove) { // findPairsWithMoves()
    let pairs = [];
    for (const [itemIndex, cell] of items[0].entries()) {
        const neighbors = getNeighbors(cell);
        for (const neighborCell of neighbors) {
            const neighborIndex = findItemIndex(neighborCell, items[1]);
            if (neighborIndex != -1) {
                const moves = findMoves([itemIndex, neighborIndex], items, prevMove);
                pairs.push([itemIndex, neighborIndex, moves]);
            }
        }
    }
    return pairs;
}
function findMoves(pair, items, prevMove) {
    let moves = [];
    const swapMove = [...pair, swap];
    if (isLegal(swapMove, items, prevMove)) {
        moves.push(swap);
    }
    for (const [directionIndex, direction] of directions.entries()) {
        const move = [...pair, directionIndex];
        if (isLegal(move, items, prevMove)) {
            moves.push(directionIndex);
        }
    }
    return moves;
}
function updateItems(move, items) {
    if (move[2] == swap) {
        const cell0 = items[0][move[0]];
        items[0][move[0]] = items[1][move[1]];
        items[1][move[1]] = cell0;
    }
    else {
        items[0][move[0]] = getNeighbor(items[0][move[0]], move[2]);
        items[1][move[1]] = getNeighbor(items[1][move[1]], move[2]);
    }
    return items;
}
function findWinner(items) { // TODO: Implement (-1 (no one), 0, 1, 2 if draw)
    const player0Items = items[0].map(cell => [cell[0], cell[1], -cell[0] - cell[1]]);
    let player1SortedByX = [...player0Items].sort(function (a, b) {
        return a[0] - b[0];
    });
    let player1SortedByY = [...player0Items].sort(function (a, b) {
        return a[1] - b[1];
    });
    let player1SortedByZ = [...player0Items].sort(function (a, b) {
        return a[2] - b[2];
    });
    // TODO: Find to each diagonal, second that must be incremented
    // ...
    return -1;
}
function findPlayerIndex(cell, items) {
    return items.findIndex(sameItems => findItemIndex(cell, sameItems) != -1);
}
function findItemWithIndex(cell, items) {
    let itemIndex, playerIndex = items.findIndex((sameItems) => {
        itemIndex = findItemIndex(cell, sameItems);
        return itemIndex != -1;
    });
    return [playerIndex, itemIndex];
}
function findItemIndex(cell, samePlayersItems) {
    return samePlayersItems.findIndex(item => item[0] == cell[0] && item[1] == cell[1]);
}
function isLegal(move, items, prevMove) { // TODO: Improve
    if (move[2] == swap) {
        if (prevMove && move[0] == prevMove[0] && move[1] == prevMove[1] && move[2] == prevMove[2]) { // isEqual(move, prevMove)
            return false;
        }
        return true;
    }
    else if (isExist(getNeighbor(items[0][move[0]], move[2])) && isExist(getNeighbor(items[1][move[1]], move[2]))) {
        const itemsWithIndex = [
            findItemWithIndex(getNeighbor(items[0][move[0]], move[2]), items), // items[0][move[0]] wrap to const
            findItemWithIndex(getNeighbor(items[1][move[1]], move[2]), items)
        ];
        if ((itemsWithIndex[0][0] == -1 || (itemsWithIndex[0][0] == 1 && itemsWithIndex[0][1] == move[1])) &&
            (itemsWithIndex[1][0] == -1 || (itemsWithIndex[1][0] == 0 && itemsWithIndex[1][1] == move[0]))) {
            if (prevMove == null) {
                return true;
            }
            if (move[0] == prevMove[0] && move[1] == prevMove[1] && getInverseDirectionIndex(move[2]) == prevMove[2]) {
                return false;
            }
            return true;
        }
    }
    return false;
}
function getAllMoves(pairs) { // TODO: Test
    let moves = [];
    for (const pair of pairs) {
        for (const directionIndex of pair[2]) {
            moves.push([...pair, directionIndex]);
        }
    }
    return moves;
}
class Game {
    constructor() {
        this.items = initialItems; // [plyer0Cells, player1Cells]
        this.pairs = findPairs(this.items, null); // [[player0ItemIndex, player1ItemIndex, [...legalMoveDirections]], ...] // pairsWithMoves
        this.history = []; // [...move]; move: [...pair, directionIndex (optional), items, pairs]
        this.winner = -1;
    }
    isLegal(move) {
        return isLegal(move, this.items, this.history[this.history.length - 1]);
    }
    move(pair, directionIndex) { // TODO: Test/Improve
        //if(!isLegal([...pair, directionIndex], this.items, this.history.length > 0 ? this.history[this.history.length - 1] : null)) return;
        const move = [...pair, directionIndex];
        this.history.push(move); // this.history.push([...move, items, pairs]);
        this.items = updateItems(move, this.items);
        this.winner = findWinner(this.items);
        if (this.winner == -1) {
            this.pairs = findPairs(this.items, move);
        }
        if (this.winner != -1) {
            console.log(`Player ${this.winner} is winner`);
        }
    }
    getAllMoves() { // Test
        return getAllMoves(this.pairs);
    }
    findPlayerIndex(cell) {
        return findPlayerIndex(cell, this.items);
    }
    findItemIndex(cell, playerIndex) {
        return findItemIndex(cell, this.items[playerIndex]);
    }
}
class Grid {
    static cells = cells;
    static swap = swap;
    static getNeighbor = getNeighbor;
}

export { Game, Grid }