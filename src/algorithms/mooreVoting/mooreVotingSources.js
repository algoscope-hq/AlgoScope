export const mooreVotingSources = {
  mooreVoting: {
    javascript: {
      code: `function mooreVoting(arr) {
    let candidate = null;
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        if (count === 0) {
            candidate = arr[i];
            count = 1;
        } else if (arr[i] === candidate) {
            count++;
        } else {
            count--;
        }
    }

    // Verify if candidate is the majority element
    let verifyCount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === candidate) verifyCount++;
    }

    return verifyCount > Math.floor(arr.length / 2) ? candidate : -1;
}

const arr = [2,2,1,1,1,2,2];
console.log(mooreVoting(arr));`,
    },

    python: {
      code: `def moore_voting(arr):
    candidate = None
    count = 0

    for num in arr:
        if count == 0:
            candidate = num
            count = 1
        elif num == candidate:
            count += 1
        else:
            count -= 1

    # Verify if candidate is the majority element
    verify_count = sum(1 for num in arr if num == candidate)
    
    return candidate if verify_count > len(arr) // 2 else -1

arr = [2,2,1,1,1,2,2]
print(moore_voting(arr))`,
    },

    cpp: {
      code: `#include <iostream>
#include <vector>
using namespace std;

int mooreVoting(vector<int>& arr) {
    int candidate = 0;
    int count = 0;

    for (int i = 0; i < arr.size(); i++) {
        if (count == 0) {
            candidate = arr[i];
            count = 1;
        } else if (arr[i] == candidate) {
            count++;
        } else {
            count--;
        }
    }

    // Verify if candidate is the majority element
    int verifyCount = 0;
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == candidate) verifyCount++;
    }

    return (verifyCount > arr.size() / 2) ? candidate : -1;
}

int main() {
    vector<int> arr = {2,2,1,1,1,2,2};

    cout << mooreVoting(arr);

    return 0;
}`,
    },

    java: {
      code: `public class MooreVoting {

    public static int mooreVoting(int[] arr) {
        int candidate = 0;
        int count = 0;

        for (int i = 0; i < arr.length; i++) {
            if (count == 0) {
                candidate = arr[i];
                count = 1;
            } else if (arr[i] == candidate) {
                count++;
            } else {
                count--;
            }
        }

        // Verify if candidate is the majority element
        int verifyCount = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == candidate) verifyCount++;
        }

        return (verifyCount > arr.length / 2) ? candidate : -1;
    }

    public static void main(String[] args) {
        int[] arr = {2,2,1,1,1,2,2};

        System.out.println(mooreVoting(arr));
    }
}`,
    },

    c: {
      code: `#include <stdio.h>

int mooreVoting(int arr[], int n) {
    int candidate = 0;
    int count = 0;

    for (int i = 0; i < n; i++) {
        if (count == 0) {
            candidate = arr[i];
            count = 1;
        } else if (arr[i] == candidate) {
            count++;
        } else {
            count--;
        }
    }

    // Verify if candidate is the majority element
    int verifyCount = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] == candidate) verifyCount++;
    }

    return (verifyCount > n / 2) ? candidate : -1;
}

int main() {
    int arr[] = {2,2,1,1,1,2,2};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("%d", mooreVoting(arr, n));

    return 0;
}`,
    },

    rust: {
      code: `fn moore_voting(arr: Vec<i32>) -> i32 {
    let mut candidate = 0;
    let mut count = 0;

    for &num in arr.iter() {
        if count == 0 {
            candidate = num;
            count = 1;
        } else if num == candidate {
            count += 1;
        } else {
            count -= 1;
        }
    }

    // Verify if candidate is the majority element
    let verify_count = arr.iter().filter(|&&x| x == candidate).count();

    if verify_count > arr.len() / 2 {
        candidate
    } else {
        -1
    }
}

fn main() {
    let arr = vec![2,2,1,1,1,2,2];

    println!("{}", moore_voting(arr));
}`,
    },

    go: {
      code: `package main

import "fmt"

func mooreVoting(arr []int) int {
    candidate := 0
    count := 0

    for i := 0; i < len(arr); i++ {
        if count == 0 {
            candidate = arr[i]
            count = 1
        } else if arr[i] == candidate {
            count++
        } else {
            count--
        }
    }

    // Verify if candidate is the majority element
    verifyCount := 0
    for i := 0; i < len(arr); i++ {
        if arr[i] == candidate {
            verifyCount++
        }
    }

    if verifyCount > len(arr)/2 {
        return candidate
    }
    return -1
}

func main() {
    arr := []int{-2,1,-3,4,-1,2,1,-5,4}

    fmt.Println(mooreVoting(arr))
}`,
    },
  },
}

export const getMooreVotingSource = (language) => {
  return mooreVotingSources.mooreVoting?.[language]?.code || ''
}
