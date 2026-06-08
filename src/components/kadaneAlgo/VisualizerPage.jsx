import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SpeedSlider from '../SpeedSlider'
import ComplexityCard from '../ComplexityCard'
import CodePanel from '../visualizer/CodePanel'
import { CanvasKadane } from './CanvasKadane'
import { MenuSetAlgoKadane } from './MenuSetAlgoKadane'
import { kadaneSources } from '../../algorithms/kadane/kadaneSources'
import DifficultyBadge from '../DifficultyBadge'
import LearningPathSuggestions from '../LearningPathSuggestions'

const complexityData = {
  time: 'O(N)',
  space: 'O(1)',
}

const VisualizerPage = () => {
  const [arrayInput, setArrayInput] = useState('-2,1,-3,4,-1,2,1,-5,4')

  const [numbers, setNumbers] = useState([])
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')

  const handleVisualize = () => {
    const parsed = arrayInput
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n))

    setNumbers(parsed)
  }

  const handleReset = () => {
    setNumbers([])
    setArrayInput('-2,1,-3,4,-1,2,1,-5,4')
  }

  const currentSource = useMemo(() => {
    let code =
      kadaneSources?.kadane?.[language]?.code ||
      '// No implementation available'
    if (code !== '// No implementation available' && arrayInput) {
      code = code.replace(/\[-2,1,-3,4,-1,2,1,-5,4\]/g, `[${arrayInput}]`)
      code = code.replace(/\{-2,1,-3,4,-1,2,1,-5,4\}/g, `{${arrayInput}}`)
    }
    return code
  }, [language, arrayInput])

  return (
    <motion.div
      className="lg:w-full w-auto flex flex-col lg:flex-row p-4 sm:p-6 bg-slate-950/50 min-h-screen rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full lg:w-1/4 xl:w-1/5 p-4 flex flex-col justify-between bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-center text-white tracking-tight">
            Controls
          </h2>
          <DifficultyBadge size="xs" />
        </div>

        <MenuSetAlgoKadane
          arrayInput={arrayInput}
          setArrayInput={setArrayInput}
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

        <ComplexityCard complexity={complexityData} />
        <LearningPathSuggestions className="mt-4" />
      </div>

      <div className="w-full lg:w-3/4 xl:w-4/5 mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-6">
        <CanvasKadane numbers={numbers} speed={speed} />

        <CodePanel
          title="Kadane Algorithm Implementation"
          code={currentSource}
          language={language}
        />
      </div>
    </motion.div>
  )
}

export default VisualizerPage
