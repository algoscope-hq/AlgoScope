import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  generateLCSSteps,
  generateKnapsackSteps,
  generateCoinChangeSteps,
  generateLISSteps,
} from '../../algorithms/dp/dpStepGenerators'
import CodePanel from '../visualizer/CodePanel'

// ─── constants ───────────────────────────────────────────────────────────────
const ALGORITHMS = ['LCS', 'Knapsack', 'Coin Change', 'LIS']

const DEFAULT_INPUTS = {
  LCS: { strA: 'ABCBDAB', strB: 'BDCAB' },
  Knapsack: {
    weights: '2,3,4,5',
    values: '3,4,5,6',
    capacity: 8,
  },
  'Coin Change': { coins: '1,3,4', amount: 6 },
  LIS: { arr: '3,10,2,1,20,8,5,14' },
}

const CODE_SNIPPETS = {
  LCS: {
    javascript: `function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length:m+1}, ()=>Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1])
        dp[i][j] = dp[i-1][j-1] + 1;   // match
      else
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
    python: `def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    cpp: `int lcs(string a, string b) {
  int m=a.size(), n=b.size();
  vector<vector<int>> dp(m+1, vector<int>(n+1,0));
  for(int i=1;i<=m;i++)
    for(int j=1;j<=n;j++)
      dp[i][j] = a[i-1]==b[j-1]
        ? dp[i-1][j-1]+1
        : max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];
}`,
    java: `int lcs(String a, String b) {
  int m=a.length(), n=b.length();
  int[][] dp = new int[m+1][n+1];
  for(int i=1;i<=m;i++)
    for(int j=1;j<=n;j++)
      dp[i][j] = a.charAt(i-1)==b.charAt(j-1)
        ? dp[i-1][j-1]+1
        : Math.max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];
}`,
  },
  Knapsack: {
    javascript: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({length:n+1},
    ()=>Array(W+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      dp[i][w] = dp[i-1][w]; // exclude
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(dp[i][w],
          values[i-1] + dp[i-1][w-weights[i-1]]);
    }
  }
  return dp[n][W];
}`,
    python: `def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(W+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                  values[i-1]+dp[i-1][w-weights[i-1]])
    return dp[n][W]`,
    cpp: `int knapsack(vector<int>& w, vector<int>& v, int W){
  int n=w.size();
  vector<vector<int>> dp(n+1,vector<int>(W+1,0));
  for(int i=1;i<=n;i++)
    for(int wt=0;wt<=W;wt++){
      dp[i][wt]=dp[i-1][wt];
      if(w[i-1]<=wt)
        dp[i][wt]=max(dp[i][wt],v[i-1]+dp[i-1][wt-w[i-1]]);
    }
  return dp[n][W];
}`,
    java: `int knapsack(int[] w, int[] v, int W) {
  int n=w.length;
  int[][] dp = new int[n+1][W+1];
  for(int i=1;i<=n;i++)
    for(int wt=0;wt<=W;wt++){
      dp[i][wt]=dp[i-1][wt];
      if(w[i-1]<=wt)
        dp[i][wt]=Math.max(dp[i][wt],
          v[i-1]+dp[i-1][wt-w[i-1]]);
    }
  return dp[n][W];
}`,
  },
  'Coin Change': {
    javascript: `function coinChange(coins, amount) {
  const dp = Array(amount+1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i)
        dp[i] = Math.min(dp[i], dp[i-coin]+1);
    }
  }
  return dp[amount]===Infinity ? -1 : dp[amount];
}`,
    python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount+1)
    dp[0] = 0
    for i in range(1, amount+1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i-coin]+1)
    return dp[amount] if dp[amount]!=float('inf') else -1`,
    cpp: `int coinChange(vector<int>& coins, int amount){
  vector<int> dp(amount+1,INT_MAX);
  dp[0]=0;
  for(int i=1;i<=amount;i++)
    for(int c:coins)
      if(c<=i && dp[i-c]!=INT_MAX)
        dp[i]=min(dp[i],dp[i-c]+1);
  return dp[amount]==INT_MAX?-1:dp[amount];
}`,
    java: `int coinChange(int[] coins, int amount) {
  int[] dp = new int[amount+1];
  Arrays.fill(dp, amount+1);
  dp[0]=0;
  for(int i=1;i<=amount;i++)
    for(int c:coins)
      if(c<=i) dp[i]=Math.min(dp[i],dp[i-c]+1);
  return dp[amount]>amount?-1:dp[amount];
}`,
  },
  LIS: {
    javascript: `function lis(arr) {
  const n = arr.length;
  const dp = Array(n).fill(1);
  for (let i = 1; i < n; i++)
    for (let j = 0; j < i; j++)
      if (arr[j] < arr[i])
        dp[i] = Math.max(dp[i], dp[j]+1);
  return Math.max(...dp);
}`,
    python: `def lis(arr):
    n = len(arr)
    dp = [1]*n
    for i in range(1,n):
        for j in range(i):
            if arr[j]<arr[i]:
                dp[i]=max(dp[i],dp[j]+1)
    return max(dp)`,
    cpp: `int lis(vector<int>& arr){
  int n=arr.size();
  vector<int> dp(n,1);
  for(int i=1;i<n;i++)
    for(int j=0;j<i;j++)
      if(arr[j]<arr[i])
        dp[i]=max(dp[i],dp[j]+1);
  return *max_element(dp.begin(),dp.end());
}`,
    java: `int lis(int[] arr){
  int n=arr.length;
  int[] dp=new int[n];
  Arrays.fill(dp,1);
  for(int i=1;i<n;i++)
    for(int j=0;j<i;j++)
      if(arr[j]<arr[i])
        dp[i]=Math.max(dp[i],dp[j]+1);
  return Arrays.stream(dp).max().getAsInt();
}`,
  },
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function parseIntegerList(str, label, { min } = {}) {
  const trimmed = str.trim()

  if (!trimmed) {
    return { error: `${label} cannot be empty.` }
  }

  const tokens = trimmed.split(',').map((token) => token.trim())

  if (tokens.some((token) => token === '')) {
    return {
      error: `${label} must be comma-separated integers without empty values.`,
    }
  }

  const values = []

  for (const token of tokens) {
    if (!/^-?\d+$/.test(token)) {
      return { error: `${label} must contain only integers.` }
    }

    const value = Number(token)

    if (!Number.isSafeInteger(value)) {
      return { error: `${label} contains a number that is too large.` }
    }

    if (min !== undefined && value < min) {
      return { error: `${label} values must be at least ${min}.` }
    }

    values.push(value)
  }

  return { values }
}

