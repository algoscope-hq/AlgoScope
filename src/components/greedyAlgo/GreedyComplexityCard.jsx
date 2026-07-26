export default function GreedyComplexityCard({ complexity }) {
  return (
    <section aria-label="Complexity analysis" className="theme-card rounded-2xl border p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
        Complexity
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Time" value={complexity.time} />
        <Metric label="Space" value={complexity.space} />
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border p-3 theme-border">
      <p className="text-xs uppercase tracking-wider theme-text-subtle">{label}</p>
      <p className="mt-1 break-words text-sm font-bold theme-text-strong">{value}</p>
    </div>
  )
}
