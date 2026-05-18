import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Fixed graph used by existing CanvasSearching
const GRAPH = {
  1: [2, 5, 6],
  2: [1, 3, 7],
  3: [2, 4, 6],
  4: [3, 5, 6],
  5: [1, 4, 6, 9],
  6: [1, 3, 4, 5],
  7: [2, 8, 9],
  8: [7, 9],
  9: [5, 7, 8],
}

// Fixed node positions for a consistent layout
const NODE_POSITIONS = {
  1: { x: 150, y: 80 },
  2: { x: 80, y: 180 },
  3: { x: 220, y: 220 },
  4: { x: 310, y: 140 },
  5: { x: 260, y: 300 },
  6: { x: 180, y: 330 },
  7: { x: 60, y: 300 },
  8: { x: 40, y: 400 },
  9: { x: 160, y: 430 },
}

const ALGO_META = {
  bfs: {
    label: 'Breadth-First Search',
    short: 'BFS',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.1)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glow: 'rgba(6,182,212,0.35)',
    description: 'Explores level by level using a queue (FIFO)',
  },
  dfs: {
    label: 'Depth-First Search',
    short: 'DFS',
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.1)',
    accentBorder: 'rgba(167,139,250,0.3)',
    glow: 'rgba(167,139,250,0.35)',
    description: 'Explores as deep as possible using a stack (LIFO)',
  },
}

function generateBFSSteps(startNode) {
  const steps = []
  const visited = new Set()
  const queue = [startNode]
  visited.add(startNode)
  steps.push({
    visited: new Set(visited),
    current: null,
    queue: [...queue],
    frontier: new Set([startNode]),
    order: [],
  })

  const order = []
  while (queue.length > 0) {
    const node = queue.shift()
    order.push(node)
    steps.push({
      visited: new Set(visited),
      current: node,
      queue: [...queue],
      frontier: new Set(queue),
      order: [...order],
    })

    for (const neighbor of GRAPH[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
        steps.push({
          visited: new Set(visited),
          current: node,
          queue: [...queue],
          frontier: new Set(queue),
          order: [...order],
        })
      }
    }
  }
  steps.push({
    visited: new Set(visited),
    current: null,
    queue: [],
    frontier: new Set(),
    order: [...order],
    done: true,
  })
  return steps
}

function generateDFSSteps(startNode) {
  const steps = []
  const visited = new Set()
  const order = []

  function dfs(node) {
    visited.add(node)
    order.push(node)
    steps.push({
      visited: new Set(visited),
      current: node,
      stack: [...order],
      frontier: new Set(),
      order: [...order],
    })

    for (const neighbor of GRAPH[node] || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor)
      }
    }
  }

  dfs(startNode)
  steps.push({
    visited: new Set(visited),
    current: null,
    stack: [],
    frontier: new Set(),
    order: [...order],
    done: true,
  })
  return steps
}

