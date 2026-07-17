const createStep = ({ line, explanation, entities, state, duration = 900 }) => ({
  line,
  explanation,
  entities,
  state,
  duration,
})

const number = (value, label) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a valid number.`)
  return parsed
}

const parseList = (input, mapper) => {
  const values = input.split(',').map((value) => value.trim()).filter(Boolean)
  if (!values.length) throw new Error('Enter at least one item.')
  return values.map(mapper)
}

const withStatus = (labels, current = [], selected = [], rejected = []) =>
  labels.map((label) => ({
    label,
    status: current.includes(label)
      ? 'current'
      : selected.includes(label)
        ? 'selected'
        : rejected.includes(label)
          ? 'rejected'
          : 'pending',
  }))

const parseActivities = (input) =>
  parseList(input, (value, index) => {
    const [start, finish] = value.split('-').map((part) => number(part, 'Activity time'))
    if (finish < start) throw new Error('Each activity finish time must be at least its start time.')
    return { id: `A${index + 1}`, start, finish }
  })

const activitySteps = (input) => {
  const activities = parseActivities(input).sort((a, b) => a.finish - b.finish)
  const selected = []
  const rejected = []
  const labels = activities.map((activity) => activity.id)
  const steps = [
    createStep({
      line: 1,
      explanation: 'Activities are sorted by finish time so each choice leaves as much room as possible.',
      entities: withStatus(labels),
      state: `Order: ${activities.map((activity) => `${activity.id} (${activity.start}-${activity.finish})`).join(' → ')}`,
    }),
  ]
  let lastFinish = -Infinity
  for (const activity of activities) {
    const accepted = activity.start >= lastFinish
    if (accepted) {
      selected.push(activity.id)
      lastFinish = activity.finish
    } else rejected.push(activity.id)
    steps.push(
      createStep({
        line: accepted ? 4 : 3,
        explanation: accepted
          ? `${activity.id} starts at ${activity.start}, after the last finish ${lastFinish}; select it.`
          : `${activity.id} starts at ${activity.start}, before the last selected finish ${lastFinish}; reject it.`,
        entities: withStatus(labels, [activity.id], selected, rejected),
        state: `Selected: ${selected.join(', ') || 'none'} · Last finish: ${lastFinish}`,
      })
    )
  }
  return steps
}

const parseKnapsack = (input) => {
  const [itemsText, capacityText] = input.split('|')
  const capacity = number(capacityText, 'Capacity')
  if (capacity < 0) throw new Error('Capacity cannot be negative.')
  return {
    capacity,
    items: parseList(itemsText, (value, index) => {
      const [valuePart, weightPart] = value.split(':')
      const itemValue = number(valuePart, 'Item value')
      const weight = number(weightPart, 'Item weight')
      if (weight <= 0) throw new Error('Item weights must be greater than zero.')
      return { id: `I${index + 1}`, value: itemValue, weight, ratio: itemValue / weight }
    }),
  }
}

const knapsackSteps = (input) => {
  const { capacity: initialCapacity, items } = parseKnapsack(input)
  const ordered = [...items].sort((a, b) => b.ratio - a.ratio)
  const labels = ordered.map((item) => item.id)
  const selected = []
  const steps = [createStep({ line: 1, explanation: 'Sort items by value-to-weight ratio in descending order.', entities: withStatus(labels), state: ordered.map((item) => `${item.id}: ${item.ratio.toFixed(2)}`).join(' · ') })]
  let capacity = initialCapacity
  let total = 0
  for (const item of ordered) {
    const take = Math.min(capacity, item.weight)
    if (take === 0) break
    const fraction = take / item.weight
    capacity -= take
    total += fraction * item.value
    selected.push(item.id)
    steps.push(createStep({
      line: fraction === 1 ? 4 : 5,
      explanation: fraction === 1 ? `Take all of ${item.id}.` : `Take ${(fraction * 100).toFixed(0)}% of ${item.id} to fill the remaining capacity.`,
      entities: withStatus(labels, [item.id], selected),
      state: `Value: ${total.toFixed(2)} · Remaining capacity: ${capacity.toFixed(2)}`,
    }))
  }
  return steps
}

const huffmanSteps = (input) => {
  const nodes = parseList(input, (value) => {
    const [symbol, frequency] = value.split(':')
    const freq = number(frequency, 'Frequency')
    if (!symbol || freq < 0) throw new Error('Use non-empty symbols with non-negative frequencies.')
    return { id: symbol, freq }
  })
  const steps = [createStep({ line: 1, explanation: 'Place all symbols in a min-priority queue by frequency.', entities: nodes.map((node) => ({ label: `${node.id}:${node.freq}`, status: 'pending' })), state: 'Min-heap initialized.' })]
  let count = 1
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq)
    const left = nodes.shift()
    const right = nodes.shift()
    const parent = { id: `N${count}`, freq: left.freq + right.freq }
    count += 1
    nodes.push(parent)
    steps.push(createStep({
      line: 3,
      explanation: `Merge ${left.id} (${left.freq}) and ${right.id} (${right.freq}) into ${parent.id} (${parent.freq}).`,
      entities: [...nodes, left, right].map((node) => ({ label: `${node.id}:${node.freq}`, status: node.id === parent.id ? 'selected' : node.id === left.id || node.id === right.id ? 'current' : 'pending' })),
      state: `Queue now contains ${nodes.length} node${nodes.length === 1 ? '' : 's'}.`,
    }))
  }
  return steps
}

const parseJobs = (input) =>
  parseList(input, (value) => {
    const [id, deadlinePart, profitPart] = value.split(':')
    const deadline = number(deadlinePart, 'Deadline')
    const profit = number(profitPart, 'Profit')
    if (!id || deadline < 1) throw new Error('Jobs need an ID and a positive deadline.')
    return { id, deadline: Math.floor(deadline), profit }
  })

const jobSteps = (input) => {
  const jobs = parseJobs(input).sort((a, b) => b.profit - a.profit)
  const slots = Array(Math.max(...jobs.map((job) => job.deadline))).fill(null)
  const selected = []
  const rejected = []
  const labels = jobs.map((job) => job.id)
  const steps = [createStep({ line: 1, explanation: 'Sort jobs by descending profit.', entities: withStatus(labels), state: jobs.map((job) => `${job.id}(${job.profit})`).join(' → ') })]
  for (const job of jobs) {
    let day = Math.min(job.deadline, slots.length) - 1
    while (day >= 0 && slots[day]) day -= 1
    if (day >= 0) {
      slots[day] = job.id
      selected.push(job.id)
    } else rejected.push(job.id)
    steps.push(createStep({ line: day >= 0 ? 4 : 3, explanation: day >= 0 ? `Place ${job.id} in the latest free slot: ${day + 1}.` : `No free slot remains before ${job.id}'s deadline; reject it.`, entities: withStatus(labels, [job.id], selected, rejected), state: `Slots: ${slots.map((jobId, index) => `${index + 1}:${jobId ?? '—'}`).join(' · ')}` }))
  }
  return steps
}

