import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getCompletedAlgorithms,
  getCompletionPercentage,
  getLearningStreak,
  subscribeCompletionChange,
} from '../lib/completion'
import { ALGORITHMS, OPERATING_SYSTEMS } from '../data/visualizerData'

const TOTAL_VISUALIZERS = ALGORITHMS.length + OPERATING_SYSTEMS.length + 1

export default function ProgressTracker() {
  const [completed, setCompleted] = useState(() => getCompletedAlgorithms())
  const [streak, setStreak] = useState(() => getLearningStreak())

  useEffect(() => {
    const unsub = subscribeCompletionChange(() => {
      setCompleted(getCompletedAlgorithms())
      setStreak(getLearningStreak())
    })
    return unsub
  }, [])

  const percentage = getCompletionPercentage(TOTAL_VISUALIZERS)
  const count = completed.length
  const nextAlgo = computeNextAlgorithm(completed)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-semibold text-slate-300">
                Learning Progress
              </h3>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                  <span role="img" aria-label="fire">
                    🔥
                  </span>{' '}
                  {streak}-day streak
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {count} of {TOTAL_VISUALIZERS} algorithms completed
            </p>
            <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {nextAlgo && (
              <Link
                to={nextAlgo.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold rounded-xl bg-cyan-600 px-4 py-2.5 text-white transition-all duration-300 hover:bg-cyan-500 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                Resume Learning
                <span className="text-cyan-200">→</span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function computeNextAlgorithm(completed) {
  const all = [...ALGORITHMS, ...OPERATING_SYSTEMS]
  for (const algo of all) {
    if (!completed.includes(algo.id)) {
      return algo
    }
  }
  return null
}
