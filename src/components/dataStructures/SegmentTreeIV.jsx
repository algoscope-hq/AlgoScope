import { useState, useCallback, useRef } from 'react'

class SegmentTree {
  constructor(arr, type = 'sum') {
    this.n = arr.length
    this.arr = [...arr]
    this.type = type
    this.tree = Array(4 * this.n).fill(0)
    if (this.n > 0) this.build(0, 0, this.n - 1)
  }

  operation(a, b) {
    if (this.type === 'sum') return a + b
    if (this.type === 'min') return Math.min(a, b)
    if (this.type === 'max') return Math.max(a, b)
    return a + b
  }

  identity() {
    if (this.type === 'sum') return 0
    if (this.type === 'min') return Infinity
    if (this.type === 'max') return -Infinity
    return 0
  }

  build(node, start, end) {
    if (start === end) {
      this.tree[node] = this.arr[start]
      return
    }
    const mid = Math.floor((start + end) / 2)
    this.build(2 * node + 1, start, mid)
    this.build(2 * node + 2, mid + 1, end)
    this.tree[node] = this.operation(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2]
    )
  }

  query(node, start, end, l, r, visited) {
    if (r < start || end < l) return this.identity()
    if (l <= start && end <= r) {
      visited.push(node)
      return this.tree[node]
    }
    visited.push(node)
    const mid = Math.floor((start + end) / 2)
    const left = this.query(2 * node + 1, start, mid, l, r, visited)
    const right = this.query(2 * node + 2, mid + 1, end, l, r, visited)
    return this.operation(left, right)
  }

  update(node, start, end, idx, val, visited) {
    visited.push(node)
    if (start === end) {
      this.arr[idx] = val
      this.tree[node] = val
      return
    }
    const mid = Math.floor((start + end) / 2)
    if (idx <= mid) this.update(2 * node + 1, start, mid, idx, val, visited)
    else this.update(2 * node + 2, mid + 1, end, idx, val, visited)
    this.tree[node] = this.operation(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2]
    )
  }

  toJSON() {
    const nodes = []
    const buildNodes = (node, start, end, depth) => {
      if (start > end || node >= this.tree.length) return
      nodes.push({
        id: node,
        value: this.tree[node],
        start,
        end,
        depth,
        isLeaf: start === end,
      })
      if (start !== end) {
        const mid = Math.floor((start + end) / 2)
        buildNodes(2 * node + 1, start, mid, depth + 1)
        buildNodes(2 * node + 2, mid + 1, end, depth + 1)
      }
    }
    if (this.n > 0) buildNodes(0, 0, this.n - 1, 0)
    return { nodes, arr: [...this.arr], n: this.n, type: this.type }
  }
}

function getNodeColor(nodeId, highlightedNodes, isLeaf) {
  if (highlightedNodes.includes(nodeId)) {
    return 'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_12px_rgba(6,182,212,0.6)]'
  }
  if (isLeaf) return 'bg-green-800 border-green-500 text-white'
  return 'bg-slate-700 border-slate-500 text-slate-200'
}

