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
})

export function generateJobSequencingSteps(inputJobs) {
  const steps = []

  // Clean and prepare jobs
  let jobs = inputJobs
    .map((job, index) => ({
      id: job.id || `J${index + 1}`,
      profit: Number(job.profit),
      deadline: Number(job.deadline),
      status: 'staged', // staged, sorting, sorted, active, scheduled, missed
      slotAssigned: null,
    }))
    .filter(
      (job) =>
        !isNaN(job.profit) &&
        !isNaN(job.deadline) &&
        job.profit > 0 &&
        job.deadline > 0
    )

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
    ]
  }

  // Find max deadline of input jobs to size the timeline
  const maxDeadline = Math.max(...jobs.map((job) => job.deadline))

  // Timeline: array of slots from 1 to maxDeadline
  // slots are 0-indexed in array but represent time [i to i+1]
  const timeline = Array.from({ length: maxDeadline }, (_, i) => ({
    slotIndex: i,
    label: `${i}-${i + 1}`,
    jobId: null,
    status: 'empty', // empty, checking, filled
  }))

  let totalProfit = 0
  let scheduledCount = 0
  let missedCount = 0

  // 1. Initial State
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
  )

  // Highlight that we're sorting jobs by profit descending
  jobs.forEach((job) => (job.status = 'sorting'))
  steps.push(
    createStep({
      lineKey: 'sort',
      type: 'sorting',
      jobs,
      timeline,
      message:
        'Sorting jobs in descending order of profit to prioritize high-value jobs.',
      variables: { sorting: true, totalProfit },
      duration: 1200,
    })
  )

  // Actual sort
  jobs.sort((a, b) => b.profit - a.profit || a.deadline - b.deadline)
  jobs.forEach((job) => (job.status = 'sorted'))

  steps.push(
    createStep({
      lineKey: 'sort',
      type: 'sorted',
      jobs,
      timeline,
      message:
        'Jobs sorted by profit descending. We will now consider each job greedily.',
      variables: { sorted: true, totalProfit },
      duration: 1200,
    })
  )

  // Initialize timeline slots in code
  steps.push(
    createStep({
      lineKey: 'initSlots',
      type: 'init-timeline',
      jobs,
      timeline,
      message: `Initializing time-slot timeline of size ${maxDeadline} based on the maximum deadline.`,
      variables: { maxDeadline, totalProfit },
      duration: 1000,
    })
  )

  // 2. Iterate through sorted jobs
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i]
    job.status = 'active'

    steps.push(
      createStep({
        lineKey: 'loopJobs',
        type: 'process-job',
        jobs,
        timeline,
        activeJobId: job.id,
        message: `Inspecting Job ${job.id} (Profit: $${job.profit}, Deadline: ${job.deadline}). Searching for a slot backwards from slot ${job.deadline}.`,
        variables: {
          activeJob: job.id,
          profit: job.profit,
          deadline: job.deadline,
          totalProfit,
        },
        duration: 1200,
      })
    )

    let foundSlot = false
    // j starts from deadline - 1 down to 0
    for (let j = job.deadline - 1; j >= 0; j--) {
      if (j >= maxDeadline) continue

      // Mark slot as checking
      timeline[j].status = 'checking'

      steps.push(
        createStep({
          lineKey: 'loopSlots',
          type: 'check-slot',
          jobs,
          timeline,
          activeJobId: job.id,
          activeSlotIndex: j,
          message: `Checking if Slot ${j + 1} (${timeline[j].label}) is available for Job ${job.id}.`,
          variables: { activeJob: job.id, checkingSlot: j + 1, totalProfit },
          duration: 1000,
        })
      )

      if (timeline[j].jobId === null) {
        // Slot is free!
        timeline[j].jobId = job.id
        timeline[j].status = 'filled'

        job.status = 'scheduled'
        job.slotAssigned = j + 1

        totalProfit += job.profit
        scheduledCount++
        foundSlot = true

        steps.push(
          createStep({
            lineKey: 'assignSlot',
            type: 'schedule-success',
            jobs,
            timeline,
            activeJobId: job.id,
            activeSlotIndex: j,
            message: `Slot ${j + 1} is free! Scheduled Job ${job.id} in slot ${timeline[j].label}. Profit increases by $${job.profit}.`,
            variables: {
              activeJob: job.id,
              assignedSlot: j + 1,
              totalProfit,
              scheduledJobs: `${scheduledCount}/${jobs.length}`,
            },
            duration: 1200,
          })
        )
        break
      } else {
        // Slot is occupied, reset status to filled for visual representation
        timeline[j].status = 'filled'

        steps.push(
          createStep({
            lineKey: 'loopSlots',
            type: 'slot-occupied',
            jobs,
            timeline,
            activeJobId: job.id,
            activeSlotIndex: j,
            message: `Slot ${j + 1} (${timeline[j].label}) is already occupied by Job ${timeline[j].jobId}. Continuing search backwards.`,
            variables: { activeJob: job.id, occupiedSlot: j + 1, totalProfit },
            duration: 1000,
          })
        )
      }
    }

    if (!foundSlot) {
      job.status = 'missed'
      missedCount++

      steps.push(
        createStep({
          lineKey: 'loopJobs',
          type: 'schedule-miss',
          jobs,
          timeline,
          activeJobId: job.id,
          message: `No available slots found before deadline ${job.deadline} for Job ${job.id}. This job is missed.`,
          variables: {
            activeJob: job.id,
            status: 'Missed',
            totalProfit,
            missedCount,
          },
          duration: 1200,
        })
      )
    }
  }

  // 3. Finish
  steps.push(
    createStep({
      lineKey: 'finish',
      type: 'complete',
      jobs,
      timeline,
      message: `Visualization complete! Scheduled ${scheduledCount} jobs for a total profit of $${totalProfit}.`,
      variables: { totalProfit, scheduledCount, missedCount, completed: true },
      duration: 1500,
    })
  )

  return steps
}
