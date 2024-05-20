
const idx: string = process.argv[2];

function checkIsNumber(str: string): boolean{
    if (str){
        var isInt: boolean = true;
        for (const char of str.split('')){
            var res = parseInt(char, 10);
            if (Number.isNaN(res)){
                isInt = false;
                break;
            }
        }
    
        return isInt;
    }
    return false;    
}

if (checkIsNumber(idx)){
    const index: number = parseInt(idx, 10);

    console.log(`${fib(index)} is the number of the Fibonacci Sequence at index ${index + 1}.`);
}

function fib(index: number): number {
    var a = 0;
    var b = 1;
    var c: number = 0;

    for (let i = 0; i < index; i++){
        c = a + b;
        a = b;
        b = c;
    }

    return c;
}