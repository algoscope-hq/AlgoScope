import { useState, useEffect, useRef, useMemo } from 'react'

/* ═══════════════════════════════════════════
   CODE TEMPLATES PER APPROACH
   ═══════════════════════════════════════════ */
const CODES = {
  fibonacci: {
    recursion: {
      js: [
        { text: 'function fib(n) {' },
        { text: '  if (n <= 1) return n;' },
        { text: '  return fib(n-1) + fib(n-2);' },
        { text: '}' },
      ],
      python: [
        { text: 'def fib(n):' },
        { text: '    if n <= 1: return n' },
        { text: '    return fib(n-1) + fib(n-2)' },
      ],
    },
    memo: {
      js: [
        { text: 'function fib(n, memo = {}) {' },
        { text: '  if (n <= 1) return n;' },
        { text: '  if (memo[n] !== undefined)' },
        { text: '    return memo[n];' },
        { text: '  memo[n] = fib(n-1, memo)' },
        { text: '         + fib(n-2, memo);' },
        { text: '  return memo[n];' },
        { text: '}' },
      ],
      python: [
        { text: 'def fib(n, memo={}):' },
        { text: '    if n <= 1: return n' },
        { text: '    if n in memo:' },
        { text: '        return memo[n]' },
        { text: '    memo[n] = fib(n-1, memo)' },
        { text: '            + fib(n-2, memo)' },
        { text: '    return memo[n]' },
      ],
    },
    tab: {
      js: [
        { text: 'function fib(n) {' },
        { text: '  const dp = new Array(n+1);' },
        { text: '  dp[0] = 0;' },
        { text: '  dp[1] = 1;' },
        { text: '  for (let i = 2; i <= n; i++) {' },
        { text: '    dp[i] = dp[i-1] + dp[i-2];' },
        { text: '  }' },
        { text: '  return dp[n];' },
        { text: '}' },
      ],
      python: [
        { text: 'def fib(n):' },
        { text: '    dp = [0] * (n + 1)' },
        { text: '    dp[0] = 0' },
        { text: '    dp[1] = 1' },
        { text: '    for i in range(2, n+1):' },
        { text: '        dp[i] = dp[i-1]+dp[i-2]' },
        { text: '    return dp[n]' },
      ],
    },
    space: {
      js: [
        { text: 'function fib(n) {' },
        { text: '  if (n <= 1) return n;' },
        { text: '  let prev2 = 0, prev1 = 1;' },
        { text: '  for (let i = 2; i <= n; i++) {' },
        { text: '    let curr = prev1 + prev2;' },
        { text: '    prev2 = prev1;' },
        { text: '    prev1 = curr;' },
        { text: '  }' },
        { text: '  return prev1;' },
        { text: '}' },
      ],
      python: [
        { text: 'def fib(n):' },
        { text: '    if n <= 1: return n' },
        { text: '    prev2, prev1 = 0, 1' },
        { text: '    for i in range(2, n+1):' },
        { text: '        curr = prev1 + prev2' },
        { text: '        prev2 = prev1' },
        { text: '        prev1 = curr' },
        { text: '    return prev1' },
      ],
    },
  },
  climbing: {
    recursion: {
      js: [
        { text: 'function climb(n) {' },
        { text: '  if (n <= 1) return 1;' },
        { text: '  return climb(n-1)+climb(n-2);' },
        { text: '}' },
      ],
      python: [
        { text: 'def climb(n):' },
        { text: '    if n <= 1: return 1' },
        { text: '    return climb(n-1)+climb(n-2)' },
      ],
    },
    memo: {
      js: [
        { text: 'function climb(n, memo={}) {' },
        { text: '  if (n <= 1) return 1;' },
        { text: '  if (memo[n] !== undefined)' },
        { text: '    return memo[n];' },
        { text: '  memo[n] = climb(n-1, memo)' },
        { text: '          + climb(n-2, memo);' },
        { text: '  return memo[n];' },
        { text: '}' },
      ],
      python: [
        { text: 'def climb(n, memo={}):' },
        { text: '    if n <= 1: return 1' },
        { text: '    if n in memo:' },
        { text: '        return memo[n]' },
        { text: '    memo[n] = climb(n-1, memo)' },
        { text: '            + climb(n-2, memo)' },
        { text: '    return memo[n]' },
      ],
    },
    tab: {
      js: [
        { text: 'function climb(n) {' },
        { text: '  const dp = new Array(n+1);' },
        { text: '  dp[0] = 1;' },
        { text: '  dp[1] = 1;' },
        { text: '  for (let i = 2; i <= n; i++) {' },
        { text: '    dp[i] = dp[i-1] + dp[i-2];' },
        { text: '  }' },
        { text: '  return dp[n];' },
        { text: '}' },
      ],
      python: [
        { text: 'def climb(n):' },
        { text: '    dp = [0] * (n + 1)' },
        { text: '    dp[0] = 1' },
        { text: '    dp[1] = 1' },
        { text: '    for i in range(2, n+1):' },
        { text: '        dp[i] = dp[i-1]+dp[i-2]' },
        { text: '    return dp[n]' },
      ],
    },
    space: {
      js: [
        { text: 'function climb(n) {' },
        { text: '  if (n <= 1) return 1;' },
        { text: '  let prev2 = 1, prev1 = 1;' },
        { text: '  for (let i = 2; i <= n; i++) {' },
        { text: '    let curr = prev1 + prev2;' },
        { text: '    prev2 = prev1;' },
        { text: '    prev1 = curr;' },
        { text: '  }' },
        { text: '  return prev1;' },
        { text: '}' },
      ],
      python: [
        { text: 'def climb(n):' },
        { text: '    if n <= 1: return 1' },
        { text: '    prev2, prev1 = 1, 1' },
        { text: '    for i in range(2, n+1):' },
        { text: '        curr = prev1 + prev2' },
        { text: '        prev2 = prev1' },
        { text: '        prev1 = curr' },
        { text: '    return prev1' },
      ],
    },
  },
  coin: {
    recursion: {
      js: [
        { text: 'function coinChange(coins, amt) {' },
        { text: '  if (amt === 0) return 0;' },
        { text: '  if (amt < 0) return Infinity;' },
        { text: '  let min = Infinity;' },
        { text: '  for (let c of coins) {' },
        { text: '    let res = coinChange(' },
        { text: '      coins, amt - c);' },
        { text: '    min = Math.min(min, res+1);' },
        { text: '  }' },
        { text: '  return min;' },
        { text: '}' },
      ],
      python: [
        { text: 'def coinChange(coins, amt):' },
        { text: '    if amt == 0: return 0' },
        { text: "    if amt < 0: return float('inf')" },
        { text: "    mn = float('inf')" },
        { text: '    for c in coins:' },
        { text: '        res = coinChange(' },
        { text: '            coins, amt - c)' },
        { text: '        mn = min(mn, res + 1)' },
        { text: '    return mn' },
      ],
    },
    memo: {
      js: [
        { text: 'function cc(coins, amt, m={}) {' },
        { text: '  if (amt === 0) return 0;' },
        { text: '  if (amt < 0) return Infinity;' },
        { text: '  if (m[amt] !== undefined)' },
        { text: '    return m[amt];' },
        { text: '  let min = Infinity;' },
        { text: '  for (let c of coins) {' },
        { text: '    let res = cc(coins,amt-c,m);' },
        { text: '    min = Math.min(min, res+1);' },
        { text: '  }' },
        { text: '  m[amt] = min;' },
        { text: '  return min;' },
        { text: '}' },
      ],
      python: [
        { text: 'def cc(coins, amt, m={}):' },
        { text: '    if amt == 0: return 0' },
        { text: "    if amt < 0: return float('inf')" },
        { text: '    if amt in m:' },
        { text: '        return m[amt]' },
        { text: "    mn = float('inf')" },
        { text: '    for c in coins:' },
        { text: '        res = cc(coins,amt-c,m)' },
        { text: '        mn = min(mn, res + 1)' },
        { text: '    m[amt] = mn' },
        { text: '    return mn' },
      ],
    },
    tab: {
      js: [
        { text: 'function coinChange(coins, amt) {' },
        { text: '  const dp = Array(amt+1)' },
        { text: '             .fill(Infinity);' },
        { text: '  dp[0] = 0;' },
        { text: '  for (let i=1; i<=amt; i++) {' },
        { text: '    for (let c of coins) {' },
        { text: '      if (i-c >= 0)' },
        { text: '        dp[i] = Math.min(dp[i],' },
        { text: '                  dp[i-c] + 1);' },
        { text: '    }' },
        { text: '  }' },
        { text: '  return dp[amt];' },
        { text: '}' },
      ],
      python: [
        { text: 'def coinChange(coins, amt):' },
        { text: "    dp = [float('inf')]*(amt+1)" },
        { text: '    dp[0] = 0' },
        { text: '    for i in range(1, amt+1):' },
        { text: '        for c in coins:' },
        { text: '            if i-c >= 0:' },
        { text: '                dp[i] = min(dp[i],' },
        { text: '                      dp[i-c]+1)' },
        { text: '    return dp[amt]' },
      ],
    },
    space: {
      js: [
        { text: '// Coin Change: O(n) space is' },
        { text: '// already optimal. Any dp[i-c]' },
        { text: '// could be needed, not just' },
        { text: '// previous 1-2 values.' },
        { text: '//' },
        { text: '// Same as tabulation approach.' },
      ],
      python: [
        { text: '# Coin Change: O(n) space is' },
        { text: '# already optimal. Any dp[i-c]' },
        { text: '# could be needed, not just' },
        { text: '# previous 1-2 values.' },
        { text: '#' },
        { text: '# Same as tabulation approach.' },
      ],
    },
  },
}

