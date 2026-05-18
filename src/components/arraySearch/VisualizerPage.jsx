import { motion } from 'framer-motion'
import { useState } from 'react'
import Visualizer from './Visualizer'
import ComparisonMode from './ComparisonMode'

const ArrayVisualizerPage = () => {
  const [mode, setMode] = useState('solo') // 'solo' | 'compare'

  return (
    <motion.div
      className="w-full bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Array Search Visualizer
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('solo')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mode === 'solo'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Solo
          </button>

          <button
            onClick={() => setMode('compare')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mode === 'compare'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-6">
        {mode === 'solo' ? <Visualizer /> : <ComparisonMode />}
      </div>
    </motion.div>
  )
}

export default ArrayVisualizerPage
