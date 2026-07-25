import React, { useState, useCallback, useRef } from 'react'

class TrieNode {
  constructor() {
    this.children = {}
    this.isEnd = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(word) {
    let node = this.root
    const path = ['']
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode()
      }
      node = node.children[char]
      path.push(char)
    }
    node.isEnd = true
    return path
  }

  search(word) {
    let node = this.root
    const path = ['']
    for (const char of word) {
      if (!node.children[char]) return { found: false, path }
      node = node.children[char]
      path.push(char)
    }
    return { found: node.isEnd, path }
  }

  startsWith(prefix) {
    let node = this.root
    const path = ['']
    for (const char of prefix) {
      if (!node.children[char]) return { found: false, path }
      node = node.children[char]
      path.push(char)
    }
    return { found: true, path }
  }

  toJSON(node = this.root, prefix = '') {
    return {
      label: prefix === '' ? 'root' : prefix[prefix.length - 1],
      fullPrefix: prefix,
      isEnd: node.isEnd,
      children: Object.entries(node.children).map(([char, child]) =>
        this.toJSON(child, prefix + char)
      ),
    }
  }
}

function TrieNodeView({ node, highlightPath, depth = 0 }) {
  const isHighlighted = highlightPath.includes(node.fullPrefix)
  const isLeaf = node.children.length === 0

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2 transition-all duration-300 ${
          isHighlighted
            ? 'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_12px_rgba(6,182,212,0.6)]'
            : node.isEnd
              ? 'bg-green-700 border-green-400 text-white'
              : depth === 0
                ? 'bg-slate-600 border-slate-400 text-slate-200'
                : 'bg-slate-800 border-slate-600 text-slate-300'
        }`}
      >
        {node.label === 'root' ? '·' : node.label}
      </div>

      {node.isEnd && (
        <div className="text-green-400 text-[9px] mt-0.5 font-mono">END</div>
      )}

      {node.children.length > 0 && (
        <div className="flex gap-4 mt-4 relative">
          <div
            className="absolute top-0 left-0 right-0 h-px bg-slate-600"
            style={{ top: '-8px' }}
          />
          {node.children.map((child) => (
            <div key={child.fullPrefix} className="flex flex-col items-center">
              <div className="w-px h-4 bg-slate-600" />
              <TrieNodeView
                node={child}
                highlightPath={highlightPath}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TrieIV() {
  const trieRef = useRef(new Trie())
  const [, forceUpdate] = useState(0)
  const [inputWord, setInputWord] = useState('')
  const [operation, setOperation] = useState('insert')
  const [result, setResult] = useState(null)
  const [highlightPath, setHighlightPath] = useState([])
  const [words, setWords] = useState([])

  const refresh = useCallback(() => forceUpdate((n) => n + 1), [])

  const handleReset = () => {
    trieRef.current = new Trie()
    setWords([])
    setResult(null)
    setHighlightPath([])
    setInputWord('')
    refresh()
  }

  const handleSample = () => {
    trieRef.current = new Trie()
    const sample = ['apple', 'app', 'apt', 'bat', 'ball', 'band']
    sample.forEach((w) => trieRef.current.insert(w))
    setWords(sample)
    setResult(null)
    setHighlightPath([])
    refresh()
  }

  const handleRun = () => {
    const word = inputWord.trim().toLowerCase()
    if (!word) return

    if (operation === 'insert') {
      const path = trieRef.current.insert(word)
      setWords((prev) => (prev.includes(word) ? prev : [...prev, word]))
      setHighlightPath(
        path.reduce(
          (acc, _, i) => {
            acc.push(path.slice(1, i + 1).join(''))
            return acc
          },
          ['']
        )
      )
      setResult({
        type: 'insert',
        word,
        message: `"${word}" inserted into Trie`,
      })
      refresh()
    } else if (operation === 'search') {
      const { found, path } = trieRef.current.search(word)
      setHighlightPath(
        path.reduce(
          (acc, _, i) => {
            acc.push(path.slice(1, i + 1).join(''))
            return acc
          },
          ['']
        )
      )
      setResult({
        type: found ? 'success' : 'fail',
        word,
        message: found
          ? `"${word}" found in Trie ✓`
          : `"${word}" not found in Trie ✗`,
      })
    } else if (operation === 'startsWith') {
      const { found, path } = trieRef.current.startsWith(word)
      setHighlightPath(
        path.reduce(
          (acc, _, i) => {
            acc.push(path.slice(1, i + 1).join(''))
            return acc
          },
          ['']
        )
      )
      setResult({
        type: found ? 'success' : 'fail',
        word,
        message: found
          ? `Prefix "${word}" exists in Trie ✓`
          : `Prefix "${word}" not found in Trie ✗`,
      })
    }
  }

  const trieJSON = trieRef.current.toJSON()

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
          <option value="startsWith">StartsWith</option>
        </select>

        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRun()}
          placeholder="Enter word..."
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-cyan-500 w-36"
        />

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
        {/* Trie Visualization */}
        <div className="lg:col-span-3 bg-slate-800/50 rounded-xl border border-slate-700 p-4 overflow-auto">
          {words.length === 0 ? (
            <div className="text-slate-400 text-center py-20">
              <p>Trie is empty</p>
              <p className="text-sm mt-2">
                Insert a word or click Sample to begin
              </p>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <TrieNodeView
                node={trieJSON}
                highlightPath={highlightPath}
                depth={0}
              />
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
            <div className="text-cyan-400 font-bold text-xs mb-2">
              Words Inserted ({words.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {words.map((w) => (
                <span
                  key={w}
                  className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3">
            <div className="text-cyan-400 font-bold text-xs mb-2">Legend</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-400" />
                <span className="text-slate-400">Root node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600" />
                <span className="text-slate-400">Inner node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-700 border-2 border-green-400" />
                <span className="text-slate-400">End of word</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-cyan-300" />
                <span className="text-slate-400">Highlighted path</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
