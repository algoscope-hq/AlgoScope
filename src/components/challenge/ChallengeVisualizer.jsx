import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MAX_QUESTIONS = 10

const QUESTION_BANK = [
  // ── Sorting ────────────
  {
    id: 'stable-sort',
    category: 'sorting',
    question: 'Which sorting algorithm is stable by default?',
    options: ['Selection Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort'],
    correctIndex: 2,
    explanation:
      'Merge Sort preserves the relative order of equal elements (stable).',
  },
  {
    id: 'quick-worst',
    category: 'sorting',
    question: "Quick Sort's worst-case time complexity is…",
    options: ['O(n log n)', 'O(n²)', 'O(log n)', 'O(n)'],
    correctIndex: 1,
    explanation: 'Worst case occurs with bad pivots repeatedly → O(n²).',
  },
  {
    id: 'merge-extra-space',
    category: 'sorting',
    question: 'Merge Sort typically needs…',
    options: [
      'O(1) extra space',
      'O(log n) extra space',
      'O(n) extra space',
      'No extra space',
    ],
    correctIndex: 2,
    explanation: 'Standard merge uses auxiliary arrays → O(n) extra space.',
  },
  {
    id: 'insertion-best',
    category: 'sorting',
    question: "Insertion Sort's best-case time complexity is…",
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'When the array is already sorted, Insertion Sort runs in O(n).',
  },
  {
    id: 'heap-sort-space',
    category: 'sorting',
    question: 'Heap Sort has a space complexity of…',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctIndex: 3,
    explanation:
      'Heap Sort sorts in-place using the heap built within the original array.',
  },
  {
    id: 'counting-sort-limit',
    category: 'sorting',
    question: 'Counting Sort is NOT suitable when…',
    options: [
      'Range of values is very large',
      'Input is integers',
      'Array is small',
      'Values repeat frequently',
    ],
    correctIndex: 0,
    explanation:
      'Counting Sort needs O(k) extra space for the count array; huge k makes it impractical.',
  },
  {
    id: 'quick-avg',
    category: 'sorting',
    question: "Quick Sort's average-case time complexity is…",
    options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(log n)'],
    correctIndex: 2,
    explanation:
      'With a good pivot strategy, Quick Sort runs in O(n log n) on average.',
  },
  {
    id: 'bubble-sort-stable',
    category: 'sorting',
    question: 'Is Bubble Sort stable?',
    options: [
      'Yes, always',
      'No',
      'Only on sorted input',
      'Depends on implementation',
    ],
    correctIndex: 0,
    explanation:
      'Bubble Sort only swaps adjacent elements when strictly out of order, so equal elements stay in original order.',
  },

  // ── Graph ────────────────────────────────────────────────────────────────
  {
    id: 'bfs-structure',
    category: 'graph',
    question: 'BFS uses which data structure?',
    options: ['Stack', 'Set', 'Priority Queue', 'Queue'],
    correctIndex: 3,
    explanation: 'BFS explores level-by-level using a queue.',
  },
  {
    id: 'dfs-structure',
    category: 'graph',
    question: 'DFS typically uses…',
    options: ['Queue', 'Stack (explicit or recursion)', 'Heap', 'HashMap'],
    correctIndex: 1,
    explanation: 'DFS goes deep first using a stack (or recursion call stack).',
  },
  {
    id: 'dijkstra-negative',
    category: 'graph',
    question: "Why doesn't Dijkstra work with negative edge weights?",
    options: [
      'Greedy relaxation breaks (a shorter path may appear later)',
      'It cannot detect cycles',
      'It needs an adjacency matrix',
      'It requires undirected graphs',
    ],
    correctIndex: 0,
    explanation:
      "Dijkstra assumes once a node is finalized it can't be improved—negative edges violate that.",
  },
  {
    id: 'bellman-ford',
    category: 'graph',
    question: 'Bellman–Ford can detect…',
    options: [
      'Negative cycles reachable from the source',
      'Only positive cycles',
      'Disconnected graphs',
      'Minimum spanning trees',
    ],
    correctIndex: 0,
    explanation:
      'After V−1 relaxations, one more improvement implies a reachable negative cycle.',
  },
  {
    id: 'floyd-warshall',
    category: 'graph',
    question: 'Floyd–Warshall computes…',
    options: [
      'Single-source shortest paths',
      'All-pairs shortest paths',
      'Minimum spanning tree',
      'Topological ordering',
    ],
    correctIndex: 1,
    explanation: 'It finds shortest paths between all pairs of vertices.',
  },
  {
    id: 'topo-sort-cycle',
    category: 'graph',
    question: 'Topological sort is only possible in a…',
    options: [
      'Undirected graph',
      'Directed Acyclic Graph (DAG)',
      'Cyclic directed graph',
      'Weighted graph',
    ],
    correctIndex: 1,
    explanation:
      'Topological ordering requires no cycles—only DAGs support it.',
  },
  {
    id: 'prim-vs-kruskal',
    category: 'graph',
    question: "Kruskal's MST algorithm is based on…",
    options: [
      'BFS traversal',
      'DFS traversal',
      'Greedy edge selection by weight',
      'Dynamic programming',
    ],
    correctIndex: 2,
    explanation:
      "Kruskal's greedily picks the smallest-weight edge that doesn't form a cycle.",
  },
  {
    id: 'graph-bfs-shortest',
    category: 'graph',
    question: 'BFS finds the shortest path in terms of…',
    options: [
      'Edge weights',
      'DFS depth',
      'Node values',
      'Number of edges (hops)',
    ],
    correctIndex: 3,
    explanation:
      'BFS guarantees shortest path in hop count (unweighted graphs).',
  },
  {
    id: 'scc',
    category: 'graph',
    question: "Kosaraju's algorithm is used to find…",
    options: [
      'Shortest paths',
      'Strongly Connected Components',
      'Minimum Spanning Tree',
      'Bridges and articulation points',
    ],
    correctIndex: 1,
    explanation:
      "Kosaraju's does two DFS passes to identify strongly connected components.",
  },

  // ── Data Structures ──────────────────────────────────────────────────────
  {
    id: 'heap-property',
    category: 'ds',
    question: 'In a max-heap, the parent node is…',
    options: [
      'Always smaller than children',
      'Always greater than or equal to children',
      'Always the median',
      'Always the minimum',
    ],
    correctIndex: 1,
    explanation: 'Max-heap property: parent ≥ children.',
  },
  {
    id: 'stack-lifo',
    category: 'ds',
    question: 'A stack follows which principle?',
    options: ['FIFO', 'LIFO', 'Priority order', 'Random access'],
    correctIndex: 1,
    explanation:
      'Stack is Last-In First-Out—the most recently pushed element is popped first.',
  },
  {
    id: 'queue-fifo',
    category: 'ds',
    question: 'A queue follows which principle?',
    options: ['LIFO', 'Max-order', 'Min-order', 'FIFO'],
    correctIndex: 3,
    explanation:
      'Queue is First-In First-Out—elements are removed in the order they were added.',
  },
  {
    id: 'hash-collision',
    category: 'ds',
    question: 'A hash collision occurs when…',
    options: [
      'Two different keys map to the same hash bucket',
      'Two keys have the same value',
      'The hash table is full',
      'A key is deleted',
    ],
    correctIndex: 0,
    explanation:
      'A collision happens when distinct keys produce the same hash index.',
  },
  {
    id: 'bst-search',
    category: 'ds',
    question: 'Binary Search Tree (BST) worst-case search time is…',
    options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation:
      'A degenerate (skewed) BST degrades to O(n)—like a linked list.',
  },
  {
    id: 'linked-list-access',
    category: 'ds',
    question: 'Accessing the k-th element in a singly linked list is…',
    options: ['O(1)', 'O(log n)', 'O(k)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'You must traverse from the head, taking O(k) steps.',
  },
  {
    id: 'deque',
    category: 'ds',
    question: 'A deque (double-ended queue) supports…',
    options: [
      'Insertion and deletion at the front only',
      'Insertion and deletion at both ends',
      'Only priority-based insertion',
      'Random access in O(1)',
    ],
    correctIndex: 1,
    explanation: 'Deque allows push/pop from both front and back.',
  },
  {
    id: 'trie-use',
    category: 'ds',
    question: 'Tries are most commonly used for…',
    options: [
      'Sorting numbers',
      'Prefix-based string searches',
      'Graph traversal',
      'Heap operations',
    ],
    correctIndex: 1,
    explanation:
      'Tries store strings character-by-character enabling fast prefix lookups.',
  },
  {
    id: 'avl-property',
    category: 'ds',
    question: 'An AVL tree maintains…',
    options: [
      'A height difference ≤ 1 between left and right subtrees',
      'All leaves at the same level',
      'A max-heap property',
      'A sorted array internally',
    ],
    correctIndex: 0,
    explanation:
      'AVL trees self-balance by keeping the height difference (balance factor) ≤ 1.',
  },

  // ── Search & Binary Search ───────────────────────────────────────────────
  {
    id: 'binary-search-requirement',
    category: 'search',
    question: 'Binary search requires the array to be…',
    options: ['Sorted', 'Unique', 'All positive', 'Even length'],
    correctIndex: 0,
    explanation: 'Binary search relies on sorted order to discard halves.',
  },
  {
    id: 'binary-search-complexity',
    category: 'search',
    question: 'Binary search time complexity is…',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    correctIndex: 2,
    explanation: 'Each step halves the search space → O(log n).',
  },
  {
    id: 'linear-search-worst',
    category: 'search',
    question: 'Linear search worst-case time complexity is…',
    options: ['O(log n)', 'O(1)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'You may have to scan all n elements in the worst case.',
  },

  // ── Complexity Theory ────────────────────────────────────────────────────
  {
    id: 'big-o-definition',
    category: 'theory',
    question: 'Big-O notation describes…',
    options: [
      'Exact runtime in seconds',
      'Upper bound growth rate (asymptotic)',
      'Lower bound growth rate only',
      'Memory usage only',
    ],
    correctIndex: 1,
    explanation: 'Big-O gives an asymptotic upper bound on growth rate.',
  },
  {
    id: 'big-omega',
    category: 'theory',
    question: 'Big-Ω (Omega) notation represents…',
    options: ['Upper bound', 'Tight bound', 'Lower bound', 'Average case'],
    correctIndex: 2,
    explanation: 'Big-Ω is the asymptotic lower bound—best-case growth rate.',
  },
  {
    id: 'np-complete',
    category: 'theory',
    question: 'An NP-complete problem is one that…',
    options: [
      'Can be solved in polynomial time',
      'Is in NP and is NP-hard',
      'Has no known solution',
      'Can only be solved by brute force',
    ],
    correctIndex: 1,
    explanation:
      'NP-complete means both in NP (verifiable in poly time) and NP-hard (at least as hard as all NP problems).',
  },
  {
    id: 'space-complexity',
    category: 'theory',
    question: 'Space complexity measures…',
    options: [
      'Number of operations performed',
      'Time taken on real hardware',
      'Number of recursive calls',
      'Memory used relative to input size',
    ],
    correctIndex: 3,
    explanation:
      'Space complexity tracks extra memory an algorithm uses as input grows.',
  },
  {
    id: 'amortized',
    category: 'theory',
    question: 'Amortized analysis gives you the…',
    options: [
      'Worst-case per operation, always',
      'Average cost per operation over a sequence',
      'Best-case per operation',
      'Exact cost per operation',
    ],
    correctIndex: 1,
    explanation:
      'Amortized analysis spreads expensive operations over a sequence to get a tighter average.',
  },

  // ── Dynamic Programming ──────────────────────────────────────────────────
  {
    id: 'dp-overlapping',
    category: 'dp',
    question: 'Dynamic programming is best suited for problems with…',
    options: [
      'Overlapping subproblems and optimal substructure',
      'Independent subproblems only',
      'Random input distributions',
      'Purely greedy choices',
    ],
    correctIndex: 0,
    explanation:
      'DP shines when subproblems repeat and the global optimum can be built from subproblem optima.',
  },
  {
    id: 'memoization-vs-tabulation',
    category: 'dp',
    question: 'Memoization is…',
    options: [
      'Bottom-up DP with a table',
      'Space-optimized iteration',
      'Greedy optimization',
      'Top-down DP with caching of recursive results',
    ],
    correctIndex: 3,
    explanation:
      'Memoization = top-down recursion + caching already-computed results.',
  },
  {
    id: 'knapsack-type',
    category: 'dp',
    question: 'The 0/1 Knapsack problem is solved efficiently using…',
    options: [
      'Greedy algorithm',
      'BFS',
      'Dynamic programming',
      'Divide and conquer',
    ],
    correctIndex: 2,
    explanation:
      '0/1 Knapsack has overlapping subproblems → DP gives O(n·W) solution.',
  },
  {
    id: 'lcs',
    category: 'dp',
    question:
      'The Longest Common Subsequence (LCS) of two strings of length m and n has DP time complexity…',
    options: ['O(m+n)', 'O(m·n)', 'O(m²)', 'O(log(m·n))'],
    correctIndex: 1,
    explanation: 'LCS fills an m×n DP table → O(m·n).',
  },

  // ── Recursion & Divide and Conquer ───────────────────────────────────────
  {
    id: 'master-theorem',
    category: 'theory',
    question: 'The Master Theorem is used to solve…',
    options: [
      'DP recurrences',
      'Graph shortest-path recurrences',
      'Divide-and-conquer recurrences of the form T(n) = aT(n/b) + f(n)',
      'Greedy algorithm runtimes',
    ],
    correctIndex: 2,
    explanation:
      'The Master Theorem handles recurrences that split into a subproblems of size n/b.',
  },
  {
    id: 'recursion-base',
    category: 'theory',
    question: 'Without a base case, a recursive function will…',
    options: [
      'Cause a stack overflow',
      'Run until it produces correct output',
      'Return 0 automatically',
      'Fall back to iteration',
    ],
    correctIndex: 0,
    explanation:
      'Infinite recursion keeps pushing stack frames until the call stack overflows.',
  },

  // ── Two Pointers / Sliding Window ────────────────────────────────────────
  {
    id: 'two-pointer-sorted',
    category: 'patterns',
    question:
      'The two-pointer technique on a sorted array to find a pair summing to a target runs in…',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
    correctIndex: 2,
    explanation:
      'Two pointers advance from both ends, visiting each element at most once → O(n).',
  },
  {
    id: 'sliding-window-use',
    category: 'patterns',
    question: 'Sliding window is ideal for problems asking about…',
    options: [
      'Sorted order of elements',
      'Contiguous subarrays or substrings satisfying a condition',
      'Graph connectivity',
      'Minimum spanning trees',
    ],
    correctIndex: 1,
    explanation:
      'Sliding window efficiently tracks a moving subarray/substring window in O(n).',
  },
  {
    id: 'prefix-sum-use',
    category: 'patterns',
    question: 'A prefix sum array lets you answer range-sum queries in…',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctIndex: 2,
    explanation:
      'After O(n) preprocessing, any range sum [l, r] = prefix[r] − prefix[l−1] in O(1).',
  },
]

// ── Smart rotation: never repeat questions across resets until all are seen ──
function createPicker() {
  let remaining = []

  return function pick() {
    if (remaining.length === 0) {
      const fresh = [...QUESTION_BANK]
      for (let i = fresh.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[fresh[i], fresh[j]] = [fresh[j], fresh[i]]
      }
      remaining = fresh
    }
    const batch = remaining.splice(0, MAX_QUESTIONS)
    if (batch.length < MAX_QUESTIONS) {
      const fresh = [...QUESTION_BANK]
      for (let i = fresh.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[fresh[i], fresh[j]] = [fresh[j], fresh[i]]
      }
      remaining = fresh
      batch.push(...remaining.splice(0, MAX_QUESTIONS - batch.length))
    }
    return batch
  }
}

export default function ChallengeVisualizer() {
  const [pick] = useState(() => createPicker())
  const [questions, setQuestions] = useState(() => pick())
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const current = questions[index]

  const progress = useMemo(() => {
    const total = Math.max(1, questions.length)
    return Math.round(((index + 1) / total) * 100)
  }, [index, questions.length])

  const restart = () => {
    setQuestions(pick())
    setIndex(0)
    setScore(0)
    setStreak(0)
    setCorrect(0)
    setSelectedIndex(null)
    setIsAnswered(false)
    setShowResults(false)
  }

  const handleSelect = (optIndex) => {
    if (isAnswered) return
    setSelectedIndex(optIndex)
    setIsAnswered(true)

    const isRight = optIndex === current.correctIndex
    if (isRight) {
      setCorrect((c) => c + 1)
      setStreak((s) => s + 1)
      setScore((s) => s + 10)
    } else {
      setStreak(0)
    }
  }

  const goNext = () => {
    if (!isAnswered) return
    if (index >= questions.length - 1) return
    setIndex((i) => i + 1)
    setSelectedIndex(null)
    setIsAnswered(false)
    setShowResults(false)
  }

  const finishQuiz = () => {
    setShowResults(true)
  }

  const isComplete = index >= questions.length - 1 && showResults

  if (isComplete) {
    return (
      <div className="flex flex-col p-4 items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8 sm:p-12 shadow-2xl max-w-lg w-full text-center relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500"></div>

          <h2 className="text-3xl font-extrabold text-white mb-2">
            Quiz Complete!
          </h2>
          <p className="text-slate-400 mb-8 font-medium">
            Here&apos;s how you performed.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 shadow-inner">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                Final Score
              </p>
              <p className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {score}
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 shadow-inner">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                Accuracy
              </p>
              <p className="text-4xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                {Math.round((correct / questions.length) * 100)}%
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-300 mb-8">
            You got <span className="font-bold text-white">{correct}</span> out
            of {questions.length} correct!
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restart}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 text-lg border border-cyan-400/30"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-5">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-60 rounded-t-3xl" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 shadow-inner min-w-[80px]">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Q {index + 1}/{questions.length}
                </span>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-700 shadow-inner">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Score
                </span>
                <span className="text-xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  {score}
                </span>
              </div>

              <div className="flex flex-col items-center bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-700 shadow-inner">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Streak
                </span>
                <span
                  className={`text-xl font-bold ${
                    streak > 2
                      ? 'text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                      : 'text-orange-300'
                  }`}
                >
                  {streak}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={restart}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-white/10 text-slate-200 hover:bg-white/5 transition-all"
            >
              Restart
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
            {current.question}
          </h3>
          <p className="text-sm text-slate-400 mb-6">Pick the best answer.</p>

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {current.options.map((opt, optIndex) => {
                const isCorrect = optIndex === current.correctIndex
                const isSelected = optIndex === selectedIndex

                let btnClasses =
                  'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-cyan-500 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'

                if (isAnswered) {
                  if (isCorrect) {
                    btnClasses =
                      'border-green-500 bg-green-500/20 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  } else if (isSelected) {
                    btnClasses =
                      'border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  } else {
                    btnClasses =
                      'border-slate-800 bg-slate-900/40 text-slate-500'
                  }
                }

                return (
                  <motion.button
                    key={`${current.id}-${optIndex}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    type="button"
                    onClick={() => handleSelect(optIndex)}
                    disabled={isAnswered}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 font-bold text-base flex items-center justify-between ${btnClasses}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && (
                      <span className="text-xl">✅</span>
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <span className="text-xl">❌</span>
                    )}
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col gap-4"
              >
                <div
                  className={`p-4 rounded-xl text-center font-bold text-base border ${
                    selectedIndex === current.correctIndex
                      ? 'bg-green-500/10 border-green-500/30 text-green-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {selectedIndex === current.correctIndex
                    ? 'Correct! +10 points'
                    : 'Wrong answer'}
                </div>

                <div className="text-sm text-slate-300 bg-slate-950/40 border border-white/10 rounded-xl p-4">
                  <span className="font-bold text-white">Explanation:</span>{' '}
                  {current.explanation}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  {index < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="px-5 py-3 rounded-xl text-sm font-bold border transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={finishQuiz}
                      className="px-5 py-3 rounded-xl text-sm font-bold border transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-green-400/30 shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                    >
                      See Results
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
