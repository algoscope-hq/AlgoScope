// schedulingAlgorithms.js
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

export function runRoundRobin(processes, timeQuantum = 2) {
  if (!Number.isFinite(timeQuantum) || timeQuantum <= 0) {
    throw new Error('timeQuantum must be a positive number')
  }

  const processesCopy = processes.map((p, idx) => ({
    ...p,
    originalIndex: idx,
    remainingTime: p.burstTime,
    completionTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
    completed: false,
  }))

  let currentTime = 0
  let completedCount = 0
  const ganttData = []
  const queue = []
  let lastProcess = null

  while (completedCount < processesCopy.length) {
    const arrivedProcesses = processesCopy.filter(
      (p) => p.arrivalTime <= currentTime && !p.completed && !queue.includes(p)
    )

    arrivedProcesses.forEach((p) => {
      if (!queue.includes(p)) {
        queue.push(p)
      }
    })

    if (queue.length === 0 && completedCount < processesCopy.length) {
      const nextArrival = Math.min(
        ...processesCopy.filter((p) => !p.completed).map((p) => p.arrivalTime)
      )
      currentTime = nextArrival
      continue
    }

    const currentProcess = queue.shift()

    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime)
    const startTime = currentTime
    const endTime = currentTime + executionTime

    if (
      lastProcess &&
      lastProcess.pid === currentProcess.pid &&
      ganttData.length > 0 &&
      ganttData[ganttData.length - 1].pid === currentProcess.pid
    ) {
      ganttData[ganttData.length - 1].end = endTime
    } else {
      ganttData.push({
        pid: currentProcess.pid,
        start: startTime,
        end: endTime,
        burstTime: executionTime,
      })
    }

    currentProcess.remainingTime -= executionTime
    currentTime = endTime

    const newArrivals = processesCopy.filter(
      (p) =>
        p.arrivalTime > startTime &&
        p.arrivalTime <= currentTime &&
        !p.completed &&
        !queue.includes(p)
    )

    newArrivals.forEach((p) => {
      if (!queue.includes(p)) {
        queue.push(p)
      }
    })

    if (currentProcess.remainingTime === 0) {
      currentProcess.completed = true
      currentProcess.completionTime = currentTime
      currentProcess.turnaroundTime =
        currentProcess.completionTime - currentProcess.arrivalTime
      currentProcess.waitingTime =
        currentProcess.turnaroundTime - currentProcess.burstTime
      completedCount++
    } else {
      queue.push(currentProcess)
    }

    lastProcess = currentProcess
  }

  const statistics = []
  let totalWaiting = 0
  let totalTurnaround = 0

  const sortedByOriginalIndex = [...processesCopy].sort(
    (a, b) => a.originalIndex - b.originalIndex
  )

  for (const process of sortedByOriginalIndex) {
    statistics.push({
      pid: process.pid,
      completionTime: process.completionTime,
      waitingTime: process.waitingTime,
      turnaroundTime: process.turnaroundTime,
    })
    totalWaiting += process.waitingTime
    totalTurnaround += process.turnaroundTime
  }

  const sortedStatistics = [...statistics].sort((a, b) => {
    const pidA = parseInt(a.pid.substring(1))
    const pidB = parseInt(b.pid.substring(1))
    return pidA - pidB
  })

  const finalGanttData = []
  for (let i = 0; i < ganttData.length; i++) {
    if (
      i > 0 &&
      ganttData[i].pid === ganttData[i - 1].pid &&
      ganttData[i].start === ganttData[i - 1].end
    ) {
      finalGanttData[finalGanttData.length - 1].end = ganttData[i].end
      finalGanttData[finalGanttData.length - 1].burstTime =
        finalGanttData[finalGanttData.length - 1].end -
        finalGanttData[finalGanttData.length - 1].start
    } else {
      finalGanttData.push({ ...ganttData[i] })
    }
  }

  return {
    ganttData: finalGanttData,
    statistics: sortedStatistics,
    avgWaitingTime: totalWaiting / processesCopy.length,
    avgTurnaroundTime: totalTurnaround / processesCopy.length,
  }
}