const parseGraph = (input) => {
  const edges = parseList(input, (value) => {
    const [pair, weightText] = value.split(':')
    const [from, to] = pair.split('-')
    const weight = number(weightText, 'Edge weight')
    if (!from || !to || weight < 0) throw new Error('Use A-B:weight with non-negative weights.')
    return { from, to, weight, id: `${from}-${to}` }
  })
  const nodes = [...new Set(edges.flatMap((edge) => [edge.from, edge.to]))]
  return { edges, nodes }
}

const graphEntities = (nodes, current = [], selected = [], rejected = []) => withStatus(nodes, current, selected, rejected)

const dijkstraSteps = (input, source) => {
  const { edges, nodes } = parseGraph(input)
  if (!nodes.includes(source)) throw new Error('The source node must appear in the graph.')
  const adjacency = Object.fromEntries(nodes.map((node) => [node, []]))
  for (const edge of edges) { adjacency[edge.from].push([edge.to, edge.weight]); adjacency[edge.to].push([edge.from, edge.weight]) }
  const distance = Object.fromEntries(nodes.map((node) => [node, Infinity]))
  const visited = []
  const queue = [[0, source]]
  distance[source] = 0
  const steps = [createStep({ line: 1, explanation: `Set ${source} to distance 0 and every other node to infinity.`, entities: graphEntities(nodes, [source]), state: formatDistances(distance) })]
  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0])
    const [dist, node] = queue.shift()
    if (visited.includes(node)) continue
    visited.push(node)
    steps.push(createStep({ line: 3, explanation: `Settle ${node}, the smallest tentative distance (${dist}).`, entities: graphEntities(nodes, [node], visited), state: formatDistances(distance) }))
    for (const [next, weight] of adjacency[node]) {
      if (dist + weight < distance[next]) {
        distance[next] = dist + weight
        queue.push([distance[next], next])
        steps.push(createStep({ line: 5, explanation: `Relax ${node} → ${next}: update distance to ${distance[next]}.`, entities: graphEntities(nodes, [next], visited), state: formatDistances(distance) }))
      }
    }
  }
  return steps
}

const primSteps = (input) => {
  const { edges, nodes } = parseGraph(input)
  const used = []
  const queue = [[0, nodes[0], null]]
  const steps = [createStep({ line: 1, explanation: `Start the tree at ${nodes[0]}.`, entities: graphEntities(nodes, [nodes[0]]), state: 'MST cost: 0' })]
  let cost = 0
  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0])
    const [weight, node, via] = queue.shift()
    if (used.includes(node)) continue
    used.push(node); cost += weight
    steps.push(createStep({ line: 3, explanation: via ? `Add ${via} → ${node} (weight ${weight}) to the tree.` : `Add starting node ${node}.`, entities: graphEntities(nodes, [node], used), state: `MST cost: ${cost} · Tree: ${used.join(', ')}` }))
    for (const edge of edges) {
      const next = edge.from === node ? edge.to : edge.to === node ? edge.from : null
      if (next && !used.includes(next)) queue.push([edge.weight, next, node])
    }
  }
  return steps
}

