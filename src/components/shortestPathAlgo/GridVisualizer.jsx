import React, { useCallback, useEffect, useRef, useState } from 'react'

const ROWS = 24
const COLS = 40

const START_ROW = 12
const START_COL = 5

const END_ROW = 12
const END_COL = 34

const MAZE_WALL_PROBABILITY = 0.25

const DRAW_MODES = ['wall', 'weight', 'erase']

const LEGEND_ITEMS = [
  { l: 'Start', c: 'bg-green-500' },
  { l: 'End', c: 'bg-red-500' },
  { l: 'Wall', c: 'bg-black' },
  { l: 'Visited', c: 'bg-cyan-500' },
  { l: 'Path', c: 'bg-yellow-400' },
  { l: 'Weighted', c: 'bg-orange-500' },
]

const getCellClassName = (node) => {
  return `w-7 h-7 border border-(--theme-border) flex items-center justify-center text-[11px] text-(--theme-text-strong) ${
    node.isStart
      ? 'bg-green-500'
      : node.isEnd
        ? 'bg-red-500'
        : node.isWall
          ? 'bg-black'
          : node.isWeighted
            ? node.path
              ? 'bg-orange-500 ring-1 ring-yellow-300'
              : node.visited
                ? 'bg-orange-400'
                : 'bg-orange-500'
            : node.path
              ? 'bg-yellow-400'
              : node.visited
                ? 'bg-cyan-500'
                : 'bg-(--theme-surface)'
  }`
}

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_ROW && col === START_COL,
    isEnd: row === END_ROW && col === END_COL,
    isWall: false,
    visited: false,
    path: false,
    weight: 1,
    isWeighted: false,
  }
}

const createGrid = () => {
  const grid = []
  for (let row = 0; row < ROWS; row++) {
    const currentRow = []
    for (let col = 0; col < COLS; col++) {
      currentRow.push(createNode(row, col))
    }
    grid.push(currentRow)
  }
  return grid
}

const getNeighbors = (node, currentGrid) => {
  const neighbors = []
  const { row, col } = node

  if (row > 0 && currentGrid[row - 1]) neighbors.push(currentGrid[row - 1][col])

  if (row < currentGrid.length - 1 && currentGrid[row + 1])
    neighbors.push(currentGrid[row + 1][col])

  if (col > 0 && currentGrid[row][col - 1])
    neighbors.push(currentGrid[row][col - 1])

  if (col < currentGrid[row].length - 1 && currentGrid[row][col + 1])
    neighbors.push(currentGrid[row][col + 1])

  return neighbors.filter(Boolean).filter((n) => !n.isWall)
}

const runDijkstra = (currentGrid) => {
  const startNode = currentGrid[START_ROW][START_COL]
  const endNode = currentGrid[END_ROW][END_COL]
  const distances = {}
  const visited = new Set()
  const parent = {}
  const order = []

  for (const row of currentGrid) {
    for (const node of row) {
      distances[`${node.row}-${node.col}`] = Infinity
    }
  }

  distances[`${startNode.row}-${startNode.col}`] = 0

  while (visited.size < ROWS * COLS) {
    let current = null
    let smallest = Infinity

    for (const row of currentGrid) {
      for (const node of row) {
        const key = `${node.row}-${node.col}`
        if (!visited.has(key) && distances[key] < smallest) {
          smallest = distances[key]
          current = node
        }
      }
    }

    if (!current || current.isWall) break

    visited.add(`${current.row}-${current.col}`)
    order.push(current)

    if (current.row === endNode.row && current.col === endNode.col) break

    const neighbors = getNeighbors(current, currentGrid)
    for (const next of neighbors) {
      const nextKey = `${next.row}-${next.col}`
      const newDistance =
        distances[`${current.row}-${current.col}`] + next.weight
      if (newDistance < distances[nextKey]) {
        distances[nextKey] = newDistance
        parent[nextKey] = current
      }
    }
  }
  return { order, parent, distances }
}

