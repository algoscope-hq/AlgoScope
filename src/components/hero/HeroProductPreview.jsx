import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/** Step advance intervals (ms) — higher = slower */
const STEP_MS = {
  backtrack: 1100,
  graph: 2400,
  tree: 2200,
}

/* ——— Backtracking maze (primary) ——— */
const BT_COLS = 8
const BT_ROWS = 5
const BT_CELL = 18
const BT_W = BT_COLS * BT_CELL
const BT_H = BT_ROWS * BT_CELL
/** Walls avoid the scripted explore + solution routes */
const BT_WALLS = new Set(['3,2', '0,3', '2,4'])
const BT_START = [0, 0]
const BT_END = [7, 4]

const BT_SOLUTION = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [1, 1],
  [1, 2],
  [2, 2],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [7, 3],
  [7, 4],
]

/** path = active trail; dead = failed attempts; phase labels rollback */
const BACKTRACK_STEPS = [
  { path: [[0, 0]], dead: [], phase: 'try' },
  {
    path: [
      [0, 0],
      [1, 0],
    ],
    dead: [],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    dead: [],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    dead: [],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    dead: [],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [4, 1],
    ],
    dead: [],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [4, 1],
      [5, 1],
    ],
    dead: [[5, 1]],
    phase: 'dead',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    dead: [[5, 1]],
    phase: 'undo',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    dead: [[5, 1]],
    phase: 'undo',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    dead: [[5, 1]],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
    dead: [[5, 1]],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
    ],
    dead: [[5, 1]],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [6, 1],
    ],
    dead: [[5, 1]],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [6, 1],
      [7, 1],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'dead',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'undo',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'undo',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'undo',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'undo',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
      [4, 3],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [7, 3],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'try',
  },
  {
    path: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [1, 1],
      [1, 2],
      [2, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [5, 3],
      [6, 3],
      [7, 3],
      [7, 4],
    ],
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: 'found',
  },
  ...BT_SOLUTION.map((_, i) => ({
    path: BT_SOLUTION.slice(0, i + 1),
    dead: [
      [5, 1],
      [7, 1],
    ],
    phase: i === BT_SOLUTION.length - 1 ? 'complete' : 'success',
  })),
]

/* ——— Cyclic graph BFS ——— */
const G_VIEW = '6 0 88 50'
const G_NODES = [
  { id: 1, x: 50, y: 8 },
  { id: 2, x: 78, y: 22 },
  { id: 3, x: 22, y: 22 },
  { id: 4, x: 50, y: 32 },
  { id: 5, x: 22, y: 44 },
  { id: 6, x: 78, y: 44 },
]
const G_EDGES = [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 6],
  [3, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
]
const G_LEVEL_COLORS = [
  'rgba(56,189,248,0.9)',
  'rgba(56,189,248,0.55)',
  'rgba(56,189,248,0.35)',
]

/* ——— Tree DFS ——— */
const T_VIEW = '4 0 92 54'
const T_NODES = [
  { id: 0, x: 50, y: 8, depth: 0 },
  { id: 1, x: 32, y: 26, depth: 1 },
  { id: 2, x: 68, y: 26, depth: 1 },
  { id: 3, x: 20, y: 46, depth: 2 },
  { id: 4, x: 40, y: 46, depth: 2 },
  { id: 5, x: 60, y: 46, depth: 2 },
  { id: 6, x: 80, y: 46, depth: 2 },
]
const T_EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
]
const T_CHILDREN = { 0: [1, 2], 1: [3, 4], 2: [5, 6] }

const {
  steps: G_BFS_STEPS,
  parent: G_PARENT,
  level: G_LEVEL,
} = buildGraphBfsSteps(1)
const T_DFS_STEPS = buildTreeDfsSteps(0)

