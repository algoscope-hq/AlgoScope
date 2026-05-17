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
  // Array Search
  {
    id: 'linear',
    name: 'Linear Search',
    category: 'Array Search',
    route: '/ldssearch?algo=linear',
  },
  {
    id: 'binary',
    name: 'Binary Search',
    category: 'Array Search',
    route: '/ldssearch?algo=binary',
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
  // ADTs
  {
    id: 'stack',
    name: 'Stack',
    category: 'Data Structures',
    route: '/adt?type=stack',
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
  // General
  {
    id: 'about',
    name: 'About AlgoScope',
    category: 'General',
    route: '/about',
  },
]

const SearchBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(ALGORITHMS, {
      keys: ['name', 'category', 'keywords'],
      threshold: 0.4,
      includeMatches: true,
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
    setResults(searchResults)
    setSelectedIndex(0)
  }

  const handleSelect = React.useCallback(
    (route) => {
      navigate(route)
      setQuery('')
      setResults([])
      setIsModalOpen(false)
    },
    [navigate]
  )

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsModalOpen(true)
      }

      if (!isModalOpen) return

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
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, results, selectedIndex, handleSelect])

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
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 border border-white/10 hover:border-cyan-500/50 rounded-xl text-slate-400 hover:text-cyan-400 transition-all group w-full lg:w-48"
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
          <kbd className="text-[10px] font-sans">⌘</kbd>
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
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="relative group p-4 border-b border-slate-800">
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
                  className="w-full bg-transparent text-slate-200 text-lg block pl-12 pr-12 py-2 outline-none"
                  placeholder="Search algorithms..."
                />
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200"
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
                              Enter
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
                      Enter
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
