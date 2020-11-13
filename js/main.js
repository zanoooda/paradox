import Paradox from './paradox.js';

let container = document.getElementById('container');
let indicator = document.getElementById('indicator');
let menu = document.getElementById('menu');
let menuButton = document.getElementById('menu-button');
let playHotSeatButton = document.getElementById('play-hotseat-button');
let playWithRobotButton = document.getElementById('play-with-robot-button');
let playOnlineButton = document.getElementById('play-online');
let undoButton = document.getElementById('undo-button');
let replayLastMoveButton = document.getElementById('replay-last-move-button');
let settingsButton = document.getElementById('settings-button');
let settings = document.getElementById('settings');

let paradox = new Paradox(container, indicator, undoButton, replayLastMoveButton);

menu.classList.add('show');

menuButton.addEventListener('click', () => {
    settings.classList.remove('show');
    menu.classList.toggle('show');
});
playHotSeatButton.addEventListener('click', () => {
    menu.classList.remove('show');
    paradox.playHotSeat();
});
playWithRobotButton.addEventListener('click', () => {
    menu.classList.remove('show');
    paradox.playWithRobot(0);
});
playOnlineButton.addEventListener('click', () => {
    // ...
});
settingsButton.addEventListener('click', () => {
    menu.classList.remove('show');
    settings.classList.toggle('show');
});