const APPROACHES = [
  { id: 'recursion', label: 'Recursion', short: 'Rec', accent: '#f87171' },
  { id: 'memo', label: 'Memoization', short: 'Memo', accent: '#fbbf24' },
  { id: 'tab', label: 'Tabulation', short: 'Tab', accent: '#34d399' },
  { id: 'space', label: 'Space Opt.', short: 'Spc', accent: '#818cf8' },
]

const PROBLEMS = {
  fibonacci: {
    name: 'Fibonacci',
    maxN: 8,
    defaultN: 6,
    base0: 0,
    base1: 1,
    fn: 'F',
  },
  climbing: {
    name: 'Climbing Stairs',
    maxN: 8,
    defaultN: 5,
    base0: 1,
    base1: 1,
    fn: 'C',
  },
  coin: {
    name: 'Coin Change',
    maxN: 11,
    defaultN: 7,
    coins: [1, 3, 4],
    fn: 'CC',
  },
}

/* ═══════════════════════════════════════════ */
function buildFibTree(n) {
  let ord = 0
  const seen = new Set()
  function go(v) {
    ord++
    const o = ord,
      dup = seen.has(v)
    seen.add(v)
    if (v <= 1) return { v, id: `${v}_${o}`, dup, children: [], ord: o }
    return { v, id: `${v}_${o}`, dup, ord: o, children: [go(v - 1), go(v - 2)] }
  }
  return go(n)
}

