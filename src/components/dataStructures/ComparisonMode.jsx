import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Stack Demo ───────────────────────────────────────────────────────────────
function StackDemo() {
  const [stack, setStack] = useState([3, 7, 1])
  const [input, setInput] = useState('')
  const [lastOp, setLastOp] = useState(null)

  const push = () => {
    const val = parseInt(input, 10)
    if (isNaN(val) || stack.length >= 6) return
    setStack((s) => [...s, val])
    setLastOp(`Push ${val} → top`)
    setInput('')
  }

  const pop = () => {
    if (stack.length === 0) return
    const val = stack[stack.length - 1]
    setStack((s) => s.slice(0, -1))
    setLastOp(`Pop ${val} ← top`)
  }

  const peek = () => {
    if (stack.length === 0) return
    setLastOp(`Peek: top = ${stack[stack.length - 1]}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-end gap-1 py-4 min-h-[180px]">
        <p className="text-[9px] text-slate-500 mb-2">↑ TOP</p>
        {stack.length === 0 && (
          <p className="text-[10px] text-slate-600 italic">Empty stack</p>
        )}
        <AnimatePresence>
          {[...stack].reverse().map((val, i) => (
            <motion.div
              key={`${val}-${stack.length - i}`}
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="w-28 h-8 flex items-center justify-center rounded-lg font-mono text-sm font-bold border"
              style={{
                background:
                  i === 0 ? 'rgba(6,182,212,0.2)' : 'rgba(30,41,59,0.8)',
                borderColor: i === 0 ? '#06b6d4' : 'rgba(51,65,85,0.6)',
                color: i === 0 ? '#06b6d4' : '#94a3b8',
                boxShadow: i === 0 ? '0 0 10px rgba(6,182,212,0.2)' : 'none',
              }}
            >
              {val}
              {i === 0 && (
                <span className="ml-2 text-[8px] text-cyan-500">← TOP</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div
          className="w-28 h-0.5 mt-2"
          style={{ background: 'rgba(51,65,85,0.8)' }}
        />
        <p className="text-[9px] text-slate-600">BOTTOM</p>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-700/40">
        <div className="flex gap-1.5">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && push()}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            placeholder="Value…"
          />
          <button
            onClick={push}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 transition disabled:opacity-40"
            disabled={!input || stack.length >= 6}
          >
            Push
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={pop}
            disabled={stack.length === 0}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-40"
          >
            Pop
          </button>
          <button
            onClick={peek}
            disabled={stack.length === 0}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-40"
          >
            Peek
          </button>
        </div>
        {lastOp && (
          <p className="text-[10px] text-cyan-400 font-mono text-center">
            {lastOp}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Queue Demo ───────────────────────────────────────────────────────────────
function QueueDemo() {
  const [queue, setQueue] = useState([5, 2, 8])
  const [input, setInput] = useState('')
  const [lastOp, setLastOp] = useState(null)

  const enqueue = () => {
    const val = parseInt(input, 10)
    if (isNaN(val) || queue.length >= 6) return
    setQueue((q) => [...q, val])
    setLastOp(`Enqueue ${val} → rear`)
    setInput('')
  }

  const dequeue = () => {
    if (queue.length === 0) return
    const val = queue[0]
    setQueue((q) => q.slice(1))
    setLastOp(`Dequeue ${val} ← front`)
  }

  const peek = () => {
    if (queue.length === 0) return
    setLastOp(`Peek: front = ${queue[0]}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center min-h-[180px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-slate-500">FRONT →</span>
          <span className="text-[9px] text-slate-500">← REAR</span>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-center">
          <AnimatePresence>
            {queue.length === 0 && (
              <p className="text-[10px] text-slate-600 italic">Empty queue</p>
            )}
            {queue.map((val, i) => (
              <motion.div
                key={`${val}-${i}`}
                initial={{ opacity: 0, y: -12, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="w-10 h-10 flex flex-col items-center justify-center rounded-lg font-mono text-xs font-bold border"
                style={{
                  background:
                    i === 0
                      ? 'rgba(16,185,129,0.2)'
                      : i === queue.length - 1
                        ? 'rgba(245,158,11,0.2)'
                        : 'rgba(30,41,59,0.8)',
                  borderColor:
                    i === 0
                      ? '#10b981'
                      : i === queue.length - 1
                        ? '#f59e0b'
                        : 'rgba(51,65,85,0.6)',
                  color:
                    i === 0
                      ? '#10b981'
                      : i === queue.length - 1
                        ? '#f59e0b'
                        : '#94a3b8',
                }}
              >
                {val}
                <span
                  className="text-[6px] mt-0.5"
                  style={{ color: 'inherit', opacity: 0.7 }}
                >
                  {i === 0 ? 'F' : i === queue.length - 1 ? 'R' : ''}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex gap-3 mt-3 justify-center">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded"
              style={{ background: '#10b981' }}
            />
            <span className="text-[9px] text-slate-500">Front</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded"
              style={{ background: '#f59e0b' }}
            />
            <span className="text-[9px] text-slate-500">Rear</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-700/40">
        <div className="flex gap-1.5">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enqueue()}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            placeholder="Value…"
          />
          <button
            onClick={enqueue}
            className="px-2 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-40"
            disabled={!input || queue.length >= 6}
          >
            Enqueue
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={dequeue}
            disabled={queue.length === 0}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-40"
          >
            Dequeue
          </button>
          <button
            onClick={peek}
            disabled={queue.length === 0}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-40"
          >
            Peek
          </button>
        </div>
        {lastOp && (
          <p className="text-[10px] text-emerald-400 font-mono text-center">
            {lastOp}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── BST Demo ─────────────────────────────────────────────────────────────────
function BSTDemo() {
  const [nodes, setNodes] = useState([8, 4, 12, 2, 6, 10, 14])
  const [input, setInput] = useState('')
  const [searched, setSearched] = useState(null)
  const [lastOp, setLastOp] = useState(null)

  const insert = () => {
    const val = parseInt(input, 10)
    if (isNaN(val) || nodes.includes(val) || nodes.length >= 15) return
    setNodes((n) => [...n, val].sort((a, b) => a - b))
    setLastOp(`Insert ${val}`)
    setInput('')
    setSearched(null)
  }

  const search = () => {
    const val = parseInt(input, 10)
    if (isNaN(val)) return
    const found = nodes.includes(val)
    setSearched(val)
    setLastOp(found ? `Found ${val} ✓` : `${val} not in tree ✗`)
  }

  // Simple BST layout: compute positions
  function getPositions(values) {
    if (values.length === 0) return {}
    const sorted = [...values].sort((a, b) => a - b)
    const root = sorted[Math.floor(sorted.length / 2)]
    // BFS-style layout
    const pos = {}
    const assignPos = (val, x, y, arr) => {
      pos[val] = { x, y }
      const idx = arr.indexOf(val)
      const left = arr.slice(0, idx)
      const right = arr.slice(idx + 1)

      if (left.length > 0) {
        const lroot = left[Math.floor(left.length / 2)]
        assignPos(lroot, x - Math.max(25, 120 / (y / 30 + 1)), y + 50, left)
      }
      if (right.length > 0) {
        const rroot = right[Math.floor(right.length / 2)]
        assignPos(rroot, x + Math.max(25, 120 / (y / 30 + 1)), y + 50, right)
      }
    }

    assignPos(root, 180, 30, sorted)
    return pos
  }

  const pos = getPositions(nodes)
  const sorted = [...nodes].sort((a, b) => a - b)
  const root = sorted[Math.floor(sorted.length / 2)]

  // Get edges
  const getEdges = (val, arr) => {
    if (arr.length <= 1) return []
    const idx = arr.indexOf(val)
    const left = arr.slice(0, idx)
    const right = arr.slice(idx + 1)
    const edges = []
    if (left.length > 0) {
      const lroot = left[Math.floor(left.length / 2)]
      edges.push({ from: val, to: lroot })
      edges.push(...getEdges(lroot, left))
    }
    if (right.length > 0) {
      const rroot = right[Math.floor(right.length / 2)]
      edges.push({ from: val, to: rroot })
      edges.push(...getEdges(rroot, right))
    }
    return edges
  }

  const edges = getEdges(root, sorted)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[180px]">
        <svg viewBox="0 0 360 200" width="100%" style={{ maxHeight: '180px' }}>
          {edges.map((e, i) => {
            const f = pos[e.from],
              t = pos[e.to]
            if (!f || !t) return null
            return (
              <line
                key={i}
                x1={f.x}
                y1={f.y}
                x2={t.x}
                y2={t.y}
                stroke="rgba(51,65,85,0.6)"
                strokeWidth="1.5"
              />
            )
          })}
          {Object.entries(pos).map(([val, { x, y }]) => {
            const v = parseInt(val)
            const isRoot = v === root
            const isFound = searched === v
            return (
              <g key={val}>
                <circle
                  cx={x}
                  cy={y}
                  r={isRoot ? 14 : 11}
                  fill={
                    isFound
                      ? 'rgba(16,185,129,0.3)'
                      : isRoot
                        ? 'rgba(167,139,250,0.2)'
                        : 'rgba(30,41,59,0.9)'
                  }
                  stroke={
                    isFound
                      ? '#10b981'
                      : isRoot
                        ? '#a78bfa'
                        : 'rgba(51,65,85,0.8)'
                  }
                  strokeWidth={isFound || isRoot ? 2 : 1}
                  style={{
                    filter: isFound ? 'drop-shadow(0 0 6px #10b981)' : 'none',
                  }}
                />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isFound ? '#10b981' : isRoot ? '#a78bfa' : '#94a3b8'}
                  fontSize={9}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-700/40">
        <div className="flex gap-1.5">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && insert()}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            placeholder="Value…"
          />
          <button
            onClick={insert}
            disabled={!input || nodes.length >= 15}
            className="px-2 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition disabled:opacity-40"
          >
            Insert
          </button>
          <button
            onClick={search}
            disabled={!input}
            className="px-2 py-1.5 rounded-lg text-xs font-bold border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-40"
          >
            Find
          </button>
        </div>
        {lastOp && (
          <p
            className="text-[10px] font-mono text-center"
            style={{
              color:
                searched !== null && nodes.includes(searched)
                  ? '#10b981'
                  : '#a78bfa',
            }}
          >
            {lastOp}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const DS_META = [
  {
    key: 'stack',
    label: 'Stack',
    subtitle: 'LIFO — Last In, First Out',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.1)',
    accentBorder: 'rgba(6,182,212,0.3)',
    glow: 'rgba(6,182,212,0.3)',
    ops: [
      { op: 'Push', time: 'O(1)' },
      { op: 'Pop', time: 'O(1)' },
      { op: 'Peek', time: 'O(1)' },
      { op: 'Search', time: 'O(n)' },
    ],
    uses: ['Undo/redo', 'Call stack', 'Brackets', 'DFS'],
    component: StackDemo,
  },
  {
    key: 'queue',
    label: 'Queue',
    subtitle: 'FIFO — First In, First Out',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.1)',
    accentBorder: 'rgba(16,185,129,0.3)',
    glow: 'rgba(16,185,129,0.3)',
    ops: [
      { op: 'Enqueue', time: 'O(1)' },
      { op: 'Dequeue', time: 'O(1)' },
      { op: 'Peek', time: 'O(1)' },
      { op: 'Search', time: 'O(n)' },
    ],
    uses: ['BFS', 'Task scheduling', 'Print queue', 'Cache'],
    component: QueueDemo,
  },
  {
    key: 'bst',
    label: 'BST',
    subtitle: 'Binary Search Tree',
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.1)',
    accentBorder: 'rgba(167,139,250,0.3)',
    glow: 'rgba(167,139,250,0.3)',
    ops: [
      { op: 'Insert', time: 'O(log n)' },
      { op: 'Delete', time: 'O(log n)' },
      { op: 'Search', time: 'O(log n)' },
      { op: 'Traverse', time: 'O(n)' },
    ],
    uses: ['Sorted data', 'Range queries', 'Priority', 'DB indexes'],
    component: BSTDemo,
  },
]

function DSPanel({ meta }) {
  const Demo = meta.component

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(15,23,42,0.85)',
        border: `1px solid rgba(51,65,85,0.8)`,
      }}
      className="rounded-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-slate-700/50"
        style={{ background: meta.accentBg }}
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
            <p className="text-[9px] text-slate-400">{meta.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Demo */}
      <div className="px-4 py-3 flex-1">
        <Demo />
      </div>

      {/* Operations table */}
      <div className="px-4 pb-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5">
          Time Complexity
        </p>
        <div className="grid grid-cols-2 gap-1">
          {meta.ops.map(({ op, time }) => (
            <div
              key={op}
              className="flex items-center justify-between rounded px-2 py-1"
              style={{
                background: 'rgba(2,6,23,0.5)',
                border: '1px solid rgba(30,41,59,0.6)',
              }}
            >
              <span className="text-[9px] text-slate-400">{op}</span>
              <span
                className="font-mono text-[9px] font-bold"
                style={{ color: meta.accent }}
              >
                {time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div className="px-4 pb-4">
        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5">
          Common Uses
        </p>
        <div className="flex flex-wrap gap-1">
          {meta.uses.map((u) => (
            <span
              key={u}
              className="text-[9px] px-1.5 py-0.5 rounded font-medium"
              style={{
                background: meta.accentBg,
                color: meta.accent,
                border: `1px solid ${meta.accentBorder}`,
              }}
            >
              {u}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function DataStructuresComparison() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* Header */}
      <div
        className="rounded-2xl border border-slate-700/60 p-4"
        style={{ background: 'rgba(15,23,42,0.8)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400/80 mb-1">
          Interactive Comparison
        </p>
        <p className="text-xs text-slate-400">
          Explore Stack, Queue, and Binary Search Tree side by side. Interact
          with each to see how they behave differently.
        </p>
      </div>

      {/* Key comparison */}
      <div
        className="rounded-xl border border-slate-700/40 overflow-hidden"
        style={{ background: 'rgba(15,23,42,0.6)' }}
      >
        <div className="px-4 py-2 border-b border-slate-700/40">
          <p className="text-[9px] uppercase tracking-widest text-slate-500">
            At a Glance
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-700/40">
          {DS_META.map((m) => (
            <div key={m.key} className="px-3 py-2.5 space-y-1">
              <p className="text-[10px] font-bold" style={{ color: m.accent }}>
                {m.label}
              </p>
              <p className="text-[9px] text-slate-500">{m.subtitle}</p>
              <p className="text-[9px] text-slate-400">
                Search:{' '}
                <span className="font-mono font-bold text-slate-300">
                  {m.ops.find((o) => o.op === 'Search')?.time}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {DS_META.map((meta) => (
          <DSPanel key={meta.key} meta={meta} />
        ))}
      </div>

      <div
        className="rounded-xl px-4 py-3 text-xs text-slate-400 border border-slate-700/40"
        style={{ background: 'rgba(15,23,42,0.6)' }}
      >
        <strong className="text-slate-300">
          Choosing the right structure:
        </strong>{' '}
        Use a <span className="text-cyan-400">Stack</span> when order is LIFO
        (undo, recursion). Use a <span className="text-emerald-400">Queue</span>{' '}
        for FIFO scenarios (BFS, scheduling). Use a{' '}
        <span className="text-purple-400">BST</span> when you need fast ordered
        search — it beats both for lookups on sorted data at O(log n) vs O(n).
      </div>
    </div>
  )
}
