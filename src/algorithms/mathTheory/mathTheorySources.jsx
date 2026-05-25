// ─── EUCLIDEAN GCD ───────────────────────────────────────────────────────────

export const euclideanGCDSources = {
  javascript: {
    code: `function gcd(a, b) {
  while (b !== 0) {
    let remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

console.log(gcd(48, 18)); // 6`,
    lineMap: { start: 1, modulo: 3, assign: 4, result: 7 },
  },
  python: {
    code: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(gcd(48, 18))  # 6`,
    lineMap: { start: 1, modulo: 3, assign: 3, result: 4 },
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int main() {
    cout << gcd(48, 18); // 6
}`,
    lineMap: { start: 4, modulo: 6, assign: 7, result: 10 },
  },
  java: {
    code: `public class GCD {
    public static int gcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println(gcd(48, 18)); // 6
    }
}`,
    lineMap: { start: 2, modulo: 4, assign: 5, result: 8 },
  },
  c: {
    code: `#include <stdio.h>

int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int main() {
    printf("%d\\n", gcd(48, 18)); // 6
}`,
    lineMap: { start: 3, modulo: 5, assign: 6, result: 9 },
  },
  rust: {
    code: `fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let r = a % b;
        a = b;
        b = r;
    }
    a
}

fn main() {
    println!("{}", gcd(48, 18)); // 6
}`,
    lineMap: { start: 1, modulo: 3, assign: 4, result: 7 },
  },
  go: {
    code: `package main

import "fmt"

func gcd(a, b int) int {
    for b != 0 {
        a, b = b, a%b
    }
    return a
}

func main() {
    fmt.Println(gcd(48, 18)) // 6
}`,
    lineMap: { start: 5, modulo: 7, assign: 7, result: 9 },
  },
}

export const getGCDSource = (language) =>
  euclideanGCDSources[language]?.code ?? euclideanGCDSources.javascript.code

export const resolveGCDLine = (language, lineKey) =>
  (euclideanGCDSources[language] ?? euclideanGCDSources.javascript).lineMap?.[
    lineKey
  ]

// ─── FAST EXPONENTIATION ─────────────────────────────────────────────────────

export const fastExpoSources = {
  javascript: {
    code: `function fastPow(base, exp) {
  let result = 1;
  while (exp > 0) {
    if (exp & 1) {          // check lowest bit
      result *= base;
    }
    base *= base;           // square the base
    exp >>= 1;              // shift right
  }
  return result;
}

console.log(fastPow(2, 10)); // 1024`,
    lineMap: { start: 1, checkBit: 4, multiply: 5, square: 7, result: 11 },
  },
  python: {
    code: `def fast_pow(base, exp):
    result = 1
    while exp > 0:
        if exp & 1:          # check lowest bit
            result *= base
        base *= base         # square the base
        exp >>= 1            # shift right
    return result

print(fast_pow(2, 10))  # 1024`,
    lineMap: { start: 1, checkBit: 4, multiply: 5, square: 6, result: 8 },
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

long long fastPow(long long base, int exp) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}

int main() {
    cout << fastPow(2, 10); // 1024
}`,
    lineMap: { start: 4, checkBit: 7, multiply: 7, square: 8, result: 11 },
  },
  java: {
    code: `public class FastPow {
    public static long fastPow(long base, int exp) {
        long result = 1;
        while (exp > 0) {
            if ((exp & 1) == 1) result *= base;
            base *= base;
            exp >>= 1;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(fastPow(2, 10)); // 1024
    }
}`,
    lineMap: { start: 2, checkBit: 5, multiply: 5, square: 6, result: 9 },
  },
  c: {
    code: `#include <stdio.h>

long long fastPow(long long base, int exp) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}

int main() {
    printf("%lld\\n", fastPow(2, 10)); // 1024
}`,
    lineMap: { start: 3, checkBit: 6, multiply: 6, square: 7, result: 10 },
  },
  rust: {
    code: `fn fast_pow(mut base: u64, mut exp: u32) -> u64 {
    let mut result = 1u64;
    while exp > 0 {
        if exp & 1 == 1 { result *= base; }
        base *= base;
        exp >>= 1;
    }
    result
}

fn main() {
    println!("{}", fast_pow(2, 10)); // 1024
}`,
    lineMap: { start: 1, checkBit: 4, multiply: 4, square: 5, result: 8 },
  },
  go: {
    code: `package main

import "fmt"

func fastPow(base, exp int) int {
    result := 1
    for exp > 0 {
        if exp&1 == 1 { result *= base }
        base *= base
        exp >>= 1
    }
    return result
}

