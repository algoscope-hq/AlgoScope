import React from 'react'
import AlgoCard from './AlgoCard'
import SortingImg from '../assets/new-home-images/array.png'
import SearchingImg from '../assets/new-home-images/traversal.png'
import LinearSearchImg from '../assets/new-home-images/search.png'
import GraphAlgoImg from '../assets/new-home-images/shortestPath.png'
import KadaneImg from '../assets/new-home-images/KadaneImg.png'
import MooreVotingImg from '../assets/new-home-images/MooreVoting.png'
import { MathSoloVisualizer } from './MathTheory/MathSoloVisualizer'
import adt from '../assets/new-home-images/adt.png'
import { motion } from 'framer-motion'

// Animation Variants
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
    image: SortingImg,
    imageAlt: 'Array elements being rearranged for sorting algorithms',
  },
  {
    title: 'Searching',
    description: 'Explore BFS, DFS, and other traversal methods.',
    color: 'theme-card border-cyan-500/30 hover:border-cyan-400',
    link: '/search',
    image: SearchingImg,
    imageAlt: 'Graph traversal nodes and paths for searching algorithms',
  },
  {
    title: 'Graph Algorithms',
    description: 'Dijkstra, Floyd-Warshall, and Topological Sort.',
    color: 'theme-card border-purple-500/30 hover:border-purple-400',
    link: '/spath',
    image: GraphAlgoImg,
    imageAlt: 'Weighted graph path visualization for shortest path algorithms',
  },
  {
    title: 'Array Search',
    description: 'Linear and Binary search visualization.',
    color: 'theme-card border-orange-500/30 hover:border-orange-400',
    link: '/ldssearch',
    image: LinearSearchImg,
    imageAlt: 'Array search visualization highlighting a target value',
  },
  {
    title: 'Abstract Data Types',
    description:
      'Stacks, Queues, Binary Trees, Binary Heaps, and Priority Queues.',
    color: 'theme-card border-emerald-500/30 hover:border-emerald-400',
    link: '/adt',
    image: adt,
    imageAlt:
      'Stacks, Queues, Binary Trees, Binary Heaps, and Priority Queues data structures',
  },
  {
    title: 'Kadane Algorithm',
    description: 'Visualize Maximum Subarray Sum using Kadane’s Algorithm.',
    color: 'theme-card border-pink-500/30 hover:border-pink-400',
    link: '/kadane',
    image: KadaneImg,
    imageAlt: 'Kadane algorithm visualization for maximum subarray sum',
  },
  {
    title: "Moore's Voting Algorithm",
    description:
      "Visualize the Moore's Voting Algorithm for finding the majority element.",
    color: 'theme-card border-green-500/30 hover:border-green-400',
    link: '/moore-voting',
    image: MooreVotingImg,
    imageAlt:
      "Moore's Voting algorithm visualization for finding the majority element",
  },
  {
    title: 'Math Theory',
    description:
      'Visualize GCD, Fast Exponentiation, and Bit Manipulation step-by-step.',
    color: 'theme-card border-indigo-500/30 hover:border-indigo-400',
    link: '/math-theory',
    image: KadaneImg, // or create/import a proper Math image if you have one
    imageAlt: 'Mathematical algorithms visualization',
  },
]

export const Home = () => {
  return (
    <div className="theme-home relative min-h-screen w-full overflow-hidden selection:bg-cyan-500/30">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="theme-grid absolute inset-0 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="theme-glow-cyan absolute left-0 right-0 top-0 -z-10 m-auto h-[300px] w-[300px] rounded-full blur-[100px]"></div>
        <div className="theme-glow-purple absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-4">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
              v1.5.0
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter logo-font">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500">
              Algo
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-purple-500">
              Scope
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Unravel the complexity of code. <br className="hidden md:block" />
            <span className="text-cyan-300 font-mono">Visualize</span>{' '}
            algorithms in real-time.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('explore')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
              className="theme-button-secondary inline-flex items-center justify-center px-8 py-4 text-base font-bold transition-all duration-200 border rounded-lg hover:scale-105 hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Start Exploring
            </a>
            <a
              href="/practice"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-emerald-300 transition-all duration-200 bg-emerald-500/[0.06] border border-emerald-400/30 rounded-lg backdrop-blur-md hover:text-emerald-100 hover:bg-emerald-500/10 hover:border-emerald-400/60 hover:scale-105 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Practice
            </a>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <div id="explore" className="w-full max-w-7xl mx-auto mt-32 px-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            <span className="text-neutral-400 font-mono text-sm uppercase tracking-[0.3em]">
              Algorithms
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {ALGORITHMS.map((algo, index) => (
              <AlgoCard
                key={index}
                title={algo.title}
                description={algo.description}
                color={algo.color}
                link={algo.link}
                image={algo.image}
                imageAlt={algo.imageAlt}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
