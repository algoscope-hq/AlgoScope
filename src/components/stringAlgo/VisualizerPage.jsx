import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider'
import ComplexityCard from '../ComplexityCard'
import CodePanel from '../visualizer/CodePanel'
import { MenuSetStringAlgo } from './MenuSetStringAlgo'
import { CanvasKMP } from './CanvasKMP'
import { CanvasRabinKarp } from './CanvasRabinKarp'
import { CanvasZAlgorithm } from './CanvasZAlgorithm'
import CompareMode from './CompareMode' // ← new
import { stringSources } from '../../algorithms/stringAlgo/stringSources'

const DEFAULTS = {
  kmp: { text: 'AABAACAADAABAABA', pattern: 'AABA' },
  rabinkarp: { text: 'ABCCDABCDABDC', pattern: 'ABCD' },
  zalgorithm: { text: 'AABXAABXCAABXAABXAY', pattern: 'AABX' },
}

const TITLES = {
  kmp: 'KMP Implementation',
  rabinkarp: 'Rabin-Karp Implementation',
  zalgorithm: 'Z-Algorithm Implementation',
}

// ─── Solo visualizer (extracted from original VisualizerPage) ─────────────────
function SoloMode() {
  const [algorithm, setAlgorithm] = useState('kmp')
  const [textInput, setTextInput] = useState(DEFAULTS.kmp.text)
  const [patternInput, setPatternInput] = useState(DEFAULTS.kmp.pattern)
  const [activeText, setActiveText] = useState('')
  const [activePattern, setActivePattern] = useState('')
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')

  const handleAlgorithmChange = (algo) => {
    setAlgorithm(algo)
    setTextInput(DEFAULTS[algo].text)
    setPatternInput(DEFAULTS[algo].pattern)
    setActiveText('')
    setActivePattern('')
  }

  const handleVisualize = () => {
    setActiveText(textInput.trim())
    setActivePattern(patternInput.trim())
  }

  const handleReset = () => {
    setTextInput(DEFAULTS[algorithm].text)
    setPatternInput(DEFAULTS[algorithm].pattern)
    setActiveText('')
    setActivePattern('')
  }

  const currentSource = useMemo(
    () =>
      stringSources?.[algorithm]?.[language]?.code ||
      '// No implementation available',
    [algorithm, language]
  )

  const CanvasComponent = {
    kmp: CanvasKMP,
    rabinkarp: CanvasRabinKarp,
    zalgorithm: CanvasZAlgorithm,
  }[algorithm]

  return (
    <motion.div
      className="lg:w-full w-auto flex flex-col lg:flex-row p-4 sm:p-6 bg-slate-950/50 min-h-screen rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 xl:w-1/5 p-4 flex flex-col justify-between bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-white border-b border-white/10 pb-4 tracking-tight">
          Controls
        </h2>

        <MenuSetStringAlgo
          textInput={textInput}
          setTextInput={setTextInput}
          patternInput={patternInput}
          setPatternInput={setPatternInput}
          algorithm={algorithm}
          setAlgorithm={handleAlgorithmChange}
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
          </select>
        </div>

        <ComplexityCard algorithm={algorithm} />
      </div>

      {/* Canvas */}
      <div className="w-full lg:w-3/4 xl:w-4/5 mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-6">
        <CanvasComponent
          text={activeText}
          pattern={activePattern}
          speed={speed}
        />
        <CodePanel
          title={TITLES[algorithm]}
          code={currentSource}
          language={language}
        />
      </div>
    </motion.div>
  )
}

// ─── Page root with Solo / Compare tabs ───────────────────────────────────────
export default function VisualizerPage() {
  useEffect(() => {
    document.title = 'String Algorithms | AlgoScope'
  }, [])
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('mode') === 'compare' ? 'compare' : 'solo'

  const setActiveTab = (tab) => {
    const next = new URLSearchParams(searchParams)
    tab === 'compare' ? next.set('mode', 'compare') : next.delete('mode')
    setSearchParams(next)
  }

  return (
    <motion.div
      className="w-full bg-slate-950/50 mx-auto min-h-screen shadow-2xl rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Header with tabs — identical structure to sortingAlgo/VisualizerPage */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          String Algorithms Visualizer
        </p>

        <div
          className="flex rounded-xl p-1 gap-1 self-start sm:self-auto"
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(51,65,85,0.6)',
          }}
        >
          {['solo', 'compare'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
              style={{ color: activeTab === tab ? '#fff' : '#64748b' }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="string-tab-bg"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'rgba(6,182,212,0.2)',
                    border: '1px solid rgba(6,182,212,0.4)',
                  }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative capitalize">
                {tab === 'compare' ? '⚡ Compare' : 'Solo Mode'}
              </span>
              {tab === 'compare' && (
                <span
                  className="relative text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    background: 'rgba(6,182,212,0.25)',
                    color: '#22d3ee',
                  }}
                >
                  NEW
                </span>
              )}
            </button>
          ))}
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
            <CompareMode />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
