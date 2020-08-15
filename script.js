class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        this.directions = [
            new Vector(1, -1, 0), // →
            new Vector(1, 0, -1), // ↗
            new Vector(0, 1, -1), // ↖
            new Vector(-1, 1, 0), // ←
            new Vector(-1, 0, 1), // ↙
            new Vector(0, -1, 1)  // ↘  
        ];
        for (let radiusIndex = 0, radiusCellsQuantity = 1;
            radiusIndex < radius;
            radiusIndex++, radiusCellsQuantity = radiusIndex * 6) {
            for (let radiusCellsIndex = 0, directionIndex = 0;
                radiusCellsIndex < radiusCellsQuantity;
                radiusCellsIndex++, radiusCellsIndex % radiusIndex == 0 ? directionIndex++ : directionIndex) {
                let direction = this.directions[directionIndex];
                console.log(`directionIndex: ${directionIndex}, direction: {${direction.x}, ${direction.y}, ${direction.z}}`);
                if (radiusCellsIndex == 0) {
                    this.cells.push(new Cell(radiusIndex * direction.x, radiusIndex * direction.y, radiusIndex * direction.z));
                    console.log(`${radiusIndex * direction.x}, ${radiusIndex * direction.y}, ${radiusIndex * direction.z}`);
                } else {
                    let previousCell = this.cells[this.cells.length - 1];
                    this.cells.push(new Cell(previousCell.x - direction.x, previousCell.y - direction.y, previousCell.z - direction.z));
                    console.log(`${previousCell.x - direction.x}, ${previousCell.y - direction.y}, ${previousCell.z - direction.z}`);
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