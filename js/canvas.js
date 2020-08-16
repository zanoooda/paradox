const radius = Math.min(document.body.getBoundingClientRect().width, document.body.getBoundingClientRect().height),
cellRadius = radius / 32,
canvas = document.createElement('canvas'),
ctx = canvas.getContext('2d');
canvas.width = radius;
canvas.height = radius;
document.body.prepend(canvas);
function getPoint(c) {
    console.log(JSON.stringify(c));
    //...
    return [canvas.width / 2, canvas.height / 2];
}
function renderCell(c) {
    ctx.beginPath();
    ctx.arc(...getPoint(c.coord), cellRadius, 0, 2 * Math.PI);
    ctx.stroke();
}
export function render(grid) {
    grid.forEach(cell => {
        renderCell(cell);
    });
}