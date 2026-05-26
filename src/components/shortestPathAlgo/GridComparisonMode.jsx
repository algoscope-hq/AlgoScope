import { useState, useCallback, useMemo, useEffect, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ROWS = 8
const COLS = 14
const START_ROW = 3
const START_COL = 2
const END_ROW = 4
const END_COL = 11

const ANIMATION_DELAYS = {
  DIJKSTRA: 25,
  BELLMAN_FORD: 20,
  FLOYD_WARSHALL: 15,
  PATH_MULTIPLIER: 0.5,
}

const STEP_BATCHING = {
  DIJKSTRA_BATCH: 3,
  BELLMAN_FORD_BATCH: 3,
  FLOYD_WARSHALL_BATCH: 2,
  BELLMAN_FORD_STEP_MODULO: 15,
  FLOYD_WARSHALL_UPDATE_MODULO: 20,
}

const DEFAULT_METRICS = {
  visited: 0,
  pathCost: null,
  visualizationTime: 0,
  steps: 0,
  score: 0,
}

const ALGORITHM_KEYS = ['dijkstra', 'bellmanford', 'floydwarshall']

const ALGO_META = {
  dijkstra: {
    label: "Dijkstra's",
    key: 'dijkstra',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glow: 'rgba(6,182,212,0.3)',
    visitedColor: 'rgba(6,182,212,0.25)',
    pathColor: '#06b6d4',
    description: 'Greedy, optimal, non-negative weights',
  },
  bellmanford: {
    label: 'Bellman-Ford',
    key: 'bellmanford',
    accent: '#fb923c',
    accentBg: 'rgba(251,146,60,0.08)',
    accentBorder: 'rgba(251,146,60,0.3)',
    glow: 'rgba(251,146,60,0.3)',
    visitedColor: 'rgba(251,146,60,0.25)',
    pathColor: '#fb923c',
    description: 'Handles negative weights, slower but robust',
  },
  floydwarshall: {
    label: 'Floyd-Warshall',
    key: 'floydwarshall',
    accent: '#c084fc',
    accentBg: 'rgba(192,132,252,0.08)',
    accentBorder: 'rgba(192,132,252,0.3)',
    glow: 'rgba(192,132,252,0.3)',
    visitedColor: 'rgba(192,132,252,0.15)',
    pathColor: '#c084fc',
    description: 'All-pairs shortest path',
  },
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const createNode = (row, col) => ({
  row,
  col,
  isStart: row === START_ROW && col === START_COL,
  isEnd: row === END_ROW && col === END_COL,
  isWall: false,
  visited: false,
  path: false,
  weight: 1,
  isWeighted: false,
})

const createGrid = () => {
  const grid = []
  for (let row = 0; row < ROWS; row++) {
    const currentRow = []
    for (let col = 0; col < COLS; col++) {
      currentRow.push(createNode(row, col))
    }
    grid.push(currentRow)
  }

  const walls = [
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [5, 6],
    [5, 7],
    [5, 8],
    [5, 9],
    [1, 8],
    [2, 8],
    [3, 8],
    [4, 8],
  ]

  walls.forEach(([r, c]) => {
    if (!grid[r][c].isStart && !grid[r][c].isEnd) {
      grid[r][c].isWall = true
    }
  })

  return grid
}

const getNeighbors = (node, currentGrid) => {
  const neighbors = []
  const { row, col } = node
  if (row > 0 && !currentGrid[row - 1][col].isWall)
    neighbors.push(currentGrid[row - 1][col])
  if (row < ROWS - 1 && !currentGrid[row + 1][col].isWall)
    neighbors.push(currentGrid[row + 1][col])
  if (col > 0 && !currentGrid[row][col - 1].isWall)
    neighbors.push(currentGrid[row][col - 1])
  if (col < COLS - 1 && !currentGrid[row][col + 1].isWall)
    neighbors.push(currentGrid[row][col + 1])
  return neighbors
}

const generateDijkstraSteps = (grid) => {
  const steps = []
  const distances = new Map()
  const visited = new Set()
  const parent = new Map()
  const queue = []

  const startNode = grid[START_ROW][START_COL]
  const endNode = grid[END_ROW][END_COL]

  for (let row of grid) {
    for (let cell of row) {
      distances.set(cell, Infinity)
    }
  }
  distances.set(startNode, 0)
  queue.push(startNode)

  while (queue.length > 0) {
    queue.sort((a, b) => distances.get(a) - distances.get(b))
    const current = queue.shift()

    if (visited.has(current)) continue
    visited.add(current)

    steps.push({
      type: 'visit',
      node: current,
      visitedCount: visited.size,
      queueSize: queue.length,
      currentDistance: distances.get(current),
    })

    if (current === endNode) break

    const neighbors = getNeighbors(current, grid)
    for (let neighbor of neighbors) {
      if (visited.has(neighbor)) continue
      const newDist = distances.get(current) + neighbor.weight
      if (newDist < distances.get(neighbor)) {
        distances.set(neighbor, newDist)
        parent.set(neighbor, current)
        if (!queue.includes(neighbor)) queue.push(neighbor)
        steps.push({
          type: 'relax',
          node: neighbor,
          newDistance: newDist,
        })
      }
    }
  }

  const path = []
  let current = endNode
  while (current) {
    path.unshift(current)
    if (current === startNode) break
    current = parent.get(current)
  }
  const finalPath = path[0] === startNode ? path : []
  const totalRelaxations = steps.filter((s) => s.type === 'relax').length

  return {
    steps,
    path: finalPath,
    distances,
    totalRelaxations,
    visitedCount: visited.size,
  }
}

const generateBellmanFordSteps = (grid) => {
  const steps = []
  const distances = new Map()
  const parent = new Map()

  const startNode = grid[START_ROW][START_COL]
  const endNode = grid[END_ROW][END_COL]
  const allNodes = grid.flat()

  for (let node of allNodes) {
    distances.set(node, Infinity)
  }
  distances.set(startNode, 0)

  let totalRelaxations = 0
  let relaxationAttemptCount = 0
  const visitedNodesSet = new Set()

  for (let i = 0; i < allNodes.length - 1; i++) {
    let relaxed = false
    for (let u of allNodes) {
      if (u.isWall || distances.get(u) === Infinity) continue
      const neighbors = getNeighbors(u, grid)
      for (let v of neighbors) {
        const newDist = distances.get(u) + v.weight
        if (newDist < distances.get(v)) {
          distances.set(v, newDist)
          parent.set(v, u)
          relaxed = true
          totalRelaxations++
          visitedNodesSet.add(v)
          relaxationAttemptCount++
          const shouldRecordStep =
            relaxationAttemptCount % STEP_BATCHING.BELLMAN_FORD_STEP_MODULO ===
              0 || relaxationAttemptCount < 10
          if (shouldRecordStep) {
            steps.push({
              type: 'relax',
              node: v,
              iteration: i + 1,
              newDistance: newDist,
              relaxations: totalRelaxations,
            })
          }
        }
      }
    }
    if (!relaxed) break
  }

  const path = []
  let current = endNode
  while (current) {
    path.unshift(current)
    if (current === startNode) break
    current = parent.get(current)
  }
  const finalPath = path[0] === startNode ? path : []

  return {
    steps,
    path: finalPath,
    distances,
    totalRelaxations,
    visitedCount: visitedNodesSet.size,
  }
}

const generateFloydWarshallSteps = (grid) => {
  const allNodes = grid.flat().filter((n) => !n.isWall)
  const nodeIndex = new Map()
  allNodes.forEach((node, idx) => nodeIndex.set(node, idx))

  const n = allNodes.length
  const dist = Array(n)
    .fill(null)
    .map(() => Array(n).fill(Infinity))
  const next = Array(n)
    .fill(null)
    .map(() => Array(n).fill(null))

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0
  }

  for (let u of allNodes) {
    const neighbors = getNeighbors(u, grid)
    for (let v of neighbors) {
      const ui = nodeIndex.get(u)
      const vi = nodeIndex.get(v)
      dist[ui][vi] = v.weight
      next[ui][vi] = v
    }
  }

  let matrixUpdates = 0
  const steps = []
  const visitedNodesSet = new Set()

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const isImprovement = dist[i][k] + dist[k][j] < dist[i][j]
        if (isImprovement) {
          dist[i][j] = dist[i][k] + dist[k][j]
          next[i][j] = next[i][k]
          matrixUpdates++

          const node1 = allNodes[i]
          const node2 = allNodes[j]
          if (node1 && !node1.isWall) visitedNodesSet.add(node1)
          if (node2 && !node2.isWall) visitedNodesSet.add(node2)
          const shouldRecordStep =
            matrixUpdates % STEP_BATCHING.FLOYD_WARSHALL_UPDATE_MODULO === 0 ||
            matrixUpdates < 10
          if (shouldRecordStep) {
            steps.push({ type: 'update', node1, node2, k, matrixUpdates })
          }
        }
      }
    }
  }

  const startNode = grid[START_ROW][START_COL]
  const endNode = grid[END_ROW][END_COL]
  const startIdx = nodeIndex.get(startNode)
  const endIdx = nodeIndex.get(endNode)

  const path = []
  const hasFiniteDistance =
    startIdx !== undefined &&
    endIdx !== undefined &&
    dist[startIdx][endIdx] !== Infinity

  if (hasFiniteDistance) {
    let current = startNode
    path.push(startNode)
    let guard = 0
    const maxIterations = allNodes.length * 2

    while (current !== endNode && guard < maxIterations) {
      const currentIdx = nodeIndex.get(current)
      if (currentIdx === undefined) break
      const nextNode = next[currentIdx][endIdx]
      if (!nextNode || nextNode === current) break
      path.push(nextNode)
      current = nextNode
      guard++
    }
  }

  return {
    steps,
    path,
    matrixUpdates,
    visitedCount: visitedNodesSet.size,
    distances: dist,
  }
}