function buildGraphBfsSteps(startId) {
  const adj = new Map(G_NODES.map((n) => [n.id, []]))
  for (const [a, b] of G_EDGES) {
    adj.get(a).push(b)
    adj.get(b).push(a)
  }
  for (const neighbors of adj.values()) {
    neighbors.sort((a, b) => a - b)
  }

  const parent = { [startId]: null }
  const level = { [startId]: 0 }
  const visitedOrder = []
  const enqueued = new Set([startId])
  const queue = [startId]
  const steps = []

  while (queue.length > 0) {
    const node = queue.shift()
    visitedOrder.push(node)

    for (const next of adj.get(node)) {
      if (!enqueued.has(next)) {
        enqueued.add(next)
        queue.push(next)
        parent[next] = node
        level[next] = level[node] + 1
      }
    }

    const next = queue[0] ?? null
    steps.push({
      visited: [...visitedOrder],
      current: node,
      edge: parent[node] == null ? null : [parent[node], node],
      queue: [...queue],
      nextInQueue: next,
      level: level[node],
      label:
        queue.length === 0
          ? `visited node ${node} · queue empty`
          : `visited node ${node} · next in queue: ${next}`,
    })
  }

  return { steps, parent, level }
}

function buildTreeDfsSteps(rootId) {
  const visited = []
  const visitedSet = new Set()
  const stack = []
  const steps = []

  function dfs(node, parent) {
    stack.push(node)
    if (!visitedSet.has(node)) {
      visitedSet.add(node)
      visited.push(node)
    }

    steps.push({
      visited: [...visited],
      current: node,
      stack: [...stack],
      edge: parent == null ? null : [parent, node],
      mode: parent == null ? 'visit' : 'down',
      label: parent == null ? 'visit root' : 'go deeper',
    })

    for (const child of T_CHILDREN[node] ?? []) {
      dfs(child, node)
      stack.pop()
      steps.push({
        visited: [...visited],
        current: node,
        stack: [...stack],
        edge: [node, child],
        mode: 'up',
        label: 'return',
      })
    }
  }

  dfs(rootId, null)
  if (steps.length > 0) steps[steps.length - 1].label = 'done'
  return steps
}

function isBfsTreeEdge(a, b) {
  return G_PARENT[a] === b || G_PARENT[b] === a
}

function isStackTreeEdge(a, b, stack) {
  const ai = stack.indexOf(a)
  const bi = stack.indexOf(b)
  if (ai === -1 || bi === -1) return false
  return Math.abs(ai - bi) === 1
}

function btCenter(c, r) {
  return { x: c * BT_CELL + BT_CELL / 2, y: r * BT_CELL + BT_CELL / 2 }
}

function pathKey([c, r]) {
  return `${c},${r}`
}

function isAdjacent(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1
}

function validateMazePath(path) {
  for (let i = 0; i < path.length; i++) {
    if (BT_WALLS.has(pathKey(path[i]))) return false
    if (i > 0 && !isAdjacent(path[i - 1], path[i])) return false
  }
  return true
}

function validateBacktrackSteps() {
  for (const step of BACKTRACK_STEPS) {
    if (!validateMazePath(step.path)) {
      throw new Error(`Invalid backtracking path for phase "${step.phase}"`)
    }
    if (step.phase === 'dead' && step.dead.length > 0) {
      const head = step.path[step.path.length - 1]
      const latest = step.dead[step.dead.length - 1]
      if (pathKey(head) !== pathKey(latest)) {
        throw new Error('Dead phase must end on the probed dead cell')
      }
    }
  }
  if (
    pathKey(BT_SOLUTION[0]) !== pathKey(BT_START) ||
    pathKey(BT_SOLUTION.at(-1)) !== pathKey(BT_END)
  ) {
    throw new Error('Solution must connect start to end')
  }
  if (!validateMazePath(BT_SOLUTION)) {
    throw new Error('Invalid backtracking solution path')
  }
}

if (import.meta.env.DEV) {
  validateBacktrackSteps()
}

