import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const generateData = (algorithm) => {
  const sizes = [10, 20, 40, 80, 120]

  return sizes.map((n) => {
    let value = 0

    if (['bubble', 'selection', 'insertion'].includes(algorithm)) {
      value = n * n
    } else if (['merge', 'quick', 'heap', 'shell'].includes(algorithm)) {
      value = n * Math.log2(n)
    } else {
      value = n
    }

    return {
      size: n,
      performance: Math.round(value),
    }
  })
}

const algorithmColors = {
  bubble: '#ef4444',
  selection: '#f59e0b',
  insertion: '#10b981',
  merge: '#06b6d4',
  quick: '#3b82f6',
  heap: '#8b5cf6',
  shell: '#ec4899',
}

export default function ComplexityGraph({ algorithm }) {
  const data = useMemo(() => generateData(algorithm), [algorithm])

  if (!algorithm) return null

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Complexity Visualization
        </p>

        <h3 className="mt-2 text-lg font-semibold text-slate-100">
          {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort
          Performance
        </h3>
      </div>

      <div className="h-[260px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="size" stroke="#cbd5e1" />

            <YAxis stroke="#cbd5e1" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="performance"
              stroke={algorithmColors[algorithm]}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
