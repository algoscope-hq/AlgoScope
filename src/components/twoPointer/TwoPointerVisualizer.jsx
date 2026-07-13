import { useState, useEffect, useRef, useMemo } from 'react'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const BLUE = '#3b82f6'
const ORANGE = '#f97316'
const PURPLE = '#a78bfa'
const DIM = 'rgba(255,255,255,0.06)'
const MUTED = 'rgba(255,255,255,0.22)'
const FAINT = 'rgba(255,255,255,0.1)'

const PROBLEMS = {
  twoSum: {
    name: 'Two Sum (Sorted)',
    short: '2-Sum',
    desc: 'Find a pair that sums to target',
    accent: BLUE,
  },
  container: {
    name: 'Container With Most Water',
    short: 'Container',
    desc: 'Maximize water between two walls',
    accent: BLUE,
  },
  palindrome: {
    name: 'Valid Palindrome',
    short: 'Palindrome',
    desc: 'Check if array reads same both ways',
    accent: BLUE,
  },
  trapping: {
    name: 'Trapping Rain Water',
    short: 'Rain Water',
    desc: 'Compute total trapped water',
    accent: BLUE,
  },
}

/* ═══════════════════════════════════════════
   CODE TEMPLATES
   ═══════════════════════════════════════════ */
const CODES = {
  twoSum: {
    js: [
      { text: 'function twoSum(nums, target) {' },
      { text: '  let L = 0, R = nums.length - 1;' },
      { text: '  while (L < R) {' },
      { text: '    const sum = nums[L] + nums[R];' },
      { text: '    if (sum === target) return [L,R];' },
      { text: '    else if (sum < target) L++;' },
      { text: '    else R--;' },
      { text: '  }' },
      { text: '  return [-1, -1];' },
      { text: '}' },
    ],
    python: [
      { text: 'def twoSum(nums, target):' },
      { text: '    L, R = 0, len(nums) - 1' },
      { text: '    while L < R:' },
      { text: '        s = nums[L] + nums[R]' },
      { text: '        if s == target:' },
      { text: '            return [L, R]' },
      { text: '        elif s < target: L += 1' },
      { text: '        else: R -= 1' },
      { text: '    return [-1, -1]' },
    ],
  },
  container: {
    js: [
      { text: 'function maxArea(height) {' },
      { text: '  let L = 0, R = height.length-1;' },
      { text: '  let best = 0;' },
      { text: '  while (L < R) {' },
      { text: '    const h = Math.min(height[L],' },
      { text: '                       height[R]);' },
      { text: '    best = Math.max(best,' },
      { text: '                    h * (R - L));' },
      { text: '    if (height[L] < height[R]) L++;' },
      { text: '    else R--;' },
      { text: '  }' },
      { text: '  return best;' },
      { text: '}' },
    ],
    python: [
      { text: 'def maxArea(height):' },
      { text: '    L, R = 0, len(height)-1' },
      { text: '    best = 0' },
      { text: '    while L < R:' },
      { text: '        h = min(height[L], height[R])' },
      { text: '        best = max(best, h*(R-L))' },
      { text: '        if height[L] < height[R]:' },
      { text: '            L += 1' },
      { text: '        else:' },
      { text: '            R -= 1' },
      { text: '    return best' },
    ],
  },
  palindrome: {
    js: [
      { text: 'function isPalindrome(s) {' },
      { text: '  let L = 0, R = s.length - 1;' },
      { text: '  while (L < R) {' },
      { text: '    if (s[L] !== s[R]) return false;' },
      { text: '    L++;' },
      { text: '    R--;' },
      { text: '  }' },
      { text: '  return true;' },
      { text: '}' },
    ],
    python: [
      { text: 'def isPalindrome(s):' },
      { text: '    L, R = 0, len(s) - 1' },
      { text: '    while L < R:' },
      { text: '        if s[L] != s[R]:' },
      { text: '            return False' },
      { text: '        L += 1' },
      { text: '        R -= 1' },
      { text: '    return True' },
    ],
  },
  trapping: {
    js: [
      { text: 'function trap(height) {' },
      { text: '  let L=0, R=height.length-1;' },
      { text: '  let lMax=0, rMax=0, water=0;' },
      { text: '  while (L < R) {' },
      { text: '    if (height[L] <= height[R]) {' },
      { text: '      lMax = Math.max(lMax,height[L]);' },
      { text: '      water += lMax - height[L];' },
      { text: '      L++;' },
      { text: '    } else {' },
      { text: '      rMax = Math.max(rMax,height[R]);' },
      { text: '      water += rMax - height[R];' },
      { text: '      R--;' },
      { text: '    }' },
      { text: '  }' },
      { text: '  return water;' },
      { text: '}' },
    ],
    python: [
      { text: 'def trap(height):' },
      { text: '    L, R = 0, len(height)-1' },
      { text: '    lMax = rMax = water = 0' },
      { text: '    while L < R:' },
      { text: '        if height[L] <= height[R]:' },
      { text: '            lMax = max(lMax,height[L])' },
      { text: '            water += lMax - height[L]' },
      { text: '            L += 1' },
      { text: '        else:' },
      { text: '            rMax = max(rMax,height[R])' },
      { text: '            water += rMax - height[R]' },
      { text: '            R -= 1' },
      { text: '    return water' },
    ],
  },
}

