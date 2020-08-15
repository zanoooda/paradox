class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        for (let r = 0; r < radius; r++) {
            this.cells.push(...Vector.getDiameter(r).map(vector => new Cell(vector)));
        }
    }
}
class Cell {
    constructor(vector) {
        this.vector = vector;
    }
}
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static directions = [
        new Vector(-1, 0, 1), // ↙
        new Vector(-1, 1, 0), // ←
        new Vector(0, 1, -1), // ↖
        new Vector(1, 0, -1), // ↗
        new Vector(1, -1, 0), // →
        new Vector(0, -1, 1)  // ↘
    ];
    static startDirection = Vector.directions[4];
    static scalarMult(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
    }
    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }
    static getDiameter(radius) {
        let diameter = [Vector.scalarMult(Vector.startDirection, radius)];
        for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex++ % radius == 0) {
            diameter.push(Vector.add(diameter[diameter.length - 1], Vector.directions[directionIndex]));
        }
        return diameter;
    }
}