function polylinePoints(points) {
  if (points.length < 2) return ''
  return points
    .map(([c, r], i) => {
      const { x, y } = btCenter(c, r)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function nodeById(list, id) {
  return list.find((n) => n.id === id)
}

export function HeroProductPreview() {
  const [btStep, setBtStep] = useState(0)
  const [gStep, setGStep] = useState(0)
  const [tStep, setTStep] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setBtStep((s) => (s + 1) % BACKTRACK_STEPS.length),
      STEP_MS.backtrack
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(
      () => setGStep((s) => (s + 1) % G_BFS_STEPS.length),
      STEP_MS.graph
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(
      () => setTStep((s) => (s + 1) % T_DFS_STEPS.length),
      STEP_MS.tree
    )
    return () => clearInterval(id)
  }, [])

  const bt = BACKTRACK_STEPS[btStep]
  const isSuccessPhase = bt.phase === 'success' || bt.phase === 'complete'
  const pathSet = new Set(bt.path.map(pathKey))
  const deadSet = new Set(bt.dead.map(pathKey))
  const latestDead =
    bt.dead.length > 0 ? pathKey(bt.dead[bt.dead.length - 1]) : null
  const head = bt.path[bt.path.length - 1]
  const headKey = pathKey(head)

  const btLine = useMemo(() => {
    if (isSuccessPhase || bt.path.length < 2) return ''
    return polylinePoints(bt.path)
  }, [bt.path, isSuccessPhase])

  const solutionLine = useMemo(() => {
    if (!isSuccessPhase) return ''
    return polylinePoints(bt.path)
  }, [bt.path, isSuccessPhase])

  const g = G_BFS_STEPS[gStep]
  const t = T_DFS_STEPS[tStep]

  const phaseLabel = {
    try: 'exploring',
    dead: 'dead end',
    undo: 'backtrack',
    found: 'solution',
    success: 'success path',
    complete: 'completed',
  }[bt.phase]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.08, ease }}
      className="relative w-full"
    >
      <div
        role="img"
        aria-label="Backtracking search, graph BFS, and tree DFS visualizations"
        className="w-full overflow-hidden rounded-xl border border-white/[0.1] bg-[#09090b] shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_24px_60px_-18px_rgba(0,0,0,0.88)] max-sm:min-h-[min(68vh,440px)] max-sm:max-h-[min(82vh,520px)] sm:aspect-[16/10] sm:min-h-[260px] sm:max-h-[min(72vw,404px)] sm:rounded-2xl md:max-h-[448px] lg:min-h-[358px] lg:max-h-[516px] xl:max-h-[560px] 2xl:max-h-[604px]"
      >
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0c0c0e] px-3 sm:h-9 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden>
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/10" />
              <span className="size-2 rounded-full bg-white/10" />
            </div>
            <span className="truncate text-[10px] font-medium tracking-tight text-zinc-400 sm:text-[11px]">
              <span className="sm:hidden">Visualizers</span>
              <span className="hidden sm:inline">Algorithm visualizers</span>
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-600">
            <motion.span
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              live
            </motion.span>
          </span>
        </div>

        <div className="grid h-[calc(100%-2rem)] min-h-0 grid-cols-1 grid-rows-[minmax(148px,0.4fr)_minmax(0,0.6fr)] sm:h-[calc(100%-2.25rem)] md:grid-cols-[40fr_60fr] md:grid-rows-1">
          {/* Backtracking */}
          <div className="flex min-h-0 flex-col border-b border-white/[0.06] bg-[#0a0a0c] md:border-b-0 md:border-r">
            <PanelHead
              title="Backtracking"
              badge={phaseLabel}
              tone={bt.phase}
              compact
            />
            <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center p-2 sm:p-2.5">
              <svg
                viewBox={`0 0 ${BT_W} ${BT_H}`}
                className="h-auto max-h-[90%] w-auto max-w-[94%]"
                preserveAspectRatio="xMidYMid meet"
              >
                {Array.from({ length: BT_ROWS * BT_COLS }, (_, i) => {
                  const c = i % BT_COLS
                  const r = Math.floor(i / BT_COLS)
                  const key = `${c},${r}`
                  const wall = BT_WALLS.has(key) && !deadSet.has(key)
                  const start = c === BT_START[0] && r === BT_START[1]
                  const end = c === BT_END[0] && r === BT_END[1]
                  const onPath = pathSet.has(key)
                  const failed = deadSet.has(key)
                  const isLatestDead = failed && key === latestDead
                  const isDeadProbe = bt.phase === 'dead' && isLatestDead
                  const isHead = (key === headKey && !failed) || isDeadProbe
                  const onSuccess = isSuccessPhase && onPath
                  const { x, y } = btCenter(c, r)
                  return (
                    <g key={key}>
                      <rect
                        x={c * BT_CELL + 1}
                        y={r * BT_CELL + 1}
                        width={BT_CELL - 2}
                        height={BT_CELL - 2}
                        rx={3}
                        fill={
                          wall
                            ? 'rgba(255,255,255,0.03)'
                            : failed
                              ? '#dc2626'
                              : onSuccess
                                ? 'rgba(16,185,129,0.88)'
                                : end &&
                                    (bt.phase === 'found' ||
                                      bt.phase === 'complete')
                                  ? 'rgba(16,185,129,0.9)'
                                  : start
                                    ? 'rgba(56,189,248,0.85)'
                                    : onPath
                                      ? bt.phase === 'undo'
                                        ? 'rgba(251,191,36,0.35)'
                                        : 'rgba(255,255,255,0.55)'
                                      : 'rgba(255,255,255,0.07)'
                        }
                        stroke={failed ? 'rgba(252,165,165,0.85)' : 'none'}
                        strokeWidth={failed ? 1.25 : 0}
                      />
                      {failed && (
                        <>
                          {isLatestDead && bt.phase === 'dead' && (
                            <motion.rect
                              x={c * BT_CELL + 1}
                              y={r * BT_CELL + 1}
                              width={BT_CELL - 2}
                              height={BT_CELL - 2}
                              rx={3}
                              fill="rgba(248,113,113,0.35)"
                              animate={{ opacity: [0.2, 0.55, 0.2] }}
                              transition={{ duration: 1.1, repeat: Infinity }}
                            />
                          )}
                          <text
                            x={x}
                            y={y + 3}
                            textAnchor="middle"
                            className="fill-white text-[9px] font-bold"
                          >
                            ×
                          </text>
                        </>
                      )}
                      {isHead && (
                        <motion.circle
                          cx={btCenter(c, r).x}
                          cy={btCenter(c, r).y}
                          r={7}
                          fill="none"
                          stroke={
                            isDeadProbe
                              ? 'rgba(254,202,202,1)'
                              : bt.phase === 'dead'
                                ? 'rgba(239,68,68,0.9)'
                                : bt.phase === 'undo'
                                  ? 'rgba(251,191,36,0.9)'
                                  : isSuccessPhase
                                    ? 'rgba(16,185,129,0.95)'
                                    : 'rgba(255,255,255,0.9)'
                          }
                          strokeWidth="1.5"
                          animate={{ r: [6, 8, 6] }}
                          transition={{ duration: 1.1, repeat: Infinity }}
                        />
                      )}
                    </g>
                  )
                })}
                {btLine && (
                  <motion.path
                    d={btLine}
                    fill="none"
                    stroke={
                      bt.phase === 'undo'
                        ? 'rgba(251,191,36,0.7)'
                        : bt.phase === 'found'
                          ? 'rgba(16,185,129,0.85)'
                          : 'rgba(255,255,255,0.75)'
                    }
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.28 }}
                  />
                )}
                {solutionLine && (
                  <motion.path
                    d={solutionLine}
                    fill="none"
                    stroke="rgba(52,211,153,0.95)"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease }}
                  />
                )}
              </svg>
              <AnimatePresence mode="wait">
                <motion.p
                  key={bt.phase + btStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-1 left-1.5 right-1.5 truncate font-mono text-[6px] text-zinc-600 sm:right-auto sm:text-[8px]"
                >
                  {bt.phase === 'dead' && 'Dead end — undo'}
                  {bt.phase === 'undo' && 'Backtracking…'}
                  {bt.phase === 'try' && 'Exploring…'}
                  {bt.phase === 'found' && 'Solution found'}
                  {bt.phase === 'success' && 'Tracing route…'}
                  {bt.phase === 'complete' && 'Complete'}
                </motion.p>
              </AnimatePresence>
              <div className="absolute bottom-1 right-1.5 hidden gap-1.5 font-mono text-[7px] text-zinc-600 sm:flex">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-red-600" /> dead end
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-emerald-500" /> success
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <GraphBfsPanel step={g} />
            <TreeDfsPanel step={t} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function GraphBfsPanel({ step }) {
  const visited = new Set(step.visited)
  const queue = new Set(step.queue)
  const current = step.current
  const activeEdge = step.edge
  const maxLevel = Math.max(...step.visited.map((id) => G_LEVEL[id]), 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col border-b border-white/[0.06] bg-[#0b0b0d]">
      <PanelHead
        title="Graph · BFS"
        badge={`L${step.level}`}
        tone="graph"
        compact
      />
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] px-2 pb-1 pt-1 sm:px-3 sm:pb-1.5 sm:pt-1.5">
        <svg
          viewBox={G_VIEW}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full min-h-[80px] sm:min-h-[108px]"
        >
          <defs>
            <filter
              id="hero-glow-sky"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {G_NODES.map((n) => {
            const lvl = G_LEVEL[n.id] ?? 0
            const isFrontier =
              lvl === maxLevel && (visited.has(n.id) || queue.has(n.id))
            if (!isFrontier || queue.size === 0) return null
            return (
              <motion.circle
                key={`wave-${n.id}`}
                cx={n.x}
                cy={n.y}
                r={11 - lvl * 1.5}
                fill="none"
                stroke={G_LEVEL_COLORS[lvl]}
                strokeWidth="0.65"
                animate={{ opacity: [0.1, 0.22, 0.1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            )
          })}
          {G_EDGES.map(([a, b]) => {
            const n1 = nodeById(G_NODES, a)
            const n2 = nodeById(G_NODES, b)
            const treeEdge = isBfsTreeEdge(a, b)
            const onActive =
              activeEdge &&
              ((activeEdge[0] === a && activeEdge[1] === b) ||
                (activeEdge[0] === b && activeEdge[1] === a))
            const onTree = treeEdge && visited.has(a) && visited.has(b)
            const Line = onActive ? motion.line : 'line'
            return (
              <Line
                key={`${a}-${b}`}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke={
                  onActive
                    ? '#38bdf8'
                    : onTree
                      ? 'rgba(56,189,248,0.42)'
                      : 'rgba(255,255,255,0.08)'
                }
                strokeWidth={onActive ? 2 : onTree ? 1.2 : 0.75}
                strokeDasharray={treeEdge ? '0' : '2 3'}
                {...(onActive
                  ? {
                      animate: { strokeOpacity: [0.65, 1, 0.65] },
                      transition: { duration: 1.2, repeat: Infinity },
                    }
                  : {})}
              />
            )
          })}
          {G_NODES.map((n) => {
            const isVisited = visited.has(n.id)
            const inQueue = queue.has(n.id)
            const isCurrent = current === n.id
            const isNext = step.nextInQueue === n.id
            const lvl = G_LEVEL[n.id] ?? 0
            const discovered = isVisited || inQueue || isCurrent
            return (
              <g key={n.id} opacity={discovered ? 1 : 0.2}>
                {inQueue && !isVisited && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={6.5}
                    fill="none"
                    stroke={
                      isNext ? 'rgba(56,189,248,0.75)' : 'rgba(56,189,248,0.38)'
                    }
                    strokeWidth="1"
                    strokeDasharray={isNext ? '0' : '2 2'}
                  />
                )}
                {isCurrent && (
                  <>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={8}
                      fill="rgba(56,189,248,0.12)"
                    />
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={7}
                      fill="none"
                      stroke="rgba(125,211,252,0.6)"
                      strokeWidth="1"
                      animate={{
                        r: [6.5, 7.5, 6.5],
                        opacity: [0.5, 0.85, 0.5],
                      }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  </>
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isCurrent ? 5.5 : 4.75}
                  fill={
                    isCurrent
                      ? '#38bdf8'
                      : isVisited
                        ? G_LEVEL_COLORS[lvl]
                        : inQueue
                          ? 'rgba(56,189,248,0.26)'
                          : 'rgba(255,255,255,0.1)'
                  }
                  filter={isCurrent ? 'url(#hero-glow-sky)' : undefined}
                />
                <text
                  x={n.x}
                  y={n.y + 2.5}
                  textAnchor="middle"
                  className={`font-semibold ${isCurrent ? 'fill-zinc-900 text-[7.5px]' : 'fill-zinc-200 text-[7px]'}`}
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
        <TraversalStrip
          tone="graph"
          status={`Visiting ${current}${step.nextInQueue != null ? ` · next ${step.nextInQueue}` : ''}`}
        />
      </div>
    </div>
  )
}

function TreeDfsPanel({ step }) {
  const visited = new Set(step.visited)
  const onStack = new Set(step.stack)
  const stackDepths = new Set(step.stack.map((id) => T_NODES[id].depth))
  const current = step.current
  const activeEdge = step.edge
  const goingUp = step.mode === 'up'

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0a0a0c]">
      <PanelHead
        title="Tree · DFS"
        badge={`d${T_NODES[current].depth}`}
        tone="tree"
        compact
      />
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] px-2 pb-1 pt-1 sm:px-3 sm:pb-1.5 sm:pt-1.5">
        <svg
          viewBox={T_VIEW}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full min-h-[80px] sm:min-h-[108px]"
        >
          <defs>
            <filter
              id="hero-glow-violet"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[0, 1, 2].map((d) => (
            <rect
              key={d}
              x={6 + d * 3}
              y={6 + d * 15}
              width={88 - d * 6}
              height={14}
              rx={2}
              fill={
                stackDepths.has(d) ? 'rgba(167,139,250,0.05)' : 'transparent'
              }
              stroke={
                stackDepths.has(d)
                  ? 'rgba(167,139,250,0.12)'
                  : 'rgba(255,255,255,0.03)'
              }
              strokeWidth="0.5"
            />
          ))}
          {T_EDGES.map(([a, b]) => {
            const n1 = T_NODES[a]
            const n2 = T_NODES[b]
            const onActive =
              activeEdge &&
              ((activeEdge[0] === a && activeEdge[1] === b) ||
                (activeEdge[0] === b && activeEdge[1] === a))
            const onTreePath = isStackTreeEdge(a, b, step.stack)
            const done = visited.has(a) && visited.has(b) && !onTreePath
            const Line = onActive ? motion.line : 'line'
            return (
              <Line
                key={`${a}-${b}`}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke={
                  onActive
                    ? goingUp
                      ? 'rgba(251,191,36,0.9)'
                      : 'rgba(167,139,250,0.9)'
                    : onTreePath
                      ? 'rgba(167,139,250,0.42)'
                      : done
                        ? 'rgba(255,255,255,0.16)'
                        : 'rgba(255,255,255,0.08)'
                }
                strokeWidth={onActive ? 2 : onTreePath ? 1.2 : 0.75}
                {...(onActive
                  ? {
                      animate: { strokeOpacity: [0.6, 1, 0.6] },
                      transition: { duration: 1.1, repeat: Infinity },
                    }
                  : {})}
              />
            )
          })}
          {T_NODES.map((n) => {
            const isVisited = visited.has(n.id)
            const inStack = onStack.has(n.id)
            const isCurrent = current === n.id
            return (
              <g key={n.id}>
                {isCurrent && (
                  <>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={8}
                      fill={
                        goingUp
                          ? 'rgba(251,191,36,0.1)'
                          : 'rgba(167,139,250,0.12)'
                      }
                    />
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={7}
                      fill="none"
                      stroke={
                        goingUp
                          ? 'rgba(251,191,36,0.55)'
                          : 'rgba(196,181,253,0.55)'
                      }
                      strokeWidth="1"
                      animate={{
                        r: [6.5, 7.5, 6.5],
                        opacity: [0.45, 0.8, 0.45],
                      }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                    />
                  </>
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isCurrent ? 5.5 : inStack ? 4.85 : 4.5}
                  fill={
                    isCurrent
                      ? goingUp
                        ? '#d97706'
                        : '#8b5cf6'
                      : inStack
                        ? 'rgba(167,139,250,0.45)'
                        : isVisited
                          ? 'rgba(255,255,255,0.3)'
                          : 'rgba(255,255,255,0.08)'
                  }
                  filter={isCurrent ? 'url(#hero-glow-violet)' : undefined}
                />
                <text
                  x={n.x}
                  y={n.y + 2}
                  textAnchor="middle"
                  className={`font-semibold ${isCurrent ? 'fill-zinc-900 text-[7.5px]' : 'fill-zinc-300 text-[7px]'}`}
                >
                  {n.id}
                </text>
              </g>
            )
          })}
        </svg>
        <TraversalStrip
          tone="tree"
          goingUp={goingUp}
          status={
            goingUp
              ? `Returning to node ${current}`
              : `Exploring node ${current}${step.mode === 'down' ? ' · deeper' : ''}`
          }
        />
      </div>
    </div>
  )
}

function TraversalStrip({ tone, status, goingUp = false }) {
  const dotClass =
    tone === 'graph'
      ? 'bg-sky-400/90 shadow-[0_0_6px_rgba(56,189,248,0.45)]'
      : goingUp
        ? 'bg-amber-400/90 shadow-[0_0_6px_rgba(251,191,36,0.4)]'
        : 'bg-violet-400/90 shadow-[0_0_6px_rgba(167,139,250,0.4)]'

  return (
    <div className="flex shrink-0 items-center gap-1.5 border-t border-white/[0.06] bg-[#0a0a0c]/80 px-1.5 py-1 sm:gap-2 sm:px-2 sm:py-1.5">
      <motion.span
        className={`size-1 shrink-0 rounded-full ${dotClass}`}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <span className="truncate font-mono text-[8px] text-zinc-500">
        {status}
      </span>
    </div>
  )
}

function PanelHead({ title, badge, tone, compact = false }) {
  const tones = {
    try: 'bg-white/8 text-zinc-300',
    dead: 'bg-red-500/15 text-red-300',
    undo: 'bg-amber-500/15 text-amber-300',
    found: 'bg-emerald-500/15 text-emerald-300',
    success: 'bg-emerald-500/20 text-emerald-200',
    complete: 'bg-emerald-500/25 text-emerald-100',
    graph: 'bg-sky-500/12 text-sky-300',
    tree: 'bg-violet-500/12 text-violet-300',
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-between border-b border-white/[0.05] bg-white/[0.01] ${compact ? 'px-2.5 py-1' : 'px-3 py-1.5'}`}
    >
      <span
        className={`font-medium tracking-tight text-zinc-400 ${compact ? 'text-[9px]' : 'text-[10px]'}`}
      >
        {title}
      </span>
      <span
        className={`rounded-md font-mono uppercase tracking-wide ring-1 ring-white/[0.06] ${compact ? 'px-1.5 py-px text-[7px]' : 'px-1.5 py-0.5 text-[8px]'} ${tones[tone]}`}
      >
        {badge}
      </span>
    </div>
  )
}