const kruskalSteps = (input) => {
  const { edges, nodes } = parseGraph(input)
  const ordered = [...edges].sort((a, b) => a.weight - b.weight)
  const parent = Object.fromEntries(nodes.map((node) => [node, node]))
  const find = (node) => parent[node] === node ? node : (parent[node] = find(parent[node]))
  const chosen = []
  const rejected = []
  const steps = [createStep({ line: 1, explanation: 'Sort every edge by increasing weight.', entities: ordered.map((edge) => ({ label: `${edge.id}:${edge.weight}`, status: 'pending' })), state: 'Each vertex begins in its own component.' })]
  for (const edge of ordered) {
    const from = find(edge.from), to = find(edge.to)
    if (from !== to) { parent[from] = to; chosen.push(edge.id) } else rejected.push(edge.id)
    steps.push(createStep({ line: from !== to ? 4 : 3, explanation: from !== to ? `Add ${edge.id}; it joins two components.` : `Skip ${edge.id}; it would create a cycle.`, entities: withStatus(ordered.map((item) => item.id), [edge.id], chosen, rejected), state: `MST edges: ${chosen.join(', ') || 'none'}` }))
    if (chosen.length === nodes.length - 1) break
  }
  return steps
}

const formatDistances = (distance) => Object.entries(distance).map(([node, value]) => `${node}:${value === Infinity ? '∞' : value}`).join(' · ')

export const VISUALIZER_CONFIG = {
  'activity-selection': { label: 'start-finish pairs', sample: '1-2, 3-4, 0-6, 5-7, 8-9, 5-9', random: () => Array.from({ length: 6 }, () => { const start = Math.floor(Math.random() * 8); return `${start}-${start + 1 + Math.floor(Math.random() * 4)}` }).join(', '), pseudocode: ['sort activities by finish time', 'for each activity', 'if activity starts after last finish', '  select activity and update last finish'] },
  'fractional-knapsack': { label: 'value:weight pairs | capacity', sample: '60:10, 100:20, 120:30 | 50', random: () => `${Array.from({ length: 4 }, () => `${20 + Math.floor(Math.random() * 100)}:${5 + Math.floor(Math.random() * 25)}`).join(', ')} | ${30 + Math.floor(Math.random() * 40)}`, pseudocode: ['sort items by value / weight', 'for each item', 'take the available amount', 'if the item fits, take all', 'otherwise take the remaining fraction'] },
  'huffman-coding': { label: 'symbol:frequency pairs', sample: 'A:5, B:9, C:12, D:13, E:16, F:45', random: () => ['A', 'B', 'C', 'D', 'E'].map((letter) => `${letter}:${1 + Math.floor(Math.random() * 25)}`).join(', '), pseudocode: ['push all symbols into a min-heap', 'while more than one node remains', 'remove two least-frequent nodes', 'merge them and push the parent'] },
  'job-sequencing': { label: 'id:deadline:profit triples', sample: 'a:2:100, b:1:19, c:2:27, d:1:25, e:3:15', random: () => ['a', 'b', 'c', 'd', 'e'].map((id) => `${id}:${1 + Math.floor(Math.random() * 4)}:${10 + Math.floor(Math.random() * 100)}`).join(', '), pseudocode: ['sort jobs by descending profit', 'for each job', 'find its latest free slot', 'place the job if a slot exists'] },
  dijkstra: { label: 'undirected edges (A-B:weight)', sample: 'A-B:4, A-C:1, C-B:2, B-D:1, C-D:5', source: 'A', random: () => 'A-B:4, A-C:2, B-C:1, B-D:5, C-D:3', pseudocode: ['set source distance to 0', 'while the priority queue is not empty', 'settle the closest vertex', 'for each adjacent edge', 'relax the edge if it improves distance'] },
  prim: { label: 'undirected edges (A-B:weight)', sample: 'A-B:1, A-C:4, B-C:2, B-D:5, C-D:3', random: () => 'A-B:2, A-C:5, B-C:1, B-D:4, C-D:3', pseudocode: ['start with any vertex', 'while candidate edges exist', 'take the lightest edge', 'add its unvisited endpoint to the tree'] },
  kruskal: { label: 'undirected edges (A-B:weight)', sample: 'A-B:1, B-C:2, C-D:3, A-C:4, B-D:5', random: () => 'A-B:3, A-C:1, B-C:2, B-D:4, C-D:5', pseudocode: ['sort all edges by weight', 'for each edge', 'if endpoints are in different components', 'add the edge and union components'] },
}

export const generateSteps = (algorithmId, input, source = 'A') => {
  const generators = { 'activity-selection': activitySteps, 'fractional-knapsack': knapsackSteps, 'huffman-coding': huffmanSteps, 'job-sequencing': jobSteps, dijkstra: (value) => dijkstraSteps(value, source), prim: primSteps, kruskal: kruskalSteps }
  return generators[algorithmId](input)
}
