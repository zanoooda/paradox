function getPoint(position, sideLength) {
    let x = (sideLength / 2) + (position[0] * sideLength / 8);
    let y = (sideLength / 2) + (position[1] * sideLength / 8);
    return [x, y];
}
function showCell(cell, context, sideLength, cellRadius) {
    let point = getPoint(cell.position, sideLength);
    if(cell.ball) {
        // showBall(cell)
    } else {
        context.beginPath();
        context.arc(...point, cellRadius, 0, 2 * Math.PI);
        context.stroke(); 
    }
    context.font = "10px Arial";
    context.fillText(`${cell.position}`, ...point);
}
export default class Canvas {
    constructor(sideLength) {
        this.element = document.createElement('canvas');
        this.element.width = sideLength;
        this.element.height = sideLength;
        this.context = this.element.getContext('2d');
        this.sideLength = sideLength;
        this.cellRadius = sideLength / 16;
    }
    show(board) {
        for (let i = 0; i < board.cells.length; i++) {
            showCell(board.cells[i], this.context, this.sideLength, this.cellRadius);
        }
    }
}