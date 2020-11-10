// Swap names between paradox.js and game.js
import Paradox from './paradox.js';

let container = document.getElementById('container');
let indicator = document.getElementById('indicator');
let paradox = new Paradox(container, indicator);
// paradox.playWithRobot(0);
paradox.playWithRobot(1);
// paradox.playHotSeat();