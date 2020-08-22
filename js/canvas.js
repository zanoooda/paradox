let colors = ['red', 'blue'];
function getPoint(position, size) { // Implement
    let distance = size / 12;
    let x = (size / 2) + (distance * Math.sqrt(3) * (position[0] + position[2]/2));
    let y = (size / 2) + (distance * 3/2 * position[2]);
    return [x, y];
}
function showCell(cell, context, size, cellRadius) {
    let point = getPoint(cell, size);
    context.beginPath();
    context.arc(...point, cellRadius, 0, 2 * Math.PI);
    context.closePath();
    if (cell[3] != null) {
        context.fillStyle = colors[cell[3]];
        context.fill();
    } else {
        context.strokeStyle = 'lightgray'
        context.stroke();   
    }
    // context.fillStyle = 'black';
    // context.font = '10px Arial';
    // context.fillText(`${cell[0]}, ${cell[1]}, ${cell[2]}`, ...point);
}
export default class Canvas {
    constructor(size) {
        this.size = size;
        this.element = document.createElement('canvas');
        this.element.width = size;
        this.element.height = size;
        this.context = this.element.getContext('2d');
        this.cellRadius = size / 20;
        this.colors = colors;
    }
    show(state) {
        for (let i = 0; i < state.length; i++) {
            showCell(state[i], this.context, this.size, this.cellRadius);
        }
    }
}