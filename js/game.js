import Grid from './grid.js';

function initItems(grid) {
    let items = [[...grid.startPerimeter(grid.startDirection, -1), 0], [...grid.startPerimeter(grid.startDirection, 1), 1]];
    grid.getPerimeter(grid.radius).forEach((cell, i) => {
        items.push([...cell, i % 2]);
    });
    return items;
}
function findPairs(items, grid) {
    let pairs = [];
    let notPairedItems = items;
    items.forEach(item => {
        grid.getNeighbours(item).forEach(neighbourCell => {
            // let neighbour = getItemByCoordinates(notPairedItems, neighbourCell); //!!!
            // if(neighbour && neighbour[3] != item[3]) {
            //     pairs.push([item, neighbour]);
            //     removeItem(notPairedItems, item);
            // }
        });
    });
    return pairs;
}

export default class Game {
    constructor(radius = 3) {
        this.grid = new Grid(radius);
        this.items = initItems(this.grid);
        this.pairs = findPairs(this.items, this.grid);
    }
}