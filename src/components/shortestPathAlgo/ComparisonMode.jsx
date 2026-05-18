import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { complexityMap } from '../../data/complexityMap'

// Weighted directed graph used for all three algorithms
const NODES = [1, 2, 3, 4, 5, 6]
const EDGES = [
  { from: 1, to: 2, weight: 4 },
  { from: 1, to: 3, weight: 2 },
  { from: 2, to: 3, weight: 5 },
  { from: 2, to: 4, weight: 10 },
  { from: 3, to: 4, weight: 3 },
  { from: 3, to: 5, weight: 8 },
  { from: 4, to: 6, weight: 6 },
  { from: 5, to: 4, weight: 1 },
  { from: 5, to: 6, weight: 9 },
  { from: 6, to: 1, weight: 7 },
]

const INF = Infinity

function buildAdjList() {
  const adj = {}
  for (const n of NODES) adj[n] = []
  for (const e of EDGES) adj[e.from].push({ to: e.to, w: e.weight })
  return adj
}

// Run Dijkstra and return steps: [{dist: {}, visited: Set, current: n, relaxed: []}]
function runDijkstra(source) {
  const adj = buildAdjList()
  const dist = {}
  for (const n of NODES) dist[n] = INF
  dist[source] = 0
  const visited = new Set()
  const steps = [
    {
      dist: { ...dist },
      visited: new Set(visited),
      current: null,
      relaxed: [],
      phase: `Init: dist[${source}] = 0`,
    },
  ]

  for (let i = 0; i < NODES.length; i++) {
    // Pick unvisited node with min dist
    let u = null
    for (const n of NODES) {
      if (!visited.has(n) && (u === null || dist[n] < dist[u])) u = n
    }
    if (u === null || dist[u] === INF) break
    visited.add(u)

    const relaxed = []
    for (const { to, w } of adj[u]) {
      if (dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w
        relaxed.push(to)
      }
    }
    steps.push({
      dist: { ...dist },
      visited: new Set(visited),
      current: u,
      relaxed,
      phase: `Visit node ${u}, relax neighbors`,
    })
  }

  steps.push({
    dist: { ...dist },
    visited: new Set(visited),
    current: null,
    relaxed: [],
    phase: 'Complete',
    done: true,
  })
  return steps
}

// Run Bellman-Ford and return steps
function runBellmanFord(source) {
  const dist = {}
  for (const n of NODES) dist[n] = INF
  dist[source] = 0
  const steps = [
    {
      dist: { ...dist },
      iteration: 0,
      relaxed: [],
      phase: `Init: dist[${source}] = 0`,
    },
  ]

  for (let i = 1; i < NODES.length; i++) {
    const relaxed = []
    for (const { from, to, weight } of EDGES) {
      if (dist[from] !== INF && dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight
        relaxed.push({ from, to })
      }
    }
    steps.push({
      dist: { ...dist },
      iteration: i,
      relaxed: relaxed.map((r) => r.to),
      phase: `Iteration ${i}: relax all edges`,
    })
    if (relaxed.length === 0) {
      steps.push({
        dist: { ...dist },
        iteration: i,
        relaxed: [],
        phase: 'Early termination — no updates',
        done: true,
      })
      return steps
    }
  }

  steps.push({
    dist: { ...dist },
    iteration: NODES.length - 1,
    relaxed: [],
    phase: 'Complete',
    done: true,
  })
  return steps
}

