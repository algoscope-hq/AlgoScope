import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusDisplay from '../StatusDisplay'

const F = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]

// Helper to layout Fibonacci squares and arcs for the Golden Spiral
const getSpiralSquares = (count) => {
  const squares = []
  if (count <= 0) return { squares, viewBox: '0 0 100 100' }

  let xMin = 0,
    xMax = 1,
    yMin = 0,
    yMax = 1

  // k = 1 (First square)
  squares.push({
    k: 1,
    x: 0,
    y: 0,
    size: 1,
    startX: 0,
    startY: 1,
    endX: 1,
    endY: 0,
    path: 'M 0 1 A 1 1 0 0 1 1 0',
  })

  // Generate subsequent squares spiraling outwards
  for (let k = 2; k <= count; k++) {
    // Safety check for array bounds
    const size = F[k] || 1
    const dir = (k - 2) % 4 // 0 = Right, 1 = Bottom, 2 = Left, 3 = Top
    let x = 0,
      y = 0

    if (dir === 0) {
      // Place Right
      x = xMax
      y = yMin
      xMax += size
    } else if (dir === 1) {
      // Place Bottom
      x = xMin
      y = yMax
      yMax += size
    } else if (dir === 2) {
      // Place Left
      x = xMin - size
      y = yMin
      xMin -= size
    } else if (dir === 3) {
      // Place Top
      x = xMin
      y = yMin - size
      yMin -= size
    }

    // Determine arc start and end coordinates based on the center corner (modulo 4)
    let startX, startY, endX, endY
    const mod = k % 4
    if (mod === 1) {
      startX = x
      startY = y + size
      endX = x + size
      endY = y
    } else if (mod === 2) {
      startX = x
      startY = y
      endX = x + size
      endY = y + size
    } else if (mod === 3) {
      startX = x + size
      startY = y
      endX = x
      endY = y + size
    } else {
      // mod === 0
      startX = x + size
      startY = y + size
      endX = x
      endY = y
    }

    squares.push({
      k,
      x,
      y,
      size,
      startX,
      startY,
      endX,
      endY,
      path: `M ${startX} ${startY} A ${size} ${size} 0 0 1 ${endX} ${endY}`,
    })
  }

  // Calculate dynamic bounding box to auto-center the SVG spiral
  const xVals = []
  const yVals = []
  squares.forEach((sq) => {
    xVals.push(sq.x, sq.x + sq.size)
    yVals.push(sq.y, sq.y + sq.size)
  })

  const minX = Math.min(...xVals)
  const maxX = Math.max(...xVals)
  const minY = Math.min(...yVals)
  const maxY = Math.max(...yVals)

  const w = maxX - minX
  const h = maxY - minY
  const pad = Math.max(w, h) * 0.1 || 2

  const viewBox = `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`
  return { squares, viewBox }
}

// Helper to layout recursion tree nodes and links symmetrically
const computeTreeLayout = (n, width = 800, height = 350) => {
  const nodes = []
  const links = []
  const maxDepth = n
  const levelHeight = height / (maxDepth + 1 || 1)

  function layoutNode(valN, path = 'root', depth = 0, xMin = 0, xMax = width) {
    const x = (xMin + xMax) / 2
    const y = 40 + depth * levelHeight

    const node = {
      id: path,
      n: valN,
      x,
      y,
    }
    nodes.push(node)

    if (valN > 1) {
      const leftPath = path + '-L'
      const rightPath = path + '-R'

      const leftChild = layoutNode(valN - 1, leftPath, depth + 1, xMin, x)
      const rightChild = layoutNode(valN - 2, rightPath, depth + 1, x, xMax)

      links.push({
        id: `${path}->${leftPath}`,
        source: { x, y },
        target: { x: leftChild.x, y: leftChild.y },
        childId: leftPath,
      })

      links.push({
        id: `${path}->${rightPath}`,
        source: { x, y },
        target: { x: rightChild.x, y: rightChild.y },
        childId: rightPath,
      })
    }

    return node
  }

  layoutNode(n)
  return { nodes, links }
}

