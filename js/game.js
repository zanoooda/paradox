class Game {
    constructor() {
        this.grid = new Grid();
    }
}
class Grid {
    constructor(radius = 4) {
        this.cells = new Array();
        for (let radiusIndex = 0; radiusIndex < radius; radiusIndex++) {
            let cellCounter = radiusIndex == 0 ? 1 : radiusIndex * 6;
            for (let cellIndex = 0; cellIndex < cellCounter; cellIndex++) {
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