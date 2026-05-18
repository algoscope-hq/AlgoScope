import React, { useState, useMemo } from 'react'
import { CanvasShortestPath } from './CanvasShortestPath'
import CodePanel from '../visualizer/CodePanel'
import { MenuSelectNodesShortestPath } from './MenuSelectNodesShortestPath'
import { MenuSetAlgoShortestPath } from './MenuSetAlgoShortestPath'
import { motion } from 'framer-motion'
import SpeedSlider from '../SpeedSlider'
import { shortestPathSources } from '../../algorithms/searching/shortestPathSources'
import ComplexityCard from '../ComplexityCard'
import Tooltip from '../Tooltip'
import ComparisonMode from './ComparisonMode'

export const ShortestPathPage = () => {
  const [algorithm, setAlgorithm] = useState(null)
  const [source, setSource] = useState(null)
  const [target, setTarget] = useState(null)
  const [speed, setSpeed] = useState(1.0)
  const [language, setLanguage] = useState('javascript')
  const [runKey, setRunKey] = useState(null)

  // ✅ NEW: mode toggle
  const [mode, setMode] = useState('solo') // 'solo' | 'compare'

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue)
  }

  const handleRun = () => {
    if (!algorithm || !source || !target) return
    setRunKey((k) => (k === null ? 0 : k + 1))
  }

  const handleReset = () => {
    setAlgorithm(null)
    setSource(null)
    setTarget(null)
    setRunKey(null)
  }

  const canRun = !!algorithm && !!source && !!target

  const currentSource = useMemo(() => {
    if (!algorithm || !shortestPathSources[algorithm]) return null
    return shortestPathSources[algorithm][language]?.code ?? ''
  }, [algorithm, language])

  const getAlgorithmName = (algo) => {
    const names = {
      dijkstra: "Dijkstra's",
      bellmanford: 'Bellman-Ford',
      floydwarshall: 'Floyd-Warshall',
    }
    return names[algo] || algo
  }

  return (
    <motion.div
      className="w-full flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-slate-950/50 min-h-screen rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* LEFT PANEL */}
      <div className="w-full lg:w-1/4 p-4 flex flex-col gap-6 bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 text-center mb-1">
            Shortest Path Visualizer
          </p>
          <h2 className="text-xl font-bold text-center text-white tracking-tight">
            Controls
          </h2>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('solo')}
            className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'solo'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Solo
          </button>

          <button
            onClick={() => setMode('compare')}
            className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'compare'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Compare
          </button>
        </div>

        {/* How to use stepper */}
        <div className="bg-slate-950/60 rounded-xl border border-white/5 p-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
            How to use
          </p>
          <Tooltip content="Switch the code language" position="top" className="w-full">
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
          </Tooltip>
          {[
            { step: '1', label: 'Pick an algorithm' },
            { step: '2', label: 'Choose source & target' },
            { step: '3', label: 'Press Run' },
          ].map(({ step, label }) => {
            const done =
              (step === '1' && algorithm) ||
              (step === '2' && source && target) ||
              (step === '3' && runKey !== null)

            return (
              <div key={step} className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                    done
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {done ? '✓' : step}
                </span>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    done ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Run / Reset */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleRun}
            disabled={!canRun || mode === 'compare'}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              canRun && mode !== 'compare'
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:scale-[1.02]'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }`}
          >
            ▶ Run
          </button>

          <button
            onClick={handleReset}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all duration-300"
          >
            ↺ Reset
          </button>
        </div>

        <MenuSetAlgoShortestPath
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />
        <MenuSelectNodesShortestPath
          source={source}
          target={target}
          setSource={setSource}
          setTarget={setTarget}
        />
        <SpeedSlider value={speed} onChange={handleSpeedChange} />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-3/4 flex flex-col gap-6">
        {mode === 'solo' ? (
          <>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <CanvasShortestPath
                algorithm={algorithm}
                source={source}
                target={target}
                speed={speed}
                runKey={runKey}
              />
            </div>

            <ComplexityCard algorithm={algorithm} />

            <div className="w-full">
              <CodePanel
                title={
                  algorithm
                    ? `${getAlgorithmName(algorithm)} Implementation`
                    : 'Code Viewer'
                }
                code={
                  currentSource ||
                  '// Select an algorithm and nodes to see implementation'
                }
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </>
        ) : (
          <ComparisonMode />
        )}
      </div>
    </motion.div>
  )
}
