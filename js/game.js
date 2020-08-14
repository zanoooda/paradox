class Game {
    constructor() {
        this.grid = new Grid();
    }
}
class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        for (let radiusIndex = 0, radiusCellQuantity = 1; radiusIndex < radius; radiusIndex++, radiusCellQuantity = radiusIndex * 6) {
            for (let cellIndex = 0; cellIndex < radiusCellQuantity; cellIndex++) {
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