import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { motion, AnimatePresence } from 'framer-motion'

const ALGORITHMS = [
  // --- Sorting Algorithms ---
  {
    id: 'sort-overview',
    name: 'Sorting Algorithms Overview',
    category: 'Sorting',
    route: '/sort',
    keywords: ['sort', 'sorting', 'algorithms', 'comparison sort'],
  },
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Sorting',
    route: '/sort?algo=bubble',
    keywords: ['bubble', 'sort', 'adjacent swap', 'sorting'],
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    category: 'Sorting',
    route: '/sort?algo=selection',
    keywords: ['selection', 'sort', 'minimum element', 'sorting'],
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Sorting',
    route: '/sort?algo=insertion',
    keywords: ['insertion', 'sort', 'card sort', 'sorting'],
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Sorting',
    route: '/sort?algo=quick',
    keywords: ['quick', 'sort', 'pivot', 'divide and conquer', 'sorting'],
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Sorting',
    route: '/sort?algo=merge',
    keywords: ['merge', 'sort', 'divide and conquer', 'sorting'],
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Sorting',
    route: '/sort?algo=heap',
    keywords: ['heap', 'sort', 'binary heap', 'sorting'],
  },
  {
    id: 'counting',
    name: 'Counting Sort',
    category: 'Sorting',
    route: '/sort?algo=counting',
    keywords: ['counting', 'sort', 'non comparison', 'sorting'],
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    category: 'Sorting',
    route: '/sort?algo=radix',
    keywords: ['radix', 'sort', 'digit sort', 'sorting'],
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    category: 'Sorting',
    route: '/sort?algo=shell',
    keywords: ['shell', 'sort', 'gap insertion', 'sorting'],
  },
  {
    id: 'sort-compare',
    name: 'Sorting Algorithms Comparison',
    category: 'Sorting',
    route: '/sort?mode=compare',
    keywords: ['compare', 'sorting', 'side by side', 'benchmark'],
  },

  // --- Graph Traversal & Searching ---
  {
    id: 'search-overview',
    name: 'Graph Traversal & Search',
    category: 'Searching',
    route: '/search',
    keywords: ['graph', 'search', 'traversal', 'nodes', 'edges'],
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Searching',
    route: '/search?algo=bfs',
    keywords: ['bfs', 'breadth first search', 'queue', 'level order', 'graph'],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Searching',
    route: '/search?algo=dfs',
    keywords: ['dfs', 'depth first search', 'stack', 'recursion', 'graph'],
  },
  {
    id: 'search-compare',
    name: 'Graph Search Comparison (BFS vs DFS)',
    category: 'Searching',
    route: '/search?mode=compare',
    keywords: ['bfs vs dfs', 'graph comparison', 'traversal compare'],
  },

  // --- Shortest Path & Minimum Spanning Tree ---
  {
    id: 'spath-overview',
    name: 'Shortest Path & MST Algorithms',
    category: 'Shortest Path',
    route: '/spath',
    keywords: ['shortest path', 'graph', 'mst', 'minimum spanning tree'],
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'Shortest Path',
    route: '/spath?algo=dijkstra',
    keywords: ['dijkstra', 'shortest path', 'greedy', 'priority queue', 'graph'],
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford Algorithm',
    category: 'Shortest Path',
    route: '/spath?algo=bellman-ford',
    keywords: ['bellman ford', 'negative weights', 'relaxation', 'shortest path'],
  },
  {
    id: 'floyd-warshall',
    name: 'Floyd-Warshall Algorithm',
    category: 'Shortest Path',
    route: '/spath?algo=floyd-warshall',
    keywords: ['floyd warshall', 'all pairs shortest path', 'matrix', 'dp'],
  },
  {
    id: 'a-star',
    name: 'A* Search Algorithm',
    category: 'Shortest Path',
    route: '/spath?algo=a-star',
    keywords: ['a star', 'a*', 'heuristic', 'pathfinding', 'grid search'],
  },
  {
    id: 'prim',
    name: "Prim's Algorithm (MST)",
    category: 'Minimum Spanning Tree',
    route: '/spath?algo=prim',
    keywords: ['prim', 'prims', 'mst', 'minimum spanning tree', 'greedy'],
  },
  {
    id: 'kruskal',
    name: "Kruskal's Algorithm (MST)",
    category: 'Minimum Spanning Tree',
    route: '/spath?algo=kruskal',
    keywords: ['kruskal', 'kruskals', 'mst', 'minimum spanning tree', 'union find', 'dsu'],
  },
  {
    id: 'spath-compare',
    name: 'Shortest Path Comparison',
    category: 'Shortest Path',
    route: '/spath?mode=compare',
    keywords: ['shortest path compare', 'dijkstra vs bellman ford'],
  },

  // --- Array Search ---
  {
    id: 'arraysearch-overview',
    name: 'Array Search Algorithms',
    category: 'Array Search',
    route: '/ldssearch',
    keywords: ['array search', 'linear search', 'binary search', 'search'],
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Array Search',
    route: '/ldssearch?algo=linear',
    keywords: ['linear search', 'sequential search', 'array'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Array Search',
    route: '/ldssearch?algo=binary',
    keywords: ['binary search', 'divide and conquer', 'sorted array', 'log n'],
  },
  {
    id: 'arraysearch-compare',
    name: 'Linear vs Binary Search Comparison',
    category: 'Array Search',
    route: '/ldssearch?mode=compare',
    keywords: ['linear vs binary', 'search comparison'],
  },
  {
    id: 'kadane',
    name: "Kadane's Algorithm (Max Subarray Sum)",
    category: 'Array / DP',
    route: '/kadane',
    keywords: ['kadane', 'maximum subarray', 'max subarray sum', 'dynamic programming'],
  },
  {
    id: 'moore-voting',
    name: "Moore's Voting Algorithm (Majority Element)",
    category: 'Array Search',
    route: '/moore-voting',
    keywords: ['moore voting', 'majority element', 'boyer moore', 'array'],
  },

  // --- Abstract Data Types & Data Structures ---
  {
    id: 'adt-overview',
    name: 'Data Structures Explorer',
    category: 'Data Structures',
    route: '/adt',
    keywords: ['data structures', 'adt', 'stack', 'queue', 'tree', 'heap', 'linked list'],
  },
  {
    id: 'stack-adt',
    name: 'Stack Data Structure',
    category: 'Data Structures',
    route: '/adt?type=stack',
    keywords: ['stack', 'lifo', 'push', 'pop', 'peek'],
  },
  {
    id: 'queue-adt',
    name: 'Queue Data Structure',
    category: 'Data Structures',
    route: '/adt?type=queue',
    keywords: ['queue', 'fifo', 'enqueue', 'dequeue'],
  },
  {
    id: 'tree-adt',
    name: 'Binary Tree',
    category: 'Data Structures',
    route: '/adt?type=tree',
    keywords: ['binary tree', 'tree traversal', 'inorder', 'preorder', 'postorder'],
  },
  {
    id: 'heap-adt',
    name: 'Binary Heap',
    category: 'Data Structures',
    route: '/adt?type=heap',
    keywords: ['binary heap', 'min heap', 'max heap', 'heapify'],
  },
  {
    id: 'priority-queue-adt',
    name: 'Priority Queue',
    category: 'Data Structures',
    route: '/adt?type=priority-queue',
    keywords: ['priority queue', 'heap', 'element priority'],
  },
  {
    id: 'dsu-adt',
    name: 'Disjoint Set Union (DSU / Union-Find)',
    category: 'Data Structures',
    route: '/adt?type=dsu',
    keywords: ['dsu', 'disjoint set', 'union find', 'connected components', 'path compression'],
  },
  {
    id: 'linked-list-adt',
    name: 'Linked List (Singly & Doubly)',
    category: 'Data Structures',
    route: '/adt?type=linked-list',
    keywords: ['linked list', 'singly linked list', 'doubly linked list', 'pointers', 'nodes'],
  },
  {
    id: 'graph-builder-adt',
    name: 'Interactive Graph Builder',
    category: 'Data Structures',
    route: '/adt?type=graph',
    keywords: ['graph builder', 'vertices', 'edges', 'adjacency list', 'network'],
  },
  {
    id: 'adt-compare',
    name: 'Data Structures Operations Comparison',
    category: 'Data Structures',
    route: '/adt?mode=compare',
    keywords: ['data structures compare', 'stack vs queue'],
  },

  // --- Dynamic Programming ---
  {
    id: 'dp-overview',
    name: 'Dynamic Programming Visualizer',
    category: 'Dynamic Programming',
    route: '/dynamic-programming',
    keywords: ['dynamic programming', 'dp', 'memoization', 'tabulation', 'optimal substructure'],
  },
  {
    id: 'dp-lcs',
    name: 'Longest Common Subsequence (LCS)',
    category: 'Dynamic Programming',
    route: '/dynamic-programming?problem=lcs',
    keywords: ['lcs', 'longest common subsequence', 'dp string', 'alignment'],
  },
  {
    id: 'dp-knapsack',
    name: '0/1 Knapsack Problem',
    category: 'Dynamic Programming',
    route: '/dynamic-programming?problem=knapsack',
    keywords: ['knapsack', '0/1 knapsack', 'capacity', 'weight value', 'dp'],
  },
  {
    id: 'dp-coin-change',
    name: 'Coin Change Problem',
    category: 'Dynamic Programming',
    route: '/dynamic-programming?problem=coin-change',
    keywords: ['coin change', 'minimum coins', 'denomination', 'dp'],
  },
  {
    id: 'dp-lis',
    name: 'Longest Increasing Subsequence (LIS)',
    category: 'Dynamic Programming',
    route: '/dynamic-programming?problem=lis',
    keywords: ['lis', 'longest increasing subsequence', 'subsequence', 'dp'],
  },
  {
    id: 'dp-journey-overview',
    name: 'DP Optimization Journey',
    category: 'Dynamic Programming',
    route: '/dp-journey',
    keywords: ['dp journey', 'optimization', 'recursion to dp', 'space optimization'],
  },
  {
    id: 'dp-journey-fib',
    name: 'Fibonacci DP Optimization (Recursion to Space O(1))',
    category: 'Dynamic Programming',
    route: '/dp-journey?problem=fibonacci',
    keywords: ['fibonacci dp', 'recursion to memo', 'fibonacci optimization'],
  },
  {
    id: 'dp-journey-stairs',
    name: 'Climbing Stairs DP Problem',
    category: 'Dynamic Programming',
    route: '/dp-journey?problem=climbingStairs',
    keywords: ['climbing stairs', 'stairs dp', 'ways to climb'],
  },
  {
    id: 'dp-journey-robber',
    name: 'House Robber DP Problem',
    category: 'Dynamic Programming',
    route: '/dp-journey?problem=houseRobber',
    keywords: ['house robber', 'house robber dp', 'adjacent houses'],
  },
  {
    id: 'dp-journey-coin',
    name: 'Coin Change DP Optimization Journey',
    category: 'Dynamic Programming',
    route: '/dp-journey?problem=coinChange',
    keywords: ['coin change optimization', 'coin change dp journey'],
  },

  // --- Sliding Window Pattern ---
  {
    id: 'sliding-window-overview',
    name: 'Sliding Window Pattern Visualizer',
    category: 'Sliding Window',
    route: '/sliding-window',
    keywords: ['sliding window', 'window pattern', 'subarrays', 'pointers'],
  },
  {
    id: 'sw-max-sum',
    name: 'Max Sum Subarray of Size K',
    category: 'Sliding Window',
    route: '/sliding-window?problem=maxSubarray',
    keywords: ['max sum subarray', 'fixed window', 'size k sum'],
  },
  {
    id: 'sw-longest-substring',
    name: 'Longest Substring Without Repeating Characters',
    category: 'Sliding Window',
    route: '/sliding-window?problem=longestSubstring',
    keywords: ['longest substring', 'unique characters', 'variable window'],
  },
  {
    id: 'sw-min-subarray-len',
    name: 'Minimum Size Subarray Sum',
    category: 'Sliding Window',
    route: '/sliding-window?problem=minSubarrayLen',
    keywords: ['minimum size subarray sum', 'min subarray len', 'target sum window'],
  },
  {
    id: 'sw-max-vowels',
    name: 'Max Vowels in Substring of Length K',
    category: 'Sliding Window',
    route: '/sliding-window?problem=maxVowels',
    keywords: ['max vowels', 'vowel count', 'fixed window vowels'],
  },

  // --- Two Pointer Technique ---
  {
    id: 'two-pointer-overview',
    name: 'Two Pointer Technique Visualizer',
    category: 'Two Pointer',
    route: '/two-pointer',
    keywords: ['two pointer', 'converging pointers', 'sorted array', 'inward pointers'],
  },
  {
    id: 'tp-two-sum',
    name: 'Two Sum (Sorted Array)',
    category: 'Two Pointer',
    route: '/two-pointer?problem=twoSum',
    keywords: ['two sum', 'two sum sorted', 'target sum pair', '2-sum'],
  },
  {
    id: 'tp-container',
    name: 'Container With Most Water',
    category: 'Two Pointer',
    route: '/two-pointer?problem=container',
    keywords: ['container with most water', 'max water', 'greedy pointers'],
  },
  {
    id: 'tp-palindrome',
    name: 'Valid Palindrome',
    category: 'Two Pointer',
    route: '/two-pointer?problem=palindrome',
    keywords: ['valid palindrome', 'palindrome check', 'left right pointers'],
  },
  {
    id: 'tp-trapping',
    name: 'Trapping Rain Water',
    category: 'Two Pointer',
    route: '/two-pointer?problem=trapping',
    keywords: ['trapping rain water', 'rain water', 'elevation map'],
  },

  // --- Monotonic Stack ---
  {
    id: 'monotonic-stack-overview',
    name: 'Monotonic Stack & Queue Visualizer',
    category: 'Monotonic Stack',
    route: '/monotonic-stack',
    keywords: ['monotonic stack', 'stack pattern', 'next greater', 'histogram'],
  },
  {
    id: 'ms-histogram',
    name: 'Largest Rectangle in Histogram',
    category: 'Monotonic Stack',
    route: '/monotonic-stack?problem=histogram',
    keywords: ['largest rectangle histogram', 'histogram area', 'bar heights'],
  },
  {
    id: 'ms-next-greater',
    name: 'Next Greater Element',
    category: 'Monotonic Stack',
    route: '/monotonic-stack?problem=nextGreater',
    keywords: ['next greater element', 'next greater', 'monotonic decreasing stack'],
  },
  {
    id: 'ms-daily-temp',
    name: 'Daily Temperatures',
    category: 'Monotonic Stack',
    route: '/monotonic-stack?problem=dailyTemp',
    keywords: ['daily temperatures', 'warmer days', 'waiting days stack'],
  },
  {
    id: 'ms-maximal-rectangle',
    name: 'Maximal Rectangle in Binary Matrix',
    category: 'Monotonic Stack',
    route: '/monotonic-stack?problem=maximalRectangle',
    keywords: ['maximal rectangle', 'binary matrix rectangle', '2d matrix stack'],
  },

  // --- Backtracking ---
  {
    id: 'backtracking-overview',
    name: 'Backtracking Algorithms Visualizer',
    category: 'Backtracking',
    route: '/backtracking',
    keywords: ['backtracking', 'recursion tree', 'decision tree', 'constraint satisfaction'],
  },
  {
    id: 'bt-nqueens',
    name: 'N-Queens Problem',
    category: 'Backtracking',
    route: '/backtracking?algo=nqueens',
    keywords: ['nqueens', 'n-queens', 'chessboard queens', 'backtracking'],
  },
  {
    id: 'bt-sudoku',
    name: 'Sudoku Solver',
    category: 'Backtracking',
    route: '/backtracking?algo=sudoku',
    keywords: ['sudoku', 'sudoku solver', '9x9 grid', 'backtracking'],
  },
  {
    id: 'bt-maze',
    name: 'Maze Pathfinding & Generation',
    category: 'Backtracking',
    route: '/backtracking?algo=maze',
    keywords: ['maze', 'maze pathfinding', 'maze solver', 'backtracking'],
  },
  {
    id: 'bt-knight',
    name: "Knight's Tour",
    category: 'Backtracking',
    route: '/backtracking?algo=knight',
    keywords: ['knight tour', 'knights tour', 'chessboard knight', 'backtracking'],
  },
  {
    id: 'bt-coloring',
    name: 'Graph Coloring (K-Coloring)',
    category: 'Backtracking',
    route: '/backtracking?algo=graph-coloring',
    keywords: ['graph coloring', 'k coloring', 'vertex coloring', 'backtracking'],
  },
  {
    id: 'bt-hanoi',
    name: 'Tower of Hanoi',
    category: 'Backtracking / Recursion',
    route: '/backtracking?algo=hanoi',
    keywords: ['tower of hanoi', 'hanoi disks', 'pegs', 'recursion'],
  },
  {
    id: 'bt-compare',
    name: 'Backtracking Algorithms Comparison',
    category: 'Backtracking',
    route: '/backtracking?mode=compare',
    keywords: ['backtracking compare', 'decision tree search speed'],
  },

  // --- String Algorithms ---
  {
    id: 'string-overview',
    name: 'String Matching Algorithms Visualizer',
    category: 'String',
    route: '/string-algorithms',
    keywords: ['string algorithms', 'pattern matching', 'kmp', 'rabin karp', 'z algorithm'],
  },
  {
    id: 'str-kmp',
    name: 'KMP (Knuth-Morris-Pratt) Algorithm',
    category: 'String',
    route: '/string-algorithms?algo=kmp',
    keywords: ['kmp', 'knuth morris pratt', 'lps array', 'prefix table', 'pattern search'],
  },
  {
    id: 'str-rabinkarp',
    name: 'Rabin-Karp Rolling Hash Algorithm',
    category: 'String',
    route: '/string-algorithms?algo=rabin-karp',
    keywords: ['rabin karp', 'rolling hash', 'hash matching', 'pattern search'],
  },
  {
    id: 'str-zalgorithm',
    name: 'Z-Algorithm String Matching',
    category: 'String',
    route: '/string-algorithms?algo=z-algorithm',
    keywords: ['z algorithm', 'z array', 'z box', 'pattern search'],
  },
  {
    id: 'str-compare',
    name: 'String Algorithms Comparison',
    category: 'String',
    route: '/string-algorithms?mode=compare',
    keywords: ['string compare', 'kmp vs rabin karp'],
  },

  // --- Math Theory ---
  {
    id: 'math-overview',
    name: 'Math & Algorithm Complexity Theory',
    category: 'Math Theory',
    route: '/math-theory',
    keywords: ['math theory', 'complexity theory', 'gcd', 'fft', 'sieve', 'fibonacci', 'bits'],
  },
  {
    id: 'math-gcd',
    name: 'Euclidean GCD Algorithm',
    category: 'Math Theory',
    route: '/math-theory?algo=gcd',
    keywords: ['euclidean gcd', 'greatest common divisor', 'modulo gcd', 'math'],
  },
  {
    id: 'math-expo',
    name: 'Fast Exponentiation (Binary Exponentiation)',
    category: 'Math Theory',
    route: '/math-theory?algo=expo',
    keywords: ['fast exponentiation', 'binary exponentiation', 'power by squaring', 'math'],
  },
  {
    id: 'math-sieve',
    name: 'Sieve of Eratosthenes (Prime Numbers)',
    category: 'Math Theory',
    route: '/math-theory?algo=sieve',
    keywords: ['sieve of eratosthenes', 'prime numbers', 'prime generation', 'math'],
  },
  {
    id: 'math-fibonacci',
    name: 'Fibonacci Sequence & Golden Ratio',
    category: 'Math Theory',
    route: '/math-theory?algo=fibonacci',
    keywords: ['fibonacci sequence', 'golden ratio', 'fibonacci spiral', 'math'],
  },
  {
    id: 'math-fft',
    name: 'Fast Fourier Transform (FFT)',
    category: 'Math Theory',
    route: '/math-theory?algo=fft',
    keywords: ['fft', 'fast fourier transform', 'butterfly diagram', 'signal processing', 'math'],
  },
  {
    id: 'math-bits',
    name: 'Bitwise Operations (AND, OR, XOR, Shift)',
    category: 'Math Theory',
    route: '/math-theory?algo=bits',
    keywords: ['bitwise operations', 'bit manipulation', 'and or xor shift', 'binary math'],
  },

  // --- Operating Systems ---
  {
    id: 'os-overview',
    name: 'Operating Systems Visualizers & Concepts',
    category: 'Operating Systems',
    route: '/operating-systems',
    keywords: ['operating systems', 'os', 'cpu scheduling', 'page replacement', 'disk scheduling'],
  },
  {
    id: 'os-cpu-overview',
    name: 'CPU Scheduling Algorithms Visualizer',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling',
    keywords: ['cpu scheduling', 'gantt chart', 'fcfs', 'sjf', 'round robin', 'priority'],
  },
  {
    id: 'os-cpu-fcfs',
    name: 'First-Come First-Served (FCFS) CPU Scheduling',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling?algo=fcfs',
    keywords: ['fcfs cpu', 'first come first served', 'gantt chart'],
  },
  {
    id: 'os-cpu-sjf',
    name: 'Shortest Job First (SJF) CPU Scheduling',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling?algo=sjf',
    keywords: ['sjf cpu', 'shortest job first', 'gantt chart'],
  },
  {
    id: 'os-cpu-srtf',
    name: 'Shortest Remaining Time First (SRTF) CPU Scheduling',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling?algo=srtf',
    keywords: ['srtf cpu', 'preemptive sjf', 'shortest remaining time first'],
  },
  {
    id: 'os-cpu-priority',
    name: 'Priority CPU Scheduling',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling?algo=priority',
    keywords: ['priority scheduling', 'process priority', 'preemptive priority'],
  },
  {
    id: 'os-cpu-rr',
    name: 'Round Robin (RR) CPU Scheduling',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling?algo=roundRobin',
    keywords: ['round robin', 'time quantum', 'ready queue rotation', 'rr cpu'],
  },
  {
    id: 'os-cpu-multilevel',
    name: 'Multilevel Queue CPU Scheduling',
    category: 'Operating Systems',
    route: '/operating-systems/cpu-scheduling?algo=multilevelQueue',
    keywords: ['multilevel queue', 'mlq cpu', 'foreground background queues'],
  },
  {
    id: 'os-page-replacement',
    name: 'Page Replacement Algorithms (FIFO, LRU, Optimal)',
    category: 'Operating Systems',
    route: '/operating-systems/page-replacement',
    keywords: ['page replacement', 'fifo page', 'lru page', 'optimal page', 'memory page fault'],
  },
  {
    id: 'os-disk-scheduling',
    name: 'Disk Head Scheduling (FCFS, SSTF, SCAN, C-SCAN, LOOK)',
    category: 'Operating Systems',
    route: '/operating-systems/disk-scheduling',
    keywords: ['disk scheduling', 'sstf', 'scan elevator', 'c scan', 'seek time'],
  },

  // --- Platform & Core Pages ---
  {
    id: 'concepts-page',
    name: 'Algorithm Concepts & Problem Solving Patterns',
    category: 'General',
    route: '/concepts',
    keywords: ['concepts', 'problem solving patterns', 'time complexity', 'big o'],
  },
  {
    id: 'practice-page',
    name: 'Interactive Algorithm Code Sandbox',
    category: 'General',
    route: '/practice',
    keywords: ['practice', 'code editor', 'monaco', 'sandbox', 'javascript python cpp java'],
  },
  {
    id: 'challenge-page',
    name: 'Guess the Algorithm Challenge (Game)',
    category: 'Games',
    route: '/challenge',
    keywords: ['challenge', 'guess algorithm', 'quiz', 'game', 'play'],
  },
  {
    id: 'favorites-page',
    name: 'Bookmarked Favorites',
    category: 'General',
    route: '/favorites',
    keywords: ['favorites', 'saved algorithms', 'bookmarks'],
  },
  {
    id: 'about-page',
    name: 'About AlgoScope',
    category: 'General',
    route: '/about',
    keywords: ['about', 'algoscope', 'platform overview'],
  },
]

