import Grid from './grid.js';

function initItems(grid) {
    let items = [[...grid.startPerimeter(grid.startDirection, -1), 0], [...grid.startPerimeter(grid.startDirection, 1), 1]];
    grid.getPerimeter(grid.radius).forEach((coordinates, i) => {
        items.push([...coordinates, i % 2]);
    });
    return items;
}

function getState(grid, items) {
    let state = grid.cells.map(cell => [...cell, null]);
    items.forEach(item => {
        state.find(cell => 
            cell[0] === item[0] &&
            cell[1] === item[1] &&
            cell[2] === item[2])[3] = item[3];
    });
    return state;
}

export default class Game {
    constructor(radius = 3) {
        this.grid = new Grid(radius);
        this.items = initItems(this.grid);

        this.state = getState(this.grid, this.items);
    }
}