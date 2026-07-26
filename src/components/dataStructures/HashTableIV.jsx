import { useState, useCallback, useRef } from 'react'

const TABLE_SIZE = 11

class HashNode {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.next = null
  }
}

class HashTable {
  constructor(size = TABLE_SIZE) {
    this.size = size
    this.buckets = Array(size).fill(null)
    this.count = 0
  }

  hash(key) {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % this.size
    }
    return hash
  }

  insert(key, value) {
    const index = this.hash(key)
    let node = this.buckets[index]
    while (node) {
      if (node.key === key) {
        node.value = value
        return { index, updated: true }
      }
      node = node.next
    }
    const newNode = new HashNode(key, value)
    newNode.next = this.buckets[index]
    this.buckets[index] = newNode
    this.count++
    return { index, updated: false }
  }

  search(key) {
    const index = this.hash(key)
    let node = this.buckets[index]
    while (node) {
      if (node.key === key) return { found: true, index, value: node.value }
      node = node.next
    }
    return { found: false, index, value: null }
  }

  delete(key) {
    const index = this.hash(key)
    let node = this.buckets[index]
    let prev = null
    while (node) {
      if (node.key === key) {
        if (prev) prev.next = node.next
        else this.buckets[index] = node.next
        this.count--
        return { deleted: true, index }
      }
      prev = node
      node = node.next
    }
    return { deleted: false, index }
  }

  toJSON() {
    return {
      size: this.size,
      count: this.count,
      buckets: this.buckets.map((node) => {
        const chain = []
        let cur = node
        while (cur) {
          chain.push({ key: cur.key, value: cur.value })
          cur = cur.next
        }
        return chain
      }),
    }
  }
}

function getLoadFactorColor(lf) {
  if (lf < 0.5) return 'text-green-400'
  if (lf < 0.75) return 'text-yellow-400'
  return 'text-red-400'
}

export default function HashTableIV() {
  const tableRef = useRef(new HashTable())
  const [snapshot, setSnapshot] = useState(() => new HashTable().toJSON())
  const [keyInput, setKeyInput] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [operation, setOperation] = useState('insert')
  const [result, setResult] = useState(null)
  const [highlightIndex, setHighlightIndex] = useState(null)

  const refresh = useCallback(() => {
    setSnapshot(tableRef.current.toJSON())
  }, [])

  const handleReset = () => {
    tableRef.current = new HashTable()
    setSnapshot(new HashTable().toJSON())
    setResult(null)
    setHighlightIndex(null)
    setKeyInput('')
    setValueInput('')
  }

  const handleSample = () => {
    tableRef.current = new HashTable()
    const samples = [
      ['name', 'Alice'],
      ['age', '25'],
      ['city', 'Delhi'],
      ['lang', 'JS'],
      ['role', 'Dev'],
    ]
    samples.forEach(([k, v]) => tableRef.current.insert(k, v))
    refresh()
    setResult(null)
    setHighlightIndex(null)
  }

  const handleRun = () => {
    const key = keyInput.trim()
    const value = valueInput.trim()
    if (!key) return

    if (operation === 'insert') {
      if (!value) return
      const { index, updated } = tableRef.current.insert(key, value)
      refresh()
      setHighlightIndex(index)
      setResult({
        type: 'insert',
        message: updated
          ? `"${key}" updated to "${value}" at bucket ${index}`
          : `"${key}" → "${value}" inserted at bucket ${index}`,
      })
    } else if (operation === 'search') {
      const { found, index, value: val } = tableRef.current.search(key)
      setHighlightIndex(index)
      setResult({
        type: found ? 'success' : 'fail',
        message: found
          ? `"${key}" found at bucket ${index} → value: "${val}" ✓`
          : `"${key}" not found in Hash Table ✗`,
      })
    } else if (operation === 'delete') {
      const { deleted, index } = tableRef.current.delete(key)
      refresh()
      setHighlightIndex(index)
      setResult({
        type: deleted ? 'success' : 'fail',
        message: deleted
          ? `"${key}" deleted from bucket ${index} ✓`
          : `"${key}" not found, nothing deleted ✗`,
      })
    }
  }

  const loadFactor = snapshot.count / snapshot.size
  const loadFactorColor = getLoadFactorColor(loadFactor)

  return (
    <div className="flex flex-col gap-4 text-slate-200 min-h-[400px]">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700">
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-cyan-500"
        >
          <option value="insert">Insert</option>
          <option value="search">Search</option>
          <option value="delete">Delete</option>
        </select>

        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRun()}
          placeholder="Key..."
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-cyan-500 w-28"
        />

        {operation === 'insert' && (
          <input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRun()}
            placeholder="Value..."
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-cyan-500 w-28"
          />
        )}

        <button
          onClick={handleRun}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-sm transition-colors"
        >
          Run
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 min-h-[350px]">
        {/* Hash Table Visualization */}
        <div className="lg:col-span-3 bg-slate-800/50 rounded-xl border border-slate-700 p-4 overflow-auto">
          {snapshot.count === 0 ? (
            <div className="text-slate-400 text-center py-20">
              <p>Hash Table is empty</p>
              <p className="text-sm mt-2">
                Insert a key-value pair or click Sample to begin
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {snapshot.buckets.map((chain, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 ${
                    highlightIndex === i
                      ? 'bg-cyan-500/20 border border-cyan-500/50'
                      : 'bg-slate-900/40 border border-slate-700/50'
                  }`}
                >
                  {/* Index */}
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                      highlightIndex === i
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {i}
                  </div>

                  {/* Bucket arrow */}
                  <div className="text-slate-500 text-xs font-mono">→</div>

                  {/* Chain */}
                  {chain.length === 0 ? (
                    <div className="text-slate-600 text-xs font-mono">null</div>
                  ) : (
                    <div className="flex items-center gap-1 flex-wrap">
                      {chain.map((node, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <div className="flex items-center gap-1 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1">
                            <span className="text-cyan-400 font-mono text-xs font-bold">
                              {node.key}
                            </span>
                            <span className="text-slate-500 text-xs">:</span>
                            <span className="text-green-400 font-mono text-xs">
                              {node.value}
                            </span>
                          </div>
                          {j < chain.length - 1 && (
                            <span className="text-slate-500 text-xs font-mono">
                              →
                            </span>
                          )}
                        </div>
                      ))}
                      <span className="text-slate-600 text-xs font-mono">
                        → null
                      </span>
                    </div>
                  )}
                </div>
              ))}
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

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">Stats</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Table Size</span>
                <span className="text-white font-mono">{snapshot.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Items</span>
                <span className="text-white font-mono">{snapshot.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Load Factor</span>
                <span className={`font-mono font-bold ${loadFactorColor}`}>
                  {loadFactor.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">
              Hash Function
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-900/60 rounded p-2">
              {`hash(key) =\nΣ charCode(c)\n% ${snapshot.size}`}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">Legend</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-700 border border-slate-600" />
                <span className="text-slate-400">Empty bucket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-700 border border-slate-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-green-400" />
                </div>
                <span className="text-slate-400">Occupied bucket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-500/20 border border-cyan-500/50" />
                <span className="text-slate-400">Active bucket</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
