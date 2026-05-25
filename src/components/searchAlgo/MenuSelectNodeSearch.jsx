import React from 'react'
import Tooltip from '../Tooltip'

/**
 * MenuSelectNodeSearch
 *
 * Props:
 *  - node     : currently selected starting node
 *  - setNode  : setter
 *  - nodeIds  : number[] – live list of node IDs from the canvas
 */
export const MenuSelectNodeSearch = ({ node, setNode, nodeIds = [] }) => {
  const handleChange = (e) => {
    setNode(e.target.value || null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Starting Node
      </h3>
      <div className="relative">
        <Tooltip
          content="Choose the starting node for graph traversal"
          position="top"
          className="w-full"
        >
          <select
            id="search-start-node-select"
            value={node ?? ''}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Choose a Starting Node</option>
            {nodeIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Tooltip>
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
      </div>

      {nodeIds.length === 0 && (
        <p className="text-xs text-amber-400/80 pl-1">
          No nodes on canvas. Add nodes using the toolbar above.
        </p>
      )}
    </div>
  )
}
