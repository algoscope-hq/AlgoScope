import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateLinearSearchSteps } from '../../algorithms/searching/linearSearchSteps'
import { generateBinarySearchSteps } from '../../algorithms/searching/binarySearchSteps'
import { calculateStepDelay } from '../../lib/utils'
import { complexityMap } from '../../data/complexityMap'

const SORTED_ARRAY = [
  12, 17, 23, 30, 37, 45, 50, 63, 72, 88, 90, 99, 101, 120, 160,
]

const ALGO_META = {
  linearSearch: {
    label: 'Linear Search',
    short: 'Linear',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.1)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glow: 'rgba(6,182,212,0.35)',
    complexityKey: 'linear',
    description: 'Checks each element one by one — O(n)',
  },
  binarySearch: {
    label: 'Binary Search',
    short: 'Binary',
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.1)',
    accentBorder: 'rgba(167,139,250,0.3)',
    glow: 'rgba(167,139,250,0.35)',
    complexityKey: 'binary',
    description: 'Halves the search space each step — O(log n)',
  },
}

function SearchPanel({
  algoKey,
  array,
  target,
  speed,
  trigger,
  onComplete,
  isWinner,
}) {
  const meta = ALGO_META[algoKey]
  const steps = useMemo(() => {
    if (trigger === 0 || target === '') return []
    const t = parseInt(target, 10)
    return algoKey === 'linearSearch'
      ? generateLinearSearchSteps(array, t)
      : generateBinarySearchSteps(array, t)
  }, [algoKey, array, target, trigger])
  const [stepIndex, setStepIndex] = useState(() => (steps.length > 0 ? 0 : -1))
  const [isPlaying, setIsPlaying] = useState(() => steps.length > 0)
  const [isFinished, setIsFinished] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(null)
  const [comparisons, setComparisons] = useState(0)
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)
  const stepIdxRef = useRef(steps.length > 0 ? 0 : -1)

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    if (startTimeRef.current === null) startTimeRef.current = performance.now()

    const advance = () => {
      const current = steps[stepIdxRef.current]
      const delay = calculateStepDelay(current?.duration, speed)

      timeoutRef.current = setTimeout(() => {
        const nextIdx = stepIdxRef.current + 1
        if (nextIdx >= steps.length) {
          setIsPlaying(false)
          setIsFinished(true)
          setElapsedMs(Math.round(performance.now() - startTimeRef.current))
          onComplete(algoKey)
          return
        }
        const nextStep = steps[nextIdx]
        stepIdxRef.current = nextIdx
        setStepIndex(nextIdx)
        if (nextStep?.type === 'compare') setComparisons((c) => c + 1)
        advance()
      }, delay)
    }

    advance()
    return () => clearTimeout(timeoutRef.current)
  }, [algoKey, isPlaying, onComplete, speed, steps])

  const currentStep = steps[stepIndex] ?? null
  const visualArray = currentStep?.array ?? array
  const activeIndices = currentStep?.indices ?? []
  const foundIndex = currentStep?.foundIndex ?? null
  const totalComparisons = steps.filter((s) => s.type === 'compare').length

  const getElemClass = (idx) => {
    const baseClasses =
      'w-9 h-9 flex items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all duration-300'

    if (foundIndex === idx) {
      return `${baseClasses} bg-emerald-500 border-emerald-400 text-white scale-[1.15] shadow-[0_0_15px_rgba(16,185,129,0.5)]`
    }

    if (algoKey === 'binarySearch' && currentStep) {
      const [mid, low, high] = activeIndices
      if (idx === mid) {
        return `${baseClasses} bg-yellow-400 border-yellow-300 text-slate-900 scale-110 shadow-[0_0_12px_rgba(250,204,21,0.4)]`
      }
      if (idx === low) {
        return `${baseClasses} bg-cyan-500 border-cyan-400 text-white`
      }
      if (idx === high) {
        return `${baseClasses} bg-rose-500 border-rose-400 text-white`
      }
      if (idx < low || idx > high) {
        return `${baseClasses} bg-slate-800/80 border-slate-700 text-slate-400 opacity-25 scale-90`
      }
    }

    if (algoKey === 'linearSearch' && activeIndices.includes(idx)) {
      return `${baseClasses} bg-cyan-500 border-cyan-400 text-white scale-110 shadow-[0_0_12px_rgba(6,182,212,0.35)]`
    }

    return `${baseClasses} bg-slate-800/80 border-slate-700 text-slate-400`
  }

  const complexity = complexityMap[meta.complexityKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: isWinner
          ? `linear-gradient(135deg, rgba(15,23,42,0.95), ${meta.accentBg})`
          : 'rgba(15,23,42,0.85)',
        border: `1px solid ${isWinner ? meta.accent : 'rgba(51,65,85,0.8)'}`,
        boxShadow: isWinner ? `0 0 24px ${meta.glow}` : 'none',
      }}
      className="rounded-2xl flex flex-col overflow-hidden transition-all duration-500"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50"
        style={{ background: isWinner ? meta.accentBg : 'rgba(15,23,42,0.6)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: meta.accent,
              boxShadow: `0 0 8px ${meta.glow}`,
            }}
          />
          <div>
            <p className="text-xs font-bold text-white">{meta.label}</p>
            <p className="text-[10px] text-slate-500">{meta.description}</p>
          </div>
          {isWinner && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1"
              style={{ background: meta.accent, color: '#000' }}
            >
              🏆 Faster
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
          {isFinished
            ? foundIndex !== null
              ? `Found at [${foundIndex}]`
              : 'Not Found'
            : isPlaying
              ? 'Searching…'
              : 'Ready'}
        </span>
      </div>

      {/* Array visualization */}
      <div className="px-4 py-4">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {visualArray.map((val, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-0.5 transition-all duration-300"
              style={{ transitionDuration: '220ms' }}
            >
              <span className="text-[8px] text-slate-600 font-mono">{idx}</span>
              <span className={getElemClass(idx)}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Binary search pointer legend */}
      {algoKey === 'binarySearch' && (
        <div className="px-4 pb-2 flex gap-3 flex-wrap">
          {[
            { color: '#06b6d4', label: 'Low' },
            { color: '#facc15', label: 'Mid' },
            { color: '#f43f5e', label: 'High' },
            { color: '#10b981', label: 'Found' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded"
                style={{ background: color }}
              />
              <span className="text-[9px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step message */}
      <div className="px-4 pb-3">
        <div
          className="rounded-lg px-3 py-2 min-h-[32px]"
          style={{
            background: 'rgba(2,6,23,0.5)',
            border: '1px solid rgba(30,41,59,0.6)',
          }}
        >
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {currentStep?.message ||
              (isFinished
                ? foundIndex !== null
                  ? `✓ Found ${target} at index ${foundIndex}`
                  : `✗ ${target} not found`
                : 'Waiting to start…')}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-4 pb-4 grid grid-cols-4 gap-2">
        {[
          {
            label: 'Comparisons',
            value: isFinished ? totalComparisons : comparisons,
          },
          { label: 'Steps', value: Math.max(0, stepIndex) },
          { label: 'Time', value: elapsedMs !== null ? `${elapsedMs}ms` : '—' },
          { label: 'Complexity', value: complexity?.time ?? '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg p-2"
            style={{
              background: 'rgba(2,6,23,0.7)',
              border: '1px solid rgba(30,41,59,0.8)',
            }}
          >
            <p className="text-[8px] uppercase tracking-widest text-slate-500 mb-0.5 leading-tight">
              {label}
            </p>
            <p
              className="font-mono text-[11px] font-bold leading-tight"
              style={{ color: meta.accent }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ArraySearchComparison() {
  const [target, setTarget] = useState('37')
  const [speed, setSpeed] = useState(2)
  const [trigger, setTrigger] = useState(0)
  const [winner, setWinner] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)

  const handleComplete = useCallback((algoKey) => {
    setWinner((prev) => prev ?? algoKey)
  }, [])

  const handleStart = () => {
    if (target === '') return
    setWinner(null)
    setHasStarted(true)
    setTrigger((t) => t + 1)
  }

  const handleReset = () => {
    setTrigger(0)
    setWinner(null)
    setHasStarted(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* Controls */}
      <div
        className="rounded-2xl border border-slate-700/60 p-4"
        style={{ background: 'rgba(15,23,42,0.8)' }}
      >
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400/80 mb-2">
                Target Value
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={target}
                  onChange={(e) => {
                    setTarget(e.target.value)
                    handleReset()
                  }}
                  className="w-24 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="Target…"
                />
                <div className="flex flex-wrap gap-1">
                  {[17, 37, 72, 99, 120, 999].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setTarget(String(v))
                        handleReset()
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold border transition-all"
                      style={{
                        background:
                          parseInt(target) === v
                            ? 'rgba(6,182,212,0.15)'
                            : 'rgba(30,41,59,0.5)',
                        borderColor:
                          parseInt(target) === v
                            ? '#06b6d4'
                            : 'rgba(51,65,85,0.8)',
                        color: parseInt(target) === v ? '#06b6d4' : '#64748b',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                Speed
              </p>
              <div className="flex gap-1.5">
                {[
                  { label: '1×', val: 1 },
                  { label: '2×', val: 2 },
                  { label: '4×', val: 4 },
                ].map(({ label, val }) => (
                  <button
                    key={val}
                    onClick={() => setSpeed(val)}
                    className="px-3 h-9 rounded-lg text-xs font-bold border transition-all"
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
          </div>
          <button
            onClick={hasStarted ? handleReset : handleStart}
            disabled={target === ''}
            className="h-9 px-5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            style={{
              background: hasStarted
                ? 'rgba(244,63,94,0.2)'
                : 'rgba(6,182,212,0.85)',
              color: hasStarted ? '#f43f5e' : '#000',
              border: hasStarted ? '1px solid rgba(244,63,94,0.5)' : 'none',
              boxShadow: hasStarted ? 'none' : '0 0 16px rgba(6,182,212,0.4)',
            }}
          >
            {hasStarted ? 'Reset' : '▶ Start Comparison'}
          </button>
        </div>
      </div>

      {/* Shared array preview */}
      <div
        className="rounded-xl px-4 py-2.5 border border-slate-700/40"
        style={{ background: 'rgba(15,23,42,0.6)' }}
      >
        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5">
          Shared Sorted Array (both algorithms use this)
        </p>
        <div className="flex flex-wrap gap-1">
          {SORTED_ARRAY.map((v, i) => (
            <span
              key={i}
              className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background:
                  parseInt(target) === v
                    ? 'rgba(16,185,129,0.2)'
                    : 'rgba(30,41,59,0.5)',
                color: parseInt(target) === v ? '#34d399' : '#64748b',
                border: `1px solid ${parseInt(target) === v ? 'rgba(52,211,153,0.4)' : 'rgba(51,65,85,0.5)'}`,
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-2.5 flex items-center gap-3"
            style={{
              background: ALGO_META[winner].accentBg,
              border: `1px solid ${ALGO_META[winner].accentBorder}`,
              boxShadow: `0 0 20px ${ALGO_META[winner].glow}`,
            }}
          >
            <span className="text-lg">🏆</span>
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: ALGO_META[winner].accent }}
              >
                {ALGO_META[winner].label} found {target} faster!
              </p>
              <p className="text-[10px] text-slate-400">
                Binary Search wins on sorted data — O(log n) vs O(n) makes a
                real difference.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.keys(ALGO_META).map((key) => (
          <SearchPanel
            key={`${key}-${trigger}`}
            algoKey={key}
            array={SORTED_ARRAY}
            target={target}
            speed={speed}
            trigger={trigger}
            onComplete={handleComplete}
            isWinner={winner === key}
          />
        ))}
      </div>

      <div
        className="rounded-xl px-4 py-3 text-xs text-slate-400 border border-slate-700/40"
        style={{ background: 'rgba(15,23,42,0.6)' }}
      >
        <strong className="text-slate-300">Key insight:</strong> Binary search
        requires a <em>sorted</em> array. It&apos;s dramatically faster for
        large datasets, but linear search works on any array — unsorted or
        sorted. Try target 999 (not in array) to see how many comparisons each
        needs.
      </div>
    </div>
  )
}