/* ═══════════════════════════════════════════
   STEP GENERATORS
   ═══════════════════════════════════════════ */
function genTwoSumSteps(arr, target) {
  const steps = []
  let L = 0,
    R = arr.length - 1
  steps.push({
    L,
    R,
    arr,
    target,
    status: 'init',
    msg: `L=0, R=${arr.length - 1}. Start at both ends.`,
    explain:
      'Initialize left pointer at index 0 and right pointer at the last index. Because the array is sorted, moving L right increases the sum, moving R left decreases it.',
    codeLine: 1,
    sum: null,
    best: null,
    found: false,
  })
  while (L < R) {
    const sum = arr[L] + arr[R]
    if (sum === target) {
      steps.push({
        L,
        R,
        arr,
        target,
        status: 'found',
        msg: `nums[${L}] + nums[${R}] = ${arr[L]} + ${arr[R]} = ${sum} ✓ Found!`,
        explain: `The pair sums to the target exactly. Return indices [${L}, ${R}].`,
        codeLine: 4,
        sum,
        found: true,
      })
      break
    } else if (sum < target) {
      steps.push({
        L,
        R,
        arr,
        target,
        status: 'low',
        msg: `${arr[L]} + ${arr[R]} = ${sum} < ${target} → move L right`,
        explain: `Sum is too small. Since the array is sorted, moving L right gives a larger left value and increases the sum.`,
        codeLine: 5,
        sum,
        found: false,
      })
      L++
    } else {
      steps.push({
        L,
        R,
        arr,
        target,
        status: 'high',
        msg: `${arr[L]} + ${arr[R]} = ${sum} > ${target} → move R left`,
        explain: `Sum is too large. Moving R left gives a smaller right value and decreases the sum.`,
        codeLine: 6,
        sum,
        found: false,
      })
      R--
    }
  }
  if (L >= R) {
    const last = steps[steps.length - 1]
    if (!last?.found)
      steps.push({
        L,
        R,
        arr,
        target,
        status: 'done',
        msg: 'Pointers crossed — no valid pair found.',
        explain:
          'L and R have met. Every possible pair was checked. No pair sums to the target.',
        codeLine: 8,
        sum: null,
        found: false,
      })
  }
  steps.push({
    L,
    R,
    arr,
    target,
    status: 'done',
    msg: `Done! Time: O(n) — single pass through the array.`,
    explain:
      'Two pointers converge from both ends in one pass, giving O(n) time instead of O(n²) for brute force.',
    codeLine: -1,
    sum: null,
    found: false,
  })
  return steps
}

