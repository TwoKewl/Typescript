
function main(highest: number) {
    for (let i = highest; i < i + 1; i += highest) {
        for (let j = highest; j >= 2; j--) {
            if (i % j != 0) {
                break;
            }

            if (j == 2) {
                return i;
            }
        }
    }
}

console.log(main(20))