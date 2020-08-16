let context, radius;
function getPoint(c) {
    console.log(JSON.stringify(c));
    //...
    return [radius / 2, radius / 2];
}
function showCell(c) {
    context.beginPath();
    context.arc(...getPoint(c.coord), radius / 32, 0, 2 * Math.PI);
    context.stroke();
}
export function show(grid) {
    grid.forEach(cell => {
        showCell(cell);
    });
}
export function create() {
    let canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    radius = Math.min(document.body.getBoundingClientRect().width, document.body.getBoundingClientRect().height);
    canvas.width = radius;
    canvas.height = radius;
    document.body.prepend(canvas);
}