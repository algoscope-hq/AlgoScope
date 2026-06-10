import React from 'react'
import Visualizer from './Visualizer'
import ComparisonMode from './ComparisonMode'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import DifficultyBadge from '../DifficultyBadge'
import LearningPathSuggestions from '../LearningPathSuggestions'

export default function VisualizerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('mode') === 'compare' ? 'compare' : 'solo'

  const setActiveTab = (tab) => {
    const newParams = new URLSearchParams(searchParams)
    if (tab === 'compare') {
      newParams.set('mode', 'compare')
    } else {
      newParams.delete('mode')
    }
    setSearchParams(newParams)
  }

  return (
    <motion.div
      className="w-full bg-slate-950/50 mx-auto min-h-screen shadow-2xl rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Header with tabs */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
            Sorting Visualizer
          </p>
          <DifficultyBadge size="xs" />
        </div>

        {/* Tab switcher */}
        <div
          className="flex rounded-xl p-1 gap-1 self-start sm:self-auto"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(51,65,85,0.6)',
          }}
        >
          <button
            onClick={() => setActiveTab('solo')}
            className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{ color: activeTab === 'solo' ? '#fff' : '#64748b' }}
          >
            {activeTab === 'solo' && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'rgba(6,182,212,0.2)',
                  border: '1px solid rgba(6,182,212,0.4)',
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative">Solo Mode</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
            style={{ color: activeTab === 'compare' ? '#fff' : '#64748b' }}
          >
            {activeTab === 'compare' && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'rgba(6,182,212,0.2)',
                  border: '1px solid rgba(6,182,212,0.4)',
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative">⚡ Compare</span>
            <span
              className="relative text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(6,182,212,0.25)', color: '#22d3ee' }}
            >
              NEW
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'solo' ? (
          <motion.div
            key="solo"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.22 }}
          >
            <Visualizer />
          </motion.div>
        ) : (
          <motion.div
            key="compare"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22 }}
          >
            <ComparisonMode />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="px-4 sm:px-6 pb-6 pt-2">
        <LearningPathSuggestions />
      </div>
    </motion.div>
  )
}