function buildCoinTree(amt, coins, max = 55) {
  let ord = 0
  const seen = new Set()
  function go(a) {
    if (ord > max) return null
    ord++
    const o = ord,
      dup = seen.has(a)
    seen.add(a)
    if (a === 0)
      return { v: a, id: `${a}_${o}`, dup, children: [], ord: o, base: true }
    if (a < 0)
      return { v: a, id: `${a}_${o}`, dup, children: [], ord: o, inv: true }
    const ch = []
    for (const c of coins) {
      const r = go(a - c)
      if (r) ch.push(r)
    }
    return { v: a, id: `${a}_${o}`, dup, children: ch, ord: o }
  }
  return go(amt)
}

function flatten(node, d = 0, out = []) {
  if (!node) return out
  out.push({ ...node, depth: d })
  ;(node.children || []).forEach((c) => flatten(c, d + 1, out))
  return out
}

function layout(node, x0 = 0, d = 0, pos = {}) {
  if (!node) return { pos, w: 0 }
  if (!node.children?.length) {
    pos[node.id] = {
      x: x0,
      y: d,
      v: node.v,
      dup: node.dup,
      inv: node.inv,
      base: node.base,
    }
    return { pos, w: 1 }
  }
  let tw = 0
  node.children.forEach((c) => {
    tw += layout(c, x0 + tw, d + 1, pos).w
  })
  const xs = node.children.map((c) => pos[c.id]?.x ?? 0)
  pos[node.id] = {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: d,
    v: node.v,
    dup: node.dup,
  }
  return { pos, w: Math.max(tw, 1) }
}

function edges(node, out = []) {
  if (!node) return out
  ;(node.children || []).forEach((c) => {
    if (c) {
      out.push([node.id, c.id])
      edges(c, out)
    }
  })
  return out
}

/* ═══════════════════════════════════════════
   STEP GENERATORS
   ═══════════════════════════════════════════ */
function genRecSteps(n, pk) {
  const p = PROBLEMS[pk],
    isCoin = pk === 'coin'
  const tree = isCoin ? buildCoinTree(n, p.coins) : buildFibTree(n)
  const flat = flatten(tree),
    maxD = Math.max(...flat.map((f) => f.depth))
  const steps = [],
    dups = new Set()

  flat.forEach((f, i) => {
    const isDup = dups.has(f.v) && !f.inv
    if (!f.inv) dups.add(f.v)
    let msg, explain, cl
    if (f.inv) {
      msg = `${p.fn}(${f.v}) → negative, return ∞`
      cl = 2
      explain =
        'Amount went negative — this coin choice overshoots. Return infinity to discard.'
    } else if (f.base || (!f.children.length && !isCoin)) {
      const val = isCoin ? 0 : f.v <= 0 ? p.base0 : p.base1
      msg = `Base case: ${p.fn}(${f.v}) = ${val}`
      cl = 1
      explain =
        'Reached a base case. Return known value — no more recursive calls needed.'
    } else if (isDup) {
      msg = `${p.fn}(${f.v}) — DUPLICATE subproblem!`
      cl = 2
      explain =
        "This exact subproblem was already solved above, but naive recursion can't remember. It recomputes the entire subtree — this is the inefficiency DP eliminates."
    } else {
      msg = isCoin
        ? `${p.fn}(${f.v}) — try each coin [${p.coins.join(',')}]`
        : `${p.fn}(${f.v}) = ${p.fn}(${f.v - 1}) + ${p.fn}(${f.v - 2})`
      cl = 2
      explain = isCoin
        ? `Try subtracting each coin from ${f.v} and recurse. Pick the minimum.`
        : 'Split into two subproblems. Both must be fully solved before combining.'
    }
    steps.push({
      type: 'tree',
      tree,
      maxD,
      hlId: f.id,
      msg,
      explain,
      codeLine: cl,
      callN: i + 1,
      total: flat.length,
      stackDepth: maxD,
    })
  })

  const dupCnt = flat.filter((f) => f.dup && !f.inv).length
  steps.push({
    type: 'tree',
    tree,
    maxD,
    hlId: null,
    msg: `Done! ${flat.length} calls total, ${dupCnt} redundant. Time: O(${isCoin ? 'c^n' : '2ⁿ'})`,
    explain:
      'Exponential time from recomputing overlapping subproblems. Notice the call stack depth reached O(n) — this memory is consumed by the recursion alone, before storing any DP data.',
    codeLine: -1,
    callN: flat.length,
    total: flat.length,
    stackDepth: maxD,
  })
  return steps
}

