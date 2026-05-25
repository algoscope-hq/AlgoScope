import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { complexityMap } from '../../data/complexityMap'

// ─── Algorithm metadata ────────────────────────────────────────────────────────
const ALGO_META = {
  kmp: {
    label: 'KMP',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.12)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glowColor: 'rgba(6,182,212,0.35)',
    defaultText: 'AABAACAADAABAABA',
    defaultPattern: 'AABA',
  },
  rabinkarp: {
    label: 'Rabin-Karp',
    accent: '#a855f7',
    accentBg: 'rgba(168,85,247,0.12)',
    accentBorder: 'rgba(168,85,247,0.3)',
    glowColor: 'rgba(168,85,247,0.35)',
    defaultText: 'AABAACAADAABAABA',
    defaultPattern: 'AABA',
  },
  zalgorithm: {
    label: 'Z-Algorithm',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.12)',
    accentBorder: 'rgba(16,185,129,0.3)',
    glowColor: 'rgba(16,185,129,0.35)',
    defaultText: 'AABAACAADAABAABA',
    defaultPattern: 'AABA',
  },
}

const ALL_ALGOS = ['kmp', 'rabinkarp', 'zalgorithm']
const BASE = 256
const PRIME = 101

// ─── Step generators ───────────────────────────────────────────────────────────
function generateKMPSteps(text, pattern) {
  const steps = []
  const lps = new Array(pattern.length).fill(0)
  let len = 0,
    i = 1
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len
    } else if (len) {
      len = lps[len - 1]
    } else {
      lps[i++] = 0
    }
  }
  let ti = 0,
    pi = 0
  while (ti < text.length) {
    if (text[ti] === pattern[pi]) {
      steps.push({ type: 'compare', ti, pi, match: true })
      ti++
      pi++
    }
    if (pi === pattern.length) {
      steps.push({ type: 'found', at: ti - pi })
      pi = lps[pi - 1]
    } else if (ti < text.length && text[ti] !== pattern[pi]) {
      steps.push({ type: 'compare', ti, pi, match: false })
      pi ? (pi = lps[pi - 1]) : ti++
    }
  }
  return steps
}

function generateRabinKarpSteps(text, pattern) {
  const steps = []
  const n = text.length,
    m = pattern.length
  let h = 1
  for (let i = 0; i < m - 1; i++) h = (h * BASE) % PRIME
  let patHash = 0,
    winHash = 0
  for (let i = 0; i < m; i++) {
    patHash = (BASE * patHash + pattern.charCodeAt(i)) % PRIME
    winHash = (BASE * winHash + text.charCodeAt(i)) % PRIME
  }
  for (let i = 0; i <= n - m; i++) {
    const windowStr = text.slice(i, i + m)
    const isHashMatch = winHash === patHash
    const isRealMatch = isHashMatch && windowStr === pattern
    steps.push({
      type: isRealMatch ? 'found' : isHashMatch ? 'spurious' : 'compare',
      window: i,
      at: isRealMatch ? i : null,
    })
    if (i < n - m) {
      winHash =
        (BASE * (winHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) %
        PRIME
      if (winHash < 0) winHash += PRIME
    }
  }
  return steps
}

function generateZSteps(text, pattern) {
  const steps = []
  const s = pattern + '$' + text
  const n = s.length,
    m = pattern.length
  const z = new Array(n).fill(0)
  z[0] = n
  let l = 0,
    r = 0
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l])
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++
    if (i + z[i] > r) {
      l = i
      r = i + z[i]
    }
    const textI = i - m - 1
    if (textI >= 0) {
      steps.push({
        type: z[i] === m ? 'found' : 'compare',
        textI,
        zVal: z[i],
        at: z[i] === m ? textI : null,
      })
    }
  }
  return steps
}

const GENERATORS = {
  kmp: generateKMPSteps,
  rabinkarp: generateRabinKarpSteps,
  zalgorithm: generateZSteps,
}

