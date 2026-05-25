import React from 'react'
import Tooltip from '../Tooltip'

/**
 * MenuSelectNodesShortestPath
 *
 * Props:
 *  - source   : currently selected source node
 *  - target   : currently selected target node
 *  - setSource: setter
 *  - setTarget: setter
 *  - nodeIds  : number[] – live list of node IDs from the canvas
 */
const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.2"
    stroke="currentColor"
    className="h-5 w-5 absolute top-3.5 right-4 text-slate-400 pointer-events-none"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    />
  </svg>
)

export const MenuSelectNodesShortestPath = ({
  source,
  target,
  setSource,
  setTarget,
  algorithm,
  nodeIds = [],
}) => {
  const nodeOptions = Array.from({ length: 9 }, (_, i) => i + 1)

  if (algorithm === 'kruskal') {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
          Source &amp; Target
        </h3>
        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-slate-400 text-xs text-center font-medium">
          No source or target selection required for Kruskal&apos;s MST
          algorithm.
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        {algorithm === 'prim' ? 'Start Node' : 'Source & Target'}
      </h3>
      <div className="space-y-3">
        <div className="relative">
          <Tooltip
            content={
              algorithm === 'prim'
                ? 'Choose the start node'
                : 'Choose the source node'
            }
            position="top"
            className="w-full"
          >
            <select
              id="sp-source-select"
              value={source ?? ''}
              onChange={(e) => setSource(e.target.value || null)}
              className="w-full bg-slate-800 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">
                {algorithm === 'prim' ? 'Choose Start Node' : 'Choose Source'}
              </option>
              {nodeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Tooltip>
          <ChevronIcon />
        </div>
        {algorithm !== 'prim' && (
          <div className="relative">
            <Tooltip
              content="Choose the target node"
              position="top"
              className="w-full"
            >
              <select
                value={target ?? ''}
                onChange={(e) => setTarget(e.target.value || null)}
                className="w-full bg-slate-800 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Choose Target</option>
                {nodeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Tooltip>
            <ChevronIcon />
          </div>
        )}

        <div className="relative">
          <Tooltip
            content="Choose the target node"
            position="top"
            className="w-full"
          >
            <select
              id="sp-target-select"
              value={target ?? ''}
              onChange={(e) => setTarget(e.target.value || null)}
              className="w-full bg-slate-800 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">Choose Target</option>
              {nodeIds.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Tooltip>
          <ChevronIcon />
        </div>
      </div>

      {nodeIds.length === 0 && (
        <p className="text-xs text-amber-400/80 pl-1">
          No nodes on canvas. Add nodes using the toolbar above.
        </p>
      )}
    </div>
  )
}
