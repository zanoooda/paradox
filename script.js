//TODO: Implement scalarSum() and scalarMultiplication()
//TODO: Wrap second for into the func

class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        this.directions = [
            new Vector(-1, 0, 1), // ↙
            new Vector(-1, 1, 0), // ←
            new Vector(0, 1, -1), // ↖
            new Vector(1, 0, -1), // ↗
            new Vector(1, -1, 0), // →
            new Vector(0, -1, 1)  // ↘  
        ];
        this.initialDirection = this.directions[4];
        for (let radiusIndex = 0, diameter = 1;
            radiusIndex < radius;
            radiusIndex++, diameter = radiusIndex * 6) {
            for (let diameterIndex = 0, directionIndex = 0;
                diameterIndex < diameter;
                diameterIndex++, diameterIndex != 1 && (diameterIndex - 1) % radiusIndex == 0 ? directionIndex++ : directionIndex) {
                const direction = this.directions[directionIndex];
                if (diameterIndex == 0) {
                    this.cells.push(new Cell(radiusIndex * this.initialDirection.x, radiusIndex * this.initialDirection.y, radiusIndex * this.initialDirection.z));
                    console.log(`[ ${radiusIndex * this.initialDirection.x}, ${radiusIndex * this.initialDirection.y}, ${radiusIndex * this.initialDirection.z} ] radiusIndex: ${radiusIndex}, radiusCellsIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
                } else {
                    let previousCell = this.cells[this.cells.length - 1];
                    this.cells.push(new Cell(previousCell.x + direction.x, previousCell.y + direction.y, previousCell.z + direction.z));
                    console.log(`[ ${previousCell.x + direction.x}, ${previousCell.y + direction.y}, ${previousCell.z + direction.z} ] radiusIndex: ${radiusIndex}, radiusCellsIndex: ${diameterIndex}, directionIndex: ${directionIndex}`);
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
}
class Cell extends Vector {
    constructor(...props) {
        super(...props);
    }
}