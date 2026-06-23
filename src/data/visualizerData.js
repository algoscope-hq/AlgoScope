export const ALGORITHMS = [
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Visualizing Bubble, Merge, Quick, Heap, and Shell Sort.',
    color: 'theme-card border-blue-500/30 hover:border-blue-400',
    link: '/sort',
    difficulty: 'Beginner',
  },
  {
    id: 'searching',
    title: 'Searching',
    description: 'Explore BFS, DFS, and other traversal methods.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/search',
    difficulty: 'Beginner',
  },
  {
    id: 'graph-algorithms',
    title: 'Graph Algorithms',
    description: 'Dijkstra, Floyd-Warshall, and Topological Sort.',
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/spath',
    difficulty: 'Intermediate',
  },
  {
    id: 'array-search',
    title: 'Array Search',
    description: 'Linear and Binary search visualization.',
    color: 'theme-card border-orange-500/30 hover:border-orange-400',
    link: '/ldssearch',
    difficulty: 'Beginner',
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    description:
      'Visualize the Largest Rectangle in Histogram & Maximal Rectangle using a Monotonic Stack to track elements efficiently.',
    color: 'theme-card border-amber-500/30 hover:border-amber-400',
    link: '/monotonic-stack',
    difficulty: 'Advanced',
  },
  {
    id: 'abstract-data-types',
    title: 'Abstract Data Types',
    description:
      'Stacks, Queues, Binary Trees, Binary Heaps, Linked Lists and Priority Queues.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/adt',
    difficulty: 'Intermediate',
  },
  {
    id: 'kadane-algorithm',
    title: 'Kadane Algorithm',
    description: 'Visualize Maximum Subarray Sum using Kadane’s Algorithm.',
    color: 'theme-card border-pink-500/30 hover:border-pink-400',
    link: '/kadane',
    difficulty: 'Intermediate',
  },
  {
    id: 'moores-voting-algorithm',
    title: "Moore's Voting Algorithm",
    description:
      "Visualize the Moore's Voting Algorithm for finding the majority element.",
    color: 'theme-card border-green-500/30 hover:border-green-400',
    link: '/moore-voting',
    difficulty: 'Beginner',
  },
  {
    id: 'math-theory',
    title: 'Math Theory',
    description:
      'Visualize GCD, Fast Exponentiation, and Bit Manipulation step-by-step.',
    color: 'theme-card border-indigo-500/30 hover:border-indigo-400',
    link: '/math-theory',
    difficulty: 'Intermediate',
  },
  {
    id: 'string-algorithms',
    title: 'String Algorithms',
    description:
      'Visualize KMP, Rabin-Karp, Z-Algorithm, and pattern matching techniques step-by-step.',
    color: 'theme-card border-violet-500/30 hover:border-violet-400',
    link: '/string-algorithms',
    difficulty: 'Advanced',
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    description:
      'LCS, 0/1 Knapsack, Coin Change, and LIS — watch the DP table fill step by step.',
    path: '/dynamic-programming',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/dynamic-programming',
    difficulty: 'Intermediate',
  },
  {
    id: 'dp-optimization-journey',
    title: 'DP Optimization Journey',
    description:
      'Visualize the progression from Recursion to Space Optimization.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/dp-journey',
    difficulty: 'Advanced',
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    description:
      'N-Queens, Sudoku Solver, and Tower of Hanoi with step-by-step recursion.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/backtracking',
    difficulty: 'Advanced',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    description:
      'Visualize the sliding window algorithm use to optimally solve problems on substrings and subarrays.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/sliding-window',
    difficulty: 'Intermediate',
  },
  {
    id: 'two-pointer',
    title: 'Two Pointer Approach',
    description:
      'Place two pointers at opposite ends and converge them inward — at each step, move the pointer that can not improve the answer, eliminating half the remaining pairs in O(n) instead of checking all pairs in O(n²).',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/two-pointer',
    difficulty: 'Intermediate',
  },
]

export const OPERATING_SYSTEMS = [
  {
    id: 'cpu-scheduling',
    title: 'CPU Scheduling',
    description: 'Visualize FCFS, SJF, Round Robin, and Priority Scheduling.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/operating-systems/cpu-scheduling',
    difficulty: 'Beginner',
  },
  {
    id: 'page-replacement',
    title: 'Page Replacement',
    description: 'Explore FIFO, LRU, and Optimal page replacement algorithms.',
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/operating-systems/page-replacement',
    difficulty: 'Intermediate',
  },
  {
    id: 'disk-scheduling',
    title: 'Disk Scheduling',
    description:
      'Understand SCAN, C-SCAN, SSTF and disk head movement strategies.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/operating-systems/disk-scheduling',
    difficulty: 'Intermediate',
  },
]

export const VISUALIZER_COUNT = ALGORITHMS.length + OPERATING_SYSTEMS.length + 1 // +1 for the "Guess the Algorithm" challenge card
