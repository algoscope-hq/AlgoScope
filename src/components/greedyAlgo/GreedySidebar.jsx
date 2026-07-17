import { BookOpen, ChevronRight } from 'lucide-react'

export default function GreedySidebar({ algorithms, selectedId, onSelect }) {
  return (
    <aside className="theme-card h-fit rounded-2xl border p-4 lg:sticky lg:top-4">
      <div className="mb-4 flex items-center gap-3 border-b pb-4 theme-border">
        <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
          <BookOpen size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Greedy module
          </p>
          <h2 className="font-bold theme-text-strong">Algorithms</h2>
        </div>
      </div>

      <nav aria-label="Greedy algorithms" className="space-y-2">
        {algorithms.map((algorithm) => {
          const isSelected = algorithm.id === selectedId

          return (
            <button
              type="button"
              key={algorithm.id}
              onClick={() => onSelect(algorithm.id)}
              aria-current={isSelected ? 'page' : undefined}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'theme-text-muted hover:bg-emerald-500/10 hover:text-emerald-400'
              }`}
            >
              <span className="text-sm font-semibold">{algorithm.name}</span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
