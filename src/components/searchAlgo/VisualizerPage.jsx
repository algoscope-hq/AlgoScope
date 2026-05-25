// import React, { useState, useMemo } from 'react'
// import { CanvasSearching } from './CanvasSearching'
// import CodePanel from '../visualizer/CodePanel'
// import { MenuSelectNodeSearch } from './MenuSelectNodeSearch'
// import { MenuSelectAlgorithm } from './MenuSelectAlgorithm'
// import { motion } from 'framer-motion'
// import SpeedSlider from '../SpeedSlider'
// import { graphSearchSources } from '../../algorithms/searching/graphSearchSources'
// import ComplexityCard from '../ComplexityCard'
// import ComparisonMode from './ComparisonMode'

// export const VisualizerPage = () => {
//   const [node, setNode] = useState(null)
//   const [algorithm, setAlgorithm] = useState(null)
//   const [speed, setSpeed] = useState(1.0)
//   const [language, setLanguage] = useState('javascript')
//   const [runKey, setRunKey] = useState(null)

//   const handleSpeedChange = (event, newValue) => {
//     setSpeed(newValue)
//   }

//   const handleRun = () => {
//     if (!algorithm || !node) return
//     setRunKey((k) => (k === null ? 0 : k + 1))
//   }

//   const handleReset = () => {
//     setNode(null)
//     setAlgorithm(null)
//     setRunKey(null)
//   }

//   const canRun = !!algorithm && !!node

//   const currentSource = useMemo(() => {
//     if (!algorithm || !graphSearchSources[algorithm]) return null
//     return graphSearchSources[algorithm][language]?.code ?? ''
//   }, [algorithm, language])

//   return (
//     <motion.div
//       className="w-full flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, ease: 'easeInOut' }}
//     >
//       {/* Left Panel: Controls */}
//       <div className="w-full lg:w-1/4 p-4 flex flex-col gap-6 bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm overflow-y-auto">
//         {/* Header */}
//         <div className="border-b border-white/10 pb-4">
//           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 text-center mb-1">
//             Graph Search Visualizer
//           </p>
//           <h2 className="text-xl font-bold text-center text-white tracking-tight">
//             Controls
//           </h2>
//         </div>

//         {/* How to use stepper */}
//         <div className="bg-slate-950/60 rounded-xl border border-white/5 p-3 space-y-2">
//           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
//             How to use
//           </p>
//           {[
//             { step: '1', label: 'Pick an algorithm' },
//             { step: '2', label: 'Choose a starting node' },
//             { step: '3', label: 'Press Run' },
//           ].map(({ step, label }) => {
//             const done =
//               (step === '1' && algorithm) ||
//               (step === '2' && node) ||
//               (step === '3' && runKey !== null)
//             return (
//               <div key={step} className="flex items-center gap-3">
//                 <span
//                   className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
//                     done
//                       ? 'bg-cyan-500 text-white'
//                       : 'bg-slate-700 text-slate-400'
//                   }`}
//                 >
//                   {done ? '✓' : step}
//                 </span>
//                 <span
//                   className={`text-sm transition-colors duration-300 ${
//                     done ? 'text-slate-200' : 'text-slate-500'
//                   }`}
//                 >
//                   {label}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* Run / Reset buttons */}
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={handleRun}
//             disabled={!canRun}
//             className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
//               canRun
//                 ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:scale-[1.02]'
//                 : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
//             }`}
//           >
//             ▶ Run
//           </button>
//           <button
//             onClick={handleReset}
//             className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all duration-300"
//           >
//             ↺ Reset
//           </button>
//         </div>

//         <MenuSelectAlgorithm
//           algorithm={algorithm}
//           setAlgorithm={setAlgorithm}
//         />
//         <MenuSelectNodeSearch node={node} setNode={setNode} />
//         <SpeedSlider value={speed} onChange={handleSpeedChange} />
//       </div>

