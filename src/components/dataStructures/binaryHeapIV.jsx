import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BinaryHeapIV() {
  const [heapType, setHeapType] = useState('max') // 'min' | 'max'
  const [heap, setHeap] = useState([95, 80, 60, 45, 50, 30, 20]) // default valid Max Heap
  const [inputValue, setInputValue] = useState('')
  const [steps, setSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 })
  const containerRef = useRef(null)
  const timerRef = useRef(null)

  // Track dimensions for tree layout
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.max(containerRef.current.clientHeight, 350),
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => {
      window.removeEventListener('resize', updateDimensions)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 1500)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, steps])

  // Get coordinates for complete binary tree nodes
  const nodePositions = useMemo(() => {
    const positions = []
    const width = dimensions.width
    const startY = 40
    const rowHeight = 75

    // Helper to calculate coordinates recursively
    const getCoords = (index) => {
      if (index >= heap.length) return

      // Determine level and position within level
      const level = Math.floor(Math.log2(index + 1))
      const levelNodesCount = Math.pow(2, level)
      const indexInLevel = index - (levelNodesCount - 1)

      // Calculate horizontal spacing
      const levelWidth = width
      const segmentWidth = levelWidth / levelNodesCount
      const x = segmentWidth * indexInLevel + segmentWidth / 2
      const y = startY + level * rowHeight

      positions[index] = { x, y }

      // Recurse children
      getCoords(2 * index + 1)
      getCoords(2 * index + 2)
    }

    if (heap.length > 0) {
      getCoords(0)
    }
    return positions
  }, [heap.length, dimensions.width])

  // Generate node connections (edges)
  const edges = useMemo(() => {
    const list = []
    for (let i = 0; i < heap.length; i++) {
      const leftChild = 2 * i + 1
      const rightChild = 2 * i + 2

      if (leftChild < heap.length && nodePositions[i] && nodePositions[leftChild]) {
        list.push({
          id: `edge-${i}-${leftChild}`,
          x1: nodePositions[i].x,
          y1: nodePositions[i].y,
          x2: nodePositions[leftChild].x,
          y2: nodePositions[leftChild].y,
        })
      }
      if (rightChild < heap.length && nodePositions[i] && nodePositions[rightChild]) {
        list.push({
          id: `edge-${i}-${rightChild}`,
          x1: nodePositions[i].x,
          y1: nodePositions[i].y,
          x2: nodePositions[rightChild].x,
          y2: nodePositions[rightChild].y,
        })
      }
    }
    return list
  }, [heap.length, nodePositions])

  // Helper to compare keys based on Heap Type
  const compare = (val1, val2) => {
    return heapType === 'max' ? val1 > val2 : val1 < val2
  }

  // Generate Step-by-Step Heapify-Up
  const startHeapifyUp = (arr, startIndex) => {
    const history = []
    const tempArr = [...arr]
    let current = startIndex

    history.push({
      array: [...tempArr],
      activeIndices: [current],
      comparedIndices: [],
      type: 'start-insert',
      message: `Inserted new node ${tempArr[current]} at the last index (${current}).`,
    })

    while (current > 0) {
      const parent = Math.floor((current - 1) / 2)
      
      history.push({
        array: [...tempArr],
        activeIndices: [current, parent],
        comparedIndices: [current, parent],
        type: 'compare',
        message: `Comparing node ${tempArr[current]} (index ${current}) with parent ${tempArr[parent]} (index ${parent}).`,
      })

      if (compare(tempArr[current], tempArr[parent])) {
        // Swap
        const temp = tempArr[current]
        tempArr[current] = tempArr[parent]
        tempArr[parent] = temp

        history.push({
          array: [...tempArr],
          activeIndices: [current, parent],
          comparedIndices: [current, parent],
          type: 'swap',
          message: `Violated ${heapType === 'max' ? 'Max-Heap (Parent < Child)' : 'Min-Heap (Parent > Child)'} property. Swapping node ${tempArr[parent]} and parent ${tempArr[current]}!`,
        })
        current = parent
      } else {
        history.push({
          array: [...tempArr],
          activeIndices: [current, parent],
          comparedIndices: [],
          type: 'satisfied',
          message: `Heap property satisfied. Node ${tempArr[current]} is ${heapType === 'max' ? 'less' : 'greater'} than or equal to its parent ${tempArr[parent]}.`,
        })
        break
      }
    }

    history.push({
      array: [...tempArr],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Heapify-Up complete! Successfully inserted node.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  // Generate Step-by-Step Heapify-Down
  const startHeapifyDown = (arr) => {
    if (arr.length === 0) return
    const history = []
    const tempArr = [...arr]
    const rootVal = tempArr[0]
    const lastIndex = tempArr.length - 1
    const lastVal = tempArr[lastIndex]

    history.push({
      array: [...tempArr],
      activeIndices: [0, lastIndex],
      comparedIndices: [],
      type: 'extract',
      message: `Extracting peak node (${rootVal}) at root (index 0). Swapping root with the last element (${lastVal}) and removing the last node.`,
    })

    // Perform swap and pop
    tempArr[0] = lastVal
    tempArr.pop()

    if (tempArr.length === 0) {
      history.push({
        array: [],
        activeIndices: [],
        comparedIndices: [],
        type: 'done',
        message: `Heap is now empty!`,
      })
      setSteps(history)
      setCurrentStepIndex(0)
      setIsPlaying(true)
      return
    }

    history.push({
      array: [...tempArr],
      activeIndices: [0],
      comparedIndices: [],
      type: 'start-heapify-down',
      message: `New element ${tempArr[0]} is now at root. Running Heapify-Down from root to restore the heap property.`,
    })

    let current = 0
    const size = tempArr.length

    while (2 * current + 1 < size) {
      const leftChild = 2 * current + 1
      const rightChild = 2 * current + 2
      let targetChild = leftChild

      // Compare left and right children to find candidate for swap
      if (rightChild < size) {
        history.push({
          array: [...tempArr],
          activeIndices: [leftChild, rightChild],
          comparedIndices: [leftChild, rightChild],
          type: 'compare-children',
          message: `Comparing left child ${tempArr[leftChild]} (index ${leftChild}) and right child ${tempArr[rightChild]} (index ${rightChild}) to find the ${heapType === 'max' ? 'larger' : 'smaller'} child.`,
        })

        if (compare(tempArr[rightChild], tempArr[leftChild])) {
          targetChild = rightChild
        }
      }

      history.push({
        array: [...tempArr],
        activeIndices: [current, targetChild],
        comparedIndices: [current, targetChild],
        type: 'compare',
        message: `Comparing parent ${tempArr[current]} (index ${current}) with ${heapType === 'max' ? 'larger' : 'smaller'} child ${tempArr[targetChild]} (index ${targetChild}).`,
      })

      if (compare(tempArr[targetChild], tempArr[current])) {
        // Swap
        const temp = tempArr[current]
        tempArr[current] = tempArr[targetChild]
        tempArr[targetChild] = temp

        history.push({
          array: [...tempArr],
          activeIndices: [current, targetChild],
          comparedIndices: [current, targetChild],
          type: 'swap',
          message: `Swapping parent ${tempArr[targetChild]} and child ${tempArr[current]} because child violates the heap property!`,
        })
        current = targetChild
      } else {
        history.push({
          array: [...tempArr],
          activeIndices: [current],
          comparedIndices: [],
          type: 'satisfied',
          message: `Heap property satisfied at node ${tempArr[current]}. No more swaps needed.`,
        })
        break
      }
    }

    history.push({
      array: [...tempArr],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Heapify-Down complete! Successfully extracted peak.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  // Insert Node Handler
  const handleInsert = () => {
    const val = parseInt(inputValue)
    if (isNaN(val)) return
    if (heap.length >= 15) {
      alert('Heap reached maximum visual capacity of 15 elements!')
      return
    }

    setIsPlaying(false)
    const newHeap = [...heap, val]
    startHeapifyUp(newHeap, newHeap.length - 1)
    setInputValue('')
  }

  // Extract Peak Handler
  const handleExtractPeak = () => {
    if (heap.length === 0) return
    setIsPlaying(false)
    startHeapifyDown(heap)
  }

  // Toggle Heap Type Min/Max (automatically rebuilds the heap)
  const toggleHeapType = () => {
    setIsPlaying(false)
    const newType = heapType === 'max' ? 'min' : 'max'
    setHeapType(newType)

    // Rebuild Heap from scratch
    const history = []
    const tempArr = [...heap]
    const size = tempArr.length

    history.push({
      array: [...tempArr],
      activeIndices: [],
      comparedIndices: [],
      type: 'rebuild-start',
      message: `Converting to ${newType === 'max' ? 'Max-Heap' : 'Min-Heap'}. We will rebuild the heap step-by-step from leaf nodes up.`,
    })

    // Standard Build Heap algorithm (Heapify-down starting from last non-leaf node)
    const heapifyDownLocal = (arr, i, length) => {
      let current = i
      while (2 * current + 1 < length) {
        let leftChild = 2 * current + 1
        let rightChild = 2 * current + 2
        let targetChild = leftChild

        if (rightChild < length) {
          const compVal1 = arr[rightChild]
          const compVal2 = arr[leftChild]
          const rightWins = newType === 'max' ? compVal1 > compVal2 : compVal1 < compVal2
          if (rightWins) targetChild = rightChild
        }

        const childVal = arr[targetChild]
        const parentVal = arr[current]
        const shouldSwap = newType === 'max' ? childVal > parentVal : childVal < parentVal

        if (shouldSwap) {
          arr[targetChild] = parentVal
          arr[current] = childVal
          history.push({
            array: [...arr],
            activeIndices: [current, targetChild],
            comparedIndices: [current, targetChild],
            type: 'swap',
            message: `Rebuilding: Swapped node ${parentVal} (index ${current}) and child ${childVal} (index ${targetChild}) during heapify.`,
          })
          current = targetChild
        } else {
          break
        }
      }
    }

    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
      heapifyDownLocal(tempArr, i, size)
    }

    history.push({
      array: [...tempArr],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Rebuild complete! Valid ${newType === 'max' ? 'Max-Heap' : 'Min-Heap'} successfully established.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  // Randomize Heap
  const handleRandomize = () => {
    setIsPlaying(false)
    const newSize = Math.floor(Math.random() * 6) + 6 // 6 to 11 nodes
    const values = []
    for (let i = 0; i < newSize; i++) {
      values.push(Math.floor(Math.random() * 90) + 10) // 10 to 99
    }

    // Build valid Heap
    const rebuild = (arr) => {
      const temp = [...arr]
      const size = temp.length
      const heapify = (subArr, idx, len) => {
        let curr = idx
        while (2 * curr + 1 < len) {
          let left = 2 * curr + 1
          let right = 2 * curr + 2
          let target = left
          if (right < len) {
            const rightWins = heapType === 'max' ? subArr[right] > subArr[left] : subArr[right] < subArr[left]
            if (rightWins) target = right
          }
          const shouldSwap = heapType === 'max' ? subArr[target] > subArr[curr] : subArr[target] < subArr[curr]
          if (shouldSwap) {
            const swapVal = subArr[curr]
            subArr[curr] = subArr[target]
            subArr[target] = swapVal
            curr = target
          } else {
            break
          }
        }
      }
      for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
        heapify(temp, i, size)
      }
      return temp
    }

    const validHeap = rebuild(values)
    setHeap(validHeap)
    setSteps([])
    setCurrentStepIndex(-1)
  }

  // Clear Heap
  const handleClear = () => {
    setIsPlaying(false)
    setHeap([])
    setSteps([])
    setCurrentStepIndex(-1)
  }

  // Apply step changes to actual heap state
  const activeStep = steps[currentStepIndex]
  const currentHeap = activeStep ? activeStep.array : heap
  const activeIndices = activeStep ? activeStep.activeIndices : []
  const comparedIndices = activeStep ? activeStep.comparedIndices : []

  // Update current heap state when step completes/done
  useEffect(() => {
    if (activeStep && (currentStepIndex === steps.length - 1 || !isPlaying)) {
      setHeap(activeStep.array)
    }
  }, [currentStepIndex, activeStep, isPlaying, steps.length])

  // Stepper controls
  const stepBackward = () => {
    setIsPlaying(false)
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const stepForward = () => {
    setIsPlaying(false)
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  return (
    <div className="flex flex-col h-full w-full select-none">
      {/* Top Header Controls Panel */}
      <div className="flex flex-col gap-4 mb-5 z-10 p-4 bg-slate-900/60 rounded-xl border border-slate-800 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Operations group */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors w-24 text-sm font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            />
            <button
              onClick={handleInsert}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg text-sm shadow-md shadow-cyan-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Insert
            </button>
            <button
              onClick={handleExtractPeak}
              disabled={heap.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-lg text-sm shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Extract {heapType === 'max' ? 'Max' : 'Min'}
            </button>
          </div>

          {/* Toggle and Generation */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Min / Max Toggle Switch */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
              <span className={`text-xs font-bold font-mono tracking-wider ${heapType === 'min' ? 'text-cyan-400' : 'text-slate-500'}`}>MIN</span>
              <button
                onClick={toggleHeapType}
                className="w-12 h-6 bg-slate-800 rounded-full p-1 transition-colors relative focus:outline-none border border-slate-700"
              >
                <motion.div
                  layout
                  className="w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  animate={{ x: heapType === 'max' ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-xs font-bold font-mono tracking-wider ${heapType === 'max' ? 'text-cyan-400' : 'text-slate-500'}`}>MAX</span>
            </div>

            <button
              onClick={handleRandomize}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg text-sm transition-all active:scale-95"
            >
              Randomize
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 font-bold rounded-lg text-sm transition-all border border-slate-800 hover:border-red-900/35 active:scale-95"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Stepper Controls Overlay */}
        {steps.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-800/80 pt-3 mt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={stepBackward}
                disabled={currentStepIndex <= 0}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/70 rounded-lg text-slate-300 disabled:opacity-40 transition"
                title="Step Backward"
              >
                ⏮️
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider transition ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
              </button>
              <button
                onClick={stepForward}
                disabled={currentStepIndex >= steps.length - 1}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/70 rounded-lg text-slate-300 disabled:opacity-40 transition"
                title="Step Forward"
              >
                ⏭️
              </button>
            </div>

            {/* Stepper Logger message */}
            <div className="flex-1 min-w-[280px] bg-slate-950/70 border border-slate-850/60 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono text-cyan-300/90 shadow-inner flex items-center gap-3">
              <span className="font-bold text-slate-500 shrink-0">
                [{currentStepIndex + 1}/{steps.length}]
              </span>
              <span className="leading-relaxed">
                {activeStep?.message || 'Ready'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Dual-Representation Canvas */}
      <div className="flex-1 grid grid-rows-[1fr_auto] gap-5 min-h-[500px]">
        {/* Top Half: Tree representation using deterministic SVG */}
        <div
          ref={containerRef}
          className="relative bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl flex-1 overflow-hidden min-h-[300px]"
        >
          {/* Background Neon Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
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
                stroke="url(#edgeGrad)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            ))}
          </svg>

          {/* Tree Nodes */}
          <AnimatePresence>
            {currentHeap.map((val, idx) => {
              const pos = nodePositions[idx]
              if (!pos) return null

              const isActive = activeIndices.includes(idx)
              const isCompared = comparedIndices.includes(idx)

              // Determine color class
              let colorClasses = 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/80 text-slate-100'
              if (isCompared) {
                colorClasses = 'bg-gradient-to-br from-amber-600 to-amber-700 border-amber-400 text-white'
              } else if (isActive) {
                colorClasses = 'bg-gradient-to-br from-cyan-600 to-cyan-700 border-cyan-400 text-white'
              }

              return (
                <motion.div
                  key={`node-${idx}-${val}`}
                  initial={{ scale: 0, opacity: 0, x: pos.x - 22, y: pos.y - 22 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: pos.x - 22,
                    y: pos.y - 22,
                    boxShadow: isCompared
                      ? '0 0 25px rgba(245, 158, 11, 0.75)'
                      : isActive
                      ? '0 0 20px rgba(6, 182, 212, 0.65)'
                      : '0 0 10px rgba(6,182,212,0.1)',
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`absolute w-11 h-11 flex flex-col items-center justify-center rounded-full border-2 font-bold font-mono text-sm z-10 ${colorClasses}`}
                >
                  <span>{val}</span>
                  <span className="text-[8px] opacity-50 font-bold -mt-0.5">#{idx}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {currentHeap.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-sm tracking-wide">
              Heap is Empty. Insert a value to start.
            </div>
          )}
        </div>

        {/* Bottom Half: Linear Array representation displaying Memory Layout */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Linear Memory Layout (Array representation)
            </span>
            <span className="text-[10px] text-cyan-500/80 font-mono font-bold tracking-normal bg-cyan-950/20 px-2 py-0.5 border border-cyan-800/25 rounded-md">
              Left: 2i + 1 | Right: 2i + 2 | Parent: floor((i-1)/2)
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center justify-center py-2 overflow-x-auto">
            {currentHeap.map((val, idx) => {
              const isActive = activeIndices.includes(idx)
              const isCompared = comparedIndices.includes(idx)

              let styleClass = 'bg-slate-900 border-slate-800 text-slate-300'
              if (isCompared) {
                styleClass = 'bg-amber-950/30 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              } else if (isActive) {
                styleClass = 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              }

              return (
                <div key={`array-ele-${idx}-${val}`} className="flex flex-col items-center">
                  <motion.div
                    layout
                    className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl text-sm font-bold font-mono transition-all duration-300 ${styleClass}`}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                    [{idx}]
                  </span>
                </div>
              )
            })}

            {currentHeap.length === 0 && (
              <span className="text-xs italic text-slate-600 font-mono">Empty Array</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
