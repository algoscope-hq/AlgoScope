import { complexityMap } from './complexityMap'

// Canonical algorithms dataset for Cheat Sheet reference
export const CHEATSHEET_ALGORITHMS = [
  // ─── SORTING ─────────────────────────────────────────────────────────────────
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'Beginner',
    link: '/sort',
    complexityKey: 'bubble',
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
    pseudocode: `function bubbleSort(arr):
    n = arr.length
    for i from 0 to n - 1:
        for j from 0 to n - i - 2:
            if arr[j] > arr[j + 1]:
                swap(arr[j], arr[j + 1])`,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    difficulty: 'Beginner',
    link: '/sort',
    complexityKey: 'selection',
    description: 'Finds the minimum element from the unsorted region and places it at the start.',
    pseudocode: `function selectionSort(arr):
    n = arr.length
    for i from 0 to n - 1:
        minIndex = i
        for j from i + 1 to n - 1:
            if arr[j] < arr[minIndex]:
                minIndex = j
        swap(arr[i], arr[minIndex])`,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'Beginner',
    link: '/sort',
    complexityKey: 'insertion',
    description: 'Builds sorted array one item at a time by shifting elements.',
    pseudocode: `function insertionSort(arr):
    for i from 1 to arr.length - 1:
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j = j - 1
        arr[j + 1] = key`,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',
    link: '/sort',
    complexityKey: 'quick',
    description: 'Divide-and-conquer algorithm partitioning around a pivot element.',
    pseudocode: `function quickSort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quickSort(arr, low, pi - 1)
        quickSort(arr, pi + 1, high)

function partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j from low to high - 1:
        if arr[j] < pivot:
            i = i + 1
            swap(arr[i], arr[j])
    swap(arr[i + 1], arr[high])
    return i + 1`,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',
    link: '/sort',
    complexityKey: 'merge',
    description: 'Divides array in halves, recursively sorts them, and merges sorted halves.',
    pseudocode: `function mergeSort(arr):
    if arr.length <= 1: return arr
    mid = floor(arr.length / 2)
    left = mergeSort(arr[0...mid])
    right = mergeSort(arr[mid...end])
    return merge(left, right)`,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',
    link: '/sort',
    complexityKey: 'heap',
    description: 'Converts array into a Max Heap and repeatedly extracts maximum element.',
    pseudocode: `function heapSort(arr):
    buildMaxHeap(arr)
    for i from arr.length - 1 down to 1:
        swap(arr[0], arr[i])
        heapify(arr, 0, i)`,
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',
    link: '/sort',
    complexityKey: 'counting',
    description: 'Non-comparison sort counting occurrences of each unique element.',
    pseudocode: `function countingSort(arr, k):
    count = array of zeros of size k + 1
    for x in arr: count[x]++
    index = 0
    for val from 0 to k:
        while count[val] > 0:
            arr[index++] = val
            count[val]--`,
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'Sorting',
    difficulty: 'Advanced',
    link: '/sort',
    complexityKey: 'radix',
    description: 'Sorts numbers digit-by-digit from least to most significant.',
    pseudocode: `function radixSort(arr):
    maxVal = max(arr)
    exp = 1
    while floor(maxVal / exp) > 0:
        countingSortByDigit(arr, exp)
        exp *= 10`,
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    category: 'Sorting',
    difficulty: 'Intermediate',
    link: '/sort',
    complexityKey: 'shell',
    description: 'Generalization of insertion sort allowing exchange of far-apart elements.',
    pseudocode: `function shellSort(arr):
    gap = floor(arr.length / 2)
    while gap > 0:
        for i from gap to arr.length - 1:
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap = floor(gap / 2)`,
  },

  // ─── SEARCHING ───────────────────────────────────────────────────────────────
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Searching',
    difficulty: 'Beginner',
    link: '/ldssearch',
    complexityKey: 'linear',
    description: 'Sequentially checks each element of the array until target is found.',
    pseudocode: `function linearSearch(arr, target):
    for i from 0 to arr.length - 1:
        if arr[i] == target:
            return i
    return -1`,
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    difficulty: 'Beginner',
    link: '/ldssearch',
    complexityKey: 'binary',
    description: 'Divides sorted array search interval in half recursively or iteratively.',
    pseudocode: `function binarySearch(arr, target):
    low = 0, high = arr.length - 1
    while low <= high:
        mid = floor((low + high) / 2)
        if arr[mid] == target: return mid
        else if arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
  },

  // ─── GRAPH ───────────────────────────────────────────────────────────────────
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph',
    difficulty: 'Beginner',
    link: '/search',
    complexityKey: 'bfs',
    description: 'Explores graph level-by-level starting from source node using a Queue.',
    pseudocode: `function bfs(graph, start):
    visited = Set()
    queue = Queue([start])
    visited.add(start)
    while queue is not empty:
        node = queue.pop()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.push(neighbor)`,
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Graph',
    difficulty: 'Beginner',
    link: '/search',
    complexityKey: 'dfs',
    description: 'Explores graph by going as deep as possible along each branch before backtracking.',
    pseudocode: `function dfs(graph, node, visited = Set()):
    if node in visited: return
    visited.add(node)
    process(node)
    for neighbor in graph[node]:
        dfs(graph, neighbor, visited)`,
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'Graph',
    difficulty: 'Intermediate',
    link: '/spath',
    complexityKey: 'dijkstra',
    description: 'Finds single-source shortest path in weighted graph with non-negative edge weights.',
    pseudocode: `function dijkstra(graph, source):
    dist = array filled with infinity, dist[source] = 0
    pq = MinPriorityQueue([(0, source)])
    while pq is not empty:
        (d, u) = pq.popMin()
        if d > dist[u]: continue
        for (v, weight) in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                pq.push((dist[v], v))`,
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford Algorithm',
    category: 'Graph',
    difficulty: 'Intermediate',
    link: '/spath',
    complexityKey: 'bellmanford',
    description: 'Computes shortest paths from single source and detects negative cycles.',
    pseudocode: `function bellmanFord(edges, V, source):
    dist = array filled with infinity, dist[source] = 0
    for i from 1 to V - 1:
        for (u, v, weight) in edges:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
    return dist`,
  },
  {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall Algorithm',
    category: 'Graph',
    difficulty: 'Intermediate',
    link: '/spath',
    complexityKey: 'floydwarshall',
    description: 'Computes all-pairs shortest paths using dynamic programming.',
    pseudocode: `function floydWarshall(dist, V):
    for k from 0 to V - 1:
        for i from 0 to V - 1:
            for j from 0 to V - 1:
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`,
  },
  {
    id: 'prim-mst',
    name: "Prim's MST Algorithm",
    category: 'Graph',
    difficulty: 'Intermediate',
    link: '/spath',
    complexityKey: 'prim',
    description: 'Greedy algorithm that builds Minimum Spanning Tree connected component by component.',
    pseudocode: `function primMST(graph, V):
    inMST = array of false
    pq = MinPriorityQueue([(0, startNode)])
    while pq is not empty:
        (weight, u) = pq.popMin()
        if inMST[u]: continue
        inMST[u] = true
        for (v, w) in graph[u]:
            if not inMST[v]: pq.push((w, v))`,
  },
  {
    id: 'kruskal-mst',
    name: "Kruskal's MST Algorithm",
    category: 'Graph',
    difficulty: 'Intermediate',
    link: '/spath',
    complexityKey: 'kruskal',
    description: 'Finds MST by sorting all graph edges and adding them using Disjoint Set Union (DSU).',
    pseudocode: `function kruskalMST(edges, V):
    sort edges by weight ascending
    dsu = DSU(V)
    mst = []
    for (u, v, weight) in edges:
        if dsu.find(u) != dsu.find(v):
            dsu.union(u, v)
            mst.add((u, v, weight))`,
  },

  // ─── DYNAMIC PROGRAMMING ─────────────────────────────────────────────────────
  {
    id: 'lcs',
    name: 'Longest Common Subsequence (LCS)',
    category: 'Dynamic Programming',
    difficulty: 'Intermediate',
    link: '/dynamic-programming',
    time: { best: 'O(m * n)', average: 'O(m * n)', worst: 'O(m * n)' },
    space: 'O(m * n)',
    description: 'Finds longest subsequence present in both strings in same relative order.',
    pseudocode: `function lcs(A, B):
    m = A.length, n = B.length
    dp = 2D array of size (m+1) x (n+1) filled with 0
    for i from 1 to m:
        for j from 1 to n:
            if A[i-1] == B[j-1]: dp[i][j] = dp[i-1][j-1] + 1
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
  },
  {
    id: 'knapsack-01',
    name: '0/1 Knapsack Problem',
    category: 'Dynamic Programming',
    difficulty: 'Intermediate',
    link: '/dynamic-programming',
    complexityKey: 'knapsack',
    description: 'Maximizes item value in knapsack of capacity W without splitting items.',
    pseudocode: `function knapsack(weights, values, W, N):
    dp = 2D array of size (N+1) x (W+1) filled with 0
    for i from 1 to N:
        for w from 0 to W:
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[N][W]`,
  },
  {
    id: 'coin-change',
    name: 'Coin Change Problem',
    category: 'Dynamic Programming',
    difficulty: 'Intermediate',
    link: '/dynamic-programming',
    time: { best: 'O(n * amount)', average: 'O(n * amount)', worst: 'O(n * amount)' },
    space: 'O(amount)',
    description: 'Calculates fewest coins needed to make up a target total amount.',
    pseudocode: `function coinChange(coins, amount):
    dp = array of size (amount + 1) filled with infinity, dp[0] = 0
    for a from 1 to amount:
        for coin in coins:
            if a - coin >= 0:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] == infinity ? -1 : dp[amount]`,
  },
  {
    id: 'lis',
    name: 'Longest Increasing Subsequence (LIS)',
    category: 'Dynamic Programming',
    difficulty: 'Intermediate',
    link: '/dynamic-programming',
    time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(n)',
    description: 'Finds length of longest strictly increasing subsequence in an array.',
    pseudocode: `function lis(arr):
    n = arr.length
    dp = array of size n filled with 1
    for i from 1 to n - 1:
        for j from 0 to i - 1:
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
  },
  {
    id: 'kadanes-algorithm',
    name: "Kadane's Algorithm",
    category: 'Dynamic Programming',
    difficulty: 'Intermediate',
    link: '/kadane',
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)',
    description: 'Finds maximum sum contiguous subarray in 1D numeric array.',
    pseudocode: `function maxSubarraySum(arr):
    maxSoFar = arr[0]
    currentMax = arr[0]
    for i from 1 to arr.length - 1:
        currentMax = max(arr[i], currentMax + arr[i])
        maxSoFar = max(maxSoFar, currentMax)
    return maxSoFar`,
  },

  // ─── BACKTRACKING ────────────────────────────────────────────────────────────
  {
    id: 'n-queens',
    name: 'N-Queens Problem',
    category: 'Backtracking',
    difficulty: 'Advanced',
    link: '/backtracking',
    complexityKey: 'nqueens',
    description: 'Places N non-attacking queens on an N x N chessboard.',
    pseudocode: `function solveNQueens(board, row):
    if row == N: return true
    for col from 0 to N - 1:
        if isSafe(board, row, col):
            board[row][col] = 1
            if solveNQueens(board, row + 1): return true
            board[row][col] = 0 // backtrack
    return false`,
  },
  {
    id: 'sudoku-solver',
    name: 'Sudoku Solver',
    category: 'Backtracking',
    difficulty: 'Advanced',
    link: '/backtracking',
    complexityKey: 'sudoku',
    description: 'Fills a 9x9 grid with digits so each column, row, and 3x3 subgrid contains 1-9.',
    pseudocode: `function solveSudoku(board):
    (row, col) = findUnassignedCell(board)
    if no unassigned cell left: return true
    for num from 1 to 9:
        if isValid(board, row, col, num):
            board[row][col] = num
            if solveSudoku(board): return true
            board[row][col] = 0 // backtrack
    return false`,
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    category: 'Backtracking',
    difficulty: 'Advanced',
    link: '/backtracking',
    complexityKey: 'hanoi',
    description: 'Puzzle moving disks between three pegs following size constraints.',
    pseudocode: `function hanoi(n, source, auxiliary, target):
    if n == 1:
        moveDisk(source, target)
        return
    hanoi(n - 1, source, target, auxiliary)
    moveDisk(source, target)
    hanoi(n - 1, auxiliary, source, target)`,
  },
  {
    id: 'graph-coloring',
    name: 'Graph K-Coloring',
    category: 'Backtracking',
    difficulty: 'Advanced',
    link: '/backtracking',
    complexityKey: 'graphcoloring',
    description: 'Assigns colors to vertices such that no two adjacent vertices share a color.',
    pseudocode: `function graphColoring(graph, k, color, v):
    if v == V: return true
    for c from 1 to k:
        if isSafe(v, graph, color, c):
            color[v] = c
            if graphColoring(graph, k, color, v + 1): return true
            color[v] = 0 // backtrack
    return false`,
  },

  // ─── STRINGS ─────────────────────────────────────────────────────────────────
  {
    id: 'kmp',
    name: 'Knuth-Morris-Pratt (KMP)',
    category: 'Strings',
    difficulty: 'Advanced',
    link: '/string-algorithms',
    complexityKey: 'kmp',
    description: 'Pattern matching using partial match table (LPS prefix function) to skip checks.',
    pseudocode: `function kmpSearch(text, pattern):
    lps = computeLPSArray(pattern)
    i = 0, j = 0
    while i < text.length:
        if pattern[j] == text[i]: i++; j++
        if j == pattern.length: return i - j // match found
        else if i < text.length and pattern[j] != text[i]:
            if j != 0: j = lps[j - 1]
            else: i++
    return -1`,
  },
  {
    id: 'rabin-karp',
    name: 'Rabin-Karp Algorithm',
    category: 'Strings',
    difficulty: 'Advanced',
    link: '/string-algorithms',
    complexityKey: 'rabinkarp',
    description: 'Pattern matching algorithm using rolling hash functions.',
    pseudocode: `function rabinKarp(text, pattern, prime):
    m = pattern.length, n = text.length
    pHash = hash(pattern), tHash = hash(text[0...m])
    for i from 0 to n - m:
        if pHash == tHash:
            if text[i...i+m] == pattern: return i
        if i < n - m:
            tHash = recalculateRollingHash(tHash, text[i], text[i+m])
    return -1`,
  },
  {
    id: 'z-algorithm',
    name: 'Z-Algorithm',
    category: 'Strings',
    difficulty: 'Advanced',
    link: '/string-algorithms',
    complexityKey: 'zalgorithm',
    description: 'Computes Z-array where Z[i] is length of longest substring starting at i matching prefix.',
    pseudocode: `function zAlgorithm(S):
    n = S.length, Z = array of size n filled with 0
    L = 0, R = 0
    for i from 1 to n - 1:
        if i > R:
            L = R = i
            while R < n and S[R - L] == S[R]: R++
            Z[i] = R - L; R--
        else:
            k = i - L
            if Z[k] < R - i + 1: Z[i] = Z[k]
            else:
                L = i
                while R < n and S[R - L] == S[R]: R++
                Z[i] = R - L; R--
    return Z`,
  },

  // ─── MATH & THEORY ───────────────────────────────────────────────────────────
  {
    id: 'gcd',
    name: 'Euclidean GCD',
    category: 'Math & Theory',
    difficulty: 'Intermediate',
    link: '/math-theory',
    complexityKey: 'gcd',
    description: 'Computes Greatest Common Divisor of two integers using remainder division.',
    pseudocode: `function gcd(a, b):
    while b != 0:
        temp = b
        b = a % b
        a = temp
    return a`,
  },
  {
    id: 'fast-exponentiation',
    name: 'Fast Exponentiation',
    category: 'Math & Theory',
    difficulty: 'Intermediate',
    link: '/math-theory',
    complexityKey: 'fastexpo',
    description: 'Computes (base^exp) % mod in O(log exp) time using binary exponentiation.',
    pseudocode: `function power(base, exp):
    res = 1
    while exp > 0:
        if exp % 2 == 1: res *= base
        base *= base
        exp = floor(exp / 2)
    return res`,
  },
  {
    id: 'bitwise-operations',
    name: 'Bitwise Operations',
    category: 'Math & Theory',
    difficulty: 'Intermediate',
    link: '/math-theory',
    complexityKey: 'bitmanip',
    description: 'Manipulates binary bit representations directly using AND, OR, XOR, SHIFT.',
    pseudocode: `getBit(num, i)   = (num & (1 << i)) != 0
setBit(num, i)   = num | (1 << i)
clearBit(num, i) = num & ~(1 << i)
toggleBit(num, i)= num ^ (1 << i)`,
  },
  {
    id: 'sieve-eratosthenes',
    name: 'Sieve of Eratosthenes',
    category: 'Math & Theory',
    difficulty: 'Intermediate',
    link: '/math-theory',
    complexityKey: 'sieve',
    description: 'Finds all prime numbers up to N by marking multiples of each prime.',
    pseudocode: `function sieve(N):
    isPrime = array of size N + 1 filled with true
    isPrime[0] = isPrime[1] = false
    for p from 2 to sqrt(N):
        if isPrime[p]:
            for i from p * p to N step p:
                isPrime[i] = false
    return isPrime`,
  },
  {
    id: 'fibonacci-sequence',
    name: 'Fibonacci Sequence',
    category: 'Math & Theory',
    difficulty: 'Beginner',
    link: '/math-theory',
    complexityKey: 'fibonacci',
    description: 'Computes Nth Fibonacci number iteratively or using DP memoization.',
    pseudocode: `function fibonacci(n):
    if n <= 1: return n
    prev = 0, curr = 1
    for i from 2 to n:
        nextVal = prev + curr
        prev = curr
        curr = nextVal
    return curr`,
  },

  // ─── GREEDY ──────────────────────────────────────────────────────────────────
  {
    id: 'huffman-coding',
    name: 'Huffman Coding',
    category: 'Greedy',
    difficulty: 'Intermediate',
    link: '/greedy',
    complexityKey: 'huffman',
    description: 'Lossless data compression algorithm generating optimal prefix codes.',
    pseudocode: `function huffmanCoding(frequencies):
    pq = MinPriorityQueue(leaves generated from frequencies)
    while pq.size() > 1:
        left = pq.popMin()
        right = pq.popMin()
        parent = Node(freq = left.freq + right.freq, left, right)
        pq.push(parent)
    return pq.popMin() // Root of Huffman Tree`,
  },
  {
    id: 'fractional-knapsack',
    name: 'Fractional Knapsack',
    category: 'Greedy',
    difficulty: 'Intermediate',
    link: '/greedy',
    complexityKey: 'fractionalknapsack',
    description: 'Greedy algorithm picking items by highest value/weight ratio.',
    pseudocode: `function fractionalKnapsack(items, capacity):
    sort items by (value / weight) descending
    totalValue = 0.0
    for item in items:
        if capacity >= item.weight:
            capacity -= item.weight
            totalValue += item.value
        else:
            totalValue += item.value * (capacity / item.weight)
            break
    return totalValue`,
  },
  {
    id: 'job-sequencing',
    name: 'Job Sequencing with Deadlines',
    category: 'Greedy',
    difficulty: 'Intermediate',
    link: '/greedy',
    complexityKey: 'jobsequencing',
    description: 'Schedules jobs to maximize profit given deadlines and unit-time execution.',
    pseudocode: `function jobSequencing(jobs):
    sort jobs by profit descending
    maxDeadline = max(jobs.deadline)
    slots = array of size maxDeadline filled with free
    for job in jobs:
        for slot from job.deadline - 1 down to 0:
            if slots[slot] is free:
                slots[slot] = job
                break`,
  },

  // ─── MONOTONIC STACK & ARRAYS ────────────────────────────────────────────────
  {
    id: 'largest-rectangle-histogram',
    name: 'Largest Rectangle in Histogram',
    category: 'Monotonic Stack & Arrays',
    difficulty: 'Advanced',
    link: '/monotonic-stack',
    complexityKey: 'histogram',
    description: 'Finds largest rectangular area in histogram using a monotonic increasing stack.',
    pseudocode: `function largestRectangleArea(heights):
    stack = []
    maxArea = 0
    for i from 0 to heights.length:
        h = i == heights.length ? 0 : heights[i]
        while stack is not empty and heights[stack.top] >= h:
            height = heights[stack.pop()]
            width = stack.is_empty() ? i : i - stack.top - 1
            maxArea = max(maxArea, height * width)
        stack.push(i)
    return maxArea`,
  },
  {
    id: 'maximal-rectangle-matrix',
    name: 'Maximal Rectangle in Matrix',
    category: 'Monotonic Stack & Arrays',
    difficulty: 'Advanced',
    link: '/monotonic-stack',
    complexityKey: 'matrix',
    description: 'Finds largest 1s rectangle in binary matrix using histogram stack row-by-row.',
    pseudocode: `function maximalRectangle(matrix):
    if matrix is empty: return 0
    heights = array of zeros of size matrix[0].length
    maxArea = 0
    for row in matrix:
        for col from 0 to row.length - 1:
            heights[col] = row[col] == 1 ? heights[col] + 1 : 0
        maxArea = max(maxArea, largestRectangleArea(heights))
    return maxArea`,
  },
  {
    id: 'moores-voting',
    name: "Moore's Voting Algorithm",
    category: 'Monotonic Stack & Arrays',
    difficulty: 'Beginner',
    link: '/moore-voting',
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)',
    description: 'Finds majority element in array that appears more than n/2 times.',
    pseudocode: `function majorityElement(nums):
    candidate = null, count = 0
    for num in nums:
        if count == 0:
            candidate = num
        count += (num == candidate) ? 1 : -1
    return candidate`,
  },

  // ─── DATA STRUCTURES ─────────────────────────────────────────────────────────
  {
    id: 'disjoint-set-union',
    name: 'Disjoint Set Union (DSU)',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    link: '/adt',
    time: { best: 'O(1)', average: 'O(α(N))', worst: 'O(α(N))' },
    space: 'O(N)',
    description: 'Tracks partitioned elements into disjoint sets with path compression and rank union.',
    pseudocode: `function find(i):
    if parent[i] == i: return i
    parent[i] = find(parent[i]) // path compression
    return parent[i]

function union(i, j):
    rootI = find(i), rootJ = find(j)
    if rootI != rootJ:
        if rank[rootI] < rank[rootJ]: swap(rootI, rootJ)
        parent[rootJ] = rootI
        if rank[rootI] == rank[rootJ]: rank[rootI]++`,
  },
  {
    id: 'binary-heap',
    name: 'Binary Heap & Priority Queue',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    link: '/adt',
    time: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' },
    space: 'O(N)',
    description: 'Complete binary tree maintaining heap property for efficient min/max access.',
    pseudocode: `function push(val):
    heap.append(val)
    siftUp(heap.length - 1)

function pop():
    swap(heap[0], heap[heap.length - 1])
    val = heap.pop()
    siftDown(0)
    return val`,
  },

  // ─── OPERATING SYSTEMS ───────────────────────────────────────────────────────
  {
    id: 'cpu-scheduling',
    name: 'CPU Scheduling Algorithms',
    category: 'Operating Systems',
    difficulty: 'Beginner',
    link: '/operating-systems/cpu-scheduling',
    time: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N²)' },
    space: 'O(N)',
    description: 'FCFS, SJF, SRTF, Priority, and Round Robin CPU process scheduling strategies.',
    pseudocode: `// Round Robin CPU Scheduling
function roundRobin(processes, quantum):
    queue = Queue(processes)
    while queue is not empty:
        p = queue.pop()
        execTime = min(p.remainingTime, quantum)
        p.remainingTime -= execTime
        if p.remainingTime > 0: queue.push(p)`,
  },
  {
    id: 'page-replacement',
    name: 'Page Replacement Algorithms',
    category: 'Operating Systems',
    difficulty: 'Intermediate',
    link: '/operating-systems/page-replacement',
    time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
    space: 'O(Frames)',
    description: 'FIFO, LRU, and Optimal memory page replacement algorithms.',
    pseudocode: `// Least Recently Used (LRU) Page Replacement
function lruPageReplacement(pages, frameCount):
    frames = [], pageFaults = 0
    for page in pages:
        if page in frames:
            frames.moveToBack(page)
        else:
            pageFaults++
            if frames.length == frameCount: frames.removeFront()
            frames.push(page)`,
  },
  {
    id: 'disk-scheduling',
    name: 'Disk Scheduling Algorithms',
    category: 'Operating Systems',
    difficulty: 'Intermediate',
    link: '/operating-systems/disk-scheduling',
    time: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)' },
    space: 'O(N)',
    description: 'FCFS, SSTF, SCAN (Elevator), C-SCAN, and LOOK disk track head movement policies.',
    pseudocode: `// SCAN (Elevator) Disk Scheduling
function scanDisk(requests, head, direction):
    sort requests ascending
    left = requests[< head], right = requests[>= head]
    if direction == "right":
        order = right + [MAX_TRACK] + left.reverse()
    return calculateSeekOperations(head, order)`,
  },
]

