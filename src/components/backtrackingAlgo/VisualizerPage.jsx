import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider'
import ComplexityCard from '../ComplexityCard'
import CodePanel from '../visualizer/CodePanel'
import { CanvasNQueens } from './CanvasNQueens'
import { CanvasSudoku } from './CanvasSudoku'
import { CanvasTowerOfHanoi } from './CanvasTowerOfHanoi'
import { MenuSetAlgoBacktracking } from './MenuSetAlgoBacktracking'
import { ComparisonMode } from './ComparisonMode'
import { getBacktrackingSource } from '../../algorithms/backtracking/backtrackingSources'

export default function VisualizerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('mode') === 'compare' ? 'compare' : 'solo'

  const setActiveTab = (tab) => {
    const p = new URLSearchParams(searchParams)
    if (tab === 'compare') p.set('mode', 'compare')
    else p.delete('mode')
    setSearchParams(p)
  }

  return (
    <motion.div
      className="w-full bg-slate-950/50 mx-auto min-h-screen shadow-2xl rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Header + tab switcher */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Backtracking Visualizer
        </p>

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
                layoutId="bt-tab-bg"
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
            <span className="relative">Solo Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
            style={{ color: activeTab === 'compare' ? '#fff' : '#64748b' }}
          >
            {activeTab === 'compare' && (
              <motion.div
                layoutId="bt-tab-bg"
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
            <span className="relative">⚡ Compare</span>

            <span
              className="relative text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                background: 'rgba(6,182,212,0.25)',
                color: '#22d3ee',
              }}
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
            <SoloMode />
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
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Solo Mode
// ─────────────────────────────────────────────────────────────

function SoloMode() {
  const [algo, setAlgo] = useState('nqueens')
  const [boardSize, setBoardSize] = useState(6)
  const [diskCount, setDiskCount] = useState(4)
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')
  const [trigger, setTrigger] = useState(0)

  const handleVisualize = () => setTrigger((t) => t + 1)
  const handleReset = () => setTrigger(0)

  const handleAlgoChange = (a) => {
    setAlgo(a)
    setTrigger(0)
  }

  const currentSource = useMemo(
    () => getBacktrackingSource(algo, language),
    [algo, language]
  )

  const complexityKey =
    algo === 'nqueens' ? 'nqueens' : algo === 'hanoi' ? 'hanoi' : 'sudoku'

  return (
    <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 xl:w-1/5 p-4 flex flex-col justify-between bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-white border-b border-white/10 pb-4 tracking-tight">
          Controls
        </h2>

        <MenuSetAlgoBacktracking
          algo={algo}
          setAlgo={handleAlgoChange}
          boardSize={boardSize}
          setBoardSize={setBoardSize}
          diskCount={diskCount}
          setDiskCount={setDiskCount}
          onVisualize={handleVisualize}
          onReset={handleReset}
        />

        <div className="mt-6">
          <SpeedSlider value={speed} onChange={(e, v) => setSpeed(v)} />
        </div>

        <div className="pt-4 border-t border-white/5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
            Code Language
          </p>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
          </select>
        </div>

        <ComplexityCard algorithm={complexityKey} compact />
      </div>

      {/* Canvas + Code Panel */}
      <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col gap-6">
        {algo === 'nqueens' ? (
          <CanvasNQueens n={boardSize} speed={speed} trigger={trigger} />
        ) : algo === 'hanoi' ? (
          <CanvasTowerOfHanoi
            diskCount={diskCount}
            speed={speed}
            trigger={trigger}
          />
        ) : (
          <CanvasSudoku speed={speed} trigger={trigger} />
        )}

        <CodePanel
          title={
            algo === 'nqueens'
              ? 'N-Queens Implementation'
              : algo === 'hanoi'
                ? 'Tower of Hanoi Implementation'
                : 'Sudoku Solver Implementation'
          }
          code={currentSource}
          language={language}
        />
      </div>
    </div>
  )
}
