// Comprehensive Question Bank for AlgoScope Challenge Mode

export const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: '⚡' },
  { id: 'sorting', label: 'Sorting', icon: '🔀' },
  { id: 'graph', label: 'Graph & Trees', icon: '🌐' },
  { id: 'ds', label: 'Data Structures', icon: '📦' },
  { id: 'search', label: 'Search & Bitwise', icon: '🔍' },
  { id: 'dp', label: 'Dynamic Programming', icon: '🧩' },
  { id: 'patterns', label: 'Patterns & Pointers', icon: '🎯' },
  { id: 'os', label: 'Systems & OS', icon: '💻' },
  { id: 'string', label: 'String Algorithms', icon: '🔤' },
  { id: 'theory', label: 'Complexity Theory', icon: '📊' },
]

export const DIFFICULTIES = [
  { id: 'all', label: 'All Levels' },
  {
    id: 'easy',
    label: 'Easy',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'medium',
    label: 'Medium',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'hard',
    label: 'Hard',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
]

export const QUESTION_BANK = [
  // ── Sorting ─────────────────────────────────────────────────────────────
  {
    id: 'stable-sort',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'easy',
    question: 'Which sorting algorithm is stable by default?',
    options: ['Selection Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort'],
    correctIndex: 2,
    explanation:
      'Merge Sort preserves the relative order of equal elements (stable).',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'quick-worst',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'medium',
    question: "Quick Sort's worst-case time complexity is…",
    options: ['O(n log n)', 'O(n²)', 'O(log n)', 'O(n)'],
    correctIndex: 1,
    explanation:
      'Worst case occurs with bad pivots repeatedly (e.g., sorted array with last element pivot) → O(n²).',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'merge-extra-space',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'easy',
    question: 'Merge Sort typically needs…',
    options: [
      'O(1) extra space',
      'O(log n) extra space',
      'O(n) extra space',
      'No extra space',
    ],
    correctIndex: 2,
    explanation:
      'Standard merge step requires auxiliary arrays to combine sorted halves → O(n) space.',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'insertion-best',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'easy',
    question: "Insertion Sort's best-case time complexity is…",
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'When the input array is already sorted, Insertion Sort makes only n-1 comparisons → O(n).',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'heap-sort-space',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'easy',
    question: 'Heap Sort has an auxiliary space complexity of…',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctIndex: 3,
    explanation:
      'Heap Sort sorts in-place using the binary heap built directly inside the input array.',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'counting-sort-limit',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'medium',
    question: 'Counting Sort is NOT suitable when…',
    options: [
      'Range of input values (k) is huge',
      'Input consists of integers',
      'Array size is small',
      'Values repeat frequently',
    ],
    correctIndex: 0,
    explanation:
      'Counting Sort requires O(k) extra space. If k is much larger than n (e.g. k=10^9), memory usage becomes prohibitive.',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'quick-avg',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'easy',
    question: "Quick Sort's average-case time complexity is…",
    options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(log n)'],
    correctIndex: 2,
    explanation:
      'With randomized or median-of-three pivot selection, Quick Sort runs in O(n log n) average time.',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'bubble-sort-stable',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'easy',
    question: 'Is standard Bubble Sort stable?',
    options: [
      'Yes, always',
      'No',
      'Only on sorted input',
      'Depends on pivot choice',
    ],
    correctIndex: 0,
    explanation:
      'Bubble Sort only swaps adjacent elements when strictly out of order (a > b), preserving relative order of equal items.',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'timsort-hybrid',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'hard',
    question:
      'TimSort (used in Python and Java Array.sort) is a hybrid of which two algorithms?',
    options: [
      'Quick Sort & Heap Sort',
      'Insertion Sort & Merge Sort',
      'Selection Sort & Bubble Sort',
      'Counting Sort & Radix Sort',
    ],
    correctIndex: 1,
    explanation:
      'TimSort splits array into small "runs", sorts them with Insertion Sort, and merges runs using an optimized Merge Sort.',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },
  {
    id: 'radix-sort-complexity',
    category: 'sorting',
    categoryLabel: 'Sorting',
    difficulty: 'medium',
    question: 'Radix Sort with d digits and base b runs in time…',
    options: ['O(d · (n + b))', 'O(n²)', 'O(n log n)', 'O(d · n log b)'],
    correctIndex: 0,
    explanation:
      'Radix Sort processes d digits using a stable bucket/counting sort of base b in O(d · (n + b)).',
    visualizerLink: '/sort',
    visualizerName: 'Sorting Visualizer',
  },

  // ── Graph & Trees ────────────────────────────────────────────────────────
  {
    id: 'bfs-structure',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'easy',
    question: 'Breadth-First Search (BFS) uses which data structure?',
    options: ['Stack', 'Set', 'Priority Queue', 'Queue'],
    correctIndex: 3,
    explanation:
      'BFS explores graph level-by-level in FIFO order using a Queue.',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'dfs-structure',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'easy',
    question:
      'Depth-First Search (DFS) relies on which data structure mechanism?',
    options: ['Queue', 'Stack (or recursion call stack)', 'Heap', 'Hash Map'],
    correctIndex: 1,
    explanation:
      'DFS traverses deep into adjacent nodes before backtracking using a Stack (or recursion).',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'dijkstra-negative',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'medium',
    question:
      "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
    options: [
      'Greedy relaxation assumption breaks when a shorter path appears later',
      'It cannot process directed graphs',
      'It requires an adjacency matrix',
      'It causes stack overflow in recursion',
    ],
    correctIndex: 0,
    explanation:
      "Dijkstra assumes a node's distance is finalized once popped from priority queue—negative edges break this greedy guarantee.",
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'bellman-ford',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'medium',
    question:
      'Bellman–Ford algorithm can handle negative weights and can detect…',
    options: [
      'Negative weight cycles reachable from the source',
      'Only positive cycles',
      'Disconnected components only',
      'Bipartite graphs',
    ],
    correctIndex: 0,
    explanation:
      'After V−1 iterations of relaxing all edges, if an edge can still be relaxed, a negative cycle exists.',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'floyd-warshall',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'medium',
    question: 'Floyd–Warshall algorithm solves which graph problem?',
    options: [
      'Single-source shortest path',
      'All-pairs shortest paths',
      'Minimum spanning tree',
      'Topological ordering',
    ],
    correctIndex: 1,
    explanation:
      'Floyd–Warshall uses dynamic programming to find shortest paths between all pairs of vertices in O(V³).',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'topo-sort-dag',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'easy',
    question: 'Topological sorting is valid ONLY for which graph type?',
    options: [
      'Undirected graph',
      'Directed Acyclic Graph (DAG)',
      'Cyclic graph',
      'Complete graph',
    ],
    correctIndex: 1,
    explanation:
      'Topological sorting orders vertices linearly such that u precedes v for directed edge (u, v)—impossible if cycles exist.',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'kruskal-ds',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'medium',
    question:
      "Kruskal's MST algorithm efficiently checks for cycle formation using…",
    options: [
      'Priority Queue only',
      'Disjoint Set Union (DSU / Union-Find)',
      'DFS traversal',
      'Adjacency Matrix',
    ],
    correctIndex: 1,
    explanation:
      "Kruskal's greedily sorts edges by weight and uses DSU to check if adding an edge connects two already-connected components.",
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'prim-greedy',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'medium',
    question: "Prim's MST algorithm grows a single tree by greedily adding…",
    options: [
      'The minimum-weight edge connecting the tree to a non-tree vertex',
      'The overall globally smallest edge anywhere',
      'Edges with maximum weight',
      'The edge with fewest connections',
    ],
    correctIndex: 0,
    explanation:
      "Prim's maintains a growing component and uses a Min-Heap to extract the cheapest edge spanning from the MST to an outside vertex.",
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'graph-bfs-unweighted',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'easy',
    question: 'BFS guarantees finding the shortest path in terms of…',
    options: [
      'Sum of edge weights',
      'DFS depth',
      'Number of edges (hops)',
      'Vertex degree',
    ],
    correctIndex: 2,
    explanation:
      'In unweighted graphs (or equal edge weights), BFS explores by number of hops, ensuring minimum edge count path first.',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'kosaraju-scc',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'hard',
    question:
      "Kosaraju's algorithm computes Strongly Connected Components (SCCs) using…",
    options: [
      'Two DFS passes (one on original graph, one on transposed graph)',
      'Dijkstra + BFS',
      'Bellman-Ford relaxation',
      'Kruskal + Prim',
    ],
    correctIndex: 0,
    explanation:
      "Kosaraju's pushes nodes to stack by DFS finish time, transposes graph edges, and pops stack to run DFS on reversed graph.",
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'inorder-traversal-bst',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'easy',
    question:
      'An In-Order traversal of a Binary Search Tree (BST) visits nodes in…',
    options: [
      'Random order',
      'Sorted ascending order',
      'Reverse level order',
      'Post-order precedence',
    ],
    correctIndex: 1,
    explanation:
      'In-order traversal visits Left -> Root -> Right, producing keys in strictly sorted order for a BST.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'eulerian-path-degree',
    category: 'graph',
    categoryLabel: 'Graph & Trees',
    difficulty: 'hard',
    question:
      'A connected undirected graph has an Eulerian Path if and only if…',
    options: [
      'Exactly 0 or 2 vertices have odd degree',
      'All vertices have odd degree',
      'It is a tree with n-1 edges',
      'The graph is bipartite',
    ],
    correctIndex: 0,
    explanation:
      'An Eulerian Path visits every edge once. Vertices entered must be exited, so odd degree vertices can only be start or end.',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },

  // ── Data Structures ──────────────────────────────────────────────────────
  {
    id: 'heap-property-max',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'easy',
    question: 'In a Max-Heap, every parent node key is…',
    options: [
      'Smaller than or equal to children',
      'Greater than or equal to children',
      'Equal to median',
      'Minimum element in tree',
    ],
    correctIndex: 1,
    explanation:
      'Max-Heap invariant enforces Parent ≥ Children at every node. Root holds the maximum element.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'stack-lifo',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'easy',
    question: 'A Stack follows which access principle?',
    options: [
      'FIFO (First-In First-Out)',
      'LIFO (Last-In First-Out)',
      'Priority Order',
      'Random Access',
    ],
    correctIndex: 1,
    explanation: 'Stack is LIFO: elements pushed last are popped first.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'queue-fifo',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'easy',
    question: 'A Queue follows which access principle?',
    options: [
      'LIFO (Last-In First-Out)',
      'Priority Order',
      'FIFO (First-In First-Out)',
      'Random Access',
    ],
    correctIndex: 2,
    explanation: 'Queue is FIFO: elements enqueued first are dequeued first.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'hash-collision',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'easy',
    question: 'A hash collision in a Hash Table occurs when…',
    options: [
      'Two distinct keys hash to the same table index',
      'Two keys have identical values',
      'The table array is full',
      'A key is deleted',
    ],
    correctIndex: 0,
    explanation:
      'Collisions occur when hash(key1) == hash(key2) for key1 != key2.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'bst-search-worst',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'medium',
    question:
      'Searching in an un-balanced Binary Search Tree (BST) has a worst-case time complexity of…',
    options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation:
      'A skewed BST degenerates into a linked list where depth is n → O(n) search time.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'linked-list-access',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'easy',
    question: 'Accessing the k-th element in a Singly Linked List takes…',
    options: ['O(1)', 'O(log n)', 'O(k)', 'O(n²)'],
    correctIndex: 2,
    explanation:
      'Since linked lists lack random access, you must traverse k pointers starting from head → O(k).',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'deque-ops',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'easy',
    question:
      'A Deque (Double-Ended Queue) allows O(1) insertion and deletion at…',
    options: [
      'The front only',
      'Both the front and the back',
      'The middle only',
      'Any arbitrary index',
    ],
    correctIndex: 1,
    explanation:
      'Deques support push_front, pop_front, push_back, and pop_back all in O(1) time.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'trie-usecase',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'medium',
    question: 'Trie (Prefix Tree) data structure is most effective for…',
    options: [
      'Fast prefix-based string searching and autocomplete',
      'Sorting floating point numbers',
      'Finding minimum spanning trees',
      'Heap operations',
    ],
    correctIndex: 0,
    explanation:
      'Tries store character sequences along tree edges, enabling O(L) prefix search where L is string length.',
    visualizerLink: '/string-algorithms',
    visualizerName: 'String Algorithms Visualizer',
  },
  {
    id: 'avl-balance-factor',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'medium',
    question:
      'An AVL Tree maintains balance by ensuring the height difference (balance factor) between subtrees is at most…',
    options: ['0', '1', '2', 'log n'],
    correctIndex: 1,
    explanation:
      'AVL invariant requires |height(left) - height(right)| ≤ 1 for every node. Rotations restore balance upon insertion/deletion.',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'dsu-time-complexity',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'hard',
    question:
      'With path compression and union by rank, DSU operations run in amortized time per operation of…',
    options: [
      'O(1)',
      'O(α(n)) where α is Inverse Ackermann function',
      'O(log n)',
      'O(n)',
    ],
    correctIndex: 1,
    explanation:
      'Inverse Ackermann function α(n) grows so slowly that α(n) ≤ 4 for any practical universe size n.',
    visualizerLink: '/graph',
    visualizerName: 'Graph Visualizer',
  },
  {
    id: 'segment-tree-query',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'hard',
    question:
      'A Segment Tree allows point updates and range queries (e.g. range sum/min) in time…',
    options: [
      'O(1) update, O(n) query',
      'O(log n) for both update and query',
      'O(n) for both',
      'O(n log n) query',
    ],
    correctIndex: 1,
    explanation:
      'A Segment Tree breaks down array intervals into logarithmic sub-trees, answering queries and updates in O(log n).',
    visualizerLink: '/adt',
    visualizerName: 'Data Structures Visualizer',
  },
  {
    id: 'monotonic-stack-purpose',
    category: 'ds',
    categoryLabel: 'Data Structures',
    difficulty: 'medium',
    question: 'A Monotonic Stack is primarily used to find…',
    options: [
      'Next Greater or Next Smaller element in O(n) total time',
      'Shortest paths in weighted graphs',
      'Sorted order of string keys',
      'Median of dynamic stream',
    ],
    correctIndex: 0,
    explanation:
      'By keeping elements in monotonic increasing/decreasing order, every element is pushed and popped at most once → O(n).',
    visualizerLink: '/monotonic-stack',
    visualizerName: 'Monotonic Stack Visualizer',
  },

  // ── Search & Bitwise ──────────────────────────────────────────────────────
  {
    id: 'binary-search-requirement',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'easy',
    question: 'Binary Search requires the target array to be…',
    options: [
      'Sorted',
      'Unique',
      'Containing only positive integers',
      'Even length',
    ],
    correctIndex: 0,
    explanation:
      'Binary Search compares target with middle element and discards half the array, which depends on sorted order.',
    visualizerLink: '/ldssearch',
    visualizerName: 'Array & Search Visualizer',
  },
  {
    id: 'binary-search-complexity',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'easy',
    question: 'Binary Search time complexity is…',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'Each comparison halves the search space → O(log n) iterations.',
    visualizerLink: '/ldssearch',
    visualizerName: 'Array & Search Visualizer',
  },
  {
    id: 'kernighan-bit-count',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'hard',
    codeSnippet: `// What does this expression do?
n & (n - 1)`,
    codeLanguage: 'javascript',
    question: 'What is the effect of executing `n & (n - 1)` on integer n?',
    options: [
      'Clears the lowest set bit (rightmost 1-bit)',
      'Sets all bits to 1',
      'Multiplies n by 2',
      'Inverts all bits of n',
    ],
    correctIndex: 0,
    explanation:
      'Subtracting 1 flips all bits after and including the rightmost 1-bit. Bitwise ANDing with n clears that rightmost 1-bit.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'power-of-two-bit',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'medium',
    codeSnippet: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
    codeLanguage: 'javascript',
    question:
      'The code above checks if n is a power of 2 because powers of 2 have…',
    options: [
      'Exactly one set bit in binary',
      'All bits set to 1',
      'An even number of set bits',
      'Zero set bits',
    ],
    correctIndex: 0,
    explanation:
      'Powers of 2 (1, 2, 4, 8...) in binary have exactly one 1-bit. Clearing it with n & (n - 1) results in 0.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'xor-single-number',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'medium',
    question:
      'In an array where every element appears twice except one, how do you find the single element in O(n) time and O(1) space?',
    options: [
      'XOR all elements together',
      'Sum all elements and divide by 2',
      'Sort and check adjacent pairs',
      'Use a Hash Set',
    ],
    correctIndex: 0,
    explanation:
      'XOR properties x ^ x = 0 and x ^ 0 = x cause paired numbers to cancel out, leaving only the single unique number.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'overflow-mid-calc',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'medium',
    codeSnippet: `// Option A: mid = (low + high) / 2
// Option B: mid = low + Math.floor((high - low) / 2)`,
    codeLanguage: 'javascript',
    question:
      'Why is Option B preferred over Option A when computing binary search mid index?',
    options: [
      'Option A can cause integer overflow when (low + high) exceeds maximum integer bound',
      'Option B runs in O(1) while Option A runs in O(n)',
      'Option A gives incorrect fractional values in JavaScript',
      'Option B handles negative search keys',
    ],
    correctIndex: 0,
    explanation:
      'In languages with bounded integers (C++/Java), low + high can overflow 32-bit signed integer max (2^31-1). low + (high-low)/2 prevents overflow.',
    visualizerLink: '/ldssearch',
    visualizerName: 'Array & Search Visualizer',
  },
  {
    id: 'ternary-search-func',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'hard',
    question:
      'Ternary Search is applicable to find the peak / minimum of a function that is…',
    options: [
      'Unimodal (strictly increasing then strictly decreasing, or vice versa)',
      'Monotonic increasing only',
      'Periodic with frequency 2',
      'Discontinuous',
    ],
    correctIndex: 0,
    explanation:
      'Ternary search divides domain into 3 parts to evaluate two midpoints m1 and m2, discarding 1/3 of space each step for unimodal functions.',
    visualizerLink: '/ldssearch',
    visualizerName: 'Array & Search Visualizer',
  },
  {
    id: 'bit-shift-multiply',
    category: 'search',
    categoryLabel: 'Search & Bitwise',
    difficulty: 'easy',
    question:
      'Executing `x << k` (left bitwise shift by k) is equivalent to multiplying x by…',
    options: ['2^k', 'k²', '2k', '10^k'],
    correctIndex: 0,
    explanation:
      'Shifting binary digits to the left by k positions multiplies integer value by 2^k.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },

  // ── Complexity Theory ────────────────────────────────────────────────────
  {
    id: 'big-o-def',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'easy',
    question: 'Big-O notation describes…',
    options: [
      'Asymptotic upper bound on algorithm growth rate',
      'Exact execution runtime in milliseconds',
      'Asymptotic lower bound only',
      'Memory capacity in bytes',
    ],
    correctIndex: 0,
    explanation:
      'Big-O gives an asymptotic upper bound: f(n) = O(g(n)) means f(n) <= c * g(n) for large n.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'big-omega-def',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'easy',
    question: 'Big-Ω (Omega) notation represents…',
    options: [
      'Asymptotic lower bound',
      'Tight asymptotic bound',
      'Upper bound limit',
      'Average case execution',
    ],
    correctIndex: 0,
    explanation:
      'Big-Ω specifies the asymptotic lower bound—best-case growth rate lower bound.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'big-theta-def',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'medium',
    question: 'Big-Θ (Theta) notation means an algorithm has…',
    options: [
      'Tight asymptotic bound (both upper and lower bound match)',
      'No upper bound',
      'Exponential memory complexity',
      'Amortized cost O(1)',
    ],
    correctIndex: 0,
    explanation:
      'f(n) = Θ(g(n)) means f(n) is bounded both above and below by g(n) up to constant factors.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'master-theorem-use',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'medium',
    question:
      'Master Theorem provides asymptotic solutions for divide-and-conquer recurrences of the form…',
    options: [
      'T(n) = a · T(n/b) + f(n)',
      'T(n) = T(n-1) + T(n-2)',
      'T(n) = T(n-1) + O(1)',
      'T(n) = n · T(n-1)',
    ],
    correctIndex: 0,
    explanation:
      'Master Theorem analyzes recurrences splitting problem of size n into a subproblems of size n/b with f(n) combination work.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'np-complete-def',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'hard',
    question: 'A decision problem is NP-Complete if…',
    options: [
      'It is in NP and every problem in NP can be reduced to it in polynomial time',
      'It has no known solution whatsoever',
      'It can be solved in O(n log n) deterministic time',
      'It requires infinite memory',
    ],
    correctIndex: 0,
    explanation:
      'NP-Complete problems are the hardest problems in NP; finding a polynomial time algorithm for one would solve all problems in NP.',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'amortized-analysis-meaning',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'medium',
    question: 'Amortized time complexity calculates…',
    options: [
      'The average cost per operation over a worst-case sequence of operations',
      'The best-case runtime of a single isolated call',
      'Hardware clock cycles',
      'Memory leaks per execution',
    ],
    correctIndex: 0,
    explanation:
      'Amortization guarantees average performance per operation over a sequence, even if an occasional single operation is expensive (e.g. dynamic array resizing).',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },
  {
    id: 'nested-loop-complexity',
    category: 'theory',
    categoryLabel: 'Complexity Theory',
    difficulty: 'easy',
    codeSnippet: `for (let i = 0; i < n; i++) {
  for (let j = i; j < n; j++) {
    // O(1) operation
  }
}`,
    codeLanguage: 'javascript',
    question: 'What is the time complexity of the nested loops shown above?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(2^n)'],
    correctIndex: 0,
    explanation:
      'The inner loop runs n + (n-1) + (n-2) + ... + 1 times = n(n+1)/2 total operations → O(n²).',
    visualizerLink: '/concepts',
    visualizerName: 'Concepts Overview',
  },

  // ── Dynamic Programming ──────────────────────────────────────────────────
  {
    id: 'dp-prerequisites',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'easy',
    question: 'Dynamic Programming is applicable when a problem exhibits…',
    options: [
      'Overlapping subproblems & Optimal substructure',
      'Independent subproblems only',
      'Unbounded greedy choices',
      'Random search space',
    ],
    correctIndex: 0,
    explanation:
      'Optimal substructure allows building global optimum from subproblem optima; overlapping subproblems allow memoizing repeated work.',
    visualizerLink: '/dynamic-programming',
    visualizerName: 'Dynamic Programming Visualizer',
  },
  {
    id: 'memoization-def',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'easy',
    question: 'Memoization is…',
    options: [
      'Top-down recursive approach with lookup caching',
      'Bottom-up iterative table construction',
      'Greedy choice property',
      'Divide and conquer without state saving',
    ],
    correctIndex: 0,
    explanation:
      'Memoization keeps standard recursive call structure while caching returned subproblem solutions in a hash map or table.',
    visualizerLink: '/dynamic-programming',
    visualizerName: 'Dynamic Programming Visualizer',
  },
  {
    id: 'knapsack-01-complexity',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'medium',
    question:
      '0/1 Knapsack with n items and capacity W has dynamic programming time complexity…',
    options: ['O(n · W)', 'O(2^n)', 'O(n + W)', 'O(W²)'],
    correctIndex: 0,
    explanation:
      'Fills a 2D table dp[n+1][W+1] in O(n · W) pseudo-polynomial time.',
    visualizerLink: '/dynamic-programming',
    visualizerName: 'Dynamic Programming Visualizer',
  },
  {
    id: 'lcs-complexity',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'medium',
    question:
      'Longest Common Subsequence (LCS) of strings of length m and n runs in DP time…',
    options: ['O(m · n)', 'O(m + n)', 'O(2^(m+n))', 'O(m²)'],
    correctIndex: 0,
    explanation:
      'Table state dp[i][j] compares chars A[i-1] and B[j-1], requiring O(m · n) cells.',
    visualizerLink: '/dp-journey',
    visualizerName: 'DP Optimization Journey',
  },
  {
    id: 'lis-binary-search-opt',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'hard',
    question:
      'The Longest Increasing Subsequence (LIS) can be optimized from O(n²) to O(n log n) using DP combined with…',
    options: [
      'Binary Search (Patience Sorting tails array)',
      'Depth-First Search',
      'Disjoint Set Union',
      'Radix Sort',
    ],
    correctIndex: 0,
    explanation:
      'Maintaining a tails array of minimum tail values for increasing subsequences of length k allows binary searching insertion index in O(log n) per element.',
    visualizerLink: '/dp-journey',
    visualizerName: 'DP Optimization Journey',
  },
  {
    id: 'matrix-chain-mult-complexity',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'hard',
    question:
      'Matrix Chain Multiplication DP state dp[i][j] finds optimal parenthesization in time…',
    options: ['O(n³)', 'O(n²)', 'O(2^n)', 'O(n log n)'],
    correctIndex: 0,
    explanation:
      'For each chain length length 2..n and start index i, evaluating split point k takes O(n) loop → O(n³) total.',
    visualizerLink: '/dynamic-programming',
    visualizerName: 'Dynamic Programming Visualizer',
  },
  {
    id: 'knapsack-space-optimization',
    category: 'dp',
    categoryLabel: 'Dynamic Programming',
    difficulty: 'medium',
    question:
      'When optimizing 0/1 Knapsack space from 2D O(n·W) to 1D O(W) array, capacity w must be iterated in which direction?',
    options: [
      'Right to Left (W down to weight[i])',
      'Left to Right (0 up to W)',
      'Random order',
      'Bitwise shift order',
    ],
    correctIndex: 0,
    explanation:
      'Iterating right-to-left ensures values accessed dp[w - weight[i]] belong to the previous item row, preventing reusing the same item multiple times.',
    visualizerLink: '/dp-journey',
    visualizerName: 'DP Optimization Journey',
  },

  // ── Patterns & Two Pointers ──────────────────────────────────────────────
  {
    id: 'two-pointer-two-sum-sorted',
    category: 'patterns',
    categoryLabel: 'Patterns & Pointers',
    difficulty: 'easy',
    question:
      'Two Pointers technique on a sorted array to find a target sum pair runs in…',
    options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'],
    correctIndex: 0,
    explanation:
      'Pointers start at start (0) and end (n-1), moving inward based on sum comparison → O(n) total pointer moves.',
    visualizerLink: '/two-pointer',
    visualizerName: 'Two Pointer Visualizer',
  },
  {
    id: 'sliding-window-usecase',
    category: 'patterns',
    categoryLabel: 'Patterns & Pointers',
    difficulty: 'easy',
    question: 'Sliding Window pattern is best suited for problems seeking…',
    options: [
      'Optimal contiguous subarray or substring matching a condition',
      'Shortest path in weighted graph',
      'Topological ordering of nodes',
      'Minimum spanning tree edges',
    ],
    correctIndex: 0,
    explanation:
      'Sliding window expands right boundary and contracts left boundary to evaluate subsegments in O(n) total time.',
    visualizerLink: '/sliding-window',
    visualizerName: 'Sliding Window Visualizer',
  },
  {
    id: 'prefix-sum-range-query',
    category: 'patterns',
    categoryLabel: 'Patterns & Pointers',
    difficulty: 'easy',
    question:
      'A Prefix Sum array allows answering range sum queries sum(L, R) in…',
    options: [
      'O(1) time after O(n) preprocessing',
      'O(n) time per query',
      'O(log n) time per query',
      'O(R - L) time',
    ],
    correctIndex: 0,
    explanation:
      'prefix[R] - prefix[L-1] computes range sum instantly in O(1).',
    visualizerLink: '/sliding-window',
    visualizerName: 'Sliding Window Visualizer',
  },
  {
    id: 'kadane-max-subarray',
    category: 'patterns',
    categoryLabel: 'Patterns & Pointers',
    difficulty: 'medium',
    question: "Kadane's Algorithm computes the Maximum Subarray Sum in…",
    options: [
      'O(n) time and O(1) space',
      'O(n²) time',
      'O(n log n) time',
      'O(n) space',
    ],
    correctIndex: 0,
    explanation:
      "Kadane's maintains current_max = max(num, current_max + num) while tracking global maximum in a single O(n) pass.",
    visualizerLink: '/kadane',
    visualizerName: 'Kadane Visualizer',
  },
  {
    id: 'floyd-cycle-detection',
    category: 'patterns',
    categoryLabel: 'Patterns & Pointers',
    difficulty: 'medium',
    question:
      "Floyd's Cycle Finding Algorithm (Tortoise and Hare) detects cycles in a Linked List using…",
    options: [
      'Two pointers moving at 1 step and 2 steps per iteration',
      'A Hash Set storing visited nodes',
      'Reversing the linked list',
      'DFS recursion stack',
    ],
    correctIndex: 0,
    explanation:
      'Slow moves 1 step, Fast moves 2 steps. If a cycle exists, Fast will catch up to Slow inside the cycle in O(n) time and O(1) space.',
    visualizerLink: '/two-pointer',
    visualizerName: 'Two Pointer Visualizer',
  },
  {
    id: 'dutch-national-flag-sort',
    category: 'patterns',
    categoryLabel: 'Patterns & Pointers',
    difficulty: 'hard',
    question:
      'Dutch National Flag algorithm sorts an array of 0s, 1s, and 2s in single pass using…',
    options: [
      'Three pointers (low, mid, high) in O(n) time & O(1) space',
      'Counting sort with auxiliary array',
      'QuickSort partitioning',
      'Heap Sort',
    ],
    correctIndex: 0,
    explanation:
      'low tracks 0s boundary, high tracks 2s boundary, mid scans through array swapping elements to appropriate regions.',
    visualizerLink: '/two-pointer',
    visualizerName: 'Two Pointer Visualizer',
  },

  // ── Systems & OS ────────────────────────────────────────────────────────
  {
    id: 'srtf-preemptive',
    category: 'os',
    categoryLabel: 'Systems & OS',
    difficulty: 'medium',
    question:
      'Shortest Remaining Time First (SRTF) CPU scheduling is the preemptive version of…',
    options: [
      'Shortest Job First (SJF)',
      'First-Come First-Served (FCFS)',
      'Round Robin (RR)',
      'Priority Scheduling',
    ],
    correctIndex: 0,
    explanation:
      'SRTF preempts running process if a newly arrived process has a shorter remaining CPU burst time than current process.',
    visualizerLink: '/cpu-scheduling',
    visualizerName: 'CPU Scheduling OS Visualizer',
  },
  {
    id: 'round-robin-quantum',
    category: 'os',
    categoryLabel: 'Systems & OS',
    difficulty: 'easy',
    question:
      'Round Robin (RR) CPU scheduling allocates CPU execution time to processes in cyclic order based on…',
    options: [
      'Time Quantum (Time Slice)',
      'Process Priority integer',
      'Process arrival size',
      'Memory footprint',
    ],
    correctIndex: 0,
    explanation:
      'Processes get CPU time up to Time Quantum; if incomplete, process is moved to back of ready queue.',
    visualizerLink: '/cpu-scheduling',
    visualizerName: 'CPU Scheduling OS Visualizer',
  },
  {
    id: 'belady-anomaly-fifo',
    category: 'os',
    categoryLabel: 'Systems & OS',
    difficulty: 'hard',
    question:
      "Belady's Anomaly (where increasing page frames increases page faults) occurs in which page replacement algorithm?",
    options: [
      'First-In First-Out (FIFO)',
      'Least Recently Used (LRU)',
      'Optimal Page Replacement',
      'Clock Page Replacement',
    ],
    correctIndex: 0,
    explanation:
      "FIFO page replacement can exhibit Belady's Anomaly. Stack-based algorithms like LRU and Optimal never exhibit Belady's anomaly.",
    visualizerLink: '/cpu-scheduling',
    visualizerName: 'CPU Scheduling OS Visualizer',
  },
  {
    id: 'bankers-algo-deadlock',
    category: 'os',
    categoryLabel: 'Systems & OS',
    difficulty: 'hard',
    question: "Dijkstra's Banker's Algorithm is used in Operating Systems for…",
    options: [
      'Deadlock Avoidance (ensuring safe state)',
      'Deadlock Prevention by forcing preemption',
      'CPU Scheduling',
      'Disk De-fragmentation',
    ],
    correctIndex: 0,
    explanation:
      "Banker's Algorithm tests for safety by simulating resource allocation for maximum declared demands before granting requests.",
    visualizerLink: '/cpu-scheduling',
    visualizerName: 'CPU Scheduling OS Visualizer',
  },
  {
    id: 'thrashing-os',
    category: 'os',
    categoryLabel: 'Systems & OS',
    difficulty: 'medium',
    question: 'Thrashing in an Operating System occurs when…',
    options: [
      'The system spends more time swapping pages than executing instructions',
      'CPU frequency exceeds memory speed',
      'A deadlock locks all processes',
      'The disk space runs out',
    ],
    correctIndex: 0,
    explanation:
      'When working set size exceeds main memory frames, frequent page faults cause high disk I/O and process stall.',
    visualizerLink: '/cpu-scheduling',
    visualizerName: 'CPU Scheduling OS Visualizer',
  },

  // ── String Algorithms ───────────────────────────────────────────────────
  {
    id: 'kmp-lps-array',
    category: 'string',
    categoryLabel: 'String Algorithms',
    difficulty: 'medium',
    question:
      'In Knuth-Morris-Pratt (KMP) pattern matching, the LPS array stores…',
    options: [
      'Length of longest proper prefix that is also a suffix for pattern substrings',
      'Location of pattern matches in text',
      'Rolling hash values',
      'Z-box boundaries',
    ],
    correctIndex: 0,
    explanation:
      'LPS (Longest Prefix Suffix) table prevents re-matching characters in text that are already known to match.',
    visualizerLink: '/string-algorithms',
    visualizerName: 'String Algorithms Visualizer',
  },
  {
    id: 'kmp-time-complexity',
    category: 'string',
    categoryLabel: 'String Algorithms',
    difficulty: 'medium',
    question:
      'KMP string matching algorithm achieves a worst-case time complexity of…',
    options: [
      'O(N + M) where N is text length and M is pattern length',
      'O(N · M)',
      'O(N²)',
      'O(M log N)',
    ],
    correctIndex: 0,
    explanation:
      'KMP preprocessing takes O(M) and pattern search takes O(N) without ever backtracking text index i → O(N + M).',
    visualizerLink: '/string-algorithms',
    visualizerName: 'String Algorithms Visualizer',
  },
  {
    id: 'rabin-karp-rolling-hash',
    category: 'string',
    categoryLabel: 'String Algorithms',
    difficulty: 'medium',
    question:
      'Rabin-Karp algorithm searches for pattern in text using which core technique?',
    options: [
      'Rolling Hash function',
      'LPS lookup table',
      'Suffix Automaton',
      'Greedy character match',
    ],
    correctIndex: 0,
    explanation:
      'Rabin-Karp computes rolling hash values for sliding windows of size M in text in O(1) time per window shift.',
    visualizerLink: '/string-algorithms',
    visualizerName: 'String Algorithms Visualizer',
  },
  {
    id: 'z-algorithm-box',
    category: 'string',
    categoryLabel: 'String Algorithms',
    difficulty: 'hard',
    question:
      'For string S, Z[i] in the Z-Algorithm represents the length of the longest substring starting at i that is also…',
    options: [
      'A prefix of S',
      'A suffix of S',
      'A palindrome',
      'A sub-sequence of S',
    ],
    correctIndex: 0,
    explanation:
      'Z[i] stores exact match length between S[i...] and prefix S[0...]. Z-algorithm computes Z array in O(N) linear time.',
    visualizerLink: '/string-algorithms',
    visualizerName: 'String Algorithms Visualizer',
  },
  {
    id: 'manacher-palindrome',
    category: 'string',
    categoryLabel: 'String Algorithms',
    difficulty: 'hard',
    question:
      "Manacher's Algorithm finds the Longest Palindromic Substring in string of length N in time…",
    options: ['O(N)', 'O(N²)', 'O(N log N)', 'O(N³)'],
    correctIndex: 0,
    explanation:
      "Manacher's exploits palindrome symmetry to reuse previously computed palindrome radii, achieving linear O(N) time.",
    visualizerLink: '/string-algorithms',
    visualizerName: 'String Algorithms Visualizer',
  },
]

// ── Smart Question Picker with Adaptive & Filter Capabilities ─────────────

export function getFilteredQuestions(category = 'all', difficulty = 'all') {
  return QUESTION_BANK.filter((q) => {
    const catMatch = category === 'all' || q.category === category
    const diffMatch = difficulty === 'all' || q.difficulty === difficulty
    return catMatch && diffMatch
  })
}

export function pickQuestionsBatch({
  category = 'all',
  difficulty = 'all',
  count = 10,
  adaptive = false,
  seenIds = new Set(),
}) {
  let pool = getFilteredQuestions(category, difficulty)

  if (pool.length === 0) {
    pool = QUESTION_BANK // fallback if filter returned empty
  }

  // Shuffle pool
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  if (!adaptive) {
    // Standard random pick preferring unseen questions
    const unseen = shuffled.filter((q) => !seenIds.has(q.id))
    const selected = unseen.slice(0, count)
    if (selected.length < count) {
      const remaining = shuffled.filter((q) => !selected.includes(q))
      selected.push(...remaining.slice(0, count - selected.length))
    }
    return selected
  }

  // Adaptive mode: organize by difficulty
  const easy = shuffled.filter((q) => q.difficulty === 'easy')
  const medium = shuffled.filter((q) => q.difficulty === 'medium')
  const hard = shuffled.filter((q) => q.difficulty === 'hard')

  const result = []
  // Start with 3 easy, 4 medium, 3 hard
  result.push(...easy.slice(0, 3))
  result.push(...medium.slice(0, 4))
  result.push(...hard.slice(0, 3))

  if (result.length < count) {
    const filled = shuffled.filter((q) => !result.includes(q))
    result.push(...filled.slice(0, count - result.length))
  }

  return result.slice(0, count)
}
