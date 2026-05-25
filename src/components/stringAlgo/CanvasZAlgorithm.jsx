import React, { useEffect, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasZAlgorithm = ({ text, pattern, speed }) => {
  const [zArray, setZArray] = useState([])
  const [activeI, setActiveI] = useState(-1)
  const [matches, setMatches] = useState([])
  const [lWindow, setLWindow] = useState(-1)
  const [rWindow, setRWindow] = useState(-1)
  const [status, setStatus] = useState(
    'Enter text and pattern, then click Visualize.'
  )

  useEffect(() => {
    if (!text || !pattern) {
      setZArray([])
      setActiveI(-1)
      setMatches([])
      return
    }

    const s = pattern + '$' + text
    const n = s.length
    const z = new Array(n).fill(0)
    z[0] = n
    let l = 0,
      r = 0

    const steps = [{ i: 0, z: [...z], l, r }]
    for (let i = 1; i < n; i++) {
      if (i < r) z[i] = Math.min(r - i, z[i - l])
      while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++
      if (i + z[i] > r) {
        l = i
        r = i + z[i]
      }
      steps.push({ i, z: [...z], l, r })
    }

    const m = pattern.length
    const foundMatches = steps[steps.length - 1].z
      .slice(m + 1)
      .map((val, i) => (val === m ? i : -1))
      .filter((i) => i !== -1)
    setMatches(foundMatches)

    let idx = 0
    const tick = () => {
      if (idx >= steps.length) return
      const step = steps[idx]
      setZArray(step.z.slice(m + 1))
      setActiveI(step.i > m ? step.i - m - 1 : -1)
      setLWindow(step.l > m ? step.l - m - 1 : -1)
      setRWindow(step.r > m ? step.r - m - 1 : -1)
      const textI = step.i - m - 1
      setStatus(
        step.i === 0
          ? `Z[0] = ${n} (full string length, always)`
          : step.i <= m
            ? `Computing LPS prefix zone: position ${step.i} in pattern+'$'`
            : `Z[${textI}] = ${step.z[step.i]} — longest prefix match starting at text[${textI}]`
      )
      idx++
    }

    tick()
    const interval = setInterval(() => {
      tick()
      if (idx >= steps.length) clearInterval(interval)
    }, 800 / speed)

    return () => clearInterval(interval)
  }, [text, pattern, speed])

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 shadow-lg min-h-[380px] flex flex-col gap-6">
        {/* Text visualization */}
        {text && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Text
            </p>
            <div className="flex flex-wrap gap-2">
              {text.split('').map((ch, i) => {
                const isActive = i === activeI
                const inZBox = lWindow >= 0 && i >= lWindow && i < rWindow
                const isMatch = matches.includes(i)
                return (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                      ${
                        isActive
                          ? 'bg-cyan-500 text-black border-white scale-110'
                          : isMatch
                            ? 'bg-emerald-500 border-emerald-300 text-black'
                            : inZBox
                              ? 'bg-purple-500/40 border-purple-400 text-white'
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

        {/* Z-Array */}
        {zArray.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Z-Array (text portion)
            </p>
            <div className="flex flex-wrap gap-2">
              {text.split('').map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${
                      i === activeI
                        ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                        : matches.includes(i)
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {zArray[i] ?? 0}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{i}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
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
          <div className="bg-slate-800/60 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Z-Box [l, r]</p>
            <p className="text-sm font-mono text-purple-400 mt-1">
              [{lWindow >= 0 ? lWindow : '—'}, {rWindow >= 0 ? rWindow : '—'}]
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
