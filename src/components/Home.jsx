import React, { useState } from 'react'
import AlgoCard from './AlgoCard'
import { Hero } from './hero/Hero'
import { motion } from 'framer-motion'
import { GuidedTour } from './GuidedTour'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const ALGORITHMS = [
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
    id: 'abstract-data-types',
    title: 'Abstract Data Types',
    description:
      'Stacks, Queues, Binary Trees, Binary Heaps, and Priority Queues.',
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
    difficulty: 'Intermediate',
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
    difficulty: 'Advanced',
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
    title: 'Sliding Window',
    description:
      'Visualize the sliding window algorithm use to optimally solve problems on substrings and subarrays.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/sliding-window',
    difficulty: 'Advanced',
  },
]

const OPERATING_SYSTEMS = [
  {
    id: 'cpu-scheduling',
    title: 'CPU Scheduling',
    description: 'Visualize FCFS, SJF, Round Robin, and Priority Scheduling.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/operating-systems',
    difficulty: 'Beginner',
  },
  {
    id: 'page-replacement',
    title: 'Page Replacement',
    description: 'Explore FIFO, LRU, and Optimal page replacement algorithms.',
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/operating-systems',
    difficulty: 'Intermediate',
  },
  {
    id: 'disk-scheduling',
    title: 'Disk Scheduling',
    description:
      'Understand SCAN, C-SCAN, SSTF and disk head movement strategies.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/operating-systems',
    difficulty: 'Intermediate',
  },
]

export const Home = () => {
  const [filter, setFilter] = useState('All')

  const filteredAlgos =
    filter === 'All'
      ? ALGORITHMS
      : ALGORITHMS.filter((algo) => algo.difficulty === filter)

  const filteredOS =
    filter === 'All'
      ? OPERATING_SYSTEMS
      : OPERATING_SYSTEMS.filter((os) => os.difficulty === filter)

  return (
    <div className="theme-home relative min-h-screen w-full overflow-x-hidden selection:bg-cyan-500/30">
      <Hero />

      <div className="relative z-10 px-4 pb-16">
        <div id="explore" className="mx-auto w-full max-w-7xl px-4">
          {/* Difficulty Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(51,65,85,0.6)',
              }}
            >
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className="relative px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
                  style={{ color: filter === level ? '#fff' : '#64748b' }}
                >
                  {filter === level && (
                    <motion.div
                      layoutId="home-filter-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(6,182,212,0.2)',
                        border: '1px solid rgba(6,182,212,0.4)',
                      }}
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                  <span className="relative">{level}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
            <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
              Algorithms
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
          </div>

          {filteredAlgos.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {filteredAlgos.map((algo) => (
                <AlgoCard
                  key={algo.id}
                  id={algo.id}
                  title={algo.title}
                  description={algo.description}
                  color={algo.color}
                  link={algo.link}
                  difficulty={algo.difficulty}
                />
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-slate-500 font-mono text-sm my-8">
              No algorithms match this difficulty level.
            </p>
          )}

          {filteredOS.length > 0 && (
            <>
              <div className="mt-16 mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
                <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
                  Operating Systems
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
              </div>

              <motion.div
                layout
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {filteredOS.map((os) => (
                  <AlgoCard
                    key={os.id}
                    id={os.id}
                    title={os.title}
                    description={os.description}
                    color={os.color}
                    link={os.link}
                    difficulty={os.difficulty}
                  />
                ))}
              </motion.div>
            </>
          )}

          {filter === 'All' && (
            <>
              <div className="mt-16 mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
                <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
                  Games & Challenges
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
              </div>

              <motion.div
                layout
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <div data-tour="challenge-card" className="w-full">
                  <AlgoCard
                    id="guess-the-algorithm"
                    title="Guess the Algorithm"
                    description="Test your algorithm recognition skills! Can you identify the sorting algorithm purely from its visual animation?"
                    color="theme-card border-yellow-500/30 hover:border-yellow-400"
                    link="/challenge"
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <GuidedTour />
    </div>
  )
}
