
function sumSquare(n: number): number {
    var sum = 0;
    for (let i = 1; i <= n; i++) sum += i**2;
    return sum;
}

function squareSum(n: number): number {
    var sum = 0;
    for (let i = 1; i <= n; i++) sum += i;
    return sum**2;
}

console.log(squareSum(100) - sumSquare(100))