function genMemoSteps(n, pk) {
  const p = PROBLEMS[pk],
    isCoin = pk === 'coin'
  const tree = isCoin ? buildCoinTree(n, p.coins) : buildFibTree(n)
  const flat = flatten(tree),
    maxD = Math.max(...flat.map((f) => f.depth))
  const steps = [],
    memo = {}
  let hits = 0
  const sz = n + 1,
    arr = Array(sz).fill(null)

  flat.forEach((f) => {
    if (f.inv) {
      steps.push({
        type: 'memo',
        tree,
        maxD,
        hlId: f.id,
        arr: [...arr],
        aidx: -1,
        hits,
        msg: `${p.fn}(${f.v}) → negative, skip`,
        explain: 'Invalid amount. Return infinity.',
        codeLine: 2,
        stackDepth: maxD,
      })
      return
    }
    if (memo[f.v] !== undefined) {
      hits++
      steps.push({
        type: 'memo',
        tree,
        maxD,
        hlId: f.id,
        arr: [...arr],
        aidx: f.v,
        read: true,
        hits,
        msg: `CACHE HIT! memo[${f.v}] = ${memo[f.v]}`,
        codeLine: 3,
        explain: `Already solved ${p.fn}(${f.v}) before — return instantly. The entire recursive subtree is skipped, saving the call stack from growing deeper.`,
        stackDepth: f.depth,
      })
      return
    }
    if (f.base || (!f.children.length && !isCoin)) {
      const val = isCoin ? 0 : f.v <= 0 ? p.base0 : p.base1
      memo[f.v] = val
      arr[f.v] = val
      steps.push({
        type: 'memo',
        tree,
        maxD,
        hlId: f.id,
        arr: [...arr],
        aidx: f.v,
        read: false,
        hits,
        msg: `Base: memo[${f.v}] = ${val}`,
        codeLine: 1,
        explain:
          'Store base case in cache. All future calls for this value become instant lookups.',
        stackDepth: f.depth,
      })
    } else {
      steps.push({
        type: 'memo',
        tree,
        maxD,
        hlId: f.id,
        arr: [...arr],
        aidx: f.v,
        read: false,
        hits,
        msg: `Computing ${p.fn}(${f.v})... will cache`,
        codeLine: 4,
        explain:
          'First encounter of this subproblem. Solve it via recursion (call stack grows), then store the result.',
        stackDepth: f.depth,
      })
      if (isCoin) {
        let best = Infinity
        for (const c of p.coins)
          if (f.v - c >= 0 && memo[f.v - c] !== undefined)
            best = Math.min(best, memo[f.v - c] + 1)
        if (best < Infinity) {
          memo[f.v] = best
          arr[f.v] = best
        }
      } else {
        if (memo[f.v - 1] !== undefined && memo[f.v - 2] !== undefined) {
          memo[f.v] = memo[f.v - 1] + memo[f.v - 2]
          arr[f.v] = memo[f.v]
        }
      }
    }
  })

  if (!isCoin)
    for (let i = 0; i <= n; i++) {
      if (arr[i] === null)
        arr[i] =
          i <= 1
            ? i === 0
              ? p.base0
              : p.base1
            : (arr[i - 1] || 0) + (arr[i - 2] || 0)
    }

  steps.push({
    type: 'memo',
    tree,
    maxD,
    hlId: null,
    arr: [...arr],
    aidx: -1,
    hits,
    msg: `Done! ${hits} cache hits eliminated redundant work. Time: O(n), Space: O(n) call stack + O(n) memo array`,
    explain:
      'Memoization solved the time problem, but the call stack still grows O(n) deep. We still need a memo array O(n). Tabulation eliminates the call stack entirely by using iteration instead of recursion.',
    codeLine: -1,
    stackDepth: maxD,
  })
  return steps
}

function genTabSteps(n, pk) {
  const p = PROBLEMS[pk],
    isCoin = pk === 'coin',
    steps = [],
    dp = Array(n + 1).fill(null)

  if (isCoin) {
    dp[0] = 0
    steps.push({
      type: 'tab',
      dp: [...dp],
      act: 0,
      rds: [],
      codeLine: 3,
      msg: `dp[0] = 0`,
      explain:
        'Zero coins needed for amount 0. Starting point. Notice: NO recursive calls, NO call stack.',
    })
    for (let i = 1; i <= n; i++) {
      dp[i] = Infinity
      const rds = []
      for (const c of p.coins) {
        if (i - c >= 0 && dp[i - c] !== null) {
          rds.push(i - c)
          if (dp[i - c] !== Infinity) dp[i] = Math.min(dp[i], dp[i - c] + 1)
        }
      }
      const v = dp[i] === Infinity ? '∞' : dp[i]
      steps.push({
        type: 'tab',
        dp: dp.map((x) => (x === Infinity ? '∞' : x)),
        act: i,
        rds,
        codeLine: 5,
        msg: `dp[${i}] = min(${p.coins
          .filter((c) => i - c >= 0)
          .map((c) => `dp[${i - c}]+1`)
          .join(', ')}) = ${v}`,
        explain: `Try each coin [${p.coins.join(',')}]. For each, check dp[i-coin]+1 and take the minimum. No recursion — pure iteration.`,
      })
    }
  } else {
    dp[0] = p.base0
    dp[1] = p.base1
    steps.push({
      type: 'tab',
      dp: [...dp],
      act: 0,
      rds: [],
      codeLine: 2,
      msg: `dp[0] = ${p.base0}`,
      explain: `Base case for ${p.fn}(0). Using iteration bottom-up instead of recursion. Zero call stack!`,
    })
    steps.push({
      type: 'tab',
      dp: [...dp],
      act: 1,
      rds: [],
      codeLine: 3,
      msg: `dp[1] = ${p.base1}`,
      explain: `Base case for ${p.fn}(1). Now we can start building upward. Call stack remains O(1) — only the loop's local variables.`,
    })
    for (let i = 2; i <= n; i++) {
      steps.push({
        type: 'tab',
        dp: [...dp],
        act: i,
        rds: [i - 1, i - 2],
        codeLine: 5,
        msg: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}`,
        explain: `Each cell depends only on the previous two. Still O(n) DP array, but the call stack has dropped from O(n) → O(1). That's huge savings!`,
      })
      dp[i] = dp[i - 1] + dp[i - 2]
      steps.push({
        type: 'tab',
        dp: [...dp],
        act: i,
        rds: [],
        codeLine: 5,
        msg: `dp[${i}] = ${dp[i]}`,
        explain:
          'Computed and stored. Moving forward. Call stack = just the loop, not the recursion depth.',
      })
    }
  }
  steps.push({
    type: 'tab',
    dp: dp.map((x) => (x === Infinity ? '∞' : x)),
    act: -1,
    rds: [],
    msg: `Answer: dp[${n}] = ${dp[n] === Infinity ? '∞' : dp[n]}. Time: O(${isCoin ? 'n×c' : 'n'}), Space: O(n) DP array + O(1) call stack`,
    explain: `✅ Call stack eliminated! No recursion = no O(n) stack overhead. Space is now just the DP array. For n=1000, memoization used O(n) call stack + O(n) array. Tabulation uses only O(n) array. We can still optimize further with space-swapping.`,
    codeLine: -1,
  })
  return steps
}

