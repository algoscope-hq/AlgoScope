import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'

export default function DSUIV() {
  const [nodeCount, setNodeCount] = useState(5)
  const [nodeA, setNodeA] = useState('')
  const [nodeB, setNodeB] = useState('')
  const [findNode, setFindNode] = useState('')
  const [strategy, setStrategy] = useState('rank')
  const [parent, setParent] = useState(() =>
    Array(5)
      .fill()
      .map((_, i) => i)
  )
  const [rank, setRank] = useState(() => Array(5).fill(0))
  const [size, setSize] = useState(() => Array(5).fill(1))
  const [traversalPath, setTraversalPath] = useState([])
  const [compressedNodes, setCompressedNodes] = useState([])
  const [latestOperation, setLatestOperation] = useState(null)
  const [unionHighlight, setUnionHighlight] = useState({
    rootA: null,
    rootB: null,
    merged: null,
  })

  const findTimeoutRef = useRef(null)
  const unionTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (findTimeoutRef.current) {
        clearTimeout(findTimeoutRef.current)
        findTimeoutRef.current = null
      }
      if (unionTimeoutRef.current) {
        clearTimeout(unionTimeoutRef.current)
        unionTimeoutRef.current = null
      }
    }
  }, [])

  const findRoot = useCallback((parentArray, node) => {
    let current = node
    while (parentArray[current] !== current) {
      current = parentArray[current]
    }
    const root = current

    let compress = node
    while (parentArray[compress] !== compress) {
      const next = parentArray[compress]
      parentArray[compress] = root
      compress = next
    }

    return root
  }, [])

  const getTraversalPath = useCallback((parentArray, node) => {
    const path = []
    let current = node
    while (true) {
      path.push(current)
      if (parentArray[current] === current) break
      current = parentArray[current]
    }
    return path
  }, [])

  const unionSets = useCallback(
    (a, b, currentParent, currentRank, currentSize) => {
      const newParent = [...currentParent]
      const newRank = [...currentRank]
      const newSize = [...currentSize]

      let rootA = findRoot(newParent, a)
      let rootB = findRoot(newParent, b)

      if (rootA === rootB) {
        return {
          parent: newParent,
          rank: newRank,
          size: newSize,
          changed: false,
        }
      }

      if (strategy === 'rank') {
        if (newRank[rootA] < newRank[rootB]) {
          const temp = rootA
          rootA = rootB
          rootB = temp
        }

        newParent[rootB] = rootA

        if (newRank[rootA] === newRank[rootB]) {
          newRank[rootA]++
        }
      } else {
        if (newSize[rootA] < newSize[rootB]) {
          const temp = rootA
          rootA = rootB
          rootB = temp
        }

        newParent[rootB] = rootA
        newSize[rootA] += newSize[rootB]
      }

      return {
        parent: newParent,
        rank: newRank,
        size: newSize,
        changed: true,
        rootA,
        rootB,
      }
    },
    [strategy, findRoot]
  )

  const resetToNodeCount = useCallback((n) => {
    if (findTimeoutRef.current) {
      clearTimeout(findTimeoutRef.current)
    }
    if (unionTimeoutRef.current) {
      clearTimeout(unionTimeoutRef.current)
    }

    const newParent = Array(n)
      .fill()
      .map((_, i) => i)
    const newRank = Array(n).fill(0)
    const newSize = Array(n).fill(1)

    setParent(newParent)
    setRank(newRank)
    setSize(newSize)
    setTraversalPath([])
    setCompressedNodes([])
    setUnionHighlight({ rootA: null, rootB: null, merged: null })
    setLatestOperation(null)
  }, [])

  const handleNodeCountChange = (newCount) => {
    const count = Math.max(1, Math.min(20, Number(newCount)))
    setNodeCount(count)
    resetToNodeCount(count)
  }

  const resetAllState = useCallback(() => {
    if (findTimeoutRef.current) {
      clearTimeout(findTimeoutRef.current)
    }
    if (unionTimeoutRef.current) {
      clearTimeout(unionTimeoutRef.current)
    }
    setNodeA('')
    setNodeB('')
    setFindNode('')
    resetToNodeCount(nodeCount)
  }, [nodeCount, resetToNodeCount])

  const handleGenerateSample = () => {
    resetAllState()
  }

  const handleReset = () => {
    resetAllState()
  }

  const handleUnion = () => {
    const a = parseInt(nodeA)
    const b = parseInt(nodeB)

    if (isNaN(a) || isNaN(b)) return
    if (a < 0 || a >= nodeCount || b < 0 || b >= nodeCount) return

    const oldParent = [...parent]
    const {
      parent: newParent,
      rank: newRank,
      size: newSize,
      changed,
    } = unionSets(a, b, parent, rank, size)

    setParent(newParent)
    setRank(newRank)
    setSize(newSize)
    setTraversalPath([])
    setCompressedNodes([])

    if (unionTimeoutRef.current) {
      clearTimeout(unionTimeoutRef.current)
    }

    if (!changed) {
      const msg = `Union(${a}, ${b}) - Already in same component`
      setLatestOperation(msg)
      setUnionHighlight({ rootA: null, rootB: null, merged: null })
    } else {
      const rootAVal = findRoot(oldParent, a)
      const rootBVal = findRoot(oldParent, b)
      const msg = `Union(${a}, ${b}) - Merged component rooted at ${rootBVal} into ${rootAVal}`
      setLatestOperation(msg)
      setUnionHighlight({ rootA: rootAVal, rootB: rootBVal, merged: rootBVal })
      unionTimeoutRef.current = setTimeout(() => {
        setUnionHighlight({ rootA: null, rootB: null, merged: null })
      }, 1500)
    }

    setNodeA('')
    setNodeB('')
  }

  const handleFind = () => {
    const node = parseInt(findNode)

    if (isNaN(node)) return
    if (node < 0 || node >= nodeCount) return

    if (findTimeoutRef.current) {
      clearTimeout(findTimeoutRef.current)
    }

    const path = getTraversalPath(parent, node)
    setTraversalPath(path)

    const oldParent = [...parent]
    const newParent = [...parent]
    const root = findRoot(newParent, node)

    const changedNodes = []
    for (let i = 0; i < nodeCount; i++) {
      if (oldParent[i] !== newParent[i]) {
        changedNodes.push(i)
      }
    }
    setCompressedNodes(changedNodes)

    setParent(newParent)

    const findMsg = `Find(${node}) - Root = ${root}`
    const pathMsg = `Traversal: ${path.join(' → ')}`

    let fullMsg = `${findMsg}\n${pathMsg}`

    if (changedNodes.length > 0) {
      const compressionDetails = changedNodes
        .map((n) => `${n} → ${root}`)
        .join(', ')
      const compressionMsg = `Path Compression:\n${compressionDetails}`
      fullMsg = `${findMsg}\n${pathMsg}\n${compressionMsg}`
    }

    setLatestOperation(fullMsg)
    setFindNode('')

    findTimeoutRef.current = setTimeout(() => {
      setTraversalPath([])
      setCompressedNodes([])
    }, 2000)
  }

  const getSubtreeSize = useCallback((nodeId, childrenMap) => {
    const stack = [nodeId]
    let total = 0

    while (stack.length > 0) {
      const current = stack.pop()
      total++
      childrenMap[current].forEach((child) => {
        stack.push(child)
      })
    }

    return total
  }, [])

  const components = useMemo(() => {
    if (parent.length !== nodeCount) {
      return []
    }

    const childrenMap = {}
    for (let i = 0; i < nodeCount; i++) {
      childrenMap[i] = []
    }

    for (let i = 0; i < nodeCount; i++) {
      const parentNode = parent[i]
      if (parentNode !== undefined && parentNode !== i) {
        if (childrenMap[parentNode]) {
          childrenMap[parentNode].push(i)
        }
      }
    }

    const roots = []
    for (let i = 0; i < nodeCount; i++) {
      if (parent[i] === i) {
        roots.push(i)
      }
    }

    const buildLevels = (rootId) => {
      const nodesAtLevel = {}

      const traverse = (nodeId, depth) => {
        if (!nodesAtLevel[depth]) nodesAtLevel[depth] = []
        nodesAtLevel[depth].push(nodeId)
        childrenMap[nodeId].forEach((childId) => {
          traverse(childId, depth + 1)
        })
      }

      traverse(rootId, 0)

      const maxDepth = Object.keys(nodesAtLevel).length
        ? Math.max(...Object.keys(nodesAtLevel).map(Number))
        : 0
      const levels = []
      for (let i = 0; i <= maxDepth; i++) {
        levels.push(nodesAtLevel[i] || [])
      }

      return levels
    }

    return roots.map((root) => ({
      root,
      levels: buildLevels(root),
      childrenMap,
      nodeCount: getSubtreeSize(root, childrenMap),
    }))
  }, [parent, nodeCount, getSubtreeSize])

  const getNodeColors = useCallback(
    (nodeId) => {
      const isRoot = components.some((comp) => comp.root === nodeId)
      const isInPath = traversalPath.includes(nodeId)
      const isCompressed = compressedNodes.includes(nodeId)
      const isHighlightRoot =
        unionHighlight.rootA === nodeId || unionHighlight.rootB === nodeId
      const isHighlightMerged = unionHighlight.merged === nodeId

      if (isHighlightMerged) {
        return { fill: '#ec4899', stroke: '#f472b6' }
      }
      if (isHighlightRoot) {
        return { fill: '#6366f1', stroke: '#818cf8' }
      }
      if (isCompressed) {
        return { fill: '#10b981', stroke: '#34d399' }
      }
      if (isInPath) {
        return { fill: '#eab308', stroke: '#fbbf24' }
      }
      if (isRoot) {
        return { fill: '#06b6d4', stroke: '#22d3ee' }
      }
      return { fill: '#475569', stroke: '#64748b' }
    },
    [components, traversalPath, compressedNodes, unionHighlight]
  )

  const renderCompactNode = (nodeId) => {
    const colors = getNodeColors(nodeId)

    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
        style={{ backgroundColor: colors.fill }}
      >
        {nodeId}
      </div>
    )
  }

  const renderTree = useCallback(
    (levels, compChildrenMap) => {
      const maxWidth = Math.max(...levels.map((level) => level.length), 1)
      const levelHeight = 100

      const getNodePosition = (levelIdx, nodeIdx, totalNodesInLevel) => {
        const spacing = 120
        const startX = (maxWidth - totalNodesInLevel) * (spacing / 2)
        const x = startX + nodeIdx * spacing
        const y = levelIdx * levelHeight
        return { x, y }
      }

      const getChildrenPositions = (parentId, parentLevel) => {
        const children = compChildrenMap[parentId] || []
        if (children.length === 0) return []

        const nextLevel = levels[parentLevel + 1]
        if (!nextLevel) return []

        const childPositions = children
          .map((childId) => {
            const childIndex = nextLevel.indexOf(childId)
            if (childIndex === -1) return null
            const { x, y } = getNodePosition(
              parentLevel + 1,
              childIndex,
              nextLevel.length
            )
            return { id: childId, x, y }
          })
          .filter((pos) => pos !== null)

        return childPositions
      }

      const rootNode = levels[0]?.[0]
      if (rootNode === undefined) return null

      const { x: rootX, y: rootY } = getNodePosition(0, 0, 1)

      const allLines = []
      const collectLines = (nodeId, level, x, y) => {
        const children = getChildrenPositions(nodeId, level)
        children.forEach((child) => {
          allLines.push({ x1: x, y1: y + 20, x2: child.x, y2: child.y })
          collectLines(child.id, level + 1, child.x, child.y)
        })
      }

      collectLines(rootNode, 0, rootX, rootY)

      return (
        <svg
          width="100%"
          height={levels.length * levelHeight + 80}
          className="overflow-visible"
          style={{ minWidth: maxWidth * 120 }}
        >
          <defs>
            <radialGradient id="nodeGradient" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
            </radialGradient>
          </defs>
          {allLines.map((line, idx) => (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#475569"
              strokeWidth="2"
            />
          ))}
          {levels.map((level, levelIdx) =>
            level.map((nodeId, nodeIdx) => {
              const { x, y } = getNodePosition(levelIdx, nodeIdx, level.length)
              const colors = getNodeColors(nodeId)
              return (
                <g key={nodeId} transform={`translate(${x}, ${y})`}>
                  <circle r="20" fill="url(#nodeGradient)" />
                  <circle
                    r="20"
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="3"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    className="text-white font-bold text-sm"
                    fill="white"
                  >
                    {nodeId}
                  </text>
                </g>
              )
            })
          )}
        </svg>
      )
    },
    [getNodeColors]
  )

  const isolatedComponents = components.filter((c) => c.nodeCount === 1)
  const treeComponents = components.filter((c) => c.nodeCount > 1)

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-slate-300 font-bold text-sm">Nodes</label>
            <input
              type="number"
              min={1}
              max={20}
              value={nodeCount}
              onChange={(e) => handleNodeCountChange(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:border-cyan-500 text-sm"
            />
          </div>
          <button
            onClick={handleGenerateSample}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg text-sm"
          >
            Generate
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg text-sm"
          >
            Reset
          </button>

          <div className="w-px h-6 bg-slate-600"></div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nodeA}
              onChange={(e) => setNodeA(e.target.value)}
              placeholder="A"
              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:border-cyan-500 text-sm text-center"
            />
            <input
              type="text"
              value={nodeB}
              onChange={(e) => setNodeB(e.target.value)}
              placeholder="B"
              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:border-cyan-500 text-sm text-center"
            />
            <button
              onClick={handleUnion}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg text-sm"
            >
              Union
            </button>
          </div>

          <div className="w-px h-6 bg-slate-600"></div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={findNode}
              onChange={(e) => setFindNode(e.target.value)}
              placeholder="Node"
              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white outline-none focus:border-cyan-500 text-sm text-center"
            />
            <button
              onClick={handleFind}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg text-sm"
            >
              Find
            </button>
          </div>

          <div className="w-px h-6 bg-slate-600"></div>

          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-1 text-slate-300">
              <input
                type="radio"
                name="unionStrategy"
                value="rank"
                checked={strategy === 'rank'}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-3 h-3 text-cyan-500"
              />
              Rank
            </label>
            <label className="flex items-center gap-1 text-slate-300">
              <input
                type="radio"
                name="unionStrategy"
                value="size"
                checked={strategy === 'size'}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-3 h-3 text-cyan-500"
              />
              Size
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 min-h-[350px]">
        <div className="lg:col-span-3 bg-slate-800/50 rounded-xl border border-slate-700 p-4 overflow-auto">
          {components.length === 0 ? (
            <div className="text-slate-400 text-center py-20">
              <p>No visualization available</p>
              <p className="text-sm mt-2">Generate a sample to begin</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 items-start">
              {isolatedComponents.map((component) => (
                <div key={component.root}>
                  {renderCompactNode(component.root)}
                </div>
              ))}
              {treeComponents.map((component) => (
                <div key={component.root} className="flex-shrink-0">
                  <div className="text-cyan-400 text-xs mb-2">
                    Component {component.root}
                  </div>
                  {renderTree(component.levels, component.childrenMap)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">
              DSU State
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Parent:</span>
                <span className="text-green-400">[{parent.join(', ')}]</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Rank:</span>
                <span className="text-blue-400">[{rank.join(', ')}]</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-slate-400">Size:</span>
                <span className="text-purple-400">[{size.join(', ')}]</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">
              Latest Operation
            </div>
            <div className="text-green-400 font-mono text-xs whitespace-pre-wrap">
              {latestOperation || 'No operations performed yet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
