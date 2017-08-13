// Functions
function playOffline() {
    console.log('play offline');

    //

    $("#menu-close").click(); 
}
function playOnline() {
    console.log('play online');

    //

    $("#menu-close").click(); 
}
function playWithRobot() {
    console.log('play with robot');

    //

    $("#menu-close").click(); 
}
function back() {
    console.log('back'); 

    //
}
function restart() { 
    console.log('restart'); 

    //
}

var socket;

var l;

$(document).ready(function(){
    // Buttons
    $("#offline").click(function() {
        playOffline();
    });
    $("#online").click(function() {
        playOnline();
    });
    $("#robot").click(function() {
        playWithRobot();
    });
    $("#back").click(function() {
        back();
    });
    $("#restart").click(function() {
        restart();
    });
    
    // Sockets
    socket = io('http://localhost:3000/');

    socket.on('connect', function() {
        console.log('socket connected');
    });
    socket.on('move', function(newState) {
        console.log('move');
    });
    socket.on('opponent-found', function(color) {
        console.log('opponent-found', color);
    });
    socket.on('counter', function(n) {
        console.log('counter', n);
    });
    socket.on('disconnect', function() {
        console.log('socket disconnected');
    });

    l = Math.floor((window.innerHeight >= window.innerWidth ? window.innerWidth : window.innerHeight) * 1);

    var canvas = document.getElementById("paradox");
    canvas.width = l;
    canvas.height = l;
});