function parseIntegerValue(value, label, { min } = {}) {
  const trimmed = String(value).trim()

  if (!trimmed) {
    return { error: `${label} cannot be empty.` }
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return { error: `${label} must be an integer.` }
  }

  const parsed = Number(trimmed)

  if (!Number.isSafeInteger(parsed)) {
    return { error: `${label} is too large.` }
  }

  if (min !== undefined && parsed < min) {
    return { error: `${label} must be at least ${min}.` }
  }

  return { value: parsed }
}

function validateDpInputs(algo, inputs) {
  if (algo === 'Knapsack') {
    const weights = parseIntegerList(inputs.weights, 'Weights', { min: 1 })
    if (weights.error) return weights

    const values = parseIntegerList(inputs.values, 'Values', { min: 0 })
    if (values.error) return values

    if (weights.values.length !== values.values.length) {
      return {
        error: 'Weights and values must contain the same number of items.',
      }
    }

    const capacity = parseIntegerValue(inputs.capacity, 'Capacity', { min: 0 })
    if (capacity.error) return capacity

    return {
      data: {
        weights: weights.values,
        values: values.values,
        capacity: capacity.value,
      },
    }
  }

  if (algo === 'Coin Change') {
    const coins = parseIntegerList(inputs.coins, 'Coins', { min: 1 })
    if (coins.error) return coins

    const amount = parseIntegerValue(inputs.amount, 'Amount', { min: 0 })
    if (amount.error) return amount

    return { data: { coins: coins.values, amount: amount.value } }
  }

  if (algo === 'LIS') {
    const arr = parseIntegerList(inputs.arr, 'Array')
    if (arr.error) return arr

    return { data: { arr: arr.values } }
  }

  return { data: inputs }
}