const runBellmanFord = (currentGrid) => {
  const startNode = currentGrid[START_ROW][START_COL]
  const dists = {}
  const parent = {}
  const order = []
  const orderSet = new Set()

  for (const row of currentGrid) {
    for (const node of row) dists[`${node.row}-${node.col}`] = Infinity
  }
  dists[`${startNode.row}-${startNode.col}`] = 0

  for (let i = 0; i < ROWS * COLS - 1; i++) {
    let changed = false
    for (const row of currentGrid) {
      for (const u of row) {
        if (u.isWall || dists[`${u.row}-${u.col}`] === Infinity) continue
        for (const v of getNeighbors(u, currentGrid)) {
          if (
            dists[`${u.row}-${u.col}`] + v.weight <
            dists[`${v.row}-${v.col}`]
          ) {
            dists[`${v.row}-${v.col}`] = dists[`${u.row}-${u.col}`] + v.weight
            parent[`${v.row}-${v.col}`] = u
            if (!orderSet.has(v)) {
              orderSet.add(v)
              order.push(v)
            }
            changed = true
          }
        }
      }
    }
    if (!changed) break
  }
  return { order, parent, distances: dists }
}

const runFloydWarshallVisualization = (currentGrid) => {
  const nodes = []
  const nodeIndex = {}

  for (const row of currentGrid) {
    for (const node of row) {
      if (!node.isWall) {
        nodeIndex[`${node.row}-${node.col}`] = nodes.length
        nodes.push(node)
      }
    }
  }

  const N = nodes.length
  if (N === 0) return { order: [], parent: {}, distances: {} }

  const INF = Infinity

  const dist = new Float64Array(N * N).fill(INF)
  const pred = new Int16Array(N * N).fill(-1)

  for (let i = 0; i < N; i++) {
    dist[i * N + i] = 0
  }

  for (let i = 0; i < N; i++) {
    const u = nodes[i]
    const neighbors = getNeighbors(u, currentGrid)
    for (const v of neighbors) {
      const j = nodeIndex[`${v.row}-${v.col}`]
      if (j === undefined) continue
      const cost = v.weight
      if (cost < dist[i * N + j]) {
        dist[i * N + j] = cost
        pred[i * N + j] = i
      }
    }
  }

  const startKey = `${START_ROW}-${START_COL}`
  const endKey = `${END_ROW}-${END_COL}`
  const startIdx = nodeIndex[startKey]
  const endIdx = nodeIndex[endKey]

  const visitedOrder = []
  const visitedSet = new Set()

  for (let k = 0; k < N; k++) {
    for (let i = 0; i < N; i++) {
      const dik = dist[i * N + k]
      if (dik === INF) continue
      for (let j = 0; j < N; j++) {
        const dkj = dist[k * N + j]
        if (dkj === INF) continue
        const newDist = dik + dkj
        if (newDist < dist[i * N + j]) {
          dist[i * N + j] = newDist
          pred[i * N + j] = pred[k * N + j]

          if (i === startIdx && j !== startIdx && !visitedSet.has(j)) {
            visitedSet.add(j)
            visitedOrder.push(nodes[j])
          }
        }
      }
    }
  }

  const distances = {}
  if (startIdx !== undefined) {
    for (let j = 0; j < N; j++) {
      const node = nodes[j]
      distances[`${node.row}-${node.col}`] = dist[startIdx * N + j]
    }
  }

  const parent = {}
  if (startIdx !== undefined && endIdx !== undefined) {
    let cur = endIdx
    const seen = new Set()
    while (cur !== -1 && cur !== startIdx && !seen.has(cur)) {
      seen.add(cur)
      const p = pred[startIdx * N + cur]
      if (p === -1 || p === cur) break
      parent[`${nodes[cur].row}-${nodes[cur].col}`] = nodes[p]
      cur = p
    }
  }

  const order = visitedOrder.filter((n) => !n.isStart && !n.isEnd)

  return { order, parent, distances }
}

const buildPath = (parent, currentGrid) => {
  const path = []
  const visited = new Set()
  let current = currentGrid[END_ROW][END_COL]
  while (current && !visited.has(current)) {
    visited.add(current)
    path.unshift(current)
    current = parent[`${current.row}-${current.col}`]
  }
  return path[0]?.isStart ? path : []
}

