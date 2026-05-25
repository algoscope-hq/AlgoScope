import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import ComplexityCard from '../ComplexityCard'
import Tooltip from '../Tooltip'
import TestCaseManager from '../testCaseManager/TestCaseManager'

import * as linear from '../../algorithms/searching/linearSearchSteps'
import * as binary from '../../algorithms/searching/binarySearchSteps'

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

const SEARCH_SAMPLE_CASES = [
  {
    name: 'Linear Search Hit',
    algorithm: 'linearSearch',
    input: JSON.stringify({
      array: [14, 27, 35, 42, 58, 63],
      target: 42,
    }),
    description: 'Target is in the middle of an unsorted array.',
  },
]

const parseStoredSearchCase = (input) => {
  if (!input) return null

  try {
    const parsed = JSON.parse(input)
    if (parsed && Array.isArray(parsed.array)) {
      const hasTarget = Object.prototype.hasOwnProperty.call(parsed, 'target')
      const target = hasTarget ? Number(parsed.target) : undefined

      if (hasTarget && Number.isNaN(target)) {
        return null
      }

      return {
        array: parsed.array.map(Number).filter((item) => !Number.isNaN(item)),
        ...(hasTarget ? { target } : {}),
      }
    }
  } catch {
    // Fall through to legacy comma-separated array input.
  }

  const array = input
    .split(/[,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item))

  if (!array.length) return null

  return { array }
}

export default function Visualizer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [algorithm, setAlgorithm] = useState(
    () => searchParams.get('algo') || 'linearSearch'
  )
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

  const handleAlgorithmChange = (e) => {
    const newAlgo = e.target.value
    setAlgorithm(newAlgo)
    clearPlayback()
    setBaseArray(createArray(newAlgo))
    setTarget(newAlgo === 'binarySearch' ? 37 : 30)
  }

  useEffect(() => {
    const params = {}
    if (target !== '' && target !== null && target !== undefined) {
      params.target = target
    }
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
    stepBackward,
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

  const handleLoadTestCase = (input) => {
    const storedCase = parseStoredSearchCase(input)
    if (!storedCase) return

    clearPlayback()
    setBaseArray(storedCase.array)
    if (storedCase.target !== undefined) {
      setTarget(storedCase.target)
    }
  }

  const isRunning = isPlaying
  const visualArray = currentStep?.array ?? baseArray
  const activeIndices = currentStep?.indices ?? []
  const foundIndex = currentStep?.foundIndex ?? null

  const currentAlgoSource = useMemo(() => {
    if (!algorithm || !algoMap[algorithm]) return null
    const getSourceName = `get${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}Source`
    const getSource = algoMap[algorithm][getSourceName]
    return getSource ? getSource(language) : null
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

              <ComplexityCard
                algorithm={algorithm === 'linearSearch' ? 'linear' : 'binary'}
              />

              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 sm:p-5 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
                    Step Insight
                  </p>
                  <h3 className="mt-2 text-lg sm:text-xl font-semibold text-slate-100">
                    {currentStep?.message?.replace('!', '.') ??
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
                      currentAlgoSource?.code ??
                      '// Select algorithm to see code'
                    }
                    language={language}
                    activeLine={activeLine}
                    onLanguageChange={setLanguage}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              {/* How to use stepper */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  How to use
                </p>
                {[
                  { step: '1', label: 'Pick a search algorithm' },
                  { step: '2', label: 'Enter a target value' },
                  { step: '3', label: 'Press Start Search' },
                ].map(({ step, label }) => {
                  const done =
                    (step === '1' && algorithm) ||
                    (step === '2' &&
                      target !== '' &&
                      target !== null &&
                      target !== undefined) ||
                    (step === '3' && hasSteps)
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

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
                <div className="space-y-4">
                  <TestCaseManager
                    algorithm={algorithm}
                    currentInput={JSON.stringify({
                      array: baseArray,
                      target,
                    })}
                    sampleCases={SEARCH_SAMPLE_CASES}
                    onLoad={handleLoadTestCase}
                  />

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Algorithm
                    </p>
                    <Tooltip
                      content="Pick a search algorithm"
                      position="top"
                      className="w-full"
                    >
                      <select
                        value={algorithm}
                        onChange={handleAlgorithmChange}
                        disabled={isRunning}
                        className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-4 pr-10 text-sm text-white shadow-lg transition duration-300 hover:border-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                      >
                        <option value="linearSearch">Linear Search</option>
                        <option value="binarySearch">Binary Search</option>
                      </select>
                    </Tooltip>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Target Value
                    </p>
                    <Tooltip
                      content="Enter the value to search for"
                      position="top"
                      className="w-full"
                    >
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
                        hasSteps
                          ? 'Restart the visualization'
                          : 'Start visualization'
                      }
                      position="top"
                    >
                      <button
                        onClick={handleSearch}
                        disabled={
                          isRunning ||
                          target === '' ||
                          target === null ||
                          target === undefined
                        }
                        className="w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRunning
                          ? 'Searching...'
                          : hasSteps
                            ? 'Restart Search'
                            : 'Start Search'}
                      </button>
                    </Tooltip>
                    <Tooltip
                      content="Reset array to original state"
                      position="top"
                    >
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
                  <div className="grid grid-cols-4 gap-2">
                    <Tooltip
                      content={isPlaying ? 'Pause' : 'Start Visualization'}
                      position="top"
                    >
                      <button
                        type="button"
                        onClick={isPlaying ? pausePlayback : playPlayback}
                        disabled={isComplete && !isPlaying}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                    </Tooltip>
                    <Tooltip content="Go back one step" position="top">
                      <button
                        type="button"
                        onClick={stepBackward}
                        disabled={isPlaying || currentStepIndex <= 0}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Back
                      </button>
                    </Tooltip>
                    <Tooltip content="Advance one step forward" position="top">
                      <button
                        type="button"
                        onClick={stepForward}
                        disabled={isPlaying || isComplete}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Step
                      </button>
                    </Tooltip>
                    <Tooltip content="Replay from the beginning" position="top">
                      <button
                        type="button"
                        onClick={replayPlayback}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
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
