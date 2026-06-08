import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import ComplexityCard from '../ComplexityCard'
import Tooltip from '../Tooltip'
import TestCaseManager from '../testCaseManager/TestCaseManager'
import RecursiveTree from './RecursiveTree.jsx'
import { useKeyboardShortcuts } from '../visualizer/useKeyboardShortcuts'

import * as bubble from '../../algorithms/sorting/bubbleSortSteps'
import * as selection from '../../algorithms/sorting/selectionSortSteps'
import * as insertion from '../../algorithms/sorting/insertionSortSteps'
import * as quick from '../../algorithms/sorting/quickSortSteps'
import * as merge from '../../algorithms/sorting/mergeSortSteps'
import * as heap from '../../algorithms/sorting/heapSortSteps'
import * as counting from '../../algorithms/sorting/countingSortSteps'
import * as radix from '../../algorithms/sorting/radixSortSteps'
import * as shell from '../../algorithms/sorting/shellSortSteps'
import ComplexityGraph from '../ComplexityGraph'

const algoMap = {
  bubble,
  selection,
  insertion,
  quick,
  merge,
  heap,
  counting,
  radix,
  shell,
}

const DEFAULT_ARRAY_SIZE = 8
const RANDOM_MIN = 50
const RANDOM_MAX = 250
const MAX_CUSTOM_INPUT_SIZE = 100

const parseStoredArray = (value) =>
  value
    .split(/[,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item))

const validateParsedNumbers = (parsedNumbers, selectedAlgorithm) => {
  if (parsedNumbers.length > MAX_CUSTOM_INPUT_SIZE) {
    return 'Please enter 100 numbers or fewer.'
  }

  if (['counting', 'radix'].includes(selectedAlgorithm)) {
    if (parsedNumbers.some((n) => n < 0 || !Number.isInteger(n))) {
      return 'Counting Sort and Radix Sort only support non-negative integers.'
    }
  }

  return ''
}

const applyParsedNumbers = (
  parsedNumbers,
  selectedAlgorithm,
  setBaseArray,
  clearPlayback,
  setCustomInput,
  setInputError,
  customInputValue
) => {
  const validationError = validateParsedNumbers(
    parsedNumbers,
    selectedAlgorithm
  )
  if (validationError) {
    setInputError(validationError)
    return false
  }

  clearPlayback()
  setBaseArray(parsedNumbers)
  setCustomInput(customInputValue)
  setInputError('')
  return true
}

const buildSortSampleCases = (algorithm) => [
  {
    name: 'Nearly Sorted Array',
    algorithm,
    input: '12, 18, 21, 25, 19, 29, 34, 41',
    description: 'A small array with one out-of-place element.',
  },
]

const STATE_COLORS = {
  compare: { bg: '#2563eb', border: '#60a5fa' },
  swap: { bg: '#f59e0b', border: '#d97706' },
  pivot: { bg: '#f43f5e', border: '#e11d48' },
  min: { bg: '#8b5cf6', border: '#7c3aed' },
  sorted: { bg: '#0891b2', border: '#06b6d4' },
  active: { bg: '#10b981', border: '#059669' },
}

const STATE_STYLE_PRESETS = {
  compare: {
    bar: {
      boxShadow: '0 0 18px rgba(59, 130, 246, 0.55)',
      transform: 'translateY(-4px)',
    },
    element: {
      transform: 'scale(1.12)',
      boxShadow:
        '0 0 0 1px rgba(147, 197, 253, 0.55), 0 0 18px rgba(59, 130, 246, 0.35)',
    },
  },
  swap: {
    bar: {
      boxShadow: '0 0 15px rgba(245, 158, 11, 0.45)',
    },
    element: {
      transform: 'scale(1.1)',
    },
  },
  pivot: {
    bar: {
      boxShadow: '0 0 15px rgba(244, 63, 94, 0.5)',
    },
    element: {
      transform: 'scale(1.1)',
    },
  },
  min: {
    bar: {
      boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
    },
    element: {
      transform: 'scale(1.1)',
    },
  },
  sorted: {
    bar: {
      boxShadow: '0 0 15px rgba(6, 182, 212, 0.45)',
    },
    element: {},
  },
  active: {
    bar: {
      boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
    },
    element: {
      transform: 'scale(1.1)',
    },
  },
}

