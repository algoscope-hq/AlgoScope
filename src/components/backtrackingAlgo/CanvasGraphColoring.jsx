import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useCallback,
} from 'react'
import StatusDisplay from '../StatusDisplay'
import { calculateStepDelay } from '../../lib/utils'

// Graph presets
const PRESET_GRAPHS = {
  'Cycle-6': [
    [0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0],
  ],
  'Complete-4 (K4)': [
    [0, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 1, 1, 0],
  ],
  Bipartite: [
    [0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0],
  ],
  'Petersen-like': [
    [0, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 1, 0],
  ],
  'Petersen (10)': [
    [0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
  ],
  'Tree (7)': [
    [0, 1, 1, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 1],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
  ],
  'Wheel (7)': [
    [0, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0, 1, 0],
  ],
}

const CHROMATIC_NUMBERS = {
  'Cycle-6': 2,
  'Complete-4 (K4)': 4,
  Bipartite: 2,
  'Petersen-like': 3,
  'Petersen (10)': 3,
  'Tree (7)': 2,
  'Wheel (7)': 4,
}

const COLOR_PALETTE = [
  null,
  '#22d3ee',
  '#f97316',
  '#a855f7',
  '#facc15',
  '#4ade80',
  '#f43f5e',
]
const MAX_NODES = 12
const SVG_W = 400
const SVG_H = 400
const CX = 200
const CY = 200
const RADIUS = 155

// Helpers
function buildPositions(n) {
  return Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    return {
      x: CX + RADIUS * Math.cos(angle),
      y: CY + RADIUS * Math.sin(angle),
    }
  })
}

function getConflictEdges(graph, colors, activeNode) {
  if (activeNode < 0) return new Set()
  const edges = new Set()
  const activeColor = colors[activeNode]
  if (!activeColor) return edges
  for (let i = 0; i < graph[activeNode].length; i++) {
    if (graph[activeNode][i] && colors[i] === activeColor) {
      edges.add(`${Math.min(activeNode, i)}-${Math.max(activeNode, i)}`)
    }
  }
  return edges
}

function replayBacktracks(frames, index) {
  let count = 0
  for (let i = 0; i <= index; i++) if (frames[i].type === 'backtrack') count++
  return count
}

function streamGraphColoringFrames(graph, k, onFrame) {
  const n = graph.length
  const colors = Array(n).fill(0)
  function isSafe(node, color) {
    for (let i = 0; i < n; i++)
      if (graph[node][i] && colors[i] === color) return false
    return true
  }
  function snapshot(type, node, message) {
    onFrame({ colors: [...colors], type, activeNode: node, message })
  }
  function solve(node) {
    if (node === n) {
      snapshot('solution', -1, '✓ Valid coloring found!')
      return true
    }
    for (let color = 1; color <= k; color++) {
      snapshot('try', node, `Node ${node + 1}: trying color ${color}…`)
      if (!isSafe(node, color)) {
        snapshot(
          'conflict',
          node,
          `Node ${node + 1}, color ${color}: conflict — backtracking`
        )
        continue
      }
      colors[node] = color
      snapshot('place', node, `Node ${node + 1}: assigned color ${color}`)
      if (solve(node + 1)) return true
      colors[node] = 0
      snapshot('backtrack', node, `Node ${node + 1}: unassigned (backtrack)`)
    }
    return false
  }
  solve(0)
}

// Add a row/col for a new node (no edges)
function matrixAddNode(m) {
  const n = m.length
  const next = m.map((row) => [...row, 0])
  next.push(Array(n + 1).fill(0))
  return next
}

// Remove node i and its edges
function matrixRemoveNode(m, i) {
  return m.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== i))
}

// Toggle edge between i and j (symmetric)
function matrixToggleEdge(m, i, j) {
  const next = m.map((row) => [...row])
  next[i][j] = next[i][j] ? 0 : 1
  next[j][i] = next[j][i] ? 0 : 1
  return next
}

// Reducer
const RESET_STATE = {
  frame: null,
  backtracks: 0,
  steps: 0,
  done: false,
  solved: false,
  paused: false,
  stepIndex: 0,
  logEntries: [],
}

