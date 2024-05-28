
function checkPalindrome(num: number): boolean{
    const str: string = num.toString();

    if (str == reverse(str)) {
        return true;
    }

    return false;
}

function reverse(str: string): string {
    var newString: string[] = [];
    
    str.split('').forEach((char: string) => {
        newString.unshift(char);
    });

    return newString.join('');
}

var largest: number = 0;

for (let i = 100; i < 1000; i++) {
    for (let j = 100; j < 1000; j++) {
        if (checkPalindrome(i * j)){
            if (largest < i * j) {
                largest = i * j;
                console.log(largest);
            }
        }
    }
}