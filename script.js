const directions = [
    [-1, 0, 1], // ↙
    [-1, 1, 0], // ←
    [0, 1, -1], // ↖
    [1, 0, -1], // ↗
    [1, -1, 0], // →
    [0, -1, 1]  // ↘
];
const startDirection = directions[4];
function add(arr, dir) {
    return arr.map((n, i) => n + dir[i]);
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
function createGrid(radius) {
    let grid = [];
    for (let r = 0; r < radius; r++) {
        grid.push(...getDiameter(r).map(c => new Object({ coord: c})));
    }
    return grid;
}
createGrid(4).forEach(c => console.log(JSON.stringify(c)));