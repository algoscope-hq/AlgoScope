import React from 'react'
import AlgoCard from './AlgoCard'
import { Hero } from './hero/Hero'
import { motion } from 'framer-motion'

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
    title: 'Sorting',
    description: 'Visualizing Bubble, Merge, Quick, Heap, and Shell Sort.',
    color: 'theme-card border-blue-500/30 hover:border-blue-400',
    link: '/sort',
  },
  {
    title: 'Searching',
    description: 'Explore BFS, DFS, and other traversal methods.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/search',
  },
  {
    title: 'Graph Algorithms',
    description: 'Dijkstra, Floyd-Warshall, and Topological Sort.',
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/spath',
  },
  {
    title: 'Array Search',
    description: 'Linear and Binary search visualization.',
    color: 'theme-card border-orange-500/30 hover:border-orange-400',
    link: '/ldssearch',
  },
  {
    title: 'Abstract Data Types',
    description:
      'Stacks, Queues, Binary Trees, Binary Heaps, and Priority Queues.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/adt',
  },
  {
    title: 'Kadane Algorithm',
    description: 'Visualize Maximum Subarray Sum using Kadane’s Algorithm.',
    color: 'theme-card border-pink-500/30 hover:border-pink-400',
    link: '/kadane',
  },
  {
    title: "Moore's Voting Algorithm",
    description:
      "Visualize the Moore's Voting Algorithm for finding the majority element.",
    color: 'theme-card border-green-500/30 hover:border-green-400',
    link: '/moore-voting',
  },
  {
    title: 'Math Theory',
    description:
      'Visualize GCD, Fast Exponentiation, and Bit Manipulation step-by-step.',
    color: 'theme-card border-indigo-500/30 hover:border-indigo-400',
    link: '/math-theory',
  },
  {
    title: 'Backtracking',
    description:
      'N-Queens, Sudoku Solver, and Tower of Hanoi with step-by-step recursion.',
    color: 'theme-card border-rose-500/30 hover:border-rose-400',
    link: '/backtracking',
  },
  {
    title: 'String Algorithms',
    description:
      'KMP, Rabin-Karp, and Z-Algorithm — pattern matching visualized step by step.',
    color: 'theme-card border-violet-500/30 hover:border-violet-400',
    link: '/string-algorithms',
  },
]

export const Home = () => {
  return (
    <div className="theme-home relative min-h-screen w-full overflow-x-hidden selection:bg-cyan-500/30">
      <Hero />

      <div className="relative z-10 px-4 pb-16">
        <div id="explore" className="mx-auto w-full max-w-7xl px-4">
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
            <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
              Algorithms
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
          </div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {ALGORITHMS.map((algo, index) => (
              <AlgoCard
                key={index}
                title={algo.title}
                description={algo.description}
                color={algo.color}
                link={algo.link}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
