import React from 'react'
import { motion } from 'framer-motion'

const JOB_COLORS = [
  {
    bg: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-400 border-2',
    text: 'text-cyan-300',
    light: 'bg-cyan-500/10',
  },
  {
    bg: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-400 border-2',
    text: 'text-emerald-300',
    light: 'bg-emerald-500/10',
  },
  {
    bg: 'from-purple-500 to-indigo-600',
    border: 'border-purple-400 border-2',
    text: 'text-purple-300',
    light: 'bg-purple-500/10',
  },
  {
    bg: 'from-amber-500 to-orange-600',
    border: 'border-amber-400 border-2',
    text: 'text-amber-300',
    light: 'bg-amber-500/10',
  },
  {
    bg: 'from-rose-500 to-red-600',
    border: 'border-rose-400 border-2',
    text: 'text-rose-300',
    light: 'bg-rose-500/10',
  },
  {
    bg: 'from-fuchsia-500 to-pink-600',
    border: 'border-fuchsia-400 border-2',
    text: 'text-fuchsia-300',
    light: 'bg-fuchsia-500/10',
  },
  {
    bg: 'from-teal-500 to-emerald-600',
    border: 'border-teal-400 border-2',
    text: 'text-teal-300',
    light: 'bg-teal-500/10',
  },
  {
    bg: 'from-sky-500 to-blue-600',
    border: 'border-sky-400 border-2',
    text: 'text-sky-300',
    light: 'bg-sky-500/10',
  },
]

export default function JobSequencingVisualizer({ currentStep }) {
  const jobs = React.useMemo(() => currentStep?.jobs || [], [currentStep?.jobs])
  const timeline = React.useMemo(
    () => currentStep?.timeline || [],
    [currentStep?.timeline]
  )
  const activeJobId = currentStep?.activeJobId || null
  const activeSlotIndex = currentStep?.activeSlotIndex ?? null

  const jobColorMap = React.useMemo(() => {
    const map = {}
    jobs.forEach((job, idx) => {
      map[job.id] = JOB_COLORS[idx % JOB_COLORS.length]
    })
    return map
  }, [jobs])

  const totalProfit = currentStep?.variables?.totalProfit ?? 0
  const scheduledCount = jobs.filter((j) => j.status === 'scheduled').length
  const missedCount = jobs.filter((j) => j.status === 'missed').length

  return (
    <div className="w-full space-y-6">
      {/* Live Metrics Panel */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Total Profit Card */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Total Profit
            </p>
            <h4 className="text-2xl font-bold text-emerald-400 mt-1">
              ${totalProfit}
            </h4>
          </div>
          <div className="text-3xl">💰</div>
        </div>

        {/* Scheduled Jobs Card */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Jobs Scheduled
              </p>
              <h4 className="text-2xl font-bold text-cyan-400 mt-1">
                {scheduledCount} / {jobs.length}
              </h4>
            </div>
            <div className="text-3xl">✅</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-cyan-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(scheduledCount / (jobs.length || 1)) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Missed Jobs Card */}
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Jobs Missed
            </p>
            <h4 className="text-2xl font-bold text-rose-400 mt-1">
              {missedCount}
            </h4>
          </div>
          <div className="text-3xl">❌</div>
        </div>
      </div>

      {/* Gantt Chart Time-Slot Grid */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
          Gantt Chart Time-Slot Grid (Timeline)
        </h3>

        {timeline.length === 0 ? (
          <div className="text-slate-500 text-center py-6 text-sm font-mono">
            No timeline initialized yet. Start visualizer to see available
            slots.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {timeline.map((slot, index) => {
              const assignedJobId = slot.jobId
              const jobColor = assignedJobId ? jobColorMap[assignedJobId] : null
              const isChecking = activeSlotIndex === index && slot.status === 'checking'

              let slotClass =
                'border-dashed border-2 border-slate-800 bg-slate-950/20 text-slate-500'

              if (isChecking) {
                slotClass =
                  'border-yellow-500 bg-yellow-500/5 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.3)] text-yellow-400 font-bold'
              } else if (assignedJobId) {
                slotClass = `border-solid border border-emerald-500/30 bg-gradient-to-br ${jobColor?.bg || 'from-emerald-500 to-teal-600'} text-white shadow-[0_0_12px_rgba(16,185,129,0.15)]`
              }

              return (
                <motion.div
                  key={index}
                  className={`rounded-2xl p-3 flex flex-col justify-between items-center text-center transition-all duration-300 min-h-[95px] relative ${slotClass}`}
                  layoutId={`slot-${index}`}
                >
                  <div className="w-full flex justify-between items-center text-[9px] uppercase tracking-wider opacity-85">
                    <span className="font-mono">Slot {index + 1}</span>
                    <span className="font-mono bg-slate-950/40 px-1 rounded">
                      {slot.label}
                    </span>
                  </div>

                  <div className="my-2 flex flex-col items-center">
                    {assignedJobId ? (
                      <>
                        <span className="text-sm font-bold tracking-wider">
                          {assignedJobId}
                        </span>
                        <span className="text-[10px] opacity-90 mt-0.5 font-mono">
                          Profit: $
                          {jobs.find((j) => j.id === assignedJobId)?.profit ||
                            0}
                        </span>
                      </>
                    ) : isChecking ? (
                      <span className="text-xs font-mono text-yellow-400">
                        Checking...
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono tracking-wider opacity-60">
                        Empty
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Jobs Directory Cards */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
          Jobs Directory
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {jobs.map((job) => {
            const colors = jobColorMap[job.id] || JOB_COLORS[0]

            let statusBadge = 'bg-slate-800 border-slate-700 text-slate-400'
            let cardBorder = 'border-slate-800 bg-slate-950/40 opacity-70'

            if (job.status === 'sorting') {
              statusBadge =
                'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 animate-pulse'
              cardBorder = 'border-yellow-500/30 bg-slate-950/50'
            } else if (job.status === 'sorted') {
              statusBadge = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
              cardBorder = 'border-slate-700/80 bg-slate-950/60'
            } else if (job.status === 'active') {
              statusBadge =
                'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
              cardBorder =
                'border-yellow-500 bg-yellow-500/5 scale-102 shadow-[0_0_12px_rgba(234,179,8,0.25)]'
            } else if (job.status === 'scheduled') {
              statusBadge =
                'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              cardBorder = `border-emerald-500/30 ${colors.light}`
            } else if (job.status === 'missed') {
              statusBadge = 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              cardBorder = 'border-slate-800 bg-slate-950/20 opacity-40'
            }

            return (
              <motion.div
                key={job.id}
                className={`rounded-2xl border p-3 flex flex-col justify-between transition-all duration-300 min-h-[110px] relative ${cardBorder}`}
                layoutId={`job-card-${job.id}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-slate-100">
                      {job.id}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border ${statusBadge}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400 mt-2 font-mono">
                    <div>
                      Profit:{' '}
                      <span className="text-white font-bold">
                        ${job.profit}
                      </span>
                    </div>
                    <div>
                      Deadline:{' '}
                      <span className="text-white font-bold">
                        {job.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {job.slotAssigned && (
                  <div className="border-t border-slate-800/80 pt-2 mt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span>Assigned Slot:</span>
                    <span className="font-bold">Slot {job.slotAssigned}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