export function runPriority(processes) {
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
      if (a.priority !== b.priority) {
        return a.priority - b.priority
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

export function runSRTF(processes) {
  const processesCopy = processes.map((p, idx) => ({
    ...p,
    originalIndex: idx,
    remainingTime: p.burstTime,
    completionTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
    completed: false,
  }))

  let currentTime = 0
  let completedCount = 0
  const ganttData = []

  while (completedCount < processesCopy.length) {
    let availableProcesses = processesCopy.filter(
      (p) => p.arrivalTime <= currentTime && !p.completed && p.remainingTime > 0
    )

    if (availableProcesses.length === 0) {
      const nextArrival = Math.min(
        ...processesCopy.filter((p) => !p.completed).map((p) => p.arrivalTime)
      )
      currentTime = nextArrival
      continue
    }

    availableProcesses.sort((a, b) => {
      if (a.remainingTime !== b.remainingTime) {
        return a.remainingTime - b.remainingTime
      }
      if (a.arrivalTime !== b.arrivalTime) {
        return a.arrivalTime - b.arrivalTime
      }
      return a.originalIndex - b.originalIndex
    })

    const selectedProcess = availableProcesses[0]
    let nextEventTime = Number.MAX_SAFE_INTEGER

    const nextArrivingProcess = processesCopy
      .filter((p) => !p.completed && p.arrivalTime > currentTime)
      .sort((a, b) => a.arrivalTime - b.arrivalTime)[0]

    if (nextArrivingProcess) {
      nextEventTime = nextArrivingProcess.arrivalTime
    }

    const executionTime = Math.min(
      selectedProcess.remainingTime,
      nextEventTime - currentTime
    )
    const startTime = currentTime
    const endTime = startTime + executionTime

    if (
      ganttData.length > 0 &&
      ganttData[ganttData.length - 1].pid === selectedProcess.pid
    ) {
      ganttData[ganttData.length - 1].end = endTime
    } else {
      ganttData.push({
        pid: selectedProcess.pid,
        start: startTime,
        end: endTime,
        burstTime: executionTime,
      })
    }

    selectedProcess.remainingTime -= executionTime
    currentTime = endTime

    if (selectedProcess.remainingTime === 0) {
      selectedProcess.completed = true
      selectedProcess.completionTime = currentTime
      selectedProcess.turnaroundTime =
        selectedProcess.completionTime - selectedProcess.arrivalTime
      selectedProcess.waitingTime =
        selectedProcess.turnaroundTime - selectedProcess.burstTime
      completedCount++
    }
  }

  const statistics = []
  let totalWaiting = 0
  let totalTurnaround = 0

  const sortedByOriginalIndex = [...processesCopy].sort(
    (a, b) => a.originalIndex - b.originalIndex
  )

  for (const process of sortedByOriginalIndex) {
    statistics.push({
      pid: process.pid,
      completionTime: process.completionTime,
      waitingTime: process.waitingTime,
      turnaroundTime: process.turnaroundTime,
    })
    totalWaiting += process.waitingTime
    totalTurnaround += process.turnaroundTime
  }

  const sortedStatistics = [...statistics].sort((a, b) => {
    const pidA = parseInt(a.pid.substring(1))
    const pidB = parseInt(b.pid.substring(1))
    return pidA - pidB
  })

  const finalGanttData = []
  for (let i = 0; i < ganttData.length; i++) {
    if (
      i > 0 &&
      ganttData[i].pid === ganttData[i - 1].pid &&
      ganttData[i].start === ganttData[i - 1].end
    ) {
      finalGanttData[finalGanttData.length - 1].end = ganttData[i].end
      finalGanttData[finalGanttData.length - 1].burstTime =
        finalGanttData[finalGanttData.length - 1].end -
        finalGanttData[finalGanttData.length - 1].start
    } else {
      finalGanttData.push({ ...ganttData[i] })
    }
  }

  return {
    ganttData: finalGanttData,
    statistics: sortedStatistics,
    avgWaitingTime: totalWaiting / processesCopy.length,
    avgTurnaroundTime: totalTurnaround / processesCopy.length,
  }
}

export function runMLQ(processes) {
  const processesCopy = processes.map((p, idx) => ({
    ...p,
    originalIndex: idx,
    remainingTime: p.burstTime,
    completionTime: 0,
    waitingTime: 0,
    turnaroundTime: 0,
    completed: false,
    queueType: p.priority <= 2 ? 'high' : 'low',
  }))

  let currentTime = 0
  let completedCount = 0
  const ganttData = []
  const highQueue = []
  const lowQueue = []

  const updateQueues = () => {
    const arrivals = processesCopy.filter(
      (p) =>
        !p.completed &&
        p.arrivalTime <= currentTime &&
        p.remainingTime > 0 &&
        ((p.queueType === 'high' && !highQueue.includes(p)) ||
          (p.queueType === 'low' && !lowQueue.includes(p)))
    )
    arrivals.forEach((p) => {
      if (p.queueType === 'high') highQueue.push(p)
      else lowQueue.push(p)
    })
    lowQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)
  }

  const getNextHighArrivalTime = () => {
    let nextArrival = Infinity
    for (const p of processesCopy) {
      if (
        !p.completed &&
        p.queueType === 'high' &&
        p.arrivalTime > currentTime
      ) {
        if (p.arrivalTime < nextArrival) nextArrival = p.arrivalTime
      }
    }
    return nextArrival
  }

  while (completedCount < processesCopy.length) {
    updateQueues()

    if (highQueue.length === 0 && lowQueue.length === 0) {
      const nextArrival = Math.min(
        ...processesCopy.filter((p) => !p.completed).map((p) => p.arrivalTime)
      )
      currentTime = nextArrival
      continue
    }

    let selectedProcess = null
    let executionTime = 0

    if (highQueue.length > 0) {
      selectedProcess = highQueue.shift()
      executionTime = Math.min(2, selectedProcess.remainingTime)
    } else {
      selectedProcess = lowQueue.shift()
      const nextHighArrival = getNextHighArrivalTime()
      if (nextHighArrival !== Infinity) {
        executionTime = Math.min(
          selectedProcess.remainingTime,
          nextHighArrival - currentTime
        )
      } else {
        executionTime = selectedProcess.remainingTime
      }
    }

    if (executionTime <= 0) continue

    const startTime = currentTime
    const endTime = startTime + executionTime

    if (
      ganttData.length > 0 &&
      ganttData[ganttData.length - 1].pid === selectedProcess.pid &&
      ganttData[ganttData.length - 1].end === startTime
    ) {
      ganttData[ganttData.length - 1].end = endTime
    } else {
      ganttData.push({
        pid: selectedProcess.pid,
        start: startTime,
        end: endTime,
        burstTime: executionTime,
      })
    }

    selectedProcess.remainingTime -= executionTime
    currentTime = endTime

    updateQueues()

    if (selectedProcess.remainingTime === 0) {
      selectedProcess.completed = true
      selectedProcess.completionTime = currentTime
      selectedProcess.turnaroundTime =
        selectedProcess.completionTime - selectedProcess.arrivalTime
      selectedProcess.waitingTime =
        selectedProcess.turnaroundTime - selectedProcess.burstTime
      completedCount++
    } else {
      if (selectedProcess.queueType === 'high') {
        highQueue.push(selectedProcess)
      } else {
        lowQueue.unshift(selectedProcess)
      }
    }
  }

  const statistics = []
  let totalWaiting = 0
  let totalTurnaround = 0

  const sortedByOriginalIndex = [...processesCopy].sort(
    (a, b) => a.originalIndex - b.originalIndex
  )

  for (const process of sortedByOriginalIndex) {
    statistics.push({
      pid: process.pid,
      completionTime: process.completionTime,
      waitingTime: process.waitingTime,
      turnaroundTime: process.turnaroundTime,
    })
    totalWaiting += process.waitingTime
    totalTurnaround += process.turnaroundTime
  }

  const sortedStatistics = [...statistics].sort((a, b) => {
    const pidA = parseInt(a.pid.substring(1))
    const pidB = parseInt(b.pid.substring(1))
    return pidA - pidB
  })

  const finalGanttData = []
  for (let i = 0; i < ganttData.length; i++) {
    if (
      i > 0 &&
      ganttData[i].pid === ganttData[i - 1].pid &&
      ganttData[i].start === ganttData[i - 1].end
    ) {
      finalGanttData[finalGanttData.length - 1].end = ganttData[i].end
      finalGanttData[finalGanttData.length - 1].burstTime =
        finalGanttData[finalGanttData.length - 1].end -
        finalGanttData[finalGanttData.length - 1].start
    } else {
      finalGanttData.push({ ...ganttData[i] })
    }
  }

  return {
    ganttData: finalGanttData,
    statistics: sortedStatistics,
    avgWaitingTime: totalWaiting / processesCopy.length,
    avgTurnaroundTime: totalTurnaround / processesCopy.length,
  }
}