func main() {
    fmt.Println(fastPow(2, 10)) // 1024
}`,
    lineMap: { start: 5, checkBit: 8, multiply: 8, square: 9, result: 12 },
  },
}

export const getFastExpoSource = (language) =>
  fastExpoSources[language]?.code ?? fastExpoSources.javascript.code

export const resolveFastExpoLine = (language, lineKey) =>
  (fastExpoSources[language] ?? fastExpoSources.javascript).lineMap?.[lineKey]

// ─── BIT MANIPULATION ────────────────────────────────────────────────────────

export const bitManipSources = {
  javascript: {
    code: `const a = 0b00101010; // 42
const b = 0b00001111; // 15

console.log(a & b);   // AND  = 10
console.log(a | b);   // OR   = 47
console.log(a ^ b);   // XOR  = 37
console.log(~a & 0xFF); // NOT = 213
console.log(a << 1);  // LSHIFT = 84
console.log(a >> 1);  // RSHIFT = 21`,
    lineMap: { start: 1, bitOp: 4, result: 9 },
  },
  python: {
    code: `a = 0b00101010  # 42
b = 0b00001111  # 15

print(a & b)        # AND    = 10
print(a | b)        # OR     = 47
print(a ^ b)        # XOR    = 37
print(~a & 0xFF)    # NOT    = 213
print(a << 1)       # LSHIFT = 84
print(a >> 1)       # RSHIFT = 21`,
    lineMap: { start: 1, bitOp: 4, result: 9 },
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

int main() {
    int a = 0b00101010; // 42
    int b = 0b00001111; // 15

    cout << (a & b)        << "\\n"; // AND    = 10
    cout << (a | b)        << "\\n"; // OR     = 47
    cout << (a ^ b)        << "\\n"; // XOR    = 37
    cout << (~a & 0xFF)    << "\\n"; // NOT    = 213
    cout << (a << 1)       << "\\n"; // LSHIFT = 84
    cout << (a >> 1)       << "\\n"; // RSHIFT = 21
}`,
    lineMap: { start: 4, bitOp: 8, result: 13 },
  },
  java: {
    code: `public class BitOps {
    public static void main(String[] args) {
        int a = 0b00101010; // 42
        int b = 0b00001111; // 15

        System.out.println(a & b);       // AND    = 10
        System.out.println(a | b);       // OR     = 47
        System.out.println(a ^ b);       // XOR    = 37
        System.out.println(~a & 0xFF);   // NOT    = 213
        System.out.println(a << 1);      // LSHIFT = 84
        System.out.println(a >> 1);      // RSHIFT = 21
    }
}`,
    lineMap: { start: 2, bitOp: 6, result: 11 },
  },
  c: {
    code: `#include <stdio.h>

int main() {
    int a = 42; // 0b00101010
    int b = 15; // 0b00001111

    printf("%d\\n", a & b);       // AND    = 10
    printf("%d\\n", a | b);       // OR     = 47
    printf("%d\\n", a ^ b);       // XOR    = 37
    printf("%d\\n", ~a & 0xFF);   // NOT    = 213
    printf("%d\\n", a << 1);      // LSHIFT = 84
    printf("%d\\n", a >> 1);      // RSHIFT = 21
}`,
    lineMap: { start: 3, bitOp: 7, result: 12 },
  },
  rust: {
    code: `fn main() {
    let a: u8 = 0b00101010; // 42
    let b: u8 = 0b00001111; // 15

    println!("{}", a & b);        // AND    = 10
    println!("{}", a | b);        // OR     = 47
    println!("{}", a ^ b);        // XOR    = 37
    println!("{}", !a);           // NOT    = 213
    println!("{}", a << 1);       // LSHIFT = 84
    println!("{}", a >> 1);       // RSHIFT = 21
}`,
    lineMap: { start: 1, bitOp: 5, result: 10 },
  },
  go: {
    code: `package main

import "fmt"

func main() {
    a := 42 // 0b00101010
    b := 15 // 0b00001111

    fmt.Println(a & b)       // AND    = 10
    fmt.Println(a | b)       // OR     = 47
    fmt.Println(a ^ b)       // XOR    = 37
    fmt.Println(^a & 0xFF)   // NOT    = 213
    fmt.Println(a << 1)      // LSHIFT = 84
    fmt.Println(a >> 1)      // RSHIFT = 21
}`,
    lineMap: { start: 5, bitOp: 9, result: 14 },
  },
}

export const getBitManipSource = (language) =>
  bitManipSources[language]?.code ?? bitManipSources.javascript.code

export const resolveBitManipLine = (language, lineKey) =>
  (bitManipSources[language] ?? bitManipSources.javascript).lineMap?.[lineKey]

// ─── SIEVE OF ERATOSTHENES ──────────────────────────────────────────────────

export const sieveSources = {
  javascript: {
    code: `function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}

