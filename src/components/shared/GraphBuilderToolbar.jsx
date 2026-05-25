import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * GraphBuilderToolbar
 *
 * A floating glassmorphic toolbar that overlays any vis-network canvas and
 * lets users interactively build custom graphs.
 *
 * Props:
 *  - networkRef   : React ref holding the vis.Network instance
 *  - nodesRef     : React ref holding the vis.DataSet of nodes
 *  - edgesRef     : React ref holding the vis.DataSet of edges
 *  - presetNodes  : Array – original preset node objects (for Reset)
 *  - presetEdges  : Array – original preset edge objects (for Reset)
 *  - weighted     : boolean – if true, prompts for edge weight on Add Edge
 *  - onGraphChange: (nodeIds: number[]) => void – called whenever nodes change
 */
export const GraphBuilderToolbar = ({
  networkRef,
  nodesRef,
  edgesRef,
  presetNodes,
  presetEdges,
  weighted = false,
  onGraphChange,
}) => {
  const [builderMode, setBuilderMode] = useState('pointer')
  const [selectedElement, setSelectedElement] = useState(null) // { type, id }
  const [weightModal, setWeightModal] = useState(null) // { from, to }
  const [weightInput, setWeightInput] = useState('1')
  const [weightError, setWeightError] = useState('')

  // Track pending first-click node in addEdge mode (state for UI hints)
  const [pendingEdgeSourceId, setPendingEdgeSourceId] = useState(null)
  // Stable counter for new node IDs to avoid collisions
  const nextNodeId = useRef(null)
  // Stable counter for new edge IDs
  const nextEdgeId = useRef(null)

  // Keep builderMode accessible inside event listeners without stale closure
  const builderModeRef = useRef(builderMode)
  useEffect(() => {
    builderModeRef.current = builderMode
  }, [builderMode])

  const selectBuilderMode = useCallback(
    (id) => {
      if (pendingEdgeSourceId !== null && nodesRef.current) {
        nodesRef.current.update({
          id: pendingEdgeSourceId,
          color: { background: '#06b6d4', border: '#e2e8f0' },
        })
      }
      setPendingEdgeSourceId(null)
      setSelectedElement(null)
      networkRef.current?.unselectAll()
      setBuilderMode(id)
    },
    [pendingEdgeSourceId, nodesRef, networkRef]
  )

  // Initialise ID counters once nodes/edges are loaded
  useEffect(() => {
    if (!nodesRef.current || !edgesRef.current) return
    const nodeIds = nodesRef.current.getIds()
    const edgeIds = edgesRef.current.getIds()
    nextNodeId.current = nodeIds.length > 0 ? Math.max(...nodeIds) + 1 : 1
    nextEdgeId.current = edgeIds.length > 0 ? Math.max(...edgeIds) + 1 : 1
  }, [nodesRef, edgesRef])

  // Notify parent of current node list
  const notifyGraphChange = useCallback(() => {
    if (!nodesRef.current || !onGraphChange) return
    onGraphChange(nodesRef.current.getIds())
  }, [nodesRef, onGraphChange])

  // ─── Event handlers ───────────────────────────────────────────────────────

  const handleClick = useCallback(
    (params) => {
      const mode = builderModeRef.current
      const network = networkRef.current
      const nodes = nodesRef.current
      const edges = edgesRef.current
      if (!network || !nodes || !edges) return

      if (mode === 'addNode') {
        // Only create a node if user clicked empty canvas space
        if (params.nodes.length > 0 || params.edges.length > 0) return
        const pos = network.DOMtoCanvas({
          x: params.event.center.x,
          y: params.event.center.y,
        })
        const id = nextNodeId.current++
        nodes.add({ id, label: String(id), x: pos.x, y: pos.y })
        notifyGraphChange()
        return
      }

      if (mode === 'addEdge') {
        const clickedNode = params.nodes[0]
        if (!clickedNode) return

        if (pendingEdgeSourceId === null) {
          // First click – highlight as source
          setPendingEdgeSourceId(clickedNode)
          nodes.update({
            id: clickedNode,
            color: {
              background: '#f59e0b',
              border: '#fbbf24',
            },
          })
        } else {
          const from = pendingEdgeSourceId
          const to = clickedNode

          // Reset source highlight
          nodes.update({
            id: from,
            color: { background: '#06b6d4', border: '#e2e8f0' },
          })
          setPendingEdgeSourceId(null)

          if (from === to) return // no self-loops

          if (weighted) {
            // Open weight modal
            setWeightModal({ from, to })
            setWeightInput('1')
            setWeightError('')
          } else {
            // Create unweighted edge immediately
            const id = nextEdgeId.current++
            edges.add({ id, from, to })
          }
        }
      }
    },
    [
      networkRef,
      nodesRef,
      edgesRef,
      weighted,
      notifyGraphChange,
      pendingEdgeSourceId,
    ]
  )

  const handleSelectNode = useCallback((params) => {
    if (params.nodes.length > 0) {
      setSelectedElement({ type: 'node', id: params.nodes[0] })
    }
  }, [])

  const handleSelectEdge = useCallback((params) => {
    if (params.edges.length > 0 && params.nodes.length === 0) {
      setSelectedElement({ type: 'edge', id: params.edges[0] })
    }
  }, [])

  const handleDeselect = useCallback(() => {
    setSelectedElement(null)
  }, [])

  // Attach / detach vis-network event listeners when network is ready
  useEffect(() => {
    const network = networkRef.current
    if (!network) return

    network.on('click', handleClick)
    network.on('selectNode', handleSelectNode)
    network.on('selectEdge', handleSelectEdge)
    network.on('deselectNode', handleDeselect)
    network.on('deselectEdge', handleDeselect)

    return () => {
      network.off('click', handleClick)
      network.off('selectNode', handleSelectNode)
      network.off('selectEdge', handleSelectEdge)
      network.off('deselectNode', handleDeselect)
      network.off('deselectEdge', handleDeselect)
    }
  }, [
    networkRef,
    handleClick,
    handleSelectNode,
    handleSelectEdge,
    handleDeselect,
  ])

  // ─── Toolbar actions ──────────────────────────────────────────────────────

  const handleDelete = useCallback(() => {
    if (!selectedElement) return
    const clearedPendingSource =
      selectedElement.type === 'node' &&
      selectedElement.id === pendingEdgeSourceId

    if (selectedElement.type === 'node') {
      // Also remove all edges connected to this node
      const connectedEdges = edgesRef.current
        .get()
        .filter(
          (e) => e.from === selectedElement.id || e.to === selectedElement.id
        )
        .map((e) => e.id)
      edgesRef.current.remove(connectedEdges)
      nodesRef.current.remove(selectedElement.id)
      notifyGraphChange()
    } else {
      edgesRef.current.remove(selectedElement.id)
    }
    if (clearedPendingSource) {
      setPendingEdgeSourceId(null)
    }
    setSelectedElement(null)
  }, [
    selectedElement,
    pendingEdgeSourceId,
    nodesRef,
    edgesRef,
    notifyGraphChange,
  ])

  const handleClearAll = useCallback(() => {
    if (!nodesRef.current || !edgesRef.current) return
    edgesRef.current.clear()
    nodesRef.current.clear()
    nextNodeId.current = 1
    nextEdgeId.current = 1
    setPendingEdgeSourceId(null)
    setSelectedElement(null)
    notifyGraphChange()
  }, [nodesRef, edgesRef, notifyGraphChange])

  const handleResetPreset = useCallback(() => {
    if (!nodesRef.current || !edgesRef.current) return
    edgesRef.current.clear()
    nodesRef.current.clear()
    nodesRef.current.add(presetNodes)
    edgesRef.current.add(presetEdges)
    const nodeIds = presetNodes.map((n) => n.id)
    const edgeIds = presetEdges
      .map((e) => e.id)
      .filter((id) => id !== undefined)
    nextNodeId.current = nodeIds.length > 0 ? Math.max(...nodeIds) + 1 : 1
    nextEdgeId.current = edgeIds.length > 0 ? Math.max(...edgeIds) + 1 : 1
    setPendingEdgeSourceId(null)
    setSelectedElement(null)
    notifyGraphChange()
    if (networkRef.current) {
      networkRef.current.fit({
        animation: { duration: 400, easingFunction: 'easeInOutQuad' },
      })
    }
  }, [
    nodesRef,
    edgesRef,
    presetNodes,
    presetEdges,
    notifyGraphChange,
    networkRef,
  ])

  // ─── Weight modal confirm ─────────────────────────────────────────────────

  const handleWeightConfirm = useCallback(() => {
    const w = parseFloat(weightInput)
    if (!Number.isFinite(w)) {
      setWeightError('Enter a valid number (e.g. -1, 4, 7.5)')
      return
    }
    const { from, to } = weightModal
    const id = nextEdgeId.current++
    edgesRef.current.add({
      id,
      from,
      to,
      label: String(w),
      weight: w,
    })
    setWeightModal(null)
    setWeightError('')
  }, [weightInput, weightModal, edgesRef])

  const handleWeightCancel = useCallback(() => {
    setWeightModal(null)
    setWeightError('')
  }, [])

  // ─── Render helpers ───────────────────────────────────────────────────────

  const modeButtons = [
    {
      id: 'pointer',
      label: 'Pointer',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 15l-6-6m0 0l6-6m-6 6h12"
          />
        </svg>
      ),
      tooltip: 'Drag nodes, zoom & pan',
    },
    {
      id: 'addNode',
      label: '+ Node',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v8M8 12h8"
          />
        </svg>
      ),
      tooltip: 'Click empty canvas to add a node',
    },
    {
      id: 'addEdge',
      label: '+ Edge',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M15 8l4 4-4 4"
          />
        </svg>
      ),
      tooltip: weighted
        ? 'Click source node → target node, then enter weight'
        : 'Click source node → target node',
    },
  ]

  const modeColors = {
    pointer: 'cyan',
    addNode: 'emerald',
    addEdge: 'purple',
  }

  const colorMap = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]',
    emerald:
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
    purple:
      'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.25)]',
  }

  return (
    <>
      {/* ── Floating Toolbar ─────────────────────────────────────────────── */}
      <div
        role="toolbar"
        aria-label="Graph builder"
        className="absolute top-3 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto flex flex-wrap items-center justify-center gap-1 max-w-[calc(100%-1rem)] bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-2 py-1.5 shadow-2xl shadow-cyan-500/10"
      >
        <span className="sr-only sm:not-sr-only sm:inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400/90 border-r border-white/10 mr-1">
          Build
        </span>
        {/* Mode pills */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          {modeButtons.map(({ id, label, icon, tooltip }) => (
            <button
              key={id}
              id={`graph-builder-mode-${id}`}
              title={tooltip}
              onClick={() => selectBuilderMode(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                builderMode === id
                  ? colorMap[modeColors[id]]
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              {icon}
              <span className="text-[10px] sm:text-xs">{label}</span>
            </button>
          ))}
        </div>

        {/* Admin controls */}
        <div className="flex items-center gap-1 pl-1">
          <button
            id="graph-builder-delete"
            title={
              selectedElement
                ? `Delete selected ${selectedElement.type}`
                : 'Select a node or edge first'
            }
            onClick={handleDelete}
            disabled={!selectedElement}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
              selectedElement
                ? 'text-rose-400 border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20'
                : 'text-slate-600 border-transparent cursor-not-allowed'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            <span className="text-[10px] sm:text-xs">Delete</span>
          </button>

          <button
            id="graph-builder-clear"
            title="Clear all nodes and edges"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-transparent text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <span className="text-[10px] sm:text-xs">Clear</span>
          </button>

          <button
            id="graph-builder-reset"
            title="Restore the default preset graph"
            onClick={handleResetPreset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-transparent text-slate-300 hover:bg-white/5 hover:border-white/10 transition-all duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            <span className="text-[10px] sm:text-xs">Reset</span>
          </button>
        </div>
      </div>

      {/* ── Mode hint banner ────────────────────────────────────────────────── */}
      {builderMode !== 'pointer' && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <div
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
              builderMode === 'addNode'
                ? 'bg-emerald-900/70 text-emerald-300 border-emerald-500/30'
                : 'bg-purple-900/70 text-purple-300 border-purple-500/30'
            }`}
          >
            {builderMode === 'addNode'
              ? '🟢 Click empty canvas to place a node'
              : pendingEdgeSourceId !== null
                ? `🟣 Now click the target node (source: ${pendingEdgeSourceId})`
                : '🟣 Click the source node'}
          </div>
        </div>
      )}

      {/* ── Weight Input Modal ───────────────────────────────────────────────── */}
      {weightModal && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-lg">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-72 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">
                Edge Weight&nbsp;
                <span className="text-slate-400 font-normal">
                  ({weightModal.from} → {weightModal.to})
                </span>
              </h3>
              <button
                onClick={handleWeightCancel}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Negative weights supported (e.g. for Bellman-Ford).
            </p>

            <input
              id="edge-weight-input"
              type="number"
              value={weightInput}
              onChange={(e) => {
                setWeightInput(e.target.value)
                setWeightError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleWeightConfirm()
                if (e.key === 'Escape') handleWeightCancel()
              }}
              autoFocus
              className="w-full bg-slate-800 text-white text-sm border border-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              placeholder="e.g. 4"
            />

            {weightError && (
              <p className="text-rose-400 text-xs mt-1.5">{weightError}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleWeightCancel}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                id="edge-weight-confirm"
                onClick={handleWeightConfirm}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all"
              >
                Add Edge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
