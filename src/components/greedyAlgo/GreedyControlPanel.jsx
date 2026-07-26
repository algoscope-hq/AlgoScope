import { Pause, Play, RotateCcw } from 'lucide-react'

export default function GreedyControlPanel() {
  return (
    <section aria-labelledby="greedy-controls-title" className="theme-card rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Control panel
          </p>
          <h2 id="greedy-controls-title" className="mt-1 text-lg font-bold theme-text-strong">
            Animation controls
          </h2>
        </div>
        <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
          Static mode
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ControlButton label="Run" icon={<Play size={16} />} />
        <ControlButton label="Pause" icon={<Pause size={16} />} />
        <ControlButton label="Reset" icon={<RotateCcw size={16} />} />
      </div>
      <p className="mt-3 text-xs leading-5 theme-text-muted">
        The dry run is static in this phase. Animation controls will be enabled later.
      </p>
    </section>
  )
}

function ControlButton({ label, icon }) {
  return (
    <button
      type="button"
      disabled
      title="Algorithm playback is not implemented yet"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-500 opacity-70"
    >
      {icon}
      {label}
    </button>
  )
}
