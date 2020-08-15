class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        for (let r = 0; r < radius; r++) {
            this.cells.push(Vector.getDiameter(r));
        }
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
        let diameter = new Array();
        let diameterLength = radius == 0 ? 1 : radius * 6;
        for (let diameterIndex = 0, directionIndex = 0;
            diameterIndex < diameterLength;
            diameterIndex++, diameterIndex != 1 && (diameterIndex - 1) % radius == 0 ? directionIndex++ : directionIndex) {
            let vector = diameterIndex == 0 ? 
                Vector.scalarMult(Vector.startDirection, radius) : 
                Vector.add(diameter[diameter.length - 1], Vector.directions[directionIndex]);
            diameter.push(vector);
            console.log(`{ ${vector.x}, ${vector.y}, ${vector.z} } radius: ${radius}, diameterIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
        }
        return diameter;
    }
}
class Cell {
    constructor(vector) {
        this.vector = vector;
    }
}