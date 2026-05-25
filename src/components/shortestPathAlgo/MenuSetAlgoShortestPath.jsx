import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Tooltip from '../Tooltip'

export const MenuSetAlgoShortestPath = ({ algorithm, setAlgorithm }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const algoFromUrl = searchParams.get('algo')
    const validAlgos = [
      'dijkstra',
      'bellmanford',
      'floydwarshall',
      'prim',
      'kruskal',
    ]
    if (algoFromUrl && validAlgos.includes(algoFromUrl)) {
      setAlgorithm(algoFromUrl)
    }
  }, [searchParams, setAlgorithm])

  const handleChange = (e) => {
    const selected = e.target.value
    setAlgorithm(selected || null)
    if (selected) {
      setSearchParams({ algo: selected })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
        Algorithm
      </h3>
      <div className="relative">
        <Tooltip
          content="Choose a shortest path algorithm to visualize"
          position="top"
          className="w-full"
        >
          <select
            value={algorithm ?? ''}
            onChange={handleChange}
            className="w-full bg-slate-800 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-500 shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Choose an Algorithm</option>
            <option value="dijkstra">Dijkstra</option>
            <option value="bellmanford">Bellman-Ford</option>
            <option value="floydwarshall">Floyd–Warshall</option>
            <option value="prim">Prim&apos;s MST</option>
            <option value="kruskal">Kruskal&apos;s MST</option>
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
    </div>
  )
}
