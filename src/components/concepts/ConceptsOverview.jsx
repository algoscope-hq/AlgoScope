import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ALGORITHMS, OPERATING_SYSTEMS } from '../../data/visualizerData'

const difficultyColor = {
  Beginner: 'text-emerald-400 border-emerald-500/30',
  Intermediate: 'text-amber-400 border-amber-500/30',
  Advanced: 'text-rose-400 border-rose-500/30',
}

const Section = ({ title, items }) => (
  <div className="mb-12">
    <h2 className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle mb-6 pb-2 border-b border-slate-800/60">
      {title} <span className="text-slate-500">({items.length})</span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.link}
          className="theme-card flex items-start justify-between gap-3 rounded-xl border border-slate-800/60 px-4 py-3 hover:border-cyan-500/40 transition-all duration-200 group"
        >
          <div>
            <p className="font-medium theme-text-strong group-hover:text-cyan-400 transition-colors">
              {item.title}
            </p>
            <p className="text-xs theme-text-subtle mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
          <span
            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[item.difficulty] || 'text-slate-400 border-slate-600/40'}`}
          >
            {item.difficulty}
          </span>
        </Link>
      ))}
    </div>
  </div>
)

export const ConceptsOverview = () => {
  const total = ALGORITHMS.length + OPERATING_SYSTEMS.length

  return (
    <div className="theme-home relative min-h-screen w-full px-4 pb-16 pt-24">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight theme-text-strong mb-2">
            All Concepts
          </h1>
          <p className="theme-text-subtle">
            {total} algorithms , data structures and system concepts, all in one
            place.
          </p>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Section title="Algorithms & Data Structures" items={ALGORITHMS} />
          <Section title="Operating Systems" items={OPERATING_SYSTEMS} />
        </motion.div>
      </div>
    </div>
  )
}

export default ConceptsOverview
