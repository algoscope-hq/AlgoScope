import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

// ---------- YOUR ALGORITHM LOGIC (copied directly here) ----------
const createStep = ({
  lineKey,
  type,
  jobs,
  timeline,
  activeJobId = null,
  activeSlotIndex = null,
  message = '',
  variables = {},
  duration = 1000,
}) => ({
  lineKey,
  type,
  jobs: structuredClone(jobs),
  timeline: structuredClone(timeline),
  activeJobId,
  activeSlotIndex,
  message,
  variables,
  duration,
});

function generateJobSequencingSteps(inputJobs) {
  const steps = [];

  let jobs = inputJobs
    .map((job, index) => ({
      id: job.id || `J${index + 1}`,
      profit: Number(job.profit),
      deadline: Number(job.deadline),
      status: 'staged',
      slotAssigned: null,
    }))
    .filter(
      (job) =>
        !isNaN(job.profit) &&
        !isNaN(job.deadline) &&
        job.profit > 0 &&
        job.deadline > 0
    );

  if (jobs.length === 0) {
    return [
      createStep({
        lineKey: 'init',
        type: 'start',
        jobs: [],
        timeline: [],
        message: 'Please add at least one valid job to visualize.',
        duration: 1000,
      }),
    ];
  }

  const maxDeadline = Math.max(...jobs.map((job) => job.deadline));
  const timeline = Array.from({ length: maxDeadline }, (_, i) => ({
    slotIndex: i,
    label: `${i}-${i + 1}`,
    jobId: null,
    status: 'empty',
  }));

  let totalProfit = 0;
  let scheduledCount = 0;
  let missedCount = 0;

  steps.push(
    createStep({
      lineKey: 'init',
      type: 'start',
      jobs,
      timeline,
      message: `Job Sequencing started. Total jobs: ${jobs.length}. Max deadline: ${maxDeadline}.`,
      variables: { totalJobs: jobs.length, maxDeadline, totalProfit: 0 },
      duration: 1000,
    })
  );

  jobs.forEach((job) => (job.status = 'sorting'));
  steps.push(
    createStep({
      lineKey: 'sort',
      type: 'sorting',
      jobs,
      timeline,
      message: 'Sorting jobs in descending order of profit...',
      variables: { sorting: true, totalProfit },
      duration: 1200,
    })
  );

  jobs.sort((a, b) => b.profit - a.profit || a.deadline - b.deadline);
  jobs.forEach((job) => (job.status = 'sorted'));

  steps.push(
    createStep({
      lineKey: 'sort',
      type: 'sorted',
      jobs,
      timeline,
      message: 'Jobs sorted by profit descending.',
      variables: { sorted: true, totalProfit },
      duration: 1200,
    })
  );

  steps.push(
    createStep({
      lineKey: 'initSlots',
      type: 'init-timeline',
      jobs,
      timeline,
      message: `Initializing timeline with ${maxDeadline} slots.`,
      variables: { maxDeadline, totalProfit },
      duration: 1000,
    })
  );

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    job.status = 'active';

    steps.push(
      createStep({
        lineKey: 'loopJobs',
        type: 'process-job',
        jobs,
        timeline,
        activeJobId: job.id,
        message: `Inspecting Job ${job.id} (Profit: $${job.profit}, Deadline: ${job.deadline}). Searching backwards.`,
        variables: { activeJob: job.id, profit: job.profit, deadline: job.deadline, totalProfit },
        duration: 1200,
      })
    );

    let foundSlot = false;
    for (let j = job.deadline - 1; j >= 0; j--) {
      if (j >= maxDeadline) continue;
      timeline[j].status = 'checking';

      steps.push(
        createStep({
          lineKey: 'loopSlots',
          type: 'check-slot',
          jobs,
          timeline,
          activeJobId: job.id,
          activeSlotIndex: j,
          message: `Checking Slot ${j + 1} (${timeline[j].label}) for Job ${job.id}.`,
          variables: { activeJob: job.id, checkingSlot: j + 1, totalProfit },
          duration: 1000,
        })
      );

      if (timeline[j].jobId === null) {
        timeline[j].jobId = job.id;
        timeline[j].status = 'filled';
        job.status = 'scheduled';
        job.slotAssigned = j + 1;
        totalProfit += job.profit;
        scheduledCount++;
        foundSlot = true;

        steps.push(
          createStep({
            lineKey: 'assignSlot',
            type: 'schedule-success',
            jobs,
            timeline,
            activeJobId: job.id,
            activeSlotIndex: j,
            message: `Slot ${j + 1} is free! Scheduled Job ${job.id}. Profit +$${job.profit}.`,
            variables: { activeJob: job.id, assignedSlot: j + 1, totalProfit, scheduledCount },
            duration: 1200,
          })
        );
        break;
      } else {
        timeline[j].status = 'filled';
        steps.push(
          createStep({
            lineKey: 'loopSlots',
            type: 'slot-occupied',
            jobs,
            timeline,
            activeJobId: job.id,
            activeSlotIndex: j,
            message: `Slot ${j + 1} is occupied by ${timeline[j].jobId}. Searching earlier.`,
            variables: { activeJob: job.id, occupiedSlot: j + 1, totalProfit },
            duration: 1000,
          })
        );
      }
    }

    if (!foundSlot) {
      job.status = 'missed';
      missedCount++;
      steps.push(
        createStep({
          lineKey: 'loopJobs',
          type: 'schedule-miss',
          jobs,
          timeline,
          activeJobId: job.id,
          message: `No slot found for Job ${job.id}. Missed.`,
          variables: { activeJob: job.id, status: 'Missed', totalProfit, missedCount },
          duration: 1200,
        })
      );
    }
  }

  steps.push(
    createStep({
      lineKey: 'finish',
      type: 'complete',
      jobs,
      timeline,
      message: `Complete! Scheduled ${scheduledCount} jobs. Total profit: $${totalProfit}.`,
      variables: { totalProfit, scheduledCount, missedCount, completed: true },
      duration: 1500,
    })
  );

  return steps;
}

