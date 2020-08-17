import Grid from './grid.js';
class Ball {
    constructor(color) {
        this.color = color;
    }
}
class Cell {
    constructor(position, ball = null) {
        this.position = position;
        this.ball = ball;
    }
}
class State {
    constructor(radius) {
        this.cells = Grid.create(radius).map(position => new Cell(position, null));
        let outerPerimeter = Grid.getPerimeter(radius);
        for (let i = 0; i < outerPerimeter.length; i++) {
            this.cell(outerPerimeter[i]).ball = new Ball(i % 2);
        }
        // ...
    }
    cell(position) { // TODO: get cell without loop (dictionary?)
        return this.cells.find(cell =>
            cell.position[0] == position[0] &&
            cell.position[1] == position[1] &&
            cell.position[2] == position[2]
        );
    }
}
export default class Game {
    constructor(radius = 3) {
        this.state = new State(radius);
        this.history;
    }
    move(pair, destinition) {
        // if move legal
        // push to history and update state
        // if win?
    }
}