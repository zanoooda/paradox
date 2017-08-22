// Functions
function playOffline() {
    //if game not offline
    if(game.online) {
        socket.disconnect();
        // This can be the place for bug. (connected count)
    }
    if(!game.offline) {
        console.log('play offline');

        highlight('offline');
        $("#buttons").show();
        // wrap it into something
        $("#message").html("Blue move");
        $("#message").css("color", "blue");        
        $("#status").css("background-color", "blue");
        //
        game.updateStatus = function() {
            // TODO: Refactor me later
            // This must come back to paradox.ja as it was
            // but refactor
            if(this.who == 1) {
                document.getElementById('message').innerHTML = 'Blue\'s move';
                document.getElementById('message').style.color = 'blue';
                document.getElementById('status').style.backgroundColor = 'blue';
                document.getElementById('menu-toggle').style.backgroundColor = 'blue';
            } else {
                document.getElementById('message').innerHTML = 'Red\'s move';
                document.getElementById('message').style.color = 'red';
                document.getElementById('status').style.backgroundColor = 'red';
                document.getElementById('menu-toggle').style.backgroundColor = 'red';
            }
            
        };
        game.playOffline();
        
        if($("#sidebar-wrapper").hasClass("active")) {
            $("#menu-close").click(); 
        }
    } else {
        if($("#sidebar-wrapper").hasClass("active")) {
            $("#menu-close").click(); 
        }
    }
}
function playOnline() {
    if(!game.online) {
        console.log('play online');

        highlight('online');
        $("#buttons").hide();

        // wrap it into something
        $("#message").html("Looking for opponent");
        $("#message").css("color", "black"); // ???      
        $("#status").css("background-color", "white"); //???
        $("#menu-toggle").css("background-color", "gray"); //???
        //
        game.online = true;
        game.offline = false;
        game.robot = false;
        game.waiting = true;
        game.updateStatus = function() {
            // TODO: Refactor me later
            if(this.you == this.who) {
                document.getElementById('message').innerHTML = 'Your turn';
            } else {
                document.getElementById('message').innerHTML = 'Wait for opponent';
            }
            if(this.who == 1) {
                document.getElementById('message').style.color = 'blue';
                document.getElementById('status').style.backgroundColor = 'blue';
                document.getElementById('menu-toggle').style.backgroundColor = 'blue';
            } else {
                document.getElementById('message').style.color = 'red';
                document.getElementById('status').style.backgroundColor = 'red';
                document.getElementById('menu-toggle').style.backgroundColor = 'red';
            }
        };

        socket.emit("play");
        //game.playOnline();

        if($("#sidebar-wrapper").hasClass("active")) {
            $("#menu-close").click(); 
        }
    } else {
        if($("#sidebar-wrapper").hasClass("active")) {
            $("#menu-close").click(); 
        }
    }
}
function playWithRobot() {
    if(game.online) {
        socket.disconnect();
    }
    if(!game.robot) {
        console.log('play with robot');

        highlight('robot');
        $("#buttons").show();

        // wrap it into something
        $("#message").html("@@@");
        $("#message").css("color", "blue");   
        $("#status").css("background-color", "blue"); 
        $("#menu-toggle").css("background-color", "blue"); 
        //

        game.updateStatus = function() {
            // TODO: Refactor me later
            if(this.you == this.who) {
                document.getElementById('message').innerHTML = 'Your turn';
            } else {
                document.getElementById('message').innerHTML = 'Wait for move';
            }
            if(this.who == 1) {
                document.getElementById('message').style.color = 'blue';
                document.getElementById('status').style.backgroundColor = 'blue';
                document.getElementById('menu-toggle').style.backgroundColor = 'blue';
            } else {
                document.getElementById('message').style.color = 'red';
                document.getElementById('status').style.backgroundColor = 'red';
                document.getElementById('menu-toggle').style.backgroundColor = 'red';
            }
        };

        game.playWithRobot();

        if($("#sidebar-wrapper").hasClass("active")) {
            $("#menu-close").click(); 
        }
    } else {
        if($("#sidebar-wrapper").hasClass("active")) {
            $("#menu-close").click(); 
        }
    }
}
function back() {
    console.log('back'); 

    game.back();
}
function restart() { 
    console.log('restart'); 

    game.restart();
}
// Highlight the slide menu
function highlight(id) {

    if($("#offline").hasClass("bold")) {
        $("#offline").toggleClass("bold");
        $("#offline").html("Ply Offline");
    }
    if($("#online").hasClass("bold")) {
        $("#online").toggleClass("bold");
        $("#online").html("Ply Online");
    }
    if($("#robot").hasClass("bold")) {
        $("#robot").toggleClass("bold");
        $("#robot").html("Ply with Robot");
    }

    $("#" + id).toggleClass("bold");
    switch (id) {
        case "offline":
            $("#" + id).html("You are playing offline");
            break;

        case "online":
            $("#" + id).html("You are playing online");
            break;

        case "robot":
            $("#" + id).html("You are playing with robot");
            break;
    
        default:
            break;
    }
}

// Sockets
//var socket = io('http://localhost:3000/'); 
var socket = io('https://paradox-server.herokuapp.com');

socket.on('connect', function() {
    console.log('socket connected');

    $("#online").show();
});
socket.on('move', function(newState) {
    console.log('move');

    // wrap it to Game.protoytype
    if(game.who == 1) {
        game.who = 2;
    } else {
        game.who = 1;
    }

    game.waiting = false;
    game.selected = null;
    game.options = new Array();

    game.history.push(game.state);
    game.state = newState;

    game.render();
    //
});
socket.on('opponent-found', function(color) {
    console.log('opponent-found', color);

    game.playOnline(color);
});
socket.on('counter', function(n) {
    console.log('counter', n);
});
socket.on('disconnect', function() {
    console.log('socket disconnected');

    if(game.online) {
        $('#message').html("opponent disconnected");
        $("#message").css("color", "black");  
        $("#status").css("background-color", "white"); 
        $("#menu-toggle").css("background-color", "gray");

        $('#online').html("Play Online second time");

        game.stop();

        socket.open();
        // bug!
        // after online two sockets :(
    }
    
    // reconnect if server was down

    $("#online").hide();
});

// Length of the canvas
var l = Math.floor((window.innerHeight >= window.innerWidth ? window.innerWidth : window.innerHeight) * 1);

// Canvas
var canvas = document.getElementById("paradox");

canvas.width = l;
canvas.height = l;

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

var game = new Game(canvas);

$(document).ready(function(){
    playOffline();
});