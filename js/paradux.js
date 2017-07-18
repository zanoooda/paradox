// TODO: Make some better indication
//alert("Blue first!");

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

    //console.log(point.x + ", " + point.y);

}, false);

canvas.addEventListener('click', function (e) {

    var rect = canvas.getBoundingClientRect();
    var point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    if(selected && getL(point, selected.m) < ((l/16) * 0.5)) {
       
        state[selected.first.x][selected.first.y].color = 2;
        state[selected.second.x][selected.second.y].color = 1;
        selected = null;
        render(state);

        return;
    }

    for (var optionsIndex = 0; optionsIndex < options.length; optionsIndex++) {
        //var element = options[optionsIndex];
        
    }

    for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
        if(getL(point, pairs[pairIndex].m) < ((l/16) * 0.5)) {
            //alert(pairs[pairIndex].first.x + ", " + pairs[pairIndex].first.y + " and " + pairs[pairIndex].second.x + ", " + pairs[pairIndex].second.y);
            
            selected = pairs[pairIndex];
            render(state);

            // fill options array

            return;
        } 
    }

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

    alert(point.x + ", " + point.y); // Nan, NaN!

}, false);

var context = canvas.getContext("2d");

// TODO: Save last movie or better all the history of the movies
//       After it you will be able to create undo/redo button
// TODO: Change hardcoded object to object with constructor
// var state = [[{ x: 0, y: 0, color: 1 }, { x: 0, y: 1, color: 2 }, { x: 0, y: 2, color: 1 }, { x: 0, y: 3, color: 2 }],
//              [{ x: 1, y: 0, color: 2 }, { x: 1, y: 1, color: 0 }, { x: 1, y: 2, color: 0 }, { x: 1, y: 3, color: 0 }, { x: 1, y: 4, color: 1 }],
//              [{ x: 2, y: 0, color: 1 }, { x: 2, y: 1, color: 0 }, { x: 2, y: 2, color: 0 }, { x: 2, y: 3, color: 0 }, { x: 2, y: 4, color: 0 }, { x: 2, y: 5, color: 2 }],
//              [{ x: 3, y: 0, color: 2 }, { x: 3, y: 1, color: 0 }, { x: 3, y: 2, color: 1 }, { x: 3, y: 3, color: 0 }, { x: 3, y: 4, color: 2 }, { x: 3, y: 5, color: 0 }, { x: 3, y: 6, color: 1 }],
//              [{ x: 4, y: 0, color: 1 }, { x: 4, y: 1, color: 0 }, { x: 4, y: 2, color: 0 }, { x: 4, y: 3, color: 0 }, { x: 4, y: 4, color: 0 }, { x: 4, y: 5, color: 2 }],
//              [{ x: 5, y: 0, color: 2 }, { x: 5, y: 1, color: 0 }, { x: 5, y: 2, color: 0 }, { x: 5, y: 3, color: 0 }, { x: 5, y: 4, color: 1 }],
//              [{ x: 6, y: 0, color: 1 }, { x: 6, y: 1, color: 2 }, { x: 6, y: 2, color: 1 }, { x: 6, y: 3, color: 2 }]];
//
var state = [[{ x: 0, y: 0, color: 0 }, { x: 0, y: 1, color: 2 }, { x: 0, y: 2, color: 1 }, { x: 0, y: 3, color: 2 }],
             [{ x: 1, y: 0, color: 0 }, { x: 1, y: 1, color: 0 }, { x: 1, y: 2, color: 0 }, { x: 1, y: 3, color: 1 }, { x: 1, y: 4, color: 1 }],
             [{ x: 2, y: 0, color: 0 }, { x: 2, y: 1, color: 0 }, { x: 2, y: 2, color: 1 }, { x: 2, y: 3, color: 2 }, { x: 2, y: 4, color: 0 }, { x: 2, y: 5, color: 2 }],
             [{ x: 3, y: 0, color: 2 }, { x: 3, y: 1, color: 2 }, { x: 3, y: 2, color: 1 }, { x: 3, y: 3, color: 1 }, { x: 3, y: 4, color: 0 }, { x: 3, y: 5, color: 2 }, { x: 3, y: 6, color: 1 }],
             [{ x: 4, y: 0, color: 0 }, { x: 4, y: 1, color: 1 }, { x: 4, y: 2, color: 0 }, { x: 4, y: 3, color: 0 }, { x: 4, y: 4, color: 0 }, { x: 4, y: 5, color: 0 }],
             [{ x: 5, y: 0, color: 2 }, { x: 5, y: 1, color: 0 }, { x: 5, y: 2, color: 2 }, { x: 5, y: 3, color: 0 }, { x: 5, y: 4, color: 1 }],
             [{ x: 6, y: 0, color: 0 }, { x: 6, y: 1, color: 0 }, { x: 6, y: 2, color: 1 }, { x: 6, y: 3, color: 2 }]];

var pairs = [];

var selected = null;

var options = [];

// Functions

function getL(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
}

function getM(first, second) {
    return {
        x: (first.xPx + second.xPx) / 2,
        y: (first.yPx + second.yPx) / 2
    };
}

