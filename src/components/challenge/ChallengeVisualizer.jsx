import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MAX_QUESTIONS = 10

const QUESTION_BANK = [
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
    id: 'bfs-structure',
    category: 'graph',
    question: 'BFS uses which data structure?',
    options: ['Stack', 'Queue', 'Priority Queue', 'Set'],
    correctIndex: 1,
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
      'It cannot detect cycles',
      'Greedy relaxation breaks (a shorter path may appear later)',
      'It needs an adjacency matrix',
      'It requires undirected graphs',
    ],
    correctIndex: 1,
    explanation:
      'Dijkstra assumes once a node is finalized it cannot be improved—negative edges violate that.',
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
    id: 'binary-search-requirement',
    category: 'search',
    question: 'Binary search requires the array to be…',
    options: ['Sorted', 'Unique', 'All positive', 'Even length'],
    correctIndex: 0,
    explanation: 'Binary search relies on sorted order to discard halves.',
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
]

function pickQuestions() {
  const pool = [...QUESTION_BANK]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(MAX_QUESTIONS, pool.length))
}

export default function ChallengeVisualizer() {
  const [questions, setQuestions] = useState(() => pickQuestions())
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
    setQuestions(pickQuestions())
    setIndex(0)
    setScore(0)
    setStreak(0)
    setCorrect(0)
    setSelectedIndex(null)
    setIsAnswered(false)
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
