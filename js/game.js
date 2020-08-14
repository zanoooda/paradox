class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext('2d');
        this.grid = this.createGrid();
    }
    createGrid(depth = 4) {
        let grid = new Array();
        for (let depthIndex = 0; depthIndex < depth; depthIndex++) {
            let cellCounter = depthIndex == 0 ? 1 : depthIndex * 6;
            for (let cellIndex = 0; cellIndex < cellCounter; cellIndex++) {
                grid.push(new Cell('?', '?', '?'));
            }
        }
        return grid;
    }
    play() {
        this.render();
    }
    render() {
        this.grid.forEach(cell => {
            this.renderCircle(this.canvas.width / 2, this.canvas.height / 2, canvasSize / 32);
        });
    }
    renderCircle(x, y, r) {
        this.canvasContext.beginPath();
        this.canvasContext.arc(x, y, r, 0, 2 * Math.PI);
        this.canvasContext.stroke();
    }
}
class Cell {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}