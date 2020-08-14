let body = document.getElementsByTagName('body')[0],
    bodyBoundingClientRect = body.getBoundingClientRect(),
    bodyHeight = bodyBoundingClientRect.height,
    bodyWidth = bodyBoundingClientRect.width,
    canvasLength = bodyWidth >= bodyHeight ? bodyHeight : bodyWidth,
    canvas = document.createElement("canvas");

body.prepend(canvas);

(function setCanvasSize() {
    canvas.width = canvasLength;
    canvas.height = canvasLength;
    console.log(`canvas size is ${canvas.width}x${canvas.height}`);
})();

let game = new Game(canvas);
game.play();