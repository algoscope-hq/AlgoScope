import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function GreedyAlgorithmSelector({
  algorithms,
  selectedId,
  onSelect,
}) {
  const selectedIndex = algorithms.findIndex(
    (algorithm) => algorithm.id === selectedId
  )
  const previous = algorithms[(selectedIndex - 1 + algorithms.length) % algorithms.length]
  const next = algorithms[(selectedIndex + 1) % algorithms.length]

  return (
    <section className="theme-card rounded-2xl border p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Algorithm selector
          </p>
          <h2 className="mt-1 text-lg font-bold theme-text-strong">
            Choose a greedy strategy
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSelect(previous.id)}
            className="theme-button-secondary inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            <ChevronLeft size={16} aria-hidden="true" /> Previous
          </button>
          <button
            type="button"
            onClick={() => onSelect(next.id)}
            className="theme-button-secondary inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold"
          >
            Next <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Algorithm options">
        {algorithms.map((algorithm) => {
          const isSelected = algorithm.id === selectedId

          return (
            <button
              type="button"
              key={algorithm.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(algorithm.id)}
              className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-500 text-white'
                  : 'theme-button-secondary hover:border-emerald-400/60'
              }`}
            >
              {algorithm.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}
