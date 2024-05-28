
const mainNumber: number = 600851475143;

function getPrimeFactors(num: number): number[] {
    const factors: number[] = [];
    const primes: number[] = getPrimes(Math.floor(num**0.5));

    for (const prime of primes) {
        if (Math.max(...factors) >= num) break;

        while (num % prime == 0) {
            factors.push(prime);
            num /= prime;
        }
    }

    return factors;
}

function getPrimes(limit: number): number[] {
    const primes: number[] = [];

    for (let i = 2; i < limit; i++){
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

const factors = getPrimeFactors(mainNumber);
const largest = Math.max(...factors);

console.log(largest);