import React from 'react'
import StackVisualizer from './StackVisualizer'
import { motion } from 'framer-motion'
import DifficultyBadge from '../DifficultyBadge'
import LearningPathSuggestions from '../LearningPathSuggestions'

export default function StackVisualizerPage() {
  return (
    <motion.div
      className="w-full bg-slate-950/50 mx-auto min-h-screen shadow-2xl rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
            Stack Visualizer
          </p>
          <DifficultyBadge size="xs" />
        </div>
      </div>

      {/* Main Visualizer Component */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22 }}
      >
        <StackVisualizer />
      </motion.div>

      {/* Footer / Learning Paths */}
      <div className="px-4 sm:px-6 pb-6 pt-2">
        <LearningPathSuggestions />
      </div>
    </motion.div>
  )
}