const createInitialAlgoStates = () => ({
  dijkstra: {
    status: 'idle',
    metrics: { ...DEFAULT_METRICS },
    progress: 0,
    liveMetrics: {},
  },
  bellmanford: {
    status: 'idle',
    metrics: { ...DEFAULT_METRICS },
    progress: 0,
    liveMetrics: {},
  },
  floydwarshall: {
    status: 'idle',
    metrics: { ...DEFAULT_METRICS },
    progress: 0,
    liveMetrics: {},
  },
})

const updateVisualizationState = (prevStates, algoKey, node) => {
  const key = `${node.row}-${node.col}`
  const existing = prevStates.find((s) => s.algoKey === algoKey) || { algoKey }

  const newState = {
    ...existing,
    [key]: true,
  }

  const filtered = prevStates.filter((s) => s.algoKey !== algoKey)

  return [...filtered, newState]
}

const getPathCost = (result, grid) => {
  if (Array.isArray(result.distances)) {
    const startNode = grid[START_ROW][START_COL]
    const endNode = grid[END_ROW][END_COL]
    const allNodes = grid.flat().filter((n) => !n.isWall)
    const nodeIndex = new Map()
    allNodes.forEach((node, idx) => nodeIndex.set(node, idx))
    const startIdx = nodeIndex.get(startNode)
    const endIdx = nodeIndex.get(endNode)
    if (startIdx === undefined || endIdx === undefined) return null
    const cost = result.distances[startIdx][endIdx]
    return cost !== Infinity ? cost : null
  }

  if (result.distances?.get) {
    const cost = result.distances.get(grid[END_ROW][END_COL])
    return cost !== Infinity && cost !== undefined ? cost : null
  }

  return null
}

