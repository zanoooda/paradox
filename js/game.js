import { createGrid } from './grid.js'

export class Game {
    constructor() {
        this.grid = createGrid(4);
        this.balls; //class Ball
        this.selectedPair; //[Ball{...}, Ball{...}]
        this.players; //class Player
    }
    selectPair(pair) {
        //...
    }
    move(pair) {
        //...
    }
}