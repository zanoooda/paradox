import Grid from './grid.js';

function initState(radius) {
    let state = Grid.create(radius).map(coordinates => {
        coordinates.push(null);
        return coordinates;
    });
    Grid.getPerimeter(radius).forEach((coordinates, i) => {
        setItem(i % 2, coordinates, state);
    });
    setItem(0, Grid.startPerimeter(Grid.startDirection, -1), state);
    setItem(1, Grid.startPerimeter(Grid.startDirection, 1), state);
    return state;
}
function setItem(value, coordinates, state) { // dispose of loop
    state.find(cell =>
        cell[0] === coordinates[0] &&
        cell[1] === coordinates[1] &&
        cell[2] === coordinates[2]
    )[3] = value;
}

export default class Game {
    constructor(radius = 3) {
        this.state = initState(radius);
    }
}