const buildMetrics = (result, startTime, endTime, grid) => {
  const pathCost = getPathCost(result, grid)
  const relaxations =
    result.totalRelaxations ||
    result.steps?.filter((s) => s.type === 'relax').length ||
    0
  const matrixUpdates = result.matrixUpdates || 0
  const visitedCount = result.visitedCount || 0

  return {
    visitedCount,
    pathCost,
    visualizationTime: Math.round(endTime - startTime),
    pathFound: result.path?.length > 0,
    relaxations,
    matrixUpdates,
  }
}

const shouldUpdateProgress = (index, totalSteps, batchSize) => {
  return index % batchSize === 0 || index === totalSteps - 1
}

const SharedGridPreview = memo(({ grid, visitedStates, pathStates }) => {
  const cellSize = 28
  const width = COLS * cellSize
  const height = ROWS * cellSize

  const getCellColor = (cell) => {
    if (cell.isStart) return '#10b981'
    if (cell.isEnd) return '#ef4444'
    if (cell.isWall) return 'rgba(51,65,85,0.9)'

    const hasPath = pathStates.some((state) => state[`${cell.row}-${cell.col}`])
    if (hasPath) {
      const activeAlgo = pathStates.find(
        (state) => state[`${cell.row}-${cell.col}`]
      )
      if (activeAlgo)
        return ALGO_META[activeAlgo.algoKey]?.pathColor || '#fbbf24'
    }

    const visitedAlgos = visitedStates.filter(
      (state) => state[`${cell.row}-${cell.col}`]
    )
    const visitedCount = visitedAlgos.length

    if (visitedCount > 0) {
      if (visitedCount === 1) {
        return (
          ALGO_META[visitedAlgos[0].algoKey]?.visitedColor ||
          'rgba(6,182,212,0.2)'
        )
      }
      return 'rgba(100,100,100,0.12)'
    }

    if (cell.isWeighted) return 'rgba(249,115,22,0.5)'
    return 'rgba(30,41,59,0.6)'
  }

  return (
    <svg width={width} height={height} style={{ imageRendering: 'pixelated' }}>
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill={getCellColor(cell)}
            stroke="rgba(71,85,105,0.3)"
            strokeWidth={0.5}
          />
        ))
      )}
    </svg>
  )
})

