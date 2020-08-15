//TODO: Wrap second for into the func

class Grid {
    constructor(radius = 4) {
        this.cells = this.createGrid(radius);
        // for (let radius = 0; radius < r; radius++) {
        //     Vector.getDiameter
        //     let diameter = radius == 0 ? 1 : radius * 6;
        //     for (let diameterIndex = 0, directionIndex = 0;
        //         diameterIndex < diameter;
        //         diameterIndex++, diameterIndex != 1 && (diameterIndex - 1) % radius == 0 ? directionIndex++ : directionIndex) {
        //         let vector = diameterIndex == 0 ? 
        //             Vector.scalarMult(Vector.directions[4], radius) : 
        //             Vector.add(this.cells[this.cells.length - 1], Vector.directions[directionIndex]);
        //         this.cells.push(vector);
        //         console.log(`{ ${vector.x}, ${vector.y}, ${vector.z} } radius: ${radius}, diameterIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
        //     }
        // }
    }
    createGrid(r) {
        let cells = new Array();
        for (let radius = 0; radius < r; radius++) {
            Vector.getDiameter
            let diameter = radius == 0 ? 1 : radius * 6;
            for (let diameterIndex = 0, directionIndex = 0;
                diameterIndex < diameter;
                diameterIndex++, diameterIndex != 1 && (diameterIndex - 1) % radius == 0 ? directionIndex++ : directionIndex) {
                let vector = diameterIndex == 0 ? 
                    Vector.scalarMult(Vector.directions[4], radius) : 
                    Vector.add(cells[cells.length - 1], Vector.directions[directionIndex]);
                cells.push(vector);
                console.log(`{ ${vector.x}, ${vector.y}, ${vector.z} } radius: ${radius}, diameterIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
            }
        }
        return cells;
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
    static scalarMult(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
    }
    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
    }
}
class Cell {
    constructor(vector) {
        this.vector = vector;
    }
}