// Run Floyd-Warshall (all pairs) and return steps
function runFloydWarshall() {
  // Build matrix
  const size = NODES.length
  const idx = (v) => v - 1
  const dist = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 0 : INF))
  )

  for (const { from, to, weight } of EDGES) {
    dist[idx(from)][idx(to)] = weight
  }

  const steps = [
    {
      dist: dist.map((r) => [...r]),
      k: null,
      phase: 'Initialize distance matrix',
    },
  ]

  for (let k = 0; k < size; k++) {
    const updated = []
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (
          dist[i][k] !== INF &&
          dist[k][j] !== INF &&
          dist[i][k] + dist[k][j] < dist[i][j]
        ) {
          dist[i][j] = dist[i][k] + dist[k][j]
          updated.push([i + 1, j + 1])
        }
      }
    }
    steps.push({
      dist: dist.map((r) => [...r]),
      k: k + 1,
      updated,
      phase: `Intermediate node k=${k + 1}: ${updated.length} paths improved`,
    })
  }

  steps.push({
    dist: dist.map((r) => [...r]),
    k: null,
    updated: [],
    phase: 'All-pairs shortest paths complete',
    done: true,
  })
  return steps
}

const ALGO_META = {
  dijkstra: {
    label: "Dijkstra's",
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.1)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glow: 'rgba(6,182,212,0.35)',
    description: 'Single-source, greedy, non-negative weights only',
    runs: (src) => runDijkstra(src),
    renderStep: (step, meta) => <DijkstraView step={step} meta={meta} />,
  },
  bellmanford: {
    label: 'Bellman-Ford',
    accent: '#fb923c',
    accentBg: 'rgba(251,146,60,0.1)',
    accentBorder: 'rgba(251,146,60,0.3)',
    glow: 'rgba(251,146,60,0.35)',
    description:
      'Single-source, handles negative weights & detects negative cycles',
    runs: (src) => runBellmanFord(src),
    renderStep: (step, meta) => <BellmanFordView step={step} meta={meta} />,
  },
  floydwarshall: {
    label: 'Floyd-Warshall',
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.1)',
    accentBorder: 'rgba(167,139,250,0.3)',
    glow: 'rgba(167,139,250,0.35)',
    description: 'All-pairs shortest paths via dynamic programming',
    runs: () => runFloydWarshall(),
    renderStep: (step, meta) => <FloydView step={step} meta={meta} />,
  },
}