// ─── Single algorithm panel ────────────────────────────────────────────────────
function AlgoPanel({
  algoKey,
  text,
  pattern,
  speed,
  trigger,
  onComplete,
  isWinner,
}) {
  const meta = ALGO_META[algoKey]
  const [stepIndex, setStepIndex] = useState(-1)
  const [matches, setMatches] = useState([])
  const [comparisons, setComparisons] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(null)
  const [prevTrigger, setPrevTrigger] = useState(trigger)

  const steps = React.useMemo(() => {
    if (trigger === 0 || !text || !pattern) return []
    return GENERATORS[algoKey](text, pattern)
  }, [trigger, text, pattern, algoKey])

  if (trigger !== prevTrigger) {
    setPrevTrigger(trigger)
    setStepIndex(-1)
    setMatches([])
    setComparisons(0)
    setIsFinished(false)
    setElapsedMs(null)
  }

  const startTimeRef = useRef(null)
  const idxRef = useRef(0)
  const foundMatchesRef = useRef([])
  const compsRef = useRef(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (trigger === 0 || !text || !pattern) return

    startTimeRef.current = performance.now()
    idxRef.current = 0
    foundMatchesRef.current = []
    compsRef.current = 0

    const tick = () => {
      if (idxRef.current >= steps.length) {
        setIsFinished(true)
        setElapsedMs(Math.round(performance.now() - startTimeRef.current))
        setMatches([...foundMatchesRef.current])
        setComparisons(compsRef.current)
        onCompleteRef.current(algoKey)
        return true
      }
      const step = steps[idxRef.current]
      setStepIndex(idxRef.current)
      if (step.type === 'compare' || step.type === 'spurious') {
        compsRef.current += 1
        setComparisons(compsRef.current)
      }
      if (step.at !== null && step.at !== undefined) {
        foundMatchesRef.current = [...foundMatchesRef.current, step.at]
        setMatches([...foundMatchesRef.current])
      }
      idxRef.current += 1
      return false
    }

    tick()
    const interval = setInterval(() => {
      const done = tick()
      if (done) clearInterval(interval)
    }, 700 / speed)
    return () => clearInterval(interval)
  }, [trigger, text, pattern, speed, algoKey, steps])

  const complexity = complexityMap[algoKey]
  const isRunning = trigger > 0 && !isFinished && stepIndex >= 0

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
        className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50"
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
              : isRunning
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(51,65,85,0.5)',
            color: isFinished ? meta.accent : isRunning ? '#34d399' : '#94a3b8',
            border: `1px solid ${isFinished ? meta.accentBorder : isRunning ? 'rgba(52,211,153,0.3)' : 'rgba(51,65,85,0.5)'}`,
          }}
        >
          {isFinished ? 'Done' : isRunning ? 'Searching…' : 'Ready'}
        </span>
      </div>

      {/* Text visualisation strip */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="rounded-xl p-3 overflow-x-auto"
          style={{
            background: 'rgba(2,6,23,0.6)',
            border: '1px solid rgba(30,41,59,0.8)',
          }}
        >
          <div className="flex gap-1 min-w-max">
            {text.split('').map((ch, i) => {
              const inMatch = matches.some(
                (m) => i >= m && i < m + pattern.length
              )
              return (
                <div
                  key={i}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold border transition-all duration-200"
                  style={{
                    background: inMatch
                      ? `${meta.accentBg}`
                      : 'rgba(30,41,59,0.5)',
                    borderColor: inMatch ? meta.accent : 'rgba(51,65,85,0.4)',
                    color: inMatch ? meta.accent : '#64748b',
                  }}
                >
                  {ch}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-2 mt-1">
        {[
          { label: 'Matches', value: matches.length, color: '#10b981' },
          { label: 'Comparisons', value: comparisons, color: meta.accent },
          {
            label: 'Time',
            value: elapsedMs !== null ? `${elapsedMs}ms` : '—',
            color: '#f8fafc',
          },
          { label: 'Space', value: complexity?.space ?? '—', color: '#f8fafc' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg p-2"
            style={{
              background: 'rgba(2,6,23,0.7)',
              border: '1px solid rgba(30,41,59,0.8)',
            }}
          >
            <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
              {label}
            </p>
            <p className="font-mono text-sm font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Match positions */}
      <div className="px-4 pb-4">
        <div
          className="rounded-lg px-3 py-2 min-h-[28px]"
          style={{
            background: 'rgba(2,6,23,0.5)',
            border: '1px solid rgba(30,41,59,0.6)',
          }}
        >
          <p className="text-[9px] text-slate-500">
            {isFinished
              ? matches.length
                ? `Found at: [${matches.join(', ')}]`
                : 'No matches found'
              : isRunning
                ? 'Searching…'
                : 'Awaiting input'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── CompareMode (default export) ─────────────────────────────────────────────
export default function CompareMode() {
  const [selectedAlgos, setSelectedAlgos] = useState([
    'kmp',
    'rabinkarp',
    'zalgorithm',
  ])
  const [textInput, setTextInput] = useState('AABAACAADAABAABA')
  const [patternInput, setPatternInput] = useState('AABA')
  const [activeText, setActiveText] = useState('')
  const [activePattern, setActivePattern] = useState('')
  const [speed, setSpeed] = useState(2)
  const [trigger, setTrigger] = useState(0)
  const [winner, setWinner] = useState(null)
  const [completedAlgos, setCompletedAlgos] = useState(new Set())
  const [hasStarted, setHasStarted] = useState(false)

  const handleStart = () => {
    if (!textInput.trim() || !patternInput.trim()) return
    setActiveText(textInput.trim())
    setActivePattern(patternInput.trim())
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(true)
    setTrigger((t) => t + 1)
  }

  const handleReset = () => {
    setTrigger(0)
    setWinner(null)
    setCompletedAlgos(new Set())
    setHasStarted(false)
    setActiveText('')
    setActivePattern('')
  }

  const handleComplete = React.useCallback((algoKey) => {
    setCompletedAlgos((prev) => {
      const next = new Set(prev)
      next.add(algoKey)
      return next
    })
    setWinner((prev) => prev ?? algoKey)
  }, [])

  const toggleAlgo = (key) => {
    setSelectedAlgos((prev) => {
      if (prev.includes(key))
        return prev.length <= 2 ? prev : prev.filter((k) => k !== key)
      return [...prev, key]
    })
    handleReset()
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-5">
      {/* Control panel */}
      <div
        className="rounded-2xl border border-slate-700/60 p-4"
        style={{ background: 'rgba(15,23,42,0.8)' }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Inputs */}
          <div className="flex flex-col gap-3 flex-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400/80 mb-1">
                Text
              </p>
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="AABAACAADAABAABA"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400/80 mb-1">
                Pattern
              </p>
              <input
                value={patternInput}
                onChange={(e) => setPatternInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="AABA"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Algorithm toggles */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                Algorithms
              </p>
              <div className="flex gap-2">
                {ALL_ALGOS.map((key) => {
                  const meta = ALGO_META[key]
                  const isSelected = selectedAlgos.includes(key)
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

            {/* Speed + actions */}
            <div className="flex items-end gap-3">
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

              <div className="flex gap-2">
                {hasStarted && (
                  <button
                    onClick={handleReset}
                    className="h-9 px-4 rounded-xl text-xs font-bold border border-slate-600 text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-all"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={handleStart}
                  disabled={
                    !textInput.trim() ||
                    !patternInput.trim() ||
                    selectedAlgos.length < 2
                  }
                  className="h-9 px-5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(6,182,212,0.85)',
                    color: '#000',
                    boxShadow: '0 0 16px rgba(6,182,212,0.4)',
                  }}
                >
                  ▶ Start Race
                </button>
              </div>
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

      {/* Panels */}
      <div
        className={`grid gap-3 ${selectedAlgos.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}
      >
        {selectedAlgos.map((key) => (
          <AlgoPanel
            key={`${key}-${trigger}`}
            algoKey={key}
            text={activeText || ALGO_META[key].defaultText}
            pattern={activePattern || ALGO_META[key].defaultPattern}
            speed={speed}
            trigger={trigger}
            onComplete={handleComplete}
            isWinner={winner === key}
          />
        ))}
      </div>
    </div>
  )
}
