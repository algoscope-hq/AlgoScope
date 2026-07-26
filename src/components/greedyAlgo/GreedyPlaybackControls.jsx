import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import SpeedSlider from '../SpeedSlider'

export default function GreedyPlaybackControls({ hasSteps, isPlaying, isComplete, index, total, speed, onStart, onPause, onResume, onReset, onBack, onForward, onSpeedChange }) {
  return (
    <section className="theme-card rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Control panel</p><h2 className="mt-1 text-lg font-bold theme-text-strong">Playback</h2></div><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">{hasSteps ? `${index + 1} / ${total}` : 'Ready'}</span></div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Action label={hasSteps ? (isPlaying ? 'Pause' : 'Resume') : 'Start'} icon={isPlaying ? <Pause size={16} /> : <Play size={16} />} onClick={hasSteps ? (isPlaying ? onPause : onResume) : onStart} disabled={hasSteps && isComplete && !isPlaying} />
        <Action label="Back" icon={<SkipBack size={16} />} onClick={onBack} disabled={!hasSteps || isPlaying || index <= 0} />
        <Action label="Next" icon={<SkipForward size={16} />} onClick={onForward} disabled={!hasSteps || isPlaying || isComplete} />
      </div>
      <button type="button" onClick={onReset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold theme-text-muted hover:border-emerald-400 hover:text-emerald-400"><RotateCcw size={16} /> Reset</button>
      <div className="mt-4"><SpeedSlider value={speed} onChange={(_, value) => onSpeedChange(value)} min={0.5} max={3} step={0.1} /></div>
    </section>
  )
}

function Action({ label, icon, onClick, disabled }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">{icon}{label}</button>
}