function reducer(state, action) {
  if (action.type === 'RESET') return RESET_STATE
  if (action.type === 'PUSH_LOG')
    return { ...state, logEntries: [...state.logEntries, action.entry] }
  if (action.type === 'TRIM_LOG')
    return { ...state, logEntries: state.logEntries.slice(0, action.length) }
  return { ...state, ...action }
}

// Component
export const CanvasGraphColoring = ({
  speed = 1,
  trigger = 0,
  colorK = 3,
  preset = 'Petersen-like',
}) => {
  const [state, dispatch] = useReducer(reducer, RESET_STATE)
  const {
    frame,
    backtracks,
    steps,
    done,
    solved,
    paused,
    stepIndex,
    logEntries,
  } = state

  const timerRef = useRef(null)
  const pausedRef = useRef(false)
  const stepIndexRef = useRef(0)
  const backtrackCountRef = useRef(0)
  const stepCountRef = useRef(0)
  const logListRef = useRef(null)

  const K = colorK

  // Custom graph editing state
  const baseGraph = useMemo(
    () => PRESET_GRAPHS[preset] ?? PRESET_GRAPHS['Petersen-like'],
    [preset]
  )

  const [customPreset, setCustomPreset] = useState(null)
  const [customMatrix, setCustomMatrix] = useState(null)
  const [customPositions, setCustomPositions] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)

  // The graph actually used for everything downstream
  const graph =
    customPreset === preset && customMatrix ? customMatrix : baseGraph
  const n = graph.length
  const positions = useMemo(
    () =>
      customPreset === preset && customPositions
        ? customPositions
        : buildPositions(n),
    [customPreset, preset, customPositions, n]
  )

  const frames = useMemo(() => {
    if (trigger === 0) return []
    const f = []
    streamGraphColoringFrames(graph, K, (fr) => f.push(fr))
    return f
  }, [trigger, K, graph])

  const chromaticNumber = customMatrix
    ? null
    : (CHROMATIC_NUMBERS[preset] ?? null)
  const kTooLow = chromaticNumber !== null && K < chromaticNumber

  // Reset animation on new trigger
  useEffect(() => {
    clearTimeout(timerRef.current)
    dispatch({ type: 'RESET' })
    pausedRef.current = false
    stepIndexRef.current = 0
    backtrackCountRef.current = 0
    stepCountRef.current = 0
  }, [trigger])

  const handlePause = () => {
    const next = !pausedRef.current
    pausedRef.current = next
    dispatch({ paused: next })
  }

  const pushLog = (f, index) => {
    dispatch({ type: 'PUSH_LOG', entry: { ...f, index } })
    setTimeout(() => {
      if (logListRef.current)
        logListRef.current.scrollTop = logListRef.current.scrollHeight
    }, 30)
  }

  const handleStepForward = () => {
    if (stepIndexRef.current >= frames.length - 1) return
    const next = stepIndexRef.current + 1
    const f = frames[next]
    stepIndexRef.current = next
    if (f.type === 'backtrack') backtrackCountRef.current += 1
    stepCountRef.current += 1
    pushLog(f, next)
    dispatch({
      frame: f,
      stepIndex: next,
      backtracks: backtrackCountRef.current,
      steps: stepCountRef.current,
      ...(f.type === 'solution' && { solved: true }),
      ...(next === frames.length - 1 && { done: true }),
    })
  }

  const handleStepBack = () => {
    if (stepIndexRef.current <= 0) return
    const prev = stepIndexRef.current - 1
    stepIndexRef.current = prev
    const trueBacktracks = replayBacktracks(frames, prev)
    backtrackCountRef.current = trueBacktracks
    stepCountRef.current = prev
    dispatch({
      frame: frames[prev],
      stepIndex: prev,
      backtracks: trueBacktracks,
      steps: prev,
      logEntries: logEntries.slice(0, prev + 1),
    })
  }

  // Animation loop
  useEffect(() => {
    clearTimeout(timerRef.current)
    if (trigger === 0 || frames.length === 0 || paused || done) return
    const delay = calculateStepDelay(120, speed)
    function scheduleNext(i) {
      if (i >= frames.length) return
      timerRef.current = setTimeout(() => {
        if (pausedRef.current) {
          stepIndexRef.current = i
          dispatch({ stepIndex: i })
          return
        }
        const f = frames[i]
        stepIndexRef.current = i
        if (f.type === 'backtrack') backtrackCountRef.current += 1
        stepCountRef.current += 1
        pushLog(f, i)
        const isLast = i === frames.length - 1
        dispatch({
          frame: f,
          stepIndex: i,
          backtracks: backtrackCountRef.current,
          steps: stepCountRef.current,
          ...(f.type === 'solution' && { solved: true }),
          ...(isLast && { done: true }),
        })
        if (!isLast) scheduleNext(i + 1)
      }, delay)
    }
    scheduleNext(stepIndexRef.current)
    return () => clearTimeout(timerRef.current)
  }, [trigger, speed, paused, done, frames])

  // Graph editing handlers
  const enterEditMode = () => {
    // Seed custom state from current preset if not already customised
    if (!customMatrix || customPreset !== preset) {
      setCustomMatrix(baseGraph.map((r) => [...r]))
      setCustomPositions(buildPositions(baseGraph.length))
      setCustomPreset(preset)
    }
    setEditMode(true)
    setSelectedNode(null)
  }

  const exitEditMode = () => {
    setEditMode(false)
    setSelectedNode(null)
  }

  const handleAddNode = () => {
    if (n >= MAX_NODES) return
    const newN = n + 1
    setCustomMatrix((prev) =>
      matrixAddNode(prev ?? baseGraph.map((r) => [...r]))
    )
    setCustomPositions(buildPositions(newN))
    setSelectedNode(null)
  }

  const handleRemoveSelected = () => {
    if (selectedNode === null) return
    const newN = n - 1
    setCustomMatrix((prev) =>
      matrixRemoveNode(prev ?? baseGraph.map((r) => [...r]), selectedNode)
    )
    setCustomPositions(buildPositions(newN))
    setSelectedNode(null)
  }

  const handleResetGraph = () => {
    setCustomMatrix(null)
    setCustomPositions(null)
    setCustomPreset(null)
    setSelectedNode(null)
  }

  const isRunning = trigger !== 0
  const effectiveEditMode = editMode && !isRunning

  const handleSvgClick = useCallback(
    (e) => {
      if (!effectiveEditMode) return
      // Click on SVG background (not a node) → add node if under limit
      if (e.target.tagName === 'svg' || e.target.tagName === 'line') {
        setSelectedNode(null)
        return
      }
    },
    [effectiveEditMode]
  )

  const handleNodeClick = useCallback(
    (i, e) => {
      e.stopPropagation()
      if (!effectiveEditMode) return
      if (selectedNode === null) {
        setSelectedNode(i)
      } else if (selectedNode === i) {
        setSelectedNode(null) // deselect
      } else {
        // Toggle edge between selectedNode and i
        setCustomMatrix((prev) =>
          matrixToggleEdge(
            prev ?? baseGraph.map((r) => [...r]),
            selectedNode,
            i
          )
        )
        setSelectedNode(null)
      }
    },
    [effectiveEditMode, selectedNode, baseGraph]
  )

  // Derived render values
  const colors = frame?.colors ?? Array(n).fill(0)
  const activeNode = frame?.activeNode ?? -1
  const frameType = frame?.type
  const status = frame?.message ?? 'Click Visualize to start graph coloring.'

  const conflictEdges = useMemo(() => {
    if (frameType !== 'conflict') return new Set()
    return getConflictEdges(graph, colors, activeNode)
  }, [graph, colors, activeNode, frameType])

  const nodeStyle = (i) => {
    if (effectiveEditMode && selectedNode === i)
      return {
        fill: '#7c3aed',
        stroke: '#c4b5fd',
        glow: 'rgba(124,58,237,0.5)',
        dim: false,
      }
    if (effectiveEditMode && selectedNode !== null && selectedNode !== i)
      return { fill: '#1e3a4a', stroke: '#22d3ee', glow: null, dim: false } // potential edge target hint
    if (done && !solved)
      return { fill: '#1e293b', stroke: '#334155', glow: null, dim: true }
    if (activeNode === i && frameType === 'conflict')
      return {
        fill: '#ef4444',
        stroke: '#fca5a5',
        glow: 'rgba(239,68,68,0.6)',
        dim: false,
      }
    if (activeNode === i && frameType === 'backtrack')
      return {
        fill: '#f97316',
        stroke: '#fdba74',
        glow: 'rgba(249,115,22,0.5)',
        dim: false,
      }
    if (activeNode === i && frameType === 'try')
      return {
        fill: '#0e7490',
        stroke: '#22d3ee',
        glow: 'rgba(6,182,212,0.4)',
        dim: false,
      }
    if (frameType === 'solution' && colors[i])
      return {
        fill: COLOR_PALETTE[colors[i]],
        stroke: '#fff',
        glow: 'rgba(52,211,153,0.5)',
        dim: false,
      }
    if (colors[i])
      return {
        fill: COLOR_PALETTE[colors[i]],
        stroke: '#fff',
        glow: null,
        dim: false,
      }
    return { fill: '#1e293b', stroke: '#475569', glow: null, dim: false }
  }

  const edgeStyle = (i, j) => {
    const key = `${Math.min(i, j)}-${Math.max(i, j)}`
    if (conflictEdges.has(key))
      return { stroke: '#ef4444', strokeWidth: 3, opacity: 1 }
    if (done && !solved)
      return { stroke: '#1e293b', strokeWidth: 1.5, opacity: 0.4 }
    if (effectiveEditMode)
      return { stroke: '#475569', strokeWidth: 2, opacity: 0.9 }
    return { stroke: '#334155', strokeWidth: 2, opacity: 1 }
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-8 shadow-lg min-h-[350px] flex flex-col items-center justify-center gap-8">
        {/* Unsolvable warning */}
        {kTooLow && !isRunning && (
          <div className="w-full max-w-sm rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-yellow-400">
              ⚠ This graph needs at least {chromaticNumber} colors (χ ={' '}
              {chromaticNumber}). k={K} will find no solution.
            </p>
          </div>
        )}

        {/* ── Edit toolbar ── only shown when not running */}
        {!isRunning && (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {!effectiveEditMode ? (
              <button
                onClick={enterEditMode}
                className="px-4 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold hover:bg-slate-600 transition"
              >
                ✏ Edit Graph
              </button>
            ) : (
              <>
                <span className="text-xs text-violet-300 font-semibold mr-1">
                  Edit mode
                </span>
                <button
                  onClick={handleAddNode}
                  disabled={n >= MAX_NODES}
                  className="px-3 py-2 rounded-xl bg-emerald-700/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold hover:bg-emerald-700 disabled:opacity-30 transition"
                  title={
                    n >= MAX_NODES ? `Max ${MAX_NODES} nodes` : 'Add a node'
                  }
                >
                  + Node
                </button>
                <button
                  onClick={handleRemoveSelected}
                  disabled={selectedNode === null}
                  className="px-3 py-2 rounded-xl bg-red-700/60 border border-red-500/50 text-red-200 text-xs font-bold hover:bg-red-700 disabled:opacity-30 transition"
                  title="Remove selected node"
                >
                  − Remove
                </button>
                <button
                  onClick={handleResetGraph}
                  className="px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold hover:bg-slate-600 transition"
                >
                  ↺ Reset
                </button>
                <button
                  onClick={exitEditMode}
                  className="px-3 py-2 rounded-xl bg-violet-700/60 border border-violet-500/50 text-violet-200 text-xs font-bold hover:bg-violet-700 transition"
                >
                  ✓ Done
                </button>
              </>
            )}
            {effectiveEditMode && (
              <p className="w-full text-center text-xs text-slate-400 mt-1">
                {selectedNode === null
                  ? 'Click a node to select it'
                  : `Node ${selectedNode + 1} selected — click another node to toggle edge, or − Remove to delete`}
              </p>
            )}
          </div>
        )}

        {/* Playback controls */}
        {isRunning && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleStepBack}
              disabled={stepIndex === 0}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 disabled:opacity-30 transition"
            >
              ← Back
            </button>
            <button
              onClick={handlePause}
              disabled={done}
              className="px-5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 disabled:opacity-30 transition"
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={handleStepForward}
              disabled={stepIndex === frames.length - 1}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 disabled:opacity-30 transition"
            >
              Forward →
            </button>
          </div>
        )}

        {/* SVG + step log */}
        <div className="w-full flex flex-col md:flex-row gap-6 items-start justify-center">
          {/* Graph SVG */}
          <div className="shrink-0 w-full md:w-[400px]">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              style={{
                ...(done && !solved
                  ? { filter: 'grayscale(0.4)', opacity: 0.7 }
                  : {}),
                cursor: effectiveEditMode ? 'default' : 'default',
              }}
              onClick={handleSvgClick}
            >
              {/* Edges */}
              {graph.map((row, i) =>
                row.map((connected, j) => {
                  if (!connected || j <= i) return null
                  const es = edgeStyle(i, j)
                  return (
                    <line
                      key={`edge-${i}-${j}`}
                      x1={positions[i].x}
                      y1={positions[i].y}
                      x2={positions[j].x}
                      y2={positions[j].y}
                      stroke={es.stroke}
                      strokeWidth={es.strokeWidth}
                      opacity={es.opacity}
                      style={{ transition: 'stroke 0.15s, opacity 0.15s' }}
                    />
                  )
                })
              )}

              {/* Nodes */}
              {positions.map((pos, i) => {
                const style = nodeStyle(i)
                return (
                  <g
                    key={`node-${i}`}
                    style={{
                      cursor: effectiveEditMode ? 'pointer' : 'default',
                      ...(done && !solved ? { animation: 'none' } : {}),
                    }}
                    onClick={(e) => handleNodeClick(i, e)}
                  >
                    {style.glow && (
                      <circle cx={pos.x} cy={pos.y} r={26} fill={style.glow} />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={20}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={2.5}
                      opacity={style.dim ? 0.4 : 1}
                      style={{
                        transition: 'fill 0.2s, stroke 0.2s, opacity 0.3s',
                      }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 5}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight="bold"
                      fill={style.dim ? '#475569' : '#fff'}
                      style={{
                        transition: 'fill 0.3s',
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      {i + 1}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Step log */}
          {isRunning && (
            <div
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden"
              style={{ minHeight: '320px' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-4 py-2 border-b border-slate-700/60">
                Step log
              </p>
              <ul
                ref={logListRef}
                className="h-72 overflow-y-auto px-4 py-2 space-y-0.5 font-mono text-xs"
              >
                {logEntries.map((entry, i) => {
                  const isLatest = i === logEntries.length - 1
                  const color =
                    entry.type === 'place'
                      ? 'text-emerald-300'
                      : entry.type === 'conflict'
                        ? 'text-red-400'
                        : entry.type === 'backtrack'
                          ? 'text-amber-400'
                          : entry.type === 'solution'
                            ? 'text-emerald-200'
                            : 'text-sky-400'
                  return (
                    <li
                      key={i}
                      className={`${color} ${isLatest ? 'opacity-100' : 'opacity-60'} leading-5`}
                    >
                      <span className="text-slate-500 select-none mr-2">
                        {String(entry.index).padStart(3, '0')}
                      </span>
                      {entry.message}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Color legend */}
        <div className="flex gap-3 flex-wrap justify-center">
          {Array.from({ length: K }, (_, i) => i + 1).map((c) => (
            <div key={c} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ background: COLOR_PALETTE[c] }}
              />
              <span className="text-xs text-slate-400">Color {c}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500" />
            <span className="text-xs text-slate-400">Uncolored</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Nodes</p>
            <h2 className="text-2xl font-bold text-cyan-400 mt-1">{n}</h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Colors (k)</p>
            <h2 className="text-2xl font-bold text-purple-400 mt-1">{K}</h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Backtracks</p>
            <h2 className="text-2xl font-bold text-orange-400 mt-1">
              {backtracks}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700 text-center">
            <p className="text-slate-400 text-xs">Steps</p>
            <h2 className="text-2xl font-bold text-slate-300 mt-1">{steps}</h2>
          </div>
        </div>

        {/* Chromatic number hint — only for unmodified presets */}
        {chromaticNumber !== null && (
          <p className="text-xs text-slate-500">
            Chromatic number χ({preset}) ={' '}
            <span className="text-slate-300 font-semibold">
              {chromaticNumber}
            </span>
          </p>
        )}

        {/* Done state */}
        {done && (
          <p
            className={`font-bold text-sm ${solved ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {solved
              ? `✓ Complete — valid ${K}-coloring found in ${steps} steps, ${backtracks} backtracks`
              : `✗ No valid ${K}-coloring exists — needs at least ${chromaticNumber ?? '?'} colors`}
          </p>
        )}
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