function genContainerSteps(heights) {
  const steps = []
  let L = 0,
    R = heights.length - 1,
    best = 0,
    bestPair = null
  steps.push({
    L,
    R,
    heights,
    best,
    bestPair,
    status: 'init',
    msg: `L=0, R=${heights.length - 1}. Find max area.`,
    explain:
      'Start with the widest possible window. We always move the shorter side inward — moving the taller side can only decrease (or keep equal) the area.',
    codeLine: 1,
    area: null,
  })
  while (L < R) {
    const h = Math.min(heights[L], heights[R])
    const area = h * (R - L)
    const improved = area > best
    if (improved) {
      best = area
      bestPair = [L, R]
    }
    steps.push({
      L,
      R,
      heights,
      best,
      bestPair,
      status: improved ? 'improved' : 'check',
      msg: `h=min(${heights[L]},${heights[R]})=${h}, w=${R - L}, area=${area}${improved ? ' ← new best!' : ''}`,
      explain: `Area = min(height[L], height[R]) × (R − L) = ${h} × ${R - L} = ${area}. ${improved ? 'This is the new maximum.' : `Not better than best=${best}.`}`,
      codeLine: 6,
      area,
    })
    if (heights[L] < heights[R]) {
      steps.push({
        L,
        R,
        heights,
        best,
        bestPair,
        status: 'move',
        msg: `height[L]=${heights[L]} < height[R]=${heights[R]} → L++`,
        explain:
          'The left bar is shorter, so it limits the water. Moving L inward is the only hope of finding a taller left bar.',
        codeLine: 8,
        area,
      })
      L++
    } else {
      steps.push({
        L,
        R,
        heights,
        best,
        bestPair,
        status: 'move',
        msg: `height[R]=${heights[R]} ≤ height[L]=${heights[L]} → R--`,
        explain:
          'The right bar is shorter (or equal). Move R inward to look for a taller right bar.',
        codeLine: 9,
        area,
      })
      R--
    }
  }
  steps.push({
    L,
    R,
    heights,
    best,
    bestPair,
    status: 'done',
    msg: `Done! Max area = ${best}. Time: O(n).`,
    explain:
      'All pairs considered by converging from both ends. Greedy: always move the shorter pointer because keeping the taller one gives no benefit when width decreases.',
    codeLine: -1,
    area: best,
  })
  return steps
}

function genPalindromeSteps(arr) {
  const steps = []
  let L = 0,
    R = arr.length - 1
  steps.push({
    L,
    R,
    arr,
    status: 'init',
    msg: `L=0, R=${arr.length - 1}. Check from both ends.`,
    explain:
      'A palindrome reads the same forwards and backwards. Compare the outermost characters first, then move inward.',
    codeLine: 1,
    match: null,
    result: null,
  })
  let isPalin = true
  while (L < R) {
    if (arr[L] !== arr[R]) {
      steps.push({
        L,
        R,
        arr,
        status: 'mismatch',
        msg: `arr[${L}]="${arr[L]}" ≠ arr[${R}]="${arr[R]}" → NOT a palindrome`,
        explain: `Characters at symmetric positions don't match. We can immediately return false — no need to check further.`,
        codeLine: 3,
        match: false,
        result: false,
      })
      isPalin = false
      break
    } else {
      steps.push({
        L,
        R,
        arr,
        status: 'match',
        msg: `arr[${L}]="${arr[L]}" = arr[${R}]="${arr[R]}" ✓ match`,
        explain: `Both outer characters match. Move both pointers inward and continue checking the inner portion.`,
        codeLine: 3,
        match: true,
        result: null,
      })
      L++
      R--
    }
  }
  if (isPalin)
    steps.push({
      L,
      R,
      arr,
      status: 'found',
      msg: `Pointers met — it IS a palindrome!`,
      explain:
        'All symmetric pairs matched. The array reads identically from both directions.',
      codeLine: 7,
      match: true,
      result: true,
    })
  steps.push({
    L,
    R,
    arr,
    status: 'done',
    msg: `Done! Result: ${isPalin ? 'true ✓' : 'false ✗'}. Time: O(n).`,
    explain:
      'Two pointers halve the work: only n/2 comparisons needed to verify a palindrome.',
    codeLine: -1,
    match: null,
    result: isPalin,
  })
  return steps
}

