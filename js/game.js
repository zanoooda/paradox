import Grid from './grid.js';

function initState(radius) {
    let state = Grid.create(radius).map(position => {
        position.push(null);
        return position;
    });
    Grid.getPerimeter(radius).forEach((position, i) => {
        setItem(i % 2, position, state);
    });
    setItem(0, Grid.startPerimeter(Grid.startDirection, -1), state);
    setItem(1, Grid.startPerimeter(Grid.startDirection, 1), state);
    return state;
}
function setItem(value, position, state) { // dispose of loop
    state.find(cell =>
        cell[0] === position[0] &&
        cell[1] === position[1] &&
        cell[2] === position[2]
    )[3] = value;
}

export default class Game {
    constructor(radius = 3) {
        this.state = initState(radius);
    }
}