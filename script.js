const directions = [
    { x: -1, y: 0, z: 1 }, // ↙
    { x: -1, y: 1, z: 0 }, // ←
    { x: 0, y: 1, z: -1 }, // ↖
    { x: 1, y: 0, z: -1 }, // ↗
    { x: 1, y: -1, z: 0 }, // →
    { x: 0, y: -1, z: 1 }  // ↘
]
const startDirection = directions[4];
function scalarMult(vector, scalar) {
    return { x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar };
}
function add(vector1, vector2) {
    return { x: vector1.x + vector2.x, y: vector1.y + vector2.y, z: vector1.z + vector2.z };
}
function getDiameter(radius) {
    let diameter = [scalarMult(startDirection, radius)];
    for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex++ % radius == 0) {
        diameter.push(add(diameter[diameter.length - 1], directions[directionIndex]));
    }
    return diameter;
}

let grid = [];
for (let radius = 0; radius < 4; radius++) {
    grid.push(...getDiameter(radius).map(vector => new Object({ cordinates: vector })));
}
grid.forEach(cell => {
    console.log(JSON.stringify(cell))
});