const GridVisualizer = ({ algorithm, runKey, speed }) => {
  const [grid, setGrid] = useState(() => createGrid())
  const [mousePressed, setMousePressed] = useState(false)
  const [running, setRunning] = useState(false)
  const [drawMode, setDrawMode] = useState('wall')
  const [pathCost, setPathCost] = useState(0)
  const [visitedCount, setVisitedCount] = useState(0)

  const timeouts = useRef([])
  const gridRef = useRef(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    gridRef.current = grid
  }, [grid])

  const clearTimers = useCallback(() => {
    timeouts.current.forEach((timer) => clearTimeout(timer))
    timeouts.current = []
  }, [])

  const clearPath = useCallback(() => {
    clearTimers()
    setGrid((prev) =>
      prev.map((row) =>
        row.map((node) => ({ ...node, visited: false, path: false }))
      )
    )
    setRunning(false)
    setPathCost(0)
    setVisitedCount(0)
  }, [clearTimers])

  const clearGrid = () => {
    clearTimers()
    setRunning(false)
    setGrid(createGrid())
    setPathCost(0)
    setVisitedCount(0)
  }

  const resetAll = () => {
    clearTimers()
    setRunning(false)
    setGrid(createGrid())
    setPathCost(0)
    setVisitedCount(0)
    setDrawMode('wall')
  }

  const handleMouseInteraction = (row, col) => {
    if (running) return
    setGrid((prev) => {
      const node = prev[row][col]
      if (node.isStart || node.isEnd) return prev

      if (drawMode === 'wall') {
        return prev.map((r, y) =>
          r.map((n, x) =>
            y === row && x === col
              ? { ...n, isWall: !n.isWall, isWeighted: false, weight: 1 }
              : n
          )
        )
      } else if (drawMode === 'weight') {
        return prev.map((r, y) =>
          r.map((n, x) =>
            y === row && x === col
              ? { ...n, isWall: false, isWeighted: true, weight: 5 }
              : n
          )
        )
      } else if (drawMode === 'erase') {
        return prev.map((r, y) =>
          r.map((n, x) =>
            y === row && x === col
              ? { ...n, isWall: false, isWeighted: false, weight: 1 }
              : n
          )
        )
      }
      return prev
    })
  }

  const generateMaze = () => {
    if (running) return
    const freshGrid = createGrid()
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = freshGrid[row][col]
        if (
          !node.isStart &&
          !node.isEnd &&
          Math.random() < MAZE_WALL_PROBABILITY
        ) {
          node.isWall = true
        }
      }
    }
    setGrid(freshGrid)
  }

  const animate = useCallback(
    (visitedNodes, shortestPath, finalDistances) => {
      clearPath()
      setRunning(true)
      const visitSpeed = 15 / speedRef.current
      const pathSpeed = 40 / speedRef.current

      visitedNodes.forEach((node, index) => {
        const timer = setTimeout(() => {
          setGrid((prev) =>
            prev.map((r) =>
              r.map((c) =>
                c.row === node.row &&
                c.col === node.col &&
                !c.isStart &&
                !c.isEnd
                  ? { ...c, visited: true }
                  : c
              )
            )
          )
          setVisitedCount(index + 1)
        }, index * visitSpeed)
        timeouts.current.push(timer)
      })

      const pathStart = visitedNodes.length * visitSpeed
      shortestPath.forEach((node, index) => {
        const timer = setTimeout(
          () => {
            setGrid((prev) =>
              prev.map((r) =>
                r.map((c) =>
                  c.row === node.row &&
                  c.col === node.col &&
                  !c.isStart &&
                  !c.isEnd
                    ? { ...c, path: true }
                    : c
                )
              )
            )
            if (index === shortestPath.length - 1) {
              setPathCost(finalDistances[`${node.row}-${node.col}`] ?? 0)
              setRunning(false)
            }
          },
          pathStart + index * pathSpeed
        )
        timeouts.current.push(timer)
      })

      if (shortestPath.length === 0) {
        const timer = setTimeout(() => {
          setRunning(false)
          setPathCost(0)
        }, pathStart)

        timeouts.current.push(timer)
      }
    },
    [clearPath]
  )

  useEffect(() => {
    if (runKey === null || !algorithm) return
    const runGrid = gridRef.current.map((row) =>
      row.map((node) => ({ ...node }))
    )
    let result
    if (algorithm === 'dijkstra') result = runDijkstra(runGrid)
    else if (algorithm === 'bellmanford') result = runBellmanFord(runGrid)
    else if (algorithm === 'floydwarshall')
      result = runFloydWarshallVisualization(runGrid)

    if (result) {
      setTimeout(() => {
        animate(
          result.order,
          buildPath(result.parent, runGrid),
          result.distances
        )
      }, 0)
    }
  }, [runKey, algorithm, animate])

  return (
    <div className="w-full bg-(--theme-surface-muted) border border-(--theme-border) p-4 rounded-xl">
      <div className="flex flex-wrap gap-3 mb-5">
        {DRAW_MODES.map((mode) => (
          <button
            key={mode}
            aria-label={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`}
            onClick={() => setDrawMode(mode)}
            className={`px-4 py-2 rounded-lg text-(--theme-text-strong) font-semibold text-sm ${drawMode === mode ? 'bg-cyan-600' : 'bg-(--theme-surface-strong)'}`}
          >
            {mode.toUpperCase()} Mode
          </button>
        ))}
        <button
          aria-label="Generate Maze"
          onClick={generateMaze}
          disabled={running}
          className="px-4 py-2 bg-[var(--theme-surface-strong)] rounded-lg text-(--theme-text-strong) font-semibold text-sm"
        >
          Generate Maze
        </button>
        <button
          aria-label="Clear Grid"
          onClick={clearGrid}
          className="px-4 py-2 bg-[var(--theme-surface-strong)] rounded-lg text-(--theme-text-strong) font-semibold text-sm"
        >
          Clear Grid
        </button>
        <button
          aria-label="Clear Path"
          onClick={clearPath}
          className="px-4 py-2 bg-[var(--theme-surface-strong)] rounded-lg text-(--theme-text-strong) font-semibold text-sm"
        >
          Clear Path
        </button>
        <button
          aria-label="Reset All"
          onClick={resetAll}
          className="px-4 py-2 bg-[var(--theme-surface-strong)] rounded-lg text-(--theme-text-strong) font-semibold text-sm"
        >
          Reset All
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-64 space-y-4">
          <div className="bg-(--theme-surface) border border-(--theme-border) p-4 rounded-lg text-(--theme-text-strong) text-sm">
            <h3 className="font-bold mb-2">HOW TO USE</h3>
            <ol className="text-(--theme-text-muted) text-xs list-decimal pl-4 space-y-1">
              <li>Pick a shortest path algorithm.</li>
              <li>Select a grid tool: Wall, Weight, or Erase.</li>
              <li>
                Build your grid: Click or drag on the grid to draw. Orange nodes
                marked with &quot;5&quot; are weighted nodes.
              </li>
              <li>
                Press Run to visualize traversal and shortest path generation.
              </li>
            </ol>
          </div>
          <div className="bg-(--theme-surface) border border-(--theme-border) p-4 rounded-lg text-(--theme-text-strong) text-sm">
            <h3 className="font-bold mb-2">GRID TOOLS</h3>
            <ul className="space-y-3 text-xs text-(--theme-text-muted)">
              <li>
                🧱 <b>Wall Mode</b>
                <br />
                Click or drag to create blocked walls that algorithms cannot
                cross.
              </li>
              <li>
                ⚖️ <b>Weight Mode</b>
                <br />
                Click or drag on the grid BEFORE running to place weighted
                nodes. Normal nodes have traversal cost 1; Orange nodes marked
                &quot;5&quot; have traversal cost 5. Algorithms avoid expensive
                nodes when cheaper paths exist.
              </li>
              <li>
                🧽 <b>Erase Mode</b>
                <br />
                Removes walls and weighted nodes.
              </li>
            </ul>
          </div>
        </div>

        <div
          className="inline-block border border-(--theme-border-strong) overflow-hidden rounded-lg"
          onMouseLeave={() => setMousePressed(false)}
        >
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((node, c) => (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => {
                    setMousePressed(true)
                    handleMouseInteraction(r, c)
                  }}
                  onMouseEnter={() =>
                    mousePressed && handleMouseInteraction(r, c)
                  }
                  onMouseUp={() => setMousePressed(false)}
                  className={getCellClassName(node)}
                >
                  {node.isWeighted ? node.weight : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-5">
        <div className="bg-(--theme-surface) border border-(--theme-border) px-4 py-2 rounded-lg text-(--theme-text) text-sm">
          Visited Nodes: {visitedCount}
        </div>
        <div className="bg-(--theme-surface) border border-(--theme-border) px-4 py-2 rounded-lg text-(--theme-text) text-sm">
          Path Cost: {pathCost}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-5 text-xs text-(--theme-text-muted)">
        {LEGEND_ITEMS.map((i) => (
          <div key={i.l} className="flex items-center gap-1">
            <div className={`w-3 h-3 ${i.c}`} />
            {i.l}
          </div>
        ))}
      </div>
    </div>
  )
}
export default GridVisualizer
