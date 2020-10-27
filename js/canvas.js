let colors = ['red', 'blue'];
function getPoint(coordinates, size) {
    let distance = size / 12;
    let x = (size / 2) + (distance * Math.sqrt(3) * (coordinates[0] + coordinates[2]/2));
    let y = (size / 2) + (distance * 3/2 * coordinates[2]);
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
    context.fillStyle = 'black';
    context.font = '10px Arial';
    context.fillText(`${cell[0]}, ${cell[1]}, ${cell[2]}`, ...point);
}
function show(state, context, size, cellRadius) {
    for (let i = 0; i < state.length; i++) {
        showCell(state[i], context, size, cellRadius);
    }
}
function getState(game) { // move to game.js?
    let state = game.grid.cells.map(cell => [...cell, null]);
    game.items.forEach(item => 
        state.find(cell => 
            cell[0] == item[0] && 
            cell[1] == item[1] && 
            cell[2] == item[2]
        )[3] = item[3]);
    return state;
}
export default class Canvas {
    constructor(size) {
        this.size = size;
        this.element = document.createElement('canvas');
        this.element.width = size;
        this.element.height = size;
        this.context = this.element.getContext('2d');
        this.cellRadius = size / 18;
        this.colors = colors;
        this.show = (game) => show(getState(game), this.context, this.size, this.cellRadius);
    }
}