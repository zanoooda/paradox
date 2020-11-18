import { Paradox, showSpinner, hideSpinner, attachMessage } from './paradox.js';

const server = 'https://paradox-server.herokuapp.com'; //'http://localhost:3000'
var socket;

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

paradox.playWithRobot(humanPlayer);

FBInstant.startGameAsync().then(function () {
    game.start();
});

menuButton.addEventListener('click', () => {
    playOnlineButton.innerHTML = (socket?.connected ?? false) ? 'Disconnect' : 'Play with Friend';
    settings.classList.remove('show');
    menu.classList.toggle('show');
});
playHotSeatButton.addEventListener('click', () => {
    socket?.disconnect();
    hideSpinner(spinner);
    menu.classList.remove('show');
    paradox.playHotSeat();
});
playWithRobotButton.addEventListener('click', () => {
    socket?.disconnect();
    hideSpinner(spinner);
    menu.classList.remove('show');
    paradox.playWithRobot(humanPlayer);
});
playOnlineButton.addEventListener('click', () => {
    return;
    hideSpinner(spinner);
    if (socket?.connected) {
        socket.disconnect();
        playOnlineButton.innerHTML = "Play Online";
    }
    else {
        playOnlineButton.innerHTML = "Connecting...";
        socket = io.connect(server);
        socket.on('connect', () => {
            console.log('socket connected');
            playOnlineButton.innerHTML = "Disconnect";
            menu.classList.remove('show');
            paradox.stop();
            showSpinner(spinner, `Looking for a partner online. `);
        });
        socket.on('counter', (n) => { // online-users-counter
            console.log(n - 1 + ' users online');
            attachMessage(spinner, `${n - 1} users online.`);
        });
        socket.on('partner-found', (player) => {
            console.log('partner-found. you play ', player);
            hideSpinner(spinner);
            paradox.playOnline(player, socket);
        });
        socket.on('disconnect', () => {
            console.log('socket disconnected');
            playOnlineButton.innerHTML = "Play Online";
            paradox.stop();
            showSpinner(spinner, 'disconnected');
        });
        socket.on('move', (move) => {
            console.log('move');
            paradox.move(move);
        });
    }
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