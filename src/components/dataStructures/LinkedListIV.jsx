import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─────────────────────────────────────────────
// SINGLY LINKED LIST
// ─────────────────────────────────────────────
const SinglyLinkedList = () => {
  const [nodes, setNodes] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [message, setMessage] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const insertAtBeginning = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [{ id: Date.now(), val: inputVal.trim() }, ...prev])
    setMessage(`✅ Inserted "${inputVal}" at the beginning`)
    setInputVal('')
  }

  const insertAtEnd = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [...prev, { id: Date.now(), val: inputVal.trim() }])
    setMessage(`✅ Inserted "${inputVal}" at the end`)
    setInputVal('')
  }

  const deleteNode = () => {
    if (!inputVal.trim()) return
    const idx = nodes.findIndex((n) => n.val === inputVal.trim())
    if (idx === -1) {
      setMessage(`❌ "${inputVal}" not found in list`)
    } else {
      setNodes((prev) => prev.filter((_, i) => i !== idx))
      setMessage(`🗑️ Deleted "${inputVal}" from list`)
    }
    setInputVal('')
  }

  const searchNode = async () => {
    if (!inputVal.trim() || isSearching) return
    setIsSearching(true)
    setMessage(`🔍 Searching for "${inputVal}"...`)
    for (let i = 0; i < nodes.length; i++) {
      setHighlighted(nodes[i].id)
      await new Promise((r) => setTimeout(r, 600))
      if (nodes[i].val === inputVal.trim()) {
        setMessage(`✅ Found "${inputVal}" at position ${i + 1}`)
        setTimeout(() => setHighlighted(null), 1200)
        setIsSearching(false)
        setInputVal('')
        return
      }
    }
    setMessage(`❌ "${inputVal}" not found in list`)
    setHighlighted(null)
    setIsSearching(false)
    setInputVal('')
  }

  const clearList = () => {
    setNodes([])
    setMessage('')
    setHighlighted(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-slate-400 text-sm">
        Each node holds a <span className="text-cyan-400">value</span> and a{' '}
        <span className="text-cyan-400">next</span> pointer. Traversal is
        one-directional.
      </p>

      <Controls
        inputVal={inputVal}
        setInputVal={setInputVal}
        isSearching={isSearching}
        onInsertBeginning={insertAtBeginning}
        onInsertEnd={insertAtEnd}
        onDelete={deleteNode}
        onSearch={searchNode}
        onClear={clearList}
        nodesLength={nodes.length}
      />

      <Message message={message} />

      <div className="min-h-[120px] flex flex-wrap items-center gap-1 py-4">
        {nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <HeadLabel />
            <AnimatePresence>
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <NodeBox
                    val={node.val}
                    highlighted={highlighted === node.id}
                    pointer={idx < nodes.length - 1 ? '●→' : 'null'}
                    highlightColor="yellow"
                  />
                  {idx < nodes.length - 1 && <Arrow dir="→" color="cyan" />}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {nodes.length > 0 && (
        <Legend text={`📦 data | ●→ next pointer | null = end of list`} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// DOUBLY LINKED LIST
// ─────────────────────────────────────────────
const DoublyLinkedList = () => {
  const [nodes, setNodes] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [message, setMessage] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const insertAtBeginning = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [{ id: Date.now(), val: inputVal.trim() }, ...prev])
    setMessage(`✅ Inserted "${inputVal}" at the beginning`)
    setInputVal('')
  }

  const insertAtEnd = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [...prev, { id: Date.now(), val: inputVal.trim() }])
    setMessage(`✅ Inserted "${inputVal}" at the end`)
    setInputVal('')
  }

  const deleteNode = () => {
    if (!inputVal.trim()) return
    const idx = nodes.findIndex((n) => n.val === inputVal.trim())
    if (idx === -1) {
      setMessage(`❌ "${inputVal}" not found in list`)
    } else {
      setNodes((prev) => prev.filter((_, i) => i !== idx))
      setMessage(`🗑️ Deleted "${inputVal}" from list`)
    }
    setInputVal('')
  }

  const searchNode = async () => {
    if (!inputVal.trim() || isSearching) return
    setIsSearching(true)
    setMessage(`🔍 Searching for "${inputVal}"...`)
    for (let i = 0; i < nodes.length; i++) {
      setHighlighted(nodes[i].id)
      await new Promise((r) => setTimeout(r, 600))
      if (nodes[i].val === inputVal.trim()) {
        setMessage(`✅ Found "${inputVal}" at position ${i + 1}`)
        setTimeout(() => setHighlighted(null), 1200)
        setIsSearching(false)
        setInputVal('')
        return
      }
    }
    setMessage(`❌ "${inputVal}" not found in list`)
    setHighlighted(null)
    setIsSearching(false)
    setInputVal('')
  }

  const clearList = () => {
    setNodes([])
    setMessage('')
    setHighlighted(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-slate-400 text-sm">
        Each node has both a <span className="text-purple-400">prev</span> and{' '}
        <span className="text-purple-400">next</span> pointer — traversal works
        in both directions.
      </p>

      <Controls
        inputVal={inputVal}
        setInputVal={setInputVal}
        isSearching={isSearching}
        onInsertBeginning={insertAtBeginning}
        onInsertEnd={insertAtEnd}
        onDelete={deleteNode}
        onSearch={searchNode}
        onClear={clearList}
        nodesLength={nodes.length}
        accentClass="cyan-700"
      />

      <Message message={message} />

      <div className="min-h-[120px] flex flex-wrap items-center gap-1 py-4">
        {nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <HeadLabel color="purple" />
            <AnimatePresence>
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  {/* Prev pointer cell */}
                  <div
                    className={`px-2 py-3 font-mono text-xs flex items-center rounded-l-lg border-2
                    ${
                      highlighted === node.id
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                        : 'bg-slate-700 border-slate-600 text-slate-400'
                    }`}
                  >
                    {idx > 0 ? '←●' : 'null'}
                  </div>

                  {/* Data cell */}
                  <div
                    className={`px-4 py-3 bg-slate-800 font-mono font-bold text-base min-w-[48px] text-center border-y-2 transition-all duration-300
                    ${
                      highlighted === node.id
                        ? 'border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.6)] text-purple-200'
                        : 'border-purple-700/60 text-white'
                    }`}
                  >
                    {node.val}
                  </div>

                  {/* Next pointer cell */}
                  <div
                    className={`px-2 py-3 font-mono text-xs flex items-center rounded-r-lg border-2
                    ${
                      highlighted === node.id
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                        : 'bg-slate-700 border-slate-600 text-slate-400'
                    }`}
                  >
                    {idx < nodes.length - 1 ? '●→' : 'null'}
                  </div>

                  {idx < nodes.length - 1 && (
                    <div className="flex flex-col items-center mx-1 gap-0.5">
                      <Arrow dir="→" color="purple" />
                      <Arrow dir="←" color="purple" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {nodes.length > 0 && (
        <Legend
          text={`←● prev pointer | 📦 data | ●→ next pointer | null = boundary`}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// CIRCULAR LINKED LIST
// ─────────────────────────────────────────────
const CircularLinkedList = () => {
  const [nodes, setNodes] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [message, setMessage] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const insertAtBeginning = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [{ id: Date.now(), val: inputVal.trim() }, ...prev])
    setMessage(`✅ Inserted "${inputVal}" at the beginning`)
    setInputVal('')
  }

  const insertAtEnd = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [...prev, { id: Date.now(), val: inputVal.trim() }])
    setMessage(`✅ Inserted "${inputVal}" at the end`)
    setInputVal('')
  }

  const deleteNode = () => {
    if (!inputVal.trim()) return
    const idx = nodes.findIndex((n) => n.val === inputVal.trim())
    if (idx === -1) {
      setMessage(`❌ "${inputVal}" not found in list`)
    } else {
      setNodes((prev) => prev.filter((_, i) => i !== idx))
      setMessage(`🗑️ Deleted "${inputVal}" from list`)
    }
    setInputVal('')
  }

  const searchNode = async () => {
    if (!inputVal.trim() || isSearching) return
    setIsSearching(true)
    setMessage(`🔍 Searching for "${inputVal}"...`)
    for (let i = 0; i < nodes.length; i++) {
      setHighlighted(nodes[i].id)
      await new Promise((r) => setTimeout(r, 600))
      if (nodes[i].val === inputVal.trim()) {
        setMessage(`✅ Found "${inputVal}" at position ${i + 1}`)
        setTimeout(() => setHighlighted(null), 1200)
        setIsSearching(false)
        setInputVal('')
        return
      }
    }
    setMessage(`❌ "${inputVal}" not found in list`)
    setHighlighted(null)
    setIsSearching(false)
    setInputVal('')
  }

  const clearList = () => {
    setNodes([])
    setMessage('')
    setHighlighted(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-slate-400 text-sm">
        The <span className="text-green-400">tail&apos;s next pointer</span>{' '}
        points back to the <span className="text-green-400">head</span> —
        forming a circle with no null end.
      </p>

      <Controls
        inputVal={inputVal}
        setInputVal={setInputVal}
        isSearching={isSearching}
        onInsertBeginning={insertAtBeginning}
        onInsertEnd={insertAtEnd}
        onDelete={deleteNode}
        onSearch={searchNode}
        onClear={clearList}
        nodesLength={nodes.length}
      />

      <Message message={message} />

      <div className="min-h-[120px] flex flex-wrap items-center gap-1 py-4">
        {nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <HeadLabel color="green" />
            <AnimatePresence>
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <div
                    className={`flex rounded-lg border-2 overflow-hidden transition-all duration-300
                    ${
                      highlighted === node.id
                        ? 'border-green-400 shadow-[0_0_18px_rgba(74,222,128,0.6)]'
                        : 'border-green-700/60'
                    }`}
                  >
                    <div className="px-4 py-3 bg-slate-800 font-mono font-bold text-base min-w-[48px] text-center">
                      {node.val}
                    </div>
                    <div
                      className={`px-3 py-3 font-mono text-xs flex items-center border-l
                      ${
                        highlighted === node.id
                          ? 'bg-green-950/40 border-green-700 text-green-300'
                          : 'bg-slate-700 border-slate-600 text-slate-400'
                      }`}
                    >
                      ●→
                    </div>
                  </div>

                  {idx < nodes.length - 1 ? (
                    <Arrow dir="→" color="green" />
                  ) : (
                    <div className="flex items-center gap-1 ml-1">
                      <Arrow dir="→" color="green" />
                      <span className="text-green-400 text-xs font-mono bg-green-950/40 border border-green-700/50 px-2 py-1 rounded">
                        ↩ HEAD
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {nodes.length > 0 && (
        <Legend
          text={`📦 data | ●→ next pointer | ↩ HEAD = circles back to start`}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// CIRCULAR DOUBLY LINKED LIST
// ─────────────────────────────────────────────
const CircularDoublyLinkedList = () => {
  const [nodes, setNodes] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [message, setMessage] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const insertAtBeginning = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [{ id: Date.now(), val: inputVal.trim() }, ...prev])
    setMessage(`✅ Inserted "${inputVal}" at the beginning`)
    setInputVal('')
  }

  const insertAtEnd = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [...prev, { id: Date.now(), val: inputVal.trim() }])
    setMessage(`✅ Inserted "${inputVal}" at the end`)
    setInputVal('')
  }

  const deleteNode = () => {
    if (!inputVal.trim()) return
    const idx = nodes.findIndex((n) => n.val === inputVal.trim())
    if (idx === -1) {
      setMessage(`❌ "${inputVal}" not found in list`)
    } else {
      setNodes((prev) => prev.filter((_, i) => i !== idx))
      setMessage(`🗑️ Deleted "${inputVal}" from list`)
    }
    setInputVal('')
  }

  const searchNode = async () => {
    if (!inputVal.trim() || isSearching) return
    setIsSearching(true)
    setMessage(`🔍 Searching for "${inputVal}"...`)
    for (let i = 0; i < nodes.length; i++) {
      setHighlighted(nodes[i].id)
      await new Promise((r) => setTimeout(r, 600))
      if (nodes[i].val === inputVal.trim()) {
        setMessage(`✅ Found "${inputVal}" at position ${i + 1}`)
        setTimeout(() => setHighlighted(null), 1200)
        setIsSearching(false)
        setInputVal('')
        return
      }
    }
    setMessage(`❌ "${inputVal}" not found in list`)
    setHighlighted(null)
    setIsSearching(false)
    setInputVal('')
  }

  const clearList = () => {
    setNodes([])
    setMessage('')
    setHighlighted(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-slate-400 text-sm">
        Combines doubly and circular —{' '}
        <span className="text-orange-400">prev & next</span> pointers, and tail
        connects back to head (and head&apos;s prev to tail).
      </p>

      <Controls
        inputVal={inputVal}
        setInputVal={setInputVal}
        isSearching={isSearching}
        onInsertBeginning={insertAtBeginning}
        onInsertEnd={insertAtEnd}
        onDelete={deleteNode}
        onSearch={searchNode}
        onClear={clearList}
        nodesLength={nodes.length}
      />

      <Message message={message} />

      <div className="min-h-[120px] flex flex-wrap items-center gap-1 py-4">
        {nodes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* HEAD's prev points to TAIL */}
            <span className="text-orange-400 text-xs font-mono bg-orange-950/40 border border-orange-700/50 px-2 py-1 rounded mr-1">
              TAIL ↩
            </span>
            <Arrow dir="←" color="orange" />

            <HeadLabel color="orange" />
            <AnimatePresence>
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  {/* Prev pointer */}
                  <div
                    className={`px-2 py-3 font-mono text-xs flex items-center rounded-l-lg border-2 transition-all duration-300
                    ${
                      highlighted === node.id
                        ? 'bg-orange-950/40 border-orange-400 text-orange-300'
                        : 'bg-slate-700 border-slate-600 text-slate-400'
                    }`}
                  >
                    ←●
                  </div>

                  {/* Data */}
                  <div
                    className={`px-4 py-3 bg-slate-800 font-mono font-bold text-base min-w-[48px] text-center border-y-2 transition-all duration-300
                    ${
                      highlighted === node.id
                        ? 'border-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.6)] text-orange-200'
                        : 'border-orange-700/60 text-white'
                    }`}
                  >
                    {node.val}
                  </div>

                  {/* Next pointer */}
                  <div
                    className={`px-2 py-3 font-mono text-xs flex items-center rounded-r-lg border-2 transition-all duration-300
                    ${
                      highlighted === node.id
                        ? 'bg-orange-950/40 border-orange-400 text-orange-300'
                        : 'bg-slate-700 border-slate-600 text-slate-400'
                    }`}
                  >
                    ●→
                  </div>

                  {idx < nodes.length - 1 ? (
                    <div className="flex flex-col items-center mx-1 gap-0.5">
                      <Arrow dir="→" color="orange" />
                      <Arrow dir="←" color="orange" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 ml-1">
                      <Arrow dir="→" color="orange" />
                      <span className="text-orange-400 text-xs font-mono bg-orange-950/40 border border-orange-700/50 px-2 py-1 rounded">
                        ↩ HEAD
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {nodes.length > 0 && (
        <Legend
          text={`←● prev | 📦 data | ●→ next | ↩ HEAD / TAIL ↩ = circular connections`}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// SHARED SUBCOMPONENTS
// ─────────────────────────────────────────────

const colorMap = {
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-700/60',
    shadow: 'shadow-[0_0_18px_rgba(34,211,238,0.6)]',
    hlBorder: 'border-cyan-400',
    hlBg: 'bg-cyan-950/40',
    hlText: 'text-cyan-300',
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-700/60',
    shadow: 'shadow-[0_0_18px_rgba(168,85,247,0.6)]',
    hlBorder: 'border-purple-400',
    hlBg: 'bg-purple-950/40',
    hlText: 'text-purple-300',
  },
  green: {
    text: 'text-green-400',
    border: 'border-green-700/60',
    shadow: 'shadow-[0_0_18px_rgba(74,222,128,0.6)]',
    hlBorder: 'border-green-400',
    hlBg: 'bg-green-950/40',
    hlText: 'text-green-300',
  },
  orange: {
    text: 'text-orange-400',
    border: 'border-orange-700/60',
    shadow: 'shadow-[0_0_18px_rgba(251,146,60,0.6)]',
    hlBorder: 'border-orange-400',
    hlBg: 'bg-orange-950/40',
    hlText: 'text-orange-300',
  },
  yellow: {
    text: 'text-yellow-400',
    border: 'border-cyan-700/60',
    shadow: 'shadow-[0_0_18px_rgba(234,179,8,0.6)]',
    hlBorder: 'border-yellow-400',
    hlBg: 'bg-yellow-950/40',
    hlText: 'text-yellow-300',
  },
}

const NodeBox = ({ val, highlighted, pointer, highlightColor = 'yellow' }) => {
  const c = colorMap[highlightColor]
  return (
    <div
      className={`flex rounded-lg border-2 overflow-hidden transition-all duration-300
      ${highlighted ? `${c.hlBorder} ${c.shadow}` : c.border}`}
    >
      <div className="px-4 py-3 bg-slate-800 font-mono font-bold text-base min-w-[48px] text-center">
        {val}
      </div>
      <div
        className={`px-3 py-3 font-mono text-xs flex items-center border-l
        ${highlighted ? `${c.hlBg} border-yellow-700 ${c.hlText}` : 'bg-slate-700 border-slate-600 text-slate-400'}`}
      >
        {pointer}
      </div>
    </div>
  )
}

const Arrow = ({ dir, color = 'cyan' }) => {
  const c = colorMap[color]
  return (
    <motion.span
      className={`${c.text} text-lg font-bold`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {dir}
    </motion.span>
  )
}

const HeadLabel = ({ color = 'cyan' }) => {
  const c = colorMap[color]
  return (
    <div className="flex flex-col items-center mr-1">
      <span className={`text-xs ${c.text} font-mono mb-1`}>HEAD</span>
      <span className={`${c.text} text-lg`}>↓</span>
    </div>
  )
}

const EmptyState = () => (
  <p className="text-slate-500 italic text-sm">
    List is empty — insert a node to begin.
  </p>
)

const Message = ({ message }) => (
  <AnimatePresence mode="wait">
    {message && (
      <motion.p
        key={message}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-sm text-cyan-300 bg-cyan-950/50 border border-cyan-800/50 px-4 py-2 rounded-lg w-fit font-mono"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
)

const Legend = ({ text }) => (
  <div className="flex gap-4 text-xs text-slate-500 font-mono border-t border-slate-800 pt-3">
    <span>{text}</span>
  </div>
)

const Controls = ({
  inputVal,
  setInputVal,
  isSearching,
  onInsertBeginning,
  onInsertEnd,
  onDelete,
  onSearch,
  onClear,
  nodesLength,
}) => (
  <div className="flex flex-wrap gap-3 items-center">
    <input
      type="text"
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onInsertEnd()}
      placeholder="Enter value..."
      disabled={isSearching}
      className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600
                 text-white placeholder-slate-500 text-sm font-mono
                 focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
    />
    <button
      onClick={onInsertBeginning}
      disabled={isSearching}
      className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 rounded-lg text-sm font-mono transition-all"
    >
      Insert Beginning
    </button>
    <button
      onClick={onInsertEnd}
      disabled={isSearching}
      className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-sm font-mono transition-all"
    >
      Insert End
    </button>
    <button
      onClick={onDelete}
      disabled={isSearching}
      className="px-4 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 rounded-lg text-sm font-mono transition-all"
    >
      Delete
    </button>
    <button
      onClick={onSearch}
      disabled={isSearching || nodesLength === 0}
      className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 rounded-lg text-sm font-mono transition-all"
    >
      {isSearching ? 'Searching...' : 'Search'}
    </button>
    <button
      onClick={onClear}
      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-mono transition-all"
    >
      Clear
    </button>
  </div>
)

// ─────────────────────────────────────────────
// TAB DEFINITIONS
// ─────────────────────────────────────────────
const TABS = [
  { label: 'Singly', color: 'text-cyan-400', component: <SinglyLinkedList /> },
  {
    label: 'Doubly',
    color: 'text-purple-400',
    component: <DoublyLinkedList />,
  },
  {
    label: 'Circular',
    color: 'text-green-400',
    component: <CircularLinkedList />,
  },
  {
    label: 'Circular Doubly',
    color: 'text-orange-400',
    component: <CircularDoublyLinkedList />,
  },
]

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
const LinkedListIV = () => {
  const [activeTab, setActiveTab] = useState('Singly')
  const active = TABS.find((t) => t.label === activeTab)

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-cyan-400 font-mono">
          Linked List
        </h2>
        <p className="text-slate-400 text-sm">
          Visualize pointer traversal and node operations across all linked list
          types.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all
              ${
                activeTab === tab.label
                  ? `bg-slate-700 border-2 border-slate-500 ${tab.color}`
                  : 'bg-slate-800 border-2 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {active.component}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default LinkedListIV