function findPairs(state) {
    var pairs = [];
    var oArrUp = [{ x: 1, y: 0},{ x: 1, y: 1},{ x: 0, y: 1},{ x: -1, y: 0},{ x: -1, y: -1},{ x: 0, y: -1}];
    // I'am here
    var oArrMiddle = [{ x: 1, y: -1},{ x: 1, y: 0},{ x: 0, y: 1},{ x: -1, y: 0},{ x: -1, y: -1},{ x: 0, y: -1}];
    var oArrDown = [{ x: 1, y: -1},{ x: 1, y: 0},{ x: 0, y: 1},{ x: -1, y: 1},{ x: -1, y: 0},{ x: 0, y: -1}];

    for (var x = 0; x < state.length; x++) {
        for (var y = 0; y < state[x].length; y++) {
            // find all with dublications

            if(state[x][y].color != 0) {
                //console.log(state[x][y].x + ", " + state[x][y].y)

                for (var oArrIndex = 0; oArrIndex < oArrUp.length; oArrIndex++) {
                    if(x < 3) {
                        if(
                            state[x + oArrUp[oArrIndex].x] !== undefined && 
                            state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y] !== undefined && 
                            state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y].color != 0 &&
                            state[x][y].color != state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y].color
                        ) {
                            //console.log("..." + (x + oArrUp[oArrIndex].x) + ", " + (y + oArrUp[oArrIndex].y) + " " + state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y]);

                            pairs.push({
                                first: state[x][y].color == 1 ? { x: x, y: y} : { x: x + oArrUp[oArrIndex].x, y: y + oArrUp[oArrIndex].y},
                                second: state[x][y].color == 2 ? { x: x, y: y} : { x: x + oArrUp[oArrIndex].x, y: y + oArrUp[oArrIndex].y}
                            });
                        }
                    } else if(x == 3) {
                        if(
                            state[x + oArrMiddle[oArrIndex].x] !== undefined && 
                            state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y] !== undefined && 
                            state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y].color != 0 &&
                            state[x][y].color != state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y].color
                        ) {
                            //console.log("..." + (x + oArrMiddle[oArrIndex].x) + ", " + (y + oArrMiddle[oArrIndex].y) + " " + state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y]);

                            pairs.push({
                                first: state[x][y].color == 1 ? { x: x, y: y} : { x: x + oArrMiddle[oArrIndex].x, y: y + oArrMiddle[oArrIndex].y},
                                second: state[x][y].color == 2 ? { x: x, y: y} : { x: x + oArrMiddle[oArrIndex].x, y: y + oArrMiddle[oArrIndex].y}
                            });
                        }
                    } else {
                        if(
                            state[x + oArrDown[oArrIndex].x] !== undefined && 
                            state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y] !== undefined && 
                            state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y].color != 0 &&
                            state[x][y].color != state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y].color
                        ) {
                            //console.log("..." + (x + oArrDown[oArrIndex].x) + ", " + (y + oArrDown[oArrIndex].y) + " " + state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y]);

                            pairs.push({
                                first: state[x][y].color == 1 ? { x: x, y: y} : { x: x + oArrDown[oArrIndex].x, y: y + oArrDown[oArrIndex].y},
                                second: state[x][y].color == 2 ? { x: x, y: y} : { x: x + oArrDown[oArrIndex].x, y: y + oArrDown[oArrIndex].y}
                            });
                        }
                    }
                }
            }
        }
    }

    // remove dublicatons

    var uniq = new Set();
    pairs.forEach(e => uniq.add(JSON.stringify(e)));
    pairs = Array.from(uniq).map(e => JSON.parse(e));

    return pairs;
}

function render(state) {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // TODO: Add options to highlight circles

    // Start position of the currient line
    var start = { x: l / 4 + l / 16, y: l / 8 };

    for (var x = 0; x < state.length; x++) {
        for (var y = 0; y < state[x].length; y++) {
            // each Cell/circle 

            context.beginPath();
            context.arc(start.x + (l / 8 * y), start.y, (l / 16) * 0.8, 0, 2 * Math.PI, false);

            // write point to state
            state[x][y].xPx = start.x + (l / 8 * y);
            state[x][y].yPx = start.y;

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

    pairs = findPairs(state);

    for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
        pairs[pairIndex].m = getM(state[pairs[pairIndex].first.x][pairs[pairIndex].first.y], state[pairs[pairIndex].second.x][pairs[pairIndex].second.y]);
    }

    if(selected) {
        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
            if(
                pairs[pairIndex].first.x == selected.first.x && 
                pairs[pairIndex].first.y == selected.first.y &&
                pairs[pairIndex].second.x == selected.second.x && 
                pairs[pairIndex].second.y == selected.second.y
            ) {
                // remove selected from pairs
                pairs.splice(pairIndex, 1);
            }
        }

        context.beginPath();
        context.arc(
            state[selected.first.x][selected.first.y].xPx, 
            state[selected.first.x][selected.first.y].yPx,  
            (l / 16) * 0.8, 
            0, 
            2 * Math.PI, 
            false
        );
        context.strokeStyle = 'purple';
        context.lineWidth = 17;
        context.stroke();

        context.beginPath();
        context.arc(
            state[selected.second.x][selected.second.y].xPx, 
            state[selected.second.x][selected.second.y].yPx,  
            (l / 16) * 0.8, 
            0, 
            2 * Math.PI, 
            false
        );
        context.strokeStyle = 'purple';
        context.lineWidth = 17;
        context.stroke();

        // for options ...
    }

    // debug
    for (var i = 0; i < pairs.length; i++) {
        var element = pairs[i];
        context.beginPath();
        context.arc(pairs[i].m.x, pairs[i].m.y, (l / 16) * 0.5, 0, 2 * Math.PI, false);
        context.strokeStyle = 'yellow';
        context.lineWidth = 1;
        context.stroke();
    }
}

// Here a magic starts
render(state);