/**
 * Normalizes algorithm data by merging complexity map data and defaults.
 * @param {Object} item Raw algorithm item
 * @returns {Object} Normalized algorithm item with guaranteed properties
 */
export function normalizeAlgorithm(item) {
  const comp = item.complexityKey ? complexityMap[item.complexityKey] : null
  const best = item.time?.best || comp?.best || 'O(1)'
  const average = item.time?.average || comp?.average || 'O(N)'
  const worst = item.time?.worst || comp?.worst || 'O(N)'
  const space = item.space || comp?.space || 'O(1)'

  return {
    ...item,
    time: { best, average, worst },
    space,
    pseudocode: item.pseudocode || '// Pseudocode available in interactive visualizer',
  }
}

/**
 * Gets all normalized algorithms.
 */
export function getNormalizedAlgorithms() {
  return CHEATSHEET_ALGORITHMS.map(normalizeAlgorithm)
}

/**
 * Gets list of unique categories available.
 */
export function getCategories() {
  const categories = new Set(CHEATSHEET_ALGORITHMS.map((algo) => algo.category))
  return ['All', ...Array.from(categories)]
}

/**
 * Filters algorithms based on active category and search query.
 */
export function filterAlgorithms(algorithms, category = 'All', searchQuery = '') {
  const query = searchQuery.trim().toLowerCase()
  return algorithms.filter((algo) => {
    const matchesCategory = category === 'All' || algo.category === category
    const matchesSearch =
      !query ||
      algo.name.toLowerCase().includes(query) ||
      algo.category.toLowerCase().includes(query) ||
      algo.description.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
}