function genSpaceSteps(n, pk) {
  const p = PROBLEMS[pk],
    isCoin = pk === 'coin',
    steps = []
  if (isCoin) {
    steps.push({
      type: 'space_note',
      msg: 'Coin Change: O(n) space is already optimal',
      explain:
        "Coin Change accesses dp[i-c] for arbitrary coin values — we can't discard earlier cells. The tabulation array IS the optimal form (no call stack to eliminate, already O(1) stack). Not all DP problems can be reduced to O(1) total space.",
      codeLine: 0,
    })
    return steps
  }
  let p2 = p.base0,
    p1 = p.base1
  const ghost = Array(n + 1).fill(null)
  ghost[0] = p.base0
  ghost[1] = p.base1

  steps.push({
    type: 'space',
    p2,
    p1,
    cur: null,
    i: 0,
    ghost: [...ghost],
    codeLine: 2,
    msg: `prev2 = ${p.base0}`,
    explain: `Replace entire O(n) array with just two variables. Tabulation had O(n) DP + O(1) stack. Now: O(1) DP + O(1) stack = O(1) total!`,
  })
  steps.push({
    type: 'space',
    p2,
    p1,
    cur: null,
    i: 1,
    ghost: [...ghost],
    codeLine: 2,
    msg: `prev1 = ${p.base1}`,
    explain: `prev1 = ${p.fn}(1). Two variables is ALL the memory we need. Memoization used O(n) array; now we use constant space.`,
  })

  for (let i = 2; i <= n; i++) {
    const cur = p1 + p2
    ghost[i] = cur
    steps.push({
      type: 'space',
      p2,
      p1,
      cur,
      i,
      ghost: [...ghost],
      codeLine: 4,
      msg: `curr = ${p1} + ${p2} = ${cur}`,
      explain: `Same formula as tabulation, but only 3 values in memory. Tabulation kept the full O(n) array alive; now dp[0..${i - 2}] are garbage collected.`,
    })
    p2 = p1
    p1 = cur
    steps.push({
      type: 'space',
      p2,
      p1,
      cur: null,
      i,
      ghost: [...ghost],
      codeLine: 5,
      msg: 'Slide: prev2 ← prev1, prev1 ← curr',
      explain:
        'Slide the 2-variable window forward. The oldest value is discarded. Memory usage stays O(1) regardless of how large n grows.',
    })
  }
  steps.push({
    type: 'space',
    p2,
    p1,
    cur: null,
    i: n,
    ghost: [...ghost],
    codeLine: 8,
    msg: `${p.fn}(${n}) = ${p1}. Time: O(n), Space: O(1) ✨`,
    explain:
      'Final form: O(n) time, O(1) space. Progression: Recursion O(2ⁿ) time → Memoization O(n) time → Tabulation O(n) time + eliminated call stack → Space-Optimized O(1) space. Complete optimization!',
  })
  return steps
}

/* ═══════════════════════════════════════════
   TREE SVG
   ═══════════════════════════════════════════ */
