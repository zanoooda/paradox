function Game(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.l = canvas.height;

    this.addListeners();
}

Game.prototype.playOffline = function() {
    this.offline = true;
    this.online = false;
    this.robot = false;

    this.state = new State();
    this.history = new Array();
    this.pairs = new Array();
    this.selected = false;
    this.options = new Array();
    this.who = 1;
    this.you = null;
    this.waiting = false;

    this.render();
}
Game.prototype.playOnline = function(color) {
    this.offline = false;
    this.online = true;
    this.robot = false;

    this.state = new State();
    this.history = new Array();
    this.pairs = new Array();
    this.selected = false;
    this.options = new Array();
    this.who = 1;
    this.you = color;
    this.waiting = color == 1 ? false : true; //!!! ?!

    this.render();
}
Game.prototype.playWithRobot = function() {
    this.offline = false;
    this.online = false;
    this.robot = true;
    
    this.state = new State();
    this.history = new Array();
    this.pairs = new Array();
    this.selected = false;
    this.options = new Array();
    this.who = 1;
    this.you = 1;
    this.waiting = false;

    this.render();
}
Game.prototype.render = function() {
    // TODO: if this function exist
    this.updateStatus();

    // clear canvas
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    // Start position of the currient line
    var start = { x: this.l / 4 + this.l / 16, y: this.l / 8 };

    for (var x = 0; x < this.state.length; x++) {
        for (var y = 0; y < this.state[x].length; y++) {
            // each Cell/circle 

            this.context.beginPath();
            this.context.arc(start.x + (this.l / 8 * y), start.y, (this.l / 16) * 0.8, 0, 2 * Math.PI, false);

            // write point to state
            this.state[x][y].xPx = start.x + (this.l / 8 * y);
            this.state[x][y].yPx = start.y;

            switch (this.state[x][y].color) {
                case 1:
                    this.context.fillStyle = 'blue';
                    this.context.strokeStyle = 'darkblue';
                    this.context.lineWidth = 5;
                    break;
                case 2:
                    this.context.fillStyle = 'red';
                    this.context.strokeStyle = 'darkred';
                    this.context.lineWidth = 5;
                    break;

                default:
                    this.context.fillStyle = 'white';
                    this.context.strokeStyle = 'gray';
                    this.context.lineWidth = 1;
                    break;
            }

            this.context.fill();
            this.context.stroke();
        }
        // Change start object. start object describe where currient row starts
        if (x < 3)
            start.x = start.x - this.l / 16;
        else
            start.x = start.x + this.l / 16;
        start.y = start.y + this.l / 8;
    }
    // TODO: Move state variables to state.something
    this.pairs = this.findPairs();

    for (var pairIndex = 0; pairIndex < this.pairs.length; pairIndex++) {
        this.pairs[pairIndex].m = this.getM(this.state[this.pairs[pairIndex].first.x][this.pairs[pairIndex].first.y], this.state[this.pairs[pairIndex].second.x][this.pairs[pairIndex].second.y]);
    }

    if(this.selected) {
        for (var pairIndex = 0; pairIndex < this.pairs.length; pairIndex++) {
            if(
                this.pairs[pairIndex].first.x == this.selected.first.x && 
                this.pairs[pairIndex].first.y == this.selected.first.y &&
                this.pairs[pairIndex].second.x == this.selected.second.x && 
                this.pairs[pairIndex].second.y == this.selected.second.y
            ) {
                // remove selected from pairs
                this.pairs.splice(pairIndex, 1);
            }
        }

        this.context.beginPath();
        this.context.arc(
            this.state[this.selected.first.x][this.selected.first.y].xPx, 
            this.state[this.selected.first.x][this.selected.first.y].yPx,  
            (this.l / 16) * 0.8, 
            0, 
            2 * Math.PI, 
            false
        );
        this.context.strokeStyle = 'purple';
        this.context.lineWidth = this.l * 0.035;
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(
            this.state[this.selected.second.x][this.selected.second.y].xPx, 
            this.state[this.selected.second.x][this.selected.second.y].yPx,  
            (this.l / 16) * 0.8, 
            0, 
            2 * Math.PI, 
            false
        );
        this.context.strokeStyle = 'purple';
        this.context.lineWidth = this.l * 0.035;
        this.context.stroke();

        // for options ...
    }

    for (var i = 0; i < this.options.length; i++) {
        this.context.beginPath();
        this.context.arc(this.options[i].m.x, this.options[i].m.y, (this.l / 16) * 0.1, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'black';
        this.context.fill();
    }

    if(this.selected) {
        this.context.beginPath();
        this.context.arc(this.selected.m.x, this.selected.m.y, (this.l / 16) * 0.1, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'black';
        this.context.fill();
    }

    if(this.isWin()) {
        alert('somebody win or may be teko');

        this.restart();
    }

    // //debug
    // for (var i = 0; i < this.pairs.length; i++) {
    //     this.context.beginPath();
    //     this.context.arc(this.pairs[i].m.x, this.pairs[i].m.y, (l / 16) * 1, 0, 2 * Math.PI, false);
    //     this.context.strokeStyle = 'black';
    //     this.context.lineWidth = 1;
    //     this.context.stroke();
    // }

    //////////////////////////////
}
Game.prototype.addListeners = function addListeners() {
    this.canvas.addEventListener('click', function (e) {

        if(game.waiting) {
            return;
        }

        var rect = canvas.getBoundingClientRect();
        var point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        // TODO: && selected not last movie of oponent
        if(game.selected && game.getL(point, game.selected.m) < ((game.l/16) * 1)) {
            game.history.push(JSON.parse(JSON.stringify(game.state)));

            game.state[game.selected.first.x][game.selected.first.y].color = 2;
            game.state[game.selected.second.x][game.selected.second.y].color = 1;

            // TODO: remove elegal option
            if(game.history.length > 1 && game.isEqual(game.state, game.history[game.history.length - 2])) { // !!!!!!!!!!!!!!!!! -2
                alert('can\'t take back the last movie of your opponent');
                game.state = game.history[game.history.length - 1];
                game.history.pop();

                return;
            }

            if(game.who == 1) {
                game.who = 2;
            } else {
                game.who = 1;
            }

            game.selected = null;
            game.options = new Array();

            game.render();

            // online
            if(game.online) {
                game.waiting = true;
                socket.emit('move', game.state);
            }

            // robot
            if(game.robot && game.who == 2) {
                game.robotPlay();
            }

            return;
        }

        for (var optionsIndex = 0; optionsIndex < game.options.length; optionsIndex++) {
            if(game.getL(point, game.options[optionsIndex].m) < ((game.l/16) * 1)) {
                game.history.push(JSON.parse(JSON.stringify(game.state)));

                game.state[game.selected.first.x][game.selected.first.y].color = 0;
                game.state[game.selected.second.x][game.selected.second.y].color = 0;
                game.state[game.options[optionsIndex].first.x][game.options[optionsIndex].first.y].color = 1;
                game.state[game.options[optionsIndex].second.x][game.options[optionsIndex].second.y].color = 2;

                // TODO: remove ilegal option
                if(game.history.length > 1 && game.isEqual(game.state, game.history[game.history.length - 2])) { /////////// -2
                    alert('can\'t take back the last movie of your opponent');
                    game.state = game.history[game.history.length - 1];
                    game.history.pop();

                    return;
                }

                if(game.who == 1) {
                    game.who = 2;
                } else {
                    game.who = 1;
                }

                game.selected = null;
                game.options = new Array();

                game.render();

                // online
                if(game.online) {
                    game.waiting = true;
                    socket.emit('move', game.state);
                } 

                // robot
                if(game.robot) {
                    game.robotPlay();
                }

                return;
            }
        }

        for (var pairIndex = 0; pairIndex < game.pairs.length; pairIndex++) {
            if(game.getL(point, game.pairs[pairIndex].m) < ((game.l/16) * 1)) {
                game.selected = game.pairs[pairIndex];
                game.options = game.getOptions(game.pairs[pairIndex]);
                game.render();

                return;
            } 
        }

    }, false);

    this.canvas.addEventListener('touchstart', function (e) {
        var touch = e.touches[0];
        // May be this make delay
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        // What is it?
        game.canvas.dispatchEvent(mouseEvent);
    }, false);
}
Game.prototype.getOptions = function(pair) {

    //
    var state = this.state;
    //
    var options = new Array();

    if(pair.first.x == pair.second.x) {
        // they stand horizontaly

        // try left
        var right = pair.first.y > pair.second.y ? pair.first : pair.second;
        var left = pair.first.y < pair.second.y ? pair.first : pair.second;
        if(state[left.x][left.y - 1] !== undefined && state[left.x][left.y - 1].color == 0) {
            var p = JSON.parse(JSON.stringify(pair)); // clone
            p.first.y -= 1;
            p.second.y -= 1;
            p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
            //
            options.push(p);
        }
        // try right
        if(state[right.x][right.y + 1] !== undefined && state[right.x][right.y + 1].color == 0) {
            var p = JSON.parse(JSON.stringify(pair)); // clone
            p.first.y += 1;
            p.second.y += 1;
            p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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
                p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
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

                // try up
                if(
                    state[upper.x - 1] !== undefined &&
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone
                    p.first.x -= 1;
                    p.second.x -= 1;
                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    
                    options.push(p);
                }

                // try down
                if(bottom.x <= 2) {
                    if(
                        state[bottom.x + 1][bottom.y] !== undefined &&
                        state[bottom.x + 1][bottom.y].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone
                        p.first.x += 1;
                        p.second.x += 1;
                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                        options.push(p);
                    }
                } else {
                    if(
                        state[bottom.x + 1][bottom.y - 1] !== undefined &&
                        state[bottom.x + 1][bottom.y - 1].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        if(state[bottom.x][bottom.y].color == 1) {
                            p.first.x += 1;
                            p.first.y -= 1;
                            p.second.x += 1;
                        } else {
                            p.first.x += 1;
                            p.second.y -= 1;
                            p.second.x += 1;
                        }

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                        options.push(p); 
                    }
                }
                // try right up
                if(
                    state[upper.x - 1] !== undefined &&
                    state[upper.x - 1][upper.y - 1] !== undefined &&
                    state[bottom.x - 1][bottom.y - 1] !== undefined &&
                    state[upper.x - 1][upper.y - 1].color == 0 &&
                    state[bottom.x - 1][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1;
                    p.first.y -= 1;
                    p.second.x -= 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p); 
                }
                // try right down
                if(
                    state[upper.x][upper.y - 1] !== undefined &&
                    state[bottom.x][bottom.y - 1] !== undefined &&
                    state[upper.x][upper.y - 1].color == 0 &&
                    state[bottom.x][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y -= 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p);
                }
                // try left up
                if(
                    state[upper.x][upper.y + 1] !== undefined &&
                    state[bottom.x][bottom.y + 1] !== undefined &&
                    state[upper.x][upper.y + 1].color == 0 &&
                    state[bottom.x][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y += 1;
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p);
                }
                // try left down
                if(bottom.x <= 2) {
                    if(
                        state[upper.x + 1][upper.y + 1] !== undefined &&
                        state[bottom.x + 1][bottom.y + 1] !== undefined &&
                        state[upper.x + 1][upper.y + 1].color == 0 &&
                        state[bottom.x + 1][bottom.y + 1].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        p.first.y += 1;
                        p.first.x += 1;
                        p.second.y += 1;
                        p.second.x += 1;

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                            
                        options.push(p);
                    }
                } else {
                    // bottom.x = 3
                    if(
                        state[upper.x + 1][upper.y + 1] !== undefined &&
                        state[bottom.x + 1][bottom.y] !== undefined &&
                        state[upper.x + 1][upper.y + 1].color == 0 &&
                        state[bottom.x + 1][bottom.y].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        if(state[upper.x][upper.y].color == 1) {
                            p.first.y += 1;
                            p.first.x += 1;
                            p.second.x += 1;
                        } else {
                            p.first.x += 1;
                            p.second.x += 1;
                            p.second.y += 1;
                        }

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                            
                        options.push(p);
                    }
                }
                
            } else {
                // W

                // try up
                if(
                    state[upper.x - 1] !== undefined &&
                    state[upper.x - 1][upper.y - 1] !== undefined &&
                    state[upper.x - 1][upper.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y -= 1;
                    p.first.x -= 1;
                    p.second.y -= 1;
                    p.second.x -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p);
                }
                // try down
                if(bottom.x <= 2) {
                    if(
                        state[bottom.x + 1][bottom.y + 1] !== undefined &&
                        state[bottom.x + 1][bottom.y + 1].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        p.first.y += 1;
                        p.first.x += 1;
                        p.second.y += 1;
                        p.second.x += 1;

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                            
                        options.push(p);
                    }
                } else {
                    // bottom.x = 3
                    if(
                        state[bottom.x + 1][bottom.y] !== undefined &&
                        state[bottom.x + 1][bottom.y].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        if(state[upper.x][upper.y].color == 1) {
                            p.first.x += 1;
                            p.first.y += 1;
                            p.second.x += 1;
                        } else {
                            p.first.x += 1;
                            p.second.x += 1;
                            p.second.y += 1;
                        }

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                            
                        options.push(p);
                    }
                }
                // try right up
                if(
                    state[upper.x - 1] !== undefined &&
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[bottom.x - 1][bottom.y] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0 &&
                    state[bottom.x - 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone
                    p.first.x -= 1;
                    p.second.x -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p);
                }
                // try right down
                if(
                    state[upper.x][upper.y + 1] !== undefined &&
                    state[bottom.x][bottom.y + 1] !== undefined &&
                    state[upper.x][upper.y + 1].color == 0 &&
                    state[bottom.x][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone
                    p.first.y += 1;
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p);
                }
                // try left up
                if(
                    state[upper.x][upper.y - 1] !== undefined &&
                    state[bottom.x][bottom.y - 1] !== undefined &&
                    state[upper.x][upper.y - 1].color == 0 &&
                    state[bottom.x][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone
                    p.first.y -= 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                        
                    options.push(p);
                }

                // try left down
                if(bottom.x <= 2) {
                    if(
                        state[upper.x + 1][upper.y] !== undefined &&
                        state[bottom.x + 1][bottom.y] !== undefined &&
                        state[upper.x + 1][upper.y].color == 0 &&
                        state[bottom.x + 1][bottom.y].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        p.first.x += 1;
                        p.second.x += 1;

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                            
                        options.push(p);
                    }
                } else {
                    // bottom.x = 3
                    if(
                        state[upper.x + 1][upper.y] !== undefined &&
                        state[upper.x + 1][upper.y].color == 0 &&
                        state[bottom.x + 1][bottom.y - 1] !== undefined &&
                        state[bottom.x + 1][bottom.y - 1].color == 0
                    ) {
                        var p = JSON.parse(JSON.stringify(pair)); // clone

                        if(state[upper.x][upper.y].color == 1) {
                            p.first.x += 1;
                            p.second.x += 1;
                            p.second.y -= 1;
                        } else {
                            p.first.x += 1;
                            p.second.x += 1;
                            p.first.y -= 1;
                        }

                        p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                            
                        options.push(p);
                    }
                    
                }
            }
        } else if(upper.x == 3) {
            if(upper.y == bottom.y) {
                // W

                // try up
                if(
                    state[upper.x - 1][upper.y - 1] !== undefined &&
                    state[upper.x - 1][upper.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    if(state[upper.x][upper.y].color == 1) {
                        p.first.x -= 1;
                        p.second.x -= 1;
                        p.first.y -= 1;
                    } else {
                        p.first.x -= 1;
                        p.second.x -= 1;
                        p.second.y -= 1;
                    }

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try down
                if(
                    state[bottom.x + 1][bottom.y] !== undefined &&
                    state[bottom.x + 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1
                    p.second.x += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right up
                if(
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[bottom.x - 1][bottom.y + 1] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0 &&
                    state[bottom.x - 1][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1
                    p.second.x -= 1;
                    if(state[upper.x][upper.y].color == 1) {
                        p.second.y += 1;
                    } else {
                        p.first.y += 1;
                    }

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right down
                if(
                    state[upper.x][upper.y + 1] !== undefined &&
                    state[bottom.x][bottom.y + 1] !== undefined &&
                    state[upper.x][upper.y + 1].color == 0 &&
                    state[bottom.x][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y += 1
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left up
                if(
                    state[upper.x][upper.y - 1] !== undefined &&
                    state[bottom.x][bottom.y - 1] !== undefined &&
                    state[upper.x][upper.y - 1].color == 0 &&
                    state[bottom.x][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y -= 1
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left down
                if(
                    state[upper.x + 1][upper.y - 1] !== undefined &&
                    state[bottom.x + 1][bottom.y - 1] !== undefined &&
                    state[upper.x + 1][upper.y - 1].color == 0 &&
                    state[bottom.x + 1][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1
                    p.second.x += 1;
                    p.first.y -= 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
            } else {
                // E

                // try up
                if(
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    if(state[upper.x][upper.y].color == 1) {
                        p.first.x -= 1;
                        p.second.x -= 1;
                        p.second.y += 1;
                    } else {
                        p.first.x -= 1;
                        p.second.x -= 1;
                        p.first.y += 1;
                    }

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try down
                if(
                    state[bottom.x + 1][bottom.y - 1] !== undefined &&
                    state[bottom.x + 1][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1
                    p.first.y -= 1
                    p.second.x += 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right up
                if(
                    state[upper.x][upper.y + 1] !== undefined &&
                    state[bottom.x][bottom.y + 1] !== undefined &&
                    state[upper.x][upper.y + 1].color == 0 &&
                    state[bottom.x][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y += 1
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right down

                if(
                    state[upper.x + 1][upper.y] !== undefined &&
                    state[bottom.x + 1][bottom.y] !== undefined &&
                    state[upper.x + 1][upper.y].color == 0 &&
                    state[bottom.x + 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1
                    p.second.x += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }

                // try left up
                if(
                    state[upper.x - 1][upper.y - 1] !== undefined &&
                    state[bottom.x - 1][bottom.y] !== undefined &&
                    state[upper.x - 1][upper.y - 1].color == 0 &&
                    state[bottom.x - 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1
                    p.second.x -= 1;
                    if(state[upper.x][upper.y].color == 1) {
                        p.first.y -= 1;
                    } else {
                        p.second.y -= 1;
                    }

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left down
                if(
                    state[upper.x][upper.y - 1] !== undefined &&
                    state[bottom.x][bottom.y - 1] !== undefined &&
                    state[upper.x][upper.y - 1].color == 0 &&
                    state[bottom.x][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y -= 1
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
            }
        } else {
            if(upper.y == bottom.y) {
                // W

                // try up
                if(
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1
                    p.second.x -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try down
                if(
                    state[bottom.x + 1] !== undefined &&
                    state[bottom.x + 1][bottom.y] !== undefined &&
                    state[bottom.x + 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1
                    p.second.x += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right down
                if(
                    state[upper.x][upper.y + 1] !== undefined &&
                    state[bottom.x][bottom.y + 1] !== undefined &&
                    state[upper.x][upper.y + 1].color == 0 &&
                    state[bottom.x][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y += 1
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right up
                if(
                    state[upper.x - 1][upper.y + 1] !== undefined &&
                    state[bottom.x - 1][bottom.y + 1] !== undefined &&
                    state[upper.x - 1][upper.y + 1].color == 0 &&
                    state[bottom.x - 1][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1;
                    p.second.x -= 1;
                    p.first.y += 1;
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left up
                if(
                    state[upper.x][upper.y - 1] !== undefined &&
                    state[bottom.x][bottom.y - 1] !== undefined &&
                    state[upper.x][upper.y - 1].color == 0 &&
                    state[bottom.x][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y -= 1
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left down
                if(
                    state[bottom.x + 1] !== undefined &&
                    state[upper.x + 1][upper.y - 1] !== undefined &&
                    state[bottom.x + 1][bottom.y - 1] !== undefined &&
                    state[upper.x + 1][upper.y - 1].color == 0 &&
                    state[bottom.x + 1][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1;
                    p.second.x += 1;
                    p.first.y -= 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
            } else {
                // E

                // try up
                if(
                    state[upper.x - 1][upper.y + 1] !== undefined &&
                    state[upper.x - 1][upper.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1;
                    p.second.x -= 1;
                    p.first.y += 1;
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try down
                if(
                    state[bottom.x + 1] !== undefined &&
                    state[bottom.x + 1][bottom.y - 1] !== undefined &&
                    state[bottom.x + 1][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1;
                    p.second.x += 1;
                    p.first.y -= 1;
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right up
                if(
                    state[upper.x][upper.y + 1] !== undefined &&
                    state[bottom.x][bottom.y + 1] !== undefined &&
                    state[upper.x][upper.y + 1].color == 0 &&
                    state[bottom.x][bottom.y + 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y += 1
                    p.second.y += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try right down
                if(
                    state[bottom.x + 1] !== undefined &&
                    state[upper.x + 1][upper.y] !== undefined &&
                    state[bottom.x + 1][bottom.y] !== undefined &&
                    state[upper.x + 1][upper.y].color == 0 &&
                    state[bottom.x + 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x += 1
                    p.second.x += 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left up
                if(
                    state[upper.x - 1][upper.y] !== undefined &&
                    state[bottom.x - 1][bottom.y] !== undefined &&
                    state[upper.x - 1][upper.y].color == 0 &&
                    state[bottom.x - 1][bottom.y].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.x -= 1
                    p.second.x -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
                // try left down
                if(
                    state[upper.x][upper.y - 1] !== undefined &&
                    state[bottom.x][bottom.y - 1] !== undefined &&
                    state[upper.x][upper.y - 1].color == 0 &&
                    state[bottom.x][bottom.y - 1].color == 0
                ) {
                    var p = JSON.parse(JSON.stringify(pair)); // clone

                    p.first.y -= 1
                    p.second.y -= 1;

                    p.m = this.getM(state[p.first.x][p.first.y], state[p.second.x][p.second.y]);
                    options.push(p);
                }
            }
        }
    }

    // TODO: Chech if options not include last movie

    return options;
}
Game.prototype.findPairs = function() {
    var pairs = [];
    var oArrUp = [{ x: 1, y: 0},{ x: 1, y: 1},{ x: 0, y: 1},{ x: -1, y: 0},{ x: -1, y: -1},{ x: 0, y: -1}];
    var oArrMiddle = [{ x: 1, y: -1},{ x: 1, y: 0},{ x: 0, y: 1},{ x: -1, y: 0},{ x: -1, y: -1},{ x: 0, y: -1}];
    var oArrDown = [{ x: 1, y: -1},{ x: 1, y: 0},{ x: 0, y: 1},{ x: -1, y: 1},{ x: -1, y: 0},{ x: 0, y: -1}];

    for (var x = 0; x < this.state.length; x++) {
        for (var y = 0; y < this.state[x].length; y++) {
            // find all with dublications

            if(this.state[x][y].color != 0) {
                for (var oArrIndex = 0; oArrIndex < oArrUp.length; oArrIndex++) {
                    if(x < 3) {
                        if(
                            this.state[x + oArrUp[oArrIndex].x] !== undefined && 
                            this.state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y] !== undefined && 
                            this.state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y].color != 0 &&
                            this.state[x][y].color != this.state[x + oArrUp[oArrIndex].x][y + oArrUp[oArrIndex].y].color
                        ) {
                            pairs.push({
                                first: this.state[x][y].color == 1 ? { x: x, y: y} : { x: x + oArrUp[oArrIndex].x, y: y + oArrUp[oArrIndex].y},
                                second: this.state[x][y].color == 2 ? { x: x, y: y} : { x: x + oArrUp[oArrIndex].x, y: y + oArrUp[oArrIndex].y}
                            });
                        }
                    } else if(x == 3) {
                        if(
                            this.state[x + oArrMiddle[oArrIndex].x] !== undefined && 
                            this.state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y] !== undefined && 
                            this.state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y].color != 0 &&
                            this.state[x][y].color != this.state[x + oArrMiddle[oArrIndex].x][y + oArrMiddle[oArrIndex].y].color
                        ) {
                            pairs.push({
                                first: this.state[x][y].color == 1 ? { x: x, y: y} : { x: x + oArrMiddle[oArrIndex].x, y: y + oArrMiddle[oArrIndex].y},
                                second: this.state[x][y].color == 2 ? { x: x, y: y} : { x: x + oArrMiddle[oArrIndex].x, y: y + oArrMiddle[oArrIndex].y}
                            });
                        }
                    } else {
                        if(
                            this.state[x + oArrDown[oArrIndex].x] !== undefined && 
                            this.state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y] !== undefined && 
                            this.state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y].color != 0 &&
                            this.state[x][y].color != this.state[x + oArrDown[oArrIndex].x][y + oArrDown[oArrIndex].y].color
                        ) {
                            pairs.push({
                                first: this.state[x][y].color == 1 ? { x: x, y: y} : { x: x + oArrDown[oArrIndex].x, y: y + oArrDown[oArrIndex].y},
                                second: this.state[x][y].color == 2 ? { x: x, y: y} : { x: x + oArrDown[oArrIndex].x, y: y + oArrDown[oArrIndex].y}
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
Game.prototype.isEqual = function(state1, state2) {
    for (var x = 0; x < state1.length; x++) {
        for (var y = 0; y < state1[x].length; y++) {
            if(state1[x][y].color !== state2[x][y].color){
                return false;
            }
            
        }
    }
    return true;
}
Game.prototype.isWin = function() {
    var lines = [];

    // looking for 4 in a row

    var allLines = [
        [{ x: 0, y: 0 },{ x: 1, y: 0 },{ x: 2, y: 0 },{ x: 3, y: 0 }],
        [{ x: 0, y: 1 },{ x: 1, y: 1 },{ x: 2, y: 1 },{ x: 3, y: 1 }],
        [{ x: 0, y: 2 },{ x: 1, y: 2 },{ x: 2, y: 2 },{ x: 3, y: 2 }],
        [{ x: 0, y: 3 },{ x: 1, y: 3 },{ x: 2, y: 3 },{ x: 3, y: 3 }],

        [{ x: 1, y: 1 },{ x: 2, y: 1 },{ x: 3, y: 1 },{ x: 4, y: 0 }],
        [{ x: 1, y: 2 },{ x: 2, y: 2 },{ x: 3, y: 2 },{ x: 4, y: 1 }],
        [{ x: 1, y: 3 },{ x: 2, y: 3 },{ x: 3, y: 3 },{ x: 4, y: 2 }],
        [{ x: 1, y: 4 },{ x: 2, y: 4 },{ x: 3, y: 4 },{ x: 4, y: 3 }],

        [{ x: 2, y: 2 },{ x: 3, y: 2 },{ x: 4, y: 1 },{ x: 5, y: 0 }],
        [{ x: 2, y: 3 },{ x: 3, y: 3 },{ x: 4, y: 2 },{ x: 5, y: 1 }],
        [{ x: 2, y: 4 },{ x: 3, y: 4 },{ x: 4, y: 3 },{ x: 5, y: 2 }],
        [{ x: 2, y: 5 },{ x: 3, y: 5 },{ x: 4, y: 4 },{ x: 5, y: 3 }],

        [{ x: 3, y: 3 },{ x: 4, y: 2 },{ x: 5, y: 1 },{ x: 6, y: 0 }],
        [{ x: 3, y: 4 },{ x: 4, y: 3 },{ x: 5, y: 2 },{ x: 6, y: 1 }],
        [{ x: 3, y: 5 },{ x: 4, y: 4 },{ x: 5, y: 3 },{ x: 6, y: 2 }],
        [{ x: 3, y: 6 },{ x: 4, y: 5 },{ x: 5, y: 4 },{ x: 6, y: 3 }],

        [{ x: 0, y: 0 },{ x: 1, y: 1 },{ x: 2, y: 2 },{ x: 3, y: 3 }],
        [{ x: 0, y: 1 },{ x: 1, y: 2 },{ x: 2, y: 3 },{ x: 3, y: 4 }],
        [{ x: 0, y: 2 },{ x: 1, y: 3 },{ x: 2, y: 4 },{ x: 3, y: 5 }],
        [{ x: 0, y: 3 },{ x: 1, y: 4 },{ x: 2, y: 5 },{ x: 3, y: 6 }],

        [{ x: 1, y: 0 },{ x: 2, y: 1 },{ x: 3, y: 2 },{ x: 4, y: 2 }],
        [{ x: 1, y: 1 },{ x: 2, y: 2 },{ x: 3, y: 3 },{ x: 4, y: 3 }],
        [{ x: 1, y: 2 },{ x: 2, y: 3 },{ x: 3, y: 4 },{ x: 4, y: 4 }],
        [{ x: 1, y: 3 },{ x: 2, y: 4 },{ x: 3, y: 5 },{ x: 4, y: 5 }],

        [{ x: 2, y: 0 },{ x: 3, y: 1 },{ x: 4, y: 1 },{ x: 5, y: 1 }],
        [{ x: 2, y: 1 },{ x: 3, y: 2 },{ x: 4, y: 2 },{ x: 5, y: 2 }],
        [{ x: 2, y: 2 },{ x: 3, y: 3 },{ x: 4, y: 3 },{ x: 5, y: 3 }],
        [{ x: 2, y: 3 },{ x: 3, y: 4 },{ x: 4, y: 4 },{ x: 5, y: 4 }],

        [{ x: 3, y: 0 },{ x: 4, y: 0 },{ x: 5, y: 0 },{ x: 6, y: 0 }],
        [{ x: 3, y: 1 },{ x: 4, y: 1 },{ x: 5, y: 1 },{ x: 6, y: 1 }],
        [{ x: 3, y: 2 },{ x: 4, y: 2 },{ x: 5, y: 2 },{ x: 6, y: 2 }],
        [{ x: 3, y: 3 },{ x: 4, y: 3 },{ x: 5, y: 3 },{ x: 6, y: 3 }],

        [{ x: 0, y: 0 },{ x: 0, y: 1 },{ x: 0, y: 2 },{ x: 0, y: 3 }],
        [{ x: 1, y: 0 },{ x: 1, y: 1 },{ x: 1, y: 2 },{ x: 1, y: 3 }],
        [{ x: 2, y: 0 },{ x: 2, y: 1 },{ x: 2, y: 2 },{ x: 2, y: 3 }],
        [{ x: 3, y: 0 },{ x: 3, y: 1 },{ x: 3, y: 2 },{ x: 3, y: 3 }],
        [{ x: 4, y: 0 },{ x: 4, y: 1 },{ x: 4, y: 2 },{ x: 4, y: 3 }],
        [{ x: 5, y: 0 },{ x: 5, y: 1 },{ x: 5, y: 2 },{ x: 5, y: 3 }],
        [{ x: 6, y: 0 },{ x: 6, y: 1 },{ x: 6, y: 2 },{ x: 6, y: 3 }],

        [{ x: 1, y: 1 },{ x: 1, y: 2 },{ x: 1, y: 3 },{ x: 1, y: 4 }],
        [{ x: 2, y: 1 },{ x: 2, y: 2 },{ x: 2, y: 3 },{ x: 2, y: 4 }],
        [{ x: 3, y: 1 },{ x: 3, y: 2 },{ x: 3, y: 3 },{ x: 3, y: 4 }],
        [{ x: 4, y: 1 },{ x: 4, y: 2 },{ x: 4, y: 3 },{ x: 4, y: 4 }],
        [{ x: 5, y: 1 },{ x: 5, y: 2 },{ x: 5, y: 3 },{ x: 5, y: 4 }],

        [{ x: 2, y: 2 },{ x: 2, y: 3 },{ x: 2, y: 4 },{ x: 2, y: 5 }],
        [{ x: 3, y: 2 },{ x: 3, y: 3 },{ x: 3, y: 4 },{ x: 3, y: 5 }],
        [{ x: 4, y: 2 },{ x: 4, y: 3 },{ x: 4, y: 4 },{ x: 4, y: 5 }],

        [{ x: 3, y: 3 },{ x: 3, y: 4 },{ x: 3, y: 5 },{ x: 3, y: 6 }]
    ]

    for (var index = 0; index < allLines.length; index++) {
        var element = allLines[index];
        if(
            this.state[allLines[index][0].x][allLines[index][0].y].color != 0 &&
            this.state[allLines[index][1].x][allLines[index][1].y].color != 0 &&
            this.state[allLines[index][2].x][allLines[index][2].y].color != 0 &&
            this.state[allLines[index][3].x][allLines[index][3].y].color != 0 &&
            this.state[allLines[index][0].x][allLines[index][0].y].color == this.state[allLines[index][1].x][allLines[index][1].y].color &&
            this.state[allLines[index][1].x][allLines[index][1].y].color == this.state[allLines[index][2].x][allLines[index][2].y].color &&
            this.state[allLines[index][2].x][allLines[index][2].y].color == this.state[allLines[index][3].x][allLines[index][3].y].color
        ) {
            lines.push(allLines[index]);
        }
    }

    if(lines.length != 0) {
        return lines;
    }

    // for (var index = 0; index < allLines.length; index++) {
    //     var element = allLines[index];
    //     for (var i = 0; i < element.length; i++) {
    //         var d = element[i];

    //         context.beginPath();
    //         context.arc(state[d.x][d.y].xPx, state[d.x][d.y].yPx, (l / 16) * 0.5, 0, 2 * Math.PI, false);
    //         context.strokeStyle = 'green';
    //         context.lineWidth = index;
    //         context.fillStyle = 'green';
    //         if(index >= 16 && index < 32){
    //             context.strokeStyle = 'red';
    //             context.fillStyle = 'orange';
    //         } else if (index >= 32) {
    //             context.strokeStyle = 'pink';
    //             context.fillStyle = 'white';
    //         }
    //         context.fill();
    //         context.stroke();

            
    //     }

    //     console.log('.');
    // }

    return false;
}
Game.prototype.getL = function(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
}
Game.prototype.getM = function (first, second) {
    return {
        x: (first.xPx + second.xPx) / 2,
        y: (first.yPx + second.yPx) / 2
    };
}
Game.prototype.restart = function () {
    if(this.robot) {
        this.playWithRobot();
        return;
    }
    this.state = new State();

    this.selected = null;
    this.options = new Array();
    this.history = new Array();
    this.who = 1;

    this.render();
}
Game.prototype.back = function () {
    if(this.history.length != 0) {
        this.state = this.history[this.history.length - 1];
        this.history.pop();
        if(this.who == 1) {
            this.who = 2;
        } else {
            this.who = 1;
        }
    }
    
    this.render();
}
Game.prototype.stop = function() {
    this.online = false;
    this.waiting = true;
}
Game.prototype.robotPlay = function() {
    this.waiting = true;

    this.history.push(this.state);
    this.state = game.goodMove();

    this.waiting = false;

    if(this.who == 1) {
        this.who = 2;
    } else {
        this.who = 1;
    }

    game.render();
}
Game.prototype.goodMove = function() {
    var newState = JSON.parse(JSON.stringify(this.state));

    // BUG WITH LAST MOVE

    var pairs = this.findPairs();
    newState[pairs[0].first.x][pairs[0].first.y].color = 2;
    newState[pairs[0].second.x][pairs[0].second.y].color = 1;

    return newState;
}
function State() {
    return [[{ x: 0, y: 0, color: 1 }, { x: 0, y: 1, color: 2 }, { x: 0, y: 2, color: 1 }, { x: 0, y: 3, color: 2 }],
            [{ x: 1, y: 0, color: 2 }, { x: 1, y: 1, color: 0 }, { x: 1, y: 2, color: 0 }, { x: 1, y: 3, color: 0 }, { x: 1, y: 4, color: 1 }],
            [{ x: 2, y: 0, color: 1 }, { x: 2, y: 1, color: 0 }, { x: 2, y: 2, color: 0 }, { x: 2, y: 3, color: 1 }, { x: 2, y: 4, color: 0 }, { x: 2, y: 5, color: 2 }],
            [{ x: 3, y: 0, color: 2 }, { x: 3, y: 1, color: 0 }, { x: 3, y: 2, color: 0 }, { x: 3, y: 3, color: 0 }, { x: 3, y: 4, color: 0 }, { x: 3, y: 5, color: 0 }, { x: 3, y: 6, color: 1 }],
            [{ x: 4, y: 0, color: 1 }, { x: 4, y: 1, color: 0 }, { x: 4, y: 2, color: 2 }, { x: 4, y: 3, color: 0 }, { x: 4, y: 4, color: 0 }, { x: 4, y: 5, color: 2 }],
            [{ x: 5, y: 0, color: 2 }, { x: 5, y: 1, color: 0 }, { x: 5, y: 2, color: 0 }, { x: 5, y: 3, color: 0 }, { x: 5, y: 4, color: 1 }],
            [{ x: 6, y: 0, color: 1 }, { x: 6, y: 1, color: 2 }, { x: 6, y: 2, color: 1 }, { x: 6, y: 3, color: 2 }]];
}
