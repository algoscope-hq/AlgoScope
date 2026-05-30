import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

/**
 * Generates theoretical complexity curve data points that are scaled
 * to fit visually alongside the empirical measurements.
 *
 * We normalize each curve so that its value at the largest measured input size
 * roughly matches the largest empirical duration.  This lets students see
 * which theoretical curve their algorithm "follows" rather than comparing
 * raw numbers.
 */
const buildTheoreticalCurves = (empiricalData) => {
  if (!empiricalData || empiricalData.length < 2) return []

  const maxSize = Math.max(...empiricalData.map((d) => d.size))
  const maxDuration = Math.max(...empiricalData.map((d) => d.duration))

  if (maxSize === 0 || maxDuration === 0) return []

  // Raw theoretical values at maxSize (used as normalization anchors)
  const anchors = {
    'O(N)': maxSize,
    'O(N log N)': maxSize > 1 ? maxSize * Math.log2(maxSize) : 0,
    'O(N²)': maxSize * maxSize,
  }

  return empiricalData.map((point) => {
    const n = point.size
    const entry = { size: n }

    entry['O(N)'] =
      anchors['O(N)'] > 0 ? (n / anchors['O(N)']) * maxDuration : 0
    entry['O(N log N)'] =
      n > 0 && anchors['O(N log N)'] > 0
        ? ((n * Math.log2(n)) / anchors['O(N log N)']) * maxDuration
        : 0
    entry['O(N²)'] =
      anchors['O(N²)'] > 0 ? ((n * n) / anchors['O(N²)']) * maxDuration : 0

    return entry
  })
}

const curveStyles = [
  { key: 'O(N)', color: '#22d3ee', dash: '8 4' },
  { key: 'O(N log N)', color: '#a78bfa', dash: '8 4' },
  { key: 'O(N²)', color: '#f87171', dash: '8 4' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-bold text-slate-400 mb-2">
        Input Size: <span className="text-white">{label}</span>
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs font-mono"
          style={{ color: entry.color }}
        >
          {entry.name}:{' '}
          {typeof entry.value === 'number'
            ? entry.value.toFixed(3)
            : entry.value}{' '}
          ms
        </p>
      ))}
    </div>
  )
}

export default function ProfilerGraph({ data, isRunning, progress }) {
  const theoreticalData = useMemo(() => buildTheoreticalCurves(data), [data])

  // Merge empirical + theoretical into a single dataset keyed by size
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    const mergedMap = new Map()

    data.forEach((d) => {
      mergedMap.set(d.size, { size: d.size, Empirical: d.duration })
    })

    theoreticalData.forEach((d) => {
      const existing = mergedMap.get(d.size) || { size: d.size }
      mergedMap.set(d.size, { ...existing, ...d })
    })

    return Array.from(mergedMap.values()).sort((a, b) => a.size - b.size)
  }, [data, theoreticalData])

  const hasData = chartData.length >= 2

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              Empirical Runtime Graph
            </h3>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-3.5 w-3.5 text-emerald-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs text-emerald-400 font-mono">
                Profiling... {progress}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart area */}
      <div className="p-6">
        {!hasData ? (
          <div className="h-[340px] flex items-center justify-center">
            <p className="text-slate-600 italic text-sm text-center max-w-xs">
              {isRunning
                ? 'Collecting benchmark data points...'
                : 'Configure input sizes and run the profiler to visualize empirical runtime complexity.'}
            </p>
          </div>
        ) : (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="size"
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{
                    value: 'Input Size (N)',
                    position: 'insideBottomRight',
                    offset: -5,
                    style: { fontSize: 10, fill: '#64748b' },
                  }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{
                    value: 'Duration (ms)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    style: { fontSize: 10, fill: '#64748b' },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                />

                {/* Empirical data — bold, solid */}
                <Line
                  type="monotone"
                  dataKey="Empirical"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={600}
                />

                {/* Theoretical curves — dashed, thinner */}
                {curveStyles.map((curve) => (
                  <Line
                    key={curve.key}
                    type="monotone"
                    dataKey={curve.key}
                    stroke={curve.color}
                    strokeWidth={1.5}
                    strokeDasharray={curve.dash}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend explanation */}
        {hasData && (
          <div className="mt-4 pt-4 border-t border-slate-800/60">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Solid green</strong> = your
              algorithm&apos;s measured runtime.{' '}
              <strong className="text-slate-400">Dashed lines</strong> =
              theoretical complexity curves scaled to your data. Compare the
              shape of your curve against O(N), O(N log N), and O(N²) to
              empirically determine your algorithm&apos;s time complexity.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
