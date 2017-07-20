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
        options = [];
        render(state);

        return;
    }

    for (var optionsIndex = 0; optionsIndex < options.length; optionsIndex++) {
        //var element = options[optionsIndex];
        //
        // checking this
        if(getL(point, options[optionsIndex].m) < ((l/16) * 0.5)) {
            state[selected.first.x][selected.first.y].color = 0;
            state[selected.second.x][selected.second.y].color = 0;

            state[options[optionsIndex].first.x][options[optionsIndex].first.y].color = 1;
            state[options[optionsIndex].second.x][options[optionsIndex].second.y].color = 2;
            selected = null;
            options = [];
            render(state);

            return;
        }
    }

    for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
        if(getL(point, pairs[pairIndex].m) < ((l/16) * 0.5)) {
            //alert(pairs[pairIndex].first.x + ", " + pairs[pairIndex].first.y + " and " + pairs[pairIndex].second.x + ", " + pairs[pairIndex].second.y);
            
            selected = pairs[pairIndex];

            options = getOptions(pairs[pairIndex]);

            // I'am here

            render(state);

            return;
        } 
    }

}, false);

canvas.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
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
// var state = [[{ x: 0, y: 0, color: 0 }, { x: 0, y: 1, color: 2 }, { x: 0, y: 2, color: 2 }, { x: 0, y: 3, color: 1 }],
//              [{ x: 1, y: 0, color: 0 }, { x: 1, y: 1, color: 0 }, { x: 1, y: 2, color: 0 }, { x: 1, y: 3, color: 1 }, { x: 1, y: 4, color: 1 }],
//              [{ x: 2, y: 0, color: 0 }, { x: 2, y: 1, color: 0 }, { x: 2, y: 2, color: 2 }, { x: 2, y: 3, color: 1 }, { x: 2, y: 4, color: 0 }, { x: 2, y: 5, color: 2 }],
//              [{ x: 3, y: 0, color: 2 }, { x: 3, y: 1, color: 2 }, { x: 3, y: 2, color: 1 }, { x: 3, y: 3, color: 1 }, { x: 3, y: 4, color: 0 }, { x: 3, y: 5, color: 2 }, { x: 3, y: 6, color: 1 }],
//              [{ x: 4, y: 0, color: 0 }, { x: 4, y: 1, color: 1 }, { x: 4, y: 2, color: 0 }, { x: 4, y: 3, color: 0 }, { x: 4, y: 4, color: 0 }, { x: 4, y: 5, color: 0 }],
//              [{ x: 5, y: 0, color: 2 }, { x: 5, y: 1, color: 2 }, { x: 5, y: 2, color: 0 }, { x: 5, y: 3, color: 0 }, { x: 5, y: 4, color: 1 }],
//              [{ x: 6, y: 0, color: 0 }, { x: 6, y: 1, color: 0 }, { x: 6, y: 2, color: 1 }, { x: 6, y: 3, color: 2 }]];

var state = [[{ x: 0, y: 0, color: 1 }, { x: 0, y: 1, color: 2 }, { x: 0, y: 2, color: 1 }, { x: 0, y: 3, color: 2 }],
             [{ x: 1, y: 0, color: 0 }, { x: 1, y: 1, color: 2 }, { x: 1, y: 2, color: 0 }, { x: 1, y: 3, color: 0 }, { x: 1, y: 4, color: 1 }],
             [{ x: 2, y: 0, color: 0 }, { x: 2, y: 1, color: 1 }, { x: 2, y: 2, color: 0 }, { x: 2, y: 3, color: 0 }, { x: 2, y: 4, color: 0 }, { x: 2, y: 5, color: 2 }],
             [{ x: 3, y: 0, color: 0 }, { x: 3, y: 1, color: 1 }, { x: 3, y: 2, color: 2 }, { x: 3, y: 3, color: 0 }, { x: 3, y: 4, color: 2 }, { x: 3, y: 5, color: 0 }, { x: 3, y: 6, color: 1 }],
             [{ x: 4, y: 0, color: 0 }, { x: 4, y: 1, color: 0 }, { x: 4, y: 2, color: 1 }, { x: 4, y: 3, color: 0 }, { x: 4, y: 4, color: 0 }, { x: 4, y: 5, color: 2 }],
             [{ x: 5, y: 0, color: 0 }, { x: 5, y: 1, color: 0 }, { x: 5, y: 2, color: 2 }, { x: 5, y: 3, color: 0 }, { x: 5, y: 4, color: 1 }],
             [{ x: 6, y: 0, color: 1 }, { x: 6, y: 1, color: 2 }, { x: 6, y: 2, color: 1 }, { x: 6, y: 3, color: 2 }]];

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

