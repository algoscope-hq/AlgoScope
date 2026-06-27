import React, { useState, useMemo } from 'react'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import ComplexityCard from '../ComplexityCard'
import Tooltip from '../Tooltip'
import TestCaseManager from '../testCaseManager/TestCaseManager'
import { useKeyboardShortcuts } from '../visualizer/useKeyboardShortcuts'
import ComplexityGraph from '../ComplexityGraph'

import * as largestRectangle from '../../algorithms/monotonicStack/largestRectangleSteps'
import * as maximalRectangle from '../../algorithms/monotonicStack/maximalRectangleSteps'

const STATE_COLORS = {
  compare: { bg: '#2563eb', border: '#60a5fa' },
  calculate: { bg: '#f59e0b', border: '#d97706' },
  push: { bg: '#8b5cf6', border: '#7c3aed' },
  active: { bg: '#10b981', border: '#059669' },
}

const STATE_STYLE_PRESETS = {
  compare: {
    bar: {
      boxShadow: '0 0 18px rgba(59, 130, 246, 0.55)',
      transform: 'translateY(-4px)',
    },
  },
  calculate: { bar: { boxShadow: '0 0 15px rgba(245, 158, 11, 0.45)' } },
  push: { bar: { boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' } },
  active: { bar: { boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' } },
}

const SAMPLE_CASES = {
  histogram: [
    { name: 'Classic Peak', algorithm: 'histogram', input: '2, 1, 5, 6, 2, 3' },
    {
      name: 'Strictly Increasing',
      algorithm: 'histogram',
      input: '1, 2, 3, 4, 5',
    },
    {
      name: 'Strictly Decreasing',
      algorithm: 'histogram',
      input: '5, 4, 3, 2, 1',
    },
  ],
  matrix: [
    {
      name: 'Classic Matrix',
      algorithm: 'matrix',
      input: '10100\n10111\n11111\n10010',
    },
    { name: 'Solid Block', algorithm: 'matrix', input: '111\n111\n111' },
    { name: 'Checkerboard', algorithm: 'matrix', input: '101\n010\n101' },
  ],
}

export default function StackVisualizer() {
  const [mode, setMode] = useState('histogram')
  const [speed, setSpeed] = useState(1)
  const [language, setLanguage] = useState('javascript')
  const [isStepMode, setIsStepMode] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [inputError, setInputError] = useState('')

  const [baseArray, setBaseArray] = useState([2, 1, 5, 6, 2, 3])
  const [baseMatrix, setBaseMatrix] = useState([
    ['1', '0', '1', '0', '0'],
    ['1', '0', '1', '1', '1'],
    ['1', '1', '1', '1', '1'],
    ['1', '0', '0', '1', '0'],
  ])

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

  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return
    setMode(newMode)
    clearPlayback()
    setCustomInput('')
    setInputError('')
  }

  const handleVisualize = () => {
    clearPlayback()
    if (mode === 'histogram') {
      loadSteps(largestRectangle.generateLargestRectangleSteps(baseArray), {
        autoPlay: !isStepMode,
      })
    } else {
      loadSteps(maximalRectangle.generateMaximalRectangleSteps(baseMatrix), {
        autoPlay: !isStepMode,
      })
    }
  }

  const handleReset = () => {
    clearPlayback()
    setBaseArray([2, 1, 5, 6, 2, 3])
    setBaseMatrix([
      ['1', '0', '1', '0', '0'],
      ['1', '0', '1', '1', '1'],
      ['1', '1', '1', '1', '1'],
      ['1', '0', '0', '1', '0'],
    ])
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

  const handleApplyCustomInput = () => {
    setInputError('')
    const input = customInput.trim()
    if (!input) return setInputError('Please enter some data.')

    if (mode === 'histogram') {
      const parts = input
        .replace(/\[|\]/g, '')
        .split(/[\s,]+/)
        .filter(Boolean)
      const parsedNumbers = parts.map(Number)
      if (parsedNumbers.some(Number.isNaN))
        return setInputError('Invalid input. Numbers only.')
      if (parsedNumbers.length > 50)
        return setInputError('Limit to 50 numbers.')
      setBaseArray(parsedNumbers)
    } else {
      const rows = input.split('\n').filter((r) => r.trim() !== '')
      const parsedMatrix = rows.map((r) => r.trim().split(''))
      const colCount = parsedMatrix[0].length
      if (parsedMatrix.some((r) => r.length !== colCount))
        return setInputError('All rows must have the same length.')
      if (parsedMatrix.some((r) => r.some((val) => val !== '0' && val !== '1')))
        return setInputError('Matrix must only contain 0s and 1s.')
      setBaseMatrix(parsedMatrix)
    }
    clearPlayback()
  }

  const isRunning = isPlaying
  const activeIndices = currentStep?.indices ?? []
  const currentStack = currentStep?.stack ?? []

  const visualMatrix =
    mode === 'matrix' ? (currentStep?.matrix ?? baseMatrix) : null
  const currentRow = currentStep?.currentRow ?? -1
  const visualArray =
    mode === 'histogram'
      ? (currentStep?.array ?? baseArray)
      : (currentStep?.array ?? new Array(baseMatrix[0].length).fill(0))

  const maxVal =
    mode === 'histogram'
      ? Math.max(...visualArray, 1)
      : Math.max(visualMatrix.length, 1)
  const MAX_BAR_HEIGHT = mode === 'matrix' ? 140 : 180

  const currentAlgoSource = useMemo(() => {
    return mode === 'histogram'
      ? largestRectangle.getLargestRectangleSource(language)
      : maximalRectangle.getMaximalRectangleSource(language)
  }, [mode, language])

  const activeLine = useMemo(() => {
    if (!currentStep?.lineKey) return undefined
    return mode === 'histogram'
      ? largestRectangle.resolveLargestRectangleLine(
          language,
          currentStep.lineKey
        )
      : maximalRectangle.resolveMaximalRectangleLine(
          language,
          currentStep.lineKey
        )
  }, [mode, currentStep, language])

  const getStateClass = (index) => {
    if (!hasSteps) return ''
    if (activeIndices.includes(index)) {
      if (currentStep?.type === 'calculate') return 'calculate'
      if (currentStep?.type === 'push') return 'push'
      if (currentStep?.type === 'compare') return 'compare'
      return 'active'
    }
    return ''
  }

  const getBarStyle = (index, value) => {
    const scaledHeight = (value / maxVal) * MAX_BAR_HEIGHT
    const stateClass = getStateClass(index)
    const color = stateClass ? STATE_COLORS[stateClass] : null
    const preset = stateClass ? STATE_STYLE_PRESETS[stateClass]?.bar : {}
    return {
      height: `${scaledHeight === 0 ? 4 : scaledHeight}px`,
      background: color ? color.bg : 'rgba(6, 182, 212, 0.8)',
      borderColor: color ? color.border : undefined,
      ...preset,
    }
  }

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-5">
      <div className="w-full flex flex-col items-center">
        <div className="grid w-full gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)] overflow-hidden">
          {/* LEFT COLUMN */}
          <div className="flex min-w-0 min-h-0 flex-col gap-4">
            {/* Main Visualizer Panel */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-3 sm:p-4 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-200">
                  {mode === 'histogram'
                    ? 'Largest Rectangle in Histogram'
                    : 'Maximal Rectangle'}
                </h3>
                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                  {currentStep?.type
                    ? currentStep.type.replace('-', ' ')
                    : 'Ready'}
                </div>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex bg-slate-950/80 rounded-xl p-1 border border-slate-700/80 w-full mb-2 shadow-inner">
                <button
                  onClick={() => handleModeSwitch('histogram')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${mode === 'histogram' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                  1D Histogram Mode
                </button>
                <button
                  onClick={() => handleModeSwitch('matrix')}
                  className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${mode === 'matrix' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                  2D Matrix Mode
                </button>
              </div>

              {/* Conditionally Render 2D Matrix */}
              {mode === 'matrix' && (
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                    Binary Matrix
                  </p>
                  <div className="flex flex-col gap-1">
                    {visualMatrix.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-1">
                        {row.map((cell, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-mono text-sm sm:text-base rounded-md border transition-all duration-300 ${
                              currentRow === rIdx
                                ? 'bg-cyan-900/60 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                : cell === '1'
                                  ? 'bg-slate-700 border-slate-500 text-slate-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-600'
                            }`}
                          >
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`flex gap-4 ${mode === 'matrix' ? 'h-[180px] lg:h-[200px]' : 'h-[250px] lg:h-[280px]'}`}
              >
                <div
                  id="container"
                  className="flex-1 flex items-end justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-2xl border border-slate-700 p-2 sm:p-4 bg-slate-800/40"
                >
                  {visualArray.map((val, idx) => (
                    <div
                      key={idx}
                      className={`bar flex-1 max-w-[42px] rounded-t-md transition-all duration-500 border border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] w-6 sm:w-8 ${getStateClass(idx)}`}
                      style={getBarStyle(idx, val)}
                    >
                      <div className="bar-val text-xs text-white text-center pb-1">
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-24 sm:w-32 flex flex-col rounded-2xl border border-slate-700 p-2 bg-slate-800/40 relative">
                  <h4 className="text-[10px] sm:text-xs font-semibold text-center text-slate-400 mb-2 uppercase tracking-widest border-b border-slate-700 pb-2">
                    Stack (Idx)
                  </h4>
                  <div className="flex-1 flex flex-col-reverse justify-start items-center gap-1.5 overflow-y-auto custom-scrollbar">
                    {currentStack.map((stackItem, i) => {
                      const isTop = i === currentStack.length - 1
                      return (
                        <div
                          key={`${i}-${stackItem}`}
                          className={`w-full py-1.5 text-center text-sm font-mono rounded shadow-sm transition-all duration-300 ${
                            isTop
                              ? 'bg-cyan-600 border-cyan-400 text-white scale-[1.02]'
                              : 'bg-slate-700 border-slate-600 text-cyan-100'
                          } border`}
                        >
                          {stackItem}
                        </div>
                      )
                    })}
                    {currentStack.length === 0 && (
                      <span className="text-xs text-slate-500 my-auto">
                        Empty
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <ComplexityCard algorithm={mode} />
            <ComplexityGraph algorithm={mode} />
            {/* Step Insight & Code Panel */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
                  Step Insight
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">
                  {currentStep?.message ?? 'Select mode and hit Start.'}
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Max Area Found
                    </p>
                    <p className="mt-1 font-mono text-2xl text-emerald-400">
                      {currentStep?.variables?.maxArea ?? 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Variables
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-100 break-words">
                      {currentStep?.variables
                        ? Object.entries(currentStep.variables)
                            .filter(([key]) => key !== 'maxArea')
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(' | ')
                        : 'n/a'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <CodePanel
                  title="Implementation"
                  code={currentAlgoSource?.code ?? ''}
                  language={language}
                  activeLine={activeLine}
                  onLanguageChange={setLanguage}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Controls */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
              <div className="space-y-4">
                <TestCaseManager
                  algorithm={mode}
                  currentInput={
                    mode === 'histogram'
                      ? baseArray.join(',')
                      : baseMatrix.map((r) => r.join('')).join('\n')
                  }
                  sampleCases={SAMPLE_CASES[mode]}
                  onLoad={(input) => {
                    if (mode === 'histogram') {
                      setBaseArray(input.split(',').map(Number))
                    } else {
                      setBaseMatrix(input.split('\n').map((r) => r.split('')))
                    }
                    setCustomInput(input)
                    clearPlayback()
                  }}
                />

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
                    Auto
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
                  <button
                    type="button"
                    onClick={handleVisualize}
                    disabled={isRunning}
                    className="w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-3 text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:transform-none"
                  >
                    {isRunning
                      ? 'Playing...'
                      : hasSteps
                        ? 'Restart Run'
                        : 'Start Run'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isRunning}
                    className="w-full text-sm font-bold rounded-xl bg-slate-700 px-6 py-3 text-white transition-all hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    Reset
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                    Custom Input
                  </p>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    disabled={isRunning}
                    placeholder={
                      mode === 'histogram'
                        ? 'Example: 2, 1, 5, 6, 2, 3'
                        : 'Example:\n10100\n10111\n11111'
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm font-mono text-white h-24 resize-none transition duration-300 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomInput}
                    disabled={isRunning}
                    className="mt-3 w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-2.5 text-white transition-all hover:bg-cyan-500 disabled:opacity-50"
                  >
                    Apply Data
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
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={isPlaying ? pausePlayback : playPlayback}
                    disabled={isComplete && !isPlaying}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 hover:border-cyan-500"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    type="button"
                    onClick={stepBackward}
                    disabled={isPlaying || currentStepIndex <= 0}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 hover:border-cyan-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={stepForward}
                    disabled={isPlaying || isComplete}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 hover:border-cyan-500"
                  >
                    Step
                  </button>
                  <button
                    type="button"
                    onClick={replayPlayback}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2 text-xs sm:text-sm font-medium text-slate-100 hover:border-cyan-500"
                  >
                    Replay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
