import React from 'react';

export default function InfoPanel({ currentStep }) {
  const stats = [
    { label: 'Current Sum', value: currentStep?.currentSum ?? 0, color: 'text-cyan-400' },
    { label: 'Maximum Sum', value: currentStep?.maxSum ?? 0, color: 'text-emerald-400' },
    { label: 'Window Range', value: currentStep ? `[${currentStep.windowStart}, ${currentStep.windowEnd}]` : 'N/A', color: 'text-slate-200' },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl h-full">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80 mb-6">Step Insight</p>
      
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-slate-100 leading-snug">
          {currentStep?.description ?? 'Press start to begin the algorithm walkthrough.'}
        </h4>
        {currentStep?.why && (
          <div className="mt-3 rounded-lg border border-cyan-500/10 bg-cyan-500/5 p-3">
            <p className="text-xs italic text-cyan-300/80">
              <span className="font-bold not-italic text-cyan-400 mr-1">Why:</span>
              {currentStep.why}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 transition-all hover:border-slate-600">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
            <p className={`font-mono text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Time Complexity</p>
          <p className="font-mono text-2xl font-bold text-amber-400">O(N)</p>
        </div>
      </div>
    </div>
  );
}
