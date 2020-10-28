const directions = [
    [-1, 0, 1], // ↙
    [-1, 1, 0], // ←
    [0, 1, -1], // ↖
    [1, 0, -1], // ↗
    [1, -1, 0], // →
    [0, -1, 1]  // ↘
], startDirection = directions[4];

function neighbor(cell, direction) {
    return cell.map((n, i) => n + direction[i]);
}
function startPerimeter(direction, radius) {
    return direction.map(i => i * radius);
}
function getPerimeter(radius) {
    let perimeter = [startPerimeter(startDirection, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex % radius == 0, diameterIndex++) {
        perimeter.push(neighbor(perimeter[perimeter.length - 1], directions[directionIndex]));
    }
    return perimeter;
}
function createCells(radius) {
    let cells = [];
    for (let r = 0; r <= radius; r++) {
        cells.push(...getPerimeter(r));
    }
    return cells;
}
function getNeighbours(cell, radius) {
    let neighbours = [];
    //directions.forEach(direction => )
    return neighbours;
}

export default class Grid {
    constructor(radius) {
        this.radius = radius;
        this.cells = createCells(radius);
        this.directions = directions;
        this.startDirection = startDirection;
        this.getPerimeter = getPerimeter;
        this.startPerimeter = startPerimeter;
        this.getNeighbours = cell => getNeighbours(cell, this.radius);
    }
}