export const CanvasFibonacci = ({ currentStep, inputLimit }) => {
  const [mode, setMode] = useState('spiral') // 'spiral' or 'tree'
  const n = inputLimit ?? 6

  // Extract variables from the current execution step
  const activePath = currentStep?.activePath || null
  const spiralCount = currentStep?.spiralCount ?? 0
  const message = currentStep?.message ?? 'Enter limit and click Visualize.'

  // Memoize treeState so downstream useMemo hooks get a stable reference
  const treeState = useMemo(() => currentStep?.treeState || {}, [currentStep])

  // Dynamic values for the statistics panel
  const activeNode = useMemo(() => {
    if (!activePath || !treeState[activePath]) return null
    return treeState[activePath]
  }, [activePath, treeState])

  const activeStackSize = useMemo(() => {
    return Object.values(treeState).filter((node) => node.state === 'active')
      .length
  }, [treeState])

  const latestValComputed = useMemo(() => {
    if (currentStep?.variables?.result !== undefined) {
      return currentStep.variables.result
    }
    // Find the max value resolved so far in tree
    const resolvedNodes = Object.values(treeState)
      .filter((node) => node.state === 'resolved' && node.val !== null)
      .map((node) => node.val)
    if (resolvedNodes.length === 0) return '—'
    return Math.max(...resolvedNodes)
  }, [currentStep, treeState])

  // Spiral geometry calculations
  const { squares, viewBox } = useMemo(() => {
    const count = Math.max(1, spiralCount)
    return getSpiralSquares(count)
  }, [spiralCount])

  // Tree layout calculations
  const { nodes: treeNodes, links: treeLinks } = useMemo(() => {
    return computeTreeLayout(n)
  }, [n])

  // Helper to color tree nodes
  const getNodeColors = (state) => {
    if (state === 'active') {
      return {
        circle: 'fill-purple-600 stroke-purple-400 stroke-2',
        text: 'fill-white',
        shadow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.85)]',
      }
    }
    if (state === 'resolved') {
      return {
        circle: 'fill-emerald-950 stroke-emerald-500 stroke-2',
        text: 'fill-emerald-400',
        shadow: 'drop-shadow-[0_0_4px_rgba(16,185,129,0.35)]',
      }
    }
    return {
      circle: 'fill-slate-900/90 stroke-slate-700 stroke',
      text: 'fill-slate-500',
      shadow: '',
    }
  }

  // Helper to color tree connection links
  const getLinkColors = (childId) => {
    const childState = treeState[childId]?.state ?? 'inactive'
    if (childState === 'active') {
      return 'stroke-purple-500 stroke-2 opacity-100'
    }
    if (childState === 'resolved') {
      return 'stroke-emerald-600 stroke-[1.5px] opacity-80'
    }
    return 'stroke-slate-800 stroke-[1px] opacity-35'
  }

  // Dynamic node sizing depending on depth/size of recursion tree
  const nodeRadius = n > 7 ? 12 : n > 5 ? 15 : 18

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-lg min-h-[420px] flex flex-col justify-between gap-6 backdrop-blur-sm">
        {/* Toggle Mode Bar */}
        <div className="flex justify-center border-b border-white/5 pb-4">
          <div className="flex bg-slate-950/70 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setMode('spiral')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 uppercase ${
                mode === 'spiral'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              🌀 Golden Spiral
            </button>
            <button
              onClick={() => setMode('tree')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 uppercase ${
                mode === 'tree'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              🌳 Recursion Tree
            </button>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {mode === 'spiral' ? (
              <motion.div
                key="spiral-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <div className="w-full max-w-lg aspect-square">
                  <svg
                    viewBox={viewBox}
                    className="w-full h-full overflow-visible"
                    style={{ transform: 'scaleY(-1)' }} // Invert Y axis to draw upwards standard layout
                  >
                    {/* Render squares */}
                    {squares.map((sq) => (
                      <g key={sq.k}>
                        <motion.rect
                          x={sq.x}
                          y={sq.y}
                          width={sq.size}
                          height={sq.size}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          stroke="rgba(6, 182, 212, 0.4)"
                          strokeWidth={sq.size * 0.015 || 0.05}
                          fill="rgba(6, 182, 212, 0.03)"
                        />
                        {/* Text representing the Fibonacci Number */}
                        <text
                          x={sq.x + sq.size / 2}
                          y={sq.y + sq.size / 2}
                          fontSize={sq.size * 0.22 || 0.8}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="rgba(6, 182, 212, 0.75)"
                          fontWeight="bold"
                          className="select-none font-mono"
                          transform={`scale(1, -1) translate(0, ${-2 * (sq.y + sq.size / 2)})`} // Invert text back so it is right-side-up
                        >
                          {F[sq.k]}
                        </text>
                        {/* Spiral quarter arc path */}
                        <motion.path
                          d={sq.path}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          stroke="#06b6d4"
                          strokeWidth={sq.size * 0.035 || 0.1}
                          strokeLinecap="round"
                          fill="none"
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tree-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="w-full overflow-x-auto overflow-y-hidden select-none">
                  <svg
                    viewBox="0 0 800 350"
                    className="w-full min-w-[700px] h-[350px]"
                  >
                    {/* Render connection branch lines */}
                    {treeLinks.map((link) => (
                      <line
                        key={link.id}
                        x1={link.source.x}
                        y1={link.source.y}
                        x2={link.target.x}
                        y2={link.target.y}
                        className={`transition-colors duration-300 ${getLinkColors(link.childId)}`}
                      />
                    ))}

                    {/* Render node circles */}
                    {treeNodes.map((node) => {
                      const stateNode = treeState[node.id] || {
                        state: 'inactive',
                        val: null,
                      }
                      const colors = getNodeColors(stateNode.state)

                      return (
                        <g key={node.id} className={colors.shadow}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={nodeRadius}
                            className={`transition-all duration-300 ${colors.circle}`}
                          />
                          {/* Inner identifier text */}
                          <text
                            x={node.x}
                            y={node.y}
                            fontSize={nodeRadius * 0.75}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={`font-bold transition-all duration-300 select-none ${colors.text}`}
                          >
                            {node.n}
                          </text>

                          {/* Computed node value overlay bubble */}
                          {stateNode.val !== null && (
                            <g>
                              <circle
                                cx={node.x + nodeRadius * 0.85}
                                cy={node.y - nodeRadius * 0.85}
                                r={nodeRadius * 0.65}
                                className="fill-emerald-500 stroke-emerald-300 stroke-[1.5px] shadow-lg"
                              />
                              <text
                                x={node.x + nodeRadius * 0.85}
                                y={node.y - nodeRadius * 0.85}
                                fontSize={nodeRadius * 0.6}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-black font-extrabold select-none font-mono"
                              >
                                {stateNode.val}
                              </text>
                            </g>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Statistics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
          <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/40 text-center backdrop-blur-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Current Function Call
            </p>
            <h2 className="text-2xl font-bold text-cyan-400 mt-2 font-mono">
              {activeNode ? `fib(${activeNode.n})` : '—'}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/40 text-center backdrop-blur-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Active Call Stack Depth
            </p>
            <h2 className="text-2xl font-bold text-purple-400 mt-2 font-mono">
              {activeStackSize}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/40 text-center backdrop-blur-sm">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Latest Computed Fibonacci
            </p>
            <h2 className="text-2xl font-bold text-emerald-400 mt-2 font-mono">
              {latestValComputed}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={message} />
      </div>
    </div>
  )
}
