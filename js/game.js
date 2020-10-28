import Grid from './grid.js';

function initItems(grid) {
    let items = [[...grid.startPerimeter(grid.startDirection, -1), 0], [...grid.startPerimeter(grid.startDirection, 1), 1]];
    for(const [index, cell] of grid.getPerimeter(grid.radius).entries()) {
        items.push([...cell, index % 2]);
    }
    return items;
}
function findPairs(items, grid) {
    let pairs = [];
    let notPairedItems = items;
    for(const item of items) {
        for(const neighborCell of grid.getNeighbors(item.slice(0, 3))) {
            // let neighborItem = getItemByCell(notPairedItems, neighborCell);
            // if(neighborItem && neighborItem[3] != item[3]) {
            //     pairs.push([item, neighborItem]);
            //     removeItem(notPairedItems, item);
            // }
        }
    }
    return pairs;
}

export default class Game {
    constructor(radius = 3) {
        this.grid = new Grid(radius);
        this.items = initItems(this.grid);
        this.pairs = findPairs(this.items, this.grid);
    }
}