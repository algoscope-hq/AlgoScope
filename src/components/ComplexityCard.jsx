import React from 'react'
import { complexityMap } from '../data/complexityMap'

const ComplexityCard = ({ algorithm }) => {
  if (!algorithm || !complexityMap[algorithm]) return null

  const current = complexityMap[algorithm]

  return (
    <div className="bg-slate-950/70 border border-slate-700 rounded-xl px-6 py-4 flex flex-col gap-4">
      <h2 className="text-cyan-400 font-bold text-sm uppercase tracking-[0.18em]">
        Complexity Analysis
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">
            Best
          </p>
          <p className="text-white font-semibold text-sm">{current.best}</p>
        </div>

        <div className="bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">
            Average
          </p>
          <p className="text-white font-semibold text-sm">{current.average}</p>
        </div>

        <div className="bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">
            Worst
          </p>
          <p className="text-white font-semibold text-sm">{current.worst}</p>
        </div>

        <div className="bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-700/50">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">
            Space
          </p>
          <p className="text-white font-semibold text-sm">{current.space}</p>
        </div>
      </div>
    </div>
  )
}

export default ComplexityCard