SharedGridPreview.displayName = 'SharedGridPreview'

const ComparisonCard = memo(
  ({ algoKey, status, metrics, isWinner, progress, liveMetrics }) => {
    const meta = ALGO_META[algoKey]

    const getStatusText = () => {
      if (status === 'idle') return 'Ready'
      if (status === 'running') return 'Running...'
      if (status === 'complete') return 'Complete'
      return 'Ready'
    }

    const statusColor = (() => {
      if (status === 'complete') return meta.accent
      if (status === 'running') return '#94a3b8'
      return '#334155'
    })()

    const displayVisited = liveMetrics?.visitedCount || metrics.visited || '—'

    const displayPathCost = (() => {
      if (
        liveMetrics?.currentDistance !== undefined &&
        liveMetrics.currentDistance !== Infinity
      ) {
        return liveMetrics.currentDistance.toFixed(1)
      }
      if (metrics.pathCost !== null) return metrics.pathCost.toFixed(1)
      return '—'
    })()

    const hasLiveMetric =
      liveMetrics?.queueSize !== undefined ||
      liveMetrics?.iteration !== undefined

    const displayQueueIter = (() => {
      if (algoKey === 'dijkstra' && liveMetrics?.queueSize !== undefined)
        return liveMetrics.queueSize
      if (algoKey === 'bellmanford' && liveMetrics?.iteration !== undefined)
        return `Iter ${liveMetrics.iteration}`
      if (algoKey === 'floydwarshall' && liveMetrics?.k !== undefined)
        return `k=${liveMetrics.k}`
      return '—'
    })()

    const hasRelaxMetric =
      liveMetrics?.relaxations !== undefined ||
      liveMetrics?.matrixUpdates !== undefined ||
      (status === 'complete' && metrics.steps > 0)

    const displayRelaxUpdate = (() => {
      if (algoKey === 'dijkstra') {
        return (
          liveMetrics?.relaxations ??
          (status === 'complete' ? metrics.steps : '—')
        )
      }

      if (algoKey === 'bellmanford') {
        return (
          liveMetrics?.relaxations ??
          (status === 'complete' ? metrics.steps : '—')
        )
      }

      if (algoKey === 'floydwarshall') {
        return (
          liveMetrics?.matrixUpdates ??
          (status === 'complete' ? metrics.steps : '—')
        )
      }

      return '—'
    })()

    return (
      <motion.div
        className="rounded-2xl flex flex-col overflow-hidden border transition-all duration-500"
        style={{
          background:
            isWinner && status === 'complete'
              ? `linear-gradient(145deg, rgba(15,23,42,0.98), ${meta.accentBg})`
              : 'rgba(15,23,42,0.85)',
          borderColor:
            isWinner && status === 'complete'
              ? meta.accent
              : 'rgba(51,65,85,0.7)',
          boxShadow:
            isWinner && status === 'complete'
              ? `0 0 20px ${meta.glow}`
              : 'none',
        }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: meta.accent }}
              animate={
                status === 'running' ? { opacity: [1, 0.3, 1] } : { opacity: 1 }
              }
              transition={{ duration: 0.9, repeat: Infinity }}
            />
            <span className="text-xs font-bold text-white tracking-wider">
              {meta.label}
            </span>
          </div>
          <span
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950"
            style={{ color: statusColor }}
          >
            {getStatusText()}
          </span>
        </div>

        {status === 'running' && progress > 0 && (
          <div className="h-0.5 bg-slate-800">
            <motion.div
              className="h-full"
              style={{ background: meta.accent }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-[8px] uppercase tracking-wider text-slate-500">
                Visited
              </p>
              <p
                className="text-sm font-mono font-bold"
                style={{
                  color:
                    (liveMetrics?.visitedCount || metrics.visited) > 0
                      ? meta.accent
                      : '#475569',
                }}
              >
                {displayVisited}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] uppercase tracking-wider text-slate-500">
                Path Cost
              </p>
              <p
                className="text-sm font-mono font-bold"
                style={{
                  color: metrics.pathCost !== null ? meta.accent : '#475569',
                }}
              >
                {displayPathCost}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] uppercase tracking-wider text-slate-500">
                Queue/Iter
              </p>
              <p
                className="text-sm font-mono font-bold"
                style={{ color: hasLiveMetric ? meta.accent : '#475569' }}
              >
                {displayQueueIter}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] uppercase tracking-wider text-slate-500">
                Relax/Update
              </p>
              <p
                className="text-sm font-mono font-bold"
                style={{ color: hasRelaxMetric ? meta.accent : '#475569' }}
              >
                {displayRelaxUpdate}
              </p>
            </div>
          </div>
          {isWinner && status === 'complete' && (
            <div className="mt-2 text-center">
              <span className="text-[10px] font-bold text-cyan-400">
                🏆 Winner
              </span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }
)

ComparisonCard.displayName = 'ComparisonCard'

export default function GridComparisonMode() {
  const [speed, setSpeed] = useState(2)
  const [isRunning, setIsRunning] = useState(false)
  const [grid] = useState(() => createGrid())
  const [winner, setWinner] = useState(null)
  const [visitedStates, setVisitedStates] = useState([])
  const [pathStates, setPathStates] = useState([])
  const [algoStatus, setAlgoStatus] = useState(createInitialAlgoStates())
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const animateDijkstra = useCallback(async (steps, path, speedMultiplier) => {
    const delay = ANIMATION_DELAYS.DIJKSTRA / speedMultiplier
    const visitedNodes = new Set()

    for (let i = 0; i < steps.length; i++) {
      if (!mountedRef.current) return
      const step = steps[i]

      if (step.type === 'visit') {
        visitedNodes.add(step.node)

        if (
          shouldUpdateProgress(i, steps.length, STEP_BATCHING.DIJKSTRA_BATCH)
        ) {
          setAlgoStatus((prev) => ({
            ...prev,
            dijkstra: {
              ...prev.dijkstra,
              progress: (visitedNodes.size / (ROWS * COLS)) * 100,
              liveMetrics: {
                visitedCount: visitedNodes.size,
                queueSize: step.queueSize,
                currentDistance: step.currentDistance,
              },
            },
          }))
        }

        setVisitedStates((prev) =>
          updateVisualizationState(prev, 'dijkstra', step.node)
        )
      }
      await sleep(delay)
    }

    const pathDelay = delay * ANIMATION_DELAYS.PATH_MULTIPLIER
    for (let i = 0; i < path.length; i++) {
      if (!mountedRef.current) return
      await sleep(pathDelay)
      setPathStates((prev) =>
        updateVisualizationState(prev, 'dijkstra', path[i])
      )
    }
  }, [])

  const animateBellmanFord = useCallback(
    async (steps, path, speedMultiplier) => {
      const delay = ANIMATION_DELAYS.BELLMAN_FORD / speedMultiplier
      const visitedNodes = new Set()

      for (let i = 0; i < steps.length; i++) {
        if (!mountedRef.current) return
        const step = steps[i]

        if (step.type === 'relax') {
          visitedNodes.add(step.node)

          if (
            shouldUpdateProgress(
              i,
              steps.length,
              STEP_BATCHING.BELLMAN_FORD_BATCH
            )
          ) {
            setAlgoStatus((prev) => ({
              ...prev,
              bellmanford: {
                ...prev.bellmanford,
                progress: (visitedNodes.size / (ROWS * COLS)) * 100,
                liveMetrics: {
                  visitedCount: visitedNodes.size,
                  iteration: step.iteration,
                  relaxations: step.relaxations,
                },
              },
            }))
          }

          setVisitedStates((prev) =>
            updateVisualizationState(prev, 'bellmanford', step.node)
          )
        }
        await sleep(delay)
      }

      const pathDelay = delay * ANIMATION_DELAYS.PATH_MULTIPLIER
      for (let i = 0; i < path.length; i++) {
        if (!mountedRef.current) return
        await sleep(pathDelay)
        setPathStates((prev) =>
          updateVisualizationState(prev, 'bellmanford', path[i])
        )
      }
    },
    []
  )

  const animateFloydWarshall = useCallback(
    async (steps, path, speedMultiplier) => {
      const delay = ANIMATION_DELAYS.FLOYD_WARSHALL / speedMultiplier
      const visitedNodes = new Set()

      for (let i = 0; i < steps.length; i++) {
        if (!mountedRef.current) return
        const step = steps[i]

        if (step.type === 'update' && step.node1 && step.node2) {
          visitedNodes.add(step.node1)
          visitedNodes.add(step.node2)

          if (
            shouldUpdateProgress(
              i,
              steps.length,
              STEP_BATCHING.FLOYD_WARSHALL_BATCH
            )
          ) {
            setAlgoStatus((prev) => ({
              ...prev,
              floydwarshall: {
                ...prev.floydwarshall,
                progress: (visitedNodes.size / (ROWS * COLS)) * 100,
                liveMetrics: {
                  visitedCount: visitedNodes.size,
                  k: step.k,
                  matrixUpdates: step.matrixUpdates,
                },
              },
            }))
          }

          if (step.node1) {
            setVisitedStates((prev) =>
              updateVisualizationState(prev, 'floydwarshall', step.node1)
            )
          }
          if (step.node2) {
            setVisitedStates((prev) =>
              updateVisualizationState(prev, 'floydwarshall', step.node2)
            )
          }
        }
        await sleep(delay)
      }

      const pathDelay = delay * ANIMATION_DELAYS.PATH_MULTIPLIER
      for (let i = 0; i < path.length; i++) {
        if (!mountedRef.current) return
        await sleep(pathDelay)
        setPathStates((prev) =>
          updateVisualizationState(prev, 'floydwarshall', path[i])
        )
      }
    },
    []
  )

  const calculateScore = useCallback(
    (visitedCount, relaxations, matrixUpdates, pathCost) => {
      const normalizedMatrixUpdates = matrixUpdates / (ROWS * COLS)
      return (
        visitedCount * 1 +
        relaxations * 2 +
        normalizedMatrixUpdates * 3 +
        (pathCost || 0) * 0.5
      )
    },
    []
  )

  const executeAlgorithm = useCallback(
    async (algoKey, speedMultiplier) => {
      const startTime = performance.now()
      let result

      if (algoKey === 'dijkstra') {
        result = generateDijkstraSteps(grid)
        await animateDijkstra(result.steps, result.path, speedMultiplier)
      } else if (algoKey === 'bellmanford') {
        result = generateBellmanFordSteps(grid)
        await animateBellmanFord(result.steps, result.path, speedMultiplier)
      } else {
        result = generateFloydWarshallSteps(grid)
        await animateFloydWarshall(result.steps, result.path, speedMultiplier)
      }

      const endTime = performance.now()
      const metrics = buildMetrics(result, startTime, endTime, grid)
      const score = calculateScore(
        metrics.visitedCount,
        metrics.relaxations,
        metrics.matrixUpdates,
        metrics.pathCost
      )

      return {
        visitedCount: metrics.visitedCount,
        pathCost: metrics.pathCost,
        visualizationTime: metrics.visualizationTime,
        pathFound: metrics.pathFound,
        relaxations: metrics.relaxations,
        matrixUpdates: metrics.matrixUpdates,
        score,
      }
    },
    [
      grid,
      animateDijkstra,
      animateBellmanFord,
      animateFloydWarshall,
      calculateScore,
    ]
  )

  const handleStart = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    setWinner(null)
    setVisitedStates([])
    setPathStates([])
    setAlgoStatus({
      dijkstra: {
        ...createInitialAlgoStates().dijkstra,
        status: 'running',
      },
      bellmanford: {
        ...createInitialAlgoStates().bellmanford,
        status: 'running',
      },
      floydwarshall: {
        ...createInitialAlgoStates().floydwarshall,
        status: 'running',
      },
    })

    const speedMultiplier = speed === 1 ? 1 : speed === 2 ? 2 : 4

    let results

    try {
      results = await Promise.all([
        executeAlgorithm('dijkstra', speedMultiplier).then((metrics) => {
          if (!mountedRef.current) return { key: 'dijkstra', metrics }
          setAlgoStatus((prev) => ({
            ...prev,
            dijkstra: {
              ...prev.dijkstra,
              status: 'complete',
              metrics: {
                visited: metrics.visitedCount,
                pathCost: metrics.pathCost,
                visualizationTime: metrics.visualizationTime,
                steps: metrics.relaxations,
                score: metrics.score,
              },
              progress: 100,
              liveMetrics: {},
            },
          }))
          return { key: 'dijkstra', metrics }
        }),
        executeAlgorithm('bellmanford', speedMultiplier).then((metrics) => {
          if (!mountedRef.current) return { key: 'bellmanford', metrics }
          setAlgoStatus((prev) => ({
            ...prev,
            bellmanford: {
              ...prev.bellmanford,
              status: 'complete',
              metrics: {
                visited: metrics.visitedCount,
                pathCost: metrics.pathCost,
                visualizationTime: metrics.visualizationTime,
                steps: metrics.relaxations,
                score: metrics.score,
              },
              progress: 100,
              liveMetrics: {},
            },
          }))
          return { key: 'bellmanford', metrics }
        }),
        executeAlgorithm('floydwarshall', speedMultiplier).then((metrics) => {
          if (!mountedRef.current) return { key: 'floydwarshall', metrics }
          setAlgoStatus((prev) => ({
            ...prev,
            floydwarshall: {
              ...prev.floydwarshall,
              status: 'complete',
              metrics: {
                visited: metrics.visitedCount,
                pathCost: metrics.pathCost,
                visualizationTime: metrics.visualizationTime,
                steps: metrics.matrixUpdates,
                score: metrics.score,
              },
              progress: 100,
              liveMetrics: {},
            },
          }))
          return { key: 'floydwarshall', metrics }
        }),
      ])
    } finally {
      if (mountedRef.current) setIsRunning(false)
    }

    if (!mountedRef.current) return

    let bestScore = Infinity
    let winnerAlgo = null

    results.forEach(({ key, metrics }) => {
      if (metrics.pathFound && metrics.score < bestScore) {
        bestScore = metrics.score
        winnerAlgo = key
      }
    })

    if (winnerAlgo) setWinner(winnerAlgo)
  }, [isRunning, speed, executeAlgorithm])

  const handleReset = useCallback(() => {
    if (isRunning) return
    setWinner(null)
    setIsRunning(false)
    setVisitedStates([])
    setPathStates([])
    setAlgoStatus(createInitialAlgoStates())
  }, [isRunning])

  const speedButtons = useMemo(
    () => [
      { label: '1×', val: 1 },
      { label: '2×', val: 2 },
      { label: '4×', val: 4 },
    ],
    []
  )

  return (
    <div className="rounded-2xl border border-slate-700/60 p-4 bg-slate-900/80">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-slate-400 font-medium">Speed</span>
        {speedButtons.map(({ label, val }) => (
          <button
            key={val}
            onClick={() => setSpeed(val)}
            disabled={isRunning}
            className="px-3 h-7 rounded-lg text-[11px] font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                speed === val ? 'rgba(6,182,212,0.15)' : 'rgba(30,41,59,0.5)',
              borderColor: speed === val ? '#06b6d4' : 'rgba(51,65,85,0.8)',
              color: speed === val ? '#06b6d4' : '#64748b',
            }}
          >
            {label}
          </button>
        ))}

        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="h-8 px-5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(6,182,212,0.85)',
              color: '#000',
              boxShadow: '0 0 12px rgba(6,182,212,0.4)',
            }}
          >
            ▶ Run All Three
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="h-8 px-5 rounded-lg text-xs font-bold transition-all bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <SharedGridPreview
          grid={grid}
          visitedStates={visitedStates}
          pathStates={pathStates}
        />
      </div>

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="rounded-xl border px-4 py-3 flex items-center gap-3 mt-4"
            style={{
              background: 'rgba(15,23,42,0.85)',
              borderColor: ALGO_META[winner].accentBorder,
            }}
          >
            <span className="text-lg">🏆</span>
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: ALGO_META[winner].accent }}
              >
                {ALGO_META[winner].label} wins the comparison
              </p>
              <p className="text-[10px] text-slate-400">
                Lowest visualization score with successful path reconstruction
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {ALGORITHM_KEYS.map((algoKey) => (
          <ComparisonCard
            key={algoKey}
            algoKey={algoKey}
            status={algoStatus[algoKey].status}
            metrics={algoStatus[algoKey].metrics}
            progress={algoStatus[algoKey].progress}
            liveMetrics={algoStatus[algoKey].liveMetrics}
            isWinner={winner === algoKey}
          />
        ))}
      </div>
    </div>
  )
}
