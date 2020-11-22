// TODO: Decide about ability to change order of items.
// move can be [cell0, cell1, direction] (not [index0, index1, direction]) 
// otherwise sort items by cell0 than by cell1

// TODO: Hash (findPlayer(), findItemIndex(), findItemWithIndex())

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
    return array.map(i => scalar == 0 ? 0 : i * scalar);
}
function isExist(cell) {
    return Math.max(...getExtendedCell(cell).map(Math.abs)) <= radius
}
function getInverseDirectionIndex(directionIndex) {
    return inverseDirectionsIndexes?.[directionIndex] ?? swap;
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
function getExtendedCell(cell) {
    return [...cell, (cell[0] == 0 ? 0 : -cell[0]) - cell[1]];
}
//#endregion
function createItems() {
    let items = [[mult(directions[3], 1)], [mult(directions[3], -1)]];
    for (const [index, cell] of getPerimeter(radius).entries()) {
        items[index % 2].push(cell);
    }
    return items;
}
function cloneItems(items) { // copyItems?
    return [items[0].map(item => item), items[1].map(item => item)];
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
function findWinner(items) {
    let winners = [];
    let _items = [[...items[0].map(cell => getExtendedCell(cell))], [...items[1].map(cell => getExtendedCell(cell))]];
    let found = false;
    for (const [player, cells] of _items.entries()) {
        found = false;
        for (let diagonal = 0; diagonal < 3; diagonal++) {
            if (found) {
                break;
            }
            const nextDiagonal = diagonal == 2 ? 0 : diagonal + 1;
            cells.sort((a, b) => a[diagonal] - b[diagonal] || a[nextDiagonal] - b[nextDiagonal]);
            let count = 1, prevCell;
            for (const cell of cells) {
                if (cell[diagonal] == prevCell?.[diagonal] && cell[nextDiagonal] == prevCell?.[nextDiagonal] + 1) {
                    count++;
                }
                else {
                    count = 1;
                }
                if (count == 4) {
                    winners.push(player);
                    found = true;
                    break;
                }
                prevCell = cell;
            }
        }
    }
    switch (winners.length) {
        case 1: // win
            return winners[0];
            break;
        case 2: // draw
            return 2;
            break;
        default: // no winner
            return -1;
            break;
    }
}
function findPlayer(cell, items) {
    return items.findIndex(sameItems => findItemIndex(cell, sameItems) != -1);
}
function findItemWithIndex(cell, items) {
    let itemIndex, player = items.findIndex((sameItems) => {
        itemIndex = findItemIndex(cell, sameItems);
        return itemIndex != -1;
    });
    return [player, itemIndex];
}
function findItemIndex(cell, samePlayersItems) {
    return samePlayersItems.findIndex(item => item[0] == cell[0] && item[1] == cell[1]);
}
function isLegal(move, items, prevMove) {
    const cell0 = items[0][move[0]],
        cell1 = items[1][move[1]],
        direction = move[2],
        prevMoveDirection = prevMove?.[2];
    if (direction == swap) {
        if (prevMove && move[0] == prevMove[0] && move[1] == prevMove[1] && direction == prevMoveDirection) { // isEqual(move, prevMove)
            return false;
        }
        return true;
    }
    else if (isExist(getNeighbor(cell0, direction)) && isExist(getNeighbor(cell1, direction))) {
        const itemsWithIndex = [
            findItemWithIndex(getNeighbor(cell0, direction), items),
            findItemWithIndex(getNeighbor(cell1, direction), items)
        ];
        if ((itemsWithIndex[0][0] == -1 || (itemsWithIndex[0][0] == 1 && itemsWithIndex[0][1] == move[1])) &&
            (itemsWithIndex[1][0] == -1 || (itemsWithIndex[1][0] == 0 && itemsWithIndex[1][1] == move[0]))) {
            if (prevMove == null) {
                return true;
            }
            if (move[0] == prevMove[0] && move[1] == prevMove[1] && getInverseDirectionIndex(direction) == prevMoveDirection) {
                return false;
            }
            return true;
        }
    }
    return false;
}
function getMoves(pairs) {
    let moves = [];
    for (const pair of pairs) {
        for (const directionIndex of pair[2]) {
            moves.push([pair[0], pair[1], directionIndex]);
        }
    }
    return moves;
}
class Game {
    constructor(game = null) {
        if (game) {
            this.items = cloneItems(game.items);
            this.pairs = game.pairs.map(pair => pair);
            this.history = game.history.map(move => move);
            this.winner = game.winner;
        }
        else {
            this.items = cloneItems(initialItems);
            this.pairs = findPairs(this.items, null); // [[player0ItemIndex, player1ItemIndex, [...legalMoveDirections]], ...] // pairsWithMoves
            this.history = []; // [...move]; move: [...pair, directionIndex (optional), items, pairs]
            this.winner = -1;
        }
    }
    isLegal(move) {
        return isLegal(move, this.items, this.history?.[this.history.length - 1] ?? null);
    }
    getCurrentPlayer() {
        return this.history.length % 2;
    }
    move(pair, directionIndex) {
        if (isLegal([...pair, directionIndex], this.items, this.getPrevMove())) {
            const move = [...pair, directionIndex];
            this.history.push(move); // this.history.push([...move, items, pairs]);
            this.items = updateItems(move, this.items);
            this.pairs = findPairs(this.items, move);
            this.winner = findWinner(this.items);
        }
    }
    undo() {
        const prevMove = this.getPrevMove();
        if (prevMove) {
            const undoMove = [prevMove[0], prevMove[1], getInverseDirectionIndex(prevMove[2])];
            this.items = updateItems(undoMove, this.items); // or from history
            this.pairs = findPairs(this.items, this.history?.[this.history.length - 2] ?? null); // or from history
            this.history.pop();
            this.winner = findWinner(this.items); // ?
        }
    }
    getPrevMove() {
        return this.history?.[this.history.length - 1] ?? null;
    }
    getMoves() {
        return getMoves(this.pairs);
    }
    findPlayer(cell) {
        return findPlayer(cell, this.items);
    }
    findItemIndex(cell, player) {
        return findItemIndex(cell, this.items[player]);
    }
}

export { Game, cells, swap, getNeighbor, getExtendedCell, inverseDirectionsIndexes }