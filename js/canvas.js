export class Canvas {
    constructor(sideLength) {
        this.element = document.createElement('canvas');
        this.element.width = sideLength;
        this.element.height = sideLength;
        this.context = this.element.getContext('2d');
        this.sideLength = sideLength;
    }
    showGrid(grid) {
        for (let i = 0; i < grid.length; i++) {
            showCell(grid[i], this.context, this.sideLength);
        }
    }
}
function getPoint(cell, sideLength) {
    //...
    return [sideLength / 2, sideLength / 2];
}
function showCell(cell, context, sideLength) {
    console.log(JSON.stringify(cell));

    let cellRadius = sideLength / 32;
    context.beginPath();
    context.arc(...getPoint(cell, sideLength), cellRadius, 0, 2 * Math.PI);
    context.stroke();
}