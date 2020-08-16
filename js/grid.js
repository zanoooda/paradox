function add(arr1, arr2) {
    return arr1.map((n, i) => n + arr2[i]);
}
function mult(arr, n) {
    return arr.map(i => i * n);
}
export default class Grid {
    static directions = [
        [-1, 0, 1], // ↙
        [-1, 1, 0], // ←
        [0, 1, -1], // ↖
        [1, 0, -1], // ↗
        [1, -1, 0], // →
        [0, -1, 1]  // ↘
    ];
    static startDirection = this.directions[4];
    static create(radius) {
        let grid = [];
        for (let r = 0; r < radius; r++) {
            grid.push(...this.getPerimeter(r));
        }
        return grid;
    }
    static getPerimeter(radius) {
        let perimeter = [mult(this.startDirection, radius)];
        for (let diameterIndex = 1, directionIndex = 0; diameterIndex < radius * 6; directionIndex += diameterIndex % radius == 0, diameterIndex++) {
            perimeter.push(add(perimeter[perimeter.length - 1], this.directions[directionIndex]));
        }
        return perimeter;
    }
}