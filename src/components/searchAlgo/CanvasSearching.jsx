import React, { useEffect, useRef, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasSearching = ({ algorithm, vertex, speed = 1, runKey }) => {
  const containerRef = useRef(null)
  const networkRef = useRef(null)
  const nodesRef = useRef(null)
  const edgesRef = useRef(null)
  const [status, setStatus] = useState('')
  const [physics, setPhysics] = useState(false)

  // initialize network
  useEffect(() => {
    if (!window.vis || !containerRef.current) return
    const someNodes = [
      { id: 1, label: '1' },
      { id: 2, label: '2' },
      { id: 3, label: '3' },
      { id: 4, label: '4' },
      { id: 5, label: '5' },
      { id: 6, label: '6' },
      { id: 7, label: '7' },
      { id: 8, label: '8' },
      { id: 9, label: '9' },
      { id: 10, label: '10' },
      { id: 11, label: '11' },
      { id: 12, label: '12' },
      { id: 13, label: '13' },
      { id: 14, label: '14' },
      { id: 15, label: '15' },
    ]
    const nodes = new window.vis.DataSet(someNodes)
    // const length = someNodes.length
    const edges = new window.vis.DataSet([
      // Main chain (like a backbone)
      { id: 1, from: 1, to: 2 },
      { id: 2, from: 2, to: 3 },
      { id: 3, from: 3, to: 4 },
      { id: 4, from: 4, to: 5 },
      { id: 5, from: 5, to: 6 },
      { id: 6, from: 6, to: 7 },

      // Branches from the main chain
      { id: 7, from: 2, to: 8 },
      { id: 8, from: 3, to: 9 },
      { id: 9, from: 5, to: 10 },
      { id: 10, from: 6, to: 11 },
      { id: 11, from: 4, to: 12 },

      // Sub-branches
      { id: 12, from: 8, to: 13 },
      { id: 13, from: 9, to: 14 },
      { id: 14, from: 10, to: 15 },

      // Light cross-connections (for reachability, not clutter)
      { id: 15, from: 7, to: 11 },
      { id: 16, from: 9, to: 5 },
      { id: 17, from: 10, to: 6 },
      { id: 18, from: 8, to: 4 },
      { id: 19, from: 3, to: 12 },
      { id: 20, from: 2, to: 1 },
    ])

    const data = { nodes, edges }

    const options = {
      physics: {
        enabled: false,
        stabilization: {
          enabled: true,
          iterations: 100,
          updateInterval: 25,
        },
      },
      nodes: {
        shape: 'dot',
        size: 15,
        color: {
          background: '#06b6d4', // Cyan-500
          border: '#e2e8f0', // Slate-200
          highlight: { background: '#22d3ee', border: '#ffffff' },
        },
        font: {
          size: 20,
          color: '#f8fafc', // Slate-50
          face: 'Arial',
          bold: true,
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 5,
          x: 5,
          y: 5,
        },
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 1.0 } },
        color: {
          color: '#64748b', // Slate-500
          highlight: '#22d3ee', // Cyan-400
          hover: '#22d3ee',
        },
        width: 3,
        smooth: {
          type: 'curvedCW',
          roundness: 0.0,
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 10,
          x: 5,
          y: 5,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        dragNodes: true,
        dragView: true,
        zoomView: true,
      },
    }

    const network = new window.vis.Network(containerRef.current, data, options)

    nodesRef.current = nodes
    edgesRef.current = edges
    networkRef.current = network

    return () => {
      network.destroy()
    }
  }, [])

  // Lock interaction when idle, unlock + recenter when running
  useEffect(() => {
    if (!networkRef.current) return
    if (runKey !== null) {
      networkRef.current.fit({
        animation: { duration: 400, easingFunction: 'easeInOutQuad' },
      })
    }
  }, [runKey])

  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setOptions({
        physics: { enabled: physics },
      })
    }
  }, [physics])

  // Reset nodes to default color with smooth transition
  const resetNodes = () => {
    if (nodesRef.current) {
      nodesRef.current.get().forEach((n) => {
        nodesRef.current.update({
          id: n.id,
          color: {
            background: '#06b6d4',
            border: '#e2e8f0',
          },
          size: 15,
        })
      })
    }
    if (edgesRef.current) {
      edgesRef.current.get().forEach((e) => {
        edgesRef.current.update({
          id: e.id,
          color: { color: '#64748b' },
          width: 3,
        })
      })
    }
  }

  // Reset nodes when algorithm or vertex changes (but not on run)
  useEffect(() => {
    resetNodes()
    setTimeout(() => setStatus(''), 0)
  }, [algorithm, vertex])

  // animate algorithm with enhanced visual effects — only fires when runKey changes
  useEffect(() => {
    if (
      runKey === null ||
      !algorithm ||
      !vertex ||
      !nodesRef.current ||
      !edgesRef.current
    )
      return

    const nodes = nodesRef.current
    const edges = edgesRef.current

    // reset all nodes to default color before starting
    nodes.get().forEach((n) =>
      nodes.update({
        id: n.id,
        color: { background: '#1e293b', border: '#475569' }, // Dark slate for unvisited
        size: 25,
      })
    )

    const adjacency = {}
    edges.get().forEach((e) => {
      if (!adjacency[e.from]) adjacency[e.from] = []
      adjacency[e.from].push(e.to)
    })

    const timers = []
    const visit = (id, delay) => {
      const t = setTimeout(() => {
        // Animate node size and color
        nodes.update({
          id,
          color: { background: '#f43f5e', border: '#ffffff' }, // Rose-500
          size: 35,
        })
        console.log(`node ${id} is visited.`)
        // Add pulsing effect
        setTimeout(() => {
          nodes.update({ id, size: 30 })
        }, 200 / speed)
      }, delay)
      timers.push(t)
    }

    const setStatusAtDelay = (message, delay) => {
      const t = setTimeout(() => {
        setStatus(message)
      }, delay)
      timers.push(t)
    }

    const markCompleted = (completionDelay) => {
      const t = setTimeout(() => {
        // Show completion by changing all visited nodes to green with animation
        nodes.get().forEach((n) => {
          if (n.color.background === '#f43f5e') {
            nodes.update({
              id: n.id,
              color: { background: '#10b981', border: '#ffffff' }, // Emerald-500
              size: 28,
            })
          }
        })
      }, completionDelay)
      timers.push(t)
    }

    if (algorithm === 'bfs') {
      let queue = [parseInt(vertex)]
      let visited = new Set([parseInt(vertex)])
      let delay = 0

      setStatusAtDelay(`Starting BFS from node ${vertex}`, delay)
      delay += 1200 / speed

      while (queue.length) {
        let node = queue.shift()
        visit(node, delay)
        setStatusAtDelay(
          `Visiting node ${node}. Queue: [${queue.join(', ')}]`,
          delay
        )
        delay += 1200 / speed

        const neighbors = adjacency[node] || []
        if (neighbors.length > 0) {
          setStatusAtDelay(
            `Exploring neighbors of ${node}: ${neighbors.join(', ')}`,
            delay - 600 / speed
          )
        }

        neighbors.forEach((n) => {
          if (!visited.has(n)) {
            visited.add(n)
            queue.push(n)
            setStatusAtDelay(
              `Adding ${n} to queue. Queue: [${queue.join(', ')}]`,
              delay
            )

            const edge = edges.get().find((e) => e.from === node && e.to === n)
            if (edge) {
              setTimeout(
                () => {
                  edges.update({
                    id: edge.id,
                    color: { color: '#f43f5e' },
                    width: 5,
                  })
                },
                delay - 200 / speed
              )
            }
          }
        })
      }

      markCompleted(delay + 500 / speed)
      setStatusAtDelay('BFS complete!', delay + 500 / speed)
    }

    if (algorithm === 'dfs') {
      let visited = new Set()
      let delay = 0

      const dfs = (node) => {
        if (visited.has(node)) return
        visited.add(node)
        visit(node, delay)
        setStatusAtDelay(`Visiting node ${node}`, delay)
        delay += 1200 / speed

        const neighbors = adjacency[node] || []
        if (neighbors.length > 0) {
          setStatusAtDelay(
            `Exploring neighbors of node ${node}: ${neighbors.join(', ')}`,
            delay - 600 / speed
          )
        }

        let hasUnvisitedNeighbors = false
        for (const n of neighbors) {
          if (!visited.has(n)) {
            hasUnvisitedNeighbors = true
            const edge = edges.get().find((e) => e.from === node && e.to === n)
            if (edge) {
              setTimeout(
                () => {
                  edges.update({
                    id: edge.id,
                    color: { color: '#f43f5e' },
                    width: 5,
                  })
                },
                delay - 200 / speed
              )
            }
            dfs(n)
            setStatusAtDelay(`Backtracking from ${n} to node ${node}`, delay)
            delay += 500 / speed
          }
        }

        if (!hasUnvisitedNeighbors) {
          setStatusAtDelay(
            `Node ${node} has no unvisited neighbors. Backtracking.`,
            delay
          )
          delay += 500 / speed
        } else {
          setStatusAtDelay(
            `Finished exploring neighbors of ${node}. Backtracking.`,
            delay
          )
          delay += 500 / speed
        }
      }

      setStatusAtDelay(`Starting DFS from node ${vertex}`, 0)
      delay += 500 / speed

      dfs(parseInt(vertex))

      markCompleted(delay + 500 / speed)
      setStatusAtDelay('DFS complete!', delay + 500 / speed)
    }

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [runKey, algorithm, vertex, speed])

  return (
    <div className="w-full relative">
      <div className="relative rounded-lg border border-white/10 shadow-lg overflow-hidden h-[50vh] min-h-[350px] max-h-[650px] bg-slate-900/50 backdrop-blur-sm">
        <div
          id="cy"
          ref={containerRef}
          className="h-full w-full"
          style={{ background: 'transparent' }}
        />

        {/* Color legend */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
            Unvisited
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            Visiting
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            Visited
          </span>
        </div>

        {/* Physics toggle */}
        <div className="absolute top-3 right-3 z-10 group">
          <button
            onClick={() => setPhysics(!physics)}
            title="Toggle physics to freely drag and reposition nodes"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg shadow-md transition-all duration-300 border backdrop-blur-md ${
              physics
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-slate-800/50 text-slate-300 border-white/10 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              {physics ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              )}
            </svg>
            {physics ? 'Physics ON' : 'Physics OFF'}
          </button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Enables dragging nodes to rearrange the graph layout.
          </div>
        </div>
      </div>
      {status && <StatusDisplay key={status} message={status} />}
    </div>
  )
}
