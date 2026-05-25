import React, { useMemo } from 'react'
import { CanvasShortestPath } from './CanvasShortestPath'
import GridVisualizer from './GridVisualizer'
import CodePanel from '../visualizer/CodePanel'
import { MenuSelectNodesShortestPath } from './MenuSelectNodesShortestPath'
import { MenuSetAlgoShortestPath } from './MenuSetAlgoShortestPath'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider'
import { shortestPathSources } from '../../algorithms/searching/shortestPathSources'
import ComplexityCard from '../ComplexityCard'
import ComparisonMode from './ComparisonMode'

export const ShortestPathPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const mode = searchParams.get('mode') === 'compare' ? 'compare' : 'solo'

  const [viewMode, setViewMode] = React.useState('network')

  const setMode = React.useCallback(
    (newMode) => {
      const newParams = new URLSearchParams(searchParams)

      if (newMode === 'compare') {
        newParams.set('mode', 'compare')
      } else {
        newParams.delete('mode')
      }

      setSearchParams(newParams)
    },
    [searchParams, setSearchParams]
  )

  const [algorithm, setAlgorithm] = React.useState(null)
  const [source, setSource] = React.useState(null)
  const [target, setTarget] = React.useState(null)
  const [speed, setSpeed] = React.useState(1.0)
  const [language, setLanguage] = React.useState('javascript')
  const [runKey, setRunKey] = React.useState(null)
  // Live list of node IDs from the canvas (kept in sync via onGraphChange)
  const [nodeIds, setNodeIds] = React.useState(
    Array.from({ length: 9 }, (_, i) => i + 1)
  )

  const handleGraphChange = React.useCallback(
    (ids) => {
      setNodeIds(ids)
      if (source !== null && !ids.includes(parseInt(source))) setSource(null)
      if (target !== null && !ids.includes(parseInt(target))) setTarget(null)
    },
    [source, target]
  )

  const handleSpeedChange = (_, newValue) => {
    setSpeed(newValue)
  }

  const handleRun = () => {
    if (!algorithm) return

    if (viewMode === 'network') {
      if (algorithm === 'kruskal') {
        // Kruskal's needs no source/target
      } else if (algorithm === 'prim') {
        if (!source) return
      } else {
        if (!source || !target) return
      }
    }

    setRunKey((prev) => (prev === null ? 0 : prev + 1))
  }

  const handleReset = () => {
    setAlgorithm(null)
    setSource(null)
    setTarget(null)
    setRunKey(null)
  }

  const canRun =
    viewMode === 'grid'
      ? !!algorithm
      : algorithm === 'kruskal'
        ? !!algorithm
        : algorithm === 'prim'
          ? !!algorithm && !!source
          : !!algorithm && !!source && !!target

  const currentSource = useMemo(() => {
    if (!algorithm) return ''

    const algoSource = shortestPathSources[algorithm]

    if (!algoSource) return ''

    const viewSource = algoSource[viewMode]

    if (!viewSource) return ''

    return viewSource[language]?.code ?? ''
  }, [algorithm, language, viewMode])

  const getAlgorithmName = (algo) => {
    const names = {
      dijkstra: "Dijkstra's",
      bellmanford: 'Bellman-Ford',
      floydwarshall: 'Floyd-Warshall',
      prim: "Prim's MST",
      kruskal: "Kruskal's MST",
    }

    return names[algo] || algo
  }

  React.useEffect(() => {
    if (algorithm === 'prim' || algorithm === 'kruskal') {
      if (viewMode === 'grid') setViewMode('network')
      if (mode === 'compare') setMode('solo')
    }
  }, [algorithm, viewMode, mode, setMode])

  return (
    <motion.div
      className="w-full flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-slate-950/50 min-h-screen rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        ease: 'easeInOut',
      }}
    >
      <div className="w-full lg:w-1/4 p-4 flex flex-col gap-6 bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm overflow-y-auto">
        <div className="border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 text-center mb-1">
            Shortest Path Visualizer
          </p>

          <h2 className="text-xl font-bold text-center text-white tracking-tight">
            Controls
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('network')}
            className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'network'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Network View
          </button>

          <button
            onClick={() => setViewMode('grid')}
            disabled={algorithm === 'prim' || algorithm === 'kruskal'}
            className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-600 text-white'
                : algorithm === 'prim' || algorithm === 'kruskal'
                  ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-white/5'
                  : 'bg-slate-800 text-slate-400'
            }`}
          >
            Grid View
          </button>
        </div>

        {viewMode === 'network' && (
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
              disabled={algorithm === 'prim' || algorithm === 'kruskal'}
              className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'compare'
                  ? 'bg-cyan-600 text-white'
                  : algorithm === 'prim' || algorithm === 'kruskal'
                    ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-white/5'
                    : 'bg-slate-800 text-slate-400'
              }`}
            >
              Compare
            </button>
          </div>
        )}

        <div className="bg-slate-950/60 rounded-xl border border-white/5 p-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
            How to use
          </p>

          {[
            ...(viewMode === 'network'
              ? [
                  {
                    step: '1',
                    label: 'Build your graph (toolbar on canvas)',
                  },
                ]
              : []),
            {
              step: viewMode === 'network' ? '2' : '1',
              label: 'Pick an algorithm',
            },
            {
              step: viewMode === 'network' ? '3' : '2',
              label:
                viewMode === 'grid'
                  ? 'Build your grid'
                  : 'Choose source & target',
            },
            {
              step: viewMode === 'network' ? '4' : '3',
              label: 'Press Run',
            },
          ].map(({ step, label }) => {
            const done =
              (viewMode === 'network' && step === '1' && nodeIds.length > 0) ||
              ((viewMode === 'network' ? step === '2' : step === '1') &&
                algorithm) ||
              ((viewMode === 'network' ? step === '3' : step === '2') &&
                (viewMode === 'grid' ? true : source && target)) ||
              ((viewMode === 'network' ? step === '4' : step === '3') &&
                runKey !== null)

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

        {viewMode === 'network' && (
          <MenuSelectNodesShortestPath
            source={source}
            target={target}
            setSource={setSource}
            setTarget={setTarget}
            algorithm={algorithm}
            nodeIds={nodeIds}
          />
        )}

        <SpeedSlider value={speed} onChange={handleSpeedChange} />
      </div>

      <div className="w-full lg:w-3/4 flex flex-col gap-6">
        {viewMode === 'network' ? (
          <>
            {mode === 'solo' ? (
              <>
                <div className="rounded-xl border border-white/10 shadow-lg">
                  <CanvasShortestPath
                    algorithm={algorithm}
                    source={source}
                    target={target}
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
          </>
        ) : (
          <>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <GridVisualizer
                algorithm={algorithm}
                speed={speed}
                runKey={runKey}
              />
            </div>

            <ComplexityCard algorithm={algorithm} />

            <div className="w-full">
              <CodePanel
                title={
                  algorithm
                    ? `${getAlgorithmName(algorithm)} Grid Implementation`
                    : 'Code Viewer'
                }
                code={
                  currentSource ||
                  '// Select an algorithm to see implementation'
                }
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
