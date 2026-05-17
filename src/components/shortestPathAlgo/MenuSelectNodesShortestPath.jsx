import React, { useState } from 'react'
import Tooltip from '../Tooltip'

export const MenuSelectNodesShortestPath = ({
  setSource,
  setTarget,
  onReset,
}) => {
  const [sourceValue, setSourceValue] = useState('')
  const [targetValue, setTargetValue] = useState('')

  const handleChangeSource = (e) => {
    setSourceValue(e.target.value)
    setSource(e.target.value)
  }

  const handleChangeTarget = (e) => {
    setTargetValue(e.target.value)
    setTarget(e.target.value)
  }

  const handleReset = () => {
    setSourceValue('')
    setTargetValue('')
    setSource(null)
    setTarget(null)
    if (onReset) onReset()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Source & Target
      </h3>
      <form className="m-auto space-y-3">
        <div className="w-full max-w-sm min-w-[200px]">
          <div className="relative">
            <Tooltip content="Select the starting node" position="top" className="w-full">
              <select
                value={sourceValue}
                onChange={handleChangeSource}
                className="w-full bg-slate-800 placeholder:text-slate-500 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Choose Source</option>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((element) => (
                  <option key={element} value={element}>
                    {element}
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
              className="h-5 w-5 ml-1 absolute top-3.5 right-4 text-slate-400 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-sm min-w-[200px]">
          <div className="relative">
            <Tooltip content="Select the destination node" position="top" className="w-full">
              <select
                value={targetValue}
                onChange={handleChangeTarget}
                className="w-full bg-slate-800 placeholder:text-slate-500 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Choose Target</option>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((element) => (
                  <option key={element} value={element}>
                    {element}
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
              className="h-5 w-5 ml-1 absolute top-3.5 right-4 text-slate-400 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
        </div>
      </form>
      <Tooltip content="Clear source and target selections" position="top" className="w-full">
        <button
          onClick={handleReset}
          className="w-full text-sm font-bold py-3 px-4 rounded-xl mt-2 transition-all duration-300 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Reset
        </button>
      </Tooltip>
    </div>
  )
}
