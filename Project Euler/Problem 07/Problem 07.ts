
function getPrimeAtIndex(n: number): number {
    const primes = getPrimes(n);
    return primes[primes.length - 1];
}

function getPrimes(count: number): number[] {
    const primes: number[] = [];

    for (let i = 2; primes.length <= count; i++){
        if (checkPrime(i)) primes.push(i);
    }

    return primes;
}

function checkPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 == 0 || num % 3 == 0) return false;

    for (let i = 5; i**2 <= num; i += 6) {
        if (num % i == 0 || num % (i + 2) == 0) return false;
    }

    return true;
}

console.log(getPrimeAtIndex(10000));