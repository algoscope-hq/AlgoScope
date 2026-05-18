import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PriorityQueueIV() {
  const [priorityType, setPriorityType] = useState('min') // 'min' | 'max' (Min-Priority or Max-Priority)
  // Initial priority queue with sample tasks
  const [queue, setQueue] = useState([
    { id: '1', value: 'Task A', priority: 12 },
    { id: '2', value: 'Task B', priority: 18 },
    { id: '3', value: 'Task C', priority: 25 },
    { id: '4', value: 'Task D', priority: 30 },
    { id: '5', value: 'Task E', priority: 40 },
  ])
  const [inputValue, setInputValue] = useState('')
  const [priorityValue, setPriorityValue] = useState('')
  const [steps, setSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(-1)
  const [updatePriorityInput, setUpdatePriorityInput] = useState('')
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

  // Stepper Autoplay Timer
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
      }, 1600)
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

    const getCoords = (index) => {
      if (index >= queue.length) return
      const level = Math.floor(Math.log2(index + 1))
      const levelNodesCount = Math.pow(2, level)
      const indexInLevel = index - (levelNodesCount - 1)

      const levelWidth = width
      const segmentWidth = levelWidth / levelNodesCount
      const x = segmentWidth * indexInLevel + segmentWidth / 2
      const y = startY + level * rowHeight

      positions[index] = { x, y }

      getCoords(2 * index + 1)
      getCoords(2 * index + 2)
    }

    if (queue.length > 0) {
      getCoords(0)
    }
    return positions
  }, [queue.length, dimensions.width])

  // Connect tree node edges
  const edges = useMemo(() => {
    const list = []
    for (let i = 0; i < queue.length; i++) {
      const leftChild = 2 * i + 1
      const rightChild = 2 * i + 2

      if (leftChild < queue.length && nodePositions[i] && nodePositions[leftChild]) {
        list.push({
          id: `edge-pq-${i}-${leftChild}`,
          x1: nodePositions[i].x,
          y1: nodePositions[i].y,
          x2: nodePositions[leftChild].x,
          y2: nodePositions[leftChild].y,
        })
      }
      if (rightChild < queue.length && nodePositions[i] && nodePositions[rightChild]) {
        list.push({
          id: `edge-pq-${i}-${rightChild}`,
          x1: nodePositions[i].x,
          y1: nodePositions[i].y,
          x2: nodePositions[rightChild].x,
          y2: nodePositions[rightChild].y,
        })
      }
    }
    return list
  }, [queue.length, nodePositions])

  // Compare priorities based on Queue type (Min Priority vs Max Priority)
  const comparePriorities = (priority1, priority2) => {
    return priorityType === 'min' ? priority1 < priority2 : priority1 > priority2
  }

  // Heapify-Up based on priorities
  const startHeapifyUp = (arr, startIndex) => {
    const history = []
    const tempArr = [...arr]
    let current = startIndex

    history.push({
      array: [...tempArr],
      activeIndices: [current],
      comparedIndices: [],
      type: 'enqueue-start',
      message: `Enqueued "${tempArr[current].value}" with priority ${tempArr[current].priority} at leaf (index ${current}).`,
    })

    while (current > 0) {
      const parent = Math.floor((current - 1) / 2)

      history.push({
        array: [...tempArr],
        activeIndices: [current, parent],
        comparedIndices: [current, parent],
        type: 'compare',
        message: `Comparing priority ${tempArr[current].priority} (index ${current}) with parent priority ${tempArr[parent].priority} (index ${parent}).`,
      })

      if (comparePriorities(tempArr[current].priority, tempArr[parent].priority)) {
        // Swap
        const temp = tempArr[current]
        tempArr[current] = tempArr[parent]
        tempArr[parent] = temp

        history.push({
          array: [...tempArr],
          activeIndices: [current, parent],
          comparedIndices: [current, parent],
          type: 'swap',
          message: `Priority violation. Swapping node "${tempArr[parent].value}" with parent "${tempArr[current].value}"!`,
        })
        current = parent
      } else {
        history.push({
          array: [...tempArr],
          activeIndices: [current, parent],
          comparedIndices: [],
          type: 'satisfied',
          message: `Priority order is correct. Node "${tempArr[current].value}" does not need to bubble up.`,
        })
        break
      }
    }

    history.push({
      array: [...tempArr],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Enqueue process finished! Priority Queue is fully updated.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  // Heapify-Down based on priorities
  const startHeapifyDown = (arr) => {
    if (arr.length === 0) return
    const history = []
    const tempArr = [...arr]
    const rootItem = tempArr[0]
    const lastIndex = tempArr.length - 1
    const lastItem = tempArr[lastIndex]

    history.push({
      array: [...tempArr],
      activeIndices: [0, lastIndex],
      comparedIndices: [],
      type: 'dequeue-start',
      message: `Dequeued root item "${rootItem.value}" (Priority ${rootItem.priority}). Replacing root with last item "${lastItem.value}" (Priority ${lastItem.priority}).`,
    })

    tempArr[0] = lastItem
    tempArr.pop()

    if (tempArr.length === 0) {
      history.push({
        array: [],
        activeIndices: [],
        comparedIndices: [],
        type: 'done',
        message: `Priority Queue is now empty!`,
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
      type: 'heapify-down-start',
      message: `Item "${tempArr[0].value}" is now at root. Running heapify-down to restore priority ordering.`,
    })

    let current = 0
    const size = tempArr.length

    while (2 * current + 1 < size) {
      const leftChild = 2 * current + 1
      const rightChild = 2 * current + 2
      let targetChild = leftChild

      if (rightChild < size) {
        history.push({
          array: [...tempArr],
          activeIndices: [leftChild, rightChild],
          comparedIndices: [leftChild, rightChild],
          type: 'compare-children',
          message: `Comparing left child "${tempArr[leftChild].value}" (Priority ${tempArr[leftChild].priority}) with right child "${tempArr[rightChild].value}" (Priority ${tempArr[rightChild].priority}) to find the candidate with ${priorityType === 'min' ? 'higher urgency (smaller priority number)' : 'greater priority'}.`,
        })

        const rightWins = comparePriorities(tempArr[rightChild].priority, tempArr[leftChild].priority)
        if (rightWins) {
          targetChild = rightChild
        }
      }

      history.push({
        array: [...tempArr],
        activeIndices: [current, targetChild],
        comparedIndices: [current, targetChild],
        type: 'compare',
        message: `Comparing parent "${tempArr[current].value}" (Priority ${tempArr[current].priority}) with target child "${tempArr[targetChild].value}" (Priority ${tempArr[targetChild].priority}).`,
      })

      const childWins = comparePriorities(tempArr[targetChild].priority, tempArr[current].priority)
      if (childWins) {
        // Swap
        const temp = tempArr[current]
        tempArr[current] = tempArr[targetChild]
        tempArr[targetChild] = temp

        history.push({
          array: [...tempArr],
          activeIndices: [current, targetChild],
          comparedIndices: [current, targetChild],
          type: 'swap',
          message: `Swapping parent "${tempArr[targetChild].value}" with target child "${tempArr[current].value}" because child has higher priority!`,
        })
        current = targetChild
      } else {
        history.push({
          array: [...tempArr],
          activeIndices: [current],
          comparedIndices: [],
          type: 'satisfied',
          message: `Priority hierarchy satisfied at node "${tempArr[current].value}". No more swaps needed.`,
        })
        break
      }
    }

    history.push({
      array: [...tempArr],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Dequeue operation complete! Highest priority element successfully processed.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  // Enqueue Item
  const handleEnqueue = () => {
    if (!inputValue || !priorityValue) return
    const prio = parseInt(priorityValue)
    if (isNaN(prio)) return
    if (queue.length >= 15) {
      alert('Queue reached maximum visual capacity of 15 items!')
      return
    }

    setIsPlaying(false)
    const newItem = {
      id: Date.now().toString(),
      value: inputValue,
      priority: prio,
    }
    const newQueue = [...queue, newItem]
    startHeapifyUp(newQueue, newQueue.length - 1)
    setInputValue('')
    setPriorityValue('')
  }

  // Dequeue Item
  const handleDequeue = () => {
    if (queue.length === 0) return
    setIsPlaying(false)
    startHeapifyDown(queue)
  }

  // Update Priority of a Selected Node (Change Key)
  const handleUpdatePriority = () => {
    if (selectedNodeIndex < 0 || selectedNodeIndex >= queue.length) return
    const newPrio = parseInt(updatePriorityInput)
    if (isNaN(newPrio)) return

    setIsPlaying(false)
    const oldPrio = queue[selectedNodeIndex].priority
    const updatedQueue = [...queue]
    updatedQueue[selectedNodeIndex] = {
      ...updatedQueue[selectedNodeIndex],
      priority: newPrio,
    }

    const history = []
    history.push({
      array: [...updatedQueue],
      activeIndices: [selectedNodeIndex],
      comparedIndices: [],
      type: 'update-start',
      message: `Updating priority of "${updatedQueue[selectedNodeIndex].value}" from ${oldPrio} to ${newPrio}. Initiating re-heapify.`,
    })

    // Re-heapify specific node index
    const reheapify = (arr, index) => {
      // Check if it should bubble up or bubble down
      let idx = index
      const size = arr.length

      // Attempt to Heapify Up first
      let bubbledUp = false
      while (idx > 0) {
        const parent = Math.floor((idx - 1) / 2)
        if (comparePriorities(arr[idx].priority, arr[parent].priority)) {
          const temp = arr[idx]
          arr[idx] = arr[parent]
          arr[parent] = temp

          history.push({
            array: [...arr],
            activeIndices: [idx, parent],
            comparedIndices: [idx, parent],
            type: 'swap',
            message: `Updated node bubbled up: swapped parent "${arr[idx].value}" with child "${arr[parent].value}".`,
          })
          idx = parent
          bubbledUp = true
        } else {
          break
        }
      }

      if (bubbledUp) return

      // Otherwise, attempt to Heapify Down
      while (2 * idx + 1 < size) {
        const left = 2 * idx + 1
        const right = 2 * idx + 2
        let target = left

        if (right < size) {
          const rightWins = comparePriorities(arr[right].priority, arr[left].priority)
          if (rightWins) target = right
        }

        if (comparePriorities(arr[target].priority, arr[idx].priority)) {
          const temp = arr[idx]
          arr[idx] = arr[target]
          arr[target] = temp

          history.push({
            array: [...arr],
            activeIndices: [idx, target],
            comparedIndices: [idx, target],
            type: 'swap',
            message: `Updated node bubbled down: swapped parent "${arr[target].value}" with child "${arr[idx].value}".`,
          })
          idx = target
        } else {
          break
        }
      }
    }

    reheapify(updatedQueue, selectedNodeIndex)

    history.push({
      array: [...updatedQueue],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Priority adjustment complete! Queue properties fully restored.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
    setSelectedNodeIndex(-1)
    setUpdatePriorityInput('')
  }

  // Toggle priority type (Min Priority vs Max Priority)
  const togglePriorityType = () => {
    setIsPlaying(false)
    const newType = priorityType === 'max' ? 'min' : 'max'
    setPriorityType(newType)

    // Rebuild priority heap
    const history = []
    const temp = [...queue]
    const size = temp.length

    history.push({
      array: [...temp],
      activeIndices: [],
      comparedIndices: [],
      type: 'rebuild-start',
      message: `Converting to ${newType === 'min' ? 'Min-Priority Queue' : 'Max-Priority Queue'}. Re-aligning elements step-by-step.`,
    })

    const heapifyDown = (arr, idx, len) => {
      let curr = idx
      while (2 * curr + 1 < len) {
        let left = 2 * curr + 1
        let right = 2 * curr + 2
        let target = left

        if (right < len) {
          const rightWins = newType === 'min' 
            ? arr[right].priority < arr[left].priority 
            : arr[right].priority > arr[left].priority
          if (rightWins) target = right
        }

        const childPrio = arr[target].priority
        const currPrio = arr[curr].priority
        const shouldSwap = newType === 'min' ? childPrio < currPrio : childPrio > currPrio

        if (shouldSwap) {
          const swapVal = arr[curr]
          arr[curr] = arr[target]
          arr[target] = swapVal
          history.push({
            array: [...arr],
            activeIndices: [curr, target],
            comparedIndices: [curr, target],
            type: 'swap',
            message: `Rebuilding: Swapped "${swapVal.value}" with child "${arr[curr].value}" to satisfy new Priority Order.`,
          })
          curr = target
        } else {
          break
        }
      }
    }

    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
      heapifyDown(temp, i, size)
    }

    history.push({
      array: [...temp],
      activeIndices: [],
      comparedIndices: [],
      type: 'done',
      message: `Priority order successfully set to ${newType === 'min' ? 'Min-Priority' : 'Max-Priority'}.`,
    })

    setSteps(history)
    setCurrentStepIndex(0)
    setIsPlaying(true)
  }

  // Generate a random queue
  const handleRandomize = () => {
    setIsPlaying(false)
    const newSize = Math.floor(Math.random() * 5) + 5 // 5 to 9 elements
    const taskLabels = ['Process A', 'Network I/O', 'Disk Read', 'Audio Render', 'HTTP Fetch', 'User input', 'UI Redraw', 'GC Cycle', 'File Flush']
    const values = []
    
    // Shuffle labels
    const shuffledLabels = [...taskLabels].sort(() => 0.5 - Math.random())

    for (let i = 0; i < newSize; i++) {
      values.push({
        id: Math.random().toString(),
        value: shuffledLabels[i],
        priority: Math.floor(Math.random() * 90) + 10,
      })
    }

    // Build Valid Heap based on current priority settings
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
            const rightWins = priorityType === 'min' 
              ? subArr[right].priority < subArr[left].priority 
              : subArr[right].priority > subArr[left].priority
            if (rightWins) target = right
          }
          const shouldSwap = priorityType === 'min' 
            ? subArr[target].priority < subArr[curr].priority 
            : subArr[target].priority > subArr[curr].priority
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

    const validPQ = rebuild(values)
    setQueue(validPQ)
    setSteps([])
    setCurrentStepIndex(-1)
    setSelectedNodeIndex(-1)
  }

  // Clear PQ
  const handleClear = () => {
    setIsPlaying(false)
    setQueue([])
    setSteps([])
    setCurrentStepIndex(-1)
    setSelectedNodeIndex(-1)
  }

  // Apply step changes to active queue state
  const activeStep = steps[currentStepIndex]
  const currentQueue = activeStep ? activeStep.array : queue
  const activeIndices = activeStep ? activeStep.activeIndices : []
  const comparedIndices = activeStep ? activeStep.comparedIndices : []

  // Finalize state after animation finishes
  useEffect(() => {
    if (activeStep && (currentStepIndex === steps.length - 1 || !isPlaying)) {
      setQueue(activeStep.array)
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
          {/* Enqueue form group */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Task name"
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-500 transition-colors w-28 text-sm"
            />
            <input
              type="number"
              value={priorityValue}
              onChange={(e) => setPriorityValue(e.target.value)}
              placeholder="Priority"
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-500 transition-colors w-20 text-sm font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
            />
            <button
              onClick={handleEnqueue}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95 animate-pulse"
            >
              Enqueue
            </button>
            <button
              onClick={handleDequeue}
              disabled={queue.length === 0}
              className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95"
              title="Process and remove highest priority item"
            >
              Dequeue Peak
            </button>
          </div>

          {/* Toggle Type and Generation */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Priority Type Switch */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
              <span className={`text-xs font-bold font-mono tracking-wider ${priorityType === 'min' ? 'text-emerald-400' : 'text-slate-500'}`}>MIN PRIO</span>
              <button
                onClick={togglePriorityType}
                className="w-12 h-6 bg-slate-800 rounded-full p-1 transition-colors relative focus:outline-none border border-slate-700"
              >
                <motion.div
                  layout
                  className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                  animate={{ x: priorityType === 'max' ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-xs font-bold font-mono tracking-wider ${priorityType === 'max' ? 'text-emerald-400' : 'text-slate-500'}`}>MAX PRIO</span>
            </div>

            <button
              onClick={handleRandomize}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg text-sm transition-all active:scale-95"
            >
              Randomize
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 font-bold rounded-lg text-sm transition-all border border-slate-800 hover:border-red-900/35 active:scale-95"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Change Priority panel (when a node is selected) */}
        {selectedNodeIndex >= 0 && selectedNodeIndex < queue.length && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl px-4 py-2.5 shadow-inner"
          >
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Adjusting priority for "{queue[selectedNodeIndex].value}" (Index: {selectedNodeIndex}, Current Priority: {queue[selectedNodeIndex].priority})
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={updatePriorityInput}
                onChange={(e) => setUpdatePriorityInput(e.target.value)}
                placeholder="New priority"
                className="bg-slate-950 border border-emerald-800/40 rounded-lg px-3 py-1.5 text-white outline-none focus:border-emerald-500 transition-colors w-24 text-xs font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleUpdatePriority()}
              />
              <button
                onClick={handleUpdatePriority}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedNodeIndex(-1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Stepper Logger message */}
        {steps.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-800/80 pt-3 mt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={stepBackward}
                disabled={currentStepIndex <= 0}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/70 rounded-lg text-slate-300 disabled:opacity-40 transition"
              >
                ⏮️
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider transition ${
                  isPlaying ? 'bg-amber-605 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
              </button>
              <button
                onClick={stepForward}
                disabled={currentStepIndex >= steps.length - 1}
                className="p-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/70 rounded-lg text-slate-300 disabled:opacity-40 transition"
              >
                ⏭️
              </button>
            </div>

            <div className="flex-1 min-w-[280px] bg-slate-950/70 border border-slate-850/60 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono text-emerald-300/90 shadow-inner flex items-center gap-3">
              <span className="font-bold text-slate-500 shrink-0">
                [{currentStepIndex + 1}/{steps.length}]
              </span>
              <span className="leading-relaxed">{activeStep?.message || 'Ready'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Dual-Representation Layout */}
      <div className="flex-1 grid grid-rows-[1fr_auto] gap-5 min-h-[500px]">
        {/* Top: SVGs and Tree Graph */}
        <div
          ref={containerRef}
          className="relative bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl flex-1 overflow-hidden min-h-[300px]"
        >
          {/* Neon mesh background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#09101f_1px,transparent_1px),linear-gradient(to_bottom,#09101f_1px,transparent_1px)] bg-[size:30px_30px] opacity-25 pointer-events-none"></div>

          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="pqEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
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
                stroke="url(#pqEdgeGrad)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            ))}
          </svg>

          {/* Tree Nodes representing Tasks */}
          <AnimatePresence>
            {currentQueue.map((item, idx) => {
              const pos = nodePositions[idx]
              if (!pos) return null

              const isActive = activeIndices.includes(idx)
              const isCompared = comparedIndices.includes(idx)
              const isSelected = selectedNodeIndex === idx

              let borderClasses = 'border-emerald-900/35 hover:border-emerald-500/50'
              let bgClasses = 'bg-slate-950/80 text-slate-100'
              if (isSelected) {
                borderClasses = 'border-emerald-400'
                bgClasses = 'bg-emerald-950/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              } else if (isCompared) {
                borderClasses = 'border-amber-400'
                bgClasses = 'bg-amber-950/50 text-amber-100'
              } else if (isActive) {
                borderClasses = 'border-emerald-400'
                bgClasses = 'bg-emerald-900/40 text-emerald-100'
              }

              return (
                <motion.div
                  key={`pq-node-${item.id}-${idx}`}
                  initial={{ scale: 0, opacity: 0, x: pos.x - 38, y: pos.y - 25 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: pos.x - 38,
                    y: pos.y - 25,
                    boxShadow: isCompared
                      ? '0 0 20px rgba(245, 158, 11, 0.7)'
                      : isActive
                      ? '0 0 20px rgba(16, 185, 129, 0.7)'
                      : '0 0 10px rgba(16,185,129,0.05)',
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  onClick={() => {
                    setSelectedNodeIndex(idx)
                    setUpdatePriorityInput(item.priority.toString())
                  }}
                  className={`absolute w-[76px] h-[50px] flex flex-col items-center justify-center rounded-xl border-2 font-mono text-center cursor-pointer transition-all duration-300 z-10 ${bgClasses} ${borderClasses}`}
                  title="Click to adjust priority"
                >
                  <span className="text-[10px] font-bold truncate max-w-[68px]">{item.value}</span>
                  <span className="text-[9px] text-emerald-400 font-bold mt-0.5">Prio: {item.priority}</span>
                  <span className="text-[7px] text-slate-500 opacity-60">Idx: {idx}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {currentQueue.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-sm tracking-wide">
              Priority Queue is Empty. Enqueue a task to start.
            </div>
          )}
        </div>

        {/* Bottom: Memory layout array list of priority pairs */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Binary Heap Priority Array (Underlying memory layout)
            </span>
            <span className="text-[10px] text-slate-500 font-mono italic">
              💡 Tip: Click any tree node above to dynamically update its priority value!
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center justify-center py-1.5 overflow-x-auto">
            {currentQueue.map((item, idx) => {
              const isActive = activeIndices.includes(idx)
              const isCompared = comparedIndices.includes(idx)
              const isSelected = selectedNodeIndex === idx

              let borderClasses = 'border-slate-800 text-slate-400'
              if (isSelected) {
                borderClasses = 'border-emerald-500 text-emerald-300 bg-emerald-950/30'
              } else if (isCompared) {
                borderClasses = 'border-amber-500/50 text-amber-300 bg-amber-950/20'
              } else if (isActive) {
                borderClasses = 'border-emerald-500/50 text-emerald-300 bg-emerald-950/20'
              }

              return (
                <div key={`pq-array-ele-${item.id}-${idx}`} className="flex flex-col items-center">
                  <motion.div
                    layout
                    className={`w-20 h-12 flex flex-col items-center justify-center border-2 rounded-xl text-center font-mono transition-all duration-300 bg-slate-900 ${borderClasses}`}
                  >
                    <span className="text-[9px] font-bold truncate max-w-[70px]">{item.value}</span>
                    <span className="text-[8px] font-bold text-emerald-400/90">P: {item.priority}</span>
                  </motion.div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                    [{idx}]
                  </span>
                </div>
              )
            })}

            {currentQueue.length === 0 && (
              <span className="text-xs italic text-slate-600 font-mono">Queue is empty</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
