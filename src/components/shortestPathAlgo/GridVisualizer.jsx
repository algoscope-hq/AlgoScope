import React, { useCallback, useEffect, useRef, useState } from 'react'

const ROWS = 20
const COLS = 40

const START_ROW = 10
const START_COL = 5

const END_ROW = 10
const END_COL = 34

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_ROW && col === START_COL,
    isEnd: row === END_ROW && col === END_COL,
    isWall: false,
    visited: false,
    path: false,
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

  if (row > 0) neighbors.push(currentGrid[row - 1][col])
  if (row < ROWS - 1) neighbors.push(currentGrid[row + 1][col])
  if (col > 0) neighbors.push(currentGrid[row][col - 1])
  if (col < COLS - 1) neighbors.push(currentGrid[row][col + 1])

  return neighbors.filter((n) => !n.isWall)
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

    if (!current) break

    const currentKey = `${current.row}-${current.col}`

    visited.add(currentKey)

    if (current.isWall) continue

    order.push(current)

    if (current.row === endNode.row && current.col === endNode.col) {
      break
    }

    const neighbors = getNeighbors(current, currentGrid)

    for (const next of neighbors) {
      const nextKey = `${next.row}-${next.col}`
      const newDistance = distances[currentKey] + 1

      if (newDistance < distances[nextKey]) {
        distances[nextKey] = newDistance
        parent[nextKey] = current
      }
    }
  }

  return { order, parent }
}

const buildPath = (parent, currentGrid) => {
  const path = []

  const startNode = currentGrid[START_ROW][START_COL]
  const endNode = currentGrid[END_ROW][END_COL]

  let current = endNode
  const endKey = `${endNode.row}-${endNode.col}`

  if (
    !parent[endKey] &&
    !(endNode.row === startNode.row && endNode.col === startNode.col)
  ) {
    return []
  }

  while (current) {
    path.unshift(current)

    const key = `${current.row}-${current.col}`
    current = parent[key]
  }

  return path
}