console.log(sieve(30));`,
    lineMap: { start: 2, checkPrime: 5, markFalse: 8, result: 17 },
  },
  python: {
    code: `def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
                
    return [i for i in range(2, n + 1) if is_prime[i]]

print(sieve_of_eratosthenes(30))`,
    lineMap: { start: 2, checkPrime: 5, markFalse: 8, result: 10 },
  },
  cpp: {
    code: `#include <iostream>
#include <vector>
using namespace std;

vector<int> sieve(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push_back(i);
    }
    return primes;
}

int main() {
    vector<int> res = sieve(30);
    for (int p : res) cout << p << " ";
}`,
    lineMap: { start: 6, checkPrime: 9, markFalse: 12, result: 21 },
  },
  java: {
    code: `import java.util.*;

public class Sieve {
    public static List<Integer> sieve(int n) {
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        if (n >= 0) isPrime[0] = false;
        if (n >= 1) isPrime[1] = false;
        
        for (int i = 2; i * i <= n; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j <= n; j += i) {
                    isPrime[j] = false;
                }
            }
        }
        
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) primes.add(i);
        }
        return primes;
    }

    public static void main(String[] args) {
        System.out.println(sieve(30));
    }
}`,
    lineMap: { start: 5, checkPrime: 10, markFalse: 13, result: 22 },
  },
  c: {
    code: `#include <stdio.h>
#include <stdbool.h>

void sieve(int n) {
    bool isPrime[1000];
    for (int i = 0; i <= n; i++) isPrime[i] = true;
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) printf("%d ", i);
    }
}

int main() {
    sieve(30);
}`,
    lineMap: { start: 5, checkPrime: 9, markFalse: 12, result: 18 },
  },
  rust: {
    code: `fn sieve(n: usize) -> Vec<usize> {
    let mut is_prime = vec![true; n + 1];
    if n >= 2 {
        is_prime[0] = false;
        is_prime[1] = false;
    }
    
    let mut i = 2;
    while i * i <= n {
        if is_prime[i] {
            let mut j = i * i;
            while j <= n {
                is_prime[j] = false;
                j += i;
            }
        }
        i += 1;
    }
    
    (2..=n).filter(|&x| is_prime[x]).collect()
}

fn main() {
    println!("{:?}", sieve(30));
}`,
    lineMap: { start: 2, checkPrime: 9, markFalse: 13, result: 20 },
  },
  go: {
    code: `package main

import "fmt"

func sieve(n int) []int {
    isPrime := make([]bool, n+1)
    for i := range isPrime {
        isPrime[i] = true
    }
    if n >= 0 { isPrime[0] = false }
    if n >= 1 { isPrime[1] = false }
    
    for i := 2; i*i <= n; i++ {
        if isPrime[i] {
            for j := i * i; j <= n; j += i {
                isPrime[j] = false
            }
        }
    }
    
    var primes []int
    for i := 2; i <= n; i++ {
        if isPrime[i] {
            primes = append(primes, i)
        }
    }
    return primes
}

func main() {
    fmt.Println(sieve(30))
}`,
    lineMap: { start: 5, checkPrime: 12, markFalse: 15, result: 26 },
  },
}

export const getSieveSource = (language) =>
  sieveSources[language]?.code ?? sieveSources.javascript.code

export const resolveSieveLine = (language, lineKey) =>
  (sieveSources[language] ?? sieveSources.javascript).lineMap?.[lineKey]

// ─── FIBONACCI ──────────────────────────────────────────────────────────────

export const fibonacciSources = {
  javascript: {
    code: `function fib(n) {
  if (n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(6)); // 8`,
    lineMap: {
      start: 1,
      baseCase: 2,
      returnBase: 3,
      recursiveCall: 5,
      result: 5,
    },
  },
  python: {
    code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(6))  # 8`,
    lineMap: {
      start: 1,
      baseCase: 2,
      returnBase: 3,
      recursiveCall: 4,
      result: 4,
    },
  },
  cpp: {
    code: `#include <iostream>
using namespace std;

int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

int main() {
    cout << fib(6); // 8
}`,
    lineMap: {
      start: 4,
      baseCase: 5,
      returnBase: 6,
      recursiveCall: 8,
      result: 8,
    },
  },
  java: {
    code: `public class Fibonacci {
    public static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fib(6)); // 8
    }
}`,
    lineMap: {
      start: 2,
      baseCase: 3,
      returnBase: 4,
      recursiveCall: 6,
      result: 6,
    },
  },
}

export const getFibonacciSource = (language) =>
  fibonacciSources[language]?.code ?? fibonacciSources.javascript.code

export const resolveFibonacciLine = (language, lineKey) =>
  (fibonacciSources[language] ?? fibonacciSources.javascript).lineMap?.[lineKey]