// ---------- COLOR MAP FOR JOBS ----------
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
];

// ---------- MAIN COMPONENT (Combines Controller + Visualizer) ----------
export default function JobSequencingVisualizer() {
  // ---------- Controller State ----------
  const [inputText, setInputText] = useState(
    JSON.stringify(
      [
        { id: 'J1', deadline: 2, profit: 100 },
        { id: 'J2', deadline: 1, profit: 19 },
        { id: 'J3', deadline: 2, profit: 27 },
        { id: 'J4', deadline: 1, profit: 25 },
        { id: 'J5', deadline: 3, profit: 15 },
      ],
      null,
      2
    )
  );
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const currentStep = steps[currentIndex] || null;

  // ---------- Controller Handlers ----------
  const handleGenerate = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    try {
      const jobs = JSON.parse(inputText);
      const generatedSteps = generateJobSequencingSteps(jobs);
      setSteps(generatedSteps);
      setCurrentIndex(0);
    } catch (e) {
      alert('Invalid JSON format. Please fix your input.');
    }
  };

  const play = () => {
    if (currentIndex >= steps.length - 1) return;
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  const reset = () => {
    pause();
    setCurrentIndex(0);
  };

  const nextStep = () => {
    if (currentIndex < steps.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevStep = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // ---------- Visualizer Data (from currentStep) ----------
  const jobs = useMemo(() => currentStep?.jobs || [], [currentStep?.jobs]);
  const timeline = useMemo(() => currentStep?.timeline || [], [currentStep?.timeline]);
  const activeSlotIndex = currentStep?.activeSlotIndex ?? null;

  const jobColorMap = useMemo(() => {
    const map = {};
    jobs.forEach((job, idx) => {
      map[job.id] = JOB_COLORS[idx % JOB_COLORS.length];
    });
    return map;
  }, [jobs]);

  const totalProfit = currentStep?.variables?.totalProfit ?? 0;
  const scheduledCount = jobs.filter((j) => j.status === 'scheduled').length;
  const missedCount = jobs.filter((j) => j.status === 'missed').length;

  // ---------- Render ----------
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">
        Job Sequencing with Deadlines
      </h2>

      {/* Input Section */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 block mb-2">
          Enter Jobs (JSON)
        </label>
        <textarea
          rows="4"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-300 focus:border-cyan-500 focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          className="mt-3 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20"
        >
          Generate & Visualize
        </button>
      </div>

      {/* Playback Controls */}
      {steps.length > 0 && (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl flex flex-wrap items-center gap-3">
          <button
            onClick={prevStep}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 disabled:opacity-50 hover:bg-slate-700"
          >
            ⏮ Prev
          </button>

          {isPlaying ? (
            <button onClick={pause} className="px-4 py-2 bg-yellow-600 rounded-lg text-white hover:bg-yellow-500">
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={play}
              disabled={currentIndex >= steps.length - 1}
              className="px-4 py-2 bg-emerald-600 rounded-lg text-white disabled:opacity-50 hover:bg-emerald-500"
            >
              ▶ Play
            </button>
          )}

          <button onClick={reset} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700">
            ⏹ Reset
          </button>

          <button
            onClick={nextStep}
            disabled={currentIndex >= steps.length - 1}
            className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 disabled:opacity-50 hover:bg-slate-700"
          >
            Next ⏭
          </button>

          <span className="ml-auto text-sm font-mono text-slate-400">
            Step {currentIndex + 1} / {steps.length}
          </span>
        </div>
      )}

      {/* THE VISUALIZER (Only shows if steps exist) */}
      {currentStep ? (
        <div className="w-full space-y-6">
          {/* Live Metrics Panel */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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

          {/* Gantt Chart */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
              Gantt Chart Time-Slot Grid (Timeline)
            </h3>

            {timeline.length === 0 ? (
              <div className="text-slate-500 text-center py-6 text-sm font-mono">
                No timeline initialized yet. Start visualizer to see available slots.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {timeline.map((slot, index) => {
                  const assignedJobId = slot.jobId;
                  const jobColor = assignedJobId ? jobColorMap[assignedJobId] : null;
                  const isChecking =
                    activeSlotIndex === index && slot.status === 'checking';

                  let slotClass =
                    'border-dashed border-2 border-slate-800 bg-slate-950/20 text-slate-500';

                  if (isChecking) {
                    slotClass =
                      'border-yellow-500 bg-yellow-500/5 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.3)] text-yellow-400 font-bold';
                  } else if (assignedJobId) {
                    slotClass = `border-solid border border-emerald-500/30 bg-gradient-to-br ${jobColor?.bg || 'from-emerald-500 to-teal-600'} text-white shadow-[0_0_12px_rgba(16,185,129,0.15)]`;
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
                              Profit: ${jobs.find((j) => j.id === assignedJobId)?.profit || 0}
                            </span>
                          </>
                        ) : isChecking ? (
                          <span className="text-xs font-mono text-yellow-400">Checking...</span>
                        ) : (
                          <span className="text-[11px] font-mono tracking-wider opacity-60">Empty</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Jobs Directory */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-4">
              Jobs Directory
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {jobs.map((job) => {
                const colors = jobColorMap[job.id] || JOB_COLORS[0];

                let statusBadge = 'bg-slate-800 border-slate-700 text-slate-400';
                let cardBorder = 'border-slate-800 bg-slate-950/40 opacity-70';

                if (job.status === 'sorting') {
                  statusBadge = 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 animate-pulse';
                  cardBorder = 'border-yellow-500/30 bg-slate-950/50';
                } else if (job.status === 'sorted') {
                  statusBadge = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
                  cardBorder = 'border-slate-700/80 bg-slate-950/60';
                } else if (job.status === 'active') {
                  statusBadge = 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
                  cardBorder = 'border-yellow-500 bg-yellow-500/5 scale-102 shadow-[0_0_12px_rgba(234,179,8,0.25)]';
                } else if (job.status === 'scheduled') {
                  statusBadge = 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300';
                  cardBorder = `border-emerald-500/30 ${colors.light}`;
                } else if (job.status === 'missed') {
                  statusBadge = 'bg-rose-500/10 border-rose-500/20 text-rose-400';
                  cardBorder = 'border-slate-800 bg-slate-950/20 opacity-40';
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
                          Profit: <span className="text-white font-bold">${job.profit}</span>
                        </div>
                        <div>
                          Deadline: <span className="text-white font-bold">{job.deadline}</span>
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
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-12 text-center text-slate-500">
          Enter jobs above and click "Generate & Visualize" to start.
        </div>
      )}
    </div>
  );
}