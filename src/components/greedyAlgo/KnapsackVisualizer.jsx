import React from 'react'
import GreedyBlock from './GreedyBlock'
import { motion } from 'framer-motion'

const ITEM_COLORS = [
  {
    bg: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-400',
    text: 'text-cyan-300',
    light: 'bg-cyan-500/10',
  },
  {
    bg: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-400',
    text: 'text-emerald-300',
    light: 'bg-emerald-500/10',
  },
  {
    bg: 'from-purple-500 to-indigo-600',
    border: 'border-purple-400',
    text: 'text-purple-300',
    light: 'bg-purple-500/10',
  },
  {
    bg: 'from-amber-500 to-orange-600',
    border: 'border-amber-400',
    text: 'text-amber-300',
    light: 'bg-amber-500/10',
  },
  {
    bg: 'from-rose-500 to-red-600',
    border: 'border-rose-400',
    text: 'text-rose-300',
    light: 'bg-rose-500/10',
  },
  {
    bg: 'from-fuchsia-500 to-pink-600',
    border: 'border-fuchsia-400',
    text: 'text-fuchsia-300',
    light: 'bg-fuchsia-500/10',
  },
]

export default function KnapsackVisualizer({ currentStep }) {
  const items = React.useMemo(
    () => currentStep?.items || [],
    [currentStep?.items]
  )
  const knapsackState = currentStep?.knapsackState || {
    capacityLeft: 50,
    totalCapacity: 50,
    totalValue: 0,
    contents: [],
  }

  // Map each item ID to its color index so color is stable
  const itemColorMap = React.useMemo(() => {
    const map = {}
    items.forEach((item, idx) => {
      map[item.id] = ITEM_COLORS[idx % ITEM_COLORS.length]
    })
    return map
  }, [items])

  const totalCapacity = knapsackState.totalCapacity
  const capacityLeft = knapsackState.capacityLeft
  const capacityUsed = totalCapacity - capacityLeft
  const totalValue = knapsackState.totalValue

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
        {/* Item List and Status */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
              Items Directory
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const colors = itemColorMap[item.id] || ITEM_COLORS[0]

                let statusBadge = 'bg-slate-800 border-slate-700 text-slate-400'
                let cardBorder = 'border-slate-800 bg-slate-950/40 opacity-70'

                if (item.status === 'ratio-calculated') {
                  statusBadge = 'bg-slate-800 border-slate-700 text-slate-300'
                  cardBorder = 'border-slate-700 bg-slate-950/50 opacity-90'
                } else if (item.status === 'sorted') {
                  statusBadge =
                    'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                  cardBorder = 'border-slate-700/80 bg-slate-950/60'
                } else if (item.status === 'active') {
                  statusBadge =
                    'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
                  cardBorder =
                    'border-yellow-500 bg-yellow-500/5 scale-102 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
                } else if (item.status === 'packed') {
                  statusBadge =
                    'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                  cardBorder = `border-emerald-500/30 ${colors.light}`
                } else if (item.status === 'fractioned') {
                  statusBadge =
                    'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  cardBorder = `border-indigo-500/30 ${colors.light}`
                } else if (item.status === 'skipped') {
                  statusBadge =
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  cardBorder = 'border-slate-800 bg-slate-950/20 opacity-40'
                }

                return (
                  <motion.div
                    key={item.id}
                    className={`rounded-2xl border p-3 flex flex-col justify-between transition-all duration-300 min-h-[135px] relative ${cardBorder}`}
                    layoutId={`item-card-${item.id}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-slate-100">
                          {item.id}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${statusBadge}`}
                        >
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400 mt-2 font-mono">
                        <div>
                          Value:{' '}
                          <span className="text-white font-bold">
                            ${item.value}
                          </span>
                        </div>
                        <div>
                          Weight:{' '}
                          <span className="text-white font-bold">
                            {item.weight} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/80 pt-2.5 mt-2.5 flex items-center justify-between">
                      <div className="text-xs">
                        <p className="text-[9px] uppercase tracking-wider text-slate-500">
                          Ratio (V/W)
                        </p>
                        <p className="font-bold font-mono text-cyan-400">
                          ${item.ratio}
                        </p>
                      </div>

                      {(item.status === 'packed' ||
                        item.status === 'fractioned') && (
                        <div className="text-right text-[10px] text-slate-300">
                          <p className="text-[9px] uppercase tracking-wider text-slate-500">
                            Packed
                          </p>
                          <p className="font-bold font-mono text-emerald-400">
                            {(item.packedRatio * 100).toFixed(0)}% (
                            {item.packedWeight} kg)
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Legend and tips */}
          <div className="mt-4 border-t border-slate-800/80 pt-3 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-300">Greedy Choice Rule:</p>
            <p>
              Pick items with the maximum Value-to-Weight ratio ($ per kg)
              first. If a full item does not fit, slice it fractionally to fill
              the remaining capacity.
            </p>
          </div>
        </div>

        {/* Visual Knapsack Packing */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex flex-col items-center">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-4 self-start">
            Knapsack Cargo Box
          </h3>

          {/* Knapsack visual stack */}
          <div className="w-full flex justify-center py-4">
            <div className="relative w-64 h-80 border-4 border-t-0 border-slate-700 bg-slate-950/70 rounded-b-2xl shadow-inner flex flex-col justify-end p-1.5 overflow-hidden">
              {/* Backgrid capacity indicators */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 select-none">
                {[100, 75, 50, 25, 0].map((percent) => (
                  <div
                    key={percent}
                    className="flex items-center gap-2 opacity-15"
                  >
                    <span className="text-[10px] font-mono text-white">
                      {percent}%
                    </span>
                    <div className="flex-1 h-px border-t border-dashed border-white"></div>
                  </div>
                ))}
              </div>

              {/* Stack items */}
              <div className="w-full h-full flex flex-col justify-end relative z-10">
                {knapsackState.contents.map((block, idx) => {
                  const colors = itemColorMap[block.id] || ITEM_COLORS[0]
                  const heightPercent = (block.weight / totalCapacity) * 100
                  const isFraction = block.fraction < 1

                  return (
                    <motion.div
                      key={`${block.id}-${idx}`}
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full bg-gradient-to-r ${colors.bg} rounded-lg border ${colors.border} flex flex-col items-center justify-center text-white p-1 select-none overflow-hidden relative shadow-md mb-0.5`}
                      initial={{ scaleY: 0, originY: 1, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      {/* Fractional slice stripe overlay */}
                      {isFraction && (
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.15)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[pulse_2s_infinite]"></div>
                      )}

                      <span className="font-bold text-xs leading-none drop-shadow">
                        {block.id}
                      </span>
                      <span className="text-[10px] font-mono font-bold leading-none mt-1 opacity-90 drop-shadow">
                        {isFraction
                          ? `Slice (${(block.fraction * 100).toFixed(0)}%)`
                          : 'Full'}
                      </span>
                      <span className="text-[10px] font-mono leading-none mt-0.5 opacity-90 drop-shadow">
                        {block.weight} kg | ${block.value}
                      </span>
                    </motion.div>
                  )
                })}

                {knapsackState.contents.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs text-center p-4">
                    Knapsack is empty. Start visualization to pack items.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Knapsack capacity display and total value bar */}
          <div className="w-full mt-4 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Weight Capacity Used</span>
                <span className="font-mono">
                  {capacityUsed} / {totalCapacity} kg
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full"
                  style={{ width: `${(capacityUsed / totalCapacity) * 100}%` }}
                  animate={{
                    width: `${(capacityUsed / totalCapacity) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-850 pt-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Knapsack Value
                </p>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  ${totalValue}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Capacity Left
                </p>
                <p className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  {capacityLeft} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GreedyBlock title="Greedy Algorithm Summary">
        This visualizer demonstrates the greedy fractional knapsack approach.
      </GreedyBlock>
    </div>
  )
}