function DistBar({ node, dist, meta, highlighted }) {
  const val = dist[node]
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] font-bold w-4 text-slate-400">
        {node}
      </span>
      <div className="flex-1 h-4 rounded-full overflow-hidden bg-slate-800">
        {val !== INF && (
          <motion.div
            className="h-full rounded-full"
            style={{
              background: highlighted ? meta.accent : meta.accentBorder,
              width: `${Math.min(100, (val / 20) * 100)}%`,
            }}
            animate={{ width: `${Math.min(100, (val / 20) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      <span
        className="font-mono text-[10px] font-bold w-10 text-right"
        style={{
          color:
            val === INF ? '#475569' : highlighted ? meta.accent : '#94a3b8',
        }}
      >
        {val === INF ? '∞' : val}
      </span>
    </div>
  )
}

function DijkstraView({ step, meta }) {
  if (!step) return null
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">
        Shortest Distances from Source
      </p>
      {NODES.map((n) => (
        <DistBar
          key={n}
          node={n}
          dist={step.dist}
          meta={meta}
          highlighted={step.relaxed?.includes(n) || step.current === n}
        />
      ))}
      <p className="text-[9px] text-slate-500 mt-2">
        Visited: {step.visited ? [...step.visited].join(', ') || '—' : '—'}
      </p>
    </div>
  )
}

function BellmanFordView({ step, meta }) {
  if (!step) return null
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">
        Shortest Distances from Source
      </p>
      {NODES.map((n) => (
        <DistBar
          key={n}
          node={n}
          dist={step.dist}
          meta={meta}
          highlighted={step.relaxed?.includes(n)}
        />
      ))}
      <p className="text-[9px] text-slate-500 mt-2">
        Iteration: {step.iteration} / {NODES.length - 1}
      </p>
    </div>
  )
}

function FloydView({ step, meta }) {
  if (!step) return null
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">
        Distance Matrix (rows=from, cols=to)
      </p>
      <div className="overflow-x-auto">
        <table className="text-[9px] font-mono border-collapse">
          <thead>
            <tr>
              <td className="w-5" />
              {NODES.map((c) => (
                <th key={c} className="w-7 text-center text-slate-500 pb-1">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {step.dist.map((row, i) => (
              <tr key={i}>
                <td className="text-slate-500 pr-1 text-right">{i + 1}</td>
                {row.map((val, j) => {
                  const isUpdated = step.updated?.some(
                    ([ui, uj]) => ui === i + 1 && uj === j + 1
                  )
                  return (
                    <td
                      key={j}
                      className="w-7 h-5 text-center rounded"
                      style={{
                        color:
                          val === INF
                            ? '#374151'
                            : isUpdated
                              ? meta.accent
                              : '#94a3b8',
                        background: isUpdated ? meta.accentBg : 'transparent',
                      }}
                    >
                      {val === INF ? '∞' : val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AlgoPanel({ algoKey, source, speed, trigger, onComplete, isWinner }) {
  const meta = ALGO_META[algoKey]
  const steps = React.useMemo(() => {
    if (trigger === 0) return []
    return meta.runs(source)
  }, [meta, source, trigger])
  const [stepIndex, setStepIndex] = useState(() => (steps.length > 0 ? 0 : -1))
  const [isPlaying, setIsPlaying] = useState(() => steps.length > 0)
  const [isFinished, setIsFinished] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(null)
  const timeoutRef = React.useRef(null)
  const startTimeRef = React.useRef(null)
  const stepIdxRef = React.useRef(steps.length > 0 ? 0 : -1)

  React.useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    if (startTimeRef.current === null) startTimeRef.current = performance.now()

    const advance = () => {
      const delay = Math.max(100, Math.round(700 / speed))
      timeoutRef.current = setTimeout(() => {
        const nextIdx = stepIdxRef.current + 1
        if (nextIdx >= steps.length) {
          setIsPlaying(false)
          setIsFinished(true)
          setElapsedMs(Math.round(performance.now() - startTimeRef.current))
          onComplete(algoKey)
          return
        }
        stepIdxRef.current = nextIdx
        setStepIndex(nextIdx)
        advance()
      }, delay)
    }

    advance()
    return () => clearTimeout(timeoutRef.current)
  }, [algoKey, isPlaying, onComplete, speed, steps])

  const currentStep = steps[stepIndex] ?? null
  const complexity = complexityMap[algoKey]

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
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: meta.accent,
              boxShadow: `0 0 8px ${meta.glow}`,
            }}
          />
          <div>
            <p className="text-xs font-bold text-white">{meta.label}</p>
            <p className="text-[9px] text-slate-500 max-w-[200px]">
              {meta.description}
            </p>
          </div>
          {isWinner && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: meta.accent, color: '#000' }}
            >
              🏆 Fastest
            </motion.span>
          )}
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
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
          {isFinished ? 'Done' : isPlaying ? 'Running…' : 'Ready'}
        </span>
      </div>

      {/* Phase label */}
      <div className="px-4 pt-3 pb-1">
        <div
          className="rounded-lg px-3 py-1.5"
          style={{
            background: 'rgba(2,6,23,0.5)',
            border: '1px solid rgba(30,41,59,0.6)',
          }}
        >
          <p className="text-[10px] font-medium" style={{ color: meta.accent }}>
            {currentStep?.phase || 'Waiting…'}
          </p>
        </div>
      </div>

      {/* Algorithm-specific content */}
      <div className="px-4 py-3 flex-1">
        {currentStep && meta.renderStep(currentStep, meta)}
      </div>

      {/* Bottom metrics */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Steps', value: Math.max(0, stepIndex) },
          { label: 'Time', value: elapsedMs !== null ? `${elapsedMs}ms` : '—' },
          {
            label: 'Complexity',
            value: complexity?.time?.split(',')[0] ?? '—',
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg p-2"
            style={{
              background: 'rgba(2,6,23,0.7)',
              border: '1px solid rgba(30,41,59,0.8)',
            }}
          >
            <p className="text-[8px] uppercase tracking-widest text-slate-500 mb-0.5">
              {label}
            </p>
            <p
              className="font-mono text-[11px] font-bold"
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

export default function ShortestPathComparison() {
  const [source, setSource] = useState(1)
  const [speed, setSpeed] = useState(2)
  const [trigger, setTrigger] = useState(0)
  const [winner, setWinner] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)

  const handleComplete = useCallback((algoKey) => {
    setWinner((prev) => prev ?? algoKey)
  }, [])

  const handleStart = () => {
    setWinner(null)
    setHasStarted(true)
    setTrigger((t) => t + 1)
  }

  const handleReset = () => {
    setTrigger(0)
    setWinner(null)
    setHasStarted(false)
  }

  // Node positions for graph preview SVG
  const nodePos = {
    1: [80, 60],
    2: [200, 30],
    3: [200, 120],
    4: [320, 60],
    5: [320, 160],
    6: [420, 100],
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
                Source Node
              </p>
              <div className="flex gap-1.5">
                {NODES.map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setSource(n)
                      handleReset()
                    }}
                    className="w-9 h-9 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      background:
                        source === n
                          ? 'rgba(6,182,212,0.15)'
                          : 'rgba(30,41,59,0.5)',
                      borderColor:
                        source === n ? '#06b6d4' : 'rgba(51,65,85,0.8)',
                      color: source === n ? '#06b6d4' : '#64748b',
                    }}
                  >
                    {n}
                  </button>
                ))}
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
            className="h-9 px-5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: hasStarted
                ? 'rgba(244,63,94,0.2)'
                : 'rgba(6,182,212,0.85)',
              color: hasStarted ? '#f43f5e' : '#000',
              border: hasStarted ? '1px solid rgba(244,63,94,0.5)' : 'none',
              boxShadow: hasStarted ? 'none' : '0 0 16px rgba(6,182,212,0.4)',
            }}
          >
            {hasStarted ? 'Reset' : '▶ Run All Three'}
          </button>
        </div>
      </div>

      {/* Graph preview */}
      <div
        className="rounded-xl border border-slate-700/40 p-3"
        style={{ background: 'rgba(15,23,42,0.6)' }}
      >
        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">
          Shared Graph (6 nodes, directed, weighted)
        </p>
        <svg viewBox="0 0 500 210" width="100%" style={{ maxHeight: '140px' }}>
          <defs>
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(100,116,139,0.7)" />
            </marker>
          </defs>
          {EDGES.map((e, i) => {
            const [fx, fy] = nodePos[e.from]
            const [tx, ty] = nodePos[e.to]
            const mx = (fx + tx) / 2
            const my = (fy + ty) / 2
            return (
              <g key={i}>
                <line
                  x1={fx}
                  y1={fy}
                  x2={tx}
                  y2={ty}
                  stroke="rgba(100,116,139,0.5)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={mx}
                  y={my - 4}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {e.weight}
                </text>
              </g>
            )
          })}
          {Object.entries(nodePos).map(([id, [x, y]]) => (
            <g key={id}>
              <circle
                cx={x}
                cy={y}
                r="14"
                fill={
                  parseInt(id) === source
                    ? 'rgba(6,182,212,0.25)'
                    : 'rgba(30,41,59,0.9)'
                }
                stroke={
                  parseInt(id) === source ? '#06b6d4' : 'rgba(51,65,85,0.8)'
                }
                strokeWidth={parseInt(id) === source ? 2 : 1}
              />
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={parseInt(id) === source ? '#06b6d4' : '#94a3b8'}
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {id}
              </text>
            </g>
          ))}
        </svg>
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
                {ALGO_META[winner].label} completed first!
              </p>
              <p className="text-[10px] text-slate-400">
                Dijkstra is fastest for non-negative weights. Bellman-Ford
                handles negatives. Floyd-Warshall gives all-pairs shortest
                paths.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.keys(ALGO_META).map((key) => (
          <AlgoPanel
            key={`${key}-${trigger}`}
            algoKey={key}
            source={source}
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
