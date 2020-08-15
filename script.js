class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        this.directions = [
            new Vector(1, -1, 0),
            new Vector(1, 0, -1),
            new Vector(0, 1, -1),
            new Vector(-1, 1, 0),
            new Vector(-1, 0, 1),
            new Vector(0, -1, 1)
        ];
        for (let radiusIndex = 0, radiusCellsQuantity = 1; radiusIndex < radius; radiusIndex++, radiusCellsQuantity = radiusIndex * 6) {
            for (let radiusCellsIndex = 0, directionIndex = 0;
                radiusCellsIndex < radiusCellsQuantity;
                radiusCellsIndex++, radiusCellsIndex % radiusIndex == 0 ? directionIndex++ : directionIndex) {
                if(radiusCellsIndex == 0) {
                    this.cells.push(new Cell(radiusIndex * this.directions[directionIndex].x,
                        radiusIndex * this.directions[directionIndex].y,
                        radiusIndex * this.directions[directionIndex].z));
                    console.log(`${radiusIndex * this.directions[directionIndex].x}, ${radiusIndex * this.directions[directionIndex].y}, ${radiusIndex * this.directions[directionIndex].z}`);
                    console.log(`directionIndex: ${directionIndex}`);
                } else {
                    // TODO: (radiusIndex, directionIndex, prevCellXYZ) to (x, y, z)
                    this.cells.push(new Cell(this.cells[this.cells.length - 1].x + this.directions[directionIndex].x, 
                        this.cells[this.cells.length - 1].y + this.directions[directionIndex].y,
                        this.cells[this.cells.length - 1].z + this.directions[directionIndex].z));
                    console.log(`${this.cells[this.cells.length - 1].x + this.directions[directionIndex].x}, ${this.cells[this.cells.length - 1].y + this.directions[directionIndex].y}, ${this.cells[this.cells.length - 1].z + this.directions[directionIndex].z}`);
                    console.log(`directionIndex: ${directionIndex}`);
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