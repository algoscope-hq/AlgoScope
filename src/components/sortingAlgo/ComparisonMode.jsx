import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { complexityMap } from '../../data/complexityMap'

import { generateBubbleSortSteps } from '../../algorithms/sorting/bubbleSortSteps'
import { generateSelectionSortSteps } from '../../algorithms/sorting/selectionSortSteps'
import { generateInsertionSortSteps } from '../../algorithms/sorting/insertionSortSteps'
import { generateMergeSortSteps } from '../../algorithms/sorting/mergeSortSteps'
import { generateQuickSortSteps } from '../../algorithms/sorting/quickSortSteps'
import { generateHeapSortSteps } from '../../algorithms/sorting/heapSortSteps'
import { calculateStepDelay } from '../../lib/utils'

const ALGO_META = {
  bubble: {
    label: 'Bubble Sort',
    generate: generateBubbleSortSteps,
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.12)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glowColor: 'rgba(6,182,212,0.35)',
  },
  selection: {
    label: 'Selection Sort',
    generate: generateSelectionSortSteps,
    accent: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.12)',
    accentBorder: 'rgba(139,92,246,0.3)',
    glowColor: 'rgba(139,92,246,0.35)',
  },
  insertion: {
    label: 'Insertion Sort',
    generate: generateInsertionSortSteps,
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.12)',
    accentBorder: 'rgba(245,158,11,0.3)',
    glowColor: 'rgba(245,158,11,0.35)',
  },
  merge: {
    label: 'Merge Sort',
    generate: generateMergeSortSteps,
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.12)',
    accentBorder: 'rgba(16,185,129,0.3)',
    glowColor: 'rgba(16,185,129,0.35)',
  },
  quick: {
    label: 'Quick Sort',
    generate: generateQuickSortSteps,
    accent: '#f43f5e',
    accentBg: 'rgba(244,63,94,0.12)',
    accentBorder: 'rgba(244,63,94,0.3)',
    glowColor: 'rgba(244,63,94,0.35)',
  },
  heap: {
    label: 'Heap Sort',
    generate: generateHeapSortSteps,
    accent: '#fb923c',
    accentBg: 'rgba(251,146,60,0.12)',
    accentBorder: 'rgba(251,146,60,0.3)',
    glowColor: 'rgba(251,146,60,0.35)',
  },
}

const ALL_ALGOS = Object.keys(ALGO_META)

function createRandomArray(size) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 170) + 30
  )
}

function countStepMetrics(steps) {
  let comparisons = 0
  let swaps = 0
  for (const s of steps) {
    if (s.type === 'compare') comparisons++
    if (s.type === 'swap') swaps++
  }
  return { comparisons, swaps }
}

