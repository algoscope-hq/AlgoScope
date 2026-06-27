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
import { ALGORITHMS, OPERATING_SYSTEMS } from '../data/visualizerData'
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
