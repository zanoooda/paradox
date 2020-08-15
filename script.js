const directions = [
    [-1, 0, 1], // ↙
    [-1, 1, 0], // ←
    [0, 1, -1], // ↖
    [1, 0, -1], // ↗
    [1, -1, 0], // →
    [0, -1, 1]  // ↘
];
const startDirection = directions[4];
function scalarMult(arr, x) {
    return arr.map(i => i * x);
}
function add(arr1, arr2) {
    return arr1.map((x, i) => x + arr2[i]);
}
function getDiameter(radius) {
    let diameter = [scalarMult(startDirection, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex++ % radius == 0) {
        diameter.push(add(diameter[diameter.length - 1], directions[directionIndex]));
    }
    return diameter;
}
function createGrid(radius = 4) {
    let grid = [];
    for (let radius = 0; radius < 4; radius++) {
        grid.push(...getDiameter(radius));
    }
    return grid;
}
createGrid().forEach(c => console.log(JSON.stringify(c)));