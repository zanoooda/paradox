function getPoint(position, size) {
    let x = (size / 2) + (position[0] * size / 8);
    let y = (size / 2) + (position[1] * size / 8);
    return [x, y];
}
function showCell(cell, context, size, cellRadius) {
    let point = getPoint(cell.position, size);
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    if (cell.ball) {
        context.fillStyle = Canvas.colors[cell.ball.color];
        context.fill();
    } else
        context.stroke();
    context.fillStyle = 'black';
    context.font = "10px Arial";
    context.fillText(`${cell.position}`, ...point);
}
export default class Canvas {
    static colors = ['red', 'blue'];
    constructor(size) {
        this.size = size;
        this.element = document.createElement('canvas');
        this.element.width = size;
        this.element.height = size;
        this.context = this.element.getContext('2d');
        this.cellRadius = size / 16;
    }
    show(state) {
        for (let i = 0; i < state.cells.length; i++) {
            showCell(state.cells[i], this.context, this.size, this.cellRadius);
        }
    }
}