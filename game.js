let body = document.getElementsByTagName('body')[0];
let bodyBoundingClientRect = body.getBoundingClientRect();
let bodyHeight = bodyBoundingClientRect.height;
let bodyWidth = bodyBoundingClientRect.width;

let edge = bodyWidth >= bodyHeight ? bodyHeight : bodyWidth;

let canvas = document.getElementsByTagName('canvas')[0];
canvas.width = edge;
canvas.height = edge;

console.log(`canvas edge is ${edge}`);

var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(edge/2, edge/2, edge/32, 0, 2 * Math.PI);
ctx.stroke();

