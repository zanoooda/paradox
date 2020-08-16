const radius = Math.min(document.body.getBoundingClientRect().width, document.body.getBoundingClientRect().height),
    cellRadius = radius / 32,
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
function getPoint(c) {
    console.log(JSON.stringify(c));
    //...
    return [canvas.width / 2, canvas.height / 2];
}
function renderCell(cell) {
    ctx.beginPath();
    ctx.arc(...getPoint(cell.coord), cellRadius, 0, 2 * Math.PI);
    ctx.stroke();
}
export function renderGrid(grid) {
    grid.forEach(cell => {
        renderCell(cell);
    });
}

canvas.width = radius;
canvas.height = radius;
document.body.prepend(canvas);