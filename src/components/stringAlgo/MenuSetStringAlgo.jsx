import React from 'react'
import Tooltip from '../Tooltip'

const ALGORITHMS = [
  { value: 'kmp', label: 'KMP' },
  { value: 'rabinkarp', label: 'Rabin-Karp' },
  { value: 'zalgorithm', label: 'Z-Algorithm' },
]

export const MenuSetStringAlgo = ({
  textInput,
  setTextInput,
  patternInput,
  setPatternInput,
  algorithm,
  setAlgorithm,
  onVisualize,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        String Controls
      </h3>

      <div className="space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider pl-1">
          Algorithm
        </p>
        <div className="flex flex-col gap-2">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.value}
              onClick={() => setAlgorithm(algo.value)}
              className={`w-full rounded-xl px-4 py-2 text-sm font-semibold border transition-all duration-200
                ${
                  algorithm === algo.value
                    ? 'bg-cyan-500 text-black border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-600 hover:text-white'
                }`}
            >
              {algo.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Tooltip
          content="The text to search within"
          position="right"
          className="w-full"
        >
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 pl-1">
              Text
            </p>
            <input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. AABAACAADAABAABA"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500 text-sm"
            />
          </div>
        </Tooltip>

        <Tooltip
          content="The pattern to find inside the text"
          position="right"
          className="w-full"
        >
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 pl-1">
              Pattern
            </p>
            <input
              value={patternInput}
              onChange={(e) => setPatternInput(e.target.value)}
              placeholder="e.g. AABA"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500 text-sm"
            />
          </div>
        </Tooltip>

        <Tooltip
          content="Run the visualization"
          position="top"
          className="w-full"
        >
          <button
            onClick={onVisualize}
            className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            Visualize
          </button>
        </Tooltip>

        <Tooltip content="Reset to defaults" position="top" className="w-full">
          <button
            onClick={onReset}
            className="w-full text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
          >
            Reset
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
