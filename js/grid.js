const directions = [
    [-1, 0, 1], // ↙
    [-1, 1, 0], // ←
    [0, 1, -1], // ↖
    [1, 0, -1], // ↗
    [1, -1, 0], // →
    [0, -1, 1]  // ↘
], startDirection = directions[4];
function add(arr1, arr2) {
    return arr1.map((n, i) => n + arr2[i]);
}
function mult(arr, n) {
    return arr.map(i => i * n);
}
function getDiameter(radius) {
    let diameter = [mult(startDirection, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex++ % radius == 0) {
        diameter.push(add(diameter[diameter.length - 1], directions[directionIndex]));
    }
    return diameter;
}
export function create(radius) {
    let grid = [];
    for (let r = 0; r < radius; r++) {
        grid.push(...getDiameter(r).map(c => new Object({ coord: c })));
    }
    return grid;
}