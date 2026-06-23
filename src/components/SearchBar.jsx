import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { motion, AnimatePresence } from 'framer-motion'

const ALGORITHMS = [
  // Sorting
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Sorting',
    route: '/sort?algo=bubble',
  },
  {
    id: 'SortingAlgo',
    name: 'Sorting Algorithms',
    category: 'Sort',
    route: '/sort',
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    category: 'Sorting',
    route: '/sort?algo=selection',
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Sorting',
    route: '/sort?algo=insertion',
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Sorting',
    route: '/sort?algo=quick',
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Sorting',
    route: '/sort?algo=merge',
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    category: 'Sorting',
    route: '/sort?algo=heap',
  },
  {
    id: 'counting',
    name: 'Counting Sort',
    category: 'Sorting',
    route: '/sort?algo=counting',
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    category: 'Sorting',
    route: '/sort?algo=radix',
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    category: 'Sorting',
    route: '/sort?algo=shell',
  },
  // Searching (Graph)
  {
    id: 'searchAlgo',
    name: 'Search Algorithms',
    category: 'Searching',
    route: '/search',
  },
  {
    id: 'bfs',
    name: 'BFS (Breadth First Search)',
    category: 'Searching',
    route: '/search?algo=bfs',
  },
  {
    id: 'dfs',
    name: 'DFS (Depth First Search)',
    category: 'Searching',
    route: '/search?algo=dfs',
  },
  // Shortest Path
  {
    id: 'graphAlgo',
    name: 'Graph Algorithms',
    category: 'Graph',
    route: '/spath',
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    category: 'Shortest Path',
    route: '/spath?algo=dijkstra',
  },
  {
    id: 'floyd',
    name: 'Floyd-Warshall',
    category: 'Shortest Path',
    route: '/spath?algo=floydwarshall',
  },
  {
    id: 'bellman',
    name: 'Bellman-Ford',
    category: 'Shortest Path',
    route: '/spath?algo=bellmanford',
  },
  // MST
  {
    id: 'prim',
    name: "Prim's Algorithm",
    category: 'Minimum Spanning Tree',
    route: '/spath?algo=prim',
    keywords: ['prim', 'mst', 'minimum spanning tree', 'greedy'],
  },
  {
    id: 'kruskal',
    name: "Kruskal's Algorithm",
    category: 'Minimum Spanning Tree',
    route: '/spath?algo=kruskal',
    keywords: [
      'kruskal',
      'mst',
      'minimum spanning tree',
      'union find',
      'disjoint set',
    ],
  },
  // Array Search
  {
    id: 'arraysearchAlgo',
    name: 'Array Search',
    category: 'Array Search',
    route: '/ldssearch',
  },
  {
    id: 'linear',
    name: 'Linear Search',
    category: 'Array Search',
    route: '/ldssearch?algo=linearSearch',
  },
  {
    id: 'binary',
    name: 'Binary Search',
    category: 'Array Search',
    route: '/ldssearch?algo=binarySearch',
  },
  {
    id: 'kadane',
    name: "Kadane's Algorithm",
    category: 'Dynamic Programming',
    route: '/kadane',
    keywords: [
      'kadane',
      'maximum subarray',
      'max subarray',
      'dynamic programming',
    ],
  },
  {
    id: 'stringAlgo',
    name: 'String Algorithms',
    category: 'String',
    route: '/string-algorithms',
  },

  {
    id: 'kmp',
    name: 'KMP Algorithm (Knuth-Morris-Pratt)',
    category: 'String',
    route: '/string-algorithms?algo=kmp',
  },
  {
    id: 'rabinkarp',
    name: 'Rabin-Karp Algorithm',
    category: 'String',
    route: '/string-algorithms?algo=rabinkarp',
  },
  {
    id: 'zalgorithm',
    name: 'Z-Algorithm',
    category: 'String',
    route: '/string-algorithms?algo=zalgorithm',
  },
  {
    id: 'mooreVoting',
    name: "Moore's Voting Algorithm",
    category: 'Array Search',
    route: '/moore-voting',
  },
  // ADTs
  {
    id: 'adt',
    name: 'Abstract Data Types',
    category: 'Data Structures',
    route: '/adt',
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Data Structures',
    route: '/adt?type=stack',
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'Data Structures',
    route: '/monotonic-stack',
    keywords: [
      'monotonic stack',
      'stack',
      'largest rectangle in histogram',
      'histogram',
      'rectangle',
      'maximal rectangle',
      '2d-matrix mode',
      '2d matrix',
    ],
  },
  {
    id: 'queue',
    name: 'Queue',
    category: 'Data Structures',
    route: '/adt?type=queue',
  },
  {
    id: 'tree',
    name: 'Binary Tree',
    category: 'Data Structures',
    route: '/adt?type=tree',
  },
  {
    id: 'dsu',
    name: 'Disjoint Set Union',
    category: 'Data Structures',
    route: '/adt?type=dsu',
    keywords: ['dsu', 'disjoint set', 'union find'],
  },
  {
    id: 'bheap',
    name: 'Binary Heap',
    category: 'Data Structures',
    route: '/adt?type=heap',
  },
  {
    id: 'priority-queue',
    name: 'Priority Queue',
    category: 'Data Structures',
    route: '/adt?type=priority-queue',
  },
  // General
  {
    id: 'about',
    name: 'About AlgoScope',
    category: 'General',
    route: '/about',
  },
  // Backtracking
  {
    id: 'backtrack',
    name: 'Backtracking',
    category: 'Backtracking',
    route: '/backtracking?algo=nqueens',
    keywords: [
      'backtracking',
      'n-queens',
      'n queens',
      'nqueens',
      'sudoku',
      'recursion',
      'constraint',
    ],
  },

  // Math Theory
  {
    id: 'mathTheory',
    name: 'Math Theory',
    category: 'Math',
    route: '/math-theory',
  },
  {
    id: 'gcd',
    name: 'Euclidean GCD',
    category: 'Math Theory',
    route: '/math-theory?algo=gcd',
    keywords: ['gcd', 'greatest common divisor', 'euclidean algorithm', 'math'],
  },
  {
    id: 'fastExpo',
    name: 'Fast Exponentiation',
    category: 'Math Theory',
    route: '/math-theory?algo=expo',
    keywords: [
      'binary exponentiation',
      'exponentiation by squaring',
      'power',
      'math',
    ],
  },
  {
    id: 'bitManip',
    name: 'Bit Manipulation',
    category: 'Math Theory',
    route: '/math-theory?algo=bits',
    keywords: ['bits', 'and', 'or', 'xor', 'shift', 'binary', 'math'],
  },
  {
    id: 'sieve',
    name: 'Sieve of Eratosthenes',
    category: 'Math Theory',
    route: '/math-theory?algo=sieve',
    keywords: ['sieve', 'prime numbers', 'primes', 'eratosthenes', 'math'],
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    category: 'Math Theory',
    route: '/math-theory?algo=fibonacci',
    keywords: ['fibonacci', 'recursion', 'sequence', 'math'],
  },
  {
    id: 'fft',
    name: 'Fast Fourier Transform',
    category: 'Math Theory',
    route: '/math-theory?algo=fft',
  },
  // Games & Challenges
  {
    id: 'challenge',
    name: 'Guess the Algorithm (Challenge)',
    category: 'Games',
    route: '/challenge',
    keywords: ['game', 'challenge', 'guess the algorithm', 'quiz', 'play'],
  },
  //Dynamic-Programming
  {
    id: 'dynamic-prog',
    name: 'Dynamic Programming',
    category: 'Dynamic Programming',
    route: '/dynamic-programming',
    keywords: ['lcs', 'knapsack', 'Coin Change', 'LIS'],
  },
  {
    id: 'dynamic-prog-journey',
    name: 'DP Journey',
    category: 'Dynamic Programming',
    route: '/dp-journey',
    keywords: [
      'dp-journey',
      'dpjourney',
      'dp optimization',
      'dynamic programming optimization',
      'Coin Change',
      'Fibonacci',
      'Climbing Stairs',
    ],
  },
  //Sliding Window and 2 Pointer
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Sliding Window',
    route: '/sliding-window',
    keywords: [
      'slidingwindow',
      'max sum of size k',
      'longest unique substring',
      'smallest subarray greater than target',
      'subarrays',
      'sliding window',
    ],
  },
  {
    id: 'two-pointer',
    name: 'Two Pointer',
    category: 'Two Pointer',
    route: '/two-pointer',
    keywords: [
      'two-pointer',
      'two pointer',
      '2 pointer',
      'two sum',
      '2-sum',
      'container with most water',
      'valid palindrome',
      'trapping rain water',
    ],
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
      keys: ['name', 'category', 'keywords'],
      threshold: 0.3,
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
    })
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setQuery(val)

    if (val.trim() === '') {
      setResults([])
      return
    }

    const searchResults = fuse.search(val).filter((result) => {
      const searchText = val.toLowerCase()

      return (
        result.item.name.toLowerCase().includes(searchText) ||
        result.item.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(searchText)
        )
      )
    })
    const sortedResults = [...searchResults].sort((a, b) => {
      if (sortBy === 'name') {
        return a.item.name.localeCompare(b.item.name)
      } else if (sortBy === 'category') {
        return a.item.category.localeCompare(b.item.category)
      }
      return 0
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
          className="w-4 h-4 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
                    className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
