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
let robotPlayerCheckbox = document.getElementById("robot-player-checkbox");
let robotColorLabel = document.getElementById("robot-color-label");
let robotStrengthSelect = document.getElementById("robot-strength-select");

let spinner = document.getElementById("spinner");

let colors = ['red', 'blue'];

let humanPlayer = 0;
let paradox = new Paradox(container, indicator, undoButton, replayLastMoveButton, spinner);

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
    paradox.playWithRobot(humanPlayer);
});
playOnlineButton.addEventListener('click', () => {
    // ...
});
settingsButton.addEventListener('click', () => {
    menu.classList.remove('show');
    settings.classList.toggle('show');
});
robotColorLabel.style.color = colors[humanPlayer == 1 ? 0 : 1];
robotColorLabel.innerHTML = colors[humanPlayer == 1 ? 0 : 1];
robotPlayerCheckbox.addEventListener('change', (event) => {
    humanPlayer = event.target.checked ? 1 : 0;
    let robotPlayer = humanPlayer == 1 ? 0 : 1;
    robotColorLabel.style.color = colors[robotPlayer];
    robotColorLabel.innerHTML = colors[robotPlayer];
});
robotStrengthSelect.value = paradox.depth;
robotStrengthSelect.addEventListener('change', (event) => {
    paradox.depth = parseInt(event.target.value);
});
window.addEventListener('resize', (event) => {
    paradox.resize(Math.min(window.innerHeight, window.innerWidth));
});