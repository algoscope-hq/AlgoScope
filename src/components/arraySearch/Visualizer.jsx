import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import Tooltip from '../Tooltip'

import * as linear from '../../algorithms/searching/linearSearchSteps'
import * as binary from '../../algorithms/searching/binarySearchSteps'
import { getSearchingSource } from '../../algorithms/searching/searchingSources'

const algoMap = {
  linearSearch: linear,
  binarySearch: binary,
}

const createArray = (type) => {
  if (type === 'binarySearch') {
    return [17, 30, 37, 45, 50, 72, 88, 90, 99, 101, 120, 160, 203]
  }
  return [50, 120, 72, 30, 203, 90, 160, 88, 17, 45, 37, 99, 101, 93, 63]
}

export default function Visualizer({ algorithm }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [baseArray, setBaseArray] = useState(() => createArray(algorithm))
  const [target, setTarget] = useState(() => {
    const urlTarget = searchParams.get('target')
    if (urlTarget) return urlTarget
    return algorithm === 'binarySearch' ? 37 : 30
  })
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState(() => {
    return searchParams.get('lang') || 'javascript'
  })

  useEffect(() => {
    const params = {}
    if (target) params.target = target
    if (language) params.lang = language
    if (algorithm) params.algo = algorithm
    setSearchParams(params, { replace: true })
  }, [target, language, algorithm, setSearchParams])

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

  const handleSearch = () => {
    if (algorithm && algoMap[algorithm]) {
      const generatorName = `generate${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}Steps`
      const generator = algoMap[algorithm][generatorName]
      if (generator) {
        clearPlayback()
        loadSteps(generator(baseArray, parseInt(target, 10)))
      }
    }
  }

  const handleReset = () => {
    clearPlayback()
    setBaseArray(createArray(algorithm))
  }

  const isRunning = isPlaying
  const visualArray = currentStep?.array ?? baseArray
  const activeIndices = currentStep?.indices ?? []
  const foundIndex = currentStep?.foundIndex ?? null

  const currentAlgoSource = useMemo(() => {
    if (!algorithm) return null
    return getSearchingSource(algorithm, language)
  }, [algorithm, language])

  const activeLine = useMemo(() => {
    if (!algorithm || !currentStep?.lineKey || !algoMap[algorithm])
      return undefined
    const resolveName = `resolve${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}SortLine`
    const resolveLine = algoMap[algorithm][resolveName]
    return resolveLine ? resolveLine(language, currentStep.lineKey) : undefined
  }, [algorithm, currentStep, language])

  const getStateClass = (index) => {
    if (!hasSteps) return ''
    if (index === foundIndex) return 'found'
    if (algorithm === 'linearSearch') {
      if (activeIndices.includes(index)) {
        return currentStep?.type === 'found' ? 'found' : 'active'
      }
    } else if (algorithm === 'binarySearch') {
      const [mid, low, high] = activeIndices
      if (index === mid) return 'active'
      if (index === low) return 'left'
      if (index === high) return 'right'
      if (index < low || index > high) return 'inactive'
    }
    return ''
  }

  const getElementStyle = (index) => {
    const stateClass = getStateClass(index)
    if (stateClass === 'found') {
      return {
        background: '#10b981',
        color: '#fff',
        borderColor: '#34d399',
        transform: 'scale(1.15)',
        boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
      }
    }
    if (stateClass === 'active') {
      const bgColor = algorithm === 'binarySearch' ? '#facc15' : '#06b6d4'
      return {
        background: bgColor,
        color: algorithm === 'binarySearch' ? '#0f172a' : '#fff',
        borderColor: algorithm === 'binarySearch' ? '#fde047' : '#22d3ee',
        transform: 'scale(1.1)',
        boxShadow: `0 0 15px ${bgColor}66`,
      }
    }
    if (stateClass === 'left') {
      return { background: '#06b6d4', color: '#fff', borderColor: '#22d3ee' }
    }
    if (stateClass === 'right') {
      return { background: '#f43f5e', color: '#fff', borderColor: '#fb7185' }
    }
    if (stateClass === 'inactive') {
      return { opacity: 0.3, transform: 'scale(0.9)' }
    }
    return undefined
  }

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-5">
      <div className="w-full">
        <div className="flex flex-col items-center">
          <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)] overflow-hidden">
            <div className="flex min-w-0 min-h-0 flex-col gap-4">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-3 sm:p-6 shadow-xl">
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
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-4 sm:py-8">
                  {visualArray.map((item, idx) => (
                    <span
                      key={idx}
                      className="array-ele rounded-xl shadow-lg border border-slate-700 px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg font-mono font-medium text-slate-300 bg-slate-800/80 transition-all duration-300"
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
                      `Enter a target and start to see steps.`}
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                        Target Value
                      </p>
                      <p className="mt-1 sm:mt-2 font-mono text-base sm:text-lg text-slate-100">
                        {target}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400">
                        Status
                      </p>
                      <p className="mt-1 sm:mt-2 font-mono text-base sm:text-lg text-slate-100">
                        {foundIndex !== null
                          ? `Found at ${foundIndex}`
                          : isComplete
                            ? 'Not Found'
                            : isPlaying
                              ? 'Searching...'
                              : 'Ready'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 sm:p-4 lg:col-span-1">
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
                    title={`${algorithm.replace('Search', ' Search').charAt(0).toUpperCase() + algorithm.replace('Search', ' Search').slice(1)}`}
                    code={
                      currentAlgoSource || '// Select algorithm to see code'
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
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Target Value
                    </label>
                    <Tooltip content="Enter the value to search for" position="top" className="w-full">
                      <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        disabled={isRunning}
                        className="w-full bg-slate-900/80 text-white text-sm border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                        placeholder="Target Value"
                      />
                    </Tooltip>
                  </div>
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
                          ? 'Search is running'
                          : hasSteps
                            ? 'Restart the search'
                            : 'Start visualization'
                      }
                      position="top"
                      className="w-full"
                    >
                      <button
                        onClick={handleSearch}
                        disabled={isRunning || !target}
                        className="w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRunning
                          ? 'Searching...'
                          : hasSteps
                            ? 'Restart Search'
                            : 'Start Search'}
                      </button>
                    </Tooltip>
                    <Tooltip content="Reset the array to its default state" position="top" className="w-full">
                      <button
                        onClick={handleReset}
                        disabled={isRunning}
                        className="w-full text-sm font-bold rounded-xl bg-slate-700 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reset Array
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                  Code Language
                </p>
              <Tooltip content="Switch the code language" position="top" className="w-full">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none cursor-pointer"
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
                        ? 'Searching'
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
