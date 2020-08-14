let bodyBoundingClientRect = document.body.getBoundingClientRect(),
    canvasSize = Math.min(bodyBoundingClientRect.width, bodyBoundingClientRect.height),
    canvas = document.createElement('canvas'),
    game = new Game(canvas);
canvas.width = canvasSize;
canvas.height = canvasSize;
document.body.prepend(canvas);
game.play();