// ─── sub-visualizers ─────────────────────────────────────────────────────────

function LCSView({ step, strA, strB }) {
  if (!step) return null
  const { table, activeCell, phase, pathSoFar = [] } = step
  const pathSet = new Set(pathSoFar.map(([r, c]) => `${r},${c}`))

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 mb-3 text-xs text-slate-400">
        <span>
          A: <span className="text-cyan-400 font-mono font-bold">{strA}</span>
        </span>
        <span>
          B: <span className="text-violet-400 font-mono font-bold">{strB}</span>
        </span>
      </div>
      <table className="border-collapse text-xs font-mono">
        <thead>
          <tr>
            <td className="w-7 h-7" />
            <td className="w-7 h-7 text-center text-slate-500">ε</td>
            {strB.split('').map((ch, j) => (
              <td
                key={j}
                className="w-7 h-7 text-center text-violet-400 font-bold"
              >
                {ch}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              <td className="w-7 h-7 text-center text-cyan-400 font-bold">
                {i === 0 ? 'ε' : strA[i - 1]}
              </td>
              {row.map((val, j) => {
                const isActive =
                  activeCell && activeCell[0] === i && activeCell[1] === j
                const isPath = pathSet.has(`${i},${j}`)
                return (
                  <td
                    key={j}
                    className={`w-7 h-7 text-center border transition-all duration-200
                      ${
                        isActive
                          ? phase === 'traceback'
                            ? 'bg-emerald-500/40 border-emerald-400 text-emerald-200'
                            : 'bg-cyan-500/40 border-cyan-400 text-white'
                          : isPath
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'border-slate-700 text-slate-300'
                      }`}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {phase === 'traceback' && pathSoFar.length > 0 && (
        <p className="mt-2 text-xs text-emerald-400">
          LCS so far:{' '}
          <span className="font-bold">
            {pathSoFar
              .slice()
              .reverse()
              .map(([r]) => strA[r - 1])
              .join('')}
          </span>
        </p>
      )}
    </div>
  )
}

function KnapsackView({ step, weights, values, capacity }) {
  if (!step) return null

  const { table = [], activeCell, decision } = step
  return (
    <div className="overflow-x-auto">
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        {(weights ?? []).map((w, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded border font-mono transition-all duration-200
              ${
                activeCell && activeCell[0] === i + 1
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-slate-600 text-slate-400'
              }`}
          >
            Item {i + 1}: w={w} v={(values ?? [])[i]}
          </span>
        ))}
      </div>
      <table className="border-collapse text-xs font-mono">
        <thead>
          <tr>
            <td className="w-8 h-7 text-slate-500 text-center">w→</td>
            {Array.from({ length: (capacity ?? 0) + 1 }, (_, w) => (
              <td key={w} className="w-7 h-7 text-center text-slate-400">
                {w}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {(table || []).map((row, i) => (
            <tr key={i}>
              <td className="w-8 h-7 text-center text-amber-400 font-bold text-xs">
                {i === 0 ? '∅' : `I${i}`}
              </td>
              {(row || []).map((val, w) => {
                const isActive =
                  activeCell && activeCell[0] === i && activeCell[1] === w
                return (
                  <td
                    key={w}
                    className={`w-7 h-7 text-center border transition-all duration-200
                      ${
                        isActive
                          ? decision === 'include'
                            ? 'bg-emerald-500/40 border-emerald-400 text-emerald-200'
                            : 'bg-slate-500/40 border-slate-400 text-slate-200'
                          : 'border-slate-700 text-slate-300'
                      }`}
                  >
                    {val}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {activeCell && (
        <p className="mt-2 text-xs">
          Decision:{' '}
          <span
            className={
              decision === 'include'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400'
            }
          >
            {decision === 'include' ? '✓ Include item' : '✗ Exclude item'}
          </span>
        </p>
      )}
    </div>
  )
}

function CoinChangeView({ step, coins, amount }) {
  // Guard: render nothing until both step and coins are ready
  if (!step || !coins || !Array.isArray(coins)) return null

  const { dp = [], activeIndex, INF } = step

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mb-3 text-xs">
        <span className="text-slate-400">Coins:</span>
        {coins.map((c, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30"
          >
            {c}
          </span>
        ))}
        <span className="text-slate-400 ml-2">
          Amount: <span className="text-white font-bold">{amount}</span>
        </span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {dp.map((val, i) => (
          <motion.div
            key={i}
            layout
            className={`flex flex-col items-center justify-center w-10 h-12 rounded border text-xs font-mono transition-all duration-200
              ${
                i === activeIndex
                  ? 'bg-violet-500/40 border-violet-400 text-white scale-110'
                  : val === INF
                    ? 'bg-slate-800 border-slate-700 text-slate-600'
                    : 'bg-slate-700/50 border-slate-600 text-slate-200'
              }`}
          >
            <span className="text-slate-500 text-[10px]">{i}</span>
            <span className="font-bold">{val === INF ? '∞' : val}</span>
          </motion.div>
        ))}
      </div>
      {activeIndex > 0 &&
        dp[activeIndex] !== undefined &&
        dp[activeIndex] < INF && (
          <p className="mt-2 text-xs text-violet-400">
            dp[{activeIndex}] = {dp[activeIndex]} coin
            {dp[activeIndex] !== 1 ? 's' : ''}
          </p>
        )}
    </div>
  )
}

function LISView({ step, arr }) {
  if (!step) return null
  const { dp, activeI, activeJ, extended } = step
  const maxLIS = Math.max(...dp)

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(arr ?? []).map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-10 h-10 rounded flex items-center justify-center font-mono font-bold border text-sm transition-all duration-200
                ${
                  i === activeI
                    ? 'bg-emerald-500/40 border-emerald-400 text-emerald-200'
                    : i === activeJ
                      ? 'bg-cyan-500/30 border-cyan-500 text-cyan-300'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300'
                }`}
            >
              {val}
            </motion.div>
            <div
              className={`text-xs font-mono px-1 rounded transition-all duration-200
                ${dp[i] === maxLIS ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
            >
              {dp[i]}
            </div>
          </div>
        ))}
      </div>
      {activeI >= 0 && activeJ >= 0 && (
        <p className="text-xs mt-1">
          Comparing arr[{activeJ}]={arr[activeJ]} and arr[{activeI}]=
          {arr[activeI]}:{' '}
          <span
            className={
              extended ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }
          >
            {extended
              ? `extended — dp[${activeI}] = ${dp[activeI]}`
              : 'no extension'}
          </span>
        </p>
      )}
      <p className="text-xs mt-2 text-emerald-400">
        LIS length so far: <span className="font-bold">{maxLIS}</span>
      </p>
    </div>
  )
}

// ─── Input Panel ─────────────────────────────────────────────────────────────
function InputPanel({ algo, inputs, setInputs, onRun, inputError }) {
  const handle = (key) => (e) =>
    setInputs((p) => ({ ...p, [key]: e.target.value }))

  const fieldClass =
    'bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white font-mono focus:outline-none focus:border-cyan-500 w-full'

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {algo === 'LCS' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">String A</label>
            <input
              className={fieldClass}
              value={inputs.strA}
              onChange={handle('strA')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">String B</label>
            <input
              className={fieldClass}
              value={inputs.strB}
              onChange={handle('strB')}
            />
          </div>
        </>
      )}
      {algo === 'Knapsack' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">
              Weights (comma-sep)
            </label>
            <input
              className={fieldClass}
              value={inputs.weights}
              onChange={handle('weights')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Values (comma-sep)</label>
            <input
              className={fieldClass}
              value={inputs.values}
              onChange={handle('values')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Capacity</label>
            <input
              className={`${fieldClass} w-20`}
              type="number"
              value={inputs.capacity}
              onChange={handle('capacity')}
            />
          </div>
        </>
      )}
      {algo === 'Coin Change' && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Coins (comma-sep)</label>
            <input
              className={fieldClass}
              value={inputs.coins}
              onChange={handle('coins')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Amount</label>
            <input
              className={`${fieldClass} w-20`}
              type="number"
              value={inputs.amount}
              onChange={handle('amount')}
            />
          </div>
        </>
      )}
      {algo === 'LIS' && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Array (comma-sep)</label>
          <input
            className={fieldClass}
            value={inputs.arr}
            onChange={handle('arr')}
          />
        </div>
      )}
      <button
        onClick={onRun}
        className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors"
      >
        Run
      </button>
      {inputError && (
        <p className="basis-full text-sm font-medium text-red-300">
          {inputError}
        </p>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DPVisualizer() {
  const [algo, setAlgo] = useState('LCS')
  const [inputs, setInputs] = useState(DEFAULT_INPUTS['LCS'])
  const [steps, setSteps] = useState([])
  const [meta, setMeta] = useState(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(400)
  const [lang, setLang] = useState('javascript')
  const [copied, setCopied] = useState(false)
  const [inputError, setInputError] = useState('')
  const intervalRef = useRef(null)

  const updateInputs = useCallback((updater) => {
    setInputError('')
    setInputs(updater)
  }, [])

  const handleAlgoChange = (newAlgo) => {
    if (newAlgo === algo) return
    setAlgo(newAlgo)
    setInputs(DEFAULT_INPUTS[newAlgo])
    setSteps([])
    setMeta(null)
    setStepIdx(0)
    setPlaying(false)
    setInputError('')
  }

  const buildSteps = useCallback(() => {
    try {
      const validation = validateDpInputs(algo, inputs)

      if (validation.error) {
        setInputError(validation.error)
        setSteps([])
        setMeta(null)
        setStepIdx(0)
        setPlaying(false)
        return
      }

      setInputError('')

      if (algo === 'LCS') {
        const {
          steps: s,
          strA,
          strB,
        } = generateLCSSteps(inputs.strA.trim(), inputs.strB.trim())
        setSteps(s)
        setMeta({ strA, strB })
      } else if (algo === 'Knapsack') {
        const { weights: w, values: v, capacity: cap } = validation.data
        const {
          steps: s,
          weights,
          values,
          capacity,
        } = generateKnapsackSteps(w, v, cap)
        setSteps(s)
        setMeta({ weights, values, capacity })
      } else if (algo === 'Coin Change') {
        const { coins, amount } = validation.data
        const { steps: s, INF } = generateCoinChangeSteps(coins, amount)
        setSteps(s)
        setMeta({ coins, amount, INF })
      } else if (algo === 'LIS') {
        const { arr } = validation.data
        const { steps: s } = generateLISSteps(arr)
        setSteps(s)
        setMeta({ arr })
      }
      setStepIdx(0)
      setPlaying(false)
    } catch (e) {
      console.error(e)
    }
  }, [algo, inputs])

  // auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx((idx) => {
          if (idx >= steps.length - 1) {
            setPlaying(false)
            return idx
          }
          return idx + 1
        })
      }, speed)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, steps.length])

  const currentStep = steps[stepIdx] ?? null

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[algo][lang])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Dynamic Programming
        </h1>
        <p className="text-slate-400 text-sm">
          Watch the DP table fill step by step — LCS, 0/1 Knapsack, Coin Change,
          and LIS.
        </p>
      </div>

      {/* Algorithm Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {ALGORITHMS.map((a) => (
          <button
            key={a}
            onClick={() => handleAlgoChange(a)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
              ${
                algo === a
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-cyan-600'
              }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: visualization */}
        <div className="flex flex-col gap-4">
          {/* Input */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Input</h2>
            <InputPanel
              algo={algo}
              inputs={inputs}
              setInputs={updateInputs}
              onRun={buildSteps}
              inputError={inputError}
            />
          </div>

          {/* Visualization Canvas */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4 min-h-[220px]">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">
              Visualization
            </h2>
            <AnimatePresence mode="wait">
              {steps.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-500 text-sm"
                >
                  Press <span className="text-cyan-400">Run</span> to start the
                  visualization.
                </motion.p>
              ) : (
                <motion.div
                  key={algo}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {algo === 'LCS' && (
                    <LCSView
                      step={currentStep}
                      strA={meta?.strA ?? ''}
                      strB={meta?.strB ?? ''}
                    />
                  )}
                  {algo === 'Knapsack' && (
                    <KnapsackView
                      step={currentStep}
                      weights={meta?.weights ?? []}
                      values={meta?.values ?? []}
                      capacity={meta?.capacity ?? 0}
                    />
                  )}
                  {algo === 'Coin Change' && (
                    <CoinChangeView
                      step={currentStep}
                      coins={meta?.coins ?? []}
                      amount={meta?.amount ?? 0}
                    />
                  )}
                  {algo === 'LIS' && (
                    <LISView step={currentStep} arr={meta?.arr ?? []} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          {steps.length > 0 && (
            <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setStepIdx(0)}
                  disabled={stepIdx === 0}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm disabled:opacity-40 transition-colors"
                >
                  ⏮ Reset
                </button>
                <button
                  onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                  disabled={stepIdx === 0}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm disabled:opacity-40 transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors
                    ${playing ? 'bg-amber-600 hover:bg-amber-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                >
                  {playing ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  onClick={() =>
                    setStepIdx((i) => Math.min(steps.length - 1, i + 1))
                  }
                  disabled={stepIdx === steps.length - 1}
                  className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-slate-400">Speed</span>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={50}
                    value={1050 - speed}
                    onChange={(e) => setSpeed(1050 - Number(e.target.value))}
                    className="w-24 accent-cyan-500"
                  />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500 rounded-full"
                  animate={{
                    width: `${((stepIdx + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.15 }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-right">
                Step {stepIdx + 1} / {steps.length}
              </p>
            </div>
          )}
        </div>

        {/* Right: Code panel */}
        <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-sm font-semibold text-slate-300">
              Implementation
            </h2>
            <div className="flex gap-2">
              {['javascript', 'python', 'cpp', 'java'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors
                    ${
                      lang === l
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                >
                  {l === 'cpp'
                    ? 'C++'
                    : l === 'javascript'
                      ? 'JS'
                      : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
              <button
                onClick={handleCopy}
                className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto rounded-lg border border-slate-700 bg-slate-900">
            <CodePanel
              title="Dynamic Programming Implementation"
              code={CODE_SNIPPETS[algo][lang]}
              language={lang}
            />
          </div>

          {/* Complexity info */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {
                label: 'Time Complexity',
                value:
                  algo === 'LCS'
                    ? 'O(m × n)'
                    : algo === 'Knapsack'
                      ? 'O(n × W)'
                      : algo === 'Coin Change'
                        ? 'O(amount × coins)'
                        : 'O(n²)',
              },
              {
                label: 'Space Complexity',
                value:
                  algo === 'LCS'
                    ? 'O(m × n)'
                    : algo === 'Knapsack'
                      ? 'O(n × W)'
                      : algo === 'Coin Change'
                        ? 'O(amount)'
                        : 'O(n)',
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-slate-900 rounded-lg px-3 py-2 border border-slate-700"
              >
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-mono font-bold text-cyan-400">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
