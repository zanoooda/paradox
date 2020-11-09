import Paradox from './paradox.js';

let container = document.getElementById('container');
let indicator = document.getElementById('indicator');
let paradox = new Paradox(container, indicator);
paradox.playHotSeat();