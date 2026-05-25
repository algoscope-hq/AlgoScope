import React, { useEffect, useState } from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasKMP = ({ text, pattern, speed }) => {
  const [stepIndex, setStepIndex] = useState(-1)
  const [prevInputs, setPrevInputs] = useState({ text, pattern })

  // Compute LPS and steps using useMemo to avoid setState in useEffect
  const { steps, lps, matches } = React.useMemo(() => {
    if (!text || !pattern) {
      return { steps: [], lps: [], matches: [] }
    }

    // Compute LPS
    const computedLps = new Array(pattern.length).fill(0)
    let len = 0,
      i = 1
    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        computedLps[i++] = ++len
      } else if (len) {
        len = computedLps[len - 1]
      } else {
        computedLps[i++] = 0
      }
    }

    // Simulate KMP and record each step
    const allSteps = []
    const foundMatches = []
    let ti = 0,
      pi = 0
    while (ti < text.length) {
      if (text[ti] === pattern[pi]) {
        allSteps.push({ ti, pi, match: true, foundMatches: [...foundMatches] })
        ti++
        pi++
      }
      if (pi === pattern.length) {
        foundMatches.push(ti - pi)
        allSteps.push({
          ti,
          pi,
          match: true,
          foundAt: ti - pi,
          foundMatches: [...foundMatches],
        })
        pi = computedLps[pi - 1]
      } else if (ti < text.length && text[ti] !== pattern[pi]) {
        allSteps.push({ ti, pi, match: false, foundMatches: [...foundMatches] })
        if (pi !== 0) {
          pi = computedLps[pi - 1]
        } else {
          ti++
        }
      }
    }
    return { steps: allSteps, lps: computedLps, matches: foundMatches }
  }, [text, pattern])

  // Adjust stepIndex during render when inputs change
  if (text !== prevInputs.text || pattern !== prevInputs.pattern) {
    setPrevInputs({ text, pattern })
    setStepIndex(steps.length > 0 ? 0 : -1)
  }

  // Derive status from current state
  const status = React.useMemo(() => {
    if (!steps.length || stepIndex < 0 || stepIndex >= steps.length) {
      return 'Enter text and pattern, then click Visualize.'
    }
    const step = steps[stepIndex]
    if (step.foundAt !== undefined) {
      return `✅ Match found at index ${step.foundAt}!`
    }
    return step.match
      ? `✔ text[${step.ti}] = '${text[step.ti]}' matches pattern[${step.pi}] = '${pattern[step.pi]}'`
      : `✘ Mismatch at text[${step.ti}] vs pattern[${step.pi}] — using LPS to skip`
  }, [stepIndex, steps, text, pattern])

  // Play through steps
  useEffect(() => {
    if (!steps.length || stepIndex < 0 || stepIndex >= steps.length - 1) return

    const t = setTimeout(() => setStepIndex((s) => s + 1), 900 / speed)
    return () => clearTimeout(t)
  }, [stepIndex, steps.length, speed])

  const currentStep = steps[stepIndex] || null

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 shadow-lg min-h-[380px] flex flex-col gap-6">
        {/* LPS Table */}
        {lps.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Failure Function (LPS)
            </p>
            <div className="flex flex-wrap gap-2">
              {pattern.split('').map((ch, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-slate-700 border border-slate-600 text-slate-200">
                    {ch}
                  </div>
                  <div className="text-xs text-cyan-400 mt-1">{lps[i]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text row */}
        {text && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Text
            </p>
            <div className="flex flex-wrap gap-2">
              {text.split('').map((ch, i) => {
                const isActive = currentStep && i === currentStep.ti
                const isMatched = matches.some(
                  (m) => i >= m && i < m + pattern.length
                )
                return (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                      ${
                        isActive
                          ? currentStep.match
                            ? 'bg-cyan-500 text-black border-white scale-110'
                            : 'bg-red-500/70 text-white border-red-400 scale-110'
                          : isMatched
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

        {/* Pattern row aligned under active position */}
        {pattern && currentStep && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Pattern (at position {currentStep.ti - currentStep.pi})
            </p>
            <div
              className="flex flex-wrap gap-2"
              style={{
                paddingLeft: `${(currentStep.ti - currentStep.pi) * 48}px`,
              }}
            >
              {pattern.split('').map((ch, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${
                      i === currentStep.pi
                        ? currentStep.match
                          ? 'bg-cyan-400 text-black border-white scale-110'
                          : 'bg-red-400 text-black border-white scale-110'
                        : i < currentStep.pi
                          ? 'bg-slate-600 border-slate-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match count */}
        <div className="mt-auto pt-4 border-t border-white/10 flex gap-6">
          <div className="bg-slate-800/60 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Matches Found</p>
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
        </div>
      </div>

      <div className="mt-4">
        <StatusDisplay message={status} />
      </div>
    </div>
  )
}
