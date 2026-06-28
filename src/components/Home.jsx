import React, { useState } from 'react'
import AlgoCard from './AlgoCard'
import { Hero } from './hero/Hero'
import { motion } from 'framer-motion'
import { GuidedTour } from './GuidedTour'
import {
  Eye,
  MousePointerClick,
  Settings2,
  BookOpen,
  BarChart3,
  Layers,
  GitBranch,
  Cpu,
  Zap,
} from 'lucide-react'

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
import { ALGORITHMS, OPERATING_SYSTEMS } from '../data/visualizerData'

const statCategories = [
  {
    label: 'Total Algorithms',
    count: ALGORITHMS.length + OPERATING_SYSTEMS.length + 1,
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  {
    label: 'Sorting Algorithms',
    count: ALGORITHMS.filter((a) => a.id === 'sorting').length,
    icon: Layers,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  {
    label: 'Graph Algorithms',
    count: ALGORITHMS.filter((a) => a.id === 'graph-algorithms').length,
    icon: GitBranch,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  {
    label: 'Dynamic Programming',
    count: ALGORITHMS.filter((a) => a.id === 'dynamic-programming' || a.id === 'dp-optimization-journey').length,
    icon: Cpu,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  {
    label: 'Recently Added',
    count: 2,
    icon: Zap,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
]

const howItWorksSteps = [
  {
    icon: MousePointerClick,
    title: 'Select an Algorithm',
    desc: 'Choose from Sorting, Graphs, DP, and more.',
  },
  {
    icon: Eye,
    title: 'Watch It Visualize',
    desc: 'See step-by-step animations in real time.',
  },
  {
    icon: Settings2,
    title: 'Control the Pace',
    desc: 'Adjust speed, pause, or step through manually.',
  },
  {
    icon: BookOpen,
    title: 'Learn & Practice',
    desc: 'Read code in multiple languages and take challenges.',
  },
]

export const Home = () => {
  const [filter, setFilter] = useState('All')

  const difficultyWeight = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  }

  const sortItems = (a, b) => {
    const weightA = difficultyWeight[a.difficulty]
    const weightB = difficultyWeight[b.difficulty]

    if (weightA !== weightB) {
      return weightA - weightB
    }
    return a.title.localeCompare(b.title)
  }

  const filteredAlgos = (
    filter === 'All'
      ? ALGORITHMS
      : ALGORITHMS.filter((algo) => algo.difficulty === filter)
  ).sort(sortItems)

  const filteredOS = (
    filter === 'All'
      ? OPERATING_SYSTEMS
      : OPERATING_SYSTEMS.filter((os) => os.difficulty === filter)
  ).sort(sortItems)

  return (
    <div className="theme-home relative min-h-screen w-full overflow-x-hidden selection:bg-cyan-500/30">
      <Hero />

      <div className="relative z-10 px-4 pb-16">
        {/* How It Works Section */}
        <div className="mx-auto w-full max-w-7xl px-4 mb-16">
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
            <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
              How It Works
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="theme-card border theme-border rounded-2xl p-6 text-center hover:border-cyan-500/40 transition-all duration-300"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold theme-text-strong mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm theme-text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Category Statistics Cards */}
        <div className="mx-auto w-full max-w-7xl px-4 mb-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
            <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
              Platform Overview
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {statCategories.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className={`theme-card border ${stat.border} ${stat.bg} rounded-2xl p-5 text-center hover:scale-[1.03] transition-all duration-300`}
                >
                  <div
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.border} border`}
                  >
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className={`text-2xl font-extrabold ${stat.color} mb-1`}>
                    {stat.count}
                  </p>
                  <p className="text-xs font-medium theme-text-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

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
                    difficulty="Intermediate"
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
