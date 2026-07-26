export default function GreedyPseudocodePanel({ lines, activeLine }) {
  return <section className="theme-card rounded-2xl border p-4 sm:p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Pseudocode</p><ol className="mt-3 space-y-1 font-mono text-sm">{lines.map((line, index) => <li key={line} className={`rounded-lg px-3 py-2 transition ${activeLine === index + 1 ? 'bg-cyan-500/15 text-cyan-300 shadow-[inset_3px_0_0_#22d3ee]' : 'theme-text-muted'}`}><span className="mr-3 text-xs opacity-60">{index + 1}</span>{line}</li>)}</ol></section>
}
