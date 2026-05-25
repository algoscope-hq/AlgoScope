import React from 'react'
import StatusDisplay from '../StatusDisplay'

export const CanvasSieve = ({ currentStep, inputLimit }) => {
  const n = inputLimit ?? 30
  // array represents isPrime: boolean array of size n+1
  const isPrime = currentStep?.array ?? new Array(n + 1).fill(true)

  const iVar = currentStep?.variables?.i ?? null
  const jVar = currentStep?.variables?.j ?? null
  const primesCount = currentStep?.variables?.primesCount ?? 0
  const isComplete = currentStep?.type === 'complete'
  const message = currentStep?.message ?? 'Enter limit and click Visualize.'

  // Helper to determine cell style
  const getCellClassName = (val) => {
    if (val < 2 || val > n)
      return 'bg-slate-800 border-slate-700 text-slate-500'

    const isActiveCheck = iVar === val && currentStep?.lineKey === 'checkPrime'
    const isActiveMark = jVar === val && currentStep?.lineKey === 'markFalse'
    const isComposite = !isPrime[val]
    const isConfirmedPrime = isComplete && isPrime[val]

    if (isActiveCheck) {
      return 'bg-purple-600 border-purple-400 text-white scale-110 shadow-[0_0_12px_rgba(168,85,247,0.7)] z-10'
    }
    if (isActiveMark) {
      return 'bg-red-500 border-red-400 text-white scale-110 shadow-[0_0_12px_rgba(239,68,68,0.7)] z-10'
    }
    if (isConfirmedPrime) {
      return 'bg-emerald-500 border-emerald-300 text-black scale-105 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
    }
    if (isComposite) {
      return 'bg-slate-850/40 border-slate-800/80 text-slate-600 line-through opacity-40'
    }
    // Unmarked but processed (not composite)
    return 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white'
  }

  // Create an array of numbers from 2 to n for rendering
  const numbers = []
  for (let idx = 2; idx <= n; idx++) {
    numbers.push(idx)
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-lg min-h-[350px] flex flex-col justify-between gap-8">
        {/* Prime Numbers Grid */}
        <div className="w-full flex flex-col items-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 text-center">
            Numbers 2 to {n}
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 w-full max-w-xl justify-center">
            {numbers.map((val) => (
              <div
                key={val}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center text-sm sm:text-base font-bold border-2 transition-all duration-300 cursor-default select-none ${getCellClassName(val)}`}
              >
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Statistics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Current Divisor (i)
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 mt-2 font-mono">
              {iVar !== null ? iVar : '—'}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Marking Multiple (j)
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-400 mt-2 font-mono">
              {jVar !== null ? jVar : '—'}
            </h2>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-700/60 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Primes Discovered
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2 font-mono">
              {primesCount}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-2">
        <StatusDisplay message={message} />
      </div>
    </div>
  )
}
