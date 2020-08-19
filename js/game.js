import Grid from './grid.js';

function initState(radius) {
    let state = Grid.create(radius).map(position => {
        position.push(null);
        return position;
    });
    Grid.getPerimeter(radius).map((position, i) => getCell(position, state)[3] = i % 2);
    // Add two balls at the middle
    return state;
}
function getCell(position, state) { // Dispose of loop
    return state.find(cell =>
        cell[0] === position[0] &&
        cell[1] === position[1] &&
        cell[2] === position[2]
    );
}

function win(state) {
    return false;
}
function updateState(pair, direction, state) {
    return state;
}
function legal(pair, direction, state) { 
    return true;
}
export default class Game {
    constructor(radius = 3) {
        this.state = initState(radius);
        this.history = [this.state];
        this.winner = null;
    }
    move(pair, direction) {
        if (legal(pair, direction, this.state)) {
            this.history.push(this.state);
            this.state = updateState(pair, direction, this.state);
            if(win(state)) {
                this.winner = this.history.length % 2; // or opposit!
            }
            return true;
        } else return false;
    }
}