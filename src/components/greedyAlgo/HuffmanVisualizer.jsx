import React, { useRef, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GreedyBlock from './GreedyBlock'

const calculatePositions = (node, x, y, dx) => {
  if (!node) return
  node.x = x
  node.y = y
  const childDx = Math.max(dx * 0.45, 12)
  calculatePositions(node.left, x - dx, y + 55, childDx)
  calculatePositions(node.right, x + dx, y + 55, childDx)
}

export default function HuffmanVisualizer({ currentStep }) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(containerRef.current.clientHeight, 420),
        })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const { nodes, edges, roots } = useMemo(() => {
    if (
      !currentStep ||
      !currentStep.forest ||
      currentStep.forest.length === 0
    ) {
      return { nodes: [], edges: [], roots: [] }
    }

    const rootsCopy = JSON.parse(JSON.stringify(currentStep.forest))
    const width = dimensions.width
    const allNodes = []
    const allEdges = []

    rootsCopy.forEach((root, index) => {
      const colWidth = width / rootsCopy.length
      const centerX = index * colWidth + colWidth / 2
      const initialDx = Math.max(colWidth / 4.2, 25)

      calculatePositions(root, centerX, 45, initialDx)

      const traverse = (node, parent) => {
        if (!node) return
        allNodes.push(node)
        if (parent) {
          allEdges.push({
            id: `${parent.id}-${node.id}`,
            x1: parent.x,
            y1: parent.y,
            x2: node.x,
            y2: node.y,
            bit: node.bit,
          })
        }
        traverse(node.left, node)
        traverse(node.right, node)
      }

      traverse(root, null)
    })

    return { nodes: allNodes, edges: allEdges, roots: rootsCopy }
  }, [currentStep, dimensions.width])

  const pickedIds = currentStep?.picked || []
  const newParentId = currentStep?.newParentId || null
  const isComplete = currentStep?.type === 'complete'
  const codes = currentStep?.codes || {}
  const freqTable = currentStep?.freqTable || []

  return (
    <div className="w-full space-y-6">
      {/* Forest Tree Canvas */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
          Priority Queue Forest (Subtrees)
        </h3>

        <div
          ref={containerRef}
          className="relative min-h-[350px] md:min-h-[420px] w-full rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden flex items-center justify-center"
        >
          {roots.length === 0 ? (
            <div className="text-slate-500 text-sm">
              Start searching to build the Huffman tree forest...
            </div>
          ) : (
            <>
              {/* SVG Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <g>
                  {edges.map((edge) => {
                    const isNewEdge =
                      newParentId && edge.id.includes(newParentId)

                    return (
                      <g key={edge.id}>
                        <motion.line
                          x1={edge.x1}
                          y1={edge.y1}
                          x2={edge.x2}
                          y2={edge.y2}
                          stroke={isNewEdge ? '#ec4899' : '#475569'}
                          strokeWidth={isNewEdge ? 3 : 2}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        {/* Edge Label (0 or 1) */}
                        <text
                          x={(edge.x1 + edge.x2) / 2}
                          y={(edge.y1 + edge.y2) / 2 - 4}
                          fill={isNewEdge ? '#f472b6' : '#94a3b8'}
                          className="text-xs font-mono font-bold select-none text-center"
                          textAnchor="middle"
                        >
                          {edge.bit}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>

              {/* Render Nodes */}
              <AnimatePresence>
                {nodes.map((node) => {
                  const isLeaf = node.char !== null
                  const isPicked = pickedIds.includes(node.id)
                  const isNewParent = newParentId === node.id

                  let borderClass = 'border-slate-600 bg-slate-800'
                  let textClass = 'text-slate-200'

                  if (isLeaf) {
                    borderClass =
                      'border-emerald-500/80 bg-emerald-500/10 hover:bg-emerald-500/25'
                    textClass = 'text-emerald-300'
                  } else {
                    borderClass = 'border-indigo-500/80 bg-indigo-500/10'
                    textClass = 'text-indigo-300'
                  }

                  if (isPicked) {
                    borderClass =
                      'border-yellow-400 bg-yellow-400/20 scale-115 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
                    textClass = 'text-yellow-200 font-bold'
                  }

                  if (isNewParent) {
                    borderClass =
                      'border-pink-500 bg-pink-500/20 scale-115 shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                    textClass = 'text-pink-300 font-bold'
                  }

                  return (
                    <motion.div
                      key={node.id}
                      style={{
                        position: 'absolute',
                        left: node.x - 22,
                        top: node.y - 22,
                        width: 44,
                        height: 44,
                      }}
                      className={`flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 z-10 cursor-default ${borderClass}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      title={
                        isLeaf
                          ? `Character: ${node.char}, Freq: ${node.freq}`
                          : `Sum Freq: ${node.freq}`
                      }
                    >
                      <span
                        className={`text-[11px] font-mono leading-none ${textClass}`}
                      >
                        {isLeaf ? (node.char === ' ' ? '␣' : node.char) : '∑'}
                      </span>
                      <span className="text-[12px] font-bold font-mono leading-none mt-0.5 text-slate-100">
                        {node.freq}
                      </span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Priority Queue (Forest State List) */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
          Priority Queue / Forest List
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {roots.map((root) => {
            const isPicked = pickedIds.includes(root.id)
            const isNewParent = newParentId === root.id

            let cardStyle = 'border-slate-800 bg-slate-950/60 text-slate-400'
            if (root.char !== null) {
              cardStyle =
                'border-emerald-950 bg-emerald-950/20 text-emerald-300'
            } else {
              cardStyle = 'border-indigo-950 bg-indigo-950/20 text-indigo-300'
            }

            if (isPicked) {
              cardStyle =
                'border-yellow-500 bg-yellow-500/10 text-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.2)]'
            }
            if (isNewParent) {
              cardStyle =
                'border-pink-500 bg-pink-500/10 text-pink-300 shadow-[0_0_8px_rgba(236,72,153,0.2)]'
            }

            return (
              <div
                key={root.id}
                className={`px-3.5 py-2 rounded-xl border font-mono text-sm flex items-center gap-2 transition-all ${cardStyle}`}
              >
                <span className="font-bold">
                  {root.char !== null
                    ? root.char === ' '
                      ? 'Space'
                      : `'${root.char}'`
                    : 'Merge'}
                </span>
                <span className="h-4 w-px bg-slate-700"></span>
                <span className="text-white font-bold">{root.freq}</span>
              </div>
            )
          })}
          {roots.length === 0 && (
            <div className="text-slate-500 text-sm py-1">
              Priority queue is empty.
            </div>
          )}
        </div>
      </div>
      <GreedyBlock title="Greedy Algorithm Summary">
        This visualizer demonstrates a greedy approach for building Huffman
        trees.
      </GreedyBlock>

      {/* Results details (Code Table and compression details) */}
      {isComplete && Object.keys(codes).length > 0 && (
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Code Table */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
              Huffman Codewords Table
            </h3>
            <div className="max-h-[200px] overflow-y-auto pr-1">
              <table className="w-full text-sm font-mono text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-2">Char</th>
                    <th className="pb-2">Freq</th>
                    <th className="pb-2">Codeword</th>
                  </tr>
                </thead>
                <tbody>
                  {freqTable.map((item) => (
                    <tr
                      key={item.char}
                      className="border-b border-slate-800/40 hover:bg-slate-800/20"
                    >
                      <td className="py-2 text-white font-bold">
                        {item.char === ' ' ? 'Space' : `'${item.char}'`}
                      </td>
                      <td className="py-2">{item.freq}</td>
                      <td className="py-2 text-cyan-400 font-bold">
                        {codes[item.char] || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compression Efficiency */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-3">
                Compression Performance
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      ASCII Encoding
                    </p>
                    <p className="text-lg font-bold font-mono text-slate-200 mt-1">
                      {freqTable.reduce((acc, curr) => acc + curr.freq, 0) * 8}{' '}
                      bits
                    </p>
                    <span className="text-[10px] text-slate-500">
                      (8 bits per char)
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Huffman Coding
                    </p>
                    <p className="text-lg font-bold font-mono text-emerald-400 mt-1">
                      {freqTable.reduce(
                        (acc, curr) =>
                          acc + curr.freq * (codes[curr.char] || '').length,
                        0
                      )}{' '}
                      bits
                    </p>
                    <span className="text-[10px] text-emerald-500">
                      (Variable length)
                    </span>
                  </div>
                </div>

                {/* Efficiency calculation */}
                {(() => {
                  const asciiBits =
                    freqTable.reduce((acc, curr) => acc + curr.freq, 0) * 8
                  const huffmanBits = freqTable.reduce(
                    (acc, curr) =>
                      acc + curr.freq * (codes[curr.char] || '').length,
                    0
                  )
                  const saving = (
                    ((asciiBits - huffmanBits) / asciiBits) *
                    100
                  ).toFixed(1)
                  return (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-emerald-300">
                          Space Saved
                        </p>
                        <p className="text-2xl font-black font-mono text-emerald-400">
                          {saving}%
                        </p>
                      </div>
                      <div className="text-xs text-slate-400 text-right max-w-[150px]">
                        Requires fewer bits for higher frequency characters!
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Greedy Summary Block */}
      <div className="mt-6">
        <GreedyBlock title="Greedy Algorithm Summary">
          This visualizer demonstrates a greedy approach for building Huffman
          trees.
        </GreedyBlock>
      </div>
    </div>
  )
}
