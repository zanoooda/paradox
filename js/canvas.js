export class Canvas {
    constructor(diameter) {
        this.element = document.createElement('canvas');
        this.element.width = diameter;
        this.element.height = diameter;
        this.context = this.element.getContext('2d');
        this.diameter = diameter;
    }
    showGrid(grid) {
        grid.forEach(cell => {
            showCell(cell, this.context, this.diameter);
        });
    }
}
function getPoint(c, diameter) {
    //...
    return [diameter / 2, diameter / 2];
}
function showCell(cell, context, diameter) {
    console.log(JSON.stringify(cell.coord));

    context.beginPath();
    context.arc(...getPoint(cell.coord, diameter), diameter / 32, 0, 2 * Math.PI);
    context.stroke();
}