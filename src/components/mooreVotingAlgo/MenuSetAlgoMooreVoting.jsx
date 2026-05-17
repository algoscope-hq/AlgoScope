import React from 'react'

export const MenuSetAlgoMooreVoting = ({
  arrayInput,
  setArrayInput,
  onVisualize,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Moore&apos;s Voting Controls
      </h3>

      <div className="space-y-3">
        <textarea
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="2,2,1,1,1,2,2"
          className="w-full h-28 resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500"
        />

        <button
          onClick={onVisualize}
          className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          Visualize Moore&apos;s Voting
        </button>

        <button
          onClick={onReset}
          className="w-full text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
