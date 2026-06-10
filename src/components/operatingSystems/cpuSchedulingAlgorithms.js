export function runFCFS(processes) {
  const processesCopy = processes.map((p) => ({
    ...p,
    completionTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
  }))

  const sorted = [...processesCopy].sort(
    (a, b) => a.arrivalTime - b.arrivalTime
  )

  let currentTime = 0
  const ganttData = []
  const statistics = []
  let totalWaiting = 0
  let totalTurnaround = 0

  for (let i = 0; i < sorted.length; i++) {
    const process = sorted[i]

    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime
    }

    const startTime = currentTime
    const completionTime = currentTime + process.burstTime
    const turnaroundTime = completionTime - process.arrivalTime
    const waitingTime = turnaroundTime - process.burstTime

    ganttData.push({
      pid: process.pid,
      start: startTime,
      end: completionTime,
      burstTime: process.burstTime,
    })

    statistics.push({
      pid: process.pid,
      completionTime,
      waitingTime,
      turnaroundTime,
    })

    totalWaiting += waitingTime
    totalTurnaround += turnaroundTime

    currentTime = completionTime
  }

  return {
    ganttData,
    statistics,
    avgWaitingTime: totalWaiting / sorted.length,
    avgTurnaroundTime: totalTurnaround / sorted.length,
  }
}

export function runSJF(processes) {
  const processesCopy = processes.map((p, idx) => ({
    ...p,
    originalIndex: idx,
    completionTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
    completed: false,
  }))

  let currentTime = 0
  let completedCount = 0

  const ganttData = []
  const statistics = []

  let totalWaiting = 0
  let totalTurnaround = 0

  while (completedCount < processesCopy.length) {
    let availableProcesses = processesCopy.filter(
      (p) => p.arrivalTime <= currentTime && !p.completed
    )

    if (availableProcesses.length === 0) {
      const nextArrival = Math.min(
        ...processesCopy.filter((p) => !p.completed).map((p) => p.arrivalTime)
      )

      currentTime = nextArrival

      availableProcesses = processesCopy.filter(
        (p) => p.arrivalTime <= currentTime && !p.completed
      )
    }

    availableProcesses.sort((a, b) => {
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime
      }

      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime
      }

      return a.originalIndex - b.originalIndex
    })

    const selectedProcess = availableProcesses[0]

    const startTime = currentTime
    const completionTime = currentTime + selectedProcess.burstTime
    const turnaroundTime = completionTime - selectedProcess.arrivalTime
    const waitingTime = turnaroundTime - selectedProcess.burstTime

    selectedProcess.completionTime = completionTime
    selectedProcess.waitingTime = waitingTime
    selectedProcess.turnaroundTime = turnaroundTime
    selectedProcess.completed = true

    ganttData.push({
      pid: selectedProcess.pid,
      start: startTime,
      end: completionTime,
      burstTime: selectedProcess.burstTime,
    })

    statistics.push({
      pid: selectedProcess.pid,
      completionTime,
      waitingTime,
      turnaroundTime,
    })

    totalWaiting += waitingTime
    totalTurnaround += turnaroundTime

    currentTime = completionTime
    completedCount++
  }

  const sortedStatistics = [...statistics].sort((a, b) => {
    const pidA = parseInt(a.pid.substring(1))
    const pidB = parseInt(b.pid.substring(1))
    return pidA - pidB
  })

  return {
    ganttData,
    statistics: sortedStatistics,
    avgWaitingTime: totalWaiting / processesCopy.length,
    avgTurnaroundTime: totalTurnaround / processesCopy.length,
  }
}