function TreeNode({ node, highlightedNodes }) {
  const colorClass = getNodeColor(node.id, highlightedNodes, node.isLeaf)
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${colorClass}`}
      >
        <div className="text-xs font-mono font-bold">{node.value}</div>
        <div className="text-[9px] opacity-70 font-mono">
          [{node.start},{node.end}]
        </div>
      </div>
    </div>
  )
}

export default function SegmentTreeIV() {
  const stRef = useRef(null)
  const [snapshot, setSnapshot] = useState(null)
  const [arrayInput, setArrayInput] = useState('1 3 5 7 9 11')
  const [queryType, setQueryType] = useState('sum')
  const [rangeL, setRangeL] = useState('1')
  const [rangeR, setRangeR] = useState('3')
  const [updateIdx, setUpdateIdx] = useState('2')
  const [updateVal, setUpdateVal] = useState('10')
  const [result, setResult] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState([])

  const refresh = useCallback(() => {
    if (stRef.current) setSnapshot(stRef.current.toJSON())
  }, [])

  const handleBuild = () => {
    const tokens = arrayInput.trim().split(/\s+/)
    const arr = tokens.map(Number).filter((n) => !isNaN(n))
    if (arr.length === 0 || arr.length !== tokens.length) {
      setResult({
        type: 'fail',
        message: 'Invalid input. Enter space-separated numbers only.',
      })
      return
    }
    stRef.current = new SegmentTree(arr, queryType)
    setHighlightedNodes([])
    setResult({
      type: 'insert',
      message: `Segment Tree built from [${arr.join(', ')}] using ${queryType.toUpperCase()}`,
    })
    refresh()
  }

  const handleSample = () => {
    const arr = [1, 3, 5, 7, 9, 11]
    setArrayInput(arr.join(' '))
    stRef.current = new SegmentTree(arr, queryType)
    setHighlightedNodes([])
    setResult({
      type: 'insert',
      message: `Segment Tree built from [${arr.join(', ')}] using ${queryType.toUpperCase()}`,
    })
    refresh()
  }

  const handleReset = () => {
    stRef.current = null
    setSnapshot(null)
    setResult(null)
    setHighlightedNodes([])
  }

  const handleQuery = () => {
    if (!stRef.current) return
    const l = parseInt(rangeL)
    const r = parseInt(rangeR)
    const n = stRef.current.n
    if (isNaN(l) || isNaN(r) || l < 0 || r >= n || l > r) {
      setResult({
        type: 'fail',
        message: `Invalid range. Use indices between 0 and ${n - 1}`,
      })
      return
    }
    const visited = []
    const res = stRef.current.query(0, 0, n - 1, l, r, visited)
    setHighlightedNodes(visited)
    setResult({
      type: 'success',
      message: `${queryType.toUpperCase()}[${l}..${r}] = ${res === Infinity ? '∞' : res === -Infinity ? '-∞' : res}`,
    })
  }

  const handleUpdate = () => {
    if (!stRef.current) return
    const idx = parseInt(updateIdx)
    const val = parseInt(updateVal)
    const n = stRef.current.n
    if (isNaN(idx) || isNaN(val) || idx < 0 || idx >= n) {
      setResult({
        type: 'fail',
        message: `Invalid index. Use index between 0 and ${n - 1}`,
      })
      return
    }
    const visited = []
    stRef.current.update(0, 0, n - 1, idx, val, visited)
    setHighlightedNodes(visited)
    refresh()
    setResult({
      type: 'insert',
      message: `Updated index ${idx} to ${val} — ancestors updated in O(log n)`,
    })
  }

  const groupedByDepth = snapshot
    ? snapshot.nodes.reduce((acc, node) => {
        if (!acc[node.depth]) acc[node.depth] = []
        acc[node.depth].push(node)
        return acc
      }, {})
    : {}

  return (
    <div className="flex flex-col gap-4 text-slate-200 min-h-[400px]">
      {/* Build Controls */}
      <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700">
        <input
          type="text"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="e.g. 1 3 5 7 9 11"
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-cyan-500 w-40"
        />

        <select
          value={queryType}
          onChange={(e) => {
            const newType = e.target.value
            setQueryType(newType)
            if (stRef.current && stRef.current.n > 0) {
              stRef.current = new SegmentTree(stRef.current.arr, newType)
              setHighlightedNodes([])
              setResult({
                type: 'insert',
                message: `Switched to ${newType.toUpperCase()} — tree rebuilt`,
              })
              refresh()
            }
          }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-cyan-500"
        >
          <option value="sum">Sum</option>
          <option value="min">Min</option>
          <option value="max">Max</option>
        </select>

        <button
          onClick={handleBuild}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-sm transition-colors"
        >
          Build
        </button>

        <div className="w-px h-6 bg-slate-600" />

        <button
          onClick={handleSample}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm transition-colors"
        >
          Sample
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Operation Controls */}
      {snapshot && (
        <div className="flex flex-wrap gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700">
          {/* Query */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">QUERY:</span>
            <span className="text-xs text-slate-400">L</span>
            <input
              type="number"
              value={rangeL}
              onChange={(e) => setRangeL(e.target.value)}
              aria-label="Query left index"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-cyan-500 w-14"
            />
            <span className="text-xs text-slate-400">R</span>
            <input
              type="number"
              value={rangeR}
              onChange={(e) => setRangeR(e.target.value)}
              aria-label="Query right index"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-cyan-500 w-14"
            />
            <button
              onClick={handleQuery}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Query
            </button>
          </div>

          <div className="w-px h-6 bg-slate-600" />

          {/* Update */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">
              UPDATE:
            </span>
            <span className="text-xs text-slate-400">idx</span>
            <input
              type="number"
              value={updateIdx}
              onChange={(e) => setUpdateIdx(e.target.value)}
              aria-label="Update index"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-cyan-500 w-14"
            />
            <span className="text-xs text-slate-400">val</span>
            <input
              type="number"
              value={updateVal}
              onChange={(e) => setUpdateVal(e.target.value)}
              aria-label="Update value"
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-cyan-500 w-14"
            />
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 min-h-[350px]">
        {/* Tree Visualization */}
        <div className="lg:col-span-3 bg-slate-800/50 rounded-xl border border-slate-700 p-4 overflow-auto">
          {!snapshot ? (
            <div className="text-slate-400 text-center py-20">
              <p>Segment Tree is empty</p>
              <p className="text-sm mt-2">
                Enter an array and click Build, or click Sample to begin
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.keys(groupedByDepth)
                .sort((a, b) => a - b)
                .map((depth) => (
                  <div
                    key={depth}
                    className="flex justify-center gap-3 flex-wrap"
                  >
                    {groupedByDepth[depth].map((node) => (
                      <TreeNode
                        key={node.id}
                        node={node}
                        highlightedNodes={highlightedNodes}
                      />
                    ))}
                  </div>
                ))}

              {/* Input Array */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-2 text-center">
                  Input Array (0-indexed)
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {snapshot.arr.map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-slate-700 border border-slate-500 rounded-lg flex items-center justify-center font-mono text-sm text-white">
                        {val}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {i}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="space-y-3">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">
              Last Result
            </div>
            {result ? (
              <div
                className={`font-mono text-xs whitespace-pre-wrap ${
                  result.type === 'insert'
                    ? 'text-cyan-400'
                    : result.type === 'success'
                      ? 'text-green-400'
                      : 'text-red-400'
                }`}
              >
                {result.message}
              </div>
            ) : (
              <div className="text-slate-500 text-xs">No operations yet</div>
            )}
          </div>

          {snapshot && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
              <div className="text-cyan-400 font-bold text-xs mb-2">Stats</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Array Size</span>
                  <span className="text-white font-mono">{snapshot.n}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tree Nodes</span>
                  <span className="text-white font-mono">
                    {snapshot.nodes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Query Type</span>
                  <span className="text-cyan-400 font-mono uppercase">
                    {snapshot.type}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">
              Complexity
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Build</span>
                <span className="text-yellow-400 font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Query</span>
                <span className="text-yellow-400 font-mono">O(log n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Update</span>
                <span className="text-yellow-400 font-mono">O(log n)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">Legend</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-700 border-2 border-slate-500" />
                <span className="text-slate-400">Internal node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-800 border-2 border-green-500" />
                <span className="text-slate-400">Leaf node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-500 border-2 border-cyan-300" />
                <span className="text-slate-400">Active node</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
