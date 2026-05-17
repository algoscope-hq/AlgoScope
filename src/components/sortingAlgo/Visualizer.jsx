import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import Tooltip from '../Tooltip'

import * as bubble from '../../algorithms/sorting/bubbleSortSteps'
import * as selection from '../../algorithms/sorting/selectionSortSteps'
import * as insertion from '../../algorithms/sorting/insertionSortSteps'
import * as quick from '../../algorithms/sorting/quickSortSteps'
import * as merge from '../../algorithms/sorting/mergeSortSteps'
import * as heap from '../../algorithms/sorting/heapSortSteps'
import * as counting from '../../algorithms/sorting/countingSortSteps'
import * as radix from '../../algorithms/sorting/radixSortSteps'

const algoMap = {
  bubble,
  selection,
  insertion,
  quick,
  merge,
  heap,
  counting,
  radix,
}

const createRandomArray = () =>
  Array.from({ length: 8 }, () => Math.floor(Math.random() * 200) + 50)

export default function Visualizer({ algorithmType }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [baseArray, setBaseArray] = useState([50, 120, 70, 30, 200, 90, 160])
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')

  const algoFromUrl = searchParams.get('algo')
  const selectedAlgorithm =
    algoFromUrl && algoMap[algoFromUrl] ? algoFromUrl : ''

  const {
    currentStep,
    currentStepIndex,
    steps,
    hasSteps,
    isComplete,
    isPlaying,
    loadSteps,
    clear: clearPlayback,
    pause: pausePlayback,
    play: playPlayback,
    replay: replayPlayback,
    stepForward,
  } = useStepPlayback({ speed })

  const algorithmOptions = {
    simple: ['bubble', 'selection', 'insertion'],
    complex: ['quick', 'merge', 'heap'],
    integer: ['counting', 'radix'],
  }

  const handleSort = () => {
    if (selectedAlgorithm && algoMap[selectedAlgorithm]) {
      const generatorName = `generate${
        selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)
      }SortSteps`
      const generator = algoMap[selectedAlgorithm][generatorName]
      if (generator) {
        clearPlayback()
        loadSteps(generator(baseArray))
      }
    }
  }

  const handleReset = () => {
    clearPlayback()
    setSearchParams({})
    setBaseArray(createRandomArray())
  }

  const isRunning = isPlaying
  const visualArray = currentStep?.array ?? baseArray
  const activeIndices = currentStep?.indices ?? []
  const sortedIndices = currentStep?.sortedIndices ?? []

  const currentAlgoSource = useMemo(() => {
    if (!selectedAlgorithm || !algoMap[selectedAlgorithm]) return null
    const methodName = `get${
      selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)
    }SortSource`
    const getSource = algoMap[selectedAlgorithm][methodName]
    return getSource ? getSource(language) : null
  }, [selectedAlgorithm, language])

  const activeLine = useMemo(() => {
    if (
      !selectedAlgorithm ||
      !currentStep?.lineKey ||
      !algoMap[selectedAlgorithm]
    ) {
      return undefined
    }
    const methodName = `resolve${
      selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)
    }SortLine`
    const resolveLine = algoMap[selectedAlgorithm][methodName]
    return resolveLine ? resolveLine(language, currentStep.lineKey) : undefined
  }, [selectedAlgorithm, currentStep, language])

  const getStateClass = (index) => {
    if (!hasSteps) return ''
    if (sortedIndices.includes(index)) return 'sorted'
    if (activeIndices.includes(index)) {
      if (currentStep?.type === 'pivot') return 'pivot'
      if (currentStep?.type === 'min') return 'min'
      if (currentStep?.type === 'swap') return 'swap'
      if (currentStep?.type === 'compare') return 'compare'
      return 'active'
    }
    return ''
  }

  const getBarStyle = (index, value) => {
    const stateClass = getStateClass(index)
    const baseStyle = {
      height: `${value}px`,
      background: 'rgba(6, 182, 212, 0.8)',
    }

    const styles = {
      compare: {
        background: '#2563eb',
        borderColor: '#60a5fa',
        boxShadow: '0 0 18px rgba(59, 130, 246, 0.55)',
        transform: 'translateY(-4px)',
      },
      swap: {
        background: '#f59e0b',
        borderColor: '#d97706',
        boxShadow: '0 0 15px rgba(245, 158, 11, 0.45)',
      },
      pivot: {
        background: '#f43f5e',
        borderColor: '#e11d48',
        boxShadow: '0 0 15px rgba(244, 63, 94, 0.5)',
      },
      min: {
        background: '#8b5cf6',
        borderColor: '#7c3aed',
        boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
      },
      sorted: {
        background: '#0891b2',
        borderColor: '#06b6d4',
        boxShadow: '0 0 15px rgba(6, 182, 212, 0.45)',
      },
      active: {
        background: '#10b981',
        borderColor: '#059669',
        boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
      },
    }

    return stateClass ? { ...baseStyle, ...styles[stateClass] } : baseStyle
  }

  const getElementStyle = (index) => {
    const stateClass = getStateClass(index)
    const styles = {
      compare: {
        background: '#2563eb',
        color: '#fff',
        borderColor: '#60a5fa',
        transform: 'scale(1.12)',
        boxShadow:
          '0 0 0 1px rgba(147, 197, 253, 0.55), 0 0 18px rgba(59, 130, 246, 0.35)',
      },
      swap: {
        background: '#f59e0b',
        color: '#fff',
        borderColor: '#d97706',
        transform: 'scale(1.1)',
      },
      pivot: {
        background: '#f43f5e',
        color: '#fff',
        borderColor: '#e11d48',
        transform: 'scale(1.1)',
      },
      min: {
        background: '#8b5cf6',
        color: '#fff',
        borderColor: '#7c3aed',
        transform: 'scale(1.1)',
      },
      sorted: {
        background: '#0891b2',
        color: '#fff',
        borderColor: '#06b6d4',
      },
      active: {
        background: '#10b981',
        color: '#fff',
        borderColor: '#059669',
        transform: 'scale(1.1)',
      },
    }
    return stateClass ? styles[stateClass] : undefined
  }

  const handleAlgorithmChange = (event) => {
    const newAlgo = event.target.value
    clearPlayback()
    setSearchParams(newAlgo ? { algo: newAlgo } : {})
  }

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-5">
      <div className="w-full">
        <div className="flex flex-col items-center">
          <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)] overflow-hidden">
            <div className="flex min-w-0 min-h-0 flex-col gap-4">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-3 sm:p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-200">
                    Array
                  </h3>
                  <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {currentStep?.type
                      ? currentStep.type.replace('-', ' ')
                      : 'Ready'}
                  </div>
                </div>

                <div
                  id="container"
                  className="flex h-[220px] items-end justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-2xl border border-slate-700 p-2 sm:p-4 backdrop-blur-sm lg:h-[250px]"
                  style={{ background: 'rgba(30, 41, 59, 0.4)' }}
                >
                  {visualArray.map((val, idx) => (
                    <div
                      key={idx}
                      className={`bar flex-1 max-w-[42px] rounded-t-md transition-all duration-500 border border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] w-6 sm:w-8 ${getStateClass(
                        idx
                      )}`}
                      style={getBarStyle(idx, val)}
                    >
                      <div className="bar-val">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="next mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {visualArray.map((item, idx) => (
                    <span
                      key={idx}
                      className={`array-ele rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 sm:px-3 sm:py-2 font-mono text-xs sm:text-sm text-cyan-400 shadow-sm transition-all duration-300 ${getStateClass(
                        idx
                      )}`}
                      style={getElementStyle(idx)}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 sm:p-5 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
                    Step Insight
                  </p>
                  <h3 className="mt-2 text-lg sm:text-xl font-semibold text-slate-100">
                    {currentStep?.message ??
                      `Select ${
                        selectedAlgorithm
                          ? selectedAlgorithm + ' sort'
                          : 'an algorithm'
                      } and start to see steps.`}
                  </h3>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                        Active Indices
                      </p>
                      <p className="mt-1 sm:mt-2 font-mono text-base sm:text-lg text-slate-100">
                        {activeIndices.length > 0
                          ? activeIndices.join(', ')
                          : 'None'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                        Sorted Count
                      </p>
                      <p className="mt-1 sm:mt-2 font-mono text-base sm:text-lg text-slate-100">
                        {sortedIndices.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                        Variables
                      </p>
                      <p className="mt-1 sm:mt-2 font-mono text-xs sm:text-sm text-slate-100 break-words">
                        {currentStep?.variables
                          ? Object.entries(currentStep.variables)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join('  ')
                          : 'n/a'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <CodePanel
                    title={`${
                      selectedAlgorithm
                        ? selectedAlgorithm.charAt(0).toUpperCase() +
                          selectedAlgorithm.slice(1)
                        : ''
                    } Sort`}
                    code={
                      currentAlgoSource?.code ??
                      '// Select algorithm to see code'
                    }
                    language={language}
                    activeLine={activeLine}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
                <h3 className="text-base font-semibold text-slate-300">
                  Controls
                </h3>
                <div className="mt-4 space-y-4">
                  <Tooltip content="Select a sorting algorithm" position="top" className="w-full">
                    <select
                      value={selectedAlgorithm}
                      onChange={handleAlgorithmChange}
                      disabled={isRunning}
                      className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-4 pr-10 text-sm text-white shadow-lg transition duration-300 hover:border-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Choose Algorithm</option>
                      {algorithmOptions[algorithmType].map((alg) => (
                        <option key={alg} value={alg}>
                          {`${alg.charAt(0).toUpperCase() + alg.slice(1)} Sort`}
                        </option>
                      ))}
                    </select>
                  </Tooltip>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 px-3 py-2">
                    <SpeedSlider
                      value={speed}
                      onChange={(e, v) => setSpeed(v)}
                      min={0.25}
                      max={3}
                      step={0.05}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <Tooltip
                      content={
                        isRunning
                          ? 'Visualization is running'
                          : hasSteps
                            ? 'Restart the sort from scratch'
                            : 'Start visualization'
                      }
                      position="top"
                      className="w-full"
                    >
                      <button
                        onClick={handleSort}
                        disabled={isRunning || !selectedAlgorithm}
                        className="w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRunning
                          ? 'Playing...'
                          : hasSteps
                            ? 'Restart Sort'
                            : 'Start Sort'}
                      </button>
                    </Tooltip>
                    <Tooltip content="Generate a fresh random array" position="top" className="w-full">
                      <button
                        onClick={handleReset}
                        disabled={isRunning}
                        className="w-full text-sm font-bold rounded-xl bg-slate-700 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Generate New Array
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {hasSteps && (
                <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                        Playback
                      </p>
                      <p className="text-sm text-slate-300">
                        Step {currentStepIndex + 1} of {steps.length}
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-200">
                      {isPlaying
                        ? 'Playing'
                        : isComplete
                          ? 'Complete'
                          : 'Paused'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Tooltip
                      content={isPlaying ? 'Pause visualization' : 'Resume visualization'}
                      position="top"
                    >
                      <button
                        type="button"
                        onClick={isPlaying ? pausePlayback : playPlayback}
                        disabled={isComplete && !isPlaying}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                    </Tooltip>
                    <Tooltip content="Advance one step forward" position="top">
                      <button
                        type="button"
                        onClick={stepForward}
                        disabled={isPlaying || isComplete}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Step
                      </button>
                    </Tooltip>
                    <Tooltip content="Replay from the beginning" position="top">
                      <button
                        type="button"
                        onClick={replayPlayback}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
                      >
                        Replay
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                  Code Language
                </p>
                <Tooltip content="Switch the code language" position="top" className="w-full">
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="rust">Rust</option>
                    <option value="go">Go</option>
                  </select>
                </Tooltip>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Synchronization
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The chart and code viewer render from the same playback step,
                  so array state, active indices, explanation text, and
                  highlighted source line stay aligned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .array-ele.active { background: #10b981 !important; color: white; border-color: #059669; transform: scale(1.1); }
        .array-ele.compare { background: #2563eb !important; color: white; border-color: #3b82f6; transform: scale(1.12); box-shadow: 0 0 0 1px rgba(147, 197, 253, 0.55), 0 0 18px rgba(59, 130, 246, 0.35); }
        .array-ele.swap { background: #f59e0b !important; color: white; border-color: #d97706; transform: scale(1.1); }
        .array-ele.sorted { background: #0891b2 !important; color: white; border-color: #06b6d4; }
        .array-ele.pivot { background: #f43f5e !important; color: white; border-color: #e11d48; transform: scale(1.1); }
        .array-ele.min { background: #8b5cf6 !important; color: white; border-color: #7c3aed; transform: scale(1.1); }
        
        .bar.active { background: #10b981 !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); border-color: #059669; }
        .bar.compare { background: #2563eb !important; box-shadow: 0 0 18px rgba(59, 130, 246, 0.55); border-color: #60a5fa; transform: translateY(-4px); }
        .bar.swap { background: #f59e0b !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.45); border-color: #d97706; }
        .bar.sorted { background: #0891b2 !important; box-shadow: 0 0 15px rgba(6, 182, 212, 0.45); border-color: #06b6d4; }
        .bar.pivot { background: #f43f5e !important; box-shadow: 0 0 15px rgba(244, 63, 94, 0.5); border-color: #e11d48; }
        .bar.min { background: #8b5cf6 !important; box-shadow: 0 0 15px rgba(139, 92, 246, 0.5); border-color: #7c3aed; }
        
        .bar-val { 
          display: flex; justify-content: center; 
          color: rgba(255,255,255,0.9); font-size: 10px; font-weight: bold; 
          padding-top: 4px;
        }
      `}</style>
    </div>
  )
}
