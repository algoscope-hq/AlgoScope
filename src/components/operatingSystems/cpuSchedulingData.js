// cpuSchedulingData.js
export const algorithmInfo = {
  fcfs: {
    name: 'First Come First Serve (FCFS)',
    description: 'Processes execute in order of arrival.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    explanation: 'Processes are sorted by arrival time.',
  },

  sjf: {
    name: 'Shortest Job First (SJF) - Non-preemptive',
    description:
      'Processes with the smallest burst time execute first. If tie, earlier arrival time wins.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    explanation:
      'Each scheduling decision scans available processes to find the shortest job.',
  },

  rr: {
    name: 'Round Robin (RR)',
    description: 'Each process receives a fixed time quantum in cyclic order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    explanation:
      'Processes are executed in a rotating queue using a fixed time quantum.',
  },

  priority: {
    name: 'Priority Scheduling',
    description:
      'Processes are executed according to priority. Lower value means higher priority.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    explanation:
      'At each scheduling decision, the highest-priority available process is selected.',
  },

  srtf: {
    name: 'Shortest Remaining Time First (SRTF)',
    description:
      'Preemptive version of SJF. The process with the shortest remaining execution time is always selected.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    explanation:
      'At every unit of execution, the scheduler may switch to a newly arrived process with a smaller remaining burst time.',
  },

  mlq: {
    name: 'Multilevel Queue Scheduling (MLQ)',
    description:
      'Processes are permanently assigned to different queues based on priority. Higher-priority queues execute before lower-priority queues.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    explanation:
      'High-priority processes are scheduled using Round Robin while lower-priority processes use FCFS.',
  },
}