const GridVisualizer = ({ algorithm, runKey, speed }) => {
  const [grid, setGrid] = useState(() => createGrid())
  const [mousePressed, setMousePressed] = useState(false)
  const [running, setRunning] = useState(false)
  const [drawWallMode, setDrawWallMode] = useState(true)

  const timeouts = useRef([])
  const gridRef = useRef(null)

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
        row.map((node) => ({
          ...node,
          visited: false,
          path: false,
        }))
      )
    )

    setRunning(false)
  }, [clearTimers])

  const clearGrid = () => {
    clearTimers()
    setRunning(false)
    setGrid(createGrid())
  }

  const handleMouseDown = (row, col) => {
    if (running) return

    const updated = grid.map((r) => r.map((node) => ({ ...node })))
    const current = updated[row][col]

    if (!current.isStart && !current.isEnd) {
      const newWallState = !current.isWall

      current.isWall = newWallState
      setDrawWallMode(newWallState)
    }

    setGrid(updated)
    setMousePressed(true)
  }

  const handleMouseEnter = (row, col) => {
    if (!mousePressed || running) return

    const updated = grid.map((r) => r.map((node) => ({ ...node })))
    const current = updated[row][col]

    if (!current.isStart && !current.isEnd) {
      if (current.isWall === drawWallMode) return

      current.isWall = drawWallMode
    }

    setGrid(updated)
  }

  const handleMouseUp = () => {
    setMousePressed(false)
  }

  const generateMaze = () => {
    if (running) return

    const freshGrid = createGrid()

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = freshGrid[row][col]

        if (!node.isStart && !node.isEnd && Math.random() < 0.25) {
          node.isWall = true
        }
      }
    }

    setGrid(freshGrid)
  }

  const animate = useCallback(
    (visitedNodes, shortestPath) => {
      clearPath()
      setRunning(true)

      const visitSpeed = 15 / speed
      const pathSpeed = 40 / speed

      visitedNodes.forEach((node, index) => {
        const timer = setTimeout(() => {
          setGrid((prev) =>
            prev.map((row) =>
              row.map((cell) => {
                if (
                  cell.row === node.row &&
                  cell.col === node.col &&
                  !cell.isStart &&
                  !cell.isEnd
                ) {
                  return {
                    ...cell,
                    visited: true,
                  }
                }

                return cell
              })
            )
          )
        }, index * visitSpeed)

        timeouts.current.push(timer)
      })

      const pathStart = visitedNodes.length * visitSpeed

      if (shortestPath.length === 0) {
        const timer = setTimeout(() => {
          setRunning(false)
        }, pathStart)

        timeouts.current.push(timer)
        return
      }

      shortestPath.forEach((node, index) => {
        const timer = setTimeout(
          () => {
            setGrid((prev) =>
              prev.map((row) =>
                row.map((cell) => {
                  if (
                    cell.row === node.row &&
                    cell.col === node.col &&
                    !cell.isStart &&
                    !cell.isEnd
                  ) {
                    return {
                      ...cell,
                      path: true,
                    }
                  }

                  return cell
                })
              )
            )

            if (index === shortestPath.length - 1) {
              setRunning(false)
            }
          },
          pathStart + index * pathSpeed
        )

        timeouts.current.push(timer)
      })
    },
    [clearPath, speed]
  )

  useEffect(() => {
    if (runKey === null) return
    if (!algorithm) return

    clearTimers()

    const runGrid = gridRef.current.map((row) =>
      row.map((node) => ({
        ...node,
      }))
    )

    const frame = requestAnimationFrame(() => {
      let result

      if (algorithm === 'dijkstra') {
        result = runDijkstra(runGrid)
      } else if (algorithm === 'bellmanford') {
        console.warn('Bellman-Ford grid visualization not implemented yet')
        result = runDijkstra(runGrid)
      } else if (algorithm === 'floydwarshall') {
        console.warn('Floyd-Warshall grid visualization not implemented yet')
        result = runDijkstra(runGrid)
      }

      if (!result) return

      const shortestPath = buildPath(result.parent, runGrid)

      animate(result.order, shortestPath)
    })

    return () => {
      cancelAnimationFrame(frame)
      clearTimers()
    }
  }, [runKey, algorithm, speed, animate, clearTimers])

  return (
    <div className="w-full bg-[#020617] p-4 rounded-xl">
      <div className="flex flex-wrap gap-3 mb-5">
        <button
          onClick={generateMaze}
          disabled={running}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 transition-all rounded-lg text-white font-semibold text-sm disabled:opacity-50"
        >
          Generate Maze
        </button>

        <button
          onClick={clearGrid}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition-all rounded-lg text-white font-semibold text-sm"
        >
          Clear Grid
        </button>

        <button
          onClick={clearPath}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 transition-all rounded-lg text-white font-semibold text-sm"
        >
          Clear Path
        </button>
      </div>

      <div
        className="inline-block border border-slate-700 overflow-hidden rounded-lg"
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((node, nodeIndex) => (
              <div
                key={nodeIndex}
                onMouseDown={() => handleMouseDown(node.row, node.col)}
                onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                onMouseUp={handleMouseUp}
                className={`w-7 h-7 border border-slate-800 transition-all duration-150 ${
                  node.isStart
                    ? 'bg-green-500'
                    : node.isEnd
                      ? 'bg-red-500'
                      : node.isWall
                        ? 'bg-black'
                        : node.path
                          ? 'bg-yellow-400'
                          : node.visited
                            ? 'bg-cyan-500'
                            : 'bg-[#0f172a]'
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-5 mt-5 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-green-500" />
          <span>Start</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-red-500" />
          <span>Target</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-black border border-slate-700" />
          <span>Wall</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-cyan-500" />
          <span>Visited</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-yellow-400" />
          <span>Shortest Path</span>
        </div>
      </div>
    </div>
  )
}

export default GridVisualizer
