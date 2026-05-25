import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Tree Logic ---

class TreeNode {
  constructor(value) {
    this.value = value
    this.id = Date.now() + Math.random()
    this.left = null
    this.right = null
    this.x = 0
    this.y = 0
  }
}

const insertNode = (root, value) => {
  if (!root) return new TreeNode(value)
  if (value < root.value) {
    root.left = insertNode(root.left, value)
  } else {
    root.right = insertNode(root.right, value)
  }
  return root
}

const findMin = (node) => {
  while (node.left) node = node.left
  return node
}

const deleteNode = (root, value) => {
  if (!root) return null

  if (value < root.value) {
    root.left = deleteNode(root.left, value)
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value)
  } else {
    // Node to delete found
    if (!root.left && !root.right) return null
    if (!root.left) return root.right
    if (!root.right) return root.left

    let temp = findMin(root.right)
    root.value = temp.value
    root.right = deleteNode(root.right, temp.value)
  }
  return root
}

const calculatePositions = (node, x, y, xOffset = 200) => {
  if (!node) return
  node.x = x
  node.y = y
  const nextOffset = Math.max(xOffset / 1.8, 30)
  calculatePositions(node.left, x - xOffset, y + 80, nextOffset)
  calculatePositions(node.right, x + xOffset, y + 80, nextOffset)
}

const getTreeNodesAndEdges = (root) => {
  const nodes = []
  const edges = []
  const traverse = (node, parent) => {
    if (!node) return
    nodes.push(node)
    if (parent) {
      edges.push({
        id: `${parent.id}-${node.id}`,
        x1: parent.x,
        y1: parent.y,
        x2: node.x,
        y2: node.y,
      })
    }
    traverse(node.left, node)
    traverse(node.right, node)
  }
  traverse(root, null)
  return { nodes, edges }
}

// Traversal Algorithms
const getInorder = (node, result = []) => {
  if (!node) return result
  getInorder(node.left, result)
  result.push(node)
  getInorder(node.right, result)
  return result
}

const getPreorder = (node, result = []) => {
  if (!node) return result
  result.push(node)
  getPreorder(node.left, result)
  getPreorder(node.right, result)
  return result
}

const getPostorder = (node, result = []) => {
  if (!node) return result
  getPostorder(node.left, result)
  getPostorder(node.right, result)
  result.push(node)
  return result
}

