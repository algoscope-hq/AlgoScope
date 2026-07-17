import GreedyLegend from './GreedyLegend'

const STATUS_CLASSES = {
  current: 'border-cyan-400 bg-cyan-500/20 text-cyan-200 scale-105 shadow-[0_0_20px_rgba(34,211,238,0.25)]',
  selected: 'border-emerald-400 bg-emerald-500/20 text-emerald-200',
  rejected: 'border-rose-400 bg-rose-500/20 text-rose-200 line-through',
  pending: 'border-slate-700 bg-slate-900/70 theme-text-muted',
}

export default function GreedyVisualizationArea({ algorithm, step, stepIndex, stepCount }) {
  const entities = step?.entities ?? []
  return (
    <section aria-labelledby="greedy-visualization-title" className="theme-card overflow-hidden rounded-2xl border">
      <div className="border-b p-5 sm:p-6 theme-border">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Visualization area</p><h2 id="greedy-visualization-title" className="mt-2 text-2xl font-bold theme-text-strong">{algorithm.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">{algorithm.summary}</p></div>{step && <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-400">Step {stepIndex + 1} of {stepCount}</span>}</div>
        <div className="mt-4"><GreedyLegend /></div>
      </div>
      <div className="min-h-80 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 p-5 sm:p-6">
        {step ? <><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{entities.map((entity) => <div key={entity.label} className={`rounded-xl border p-3 text-center text-sm font-bold transition-all duration-300 ${STATUS_CLASSES[entity.status]}`}><span className="break-words">{entity.label}</span></div>)}</div><div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-950/50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">Current explanation</p><p className="mt-2 text-sm leading-6 theme-text-strong">{step.explanation}</p><p className="mt-3 border-t pt-3 text-xs theme-text-muted">{step.state}</p></div></> : <div className="flex min-h-64 items-center justify-center text-center"><div><p className="text-lg font-bold theme-text-strong">Ready to visualize</p><p className="mt-2 text-sm theme-text-muted">Edit the input and select Start to generate a step-by-step walkthrough.</p></div></div>}
      </div>
    </section>
  )
}
