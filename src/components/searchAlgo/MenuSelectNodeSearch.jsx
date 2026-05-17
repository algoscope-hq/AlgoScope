import React, { useState } from 'react'
import Tooltip from '../Tooltip'

export const MenuSelectNodeSearch = ({ setNode }) => {
  const [nodeValue, setNodeValue] = useState('')

  const handleChange = (e) => {
    setNodeValue(e.target.value)
    setNode(e.target.value)
  }

  const handleReset = () => {
    setNodeValue('')
    setNode(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Starting Node
      </h3>
      <form className="m-auto">
        <div className="w-full ma-w-sm min-w-[200px]">
          <div className="relative">
            <Tooltip content="Choose the node to start traversal from" position="top" className="w-full">
              <select
                value={nodeValue}
                onChange={handleChange}
                className="w-full bg-slate-800 placeholder:text-slate-500 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm focus:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Choose a Starting Node</option>
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
      <Tooltip content="Clear node selection and reset" position="top" className="w-full">
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
