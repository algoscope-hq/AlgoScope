import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  runFCFS,
  runSJF,
  runRoundRobin,
  runPriority,
  runSRTF,
  runMLQ,
} from './cpuSchedulingAlgorithms'
import { algorithmInfo } from './cpuSchedulingData'

const DEFAULT_PROCESSES = [
  { id: 'p1', pid: 'P1', arrivalTime: 0, burstTime: 5, priority: 1 },
  { id: 'p2', pid: 'P2', arrivalTime: 1, burstTime: 3, priority: 2 },
  { id: 'p3', pid: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
]

export default function CPUSchedulingPage() {
  const [processes, setProcesses] = useState(() =>
    DEFAULT_PROCESSES.map((p) => ({ ...p }))
  )
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('fcfs')
  const [simulationStatus, setSimulationStatus] = useState('Not Started')
  const [ganttData, setGanttData] = useState([])
  const [statistics, setStatistics] = useState([])
  const [avgWaitingTime, setAvgWaitingTime] = useState(0)
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [playbackSteps, setPlaybackSteps] = useState([])
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const [flowArrival, setFlowArrival] = useState([])
  const [flowReadyQueue, setFlowReadyQueue] = useState([])
  const [flowCPU, setFlowCPU] = useState(null)
  const [flowCompleted, setFlowCompleted] = useState([])
  const [cpuExplanation, setCPUExplanation] = useState('')
  const [cpuRemainingTime, setCpuRemainingTime] = useState(null)

  const [step1Completed, setStep1Completed] = useState(false)
  const [step2Completed, setStep2Completed] = useState(false)
  const [step3Completed, setStep3Completed] = useState(false)
  const [step4Completed, setStep4Completed] = useState(false)
  const [algorithmChanged, setAlgorithmChanged] = useState(false)

  const playbackTimerRef = useRef(null)
  const remainingTimeRef = useRef(new Map())
  const completedSetRef = useRef(new Set())
  const totalStepsRef = useRef(0)
  const completionTimeoutsRef = useRef([])

  const addProcess = () => {
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `p${Date.now()}-${Math.random()}`
    const newPid = `P${processes.length + 1}`
    setProcesses((prev) => [
      ...prev,
      { id: newId, pid: newPid, arrivalTime: 0, burstTime: 1, priority: 1 },
    ])
    setStep2Completed(true)
  }

  const updateProcess = (id, field, value) => {
    setProcesses((prev) =>
      prev.map((proc) => (proc.id === id ? { ...proc, [field]: value } : proc))
    )
  }

  const deleteProcess = (id) => {
    if (processes.length <= 1) return
    setProcesses((prev) => prev.filter((proc) => proc.id !== id))
  }

  const resetProcesses = () => {
    setProcesses(DEFAULT_PROCESSES.map((p) => ({ ...p, id: p.id })))
    setSimulationStatus('Not Started')
    setGanttData([])
    setStatistics([])
    setAvgWaitingTime(0)
    setAvgTurnaroundTime(0)
    setIsPlaying(false)
    setCurrentStep(0)
    setPlaybackSteps([])
    setFlowArrival([])
    setFlowReadyQueue([])
    setFlowCPU(null)
    setFlowCompleted([])
    setCPUExplanation('')
    setCpuRemainingTime(null)
    setStep2Completed(false)
    setStep3Completed(false)
    setStep4Completed(false)
    remainingTimeRef.current = new Map()
    completedSetRef.current = new Set()
    totalStepsRef.current = 0
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current)
    }
    completionTimeoutsRef.current.forEach(clearTimeout)
    completionTimeoutsRef.current = []
  }

  const generatePlaybackSteps = (rawGantt, processesList) => {
    const remaining = new Map()
    processesList.forEach((p) => remaining.set(p.pid, p.burstTime))

    return rawGantt.map((segment, i) => {
      const remainingBefore = remaining.get(segment.pid) ?? segment.burstTime
      const remainingAfter = remainingBefore - segment.burstTime
      remaining.set(segment.pid, remainingAfter)

      const arrivedPids = new Set(
        processesList
          .filter((p) => p.arrivalTime <= segment.start)
          .map((p) => p.pid)
      )

      const completedBeforeThis = new Set()
      const tempRemaining = new Map()
      processesList.forEach((p) => tempRemaining.set(p.pid, p.burstTime))
      for (let j = 0; j < i; j++) {
        const s = rawGantt[j]
        const prev = tempRemaining.get(s.pid) ?? 0
        const after = prev - s.burstTime
        tempRemaining.set(s.pid, after)
        if (after <= 0) completedBeforeThis.add(s.pid)
      }

      const readyQueue = processesList
        .filter(
          (p) =>
            arrivedPids.has(p.pid) &&
            !completedBeforeThis.has(p.pid) &&
            p.pid !== segment.pid
        )
        .map((p) => ({ pid: p.pid, arrivalTime: p.arrivalTime }))

      const willComplete = remainingAfter <= 0
      const isLastSegment = i === rawGantt.length - 1

      return {
        segmentIndex: i,
        pid: segment.pid,
        segmentBurst: segment.burstTime,
        startTime: segment.start,
        endTime: segment.end,
        remainingBefore,
        remainingAfter,
        willComplete,
        isLastSegment,
        arrivedPids: [...arrivedPids],
        readyQueue,
        completedBefore: [...completedBeforeThis],
      }
    })
  }

  const buildExplanation = (step) => {
    if (step.willComplete) {
      return `${step.pid} finished execution (remaining: 0ms).`
    }
    if (step.remainingAfter > 0) {
      return `${step.pid} ran for ${step.segmentBurst}ms — ${step.remainingAfter}ms remaining, returned to queue.`
    }
    return `${step.pid} is executing.`
  }

  const resetFlowState = () => {
    completionTimeoutsRef.current.forEach(clearTimeout)
    completionTimeoutsRef.current = []
    setFlowArrival([])
    setFlowReadyQueue([])
    setFlowCPU(null)
    setFlowCompleted([])
    setCPUExplanation('')
    setCpuRemainingTime(null)
    remainingTimeRef.current = new Map()
    completedSetRef.current = new Set()
  }

  const animateFlowStep = useCallback(
    (step, processesList) => {
      if (!step) return

      const arrived = processesList.filter((p) =>
        step.arrivedPids.includes(p.pid)
      )
      setFlowArrival(arrived)

      const readyProcs = step.readyQueue.map((r) => {
        const proc = processesList.find((p) => p.pid === r.pid)
        const rem = remainingTimeRef.current.get(r.pid)
        return {
          pid: r.pid,
          arrivalTime: r.arrivalTime,
          burstTime: rem !== undefined ? rem : proc?.burstTime,
        }
      })
      setFlowReadyQueue(readyProcs)

      const cpuProc = processesList.find((p) => p.pid === step.pid)
      setFlowCPU(cpuProc ?? null)
      setCpuRemainingTime(step.remainingAfter > 0 ? step.remainingAfter : 0)
      setCPUExplanation(buildExplanation(step))

      remainingTimeRef.current.set(step.pid, step.remainingAfter)

      const segDuration = (step.segmentBurst * 100) / playbackSpeed

      const timeoutId = setTimeout(() => {
        if (step.willComplete && !completedSetRef.current.has(step.pid)) {
          completedSetRef.current.add(step.pid)
          setFlowCompleted((prev) => {
            if (prev.some((p) => p.pid === step.pid)) return prev
            return [...prev, cpuProc ?? { pid: step.pid }]
          })
        }

        if (step.isLastSegment) {
          setFlowCPU(null)
          setCpuRemainingTime(null)
          setFlowReadyQueue([])
        }
        completionTimeoutsRef.current = completionTimeoutsRef.current.filter(
          (id) => id !== timeoutId
        )
      }, segDuration)

      completionTimeoutsRef.current.push(timeoutId)
    },
    [playbackSpeed]
  )

  const handleRunSimulation = () => {
    let result
    if (selectedAlgorithm === 'fcfs') {
      result = runFCFS(processes)
    } else if (selectedAlgorithm === 'sjf') {
      result = runSJF(processes)
    } else if (selectedAlgorithm === 'rr') {
      result = runRoundRobin(processes)
    } else if (selectedAlgorithm === 'priority') {
      result = runPriority(processes)
    } else if (selectedAlgorithm === 'srtf') {
      result = runSRTF(processes)
    } else if (selectedAlgorithm === 'mlq') {
      result = runMLQ(processes)
    }

    setGanttData(result.ganttData)
    setStatistics(result.statistics)
    setAvgWaitingTime(result.avgWaitingTime)
    setAvgTurnaroundTime(result.avgTurnaroundTime)
    setSimulationStatus('Completed')
    setStep3Completed(true)
    if (result.statistics.length > 0) {
      setStep4Completed(true)
    }

    const steps = generatePlaybackSteps(result.ganttData, processes)
    totalStepsRef.current = steps.length
    setPlaybackSteps(steps)
    setCurrentStep(0)
    resetFlowState()

    const initRemaining = new Map()
    processes.forEach((p) => initRemaining.set(p.pid, p.burstTime))
    remainingTimeRef.current = initRemaining
    completedSetRef.current = new Set()

    setIsPlaying(true)
  }

  const playNextStep = useCallback(() => {
    if (currentStep < playbackSteps.length) {
      animateFlowStep(playbackSteps[currentStep], processes)
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsPlaying(false)
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current)
      }
    }
  }, [currentStep, playbackSteps, animateFlowStep, processes])

  useEffect(() => {
    if (isPlaying && currentStep < playbackSteps.length) {
      const step = playbackSteps[currentStep]
      const delay = step
        ? (step.segmentBurst * 100 + 400) / playbackSpeed
        : 1000 / playbackSpeed
      playbackTimerRef.current = setTimeout(playNextStep, delay)
    }
    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current)
      }
      completionTimeoutsRef.current.forEach(clearTimeout)
      completionTimeoutsRef.current = []
    }
  }, [isPlaying, currentStep, playbackSteps, playNextStep, playbackSpeed])

  const handlePlay = () => {
    if (currentStep >= playbackSteps.length) {
      setCurrentStep(0)
      resetFlowState()
      const initRemaining = new Map()
      processes.forEach((p) => initRemaining.set(p.pid, p.burstTime))
      remainingTimeRef.current = initRemaining
      completedSetRef.current = new Set()
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReplay = () => {
    setIsPlaying(false)
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current)
    }
    setCurrentStep(0)
    resetFlowState()
    const initRemaining = new Map()
    processes.forEach((p) => initRemaining.set(p.pid, p.burstTime))
    remainingTimeRef.current = initRemaining
    completedSetRef.current = new Set()
    setIsPlaying(true)
  }

  const currentGantt = ganttData.slice(0, currentStep)
  const totalDuration =
    ganttData.length > 0 ? ganttData[ganttData.length - 1].end : 0

  const handleArrivalChange = (id, rawValue) => {
    const parsed = parseInt(rawValue)
    const arrivalTime = isNaN(parsed) ? 0 : Math.max(0, parsed)
    updateProcess(id, 'arrivalTime', arrivalTime)
  }

  const handleBurstChange = (id, rawValue) => {
    const parsed = parseInt(rawValue)
    const burstTime = isNaN(parsed) ? 1 : Math.max(1, parsed)
    updateProcess(id, 'burstTime', burstTime)
  }

  const handlePriorityChange = (id, rawValue) => {
    const parsed = parseInt(rawValue)
    const priority = isNaN(parsed) ? 1 : Math.max(1, parsed)
    updateProcess(id, 'priority', priority)
  }

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value)
    if (!algorithmChanged) {
      setAlgorithmChanged(true)
      setStep1Completed(true)
    }
  }

  const currentComplexity =
    algorithmInfo[selectedAlgorithm] || algorithmInfo.fcfs

  return (
    <motion.div
      className="w-full flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6 bg-slate-950/50 min-h-screen shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="w-full lg:w-1/3 xl:w-1/4 p-4 flex flex-col gap-6 bg-slate-900/80 shadow-xl rounded-xl border border-white/5 backdrop-blur-sm overflow-y-auto">
        <div className="border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 text-center mb-1">
            CPU Scheduling Visualizer
          </p>
          <h2 className="text-xl font-bold text-center text-white tracking-tight">
            Controls
          </h2>
        </div>

        <div className="bg-slate-950/60 rounded-xl border border-white/5 p-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
            How to use
          </p>
          {[
            {
              step: '1',
              label: 'Select an algorithm',
              completed: step1Completed,
            },
            { step: '2', label: 'Add processes', completed: step2Completed },
            { step: '3', label: 'Run simulation', completed: step3Completed },
            { step: '4', label: 'Analyze results', completed: step4Completed },
          ].map(({ step, label, completed }) => (
            <motion.div
              key={step}
              className="flex items-center gap-3"
              initial={false}
              animate={completed ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  completed
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {completed ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  step
                )}
              </motion.span>
              <motion.span
                className={`text-sm transition-all duration-300 ${
                  completed ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                {label}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Algorithm
          </p>
          <select
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
          >
            <option value="fcfs">FCFS (First Come First Serve)</option>
            <option value="sjf">SJF (Shortest Job First)</option>
            <option value="rr">Round Robin (RR)</option>
            <option value="priority">Priority Scheduling</option>
            <option value="srtf">Shortest Remaining Time First (SRTF)</option>
            <option value="mlq">Multilevel Queue Scheduling (MLQ)</option>
          </select>
        </div>

        {playbackSteps.length > 0 && (
          <div className="space-y-3 bg-slate-950/60 rounded-xl border border-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
              Playback Controls
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-green-600 hover:bg-green-500 text-white transition-all disabled:opacity-50"
              >
                ▶ Play
              </button>
              <button
                onClick={handlePause}
                disabled={!isPlaying}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-yellow-600 hover:bg-yellow-500 text-white transition-all disabled:opacity-50"
              >
                ⏸ Pause
              </button>
              <button
                onClick={handleReplay}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all"
              >
                ↺ Replay
              </button>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <span className="text-xs text-slate-400">Speed:</span>
              <div className="flex gap-1">
                {[0.5, 1, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      playbackSpeed === speed
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center text-xs text-slate-400">
              Step: {currentStep} / {playbackSteps.length}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleRunSimulation}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:scale-[1.02]"
          >
            ▶ Run Simulation
          </button>
          <button
            onClick={resetProcesses}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all duration-300"
          >
            ↺ Reset
          </button>
        </div>

        <div className="bg-slate-950/60 rounded-xl border border-white/5 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400/80">
            Complexity
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Time Complexity:</span>
              <span className="text-slate-200 font-mono">
                {currentComplexity.timeComplexity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Space Complexity:</span>
              <span className="text-slate-200 font-mono">
                {currentComplexity.spaceComplexity}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 pt-1 border-t border-white/10">
              {currentComplexity.explanation}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/80 rounded-xl border border-white/10 p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Processes</p>
            <p className="text-2xl font-bold text-cyan-400">
              {processes.length}
            </p>
          </div>
          <div className="bg-slate-900/80 rounded-xl border border-white/10 p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Selected Algorithm</p>
            <p className="text-sm font-semibold text-white truncate">
              {selectedAlgorithm === 'fcfs'
                ? 'FCFS'
                : selectedAlgorithm === 'sjf'
                  ? 'SJF'
                  : selectedAlgorithm === 'rr'
                    ? 'RR'
                    : selectedAlgorithm === 'priority'
                      ? 'Priority'
                      : selectedAlgorithm === 'srtf'
                        ? 'SRTF'
                        : 'MLQ'}
            </p>
          </div>
          <div className="bg-slate-900/80 rounded-xl border border-white/10 p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Simulation Status</p>
            <p className="text-sm font-semibold text-slate-300">
              {simulationStatus}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-white/10 p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Process Flow Simulator
          </h3>
          <div className="bg-slate-950/60 rounded-lg border border-white/5 p-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  ARRIVAL
                </p>
                <div className="min-h-[200px] bg-slate-900/50 rounded-lg border border-slate-700 p-2">
                  <AnimatePresence mode="popLayout">
                    {flowArrival.map((process) => (
                      <motion.div
                        key={process.pid}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg p-2 mb-2 text-center"
                      >
                        <span className="text-sm font-bold text-cyan-400">
                          {process.pid}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          AT={process.arrivalTime}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  READY QUEUE
                </p>
                <div className="min-h-[200px] bg-slate-900/50 rounded-lg border border-slate-700 p-2">
                  <AnimatePresence mode="popLayout">
                    {flowReadyQueue.map((process, idx) => (
                      <motion.div
                        key={process.pid}
                        layout
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-2 mb-2 text-center"
                      >
                        <span className="text-sm font-bold text-purple-400">
                          {process.pid}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          BT={process.burstTime}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-slate-400 mb-3">CPU</p>
                <div className="min-h-[200px] bg-slate-900/50 rounded-lg border border-slate-700 p-2 flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {flowCPU ? (
                      <motion.div
                        key={`${flowCPU.pid}-${currentStep}`}
                        initial={{ scale: 0.5, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 20 }}
                        className="bg-green-500/20 border-2 border-green-400 rounded-lg p-4 text-center w-full"
                      >
                        <span className="text-xl font-bold text-green-400">
                          {flowCPU.pid}
                        </span>
                        <div className="mt-2 w-full bg-slate-700 rounded-full h-1 overflow-hidden">
                          <motion.div
                            className="bg-green-500 h-full rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{
                              duration:
                                (playbackSteps[currentStep - 1]?.segmentBurst ??
                                  flowCPU.burstTime) * 0.1,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 mt-2 block">
                          {cpuRemainingTime !== null && cpuRemainingTime > 0 ? (
                            <>
                              Slice:{' '}
                              {playbackSteps[currentStep - 1]?.segmentBurst ??
                                flowCPU.burstTime}
                              ms | Remaining: {cpuRemainingTime}ms
                            </>
                          ) : (
                            <>
                              BT=
                              {playbackSteps[currentStep - 1]?.segmentBurst ??
                                flowCPU.burstTime}
                              ms
                            </>
                          )}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-500 text-sm"
                      >
                        Idle
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {cpuExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-xs text-cyan-300 bg-cyan-950/30 rounded-lg p-2"
                  >
                    {cpuExplanation}
                  </motion.div>
                )}
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-slate-400 mb-3">
                  COMPLETED
                </p>
                <div className="min-h-[200px] bg-slate-900/50 rounded-lg border border-slate-700 p-2">
                  <AnimatePresence mode="popLayout">
                    {flowCompleted.map((process) => (
                      <motion.div
                        key={process.pid}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-500/20 border border-gray-500/40 rounded-lg p-2 mb-2 text-center"
                      >
                        <span className="text-sm font-bold text-gray-400">
                          {process.pid}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-white/10 p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Execution Timeline
          </h3>
          <div className="bg-slate-950/60 rounded-lg border border-white/5 p-6 min-h-[300px]">
            {currentGantt.length > 0 ? (
              <div className="space-y-4">
                <div className="relative w-full overflow-x-auto pb-4">
                  <div className="flex h-16 min-w-max">
                    {currentGantt.map((segment, idx) => {
                      const widthPercent =
                        (segment.burstTime / totalDuration) * 100
                      return (
                        <motion.div
                          key={idx}
                          className="relative group"
                          style={{
                            width: `${widthPercent}%`,
                            minWidth: '60px',
                          }}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ delay: idx * 0.2 }}
                        >
                          <div className="absolute inset-x-1 top-0 bottom-0 bg-gradient-to-b from-cyan-500/20 to-cyan-600/30 border border-cyan-500/40 rounded-lg flex flex-col items-center justify-center transition-all hover:from-cyan-500/30 hover:to-cyan-600/40">
                            <span className="text-sm font-semibold text-cyan-400">
                              {segment.pid}
                            </span>
                            <span className="text-xs text-slate-400 mt-0.5">
                              {segment.burstTime}ms
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="relative mt-2 pt-2 border-t border-slate-700">
                    <div className="flex justify-between text-xs text-slate-500">
                      {currentGantt.map((segment, idx) => (
                        <div
                          key={idx}
                          className="text-center"
                          style={{
                            width: `${(segment.burstTime / totalDuration) * 100}%`,
                            minWidth: '60px',
                          }}
                        >
                          <span>{segment.start}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right text-xs text-slate-500 mt-1">
                      <span>{totalDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Total Duration: {totalDuration} time units</span>
                    <span>
                      Schedule: {currentGantt.map((g) => g.pid).join(' → ')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[250px] space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700">
                  <svg
                    className="w-8 h-8 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-slate-300 font-medium">
                  No Simulation Run Yet
                </p>
                <p className="text-slate-500 text-sm">
                  Add processes and run a scheduling algorithm to generate a
                  timeline.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-white/10 p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              Process Configuration
            </h3>
            <button
              onClick={addProcess}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all"
            >
              + Add Process
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-slate-400 font-medium w-1/5">
                    PID
                  </th>
                  <th className="text-left py-3 text-slate-400 font-medium w-1/5">
                    Arrival Time
                  </th>
                  <th className="text-left py-3 text-slate-400 font-medium w-1/5">
                    Burst Time
                  </th>
                  <th className="text-left py-3 text-slate-400 font-medium w-1/5">
                    Priority
                  </th>
                  <th className="text-left py-3 text-slate-400 font-medium w-1/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <tr key={process.id} className="border-b border-white/5">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={process.pid}
                        onChange={(e) =>
                          updateProcess(process.id, 'pid', e.target.value)
                        }
                        className="bg-slate-800/50 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-sm w-full focus:border-cyan-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        value={process.arrivalTime}
                        onChange={(e) =>
                          handleArrivalChange(process.id, e.target.value)
                        }
                        className="bg-slate-800/50 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-sm w-full focus:border-cyan-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        value={process.burstTime}
                        onChange={(e) =>
                          handleBurstChange(process.id, e.target.value)
                        }
                        className="bg-slate-800/50 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-sm w-full focus:border-cyan-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        value={process.priority}
                        onChange={(e) =>
                          handlePriorityChange(process.id, e.target.value)
                        }
                        className="bg-slate-800/50 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-sm w-full focus:border-cyan-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => deleteProcess(process.id)}
                        className={`text-xs transition-all ${processes.length <= 1 ? 'text-slate-600 cursor-not-allowed' : 'text-red-400 hover:text-red-300'}`}
                        disabled={processes.length <= 1}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-white/10 p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Process Statistics
          </h3>
          {statistics.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-slate-400 font-medium">
                        PID
                      </th>
                      <th className="text-left py-2 text-slate-400 font-medium">
                        Completion Time
                      </th>
                      <th className="text-left py-2 text-slate-400 font-medium">
                        Waiting Time
                      </th>
                      <th className="text-left py-2 text-slate-400 font-medium">
                        Turnaround Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.map((stat) => (
                      <tr key={stat.pid} className="border-b border-white/5">
                        <td className="py-2 text-slate-200">{stat.pid}</td>
                        <td className="py-2 text-slate-200">
                          {stat.completionTime}
                        </td>
                        <td className="py-2 text-slate-200">
                          {stat.waitingTime}
                        </td>
                        <td className="py-2 text-slate-200">
                          {stat.turnaroundTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="bg-slate-950/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">
                    Average Waiting Time
                  </p>
                  <p className="text-xl font-bold text-cyan-400">
                    {avgWaitingTime.toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-950/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">
                    Average Turnaround Time
                  </p>
                  <p className="text-xl font-bold text-cyan-400">
                    {avgTurnaroundTime.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 rounded-lg border border-white/5 p-8 flex flex-col items-center justify-center min-h-[200px]">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700">
                  <svg
                    className="w-8 h-8 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">
                  Run a simulation to generate scheduling statistics.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-white/10 p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-2">
            Algorithm Information
          </h3>
          <p className="text-sm text-slate-300">
            {algorithmInfo[selectedAlgorithm]?.name || algorithmInfo.fcfs.name}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {algorithmInfo[selectedAlgorithm]?.description ||
              algorithmInfo.fcfs.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
