
function fib(limit: number) {
    var a = 0;
    var b = 1;
    const nums: number[] = [];

    while (a + b < limit) {
        var c = a + b;
        a = b;
        b = c;

        nums.push(c);
    }

    return nums;
}

var nums: number[] = fib(4000000);
var sum = 0;

nums.forEach(num => {
    if (num % 2 == 0) sum += num;
});

console.log(sum);