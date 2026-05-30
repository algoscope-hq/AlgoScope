// ─── LCS ────────────────────────────────────────────────────────────────────
export function generateLCSSteps(a, b) {
  const m = a.length,
    n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  const steps = []

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
      steps.push({
        table: dp.map((r) => [...r]),
        activeCell: [i, j],
        match: a[i - 1] === b[j - 1],
        phase: 'fill',
        i,
        j,
      })
    }
  }

  // traceback
  let i = m,
    j = n
  const path = []
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      path.push([i, j])
      steps.push({
        table: dp.map((r) => [...r]),
        activeCell: [i, j],
        phase: 'traceback',
        pathSoFar: [...path],
        i,
        j,
      })
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  return { steps, dp, strA: a, strB: b }
}

// ─── 0/1 Knapsack ────────────────────────────────────────────────────────────
export function generateKnapsackSteps(weights, values, capacity) {
  const n = weights.length
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0))
  const steps = []

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const canInclude = weights[i - 1] <= w
      const includeVal = canInclude
        ? values[i - 1] + dp[i - 1][w - weights[i - 1]]
        : -Infinity
      const excludeVal = dp[i - 1][w]
      dp[i][w] = Math.max(includeVal, excludeVal)
      steps.push({
        table: dp.map((r) => [...r]),
        activeCell: [i, w],
        decision: canInclude && includeVal > excludeVal ? 'include' : 'exclude',
        itemIndex: i - 1,
        phase: 'fill',
      })
    }
  }

  return { steps, dp, weights, values, capacity }
}

// ─── Coin Change ─────────────────────────────────────────────────────────────
export function generateCoinChangeSteps(coins, amount) {
  const INF = amount + 1
  const dp = Array(amount + 1).fill(INF)
  dp[0] = 0
  const usedCoin = Array(amount + 1).fill(-1)
  const steps = []

  steps.push({
    dp: [...dp],
    activeIndex: 0,
    usedCoin: [...usedCoin],
    phase: 'init',
  })

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1
        usedCoin[i] = coin
      }
    }
    steps.push({
      dp: [...dp],
      activeIndex: i,
      usedCoin: [...usedCoin],
      phase: 'fill',
      INF,
    })
  }

  return { steps, dp, coins, amount, INF }
}

// ─── LIS ─────────────────────────────────────────────────────────────────────
export function generateLISSteps(arr) {
  const n = arr.length
  const dp = Array(n).fill(1)
  const steps = []

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1
      }
      steps.push({
        dp: [...dp],
        activeI: i,
        activeJ: j,
        arr: [...arr],
        phase: 'compare',
        extended: arr[j] < arr[i] && dp[j] + 1 >= dp[i],
      })
    }
    steps.push({
      dp: [...dp],
      activeI: i,
      activeJ: -1,
      arr: [...arr],
      phase: 'update',
    })
  }

  return { steps, dp, arr }
}
