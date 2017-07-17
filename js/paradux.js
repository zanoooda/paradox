// TODO: Make some better indication
alert("Blue first!");

// Variables

var l = Math.floor(window.innerHeight >= window.innerWidth ? window.innerWidth : window.innerHeight);

var container = document.getElementById("container");
container.style.width = l + "px";
container.style.height = l + "px";

var canvas = document.getElementById("paradux");
canvas.width = l;
canvas.height = l;

// May be replace listeners or wrap
canvas.addEventListener('mousemove', function (e) {

    var rect = canvas.getBoundingClientRect();
    var point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    console.log(point.x + ", " + point.y);

}, false);

canvas.addEventListener('click', function (e) {

    var rect = canvas.getBoundingClientRect();
    var point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    alert(point.x + ", " + point.y);

    // if point in one of the circles from an array.
    // getAllOptions(pair)
    // save options outside this function to be accessed for this listener
    // drawStuffFor(options)

    // if point in one of the options makeMovie(option);

}, false);

canvas.addEventListener('touchstart', function (e) {
    var rect = canvas.getBoundingClientRect();
    var point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    // Nan, NaN!
    alert(point.x + ", " + point.y);
}, false);

var context = canvas.getContext("2d");

// TODO: Save last movie or better all the history of the movies
//       After it you will be able to create undo/redo button
// TODO: Change hardcoded object to object with constructor
var state = [[{ x: 0, y: 0, color: 1 }, { x: 0, y: 1, color: 2 }, { x: 0, y: 2, color: 1 }, { x: 0, y: 3, color: 2 }],
             [{ x: 1, y: 0, color: 2 }, { x: 1, y: 1, color: 0 }, { x: 1, y: 2, color: 0 }, { x: 1, y: 3, color: 0 }, { x: 1, y: 4, color: 1 }],
             [{ x: 2, y: 0, color: 1 }, { x: 2, y: 1, color: 0 }, { x: 2, y: 2, color: 0 }, { x: 2, y: 3, color: 0 }, { x: 2, y: 4, color: 0 }, { x: 2, y: 5, color: 2 }],
             [{ x: 3, y: 0, color: 2 }, { x: 3, y: 1, color: 0 }, { x: 3, y: 2, color: 1 }, { x: 3, y: 3, color: 0 }, { x: 3, y: 4, color: 2 }, { x: 3, y: 5, color: 0 }, { x: 3, y: 6, color: 1 }],
             [{ x: 4, y: 0, color: 1 }, { x: 4, y: 1, color: 0 }, { x: 4, y: 2, color: 0 }, { x: 4, y: 3, color: 0 }, { x: 4, y: 4, color: 0 }, { x: 4, y: 5, color: 2 }],
             [{ x: 5, y: 0, color: 2 }, { x: 5, y: 1, color: 0 }, { x: 5, y: 2, color: 0 }, { x: 5, y: 3, color: 0 }, { x: 5, y: 4, color: 1 }],
             [{ x: 6, y: 0, color: 1 }, { x: 6, y: 1, color: 2 }, { x: 6, y: 2, color: 1 }, { x: 6, y: 3, color: 2 }]];

var pairs = [];

var options = [];

// Functions

function findPairs(state) {
    var pairs = [];
    var oArr = [{ x: 1, y: 0},{ x: 1, y: 1},{ x: 0, y: 1},{ x: -1, y: 0},{ x: -1, y: -1},{ x: 0, y: -1}];

    alert(state[0][-1]);

    for (var x = 0; x < state.length; x++) {
        for (var y = 0; y < state[x].length; y++) {
            // I'am here

            // find all with dublications

            if(state[x][y].color != 0) {
                console.log(state[x][y].x + ", " + state[x][y].y)

                for (var oArrIndex = 0; oArrIndex < oArr.length; oArrIndex++) {
                    console.log("..." + (x + oArr[oArrIndex].x) + ", " + (y + oArr[oArrIndex].y)); 

                    // if cell exists
                }
            }
        }
    }

    // remove dublicatons

    return pairs;
}

function render(state) {
    // TODO: Add options to highlight circles

    // Start position of the currient line
    var start = { x: l / 4 + l / 16, y: l / 8 };

    for (var x = 0; x < state.length; x++) {
        for (var y = 0; y < state[x].length; y++) {
            // each Cell/circle 

            context.beginPath();
            context.arc(start.x + (l / 8 * y), start.y, (l / 16) * 0.8, 0, 2 * Math.PI, false);

            switch (state[x][y].color) {
                case 1:
                    context.fillStyle = 'blue';
                    context.strokeStyle = 'darkblue';
                    context.lineWidth = 5;
                    break;
                case 2:
                    context.fillStyle = 'red';
                    context.strokeStyle = 'darkred';
                    context.lineWidth = 5;
                    break;

                default:
                    context.fillStyle = 'white';
                    context.strokeStyle = 'gray';
                    context.lineWidth = 1;
                    break;
            }

            context.fill();
            context.stroke();
        }
        // Change start object. start object describe where currient row starts
        if (x < 3)
            start.x = start.x - l / 16;
        else
            start.x = start.x + l / 16;
        start.y = start.y + l / 8;
    }

    // I'am here

    pairs = findPairs(state);
    
    // foreach pairs
    // make line between two circles
    // get center point of the line
    // make circle around this point
    // save circle to an array. may be to the pairs array. This array must be visible for listeners. 
}

// Here a magic starts
render(state);