function genTrappingSteps(heights) {
  const steps = []
  let L = 0,
    R = heights.length - 1,
    lMax = 0,
    rMax = 0,
    water = 0
  steps.push({
    L,
    R,
    heights,
    lMax,
    rMax,
    water,
    status: 'init',
    msg: 'Initialize L, R, lMax, rMax, water = 0',
    explain:
      'lMax tracks the tallest bar seen from the left. rMax tracks the tallest from the right. Water above each cell = min(lMax, rMax) − height[cell].',
    codeLine: 2,
  })
  while (L < R) {
    if (heights[L] <= heights[R]) {
      lMax = Math.max(lMax, heights[L])
      const w = lMax - heights[L]
      water += w
      steps.push({
        L,
        R,
        heights,
        lMax,
        rMax,
        water,
        status: 'left',
        msg: `height[L]=${heights[L]}, lMax=${lMax}, +${w} water. L++`,
        explain: `height[L] ≤ height[R] so the left side is the bottleneck. Water above L = lMax − height[L] = ${lMax} − ${heights[L]} = ${w}. Advance L.`,
        codeLine: 5,
        trapped: w,
      })
      L++
    } else {
      rMax = Math.max(rMax, heights[R])
      const w = rMax - heights[R]
      water += w
      steps.push({
        L,
        R,
        heights,
        lMax,
        rMax,
        water,
        status: 'right',
        msg: `height[R]=${heights[R]}, rMax=${rMax}, +${w} water. R--`,
        explain: `height[R] < height[L] so the right side is the bottleneck. Water above R = rMax − height[R] = ${rMax} − ${heights[R]} = ${w}. Advance R.`,
        codeLine: 9,
        trapped: w,
      })
      R--
    }
  }
  steps.push({
    L,
    R,
    heights,
    lMax,
    rMax,
    water,
    status: 'done',
    msg: `Done! Total water = ${water}. Time: O(n).`,
    explain:
      'Each element is visited exactly once. lMax and rMax give us a guaranteed lower bound on the water, so we never need to look further.',
    codeLine: -1,
    trapped: null,
  })
  return steps
}

/* ═══════════════════════════════════════════
   ARRAY CONFIGS
   ═══════════════════════════════════════════ */
const ARRAYS = {
  twoSum: { default: [1, 3, 5, 7, 9, 12, 14, 17], target: 16 },
  container: { default: [2, 7, 4, 1, 8, 3, 6, 5] },
  palindrome: { default: ['A', 'B', 'C', 'D', 'C', 'B', 'A'] },
  trapping: { default: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] },
}

/* ═══════════════════════════════════════════
   ARRAY VISUALIZATION
   ═══════════════════════════════════════════ */
