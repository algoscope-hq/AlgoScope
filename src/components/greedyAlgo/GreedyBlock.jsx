import React from 'react'
import { motion } from 'framer-motion'

/**
 * GreedyBlock – a premium styled card used by the greedy algorithm visualizers.
 * It displays a title and an optional description/content.
 * The design mirrors the existing UI (glassmorphism, dark mode, subtle motion).
 */
export default function GreedyBlock({ title, children }) {
  return (
    <motion.div
      className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl hover:border-cyan-500/50 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
        {title}
      </h3>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </motion.div>
  )
}
