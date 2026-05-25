import React, { useEffect, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

const PRIME = 101
const BASE = 256

function computeHash(str) {
  return str.split('').reduce((h, c) => (BASE * h + c.charCodeAt(0)) % PRIME, 0)
}

export const CanvasRabinKarp = ({ text, pattern, speed }) => {
  const [windowIndex, setWindowIndex] = useState(-1)
  const [currentHash, setCurrentHash] = useState(null)
  const [matches, setMatches] = useState([])
  const [isSpurious, setIsSpurious] = useState(false)
  const [status, setStatus] = useState(
    'Enter text and pattern, then click Visualize.'
  )

  useEffect(() => {
    if (!text || !pattern) {
      setWindowIndex(-1)
      setMatches([])
      return
    }
    const n = text.length,
      m = pattern.length
    const pHash = computeHash(pattern)
    let h = 1
    for (let i = 0; i < m - 1; i++) h = (h * BASE) % PRIME

    const foundMatches = []
    const allSteps = []
    let winHash = computeHash(text.slice(0, m))

    for (let i = 0; i <= n - m; i++) {
      const windowStr = text.slice(i, i + m)
      const isHashMatch = winHash === pHash
      const isRealMatch = isHashMatch && windowStr === pattern
      if (isRealMatch) foundMatches.push(i)
      allSteps.push({
        i,
        winHash,
        isHashMatch,
        isSpurious: isHashMatch && !isRealMatch,
        matches: [...foundMatches],
      })

      if (i < n - m) {
        winHash =
          (BASE * (winHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) %
          PRIME
        if (winHash < 0) winHash += PRIME
      }
    }

    let idx = 0
    const tick = () => {
      if (idx >= allSteps.length) {
        return
      }
      const step = allSteps[idx]
      setWindowIndex(step.i)
      setCurrentHash(step.winHash)
      setIsSpurious(step.isSpurious)
      setMatches(step.matches)
      setStatus(
        step.isSpurious
          ? `Hash collision at [${step.i}]! Hash=${step.winHash} matches, but string does not. Spurious hit.`
          : step.isHashMatch
            ? `✅ Match at index ${step.i}! Hash=${step.winHash}`
            : `Window [${step.i}]: hash=${step.winHash} ≠ pattern hash=${pHash}`
      )
      idx++
    }

    tick()
    const interval = setInterval(() => {
      tick()
      if (idx >= allSteps.length) clearInterval(interval)
    }, 900 / speed)

    return () => clearInterval(interval)
  }, [text, pattern, speed])

  const m = pattern?.length || 0

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 shadow-lg min-h-[380px] flex flex-col gap-6">
        {/* Hash values */}
        <div className="flex gap-4">
          <div className="bg-slate-800/60 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Pattern Hash</p>
            <p className="text-xl font-bold text-purple-400 mt-1 font-mono">
              {pattern ? computeHash(pattern) : '—'}
            </p>
          </div>
          <div
            className={`rounded-xl px-5 py-3 border transition-colors duration-300
            ${isSpurious ? 'bg-yellow-900/30 border-yellow-500' : 'bg-slate-800/60 border-slate-700'}`}
          >
            <p className="text-slate-400 text-xs">Window Hash</p>
            <p
              className={`text-xl font-bold mt-1 font-mono ${isSpurious ? 'text-yellow-400' : 'text-cyan-400'}`}
            >
              {currentHash !== null ? currentHash : '—'}
            </p>
          </div>
        </div>

        {/* Text with sliding window */}
        {text && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Text (sliding window)
            </p>
            <div className="flex flex-wrap gap-2">
              {text.split('').map((ch, i) => {
                const inWindow =
                  windowIndex >= 0 && i >= windowIndex && i < windowIndex + m
                const inMatch = matches.some(
                  (mIdx) => i >= mIdx && i < mIdx + m
                )
                return (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                      ${
                        inWindow
                          ? isSpurious
                            ? 'bg-yellow-500/60 border-yellow-400 text-white scale-105'
                            : matches[matches.length - 1] === windowIndex &&
                                inMatch
                              ? 'bg-emerald-500 border-white text-black scale-110'
                              : 'bg-cyan-500/60 border-cyan-400 text-white scale-105'
                          : inMatch
                            ? 'bg-emerald-500/30 border-emerald-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                  >
                    {ch}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Match stats */}
        <div className="mt-auto pt-4 border-t border-white/10 flex gap-4">
          <div className="bg-slate-800/60 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Matches</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {matches.length}
            </p>
          </div>
          <div className="bg-slate-800/60 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Positions</p>
            <p className="text-sm font-mono text-cyan-400 mt-1">
              {matches.length ? `[${matches.join(', ')}]` : '—'}
            </p>
          </div>
          {isSpurious && (
            <div className="bg-yellow-900/20 rounded-xl px-5 py-3 border border-yellow-700">
              <p className="text-yellow-400 text-xs">⚠ Spurious Hit</p>
              <p className="text-xs text-slate-300 mt-1">
                Hash matched, string did not
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