function ArrayViz({ step, pk }) {
  if (pk === 'twoSum') {
    const { arr, L, R, found } = step
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            gap: 5,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {arr.map((v, i) => {
            const isL = i === L
            const isR = i === R
            const isBetween = i > L && i < R
            let bg, border, color
            if (found && (isL || isR)) {
              bg = `${BLUE}25`
              border = BLUE
              color = BLUE
            } else if (isL) {
              bg = `${PURPLE}20`
              border = PURPLE
              color = PURPLE
            } else if (isR) {
              bg = `${ORANGE}20`
              border = ORANGE
              color = ORANGE
            } else if (isBetween) {
              bg = 'rgba(255,255,255,0.03)'
              border = 'rgba(255,255,255,0.08)'
              color = 'rgba(255,255,255,0.3)'
            } else {
              bg = 'rgba(255,255,255,0.015)'
              border = 'rgba(255,255,255,0.04)'
              color = 'rgba(255,255,255,0.15)'
            }
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: isL
                      ? PURPLE
                      : isR
                        ? ORANGE
                        : 'rgba(255,255,255,0.22)',
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontWeight: 700,
                  }}
                >
                  {isL ? 'L' : isR ? 'R' : '\u00A0'}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 7,
                    color,
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: 19,
                    fontWeight: 700,
                    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                    boxShadow: isL || isR ? `0 0 14px ${border}25` : 'none',
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.18)',
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  [{i}]
                </div>
              </div>
            )
          })}
        </div>
        {step.sum !== null && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 6,
            }}
          >
            <Stat
              label="Current sum"
              value={step.sum}
              color={
                step.status === 'found'
                  ? BLUE
                  : step.status === 'low'
                    ? '#facc15'
                    : ORANGE
              }
            />
            <Stat
              label="Target"
              value={step.target}
              color="rgba(255,255,255,0.4)"
            />
          </div>
        )}
      </div>
    )
  }

  if (pk === 'container') {
    const { heights, L, R, best, bestPair } = step
    const maxH = Math.max(...heights)
    const barW = 36,
      barGap = 6,
      padX = 10
    const totalW = heights.length * (barW + barGap) - barGap + padX * 2
    const svgH = 130
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ overflowX: 'auto' }}>
          <svg
            width={totalW}
            height={svgH}
            style={{ display: 'block', margin: '0 auto' }}
          >
            {heights.map((h, i) => {
              const x = padX + i * (barW + barGap)
              const barH = Math.round((h / maxH) * 90)
              const y = svgH - barH - 20
              const isL = i === L,
                isR = i === R
              const isBest = bestPair && i >= bestPair[0] && i <= bestPair[1]
              let fill = 'rgba(255,255,255,0.06)'
              let stroke = 'rgba(255,255,255,0.08)'
              if (isL) {
                fill = `${PURPLE}25`
                stroke = PURPLE
              } else if (isR) {
                fill = `${ORANGE}25`
                stroke = ORANGE
              } else if (isBest && step.status !== 'done') {
                fill = 'rgba(255,255,255,0.04)'
                stroke = 'rgba(255,255,255,0.12)'
              }
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={4}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.5}
                    style={{ transition: 'all 0.3s' }}
                  />
                  <text
                    x={x + barW / 2}
                    y={y - 4}
                    textAnchor="middle"
                    fontSize={12}
                    fill={isL ? PURPLE : isR ? ORANGE : 'rgba(255,255,255,0.3)'}
                    fontFamily="'IBM Plex Mono',monospace"
                    fontWeight={700}
                  >
                    {h}
                  </text>
                  <text
                    x={x + barW / 2}
                    y={svgH - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fill="rgba(255,255,255,0.18)"
                    fontFamily="'IBM Plex Mono',monospace"
                  >
                    [{i}]
                  </text>
                  {isL && (
                    <text
                      x={x + barW / 2}
                      y={svgH - 2}
                      textAnchor="middle"
                      fontSize={11}
                      fill={PURPLE}
                      fontFamily="'IBM Plex Mono',monospace"
                      fontWeight={700}
                    >
                      L
                    </text>
                  )}
                  {isR && (
                    <text
                      x={x + barW / 2}
                      y={svgH - 2}
                      textAnchor="middle"
                      fontSize={11}
                      fill={ORANGE}
                      fontFamily="'IBM Plex Mono',monospace"
                      fontWeight={700}
                    >
                      R
                    </text>
                  )}
                </g>
              )
            })}
            {/* water fill between L and R */}
            {L < R &&
              (() => {
                const lx = padX + L * (barW + barGap)
                const rx = padX + R * (barW + barGap) + barW
                const waterH = Math.min(heights[L], heights[R])
                const wy = svgH - Math.round((waterH / maxH) * 90) - 20
                return (
                  <rect
                    x={lx}
                    y={wy}
                    width={rx - lx}
                    height={svgH - wy - 20}
                    fill="rgba(59,130,246,0.07)"
                    stroke="none"
                  />
                )
              })()}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Stat label="Current area" value={step.area ?? '—'} color={BLUE} />
          <Stat label="Best" value={best} color={ORANGE} />
        </div>
      </div>
    )
  }

  if (pk === 'palindrome') {
    const { arr, L, R, match, result } = step
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          {arr.map((v, i) => {
            const isL = i === L,
              isR = i === R
            const checked = i < L || i > R
            let bg, border, color
            if (match === false && (isL || isR)) {
              bg = `${ORANGE}20`
              border = ORANGE
              color = ORANGE
            } else if (match === true && isL) {
              bg = `${PURPLE}20`
              border = PURPLE
              color = PURPLE
            } else if (match === true && isR) {
              bg = `${ORANGE}20`
              border = ORANGE
              color = ORANGE
            } else if (isL) {
              bg = `${PURPLE}18`
              border = PURPLE
              color = PURPLE
            } else if (isR) {
              bg = `${ORANGE}18`
              border = ORANGE
              color = ORANGE
            } else if (checked) {
              bg = 'rgba(52,211,153,0.06)'
              border = 'rgba(52,211,153,0.2)'
              color = '#34d399'
            } else {
              bg = 'rgba(255,255,255,0.02)'
              border = 'rgba(255,255,255,0.06)'
              color = 'rgba(255,255,255,0.25)'
            }
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: isL
                      ? PURPLE
                      : isR
                        ? ORANGE
                        : 'rgba(255,255,255,0.22)',
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontWeight: 700,
                  }}
                >
                  {isL ? 'L' : isR ? 'R' : '\u00A0'}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 7,
                    color,
                    fontFamily: "'IBM Plex Mono',monospace",
                    fontSize: 21,
                    fontWeight: 700,
                    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                    boxShadow: isL || isR ? `0 0 14px ${border}25` : 'none',
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.18)',
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  [{i}]
                </div>
              </div>
            )
          })}
        </div>
        {result !== null && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stat
              label="Result"
              value={result ? 'Palindrome ✓' : 'Not a palindrome ✗'}
              color={result ? BLUE : ORANGE}
            />
          </div>
        )}
      </div>
    )
  }

  if (pk === 'trapping') {
    const { heights, L, R, lMax, rMax, water } = step
    const maxH = Math.max(...heights, 1)
    const barW = 34,
      barGap = 5,
      padX = 8
    const totalW = heights.length * (barW + barGap) - barGap + padX * 2
    const svgH = 140
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ overflowX: 'auto' }}>
          <svg
            width={totalW}
            height={svgH}
            style={{ display: 'block', margin: '0 auto' }}
          >
            {heights.map((h, i) => {
              const x = padX + i * (barW + barGap)
              const barH = Math.max(
                Math.round((h / maxH) * 90),
                h === 0 ? 0 : 4
              )
              const y = svgH - barH - 22
              const isL = i === L,
                isR = i === R
              const trapped = Math.min(lMax, rMax) - h
              const waterH =
                trapped > 0 && i >= L && i <= R
                  ? Math.round((trapped / maxH) * 90)
                  : 0
              let fill = 'rgba(255,255,255,0.08)'
              let stroke = 'rgba(255,255,255,0.1)'
              if (isL) {
                fill = `${PURPLE}30`
                stroke = PURPLE
              } else if (isR) {
                fill = `${ORANGE}30`
                stroke = ORANGE
              }
              return (
                <g key={i}>
                  {waterH > 0 && (
                    <rect
                      x={x}
                      y={y - waterH}
                      width={barW}
                      height={waterH}
                      rx={2}
                      fill="rgba(59,130,246,0.18)"
                      stroke="rgba(59,130,246,0.3)"
                      strokeWidth={0.5}
                    />
                  )}
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx={3}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1.5}
                    style={{ transition: 'all 0.3s' }}
                  />
                  <text
                    x={x + barW / 2}
                    y={y - (waterH > 0 ? waterH + 4 : 4)}
                    textAnchor="middle"
                    fontSize={11}
                    fill={
                      isL ? PURPLE : isR ? ORANGE : 'rgba(255,255,255,0.25)'
                    }
                    fontFamily="'IBM Plex Mono',monospace"
                    fontWeight={700}
                  >
                    {h}
                  </text>
                  <text
                    x={x + barW / 2}
                    y={svgH - 8}
                    textAnchor="middle"
                    fontSize={9.5}
                    fill="rgba(255,255,255,0.18)"
                    fontFamily="'IBM Plex Mono',monospace"
                  >
                    [{i}]
                  </text>
                  {isL && (
                    <text
                      x={x + barW / 2}
                      y={svgH - 1}
                      textAnchor="middle"
                      fontSize={10.5}
                      fill={PURPLE}
                      fontFamily="'IBM Plex Mono',monospace"
                      fontWeight={700}
                    >
                      L
                    </text>
                  )}
                  {isR && (
                    <text
                      x={x + barW / 2}
                      y={svgH - 1}
                      textAnchor="middle"
                      fontSize={10.5}
                      fill={ORANGE}
                      fontFamily="'IBM Plex Mono',monospace"
                      fontWeight={700}
                    >
                      R
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <Stat label="lMax" value={lMax} color={BLUE} />
          <Stat label="rMax" value={rMax} color={ORANGE} />
          <Stat label="Water" value={water} color="rgba(52,211,153,0.9)" />
        </div>
      </div>
    )
  }

  return null
}

/* ═══════════════════════════════════════════
   STAT PILL
   ═══════════════════════════════════════════ */
function Stat({ label, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: MUTED,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 800,
          color,
          fontFamily: "'IBM Plex Mono',monospace",
        }}
      >
        {value}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CODE PANEL (identical to DP visualizer)
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
            fontSize: 14,
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
                fontSize: 13,
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
          fontSize: 15.5,
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
                  fontSize: 13,
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
   BUTTON CONTROL (identical to DP)
   ═══════════════════════════════════════════ */
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
        fontSize: 14.5,
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

/* ═══════════════════════════════════════════
   LEGEND
   ═══════════════════════════════════════════ */
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
      <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.3)' }}>
        {l}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function TwoPointerVisualizer() {
  const [pk, setPk] = useState('twoSum')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)
  const [lang, setLang] = useState('js')
  const timer = useRef(null)

  const prob = PROBLEMS[pk]
  const accent = prob.accent
  const cfg = ARRAYS[pk]

  const allSteps = useMemo(() => {
    switch (pk) {
      case 'twoSum':
        return genTwoSumSteps(cfg.default, cfg.target)
      case 'container':
        return genContainerSteps(cfg.default)
      case 'palindrome':
        return genPalindromeSteps(cfg.default)
      case 'trapping':
        return genTrappingSteps(cfg.default)
      default:
        return []
    }
  }, [pk, cfg])

  const total = allSteps.length
  const cur = allSteps[Math.min(step, total - 1)] || {}

  useEffect(() => {
    if (!playing || step >= total - 1) return undefined
    timer.current = setTimeout(() => setStep((s) => s + 1), speed)
    return () => clearTimeout(timer.current)
  }, [playing, step, total, speed])

  const progressPct = total > 1 ? (step / (total - 1)) * 100 : 0

  const complexity = {
    twoSum: { t: 'O(n)', s: 'O(1)', note: 'One pass, no extra space' },
    container: { t: 'O(n)', s: 'O(1)', note: 'Greedy shrink from both ends' },
    palindrome: { t: 'O(n)', s: 'O(1)', note: 'n/2 comparisons max' },
    trapping: { t: 'O(n)', s: 'O(1)', note: 'Guaranteed lower bound trick' },
  }[pk]

  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: '#c9d1d9' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        .tp-viz ::-webkit-scrollbar{width:3px;height:3px}
        .tp-viz ::-webkit-scrollbar-track{background:transparent}
        .tp-viz ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        
      `}</style>

      <div
        className="tp-viz"
        style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 16px' }}
      >
        {/* ── Header ── */}
        <div style={{ marginBottom: 18 }}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -0.4,
              color: '#e6edf3',
            }}
          >
            Two Pointer Technique
          </h1>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.28)',
              marginTop: 2,
            }}
          >
            Watch L and R converge — O(n) solutions instead of O(n²) brute force
          </p>
        </div>

        {/* ── Problem Selectors ── */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginBottom: 14,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {Object.entries(PROBLEMS).map(([k, p]) => (
              <button
                key={k}
                onClick={() => {
                  setPk(k)
                  setStep(0)
                  setPlaying(false)
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border:
                    pk === k
                      ? `1.5px solid ${p.accent}`
                      : '1.5px solid rgba(255,255,255,0.06)',
                  background:
                    pk === k ? p.accent + '12' : 'rgba(255,255,255,0.02)',
                  color: pk === k ? p.accent : 'rgba(255,255,255,0.35)',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {p.short}
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

          {/* Speed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.25)',
                fontWeight: 600,
              }}
            >
              SPEED
            </span>
            {[
              ['Slow', 1400],
              ['Med', 900],
              ['Fast', 350],
            ].map(([lbl, ms]) => (
              <button
                key={lbl}
                onClick={() => setSpeed(ms)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 5,
                  fontSize: 13.5,
                  fontWeight: 700,
                  border: `1px solid ${speed === ms ? accent + '50' : 'rgba(255,255,255,0.06)'}`,
                  background: speed === ms ? accent + '10' : 'transparent',
                  color: speed === ms ? accent : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN GRID ── */}
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
            {/* Problem description */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: accent }}>
                  {prob.name}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.28)',
                    marginLeft: 8,
                  }}
                >
                  {prob.desc}
                </span>
              </div>
              {pk === 'twoSum' && (
                <span
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.22)',
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  target = {cfg.target}
                </span>
              )}
            </div>

            {/* Visualization */}
            <div
              style={{
                borderRadius: 10,
                padding: 18,
                minHeight: 200,
                background: 'rgba(255,255,255,0.012)',
                border: '1px solid rgba(255,255,255,0.05)',
                animation: 'fadeUp 0.25s ease',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: MUTED,
                  marginBottom: 14,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                Visualization
              </div>
              <ArrayViz step={cur} pk={pk} />
            </div>

            {/* Playback Controls */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <BtnCtrl
                  onClick={() => {
                    setStep(0)
                    setPlaying(false)
                  }}
                  c="rgba(255,255,255,0.3)"
                >
                  ⏮
                </BtnCtrl>
                <BtnCtrl
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  c="rgba(255,255,255,0.3)"
                >
                  ◀
                </BtnCtrl>
                <BtnCtrl
                  onClick={() => {
                    if (step >= total - 1) {
                      setStep(0)
                      setPlaying(true)
                    } else setPlaying((p) => !p)
                  }}
                  c={accent}
                  accent
                >
                  {playing
                    ? '⏸ Pause'
                    : step >= total - 1
                      ? '↺ Replay'
                      : '► Play'}
                </BtnCtrl>
                <BtnCtrl
                  onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
                  c="rgba(255,255,255,0.3)"
                >
                  ▶
                </BtnCtrl>
                <BtnCtrl
                  onClick={() => {
                    setStep(total - 1)
                    setPlaying(false)
                  }}
                  c="rgba(255,255,255,0.3)"
                >
                  ⏭
                </BtnCtrl>
                <span
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.2)',
                    marginLeft: 4,
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  {step + 1} / {total}
                </span>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPct}%`,
                    background: accent,
                    borderRadius: 2,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            {/* Complexity cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {[
                {
                  label: 'Time Complexity',
                  value: complexity.t,
                  sub: complexity.note,
                },
                {
                  label: 'Space Complexity',
                  value: complexity.s,
                  sub: 'No auxiliary data structures',
                },
              ].map((c) => (
                <div
                  key={c.label}
                  style={{
                    borderRadius: 8,
                    padding: '10px 14px',
                    background: `${accent}06`,
                    border: `1px solid ${accent}10`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.2)',
                      textTransform: 'uppercase',
                      letterSpacing: 1.5,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 23,
                      fontWeight: 800,
                      color: accent,
                      fontFamily: "'IBM Plex Mono',monospace",
                    }}
                  >
                    {c.value}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.22)',
                      marginTop: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {c.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
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
                code={CODES[pk][lang]}
                activeLine={cur.codeLine ?? -1}
                lang={lang}
                setLang={setLang}
                accent={accent}
              />
            </div>

            {/* What's happening */}
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
                  fontSize: 14,
                  color: MUTED,
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
                  fontSize: 17,
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
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: 1.7,
                }}
              >
                {cur.explain ||
                  'Step through the algorithm to see how two pointers converge from both ends.'}
              </div>
            </div>

            {/* Legend */}
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
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.18)',
                  letterSpacing: 1,
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                LEGEND
              </div>
              <Leg c={PURPLE} l="Left pointer (L)" />
              <Leg c={ORANGE} l="Right pointer (R)" />
              {pk === 'twoSum' && <Leg c="#34d399" l="Target pair found" />}
              {pk === 'palindrome' && (
                <Leg c="#34d399" l="Already verified (matched)" />
              )}
              {pk === 'trapping' && (
                <Leg c={BLUE} l="Trapped water (blue fill)" />
              )}
            </div>

            {/* All problems comparison */}
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
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.18)',
                  letterSpacing: 1,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                ALL PROBLEMS
              </div>
              {Object.entries(PROBLEMS).map(([k, p]) => {
                const act = k === pk
                return (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      borderRadius: 5,
                      marginBottom: 2,
                      background: act ? p.accent + '0d' : 'transparent',
                      borderLeft: `2.5px solid ${act ? p.accent : 'transparent'}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: act ? p.accent : 'rgba(255,255,255,0.25)',
                        fontWeight: 600,
                      }}
                    >
                      {p.short}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: act ? p.accent : 'rgba(255,255,255,0.18)',
                        fontFamily: "'IBM Plex Mono',monospace",
                      }}
                    >
                      T:O(n) S:O(1)
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
