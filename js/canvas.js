export default class Canvas {
    constructor(sideLength) {
        this.element = document.createElement('canvas');
        this.element.width = sideLength;
        this.element.height = sideLength;
        this.context = this.element.getContext('2d');
        this.sideLength = sideLength;
        this.cellRadius = sideLength / 16;
    }
    showGrid(grid) {
        for (let i = 0; i < grid.length; i++) {
            showCell(grid[i], this.context, this.sideLength, this.cellRadius);
        }
    }
}
function getPoint(cell, sideLength) { // x = cell[0]; y = cell[1]; z = cell[2]
    let x = (sideLength / 2) + (cell[0] * sideLength / 8);
    let y = (sideLength / 2) + (cell[1] * sideLength / 8);
    return [x, y];
}
function showCell(cell, context, sideLength, cellRadius) {
    let point = getPoint(cell, sideLength);
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.stroke();
    context.font = "10px Arial";
    context.fillText(JSON.stringify(cell), point[0], point[1]);
}