import React, { useEffect, useRef, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasShortestPath = ({
  algorithm,
  source,
  target,
  speed = 1,
  runKey,
}) => {
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
    ]

    const nodes = new window.vis.DataSet(someNodes)

    const edges = new window.vis.DataSet([
      { from: 1, to: 2, label: '2', weight: 2 },
      { from: 1, to: 3, label: '4', weight: 4 },
      { from: 2, to: 3, label: '1', weight: 1 },
      { from: 2, to: 4, label: '7', weight: 7 },
      { from: 3, to: 5, label: '3', weight: 3 },
      { from: 4, to: 6, label: '1', weight: 1 },
      { from: 5, to: 4, label: '2', weight: 2 },
      { from: 5, to: 6, label: '5', weight: 5 },
      { from: 6, to: 7, label: '2', weight: 2 },
      { from: 7, to: 8, label: '1', weight: 1 },
      { from: 8, to: 9, label: '4', weight: 4 },
      { from: 3, to: 9, label: '12', weight: 12 },
      { from: 4, to: 3, label: '-1', weight: -1 },
    ])

    const data = { nodes, edges }

    const options = {
      physics: {
        enabled: false,
        stabilization: { enabled: true, iterations: 100, updateInterval: 25 },
      },
      nodes: {
        shape: 'dot',
        size: 25,
        color: {
          background: '#06b6d4',
          border: '#e2e8f0',
          highlight: { background: '#22d3ee', border: '#ffffff' },
        },
        font: { size: 16, color: '#f8fafc', face: 'Arial', bold: true },
        borderWidth: 3,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 10,
          x: 5,
          y: 5,
        },
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.8 } },
        color: { color: '#64748b', highlight: '#22d3ee', hover: '#22d3ee' },
        width: 3,
        smooth: { type: 'curvedCW', roundness: 0.0 },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 10,
          x: 5,
          y: 5,
        },
        font: {
          size: 14,
          color: '#f8fafc',
          strokeWidth: 2,
          strokeColor: '#0f172a',
          face: 'Arial',
          bold: true,
          align: 'middle',
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

  // Recenter on run
  useEffect(() => {
    if (!networkRef.current || runKey === null) return
    networkRef.current.fit({
      animation: { duration: 400, easingFunction: 'easeInOutQuad' },
    })
  }, [runKey])

  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setOptions({ physics: { enabled: physics } })
    }
  }, [physics])

  const resetStyles = () => {
    if (!nodesRef.current || !edgesRef.current) return
    nodesRef.current.get().forEach((n) => {
      nodesRef.current.update({
        id: n.id,
        color: { background: '#06b6d4', border: '#e2e8f0' },
        size: 25,
      })
    })
    edgesRef.current.get().forEach((e) => {
      edgesRef.current.update({
        id: e.id,
        color: { color: '#64748b' },
        width: 3,
      })
    })
  }

  // Animate — only fires when runKey changes
  useEffect(() => {
    resetStyles()
    if (runKey === null || !algorithm || !source || !target) {
      setTimeout(() => setStatus(''), 0)
      return
    }

    if (!nodesRef.current || !edgesRef.current) return

    const nodes = nodesRef.current
    const edges = edgesRef.current
    const nodeIds = nodes.get().map((n) => n.id)

    const adj = {}
    nodeIds.forEach((id) => {
      adj[id] = []
    })
    edges.get().forEach((e) => {
      const edgeId = e.id
      const w =
        typeof e.weight === 'number' ? e.weight : parseFloat(e.label ?? '1')
      if (!Number.isFinite(w)) return
      if (!adj[e.from]) adj[e.from] = []
      adj[e.from].push({ to: e.to, w, edgeId })
    })

    const src = parseInt(source)
    const dst = parseInt(target)

    const timers = []

    const visitLaterNode = (id, delay) => {
      const t = setTimeout(() => {
        nodes.update({
          id,
          color: { background: '#f43f5e', border: '#ffffff' },
          size: 35,
        })
        setTimeout(() => {
          nodes.update({ id, size: 30 })
        }, 300 / speed)
      }, delay)
      timers.push(t)
    }

    const visitLaterEdge = (edgeId, delay) => {
      const t = setTimeout(() => {
        edges.update({ id: edgeId, color: { color: '#10b981' }, width: 6 })
        setTimeout(() => {
          edges.update({ id: edgeId, width: 5 })
        }, 200 / speed)
      }, delay)
      timers.push(t)
    }

    const reconstructAndAnimatePath = (parent) => {
      const pathNodes = []
      const pathEdges = []
      let cur = dst
      if (parent[cur] == null) {
        setStatus(`Node ${dst} is not reachable from ${src}.`)
        return
      }
      while (cur != null && cur !== src) {
        const prev = parent[cur]
        if (prev == null) break
        pathNodes.push(cur)
        const e = (adj[prev] || []).find((x) => x.to === cur)
        if (e) pathEdges.push(e.edgeId)
        cur = prev
      }
      pathNodes.push(src)
      pathNodes.reverse()
      pathEdges.reverse()

      let delay = 0
      pathNodes.forEach((n, index) => {
        visitLaterNode(n, delay)
        delay += 800 / speed
        if (index < pathEdges.length) {
          visitLaterEdge(pathEdges[index], delay - 200 / speed)
        }
      })

      setTimeout(
        () => {
          pathNodes.forEach((n) => {
            nodes.update({
              id: n,
              color: { background: '#10b981', border: '#ffffff' },
              size: 28,
            })
          })
          pathEdges.forEach((eId) => {
            edges.update({ id: eId, color: { color: '#10b981' }, width: 5 })
          })
          setStatus(`Path found from ${src} to ${dst}.`)
        },
        delay + 500 / speed
      )
    }

    const runDijkstra = () => {
      setStatus(`Running Dijkstra's algorithm from ${src} to ${dst}...`)
      const dist = {}
      const parent = {}
      const used = new Set()
      nodeIds.forEach((id) => {
        dist[id] = Infinity
        parent[id] = null
      })
      dist[src] = 0
      while (used.size < nodeIds.length) {
        let u = null,
          best = Infinity
        for (const id of nodeIds) {
          if (used.has(id)) continue
          if (dist[id] < best) {
            best = dist[id]
            u = id
          }
        }
        if (u == null || best === Infinity) break
        used.add(u)
        for (const { to, w } of adj[u] || []) {
          if (dist[u] + w < dist[to]) {
            dist[to] = dist[u] + w
            parent[to] = u
          }
        }
      }
      reconstructAndAnimatePath(parent)
    }

    const runBellmanFord = () => {
      setStatus(`Running Bellman-Ford algorithm from ${src} to ${dst}...`)
      const dist = {}
      const parent = {}
      nodeIds.forEach((id) => {
        dist[id] = Infinity
        parent[id] = null
      })
      dist[src] = 0
      const edgeList = []
      edges.get().forEach((e) => {
        const w =
          typeof e.weight === 'number' ? e.weight : parseFloat(e.label ?? '1')
        if (Number.isFinite(w)) edgeList.push({ from: e.from, to: e.to, w })
      })
      for (let i = 0; i < nodeIds.length - 1; i++) {
        let changed = false
        for (const { from, to, w } of edgeList) {
          if (dist[from] !== Infinity && dist[from] + w < dist[to]) {
            dist[to] = dist[from] + w
            parent[to] = from
            changed = true
          }
        }
        if (!changed) break
      }
      reconstructAndAnimatePath(parent)
    }

    const runFloydWarshall = () => {
      setStatus(`Running Floyd-Warshall algorithm...`)
      const n = nodeIds.length
      const idxOf = new Map(nodeIds.map((id, i) => [id, i]))
      const dist = Array.from({ length: n }, () => Array(n).fill(Infinity))
      const next = Array.from({ length: n }, () => Array(n).fill(null))
      for (let i = 0; i < n; i++) dist[i][i] = 0
      edges.get().forEach((e) => {
        const i = idxOf.get(e.from),
          j = idxOf.get(e.to)
        const w =
          typeof e.weight === 'number' ? e.weight : parseFloat(e.label ?? '1')
        if (!Number.isFinite(w)) return
        if (w < dist[i][j]) {
          dist[i][j] = w
          next[i][j] = e.to
        }
      })
      for (let k = 0; k < n; k++)
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++)
            if (dist[i][k] + dist[k][j] < dist[i][j]) {
              dist[i][j] = dist[i][k] + dist[k][j]
              next[i][j] = next[i][k]
            }

      const buildParentFromNext = () => {
        const parent = {}
        const i = idxOf.get(src),
          j = idxOf.get(dst)
        if (next[i][j] == null) return parent
        let u = src
        while (u !== dst) {
          const v = next[idxOf.get(u)][j]
          if (v == null) break
          parent[v] = u
          u = v
        }
        return parent
      }
      reconstructAndAnimatePath(buildParentFromNext())
    }

    if (algorithm === 'dijkstra') runDijkstra()
    if (algorithm === 'bellmanford') runBellmanFord()
    if (algorithm === 'floydwarshall') runFloydWarshall()

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [runKey, algorithm, source, target, speed])

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative rounded-lg border border-white/10 shadow-lg overflow-hidden h-[50vh] min-h-[350px] max-h-[650px] bg-slate-900/50 backdrop-blur-sm">
        <div
          id="cy-sp"
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
            Path
          </span>
        </div>

        {/* Physics toggle */}
        <div className="absolute top-3 right-3 z-10 group">
          <button
            onClick={() => setPhysics(!physics)}
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
