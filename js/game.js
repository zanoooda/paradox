import Grid from './grid.js'

export default class Game {
    constructor() {
        this.grid = Grid.create(4);
        this.balls; //class Ball
        this.selectedPair; //[Ball{...}, Ball{...}]
        this.players; //class Player
    }
    selectPair(pair) {
        //...
    }
    move(pair, d) {
        //...
    }
}