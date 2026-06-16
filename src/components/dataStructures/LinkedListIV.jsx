import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * LinkedListIV component — Interactive Singly Linked List visualizer.
 * Supports insert at beginning, insert at end, delete, and animated search.
 */
const LinkedListIV = () => {
  const [nodes, setNodes] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [message, setMessage] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  /** Inserts a new node at the beginning of the linked list. */
  const insertAtBeginning = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [{ id: Date.now(), val: inputVal.trim() }, ...prev])
    setMessage(`✅ Inserted "${inputVal}" at the beginning`)
    setInputVal('')
  }

  /** Inserts a new node at the end of the linked list. */
  const insertAtEnd = () => {
    if (!inputVal.trim()) return
    setNodes((prev) => [...prev, { id: Date.now(), val: inputVal.trim() }])
    setMessage(`✅ Inserted "${inputVal}" at the end`)
    setInputVal('')
  }

  /** Deletes the first node matching the input value. */
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

  /** Animates pointer traversal to search for a node by value. */
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

  /** Handles Enter key press to trigger insertAtEnd. */
  const handleKey = (e) => {
    if (e.key === 'Enter') insertAtEnd()
  }

  /** Clears all nodes and resets state. */
  const clearList = () => {
    setNodes([])
    setMessage('')
    setHighlighted(null)
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-cyan-400 font-mono">
          Singly Linked List
        </h2>
        <p className="text-slate-400 text-sm">
          Visualize pointer traversal and node operations in real time.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter value..."
          disabled={isSearching}
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600
                     text-white placeholder-slate-500 text-sm font-mono
                     focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
        />
        <button
          onClick={insertAtBeginning}
          disabled={isSearching}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50
                     rounded-lg text-sm font-mono transition-all"
        >
          Insert Beginning
        </button>
        <button
          onClick={insertAtEnd}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50
                     rounded-lg text-sm font-mono transition-all"
        >
          Insert End
        </button>
        <button
          onClick={deleteNode}
          disabled={isSearching}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-50
                     rounded-lg text-sm font-mono transition-all"
        >
          Delete
        </button>
        <button
          onClick={searchNode}
          disabled={isSearching || nodes.length === 0}
          className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50
                     rounded-lg text-sm font-mono transition-all"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        <button
          onClick={clearList}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600
                     rounded-lg text-sm font-mono transition-all"
        >
          Clear
        </button>
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-cyan-300 bg-cyan-950/50 border border-cyan-800/50
                       px-4 py-2 rounded-lg w-fit font-mono"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Visualization */}
      <div className="min-h-[120px] flex flex-wrap items-center gap-1 py-4">
        {nodes.length === 0 ? (
          <p className="text-slate-500 italic text-sm">
            List is empty — insert a node to begin.
          </p>
        ) : (
          <>
            {/* HEAD label */}
            <div className="flex flex-col items-center mr-1">
              <span className="text-xs text-cyan-400 font-mono mb-1">HEAD</span>
              <span className="text-cyan-400 text-lg">↓</span>
            </div>

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
                  {/* Node */}
                  <div
                    className={`flex rounded-lg border-2 overflow-hidden transition-all duration-300
                    ${
                      highlighted === node.id
                        ? 'border-yellow-400 shadow-[0_0_18px_rgba(234,179,8,0.6)]'
                        : 'border-cyan-700/60'
                    }`}
                  >
                    {/* Data cell */}
                    <div className="px-4 py-3 bg-slate-800 font-mono font-bold text-base min-w-[48px] text-center">
                      {node.val}
                    </div>
                    {/* Pointer cell */}
                    <div
                      className={`px-3 py-3 font-mono text-xs flex items-center border-l
                      ${
                        highlighted === node.id
                          ? 'bg-yellow-950/40 border-yellow-700 text-yellow-300'
                          : 'bg-slate-700 border-slate-600 text-slate-400'
                      }`}
                    >
                      {idx < nodes.length - 1 ? '●→' : 'null'}
                    </div>
                  </div>

                  {/* Arrow between nodes */}
                  {idx < nodes.length - 1 && (
                    <motion.span
                      className="text-cyan-500 text-xl font-bold mx-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      →
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Legend */}
      {nodes.length > 0 && (
        <div className="flex gap-4 text-xs text-slate-500 font-mono border-t border-slate-800 pt-3">
          <span>
            📦 data | <span className="text-slate-400">●→</span> next pointer |{' '}
            <span className="text-red-400">null</span> = end of list
          </span>
        </div>
      )}
    </div>
  )
}

export default LinkedListIV