//       {/* Right Panel: Visualization and Code */}
//       <div className="w-full lg:w-3/4 flex flex-col gap-6">
//         <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
//           <CanvasSearching
//             algorithm={algorithm}
//             vertex={node}
//             speed={speed}
//             runKey={runKey}
//           />
//         </div>
//         <ComplexityCard algorithm={algorithm} />
//         <div className="w-full">
//           <CodePanel
//             title={
//               algorithm
//                 ? `${algorithm.toUpperCase()} Implementation`
//                 : 'Code Viewer'
//             }
//             code={
//               currentSource ||
//               '// Select an algorithm and node to see implementation'
//             }
//             language={language}
//             onLanguageChange={setLanguage}
//           />
//         </div>
//       </div>
//     </motion.div>
//   )
// }
import React, { useMemo } from 'react'
import { CanvasSearching } from './CanvasSearching'
import CodePanel from '../visualizer/CodePanel'
import { MenuSelectNodeSearch } from './MenuSelectNodeSearch'
import { MenuSelectAlgorithm } from './MenuSelectAlgorithm'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider'
import { graphSearchSources } from '../../algorithms/searching/graphSearchSources'
import ComplexityCard from '../ComplexityCard'
import ComparisonMode from './ComparisonMode'

export const VisualizerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'compare' ? 'compare' : 'solo'

  const setMode = (newMode) => {
    const newParams = new URLSearchParams(searchParams)
    if (newMode === 'compare') {
      newParams.set('mode', 'compare')
    } else {
      newParams.delete('mode')
    }
    setSearchParams(newParams)
  }

  const [node, setNode] = React.useState(null)
  const [algorithm, setAlgorithm] = React.useState(null)
  const [speed, setSpeed] = React.useState(1.0)
  const [language, setLanguage] = React.useState('javascript')
  const [runKey, setRunKey] = React.useState(null)
  // Live list of node IDs from the canvas (kept in sync via onGraphChange)
  const [nodeIds, setNodeIds] = React.useState(
    Array.from({ length: 15 }, (_, i) => i + 1)
  )

  const handleGraphChange = React.useCallback(
    (ids) => {
      setNodeIds(ids)
      // Deselect starting node if it no longer exists on canvas
      if (node !== null && !ids.includes(parseInt(node))) {
        setNode(null)
      }
    },
    [node]
  )

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue)
  }

  const handleRun = () => {
    if (!algorithm || !node) return
    setRunKey((k) => (k === null ? 0 : k + 1))
  }

  const handleReset = () => {
    setNode(null)
    setAlgorithm(null)
    setRunKey(null)
  }

  const canRun = !!algorithm && !!node

  const currentSource = useMemo(() => {
    if (!algorithm || !graphSearchSources[algorithm]) return null
    return graphSearchSources[algorithm][language]?.code ?? ''
  }, [algorithm, language])

  return (
    <motion.div
      className="w-full flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/4 p-4 flex flex-col gap-6 bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 text-center mb-1">
            Graph Search Visualizer
          </p>
          <h2 className="text-xl font-bold text-center text-white tracking-tight">
            Controls
          </h2>
        </div>

        {/* Mode Toggle (NEW) */}
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

        {/* How to use stepper (only in solo mode visually relevant, but kept global) */}
        <div className="bg-slate-950/60 rounded-xl border border-white/5 p-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
            How to use
          </p>
          {[
            { step: '1', label: 'Build your graph (toolbar on canvas)' },
            { step: '2', label: 'Pick an algorithm' },
            { step: '3', label: 'Choose a starting node' },
            { step: '4', label: 'Press Run' },
          ].map(({ step, label }) => {
            const done =
              (step === '1' && nodeIds.length > 0) ||
              (step === '2' && algorithm) ||
              (step === '3' && node) ||
              (step === '4' && runKey !== null)

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

        {/* Run / Reset buttons */}
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

        <MenuSelectAlgorithm
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />
        <MenuSelectNodeSearch node={node} setNode={setNode} nodeIds={nodeIds} />
        <SpeedSlider value={speed} onChange={handleSpeedChange} />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-3/4 flex flex-col gap-6">
        {mode === 'solo' ? (
          <>
            <div className="rounded-xl border border-white/10 shadow-lg">
              <CanvasSearching
                algorithm={algorithm}
                vertex={node}
                speed={speed}
                runKey={runKey}
                onGraphChange={handleGraphChange}
              />
            </div>

            <ComplexityCard algorithm={algorithm} />

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