function AlgoPanel({
  algoKey,
  baseArray,
  speed,
  globalTrigger,
  onComplete,
  isWinner,
}) {
  const meta = ALGO_META[algoKey]
  const steps = useMemo(() => {
    if (globalTrigger === 0) return []
    return meta.generate([...baseArray])
  }, [baseArray, globalTrigger, meta])
  const [stepIndex, setStepIndex] = useState(() => (steps.length > 0 ? 0 : -1))
  const [isPlaying, setIsPlaying] = useState(() => steps.length > 0)
  const [isFinished, setIsFinished] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(null)
  const [liveComparisons, setLiveComparisons] = useState(0)
  const [liveSwaps, setLiveSwaps] = useState(0)
  const [prevSteps, setPrevSteps] = useState(steps)

  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)
  const stepIndexRef = useRef(steps.length > 0 ? 0 : -1)

  if (steps !== prevSteps) {
    setPrevSteps(steps)
    setStepIndex(steps.length > 0 ? 0 : -1)
    // We can't update ref here because of lint, but we can do it in useEffect
    setIsPlaying(steps.length > 0)
    setIsFinished(false)
    setElapsedMs(null)
    setLiveComparisons(0)
    setLiveSwaps(0)
  }

  useEffect(() => {
    // Sync ref and handle cleanup when steps change
    stepIndexRef.current = steps.length > 0 ? 0 : -1
    startTimeRef.current = null
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [steps])

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    if (startTimeRef.current === null) startTimeRef.current = performance.now()

    const advance = () => {
      const current = steps[stepIndexRef.current]
      const delay = calculateStepDelay(current?.duration, speed)

      timeoutRef.current = setTimeout(() => {
        const nextIdx = stepIndexRef.current + 1
        if (nextIdx >= steps.length) {
          setIsPlaying(false)
          setIsFinished(true)
          setElapsedMs(Math.round(performance.now() - startTimeRef.current))
          setStepIndex(steps.length - 1)
          stepIndexRef.current = steps.length - 1
          onComplete(algoKey)
          return
        }

        const nextStep = steps[nextIdx]
        stepIndexRef.current = nextIdx
        setStepIndex(nextIdx)

        if (nextStep?.type === 'compare') setLiveComparisons((c) => c + 1)
        if (nextStep?.type === 'swap') setLiveSwaps((s) => s + 1)

        advance()
      }, delay)
    }

    advance()
    return () => clearTimeout(timeoutRef.current)
  }, [algoKey, isPlaying, onComplete, speed, steps])

  const currentStep = steps[stepIndex] ?? null
  const visualArray = currentStep?.array ?? baseArray
  const activeIndices = currentStep?.indices ?? []
  const sortedIndices = currentStep?.sortedIndices ?? []
  const maxVal = Math.max(...visualArray, 1)

  const getBarColor = (idx) => {
    if (sortedIndices.includes(idx)) return meta.accent
    if (activeIndices.includes(idx)) {
      const t = currentStep?.type
      if (t === 'swap') return '#f59e0b'
      if (t === 'pivot') return '#f43f5e'
      if (t === 'compare') return '#60a5fa'
      if (t === 'min') return '#c084fc'
      return meta.accent
    }
    return 'rgba(100,116,139,0.5)'
  }

  const getBarGlow = (idx) => {
    if (sortedIndices.includes(idx)) return `0 0 8px ${meta.glowColor}`
    if (activeIndices.includes(idx)) return `0 0 12px rgba(255,255,255,0.3)`
    return 'none'
  }

  const { comparisons: totalComparisons, swaps: totalSwaps } =
    steps.length > 0 ? countStepMetrics(steps) : { comparisons: 0, swaps: 0 }

  const progress =
    steps.length > 0 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 0
  const complexity = complexityMap[algoKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: isWinner
          ? `linear-gradient(135deg, rgba(15,23,42,0.95) 0%, ${meta.accentBg} 100%)`
          : 'rgba(15,23,42,0.85)',
        border: isWinner
          ? `1px solid ${meta.accent}`
          : '1px solid rgba(51,65,85,0.8)',
        boxShadow: isWinner
          ? `0 0 24px ${meta.glowColor}, inset 0 0 40px ${meta.accentBg}`
          : 'none',
      }}
      className="rounded-2xl flex flex-col overflow-hidden transition-all duration-500"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b border-slate-700/50"
        style={{ background: isWinner ? meta.accentBg : 'rgba(15,23,42,0.6)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: meta.accent,
              boxShadow: `0 0 8px ${meta.glowColor}`,
            }}
          />
          <span className="text-xs font-bold tracking-wide text-white">
            {meta.label}
          </span>
          {isWinner && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: meta.accent, color: '#000' }}
            >
              🏆 Fastest
            </motion.span>
          )}
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: isFinished
              ? meta.accentBg
              : isPlaying
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(51,65,85,0.5)',
            color: isFinished ? meta.accent : isPlaying ? '#34d399' : '#94a3b8',
            border: `1px solid ${isFinished ? meta.accentBorder : isPlaying ? 'rgba(52,211,153,0.3)' : 'rgba(51,65,85,0.5)'}`,
          }}
        >
          {isFinished ? 'Done' : isPlaying ? 'Sorting…' : 'Ready'}
        </span>
      </div>

      {/* Bar Chart */}
      <div className="px-3 pt-3 pb-1">
        <div
          className="flex items-end justify-center gap-0.5 rounded-xl overflow-hidden"
          style={{
            height: '110px',
            background: 'rgba(2,6,23,0.6)',
            border: '1px solid rgba(30,41,59,0.8)',
            padding: '8px 6px 4px',
          }}
        >
          {visualArray.map((val, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${Math.max(4, (val / maxVal) * 90)}%`,
                background: getBarColor(idx),
                boxShadow: getBarGlow(idx),
                minWidth: '3px',
                maxWidth: '24px',
                transitionDuration: '180ms',
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-3 pt-1 pb-2">
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: meta.accent }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[9px] text-slate-500">
            Step {Math.max(0, stepIndex)} / {Math.max(0, steps.length - 1)}
          </span>
          <span className="text-[9px] text-slate-500">{progress}%</span>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-2">
        <div
          className="rounded-lg p-2"
          style={{
            background: 'rgba(2,6,23,0.7)',
            border: '1px solid rgba(30,41,59,0.8)',
          }}
        >
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
            Comparisons
          </p>
          <p
            className="font-mono text-sm font-bold"
            style={{ color: meta.accent }}
          >
            {isFinished ? totalComparisons : liveComparisons}
          </p>
        </div>
        <div
          className="rounded-lg p-2"
          style={{
            background: 'rgba(2,6,23,0.7)',
            border: '1px solid rgba(30,41,59,0.8)',
          }}
        >
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
            Swaps
          </p>
          <p
            className="font-mono text-sm font-bold"
            style={{ color: meta.accent }}
          >
            {isFinished ? totalSwaps : liveSwaps}
          </p>
        </div>
        <div
          className="rounded-lg p-2"
          style={{
            background: 'rgba(2,6,23,0.7)',
            border: '1px solid rgba(30,41,59,0.8)',
          }}
        >
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
            Time
          </p>
          <p className="font-mono text-sm font-bold text-white">
            {elapsedMs !== null ? `${elapsedMs}ms` : '—'}
          </p>
        </div>
        <div
          className="rounded-lg p-2"
          style={{
            background: 'rgba(2,6,23,0.7)',
            border: '1px solid rgba(30,41,59,0.8)',
          }}
        >
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
            Space
          </p>
          <p className="font-mono text-sm font-bold text-white">
            {complexity?.space ?? '—'}
          </p>
        </div>
      </div>

      {/* Current step message */}
      <div className="px-3 pb-3">
        <div
          className="rounded-lg px-2 py-1.5 min-h-[28px]"
          style={{
            background: 'rgba(2,6,23,0.5)',
            border: '1px solid rgba(30,41,59,0.6)',
          }}
        >
          <p className="text-[9px] text-slate-500 leading-relaxed line-clamp-2">
            {currentStep?.message ||
              (isFinished ? 'Sorting complete!' : 'Waiting to start...')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ComparisonMode() {
  const [selectedAlgos, setSelectedAlgos] = useState([
    'bubble',
    'selection',
    'merge',
    'quick',
  ])
  const [arraySize, setArraySize] = useState(12)
  const [speed, setSpeed] = useState(2)
  const [baseArray, setBaseArray] = useState(() => createRandomArray(12))
  const [globalTrigger, setGlobalTrigger] = useState(0)
  const [winner, setWinner] = useState(null)
  const [completedAlgos, setCompletedAlgos] = useState(new Set())
  const [hasStarted, setHasStarted] = useState(false)

  const handleGenerateArray = useCallback(() => {
    setBaseArray(createRandomArray(arraySize))
    setGlobalTrigger(0)
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(false)
  }, [arraySize])

  const handleArraySizeChange = (newSize) => {
    setArraySize(newSize)
    setBaseArray(createRandomArray(newSize))
    setGlobalTrigger(0)
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(false)
  }

  const handleStart = () => {
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(true)
    setGlobalTrigger((t) => t + 1)
  }

  const handleReset = () => {
    setGlobalTrigger(0)
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(false)
    setBaseArray(createRandomArray(arraySize))
  }

  const handleComplete = useCallback((algoKey) => {
    setCompletedAlgos((prev) => {
      const next = new Set(prev)
      next.add(algoKey)
      return next
    })
    setWinner((prev) => prev ?? algoKey)
  }, [])

  const toggleAlgo = (algoKey) => {
    setSelectedAlgos((prev) => {
      if (prev.includes(algoKey)) {
        if (prev.length <= 2) return prev
        return prev.filter((k) => k !== algoKey)
      }
      if (prev.length >= 6) return prev
      return [...prev, algoKey]
    })
    setGlobalTrigger(0)
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(false)
  }

  const gridCols =
    selectedAlgos.length <= 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : selectedAlgos.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : selectedAlgos.length <= 4
          ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
          : selectedAlgos.length === 5
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6'

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-5">
      {/* Control Panel */}
      <div
        className="rounded-2xl border border-slate-700/60 p-4"
        style={{ background: 'rgba(15,23,42,0.8)' }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Algorithm selector */}
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400/80 mb-2">
              Select Algorithms (2–6)
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_ALGOS.map((key) => {
                const isSelected = selectedAlgos.includes(key)
                const meta = ALGO_META[key]
                return (
                  <button
                    key={key}
                    onClick={() => toggleAlgo(key)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
                    style={{
                      background: isSelected
                        ? meta.accentBg
                        : 'rgba(30,41,59,0.5)',
                      borderColor: isSelected
                        ? meta.accent
                        : 'rgba(51,65,85,0.8)',
                      color: isSelected ? meta.accent : '#64748b',
                      boxShadow: isSelected
                        ? `0 0 8px ${meta.glowColor}`
                        : 'none',
                    }}
                  >
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Array size */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                Array Size
              </p>
              <div className="flex gap-1.5">
                {[8, 12, 16, 20].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleArraySizeChange(s)}
                    className="w-10 h-8 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      background:
                        arraySize === s
                          ? 'rgba(6,182,212,0.15)'
                          : 'rgba(30,41,59,0.5)',
                      borderColor:
                        arraySize === s ? '#06b6d4' : 'rgba(51,65,85,0.8)',
                      color: arraySize === s ? '#06b6d4' : '#64748b',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                Speed
              </p>
              <div className="flex gap-1.5">
                {[
                  { label: '0.5×', val: 0.5 },
                  { label: '1×', val: 1 },
                  { label: '2×', val: 2 },
                  { label: '4×', val: 4 },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    onClick={() => setSpeed(val)}
                    className="w-10 h-8 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      background:
                        speed === val
                          ? 'rgba(6,182,212,0.15)'
                          : 'rgba(30,41,59,0.5)',
                      borderColor:
                        speed === val ? '#06b6d4' : 'rgba(51,65,85,0.8)',
                      color: speed === val ? '#06b6d4' : '#64748b',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleGenerateArray}
                className="h-9 px-4 rounded-xl text-xs font-bold border border-slate-600 text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-all"
              >
                New Array
              </button>
              <button
                onClick={hasStarted ? handleReset : handleStart}
                disabled={selectedAlgos.length < 2}
                className="h-9 px-5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: hasStarted
                    ? 'rgba(244,63,94,0.2)'
                    : 'rgba(6,182,212,0.85)',
                  color: hasStarted ? '#f43f5e' : '#000',
                  border: hasStarted ? '1px solid rgba(244,63,94,0.5)' : 'none',
                  boxShadow: hasStarted
                    ? 'none'
                    : '0 0 16px rgba(6,182,212,0.4)',
                }}
              >
                {hasStarted ? 'Reset' : '▶ Start Race'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Winner banner */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-xl px-4 py-2.5 flex items-center gap-3"
            style={{
              background: ALGO_META[winner].accentBg,
              border: `1px solid ${ALGO_META[winner].accentBorder}`,
              boxShadow: `0 0 20px ${ALGO_META[winner].glowColor}`,
            }}
          >
            <span className="text-lg">🏆</span>
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: ALGO_META[winner].accent }}
              >
                {ALGO_META[winner].label} finished first!
              </p>
              <p className="text-[10px] text-slate-400">
                {completedAlgos.size} of {selectedAlgos.length} algorithms
                complete
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panels Grid */}
      <div className={`grid gap-3 ${gridCols}`}>
        {selectedAlgos.map((algoKey) => (
          <AlgoPanel
            key={`${algoKey}-${globalTrigger}`}
            algoKey={algoKey}
            baseArray={baseArray}
            speed={speed}
            globalTrigger={globalTrigger}
            onComplete={handleComplete}
            isWinner={winner === algoKey}
          />
        ))}
      </div>

      {/* Legend */}
      <div
        className="rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-1"
        style={{
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(30,41,59,0.6)',
        }}
      >
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 w-full mb-1">
          Bar Color Legend
        </p>
        {[
          { color: 'rgba(96,165,250,0.9)', label: 'Comparing' },
          { color: '#f59e0b', label: 'Swapping' },
          { color: '#f43f5e', label: 'Pivot' },
          { color: '#c084fc', label: 'Min' },
          { color: 'algorithm color', label: 'Sorted', gradient: true },
          { color: 'rgba(100,116,139,0.5)', label: 'Unsorted' },
        ].map(({ color, label, gradient }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background: gradient
                  ? 'linear-gradient(90deg, #06b6d4, #8b5cf6, #10b981)'
                  : color,
              }}
            />
            <span className="text-[9px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
