import React from 'react'
import ChallengeVisualizer from './ChallengeVisualizer'
import { motion } from 'framer-motion'

export default function ChallengePage() {
  return (
    <motion.div
      className="w-full bg-slate-950/50 mx-auto min-h-screen shadow-2xl rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-xl pb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 flex flex-col gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Gamification
        </p>
        <h1 className="text-2xl font-bold text-white">
          Algorithm MCQ Challenge
        </h1>
        <p className="text-sm text-slate-400">
          Answer quick MCQs, earn points, build streaks, and move to the next
          question.
        </p>
      </div>

      <ChallengeVisualizer />
    </motion.div>
  )
}
