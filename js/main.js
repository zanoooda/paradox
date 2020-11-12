import Paradox from './paradox.js';

let container = document.getElementById('container');
let indicator = document.getElementById('indicator');
let menu = document.getElementById('menu');
let menuButton = document.getElementById('menu-button');
let playHotSeatButton = document.getElementById('play-hotseat-button');
let playWithBlueRobotButton = document.getElementById('play-with-blue-robot-button');
let playWithRedRobotButton = document.getElementById('play-with-red-robot-button');
let undoButton = document.getElementById('undo-button');

let paradox = new Paradox(container, indicator, undoButton);

menu.classList.toggle('show');

menuButton.addEventListener('click', () => {
    menu.classList.toggle('show');
});
playHotSeatButton.addEventListener('click', () => {
    menu.classList.toggle('show');
    paradox.playHotSeat();
});
playWithBlueRobotButton.addEventListener('click', () => {
    menu.classList.toggle('show');
    paradox.playWithRobot(0);
});
playWithRedRobotButton.addEventListener('click', () => {
    menu.classList.toggle('show');
    paradox.playWithRobot(1);
});