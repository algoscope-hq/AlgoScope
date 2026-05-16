import React from 'react';
import SpeedSlider from '../SpeedSlider';

export default function ControlPanel({
  isRunning,
  hasSteps,
  isComplete,
  windowSize,
  setWindowSize,
  speed,
  setSpeed,
  onStart,
  onGenerate,
  onPlayPause,
  onStep,
  onReplay,
  goToStep,
  currentStepIndex,
  totalSteps,
  customInput,
  setCustomInput,
  onCustomInputSubmit
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Config Card */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5 shadow-xl">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">Configuration</h3>
        
        <div className="space-y-5">
          {/* Custom Input */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">Custom Array (comma separated)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 2, 5, 1, 8, 3"
                disabled={isRunning}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={onCustomInputSubmit}
                disabled={isRunning || !customInput}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-cyan-400 border border-slate-700 hover:border-cyan-500 disabled:opacity-50"
              >
                Set
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">Window Size (K)</label>
            <input 
              type="range"
              min="2"
              max="6"
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-cyan-500 bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2</span>
              <span className="text-cyan-400 font-bold">{windowSize}</span>
              <span>6</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-3">
            <SpeedSlider 
              value={speed}
              onChange={(e, v) => setSpeed(v)}
              min={0.25}
              max={3}
              step={0.05}
            />
          </div>

          <div className="grid gap-3">
            <button
              onClick={onStart}
              disabled={isRunning}
              className="group relative overflow-hidden rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50"
            >
              <span className="relative z-10">{hasSteps ? 'Restart' : 'Start Visualization'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button
              onClick={onGenerate}
              disabled={isRunning}
              className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-700 disabled:opacity-50"
            >
              Random Array
            </button>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      {hasSteps && (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 shadow-xl">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80">Timeline</p>
                <p className="text-sm font-mono text-slate-400">Step {currentStepIndex + 1} / {totalSteps}</p>
              </div>
              <div className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                isRunning ? 'bg-cyan-500/20 text-cyan-400' : isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {isRunning ? 'Playing' : isComplete ? 'Finished' : 'Paused'}
              </div>
            </div>

            {/* Timeline Scrubber */}
            <div className="relative pt-1 pb-4">
              <input 
                type="range"
                min="0"
                max={totalSteps - 1}
                value={currentStepIndex}
                onChange={(e) => goToStep(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-slate-600 font-mono">Start</span>
                <span className="text-[10px] text-slate-600 font-mono">End</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onPlayPause}
              disabled={isComplete && !isRunning}
              className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs font-bold text-slate-100 transition hover:border-cyan-500 hover:bg-slate-700 disabled:opacity-30"
            >
              {isRunning ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={onStep}
              disabled={isRunning || isComplete}
              className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs font-bold text-slate-100 transition hover:border-cyan-500 hover:bg-slate-700 disabled:opacity-30"
            >
              Next
            </button>
            <button
              onClick={onReplay}
              className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs font-bold text-slate-100 transition hover:border-cyan-500 hover:bg-slate-700"
            >
              Replay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