function GraphPanel({
  algoKey,
  startNode,
  speed,
  trigger,
  onComplete,
  isWinner,
}) {
  const meta = ALGO_META[algoKey]
  const steps = useMemo(() => {
    if (trigger === 0 || !startNode) return []
    return algoKey === 'bfs'
      ? generateBFSSteps(startNode)
      : generateDFSSteps(startNode)
  }, [algoKey, startNode, trigger])
  const [stepIndex, setStepIndex] = useState(() => (steps.length > 0 ? 0 : -1))
  const [isPlaying, setIsPlaying] = useState(() => steps.length > 0)
  const [isFinished, setIsFinished] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(null)
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)
  const stepIdxRef = useRef(steps.length > 0 ? 0 : -1)

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    if (startTimeRef.current === null) startTimeRef.current = performance.now()

    const advance = () => {
      const delay = Math.max(120, Math.round(600 / speed))
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
  const visitedNodes = currentStep?.visited ?? new Set()
  const currentNode = currentStep?.current
  const frontierNodes = currentStep?.frontier ?? new Set()
  const visitOrder = currentStep?.order ?? []

  const getNodeColor = (nodeId) => {
    if (nodeId === currentNode) return meta.accent
    if (frontierNodes.has(nodeId)) return '#f59e0b'
    if (visitedNodes.has(nodeId)) return meta.accentBorder.replace('0.3', '0.8')
    return 'rgba(30,41,59,0.9)'
  }

  const getNodeStroke = (nodeId) => {
    if (nodeId === currentNode) return meta.accent
    if (visitedNodes.has(nodeId)) return meta.accent
    return 'rgba(51,65,85,0.8)'
  }

  const isEdgeVisited = (a, b) => visitedNodes.has(a) && visitedNodes.has(b)

  const W = 360,
    H = 480

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
              🏆 First
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
          {isFinished ? 'Done' : isPlaying ? 'Traversing…' : 'Ready'}
        </span>
      </div>

      {/* Graph SVG */}
      <div className="flex-1 flex items-center justify-center p-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ maxHeight: '340px' }}
        >
          {/* Edges */}
          {Object.entries(GRAPH).flatMap(([from, neighbors]) =>
            neighbors
              .filter((to) => parseInt(from) < to)
              .map((to) => {
                const f = NODE_POSITIONS[parseInt(from)]
                const t = NODE_POSITIONS[to]
                const visited = isEdgeVisited(parseInt(from), to)
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={visited ? meta.accentBorder : 'rgba(51,65,85,0.5)'}
                    strokeWidth={visited ? 2 : 1}
                    strokeOpacity={0.8}
                  />
                )
              })
          )}
          {/* Nodes */}
          {Object.entries(NODE_POSITIONS).map(([id, pos]) => {
            const nodeId = parseInt(id)
            const isCurrent = nodeId === currentNode
            return (
              <g key={id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isCurrent ? 18 : 14}
                  fill={getNodeColor(nodeId)}
                  stroke={getNodeStroke(nodeId)}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isCurrent
                      ? `drop-shadow(0 0 8px ${meta.accent})`
                      : 'none',
                  }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={isCurrent ? 11 : 9}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend row */}
      <div className="px-4 pb-2 flex gap-3 flex-wrap">
        {[
          { color: meta.accent, label: 'Current' },
          { color: '#f59e0b', label: 'Frontier' },
          { color: meta.accentBorder.replace('0.3', '0.8'), label: 'Visited' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
            />
            <span className="text-[9px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="px-4 pb-3 grid grid-cols-3 gap-2">
        {[
          { label: 'Visited', value: visitedNodes.size },
          { label: 'Steps', value: Math.max(0, stepIndex) },
          { label: 'Time', value: elapsedMs !== null ? `${elapsedMs}ms` : '—' },
        ].map(({ label, value }) => (
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
            <p
              className="font-mono text-sm font-bold"
              style={{ color: meta.accent }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Visit order */}
      <div className="px-4 pb-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
          Traversal Order
        </p>
        <div className="flex flex-wrap gap-1">
          {visitOrder.map((n, i) => (
            <span
              key={i}
              className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: meta.accentBg,
                color: meta.accent,
                border: `1px solid ${meta.accentBorder}`,
              }}
            >
              {n}
            </span>
          ))}
          {visitOrder.length === 0 && (
            <span className="text-[9px] text-slate-600">—</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function GraphSearchComparison() {
  const [startNode, setStartNode] = useState(1)
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
                Start Node
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setStartNode(n)
                      handleReset()
                    }}
                    className="w-9 h-9 rounded-lg text-xs font-bold border transition-all"
                    style={{
                      background:
                        startNode === n
                          ? 'rgba(6,182,212,0.15)'
                          : 'rgba(30,41,59,0.5)',
                      borderColor:
                        startNode === n ? '#06b6d4' : 'rgba(51,65,85,0.8)',
                      color: startNode === n ? '#06b6d4' : '#64748b',
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
            {hasStarted ? 'Reset' : '▶ Start Race'}
          </button>
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
            <p
              className="text-xs font-bold"
              style={{ color: ALGO_META[winner].accent }}
            >
              {ALGO_META[winner].label} completed traversal first from node{' '}
              {startNode}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info callout */}
      <div
        className="rounded-xl px-4 py-3 text-xs text-slate-400 border border-slate-700/40"
        style={{ background: 'rgba(15,23,42,0.6)' }}
      >
        <strong className="text-slate-300">How they differ:</strong> BFS uses a
        queue — it visits all neighbors before going deeper, guaranteeing the
        shortest path in unweighted graphs. DFS uses a stack (or recursion) — it
        dives deep first, useful for cycle detection and topological sort.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.keys(ALGO_META).map((key) => (
          <GraphPanel
            key={`${key}-${trigger}`}
            algoKey={key}
            startNode={startNode}
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
