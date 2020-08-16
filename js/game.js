import Grid from './grid.js';
class Cell {
    constructor(position, ball = null) {
        this.position = position;
        this.ball = ball;
    }
}
class Board {
    constructor(radius = 4) {
        this.cells = Grid.create(radius).map(position => new Cell(position, null));
        // add balls to cells
    }
}
export default class Game {
    constructor() {
        this.board = new Board();
        this.moves;
    }
    move(pair, destinition) {
        // push to moves
        // update board
    }
}