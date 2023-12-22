import { Paradox, showSpinner, hideSpinner, attachMessage } from './paradox.js';

const server = 'https://paradox-server-production.up.railway.app/'; //'http://localhost:3000'
var socket;

let container = document.getElementById('container');
let message = document.getElementById('message');
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

let colors = ['black', 'white'];

let humanPlayer = 0;
let paradox = new Paradox(container, message, undoButton, replayLastMoveButton, spinner);

(async ()  => {
    showSpinner(spinner, 'Loading assets');
    try {
        await paradox.loadAssets();
    } catch (error) {
        console.log(error);
        showSpinner(spinner, error?.message);
        return;
    }
    hideSpinner(spinner);

    menu.classList.add('show');

    menuButton.addEventListener('click', () => {
        playOnlineButton.innerHTML = (socket?.connected ?? false) ? 'Disconnect' : 'Play Online';
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
        hideSpinner(spinner);
        if (socket?.connected) {
            socket.disconnect();
            playOnlineButton.innerHTML = "Play Online";
        }
        else {
            playOnlineButton.innerHTML = "Connecting...";
            socket = io.connect(server);
            socket.on('connect', () => {
                playOnlineButton.innerHTML = "Disconnect";
                menu.classList.remove('show');
                paradox.stop();
                showSpinner(spinner, `Looking for a partner online. `, 0);
            });
            socket.on('counter', (n) => { // online-users-counter
                attachMessage(spinner, `${n - 1} users online.`);
            });
            socket.on('partner-found', (player) => {
                hideSpinner(spinner);
                paradox.playOnline(player, socket);
            });
            socket.on('disconnect', () => {
                playOnlineButton.innerHTML = "Play Online";
                paradox.stop();
                showSpinner(spinner, 'disconnected', 0);
            });
            socket.on('move', (move) => {
                paradox.move(move);
            });
        }
    });
    settingsButton.addEventListener('click', () => {
        menu.classList.remove('show');
        settings.classList.toggle('show');
    });
    robotColorLabel.innerHTML = colors[humanPlayer == 1 ? 0 : 1];
    robotPlayerCheckbox.addEventListener('change', (event) => {
        humanPlayer = event.target.checked ? 1 : 0;
        let robotPlayer = humanPlayer == 1 ? 0 : 1;
        robotColorLabel.innerHTML = colors[robotPlayer];
    });
    robotStrengthSelect.value = paradox.depth;
    robotStrengthSelect.addEventListener('change', (event) => {
        paradox.depth = parseInt(event.target.value);
    });
    window.addEventListener('resize', (event) => {
        paradox.resize(Math.min(window.innerHeight, window.innerWidth));
    });
})();