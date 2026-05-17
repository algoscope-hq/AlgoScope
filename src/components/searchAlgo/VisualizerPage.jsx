import React, { useState, useMemo } from 'react'
import { CanvasSearching } from './CanvasSearching'
import CodePanel from '../visualizer/CodePanel'
import { MenuSelectNodeSearch } from './MenuSelectNodeSearch'
import { MenuSelectAlgorithm } from './MenuSelectAlgorithm'
import { motion } from 'framer-motion'
import SpeedSlider from '../SpeedSlider'
import { graphSearchSources } from '../../algorithms/searching/graphSearchSources'
import ComplexityCard from '../ComplexityCard'
import Tooltip from '../Tooltip'

export const VisualizerPage = () => {
  const [node, setNode] = useState(null)
  const [algorithm, setAlgorithm] = useState(null)
  const [speed, setSpeed] = useState(1.0)
  const [language, setLanguage] = useState('javascript')

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue)
  }

  const currentSource = useMemo(() => {
    if (!algorithm || !graphSearchSources || !graphSearchSources[algorithm]) {
      return null
    }

    const algoData = graphSearchSources[algorithm]
    const langData = algoData[language]

    if (!langData) return null

    return typeof langData === 'string' ? langData : langData.code
  }, [algorithm, language])

  return (
    <>
      <motion.div
        className="lg:w-full w-auto flex flex-col lg:flex-row p-4 sm:p-6 bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className="w-full lg:w-1/4 xl:w-1/5 p-4 flex flex-col justify-between bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-white border-b border-white/10 pb-4 tracking-tight">
            Controls
          </h2>
          <MenuSelectAlgorithm
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
          />
          <MenuSelectNodeSearch setNode={setNode} />
          <SpeedSlider value={speed} onChange={handleSpeedChange} />

          <div className="pt-4 border-t border-white/5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
              Code Language
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
          </div>
          <ComplexityCard algorithm={algorithm} />
        </div>

        <div className="w-full xl:w-4/5 mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-6">
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <CanvasSearching
              algorithm={algorithm}
              vertex={node}
              speed={speed}
            />
          </div>
          <div className="w-full">
            <CodePanel
              title={
                algorithm
                  ? `${algorithm.toUpperCase()} Implementation`
                  : 'Code Viewer'
              }
              code={
                currentSource ||
                '// Select an algorithm and node to see implementation'
              }
              language={language}
            />
          </div>
        </div>
      </motion.div>
    </>
  )
}
