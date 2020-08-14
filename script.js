class Game {
    constructor() {
        this.grid = new Grid();
    }
}
class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        for (let radiusIndex = 0, radiusCellsQuantity = 1; radiusIndex < radius; radiusIndex++, radiusCellsQuantity = radiusIndex * 6) {
            for (let radiusCellsIndex = 0; radiusCellsIndex < radiusCellsQuantity; radiusCellsIndex++) {
                this.cells.push(new Cell(0, 0, 0));
            }
        }
    }
}
class Cell {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}