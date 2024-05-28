
let total = 0;

for (let i = 2; i < 1000; i++){
    if (i % 5 == 0 || i % 3 == 0) total += i;
}

console.log(total);