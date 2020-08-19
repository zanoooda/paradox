const directions = [
    [-1, 0, 1], // ↙
    [-1, 1, 0], // ←
    [0, 1, -1], // ↖
    [1, 0, -1], // ↗
    [1, -1, 0], // →
    [0, -1, 1]  // ↘
], startDirection = directions[4];
function neighbor(position, direction) {
    return position.map((n, i) => n + direction[i]);
}
// diagonals
function startPerimeter(direction, radius) {
    return direction.map(i => i * radius);
}
function getPerimeter(radius) {
    let perimeter = [startPerimeter(this.startDirection, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex % radius == 0, diameterIndex++) {
        perimeter.push(neighbor(perimeter[perimeter.length - 1], this.directions[directionIndex]));
    }
    return perimeter;
}
function create(radius) {
    let grid = [];
    for (let r = 0; r <= radius; r++) {
        grid.push(...this.getPerimeter(r));
    }
    return grid;
}
export default class Grid {
    static directions = directions;
    static startDirection = startDirection;
    static create = create;
    static getPerimeter = getPerimeter;
}