export default function TreeIV() {
  const [root, setRoot] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [message, setMessage] = useState('')
  const [highlightedNodeId, setHighlightedNodeId] = useState(null)
  const [traversalResult, setTraversalResult] = useState([])
  const [isTraversing, setIsTraversing] = useState(false)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const { nodes, edges } = React.useMemo(() => {
    if (!root) return { nodes: [], edges: [] }
    const centerX = dimensions.width / 2
    calculatePositions(root, centerX, 50, Math.min(centerX / 2, 150))
    return getTreeNodesAndEdges(root)
  }, [root, dimensions.width])

  const handleInsert = () => {
    if (isTraversing) return
    const val = parseInt(inputValue)
    if (isNaN(val)) return
    const newRoot = insertNode(root ? cloneTree(root) : null, val)
    setRoot(newRoot)
    setInputValue('')
    setMessage('')
    setTraversalResult([])
  }

  const handleDelete = () => {
    if (isTraversing) return
    const val = parseInt(inputValue)
    if (isNaN(val)) return
    if (!root) return

    const newRoot = deleteNode(cloneTree(root), val)
    setRoot(newRoot)
    setInputValue('')
    setMessage('')
    setTraversalResult([])
  }

  const handleRandom = () => {
    if (isTraversing) return
    let currentRoot = null
    const values = new Set()
    while (values.size < 7) {
      values.add(Math.floor(Math.random() * 100))
    }
    values.forEach((val) => {
      currentRoot = insertNode(currentRoot, val)
    })
    setRoot(currentRoot)
    setMessage('Generated Random Tree')
    setTraversalResult([])
  }

  const handleClear = () => {
    if (isTraversing) return
    setRoot(null)
    setInputValue('')
    setMessage('')
    setTraversalResult([])
    setHighlightedNodeId(null)
  }

  const runTraversal = (type) => {
    if (isTraversing || !root) return
    setIsTraversing(true)
    setTraversalResult([])
    setHighlightedNodeId(null)

    let sequence = []
    if (type === 'inorder') sequence = getInorder(root)
    if (type === 'preorder') sequence = getPreorder(root)
    if (type === 'postorder') sequence = getPostorder(root)

    let i = 0
    const interval = setInterval(() => {
      if (i >= sequence.length) {
        clearInterval(interval)
        setHighlightedNodeId(null)
        setIsTraversing(false)
        return
      }

      const node = sequence[i]
      setHighlightedNodeId(node.id)
      setTraversalResult((prev) => [...prev, node.value])
      i++
    }, 800)
  }

  const cloneTree = (node) => {
    if (!node) return null
    const newNode = new TreeNode(node.value)
    newNode.id = node.id
    newNode.left = cloneTree(node.left)
    newNode.right = cloneTree(node.right)
    return newNode
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-4 z-10 p-4 bg-slate-900/50 rounded-xl border border-white/5">
        {/* Row 1: Operations */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Val"
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors w-24"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleInsert()
              }
            }}
            disabled={isTraversing}
          />
          <button
            onClick={handleInsert}
            disabled={isTraversing}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Insert
          </button>
          <button
            onClick={handleDelete}
            disabled={isTraversing}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all active:scale-95"
          >
            Delete
          </button>
          <button
            onClick={handleRandom}
            disabled={isTraversing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            Random
          </button>
          <button
            onClick={handleClear}
            disabled={isTraversing}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all active:scale-95"
          >
            Clear
          </button>
        </div>

        {/* Row 2: Traversals */}
        <div className="flex flex-wrap gap-4 justify-center items-center border-t border-white/10 pt-4">
          <span className="text-slate-400 text-sm font-mono mr-2">
            Traversals:
          </span>
          <button
            onClick={() => runTraversal('inorder')}
            disabled={isTraversing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            Inorder
          </button>
          <button
            onClick={() => runTraversal('preorder')}
            disabled={isTraversing}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            Preorder
          </button>
          <button
            onClick={() => runTraversal('postorder')}
            disabled={isTraversing}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-pink-500/20 transition-all active:scale-95"
          >
            Postorder
          </button>
        </div>
      </div>

      {message && (
        <div className="text-center text-amber-400 text-sm mb-2 font-mono animate-pulse">
          {message}
        </div>
      )}

      {/* Traversal Result Display */}
      <div className="min-h-[40px] flex items-center justify-center gap-2 mb-4 px-4 flex-wrap">
        {traversalResult.length > 0 && (
          <>
            <span className="text-slate-400 text-sm font-mono">Result:</span>
            {traversalResult.map((val, idx) => (
              <motion.div
                key={`${val}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2 py-1 bg-slate-800 rounded text-cyan-300 font-mono text-sm border border-cyan-500/30"
              >
                {val}
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Visual Container */}
      <div
        className="flex-1 relative overflow-hidden bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/5 mx-4 mb-4 min-h-[500px]"
        ref={containerRef}
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            {edges.map((edge) => (
              <motion.line
                key={edge.id}
                initial={{ opacity: 0 }}
                animate={{
                  x1: edge.x1,
                  y1: edge.y1,
                  x2: edge.x2,
                  y2: edge.y2,
                  opacity: 1,
                }}
                transition={{ duration: 0.5 }}
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0, x: node.x - 20, y: node.y - 20 }}
              animate={{
                scale: highlightedNodeId === node.id ? 1.2 : 1,
                opacity: 1,
                x: node.x - 20,
                y: node.y - 20,
                backgroundColor: highlightedNodeId === node.id ? '#f59e0b' : '', // Amber for highlight
                borderColor: highlightedNodeId === node.id ? '#fbbf24' : '',
                boxShadow:
                  highlightedNodeId === node.id
                    ? '0 0 25px rgba(245, 158, 11, 0.6)'
                    : '0 0 15px rgba(6,182,212,0.4)',
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute w-10 h-10 flex items-center justify-center rounded-full border-2 text-white font-bold text-sm z-10 transition-colors duration-300
                        ${highlightedNodeId === node.id ? 'bg-amber-500 border-amber-300' : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-white/20'}
                    `}
            >
              {node.value}
            </motion.div>
          ))}
        </AnimatePresence>

        {!root && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 select-none">
            <div className="text-center">
              <p className="text-lg mb-2">Tree is Empty</p>
              <p className="text-xs opacity-50">Insert a value to start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
