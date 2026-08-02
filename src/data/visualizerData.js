export const ALGORITHMS = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description:
      'Visualize Bubble, Selection, Insertion, Quick, Merge, Heap, Counting, Radix, and Shell Sort with real-time comparison mode.',
    color: 'theme-card border-blue-500/30 hover:border-blue-400',
    link: '/sort',
    difficulty: 'Beginner',
  },
  {
    id: 'searching',
    title: 'Graph Search & Traversal',
    description:
      'Explore Breadth-First Search (BFS) and Depth-First Search (DFS) with level-order queue and call-stack animations.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/search',
    difficulty: 'Beginner',
  },
  {
    id: 'graph-algorithms',
    title: 'Shortest Path & MST',
    description:
      "Dijkstra's, Bellman-Ford, Floyd-Warshall, A* Search, Prim's MST, and Kruskal's MST algorithms.",
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/spath',
    difficulty: 'Intermediate',
  },
  {
    id: 'array-search',
    title: 'Array Search',
    description:
      'Linear Search, Binary Search, and step-by-step array index search comparison.',
    color: 'theme-card border-orange-500/30 hover:border-orange-400',
    link: '/ldssearch',
    difficulty: 'Beginner',
  },
  {
    id: 'abstract-data-types',
    title: 'Abstract Data Types',
    description:
      'Stacks, Queues, Binary Trees, Binary Heaps, Priority Queues, Disjoint Set Union (DSU), Linked Lists, and Graph Builder.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/adt',
    difficulty: 'Intermediate',
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description:
      'Longest Common Subsequence (LCS), 0/1 Knapsack, Coin Change, and Longest Increasing Subsequence (LIS) DP tables.',
    path: '/dynamic-programming',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/dynamic-programming',
    difficulty: 'Intermediate',
  },
  {
    id: 'dp-optimization-journey',
    title: 'DP Optimization Journey',
    description:
      'Trace evolution from Brute Force Recursion to Memoization, Tabulation, and Space Optimization O(1).',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/dp-journey',
    difficulty: 'Advanced',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window Pattern',
    description:
      'Max Sum Subarray of Size K, Longest Unique Substring, Minimum Size Subarray Sum, and Max Vowels in Substring.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/sliding-window',
    difficulty: 'Intermediate',
  },
  {
    id: 'two-pointer',
    title: 'Two Pointer Approach',
    description:
      'Two Sum (Sorted Array), Container With Most Water, Valid Palindrome, and Trapping Rain Water.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/two-pointer',
    difficulty: 'Intermediate',
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    description:
      'Largest Rectangle in Histogram, Next Greater Element, Daily Temperatures, and Maximal Rectangle in Binary Matrix.',
    color: 'theme-card border-amber-500/30 hover:border-amber-400',
    link: '/monotonic-stack',
    difficulty: 'Advanced',
  },
  {
    id: 'backtracking',
    title: 'Backtracking Algorithms',
    description:
      'N-Queens, Sudoku Solver, Maze Pathfinding, Knight’s Tour, Graph K-Coloring, and Tower of Hanoi.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/backtracking',
    difficulty: 'Advanced',
  },
  {
    id: 'string-algorithms',
    title: 'String Algorithms',
    description:
      'KMP (Knuth-Morris-Pratt), Rabin-Karp Rolling Hash, and Z-Algorithm pattern matching.',
    color: 'theme-card border-violet-500/30 hover:border-violet-400',
    link: '/string-algorithms',
    difficulty: 'Advanced',
  },
  {
    id: 'math-theory',
    title: 'Math & Complexity Theory',
    description:
      'Euclidean GCD, Fast Exponentiation, Sieve of Eratosthenes, Fibonacci & Golden Ratio, FFT, and Bitwise Operations.',
    color: 'theme-card border-indigo-500/30 hover:border-indigo-400',
    link: '/math-theory',
    difficulty: 'Intermediate',
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    description:
      'Huffman Coding, Fractional Knapsack, and Job Sequencing with Deadlines.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/greedy',
    difficulty: 'Intermediate',
  },
  {
    id: 'kadane-algorithm',
    title: "Kadane's Algorithm",
    description: 'Maximum Subarray Sum visualization with O(n) dynamic state tracking.',
    color: 'theme-card border-pink-500/30 hover:border-pink-400',
    link: '/kadane',
    difficulty: 'Intermediate',
  },
  {
    id: 'moores-voting-algorithm',
    title: "Moore's Voting Algorithm",
    description:
      'Majority Element identification algorithm step-by-step with candidate count tracking.',
    color: 'theme-card border-green-500/30 hover:border-green-400',
    link: '/moore-voting',
    difficulty: 'Beginner',
  },
]

export const OPERATING_SYSTEMS = [
  {
    id: 'cpu-scheduling',
    title: 'CPU Scheduling',
    description:
      'FCFS, Shortest Job First (SJF), Shortest Remaining Time First (SRTF), Priority, Round Robin (RR), and Multilevel Queue scheduling.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/operating-systems/cpu-scheduling',
    difficulty: 'Beginner',
  },
  {
    id: 'page-replacement',
    title: 'Page Replacement',
    description:
      'FIFO, Least Recently Used (LRU), and Optimal page replacement memory management policies with frame tables.',
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/operating-systems/page-replacement',
    difficulty: 'Intermediate',
  },
  {
    id: 'disk-scheduling',
    title: 'Disk Scheduling',
    description:
      'FCFS, SSTF, SCAN (Elevator), C-SCAN, and LOOK disk head movement strategies with seek counts.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/operating-systems/disk-scheduling',
    difficulty: 'Intermediate',
  },
]

export const VISUALIZER_COUNT = ALGORITHMS.length + OPERATING_SYSTEMS.length + 1 // +1 for the "Guess the Algorithm" challenge card
