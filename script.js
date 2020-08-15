//TODO: Implement scalarSum() and scalarMultiplication()
//TODO: Wrap second for into the func

class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        for (let radiusIndex = 0, diameter = 1;
            radiusIndex < radius;
            radiusIndex++, diameter = radiusIndex * 6) {
            for (let diameterIndex = 0, directionIndex = 0;
                diameterIndex < diameter;
                diameterIndex++, diameterIndex != 1 && (diameterIndex - 1) % radiusIndex == 0 ? directionIndex++ : directionIndex) {
                if (diameterIndex == 0) {
                    this.cells.push(Vector.scalarMultiplication(Vector.directions[4], radiusIndex));
                    console.log(`[ ${Vector.scalarMultiplication(Vector.directions[4], radiusIndex).x}, ${Vector.scalarMultiplication(Vector.directions[4], radiusIndex).y}, ${Vector.scalarMultiplication(Vector.directions[4], radiusIndex).z} ] radiusIndex: ${radiusIndex}, radiusCellsIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
                } else {
                    this.cells.push(Vector.addition(this.cells[this.cells.length - 1], Vector.directions[directionIndex]));
                    console.log(`[ ${Vector.addition(this.cells[this.cells.length - 1], Vector.directions[directionIndex]).x}, ${Vector.addition(this.cells[this.cells.length - 1], Vector.directions[directionIndex]).y}, ${Vector.addition(this.cells[this.cells.length - 1], Vector.directions[directionIndex]).z} ] radiusIndex: ${radiusIndex}, radiusCellsIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
                }
            }
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
    static scalarMultiplication(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
    }
    static addition(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }
}
class Cell extends Vector {
    constructor(...props) {
        super(...props);
    }
}