function TreeSVG({ tree, hlId, fn }) {
  if (!tree) return null
  const { pos, w } = layout(tree)
  const ed = edges(tree)
  const maxD = Math.max(...Object.values(pos).map((p) => p.y))
  const cw = 56,
    ch = 60,
    px = 24,
    py = 20
  const svgW = Math.max(w * cw + px * 2, 140),
    svgH = (maxD + 1) * ch + py * 2

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ display: 'block', maxHeight: 420 }}
    >
      {ed.map(([a, b], i) => {
        const f = pos[a],
          t = pos[b]
        if (!f || !t) return null
        return (
          <line
            key={i}
            x1={f.x * cw + px + cw / 2}
            y1={f.y * ch + py + 14}
            x2={t.x * cw + px + cw / 2}
            y2={t.y * ch + py - 2}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        )
      })}
      {Object.entries(pos).map(([id, p]) => {
        const hl = id === hlId
        const cx = p.x * cw + px + cw / 2,
          cy = p.y * ch + py + 6
        let fill, stroke, txt
        if (p.inv) {
          fill = 'rgba(239,68,68,0.06)'
          stroke = '#ef444440'
          txt = '#ef4444'
        } else if (hl) {
          fill = 'rgba(251,191,36,0.2)'
          stroke = '#fbbf24'
          txt = '#fbbf24'
        } else if (p.dup) {
          fill = 'rgba(244,114,182,0.08)'
          stroke = '#f472b640'
          txt = '#f472b6'
        } else {
          fill = 'rgba(255,255,255,0.03)'
          stroke = 'rgba(255,255,255,0.07)'
          txt = 'rgba(255,255,255,0.4)'
        }
        return (
          <g key={id}>
            <rect
              x={cx - 20}
              y={cy - 12}
              width={40}
              height={25}
              rx={7}
              fill={fill}
              stroke={stroke}
              strokeWidth={hl ? 1.5 : 1}
            />
            {hl && (
              <rect
                x={cx - 20}
                y={cy - 12}
                width={40}
                height={25}
                rx={7}
                fill="none"
                stroke="#fbbf24"
                strokeWidth={1.5}
                opacity={0.4}
              >
                <animate
                  attributeName="opacity"
                  values="0.4;0.15;0.4"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </rect>
            )}
            <text
              x={cx}
              y={cy + 4.5}
              textAnchor="middle"
              fontSize={10.5}
              fontFamily="'IBM Plex Mono',monospace"
              fill={txt}
              fontWeight={700}
            >
              {p.inv ? p.v : `${fn}(${p.v})`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ═══════════════════════════════════════════ */
function Cell({ value, index, status, label }) {
  const S = {
    empty: {
      bg: 'rgba(255,255,255,0.025)',
      bd: 'rgba(255,255,255,0.06)',
      c: 'rgba(255,255,255,0.12)',
    },
    active: { bg: 'rgba(251,191,36,0.14)', bd: '#fbbf24', c: '#fbbf24' },
    filled: {
      bg: 'rgba(52,211,153,0.08)',
      bd: 'rgba(52,211,153,0.25)',
      c: '#34d399',
    },
    reading: { bg: 'rgba(129,140,248,0.1)', bd: '#818cf8', c: '#818cf8' },
    ghost: {
      bg: 'rgba(255,255,255,0.01)',
      bd: 'rgba(255,255,255,0.035)',
      c: 'rgba(255,255,255,0.08)',
    },
    hit: { bg: 'rgba(52,211,153,0.16)', bd: '#34d399', c: '#34d399' },
  }
  const s = S[status] || S.empty
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 9,
            color: 'rgba(255,255,255,0.28)',
            fontFamily: "'IBM Plex Mono',monospace",
            letterSpacing: 0.6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: s.bg,
          border: `1.5px solid ${s.bd}`,
          borderRadius: 7,
          color: s.c,
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 15,
          fontWeight: 700,
          transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
          boxShadow: status === 'active' ? `0 0 14px ${s.bd}25` : 'none',
        }}
      >
        {value !== null && value !== undefined ? value : '—'}
      </div>
      {index !== undefined && (
        <div
          style={{
            fontSize: 8,
            color: 'rgba(255,255,255,0.18)',
            fontFamily: "'IBM Plex Mono',monospace",
          }}
        >
          [{index}]
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   CODE PANEL
   ═══════════════════════════════════════════ */
function CodePanel({ code, activeLine, lang, setLang, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            fontWeight: 700,
          }}
        >
          Implementation
        </span>
        <div style={{ display: 'flex', gap: 3 }}>
          {['js', 'python'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
                border: `1px solid ${lang === l ? accent + '50' : 'rgba(255,255,255,0.06)'}`,
                background: lang === l ? accent + '12' : 'transparent',
                color: lang === l ? accent : 'rgba(255,255,255,0.25)',
                cursor: 'pointer',
                fontFamily: "'IBM Plex Mono',monospace",
                textTransform: 'uppercase',
              }}
            >
              {l === 'js' ? 'JS' : 'PY'}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          borderRadius: 8,
          padding: '10px 0',
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.04)',
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 11.5,
          lineHeight: 1.85,
          overflow: 'auto',
          maxHeight: 340,
        }}
      >
        {code.map((line, i) => {
          const isA = i === activeLine
          return (
            <div
              key={i}
              style={{
                padding: '0 12px 0 8px',
                background: isA ? accent + '15' : 'transparent',
                borderLeft: isA
                  ? `2.5px solid ${accent}`
                  : '2.5px solid transparent',
                color: isA ? '#e2e8f0' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.25s',
                display: 'flex',
                gap: 10,
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.1)',
                  minWidth: 16,
                  textAlign: 'right',
                  userSelect: 'none',
                  fontSize: 10,
                }}
              >
                {i + 1}
              </span>
              <span style={{ whiteSpace: 'pre' }}>{line.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════ */
export default function DPVisualizer() {
  const [pk, setPk] = useState('fibonacci')
  const [ap, setAp] = useState('recursion')
  const [n, setN] = useState(6)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(650)
  const [lang, setLang] = useState('js')
  const timer = useRef(null)

  const prob = PROBLEMS[pk]
  const accent = APPROACHES.find((a) => a.id === ap)?.accent || '#818cf8'

  const allSteps = useMemo(() => {
    switch (ap) {
      case 'recursion':
        return genRecSteps(n, pk)
      case 'memo':
        return genMemoSteps(n, pk)
      case 'tab':
        return genTabSteps(n, pk)
      case 'space':
        return genSpaceSteps(n, pk)
      default:
        return []
    }
  }, [ap, n, pk])

  const total = allSteps.length
  const cur = allSteps[Math.min(step, total - 1)] || {}

  useEffect(() => {
    if (!playing || step >= total - 1) {
      return undefined
    }

    timer.current = setTimeout(() => {
      setStep((s) => s + 1)
    }, speed)

    return () => clearTimeout(timer.current)
  }, [playing, step, total, speed])

  const code = CODES[pk]?.[ap]?.[lang] || [{ text: '// ...' }]
  const cx = {
    recursion: { t: pk === 'coin' ? 'O(c^n)' : 'O(2ⁿ)', s: 'O(n)' },
    memo: { t: 'O(n)', s: 'O(n)' },
    tab: { t: pk === 'coin' ? 'O(n·c)' : 'O(n)', s: 'O(n)' },
    space: { t: 'O(n)', s: pk === 'coin' ? 'O(n)' : 'O(1)' },
  }[ap]

  const progressPct = total > 1 ? (step / (total - 1)) * 100 : 0

  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: '#c9d1d9' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        .dp-journey-viz ::-webkit-scrollbar{width:3px;height:3px} .dp-journey-viz ::-webkit-scrollbar-track{background:transparent} .dp-journey-viz ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: -0.4,
              color: '#e6edf3',
            }}
          >
            Dynamic Programming
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.28)',
              marginTop: 2,
            }}
          >
            Watch the DP table fill step by step — from brute-force to O(1)
            space
          </p>
        </div>

        {/* Selectors */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginBottom: 14,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 5 }}>
            {Object.entries(PROBLEMS).map(([k, p]) => (
              <button
                key={k}
                onClick={() => {
                  setPk(k)
                  setN(PROBLEMS[k].defaultN)
                  setStep(0)
                  setPlaying(false)
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border:
                    pk === k
                      ? `1.5px solid ${accent}`
                      : '1.5px solid rgba(255,255,255,0.06)',
                  background:
                    pk === k ? accent + '12' : 'rgba(255,255,255,0.02)',
                  color: pk === k ? accent : 'rgba(255,255,255,0.35)',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div
            style={{
              width: 1,
              height: 22,
              background: 'rgba(255,255,255,0.06)',
            }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {APPROACHES.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setAp(a.id)
                  setStep(0)
                  setPlaying(false)
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 7,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border:
                    ap === a.id
                      ? `1.5px solid ${a.accent}`
                      : '1.5px solid rgba(255,255,255,0.05)',
                  background:
                    ap === a.id ? a.accent + '10' : 'rgba(255,255,255,0.015)',
                  color: ap === a.id ? a.accent : 'rgba(255,255,255,0.3)',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Input */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                }}
              >
                {pk === 'coin' ? 'Amount' : 'n'} =
              </span>
              <input
                type="range"
                min={2}
                max={prob.maxN}
                value={n}
                onChange={(e) => {
                  setN(+e.target.value)
                  setStep(0)
                  setPlaying(false)
                }}
                style={{ width: 90, accentColor: accent }}
              />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: 16,
                  fontWeight: 800,
                  color: accent,
                }}
              >
                {n}
              </span>
              {pk === 'coin' && (
                <span
                  style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.2)',
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  coins=[{prob.coins.join(',')}]
                </span>
              )}
            </div>

            {/* Viz */}
            <div
              style={{
                borderRadius: 10,
                padding: 18,
                minHeight: 240,
                background: 'rgba(255,255,255,0.012)',
                border: '1px solid rgba(255,255,255,0.05)',
                animation: 'fadeUp 0.25s ease',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.22)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                Visualization
              </div>

              {(cur.type === 'tree' || cur.type === 'memo') && cur.tree && (
                <div
                  style={{
                    overflowX: 'auto',
                    marginBottom: cur.type === 'memo' ? 10 : 0,
                  }}
                >
                  <TreeSVG tree={cur.tree} hlId={cur.hlId} fn={prob.fn} />
                </div>
              )}
              {cur.type === 'memo' && cur.arr && (
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      color: 'rgba(255,255,255,0.18)',
                      marginBottom: 6,
                      letterSpacing: 1,
                    }}
                  >
                    MEMO CACHE
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {cur.arr.map((v, i) => (
                      <Cell
                        key={i}
                        value={v}
                        index={i}
                        status={
                          i === cur.aidx
                            ? cur.read
                              ? 'hit'
                              : 'active'
                            : v !== null
                              ? 'filled'
                              : 'empty'
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
              {cur.type === 'tab' && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {cur.dp.map((v, i) => (
                    <Cell
                      key={i}
                      value={v}
                      index={i}
                      status={
                        i === cur.act
                          ? 'active'
                          : cur.rds?.includes(i)
                            ? 'reading'
                            : v !== null
                              ? 'filled'
                              : 'empty'
                      }
                    />
                  ))}
                </div>
              )}
              {cur.type === 'space' && (
                <div>
                  <div style={{ opacity: 0.3, marginBottom: 14 }}>
                    <div
                      style={{
                        fontSize: 8,
                        color: 'rgba(255,255,255,0.15)',
                        marginBottom: 5,
                        letterSpacing: 1,
                      }}
                    >
                      FULL ARRAY (ELIMINATED)
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {cur.ghost.map((v, i) => (
                        <Cell
                          key={i}
                          value={v !== null ? v : '×'}
                          index={i}
                          status="ghost"
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}
                  >
                    <Cell value={cur.p2} label="prev2" status="filled" />
                    <Cell value={cur.p1} label="prev1" status="filled" />
                    {cur.cur !== null && (
                      <Cell value={cur.cur} label="curr" status="active" />
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      padding: '5px 10px',
                      borderRadius: 5,
                      background: 'rgba(129,140,248,0.05)',
                      border: '1px solid rgba(129,140,248,0.1)',
                      fontSize: 10,
                      color: '#818cf8',
                      fontFamily: "'IBM Plex Mono',monospace",
                    }}
                  >
                    i = {cur.i} → O(1) space
                  </div>
                </div>
              )}
              {cur.type === 'space_note' && (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    Cannot reduce below O(n)
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      maxWidth: 360,
                      margin: '8px auto 0',
                      lineHeight: 1.6,
                    }}
                  >
                    Coin Change accesses dp[i-c] for arbitrary coin values. The
                    full array is required.
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              <BtnCtrl
                onClick={() => {
                  setStep(0)
                  setPlaying(false)
                }}
                c="#64748b"
              >
                ⏮ Reset
              </BtnCtrl>
              <BtnCtrl
                onClick={() => setStep(Math.max(0, step - 1))}
                c="#64748b"
              >
                ← Prev
              </BtnCtrl>
              <BtnCtrl
                onClick={() => setPlaying(!playing)}
                c={playing ? '#ef4444' : '#34d399'}
                accent
              >
                {playing ? '⏸ Pause' : '► Play'}
              </BtnCtrl>
              <BtnCtrl
                onClick={() => setStep(Math.min(total - 1, step + 1))}
                c="#64748b"
              >
                Next →
              </BtnCtrl>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                Speed
              </span>
              <input
                type="range"
                min={150}
                max={1100}
                value={1250 - speed}
                onChange={(e) => setSpeed(1250 - +e.target.value)}
                style={{ width: 60, accentColor: accent }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.2)',
                  fontFamily: "'IBM Plex Mono',monospace",
                }}
              >
                Step {step + 1}/{total}
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.04)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: accent,
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Complexity */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: 1,
                  }}
                >
                  TIME COMPLEXITY
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: accent,
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  {cx.t}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: 1,
                  }}
                >
                  SPACE COMPLEXITY
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: accent,
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  {cx.s}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.2)',
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {ap === 'recursion' && 'O(n) call stack'}
                  {ap === 'memo' && 'O(n) call stack + O(n) array'}
                  {ap === 'tab' && 'O(1) call stack + O(n) array'}
                  {ap === 'space' && pk === 'coin'
                    ? 'O(n) array only'
                    : 'O(1) total'}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              position: 'sticky',
              top: 14,
            }}
          >
            {/* Code */}
            <div
              style={{
                borderRadius: 10,
                padding: 14,
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <CodePanel
                code={code}
                activeLine={cur.codeLine ?? -1}
                lang={lang}
                setLang={setLang}
                accent={accent}
              />
            </div>

            {/* Explanation */}
            <div
              style={{
                borderRadius: 10,
                padding: 16,
                background: `${accent}05`,
                border: `1px solid ${accent}12`,
                animation: 'fadeUp 0.25s ease',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.22)',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                What&apos;s Happening
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: accent,
                  marginBottom: 7,
                  fontFamily: "'IBM Plex Mono',monospace",
                  lineHeight: 1.6,
                }}
              >
                {cur.msg || 'Press ► Play to begin'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: 1.7,
                }}
              >
                {cur.explain ||
                  'Step through the algorithm to see how each approach solves the problem differently.'}
              </div>
            </div>

            {/* Legend */}
            {(cur.type === 'tree' || cur.type === 'memo') && (
              <div
                style={{
                  borderRadius: 8,
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.18)',
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  LEGEND
                </div>
                <Leg c="#fbbf24" l="Currently computing" />
                <Leg c="#f472b6" l="Duplicate subproblem" />
                {cur.type === 'memo' && (
                  <Leg c="#34d399" l="Cache hit — subtree skipped" />
                )}
              </div>
            )}

            {/* All Approaches */}
            <div
              style={{
                borderRadius: 8,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  color: 'rgba(255,255,255,0.18)',
                  letterSpacing: 1,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                ALL APPROACHES
              </div>
              {APPROACHES.map((a) => {
                const c2 = {
                  recursion: {
                    t: pk === 'coin' ? 'O(c^n)' : 'O(2ⁿ)',
                    s: 'O(n)',
                  },
                  memo: { t: 'O(n)', s: 'O(n)' },
                  tab: { t: pk === 'coin' ? 'O(n·c)' : 'O(n)', s: 'O(n)' },
                  space: { t: 'O(n)', s: pk === 'coin' ? 'O(n)' : 'O(1)' },
                }[a.id]
                const act = a.id === ap
                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      borderRadius: 5,
                      marginBottom: 2,
                      background: act ? a.accent + '0d' : 'transparent',
                      borderLeft: `2.5px solid ${act ? a.accent : 'transparent'}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: act ? a.accent : 'rgba(255,255,255,0.25)',
                        fontWeight: 600,
                      }}
                    >
                      {a.short}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: act ? a.accent : 'rgba(255,255,255,0.18)',
                        fontFamily: "'IBM Plex Mono',monospace",
                      }}
                    >
                      T:{c2.t} S:{c2.s}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BtnCtrl({ onClick, c, accent, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: accent ? '6px 16px' : '5px 10px',
        borderRadius: 6,
        border: `1px solid ${c}${accent ? '' : '35'}`,
        background: accent ? c + '15' : 'transparent',
        color: c,
        fontSize: 10.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )
}

function Leg({ c, l }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div
        style={{
          width: 9,
          height: 9,
          borderRadius: 2.5,
          background: c + '25',
          border: `1px solid ${c}`,
        }}
      />
      <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)' }}>{l}</span>
    </div>
  )
}