const SearchBar = ({ onOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [isMac] = useState(() => {
    if (typeof window === 'undefined') return false
    const platform =
      navigator.userAgentData?.platform || navigator.platform || ''
    return (
      platform.toLowerCase().includes('mac') ||
      navigator.userAgent.toLowerCase().includes('macintosh')
    )
  })

  const inputRef = useRef(null)
  const triggerRef = useRef(null)
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  const navigate = useNavigate()

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(ALGORITHMS, {
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'keywords', weight: 0.3 },
        { name: 'category', weight: 0.2 },
      ],
      threshold: 0.4,
      distance: 100,
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 1,
    })
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setQuery(val)

    if (val.trim() === '') {
      setResults([])
      return
    }

    const searchResults = fuse.search(val)
    const sortedResults = [...searchResults].sort((a, b) => {
      if (sortBy === 'name') {
        return a.item.name.localeCompare(b.item.name)
      } else if (sortBy === 'category') {
        return a.item.category.localeCompare(b.item.category)
      }
      return (a.score || 0) - (b.score || 0)
    })

    setResults(sortedResults)
    setSelectedIndex(0)
  }

  const openModal = React.useCallback(() => {
    previousFocusRef.current = document.activeElement
    setIsModalOpen(true)
    onOpen?.()
  }, [onOpen])

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false)
    setQuery('')
    setResults([])

    window.setTimeout(() => {
      const previousFocus = previousFocusRef.current

      if (previousFocus && document.contains(previousFocus)) {
        previousFocus.focus()
      } else {
        triggerRef.current?.focus()
      }

      previousFocusRef.current = null
    }, 0)
  }, [])

  const handleSelect = React.useCallback(
    (route) => {
      navigate(route)
      handleCloseModal()
    },
    [handleCloseModal, navigate]
  )

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openModal()
      }

      if (!isModalOpen) return

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const focusable = Array.from(focusableElements ?? []).filter(
          (element) =>
            !element.disabled &&
            element.getAttribute('aria-hidden') !== 'true' &&
            element.offsetParent !== null
        )

        if (focusable.length === 0) {
          e.preventDefault()
          return
        }

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }

        return
      }

      // Modal Navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (results.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(
          (prev) => (prev - 1 + (results.length || 1)) % (results.length || 1)
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].item.route)
        }
      } else if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    handleCloseModal,
    handleSelect,
    isModalOpen,
    openModal,
    results,
    selectedIndex,
  ])

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  return (
    <>
      {/* Search Trigger Button */}
      <button
        ref={triggerRef}
        onClick={openModal}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 border border-white/10 hover:border-cyan-500/50 rounded-xl text-slate-400 hover:text-cyan-400 transition-all group w-full lg:w-48"
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        aria-label="Search algorithms"
      >
        <svg
          className="w-4 h-4 text-slate-400 transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="text-xs hidden lg:inline font-medium text-slate-500 group-hover:text-cyan-400/70">
          Search...
        </span>
        <div className="ml-auto hidden lg:flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <kbd className="text-[10px] font-sans">{isMac ? '⌘' : 'Ctrl'}</kbd>
          <kbd className="text-[10px] font-sans">K</kbd>
        </div>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-dialog-title"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="relative group p-4 border-b border-slate-800">
                <h2 id="search-dialog-title" className="sr-only">
                  Search algorithms
                </h2>
                <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  className="w-full bg-transparent text-slate-200 text-lg block pl-12 pr-24 py-2 outline-none"
                  placeholder="Search algorithms..."
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  {/* Sort Dropdown */}
                  {results.length > 0 && (
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value)
                        const searchResults = fuse.search(query)
                        const sortedResults = [...searchResults].sort(
                          (a, b) => {
                            if (e.target.value === 'name') {
                              return a.item.name.localeCompare(b.item.name)
                            } else if (e.target.value === 'category') {
                              return a.item.category.localeCompare(
                                b.item.category
                              )
                            }
                            return 0
                          }
                        )
                        setResults(sortedResults)
                      }}
                      className="bg-slate-800 border border-slate-600 text-slate-300 text-xs px-2 py-1 rounded-lg cursor-pointer outline-none"
                      aria-label="Sort results"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="name">Name</option>
                      <option value="category">Category</option>
                    </select>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                    aria-label="Close search"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <ul className="space-y-1">
                    {results.map((result, index) => (
                      <li
                        key={result.item.id}
                        onClick={() => handleSelect(result.item.route)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl transition-all ${
                          index === selectedIndex
                            ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-base font-medium">
                            {result.item.name}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-slate-500">
                            {result.item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {index === selectedIndex && (
                            <span className="text-[10px] text-slate-500 border border-slate-700 px-1 rounded bg-slate-800">
                              {isMac ? 'Return' : 'Enter'}
                            </span>
                          )}
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              index === selectedIndex
                                ? 'text-indigo-400 translate-x-1'
                                : 'text-slate-600'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : query ? (
                  <div className="p-8 text-center text-slate-500">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    Type to start searching...
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest bg-slate-950/20">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border border-slate-700 rounded bg-slate-800">
                      ↑↓
                    </kbd>{' '}
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border border-slate-700 rounded bg-slate-800">
                      {isMac ? 'Return' : 'Enter'}
                    </kbd>{' '}
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border border-slate-700 rounded bg-slate-800">
                    Esc
                  </kbd>{' '}
                  Close
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SearchBar
