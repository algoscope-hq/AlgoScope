import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import { useVisualizationState } from '../../context/useVisualizationState'
import ComplexityCard from '../ComplexityCard'
import Tooltip from '../Tooltip'
import { useKeyboardShortcuts } from '../visualizer/useKeyboardShortcuts'
import LearningPathSuggestions from '../LearningPathSuggestions'

import HuffmanVisualizer from './HuffmanVisualizer'
import KnapsackVisualizer from './KnapsackVisualizer'

import { generateHuffmanSteps } from '../../algorithms/greedy/huffmanCodingSteps'
import { generateFractionalKnapsackSteps } from '../../algorithms/greedy/fractionalKnapsackSteps'
import {
  getGreedySource,
  resolveGreedyLine,
} from '../../algorithms/greedy/greedySources'

const DEFAULT_KNAPSACK_ITEMS = [
  { id: 'Item A', value: 60, weight: 10 },
  { id: 'Item B', value: 100, weight: 20 },
  { id: 'Item C', value: 120, weight: 30 },
]

const GREEDY_STATE_KEY = 'greedy:solo'

export default function VisualizerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [algorithm, setAlgorithm] = useVisualizationState(
    `${GREEDY_STATE_KEY}:algorithm`,
    () => searchParams.get('algo') || 'huffman'
  )
  const [language, setLanguage] = useVisualizationState(
    `${GREEDY_STATE_KEY}:language`,
    () => searchParams.get('lang') || 'javascript'
  )
  const [speed, setSpeed] = useVisualizationState(
    `${GREEDY_STATE_KEY}:speed`,
    1
  )
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isStepMode, setIsStepMode] = useVisualizationState(
    `${GREEDY_STATE_KEY}:isStepMode`,
    false
  )

  // Huffman Inputs
  const [huffmanText, setHuffmanText] = useVisualizationState(
    `${GREEDY_STATE_KEY}:huffmanText`,
    'BEEP BOOP BEER'
  )

  // Knapsack Inputs
  const [knapsackCapacity, setKnapsackCapacity] = useVisualizationState(
    `${GREEDY_STATE_KEY}:knapsackCapacity`,
    50
  )
  const [knapsackItems, setKnapsackItems] = useVisualizationState(
    `${GREEDY_STATE_KEY}:knapsackItems`,
    DEFAULT_KNAPSACK_ITEMS
  )
  const [newItemValue, setNewItemValue] = useState('')
  const [newItemWeight, setNewItemWeight] = useState('')
  const [playbackState, setPlaybackState] = useVisualizationState(
    `${GREEDY_STATE_KEY}:playback`,
    { steps: [], currentStepIndex: -1, isPlaying: false }
  )

  useEffect(() => {
    const params = { algo: algorithm, lang: language }
    setSearchParams(params, { replace: true })
  }, [algorithm, language, setSearchParams])

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
  } = useStepPlayback({
    speed,
    initialState: playbackState,
    onStateChange: setPlaybackState,
  })

  const handleVisualize = () => {
    clearPlayback()
    if (algorithm === 'huffman') {
      const huffmanSteps = generateHuffmanSteps(huffmanText)
      loadSteps(huffmanSteps, { autoPlay: !isStepMode })
    } else {
      const knapsackSteps = generateFractionalKnapsackSteps(
        knapsackCapacity,
        knapsackItems
      )
      loadSteps(knapsackSteps, { autoPlay: !isStepMode })
    }
  }

  const handleReset = () => {
    clearPlayback()
    if (algorithm === 'huffman') {
      setHuffmanText('BEEP BOOP BEER')
    } else {
      setKnapsackCapacity(50)
      setKnapsackItems(DEFAULT_KNAPSACK_ITEMS)
    }
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
    onHelp: () => setShowShortcuts((v) => !v),
  })

  const handleAddKnapsackItem = () => {
    const val = Number(newItemValue)
    const wt = Number(newItemWeight)
    if (isNaN(val) || isNaN(wt) || val <= 0 || wt <= 0) return

    const nextLetter = String.fromCharCode(65 + knapsackItems.length) // Item A, B, C, D...
    const newItem = {
      id: `Item ${nextLetter}`,
      value: val,
      weight: wt,
    }

    setKnapsackItems([...knapsackItems, newItem])
    setNewItemValue('')
    setNewItemWeight('')
    clearPlayback()
  }

  const handleRemoveKnapsackItem = (id) => {
    setKnapsackItems(knapsackItems.filter((item) => item.id !== id))
    clearPlayback()
  }

  const currentSource = useMemo(() => {
    return getGreedySource(algorithm, language)
  }, [algorithm, language])

  const activeLine = useMemo(() => {
    if (!currentStep?.lineKey) return undefined
    return resolveGreedyLine(algorithm, language, currentStep.lineKey)
  }, [algorithm, currentStep, language])

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value)
    clearPlayback()
  }

  return (
    <div className="flex flex-col p-2 sm:p-4 lg:p-5">
      <div className="w-full">
        <div className="flex flex-col items-center">
          <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)] overflow-hidden">
            {/* Visualizer and code display */}
            <div className="flex min-w-0 min-h-0 flex-col gap-4">
              {showShortcuts && (
                <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/95 p-4 shadow-xl z-20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Keyboard Shortcuts
                    </p>
                    <button
                      onClick={() => setShowShortcuts(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <table className="w-full text-sm text-slate-300">
                    <tbody>
                      {[
                        ['Space', 'Play / Pause'],
                        ['→ Right Arrow', 'Next Step'],
                        ['← Left Arrow', 'Previous Step'],
                        ['R', 'Reset Settings'],
                        ['+', 'Increase Speed'],
                        ['-', 'Decrease Speed'],
                        ['?', 'Toggle Shortcuts'],
                      ].map(([key, action]) => (
                        <tr key={key} className="border-b border-slate-700/50">
                          <td className="py-1.5 pr-4">
                            <kbd className="rounded bg-slate-700 px-2 py-0.5 text-xs font-mono text-cyan-300">
                              {key}
                            </kbd>
                          </td>
                          <td className="py-1.5 text-slate-400">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => setShowShortcuts((v) => !v)}
                className="self-end text-xs text-slate-500 hover:text-cyan-400 transition"
              >
                ⌨️ Shortcuts (?)
              </button>

              {/* Main Canvas Component */}
              <div className="min-w-0">
                {algorithm === 'huffman' ? (
                  <HuffmanVisualizer currentStep={currentStep} speed={speed} />
                ) : (
                  <KnapsackVisualizer currentStep={currentStep} />
                )}
              </div>

              {/* Complexity Analysis */}
              <ComplexityCard algorithm={algorithm} />

              {/* Code Panel and Step Insight */}
              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                {/* Step Insight */}
                <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 sm:p-5 shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
                    Step Insight
                  </p>
                  <h3 className="mt-2 text-base sm:text-md font-semibold text-slate-100 leading-relaxed min-h-[60px]">
                    {currentStep?.message ||
                      'Start the visualization to see greedy step progression.'}
                  </h3>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        Variables Dashboard
                      </p>
                      <div className="mt-2 font-mono text-xs text-slate-200 space-y-1">
                        {currentStep?.variables &&
                        Object.keys(currentStep.variables).length > 0 ? (
                          Object.entries(currentStep.variables).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between border-b border-slate-900 py-1 last:border-0"
                              >
                                <span className="text-slate-400">{key}:</span>
                                <span className="text-cyan-400 font-bold">
                                  {value}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <span className="text-slate-500">
                            No active variables
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 font-mono text-sm text-slate-200">
                        {isComplete
                          ? 'Visualization Complete'
                          : isPlaying
                            ? 'Running...'
                            : hasSteps
                              ? 'Paused'
                              : 'Ready'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Code Panel */}
                <div className="min-w-0">
                  <CodePanel
                    title={
                      algorithm === 'huffman'
                        ? 'Huffman Tree Construction'
                        : 'Fractional Knapsack Strategy'
                    }
                    code={currentSource}
                    language={language}
                    activeLine={activeLine}
                    onLanguageChange={setLanguage}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Controls Panel */}
            <div className="flex min-w-0 flex-col gap-4">
              {/* How to use */}
              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  How to use
                </p>
                {[
                  { step: '1', label: 'Select Greedy Algorithm' },
                  { step: '2', label: 'Modify string or item arrays' },
                  { step: '3', label: 'Run greedy visualization' },
                ].map(({ step, label }) => {
                  const done =
                    (step === '1' && algorithm) ||
                    (step === '2' &&
                      (algorithm === 'huffman'
                        ? huffmanText
                        : knapsackItems.length > 0)) ||
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
                        className={`text-xs transition-colors duration-300 ${
                          done ? 'text-slate-200' : 'text-slate-500'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Controls */}
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl space-y-4">
                {/* Algorithm Selector */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                    Target Algorithm
                  </p>
                  <Tooltip
                    content="Choose a greedy strategy"
                    position="top"
                    className="w-full"
                  >
                    <select
                      value={algorithm}
                      onChange={handleAlgorithmChange}
                      disabled={isPlaying}
                      className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/80 py-3 pl-4 pr-10 text-sm text-white shadow-lg transition duration-300 hover:border-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="huffman">
                        Huffman Coding (Data Compression)
                      </option>
                      <option value="knapsack">
                        Fractional Knapsack (Resource Optimization)
                      </option>
                    </select>
                  </Tooltip>
                </div>

                {/* Huffman Specific Controls */}
                {algorithm === 'huffman' && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Input text string
                    </p>
                    <Tooltip
                      content="String to encode into Huffman code"
                      position="top"
                      className="w-full"
                    >
                      <input
                        type="text"
                        value={huffmanText}
                        onChange={(e) => {
                          setHuffmanText(e.target.value)
                          clearPlayback()
                        }}
                        disabled={isPlaying}
                        maxLength={25}
                        className="w-full bg-slate-900/80 text-white text-sm border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50 font-mono"
                        placeholder="Text to encode"
                      />
                    </Tooltip>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Maximum 25 characters for layout spacing.
                    </span>
                  </div>
                )}

                {/* Knapsack Specific Controls */}
                {algorithm === 'knapsack' && (
                  <div className="space-y-4 border-t border-slate-800/80 pt-3">
                    {/* Capacity input */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                        Knapsack Capacity (kg)
                      </p>
                      <input
                        type="number"
                        value={knapsackCapacity}
                        onChange={(e) => {
                          setKnapsackCapacity(
                            Math.max(1, Number(e.target.value))
                          )
                          clearPlayback()
                        }}
                        disabled={isPlaying}
                        className="w-full bg-slate-900/80 text-white text-sm border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                        placeholder="Capacity"
                      />
                    </div>

                    {/* Item editor list */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                        Cargo Items list
                      </p>

                      <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 mb-3">
                        {knapsackItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/80 text-xs"
                          >
                            <span className="font-bold text-slate-300">
                              {item.id}
                            </span>
                            <span className="text-slate-400 font-mono">
                              ${item.value} | {item.weight} kg |{' '}
                              {(item.value / item.weight || 0).toFixed(1)}/kg
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKnapsackItem(item.id)}
                              disabled={isPlaying || knapsackItems.length <= 1}
                              className="text-rose-400 hover:text-rose-300 disabled:opacity-30 cursor-pointer"
                              title="Delete Item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new item */}
                      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          Add Custom Cargo
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={newItemValue}
                            onChange={(e) => setNewItemValue(e.target.value)}
                            disabled={isPlaying || knapsackItems.length >= 6}
                            placeholder="Val ($)"
                            className="bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                          />
                          <input
                            type="number"
                            value={newItemWeight}
                            onChange={(e) => setNewItemWeight(e.target.value)}
                            disabled={isPlaying || knapsackItems.length >= 6}
                            placeholder="Wt (kg)"
                            className="bg-slate-900 text-white text-xs border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddKnapsackItem}
                          disabled={
                            isPlaying ||
                            !newItemValue ||
                            !newItemWeight ||
                            knapsackItems.length >= 6
                          }
                          className="w-full text-xs font-bold rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white py-2 transition disabled:opacity-40"
                        >
                          Add Item{' '}
                          {String.fromCharCode(65 + knapsackItems.length)}
                        </button>
                        {knapsackItems.length >= 6 && (
                          <span className="text-[9px] text-yellow-500 block text-center">
                            Maximum 6 items allowed.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Speed Slider */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2">
                  <SpeedSlider
                    value={speed}
                    onChange={(e, v) => setSpeed(v)}
                    min={0.25}
                    max={3}
                    step={0.05}
                  />
                </div>

                {/* Stepper Modes */}
                <div className="flex rounded-xl overflow-hidden border border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStepMode(false)
                      clearPlayback()
                    }}
                    className={`flex-1 py-2 text-xs font-semibold transition-all ${!isStepMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    Auto Play
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsStepMode(true)
                      clearPlayback()
                    }}
                    className={`flex-1 py-2 text-xs font-semibold transition-all ${isStepMode ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    Manual Step
                  </button>
                </div>

                {/* Play Action Triggers */}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <button
                    onClick={handleVisualize}
                    disabled={
                      isPlaying ||
                      (algorithm === 'huffman' && !huffmanText.trim()) ||
                      (algorithm === 'knapsack' && knapsackItems.length === 0)
                    }
                    className="w-full text-sm font-bold rounded-xl bg-cyan-600 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPlaying
                      ? 'Visualizing...'
                      : hasSteps
                        ? 'Restart Visualizer'
                        : 'Start Visualizer'}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isPlaying}
                    className="w-full text-sm font-bold rounded-xl bg-slate-700 px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reset Settings
                  </button>
                </div>
              </div>

              {/* Playback step-by-step panel */}
              {hasSteps && (
                <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                        Playback Stepper
                      </p>
                      <p className="text-sm text-slate-300 font-mono">
                        Step {currentStepIndex + 1} of {steps.length}
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-200">
                      {isPlaying
                        ? 'Running'
                        : isComplete
                          ? 'Completed'
                          : 'Paused'}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={isPlaying ? pausePlayback : playPlayback}
                      disabled={isComplete && !isPlaying}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                      type="button"
                      onClick={stepBackward}
                      disabled={isPlaying || currentStepIndex <= 0}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={stepForward}
                      disabled={isPlaying || isComplete}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                    <button
                      type="button"
                      onClick={replayPlayback}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-1 py-2.5 text-xs font-semibold text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
                    >
                      Replay
                    </button>
                  </div>
                </div>
              )}

              <LearningPathSuggestions className="mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
