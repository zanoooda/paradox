import Grid from './grid.js';

function initItems(grid) {
    let items = [[...grid.startPerimeter(grid.startDirection, -1), 0], [...grid.startPerimeter(grid.startDirection, 1), 1]];
    grid.getPerimeter(grid.radius).forEach((coordinates, i) => {
        items.push([...coordinates, i % 2]);
    });
    return items;
}

export default class Game {
    constructor(radius = 3) {
        this.grid = new Grid(radius);
        this.items = initItems(this.grid);
    }
}