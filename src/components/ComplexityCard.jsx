import { complexityMap } from '../data/complexityMap'

const METRICS = [
  ['Best', 'best'],
  ['Average', 'average'],
  ['Worst', 'worst'],
  ['Space', 'space'],
]

const ComplexityCard = ({ algorithm, compact = false }) => {
  if (!algorithm || !complexityMap[algorithm]) return null

  const current = complexityMap[algorithm]

  return (
    <div
      className={`bg-slate-950/70 border border-slate-700 rounded-xl flex flex-col ${
        compact ? 'gap-3 px-4 py-4' : 'gap-4 px-6 py-4'
      }`}
    >
      <h2
        className={`text-cyan-400 font-bold uppercase ${
          compact
            ? 'text-xs leading-5 tracking-[0.16em]'
            : 'text-sm tracking-[0.18em]'
        }`}
      >
        Complexity Analysis
      </h2>

      <div
        className={`grid ${
          compact
            ? 'grid-cols-2 gap-3'
            : 'grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4'
        }`}
      >
        {METRICS.map(([label, key]) => (
          <div
            key={key}
            className={`min-w-0 rounded-lg border border-slate-700/50 bg-slate-900/60 ${
              compact ? 'px-3 py-3 text-center' : 'px-4 py-3'
            }`}
          >
            <p
              className={`mb-1 uppercase text-slate-400 ${
                compact ? 'text-[10px] tracking-wide' : 'text-xs tracking-wider'
              }`}
            >
              {label}
            </p>
            <p className="whitespace-nowrap font-semibold leading-snug text-sm text-white">
              {current[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComplexityCard
