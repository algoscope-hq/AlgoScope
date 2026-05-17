import React from 'react'
import AlgoCard from './AlgoCard'
import SortingImg from '../assets/new-home-images/array.png'
import SearchingImg from '../assets/new-home-images/traversal.png'
import LinearSearchImg from '../assets/new-home-images/search.png'
import GraphAlgoImg from '../assets/new-home-images/shortestPath.png'
import KadaneImg from '../assets/new-home-images/KadaneImg.png'
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
    color: 'bg-slate-900/50 border-blue-500/30 hover:border-blue-400',
    link: '/sort',
    image: SortingImg,
    imageAlt: 'Array elements being rearranged for sorting algorithms',
  },
  {
    title: 'Searching',
    description: 'Explore BFS, DFS, and other traversal methods.',
    color: 'bg-slate-900/50 border-cyan-500/30 hover:border-cyan-400',
    link: '/search',
    image: SearchingImg,
    imageAlt: 'Graph traversal nodes and paths for searching algorithms',
  },
  {
    title: 'Graph Algorithms',
    description: 'Dijkstra, Floyd-Warshall, and Topological Sort.',
    color: 'bg-slate-900/50 border-purple-500/30 hover:border-purple-400',
    link: '/spath',
    image: GraphAlgoImg,
    imageAlt: 'Weighted graph path visualization for shortest path algorithms',
  },
  {
    title: 'Array Search',
    description: 'Linear and Binary search visualization.',
    color: 'bg-slate-900/50 border-orange-500/30 hover:border-orange-400',
    link: '/ldssearch',
    image: LinearSearchImg,
    imageAlt: 'Array search visualization highlighting a target value',
  },
  {
    title: 'Abstract Data Types',
    description: 'Stacks, Queues, Linked Lists (Beta).',
    color: 'bg-slate-900/50 border-emerald-500/30 hover:border-emerald-400',
    link: '/adt',
    image: adt,
    imageAlt: 'Stack, queue, and linked list data structure visualization',
  },
  {
    title: 'Kadane Algorithm',
    description: 'Visualize Maximum Subarray Sum using Kadane’s Algorithm.',
    color: 'bg-slate-900/50 border-pink-500/30 hover:border-pink-400',
    link: '/kadane',
    image: KadaneImg,
    imageAlt: 'Kadane algorithm visualization for maximum subarray sum',
  },
]

export const Home = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[300px] w-[300px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500 opacity-10 blur-[120px]"></div>
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
              v1.2.0
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
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:scale-105 hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
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
            <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">
              Algorithms
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