export default function Visualizer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [baseArray, setBaseArray] = useState([50, 120, 70, 30, 200, 90, 160])
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')
  const [algorithmType, setAlgorithmType] = useState('simple')
  const [customInput, setCustomInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [isStepMode, setIsStepMode] = useState(false)

  const algoFromUrl = searchParams.get('algo')
  const selectedAlgorithm =
    algoFromUrl && algoMap[algoFromUrl] ? algoFromUrl : ''
  const testCaseAlgorithm = selectedAlgorithm || algorithmType
  const sortSampleCases = useMemo(
    () => buildSortSampleCases(testCaseAlgorithm),
    [testCaseAlgorithm]
  )

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

  const algorithmOptions = {
    simple: ['bubble', 'selection', 'insertion'],
    complex: ['quick', 'merge', 'heap', 'shell'],
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
        loadSteps(generator(baseArray), { autoPlay: !isStepMode })
      }
    }
  }
  const INITIAL_ARRAY = [50, 120, 70, 30, 200, 90, 160]
  const handleReset = () => {
    clearPlayback()
    setBaseArray(INITIAL_ARRAY)
    setCustomInput('')
    setInputError('')
    setIsStepMode(false)
  }

  useKeyboardShortcuts({
    onPlayPause: () => {
      if (isPlaying) pausePlayback()
      else if (hasSteps && !isComplete) playPlayback()
    },
    onStepForward: () => {
      if (!isPlaying && !isComplete && hasSteps) stepForward()
    },
    onStepBackward: () => {
      if (!isPlaying && currentStepIndex > 0) stepBackward()
    },
    onReset: handleReset,
    onSpeedUp: () => setSpeed((s) => Math.min(3, +(s + 0.25).toFixed(2))),
    onSlowDown: () => setSpeed((s) => Math.max(0.25, +(s - 0.25).toFixed(2))),
  })

  const handleApplyCustomArray = () => {
    setInputError('')
    let input = customInput.trim()

    if (!input) {
      setInputError('Please enter at least one number.')
      return
    }

    if (input.startsWith('[') && input.endsWith(']')) {
      input = input.slice(1, -1)
    }

    // Parse input string into numeric array
    const parts = input.split(/[\s,]+/).filter(Boolean)
    const parsedNumbers = parts.map(Number)

    if (parsedNumbers.some((num) => Number.isNaN(num))) {
      setInputError(
        'Invalid input. Please enter only numbers separated by commas or spaces.'
      )
      return
    }

    applyParsedNumbers(
      parsedNumbers,
      selectedAlgorithm,
      setBaseArray,
      clearPlayback,
      setCustomInput,
      setInputError,
      ''
    )
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

  const getStateStyle = (index, variant) => {
    const stateClass = getStateClass(index)
    if (!stateClass) return undefined

    const color = STATE_COLORS[stateClass]
    const preset = STATE_STYLE_PRESETS[stateClass]?.[variant] ?? {}

    return {
      background: color.bg,
      borderColor: color.border,
      color: variant === 'element' ? '#fff' : undefined,
      ...preset,
    }
  }

  const getBarStyle = (index, value) => {
    const baseStyle = {
      height: `${value}px`,
      background: 'rgba(6, 182, 212, 0.8)',
    }
    return { ...baseStyle, ...getStateStyle(index, 'bar') }
  }

  const getElementClass = (index) => {
    const stateClass = getStateClass(index)
    const baseClasses =
      'array-ele rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 font-mono text-xs sm:text-sm shadow-sm transition-all duration-300 border'

    if (!stateClass) {
      return `${baseClasses} border-slate-600 bg-slate-800 text-cyan-400`
    }

    if (stateClass === 'compare') {
      return `${baseClasses} bg-blue-600 border-blue-400 text-white scale-[1.12] shadow-[0_0_18px_rgba(59,130,246,0.35)]`
    }
    if (stateClass === 'swap') {
      return `${baseClasses} bg-amber-500 border-amber-600 text-white scale-110`
    }
    if (stateClass === 'pivot') {
      return `${baseClasses} bg-rose-500 border-rose-600 text-white scale-110`
    }
    if (stateClass === 'min') {
      return `${baseClasses} bg-purple-500 border-purple-600 text-white scale-110`
    }
    if (stateClass === 'sorted') {
      return `${baseClasses} bg-cyan-600 border-cyan-500 text-white`
    }
    if (stateClass === 'active') {
      return `${baseClasses} bg-emerald-500 border-emerald-600 text-white scale-110`
    }

    return `${baseClasses} border-slate-600 bg-slate-800 text-cyan-400`
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
                    <span key={idx} className={getElementClass(idx)}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <ComplexityCard algorithm={selectedAlgorithm} />
              <ComplexityGraph algorithm={selectedAlgorithm} />
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
                    onLanguageChange={setLanguage}
                  />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  How to use
                </p>
                {[
                  { step: '1', label: 'Pick a sort category' },
                  { step: '2', label: 'Pick an algorithm' },
                  { step: '3', label: 'Press Start Sort' },
                ].map(({ step, label }) => {
                  const done =
                    (step === '1' && algorithmType) ||
                    (step === '2' && selectedAlgorithm) ||
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
                    algorithm={testCaseAlgorithm}
                    currentInput={baseArray.join(',')}
                    sampleCases={sortSampleCases}
                    onLoad={(input) => {
                      const parsed = parseStoredArray(input)
                      if (!parsed.length) return

                      applyParsedNumbers(
                        parsed,
                        selectedAlgorithm,
                        setBaseArray,
                        clearPlayback,
                        setCustomInput,
                        setInputError,
                        parsed.join(', ')
                      )
                    }}
                  />

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Sort Category
                    </p>
                    <Tooltip
                      content="Select the sorting category"
                      position="top"
                      className="w-full"
                    >
                      <select
                        value={algorithmType}
                        onChange={(e) => {
                          setAlgorithmType(e.target.value)
                          clearPlayback()
                          setSearchParams({})
                        }}
                        disabled={isRunning}
                        className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-4 pr-10 text-sm text-white shadow-lg transition duration-300 hover:border-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                      >
                        <option value="simple">Simple Sorts</option>
                        <option value="complex">Complex Sorts</option>
                        <option value="integer">Integer Sorts</option>
                      </select>
                    </Tooltip>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Algorithm
                    </p>
                    <Tooltip
                      content="Pick a sorting algorithm"
                      position="top"
                      className="w-full"
                    >
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
                  <div className="flex rounded-xl overflow-hidden border border-slate-700 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsStepMode(false)
                        clearPlayback()
                      }}
                      className={`flex-1 py-2 text-xs font-semibold transition-all ${!isStepMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                      Auto{' '}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsStepMode(true)
                        clearPlayback()
                      }}
                      className={`flex-1 py-2 text-xs font-semibold transition-all ${isStepMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                      Step
                    </button>
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
                        type="button"
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
                    <Tooltip
                      content="Shuffle and generate a new array"
                      position="top"
                    >
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isRunning}
                        className="w-full text-sm font-bold rounded-xl bg-slate-700 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reset
                      </button>
                    </Tooltip>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Custom Array Input
                    </p>
                    <textarea
                      aria-label="Custom array input"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      disabled={isRunning}
                      placeholder="Example: 5, 3, 8, 1, 9"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm text-white shadow-lg transition duration-300 hover:border-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50 h-20 resize-none"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Supports comma-separated numbers or JSON arrays.
                    </p>
                    <button
                      type="button"
                      onClick={handleApplyCustomArray}
                      disabled={isRunning}
                      className="mt-3 w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-2.5 text-white transition-all duration-300 hover:bg-cyan-500 disabled:opacity-50"
                    >
                      Apply Custom Array
                    </button>
                    {inputError && (
                      <p className="mt-2 text-xs text-red-400">{inputError}</p>
                    )}
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
              {selectedAlgorithm === 'merge' && (
                <RecursiveTree
                  tree={currentStep?.recursionTree}
                  activeNode={currentStep?.activeNode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
