import Grid from './grid.js';
class Color {
    static first = 'red';
    static second = 'blue';
}
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
class Board {
    constructor() {
        this.cells = Grid.create(4).map(position => new Cell(position, null));
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