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
        for (let radiusIndex = 0, radiusCellsQuantity = 1;
            radiusIndex < radius;
            radiusIndex++, radiusCellsQuantity = radiusIndex * 6) {
            for (let radiusCellsIndex = 0, directionIndex = 0;
                radiusCellsIndex < radiusCellsQuantity;
                radiusCellsIndex++, radiusCellsIndex != 1 && (radiusCellsIndex - 1) % radiusIndex == 0 ? directionIndex++ : directionIndex) {
                const direction = this.directions[directionIndex];
                if (radiusCellsIndex == 0) {
                    this.cells.push(new Cell(radiusIndex * this.initialDirection.x, radiusIndex * this.initialDirection.y, radiusIndex * this.initialDirection.z));
                    console.log(`[ ${radiusIndex * this.initialDirection.x}, ${radiusIndex * this.initialDirection.y}, ${radiusIndex * this.initialDirection.z} ] radiusIndex: ${radiusIndex}, radiusCellsIndex: ${radiusCellsIndex}, directionIndex: ${directionIndex}`);
                } else {
                    let previousCell = this.cells[this.cells.length - 1];
                    this.cells.push(new Cell(previousCell.x + direction.x, previousCell.y + direction.y, previousCell.z + direction.z));
                    console.log(`[ ${previousCell.x + direction.x}, ${previousCell.y + direction.y}, ${previousCell.z + direction.z} ] radiusIndex: ${radiusIndex}, radiusCellsIndex: ${radiusCellsIndex}, directionIndex: ${directionIndex}`);
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