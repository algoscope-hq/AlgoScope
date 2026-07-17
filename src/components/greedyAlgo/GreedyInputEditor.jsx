export default function GreedyInputEditor({ config, input, source, error, onChange, onSourceChange, onRandom }) {
  return (
    <section className="theme-card rounded-2xl border p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Input editor</p>
      <label className="mt-3 block text-sm font-semibold theme-text-strong">
        {config.label}
        <textarea value={input} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm theme-text-strong" />
      </label>
      {config.source && <label className="mt-3 block text-sm font-semibold theme-text-strong">Source node<input value={source} onChange={(event) => onSourceChange(event.target.value.trim())} maxLength="12" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm theme-text-strong" /></label>}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs theme-text-muted">Comma-separate items using the format above.</p>
        <button type="button" onClick={onRandom} className="theme-button-secondary shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold">Random input</button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </section>
  )
}