function getOptions(pair) {
    var options = [];

    if(pair.first.x == pair.second.x) {
        // they stand horizontaly

        // try left
        var right = pair.first.y > pair.second.y ? pair.first : pair.second;
        var left = pair.first.y < pair.second.y ? pair.first : pair.second;
        if(state[left.x][left.y - 1] !== undefined && state[left.x][left.y - 1].color == 0) {
            var p = JSON.parse(JSON.stringify(pair)); // clone
            p.first.y -= 1;
            p.second.y -= 1;
            p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
            //
            options.push(p);
        }
        // try right
        if(state[right.x][right.y + 1] !== undefined && state[right.x][right.y + 1].color == 0) {
            var p = JSON.parse(JSON.stringify(pair)); // clone
            p.first.y += 1;
            p.second.y += 1;
            p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
            //
            options.push(p);
        }
        // try up left
        if(right.x < 3) {
            if(
                state[right.x - 1] &&
                state[right.x - 1][right.y - 1] !== undefined &&
                state[left.x - 1][left.y - 1] !== undefined &&
                state[right.x - 1][right.y - 1].color == 0 &&
                state[left.x - 1][left.y - 1].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x -= 1;
                p.first.y -= 1;
                p.second.x -= 1;
                p.second.y -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else if (right.x == 3) {
            if(
                state[right.x - 1][right.y - 1] !== undefined &&
                state[left.x - 1][left.y - 1] !== undefined &&
                state[right.x - 1][right.y - 1].color == 0 &&
                state[left.x - 1][left.y - 1].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x -= 1;
                p.first.y -= 1;
                p.second.x -= 1;
                p.second.y -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else {
            if(
                state[right.x - 1][right.y] !== undefined &&
                state[left.x - 1][left.y] !== undefined &&
                state[right.x - 1][right.y].color == 0 &&
                state[left.x - 1][left.y].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x -= 1;
                p.second.x -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        }
        // try up right
        if(right.x < 3) {
            if(
                state[right.x - 1] &&
                state[right.x - 1][right.y] !== undefined &&
                state[left.x - 1][left.y] !== undefined &&
                state[right.x - 1][right.y].color == 0 &&
                state[left.x - 1][left.y].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x -= 1;
                p.second.x -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else if (right.x == 3) {
            if(
                state[right.x - 1][right.y] !== undefined &&
                state[left.x - 1][left.y] !== undefined &&
                state[right.x - 1][right.y].color == 0 &&
                state[left.x - 1][left.y].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x -= 1;
                p.second.x -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else {
            if(
                state[right.x - 1][right.y + 1] !== undefined &&
                state[left.x - 1][left.y + 1] !== undefined &&
                state[right.x - 1][right.y + 1].color == 0 &&
                state[left.x - 1][left.y + 1].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x -= 1;
                p.first.y += 1;
                p.second.x -= 1;
                p.second.y += 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        }
        // try down right
        if(right.x < 3) {
            if(
                state[right.x + 1][right.y + 1] !== undefined &&
                state[left.x + 1][left.y + 1] !== undefined &&
                state[right.x + 1][right.y + 1].color == 0 &&
                state[left.x + 1][left.y + 1].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x += 1;
                p.first.y += 1;
                p.second.x += 1;
                p.second.y += 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else if (right.x == 3) {
            if(
                state[right.x + 1][right.y] !== undefined &&
                state[left.x + 1][left.y] !== undefined &&
                state[right.x + 1][right.y].color == 0 &&
                state[left.x + 1][left.y].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x += 1;
                p.second.x += 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else {
            if(
                state[right.x + 1] &&
                state[right.x + 1][right.y] !== undefined &&
                state[left.x + 1][left.y] !== undefined &&
                state[right.x + 1][right.y].color == 0 &&
                state[left.x + 1][left.y].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x += 1;
                p.second.x += 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        }
        // try down left
        if(right.x < 3) {
            if(
                state[right.x + 1][right.y] !== undefined &&
                state[left.x + 1][left.y] !== undefined &&
                state[right.x + 1][right.y].color == 0 &&
                state[left.x + 1][left.y].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x += 1;
                p.second.x += 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else if (right.x == 3) {
            if(
                state[right.x + 1][right.y - 1] !== undefined &&
                state[left.x + 1][left.y - 1] !== undefined &&
                state[right.x + 1][right.y - 1].color == 0 &&
                state[left.x + 1][left.y - 1].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x += 1;
                p.first.y -= 1;
                p.second.x += 1;
                p.second.y -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        } else {
            if(
                state[right.x + 1] &&
                state[right.x + 1][right.y - 1] !== undefined &&
                state[left.x + 1][left.y - 1] !== undefined &&
                state[right.x + 1][right.y - 1].color == 0 &&
                state[left.x + 1][left.y - 1].color == 0
            ) {
                var p = JSON.parse(JSON.stringify(pair)); // clone
                p.first.x += 1;
                p.first.y -= 1;
                p.second.x += 1;
                p.second.y -= 1;
                p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                //
                options.push(p);
            }
        }
    } else {
        var upper = pair.first.x < pair.second.x ? pair.first : pair.second;
        var bottom = pair.first.x > pair.second.x ? pair.first : pair.second;
        
        // Here will be two situations, lets call it temporary E (east) and W (west)
        if(upper.x < 3) {
            if(upper.y == bottom.y) {
                // E
                alert('upper.x < 3 and E');

                // try up
                if(
                    state[upper.x - 1] !== undefined &&
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone
                    p.first.x -= 1;
                    p.second.x -= 1;
                    p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    
                    options.push(p);
                }

                // try down
                if(bottom.x <= 2) {
                    if(
                        state[upper.x + 1][upper.y] !== undefined &&
                        state[upper.x + 1][upper.y].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone
                        p.first.x += 1;
                        p.second.x += 1;
                        p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                        options.push(p);
                    }
                } else {
                    if(
                        state[bottom.x + 1] !== undefined &&
                        state[upper.x + 1][upper.y - 1] !== undefined &&
                        state[upper.x + 1][upper.y - 1].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        // if(bottom.x == 3) {

                        // }

                        p.m = getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                        // options.push(p);
                    }
                }
                // try right up
                // try right down
                // try left up
                // try left down
                // when I will try down I have to think that if bottom.x == 3 => different than another situations
            } else {
                // W
                //alert('upper.x < 3 and W');

                // try up
                // try down
                // try right up
                // try right down
                // try left up
                // try left down
            }
        } else if(upper.x == 3) {
            if(upper.y == bottom.y) {
                // E
                //alert('upper.x = 3 and E');

                // try up
                // try down
                // try right up
                // try right down
                // try left up
                // try left down
            } else {
                // W
                //alert('upper.x = 3 and W');

                // try up
                // try down
                // try right up
                // try right down
                // try left up
                // try left down
            }
        } else {
            if(upper.y == bottom.y) {
                // W
                //alert('upper.x > 3 and W');

                // try up
                // try down
                // try right up
                // try right down
                // try left up
                // try left down
            } else {
                // E
                //alert('upper.x > 3 and E');

                // try up
                // try down
                // try right up
                // try right down
                // try left up
                // try left down
            }
        }
    }

    return options;
}

function findPairs(state) {
    var pairs = [];
    var oArrUp = [{ x: 1, y: 0},{ x: 1, y: 1},{ x: 0, y: 1},{ x: -1, y: 0},{ x: -1, y: -1},{ x: 0, y: -1}];
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

    for (var i = 0; i < options.length; i++) {
        var element = options[i];
        context.beginPath();
        context.arc(options[i].m.x, options[i].m.y, (l / 16) * 0.5, 0, 2 * Math.PI, false);
        context.strokeStyle = 'green';
        context.lineWidth = 2;
        context.stroke();
    }

    if(selected) {
        context.beginPath();
        context.arc(selected.m.x, selected.m.y, (l / 16) * 0.5, 0, 2 * Math.PI, false);
        context.strokeStyle = 'green';
        context.lineWidth = 2;
        context.stroke();
    }
}

// Here a magic starts
render(state);