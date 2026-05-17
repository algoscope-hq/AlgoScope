import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Tooltip from '../Tooltip'

export const MenuSelectAlgorithm = ({ algorithm, setAlgorithm }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const algoFromUrl = searchParams.get('algo')
    const validAlgos = ['bfs', 'dfs']

    if (algoFromUrl && validAlgos.includes(algoFromUrl)) {
      setAlgorithm(algoFromUrl)
    }
  }, [searchParams, setAlgorithm])

  const handleSelect = (algo) => {
    setAlgorithm(algo)
    if (algo) {
      setSearchParams({ algo: algo })
    }
  }

  const getButtonClass = (algo) => {
    return `w-full text-sm font-bold py-3 px-4 rounded-xl m-1 transition-all duration-300 transform hover:-translate-y-0.5 ${
      algorithm === algo
        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/20'
        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
    }`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Algorithm
      </h3>
      <div className="flex flex-col gap-2">
        <Tooltip content="Explore nodes level by level" position="right" className="w-full">
          <button
            onClick={() => handleSelect('bfs')}
            className={getButtonClass('bfs')}
          >
            Breadth-First Search (BFS)
          </button>
        </Tooltip>
        <Tooltip content="Explore as deep as possible first" position="right" className="w-full">
          <button
            onClick={() => handleSelect('dfs')}
            className={getButtonClass('dfs')}
          >
            Depth-First Search (DFS)
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
