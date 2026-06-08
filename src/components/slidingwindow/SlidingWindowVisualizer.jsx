import React, { useState, useEffect, useMemo } from 'react'

/**
 * SlidingWindowVisualizer
 * -----------------------
 * AlgoScope-style interactive visualizer for the Sliding Window pattern.
 * Matches the DP Optimization Journey layout: problem tabs, approach tabs,
 * Mac-style code panel with the executing line highlighted, "What's happening"
 * panel, legend, an all-approaches complexity table, step/play/reset controls,
 * and time/space complexity cards comparing the naive approach to the optimized
 * sliding-window approach.
 *
 * The window literally slides: a translucent amber rectangle animates over the
 * array/string cells as the left (L) and right (R) pointers move.
 *
 * Self-contained — no external dependencies beyond React.
 */

/* ------------------------------------------------------------------ theme */
const C = {
  bg: '#0a0a0f',
  panel: 'rgba(255,255,255,0.035)',
  panel2: 'rgba(255,255,255,0.02)',
  border: 'rgba(255,255,255,0.09)',
  border2: 'rgba(255,255,255,0.06)',
  text: '#e6eaf2',
  muted: '#9aa3b2',
  faint: '#646c7e',
  pink: '#f472b6',
  rose: '#fb6f92',
  red: '#f43f5e',
  amber: '#fbbf24',
  emerald: '#34d399',
  indigo: '#818cf8',
  cyan: '#22d3ee',
  codeBg: '#0d1117',
  codeHead: '#161b22',
  code: {
    def: '#c0caf5',
    comment: '#565f89',
    string: '#9ece6a',
    keyword: '#ff7b9c',
    number: '#ff9e64',
    func: '#7aa2f7',
  },
}

const MONO =
  "'JetBrains Mono','SF Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
const SANS =
  "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"

/* -------------------------------------------------------- syntax highlight */
const reJS =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(function|return|let|const|var|if|else|for|while|of|in|new|class|typeof|Infinity|Math|true|false|null)\b|\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g
const rePY =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|return|if|elif|else|for|while|in|not|and|or|None|True|False|float|int|len|range|max|min|class|import|from|set|sum)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g

function tokenize(line, lang) {
  const re = lang === 'py' ? rePY : reJS
  re.lastIndex = 0
  const out = []
  let last = 0
  let m
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ t: line.slice(last, m.index) })
    if (m[1]) out.push({ t: m[1], c: 'comment' })
    else if (m[2]) out.push({ t: m[2], c: 'string' })
    else if (m[3]) out.push({ t: m[3], c: 'keyword' })
    else if (m[4]) out.push({ t: m[4], c: 'number' })
    else if (m[5]) out.push({ t: m[5], c: 'func' })
    last = re.lastIndex
    if (m.index === re.lastIndex) re.lastIndex++
  }
  if (last < line.length) out.push({ t: line.slice(last) })
  return out
}

/* ----------------------------------------------------------- step builders */
// Each step carries: { l, r, ops, line(symbol), msg, formula, best, bestRange,
//                      set(optional chars), phase, done }

function genMaxSumBrute(arr, k) {
  const steps = []
  let ops = 0,
    best = -Infinity,
    bestRange = null
  steps.push({
    l: 0,
    r: k - 1,
    ops,
    line: 'outer',
    msg: 'Brute force: for every start index, add up all k elements from scratch.',
    formula: '',
    best: '—',
    bestRange: null,
  })
  for (let i = 0; i + k <= arr.length; i++) {
    let sum = 0
    for (let j = i; j < i + k; j++) {
      sum += arr[j]
      ops++
    }
    const better = sum > best
    if (better) {
      best = sum
      bestRange = [i, i + k - 1]
    }
    steps.push({
      l: i,
      r: i + k - 1,
      ops,
      line: 'scan',
      msg: `Window [${i}..${i + k - 1}] → re-summed all ${k} elements.`,
      formula: `sum = ${sum}${better ? '   new best' : ''}`,
      best,
      bestRange,
      phase: better ? 'found' : 'scan',
    })
  }
  steps.push({
    l: bestRange[0],
    r: bestRange[1],
    ops,
    line: 'done',
    msg: `Done. Re-summed every window — ${ops} additions total ≈ n·k.`,
    formula: `answer = ${best}`,
    best,
    bestRange,
    done: true,
    phase: 'found',
  })
  return steps
}

function genMaxSumSlide(arr, k) {
  const steps = []
  let ops = 0,
    sum = 0
  for (let i = 0; i < k; i++) {
    sum += arr[i]
    ops++
  }
  let best = sum,
    bestRange = [0, k - 1]
  steps.push({
    l: 0,
    r: k - 1,
    ops,
    line: 'build',
    msg: `Build the FIRST window once (sum of the first ${k} elements).`,
    formula: `sum = ${sum}`,
    best,
    bestRange,
    phase: 'found',
  })
  for (let r = k; r < arr.length; r++) {
    sum += arr[r] - arr[r - k]
    ops++
    const l = r - k + 1
    const better = sum > best
    if (better) {
      best = sum
      bestRange = [l, r]
    }
    steps.push({
      l,
      r,
      ops,
      line: 'slide',
      msg: `Slide right: +arr[${r}]=${arr[r]}, −arr[${r - k}]=${arr[r - k]}. No re-summing!`,
      formula: `sum = ${sum}${better ? '   new best' : ''}`,
      best,
      bestRange,
      phase: better ? 'found' : 'slide',
    })
  }
  steps.push({
    l: bestRange[0],
    r: bestRange[1],
    ops,
    line: 'done',
    msg: `Done in just ${ops} operations ≈ n. Every slide is O(1).`,
    formula: `answer = ${best}`,
    best,
    bestRange,
    done: true,
    phase: 'found',
  })
  return steps
}

function genLongestBrute(str) {
  const steps = []
  let ops = 0,
    best = 0,
    bestRange = [0, -1]
  steps.push({
    l: 0,
    r: -1,
    ops,
    line: 'outer',
    msg: 'Brute force: try every start, extend until a repeat, re-check uniqueness each time.',
    formula: '',
    best: 0,
    bestRange: [0, -1],
    set: [],
  })
  for (let i = 0; i < str.length; i++) {
    const seen = new Set()
    for (let j = i; j < str.length; j++) {
      ops++
      if (seen.has(str[j])) {
        steps.push({
          l: i,
          r: j,
          ops,
          line: 'check',
          msg: `Start ${i}: hit repeat '${str[j]}' at index ${j}. Abandon this start.`,
          formula: `length = ${j - i}`,
          best,
          bestRange,
          set: [...seen],
          phase: 'shrink',
        })
        break
      }
      seen.add(str[j])
      const len = j - i + 1
      const better = len > best
      if (better) {
        best = len
        bestRange = [i, j]
      }
      steps.push({
        l: i,
        r: j,
        ops,
        line: 'check',
        msg: `Start ${i}: '${str[j]}' is new — extend the test window.`,
        formula: `length = ${len}${better ? '   longest' : ''}`,
        best,
        bestRange,
        set: [...seen],
        phase: better ? 'found' : 'scan',
      })
    }
  }
  steps.push({
    l: bestRange[0],
    r: bestRange[1],
    ops,
    line: 'done',
    msg: `Done. ${ops} character checks ≈ n². Tons of re-scanning.`,
    formula: `answer = ${best}`,
    best,
    bestRange,
    set: null,
    done: true,
    phase: 'found',
  })
  return steps
}

function genLongestSlide(str) {
  const steps = []
  let ops = 0,
    l = 0,
    best = 0,
    bestRange = [0, -1]
  const set = new Set()
  steps.push({
    l: 0,
    r: -1,
    ops,
    line: 'init',
    msg: 'Grow the window right; shrink from the left only when a duplicate appears.',
    formula: '',
    best: 0,
    bestRange: [0, -1],
    set: [],
  })
  for (let r = 0; r < str.length; r++) {
    const c = str[r]
    while (set.has(c)) {
      set.delete(str[l])
      l++
      ops++
      steps.push({
        l,
        r,
        ops,
        line: 'shrink',
        msg: `Duplicate '${c}' — shrink: drop '${str[l - 1]}' from the left.`,
        formula: `window now ${l}..${r - 1}`,
        best,
        bestRange,
        set: [...set],
        phase: 'shrink',
      })
    }
    set.add(c)
    ops++
    const len = r - l + 1
    const better = len > best
    if (better) {
      best = len
      bestRange = [l, r]
    }
    steps.push({
      l,
      r,
      ops,
      line: 'expand',
      msg: `Add '${c}'. Window holds only unique characters.`,
      formula: `length = ${len}${better ? '   longest' : ''}`,
      best,
      bestRange,
      set: [...set],
      phase: better ? 'found' : 'expand',
    })
  }
  steps.push({
    l: bestRange[0],
    r: bestRange[1],
    ops,
    line: 'done',
    msg: `Done in ${ops} steps ≈ 2n. Each char enters and leaves the window once.`,
    formula: `answer = ${best}`,
    best,
    bestRange,
    set: null,
    done: true,
    phase: 'found',
  })
  return steps
}

function genMinSubBrute(arr, target) {
  const steps = []
  let ops = 0,
    best = Infinity,
    bestRange = null
  steps.push({
    l: 0,
    r: -1,
    ops,
    line: 'outer',
    msg: `Brute force: from every start, keep adding until sum ≥ ${target}.`,
    formula: '',
    best: '∞',
    bestRange: null,
  })
  for (let i = 0; i < arr.length; i++) {
    let sum = 0
    for (let j = i; j < arr.length; j++) {
      sum += arr[j]
      ops++
      if (sum >= target) {
        const len = j - i + 1
        const better = len < best
        if (better) {
          best = len
          bestRange = [i, j]
        }
        steps.push({
          l: i,
          r: j,
          ops,
          line: 'inner',
          msg: `Start ${i}: sum ${sum} ≥ ${target} reached at ${j}.`,
          formula: `length = ${len}${better ? '   smallest' : ''}`,
          best,
          bestRange,
          phase: better ? 'found' : 'scan',
        })
        break
      } else {
        steps.push({
          l: i,
          r: j,
          ops,
          line: 'inner',
          msg: `Start ${i}: sum ${sum} < ${target}, keep adding.`,
          formula: `sum = ${sum}`,
          best: best === Infinity ? '∞' : best,
          bestRange,
          phase: 'scan',
        })
      }
    }
  }
  const ans = best === Infinity ? 0 : best
  steps.push({
    l: bestRange ? bestRange[0] : 0,
    r: bestRange ? bestRange[1] : 0,
    ops,
    line: 'done',
    msg: `Done. ${ops} additions ≈ n². Each start re-adds from scratch.`,
    formula: `answer = ${ans}`,
    best: ans,
    bestRange,
    done: true,
    phase: 'found',
  })
  return steps
}

function genMinSubSlide(arr, target) {
  const steps = []
  let ops = 0,
    l = 0,
    sum = 0,
    best = Infinity,
    bestRange = null
  steps.push({
    l: 0,
    r: -1,
    ops,
    line: 'init',
    msg: `Expand right adding elements; once sum ≥ ${target}, shrink left to find the smallest valid window.`,
    formula: '',
    best: '∞',
    bestRange: null,
  })
  for (let r = 0; r < arr.length; r++) {
    sum += arr[r]
    ops++
    steps.push({
      l,
      r,
      ops,
      line: 'expand',
      msg: `Expand: add arr[${r}]=${arr[r]}.`,
      formula: `sum = ${sum}`,
      best: best === Infinity ? '∞' : best,
      bestRange,
      phase: 'expand',
    })
    while (sum >= target) {
      const len = r - l + 1
      const better = len < best
      if (better) {
        best = len
        bestRange = [l, r]
      }
      steps.push({
        l,
        r,
        ops,
        line: 'shrink',
        msg: `sum ${sum} ≥ ${target}: record length ${len}${better ? ' (smallest!)' : ''}, then shrink from left.`,
        formula: `best length = ${best === Infinity ? '∞' : best}`,
        best: best === Infinity ? '∞' : best,
        bestRange,
        phase: better ? 'found' : 'shrink',
      })
      sum -= arr[l]
      l++
      ops++
    }
  }
  const ans = best === Infinity ? 0 : best
  steps.push({
    l: bestRange ? bestRange[0] : 0,
    r: bestRange ? bestRange[1] : 0,
    ops,
    line: 'done',
    msg: `Done in ${ops} ops ≈ 2n. The window only ever moves forward.`,
    formula: `answer = ${ans}`,
    best: ans,
    bestRange,
    done: true,
    phase: 'found',
  })
  return steps
}

/* ------------------------------------------------------------------- data */
const PROBLEMS = [
  {
    id: 'maxsum',
    label: 'Max Sum of Size K',
    kind: 'array',
    sub: 'Find the maximum sum of any contiguous sub-array of length k.',
    defaultData: { arr: [2, 1, 5, 1, 3, 2], k: 3 },
    paramText: (d) => `k = ${d.k}`,
    randomize: (d) => ({
      k: d.k,
      arr: Array.from({ length: 6 }, () => 1 + Math.floor(Math.random() * 8)),
    }),
    approaches: {
      brute: {
        name: 'Brute Force',
        time: 'O(n · k)',
        space: 'O(1)',
        note: "Recomputes every window's sum from scratch — k additions per window.",
        gen: (d) => genMaxSumBrute(d.arr, d.k),
        code: {
          js: {
            src: [
              'function maxSum(arr, k) {',
              '  let best = -Infinity;',
              '  for (let i = 0; i + k <= arr.length; i++) {',
              '    let sum = 0;',
              '    for (let j = i; j < i + k; j++) sum += arr[j];',
              '    best = Math.max(best, sum);',
              '  }',
              '  return best;',
              '}',
            ],
            map: { outer: 3, scan: 5, done: 8 },
          },
          py: {
            src: [
              'def max_sum(arr, k):',
              "    best = float('-inf')",
              '    for i in range(len(arr) - k + 1):',
              '        s = sum(arr[i:i + k])',
              '        best = max(best, s)',
              '    return best',
            ],
            map: { outer: 3, scan: 4, done: 6 },
          },
        },
      },
      slide: {
        name: 'Sliding Window',
        time: 'O(n)',
        space: 'O(1)',
        note: 'Reuses the previous sum: add the entering element, drop the leaving one.',
        gen: (d) => genMaxSumSlide(d.arr, d.k),
        code: {
          js: {
            src: [
              'function maxSum(arr, k) {',
              '  let sum = 0;',
              '  for (let i = 0; i < k; i++) sum += arr[i];',
              '  let best = sum;',
              '  for (let r = k; r < arr.length; r++) {',
              '    sum += arr[r] - arr[r - k];',
              '    best = Math.max(best, sum);',
              '  }',
              '  return best;',
              '}',
            ],
            map: { build: 3, slide: 6, done: 9 },
          },
          py: {
            src: [
              'def max_sum(arr, k):',
              '    s = sum(arr[:k])',
              '    best = s',
              '    for r in range(k, len(arr)):',
              '        s += arr[r] - arr[r - k]',
              '        best = max(best, s)',
              '    return best',
            ],
            map: { build: 2, slide: 5, done: 7 },
          },
        },
      },
    },
  },
  {
    id: 'longest',
    label: 'Longest Unique Substring',
    kind: 'string',
    sub: 'Length of the longest substring without repeating characters.',
    defaultData: { str: 'abcabcbb' },
    paramText: () => 'all unique chars',
    approaches: {
      brute: {
        name: 'Brute Force',
        time: 'O(n²)',
        space: 'O(n)',
        note: 'Tests every start, re-scanning characters for uniqueness each time.',
        gen: (d) => genLongestBrute(d.str),
        code: {
          js: {
            src: [
              'function longest(s) {',
              '  let best = 0;',
              '  for (let i = 0; i < s.length; i++) {',
              '    const seen = new Set();',
              '    for (let j = i; j < s.length; j++) {',
              '      if (seen.has(s[j])) break;',
              '      seen.add(s[j]);',
              '      best = Math.max(best, j - i + 1);',
              '    }',
              '  }',
              '  return best;',
              '}',
            ],
            map: { outer: 3, check: 6, done: 11 },
          },
          py: {
            src: [
              'def longest(s):',
              '    best = 0',
              '    for i in range(len(s)):',
              '        seen = set()',
              '        for j in range(i, len(s)):',
              '            if s[j] in seen:',
              '                break',
              '            seen.add(s[j])',
              '            best = max(best, j - i + 1)',
              '    return best',
            ],
            map: { outer: 3, check: 6, done: 10 },
          },
        },
      },
      slide: {
        name: 'Sliding Window',
        time: 'O(n)',
        space: 'O(k)',
        note: 'Each character enters and leaves the window at most once via a set.',
        gen: (d) => genLongestSlide(d.str),
        code: {
          js: {
            src: [
              'function longest(s) {',
              '  const seen = new Set();',
              '  let l = 0, best = 0;',
              '  for (let r = 0; r < s.length; r++) {',
              '    while (seen.has(s[r])) {',
              '      seen.delete(s[l]);',
              '      l++;',
              '    }',
              '    seen.add(s[r]);',
              '    best = Math.max(best, r - l + 1);',
              '  }',
              '  return best;',
              '}',
            ],
            map: { init: 2, shrink: 6, expand: 9, done: 12 },
          },
          py: {
            src: [
              'def longest(s):',
              '    seen = set()',
              '    l = best = 0',
              '    for r in range(len(s)):',
              '        while s[r] in seen:',
              '            seen.discard(s[l])',
              '            l += 1',
              '        seen.add(s[r])',
              '        best = max(best, r - l + 1)',
              '    return best',
            ],
            map: { init: 2, shrink: 6, expand: 8, done: 10 },
          },
        },
      },
    },
  },
  {
    id: 'minsub',
    label: 'Smallest Subarray ≥ Target',
    kind: 'array',
    sub: 'Minimum length of a contiguous sub-array with sum ≥ target.',
    defaultData: { arr: [2, 3, 1, 2, 4, 3], target: 7 },
    paramText: (d) => `target = ${d.target}`,
    randomize: (d) => ({
      target: d.target,
      arr: Array.from({ length: 6 }, () => 1 + Math.floor(Math.random() * 5)),
    }),
    approaches: {
      brute: {
        name: 'Brute Force',
        time: 'O(n²)',
        space: 'O(1)',
        note: 'From each start, re-adds elements until the target sum is reached.',
        gen: (d) => genMinSubBrute(d.arr, d.target),
        code: {
          js: {
            src: [
              'function minLen(arr, target) {',
              '  let best = Infinity;',
              '  for (let i = 0; i < arr.length; i++) {',
              '    let sum = 0;',
              '    for (let j = i; j < arr.length; j++) {',
              '      sum += arr[j];',
              '      if (sum >= target) {',
              '        best = Math.min(best, j - i + 1);',
              '        break;',
              '      }',
              '    }',
              '  }',
              '  return best === Infinity ? 0 : best;',
              '}',
            ],
            map: { outer: 3, inner: 6, done: 13 },
          },
          py: {
            src: [
              'def min_len(arr, target):',
              "    best = float('inf')",
              '    for i in range(len(arr)):',
              '        s = 0',
              '        for j in range(i, len(arr)):',
              '            s += arr[j]',
              '            if s >= target:',
              '                best = min(best, j - i + 1)',
              '                break',
              "    return 0 if best == float('inf') else best",
            ],
            map: { outer: 3, inner: 6, done: 10 },
          },
        },
      },
      slide: {
        name: 'Sliding Window',
        time: 'O(n)',
        space: 'O(1)',
        note: 'A single window expands right, then shrinks left while still valid.',
        gen: (d) => genMinSubSlide(d.arr, d.target),
        code: {
          js: {
            src: [
              'function minLen(arr, target) {',
              '  let l = 0, sum = 0, best = Infinity;',
              '  for (let r = 0; r < arr.length; r++) {',
              '    sum += arr[r];',
              '    while (sum >= target) {',
              '      best = Math.min(best, r - l + 1);',
              '      sum -= arr[l];',
              '      l++;',
              '    }',
              '  }',
              '  return best === Infinity ? 0 : best;',
              '}',
            ],
            map: { init: 2, expand: 4, shrink: 6, done: 11 },
          },
          py: {
            src: [
              'def min_len(arr, target):',
              '    l = s = 0',
              "    best = float('inf')",
              '    for r in range(len(arr)):',
              '        s += arr[r]',
              '        while s >= target:',
              '            best = min(best, r - l + 1)',
              '            s -= arr[l]',
              '            l += 1',
              "    return 0 if best == float('inf') else best",
            ],
            map: { init: 3, expand: 5, shrink: 7, done: 11 },
          },
        },
      },
    },
  },
]

/* ------------------------------------------------------------- small bits */
const CELL = 52
const GAP = 10

function Panel({ title, children, style }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 16,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: 1.5,
            color: C.faint,
            fontWeight: 700,
            marginBottom: 12,
            fontFamily: SANS,
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

function Tab({ active, accent, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        cursor: 'pointer',
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 600,
        padding: '8px 14px',
        borderRadius: 10,
        transition: 'all .18s',
        color: active ? '#fff' : C.muted,
        background: active ? (accent || C.pink) + '22' : 'transparent',
        border: `1px solid ${active ? (accent || C.pink) + '88' : C.border2}`,
        boxShadow: active ? `0 0 0 1px ${accent || C.pink}33 inset` : 'none',
      }}
    >
      {children}
    </button>
  )
}

/* ============================================================= component */
export default function SlidingWindowVisualizer() {
  const [pIdx, setPIdx] = useState(0)
  const [appr, setAppr] = useState('slide')
  const [lang, setLang] = useState('js')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [sliderVal, setSliderVal] = useState(650)
  const [copied, setCopied] = useState(false)
  const [seed, setSeed] = useState(0) // bump to re-randomize

  const problem = PROBLEMS[pIdx]
  const approach = problem.approaches[appr]
  const delay = 1350 - sliderVal

  // data per problem (randomizable for array problems)
  const data = useMemo(() => {
    if (problem.kind === 'array' && problem.randomize && seed > 0) {
      return problem.randomize(problem.defaultData)
    }
    return problem.defaultData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pIdx, seed])

  const steps = useMemo(() => approach.gen(data), [approach, data])
  const cur = steps[Math.min(step, steps.length - 1)]
  const cells = problem.kind === 'string' ? data.str.split('') : data.arr

  // reset when problem / approach / data changes
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [pIdx, appr, seed])

  // autoplay
  useEffect(() => {
    if (!playing) return
    if (step >= steps.length - 1) {
      setPlaying(false)
      return
    }
    const id = setTimeout(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      delay
    )
    return () => clearTimeout(id)
  }, [playing, step, steps, delay])

  const code = approach.code[lang]
  const activeLine = code.map[cur.line] || -1

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.src.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard blocked in sandbox */
    }
  }

  // window overlay geometry
  const hasWin = cur.r >= cur.l && cur.r >= 0
  const winLeft = cur.l * (CELL + GAP)
  const winWidth = (cur.r - cur.l + 1) * (CELL + GAP) - GAP

  const phaseColor =
    cur.phase === 'shrink'
      ? C.rose
      : cur.phase === 'found' || cur.done
        ? C.emerald
        : C.amber

  const inBest = (i) =>
    cur.bestRange && i >= cur.bestRange[0] && i <= cur.bestRange[1]

  const btn = (extra) => ({
    cursor: 'pointer',
    fontFamily: SANS,
    fontSize: 13,
    fontWeight: 600,
    padding: '9px 14px',
    borderRadius: 10,
    color: C.text,
    background: C.panel,
    border: `1px solid ${C.border}`,
    transition: 'all .15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    ...extra,
  })

  return (
    <div
      style={{
        background: `radial-gradient(1200px 600px at 70% -10%, #15131f 0%, ${C.bg} 55%)`,
        minHeight: '100%',
        padding: '22px 18px 32px',
        fontFamily: SANS,
        color: C.text,
      }}
    >
      <style>{`
        .swrange{ -webkit-appearance:none; height:4px; border-radius:4px; background:${C.border}; outline:none; }
        .swrange::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:${C.pink}; cursor:pointer; box-shadow:0 0 0 4px ${C.pink}22; }
        .swrange::-moz-range-thumb{ width:16px; height:16px; border:none; border-radius:50%; background:${C.pink}; cursor:pointer; }
        .swbtn:hover{ border-color:${C.pink}88 !important; color:#fff !important; }
        .swcode::-webkit-scrollbar{ height:8px; width:8px; }
        .swcode::-webkit-scrollbar-thumb{ background:${C.border}; border-radius:8px; }
        @keyframes swpulse{ 0%,100%{ opacity:1 } 50%{ opacity:.55 } }
      `}</style>

      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* header */}
        <div style={{ marginBottom: 18 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: -0.4,
            }}
          >
            Sliding Window <span style={{ color: C.pink }}>Visualizer</span>
          </h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: 13.5 }}>
            Watch the window slide step by step — from O(n²) brute force to O(n)
            one-pass.
          </p>
        </div>

        {/* problem tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 10,
          }}
        >
          {PROBLEMS.map((p, i) => (
            <Tab
              key={p.id}
              active={i === pIdx}
              accent={C.pink}
              onClick={() => setPIdx(i)}
            >
              {p.label}
            </Tab>
          ))}
        </div>
        {/* approach tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Tab
            active={appr === 'brute'}
            accent={C.red}
            onClick={() => setAppr('brute')}
          >
            Brute Force
          </Tab>
          <Tab
            active={appr === 'slide'}
            accent={C.emerald}
            onClick={() => setAppr('slide')}
          >
            Sliding Window
          </Tab>
          <div style={{ flex: 1 }} />
          <span style={{ alignSelf: 'center', fontSize: 12.5, color: C.faint }}>
            {problem.sub}
          </span>
        </div>

        {/* main grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {/* LEFT: visualization */}
          <div
            style={{
              flex: '1.6 1 360px',
              minWidth: 340,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <Panel title="VISUALIZATION" style={{ flex: 1 }}>
              {/* params */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 12, color: C.muted }}>Input:</span>
                <code
                  style={{ fontFamily: MONO, fontSize: 12.5, color: C.cyan }}
                >
                  {problem.kind === 'string'
                    ? `"${data.str}"`
                    : `[${data.arr.join(', ')}]`}
                </code>
                <span
                  style={{
                    fontSize: 11.5,
                    color: C.amber,
                    background: C.amber + '18',
                    border: `1px solid ${C.amber}44`,
                    padding: '2px 9px',
                    borderRadius: 20,
                  }}
                >
                  {problem.paramText(data)}
                </span>
                {problem.kind === 'array' && problem.randomize && (
                  <button
                    className="swbtn"
                    style={btn({ padding: '5px 11px', fontSize: 12 })}
                    onClick={() => setSeed((s) => s + 1)}
                  >
                    ↻ Randomize
                  </button>
                )}
              </div>

              {/* cells + sliding window */}
              <div
                style={{ overflowX: 'auto', paddingBottom: 6 }}
                className="swcode"
              >
                <div
                  style={{
                    position: 'relative',
                    width: cells.length * (CELL + GAP) - GAP,
                    margin: '0 auto',
                    minWidth: cells.length * (CELL + GAP) - GAP,
                  }}
                >
                  {/* value cells */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      gap: GAP,
                      height: CELL,
                    }}
                  >
                    {cells.map((v, i) => (
                      <div
                        key={i}
                        style={{
                          flex: `0 0 ${CELL}px`,
                          height: CELL,
                          borderRadius: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: MONO,
                          fontSize: 18,
                          fontWeight: 700,
                          background: inBest(i) ? C.emerald + '1f' : C.panel2,
                          border: `1px solid ${inBest(i) ? C.emerald + '99' : C.border2}`,
                          color: inBest(i) ? C.emerald : C.text,
                          transition: 'all .35s ease',
                          zIndex: 1,
                        }}
                      >
                        {v}
                      </div>
                    ))}
                    {/* the sliding window */}
                    {hasWin && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -5,
                          height: CELL + 10,
                          left: winLeft,
                          width: Math.max(winWidth, CELL),
                          borderRadius: 12,
                          pointerEvents: 'none',
                          zIndex: 2,
                          background: phaseColor + '1c',
                          border: `2px solid ${phaseColor}`,
                          boxShadow: `0 0 22px ${phaseColor}44`,
                          transition:
                            'left .4s cubic-bezier(.4,0,.2,1), width .4s cubic-bezier(.4,0,.2,1), border-color .3s, background .3s',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: -19,
                            left: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            color: phaseColor,
                            fontFamily: MONO,
                          }}
                        >
                          window
                        </span>
                      </div>
                    )}
                  </div>
                  {/* index row */}
                  <div style={{ display: 'flex', gap: GAP, marginTop: 6 }}>
                    {cells.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: `0 0 ${CELL}px`,
                          textAlign: 'center',
                          fontSize: 11,
                          color: C.faint,
                          fontFamily: MONO,
                        }}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  {/* pointer row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: GAP,
                      marginTop: 8,
                      height: 24,
                    }}
                  >
                    {cells.map((_, i) => {
                      const isL = i === cur.l && hasWin
                      const isR = i === cur.r && hasWin
                      return (
                        <div
                          key={i}
                          style={{
                            flex: `0 0 ${CELL}px`,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 3,
                          }}
                        >
                          {isL && <Ptr label="L" color={C.indigo} />}
                          {isR && <Ptr label="R" color={C.rose} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* live stats */}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginTop: 26,
                }}
              >
                <Stat label="Best answer" value={cur.best} color={C.emerald} />
                <Stat label="Operations" value={cur.ops} color={C.amber} />
                <Stat
                  label="Window"
                  value={hasWin ? `[${cur.l}..${cur.r}]` : '—'}
                  color={C.indigo}
                />
              </div>
            </Panel>
          </div>

          {/* RIGHT: code + info */}
          <div
            style={{
              flex: '1 1 320px',
              minWidth: 300,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* code panel */}
            <div
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                border: `1px solid ${C.border}`,
                background: C.codeBg,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  background: C.codeHead,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#ff5f57',
                  }}
                />
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#febc2e',
                  }}
                />
                <span
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#28c840',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontFamily: MONO,
                    fontSize: 11.5,
                    color: C.muted,
                  }}
                >
                  slidingWindow.{lang === 'py' ? 'py' : 'js'}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['js', 'py'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      style={{
                        cursor: 'pointer',
                        fontFamily: MONO,
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6,
                        border: 'none',
                        color: lang === l ? '#fff' : C.faint,
                        background: lang === l ? C.pink + '33' : 'transparent',
                      }}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                  <button
                    className="swbtn"
                    onClick={copy}
                    style={{
                      cursor: 'pointer',
                      fontFamily: SANS,
                      fontSize: 10.5,
                      fontWeight: 600,
                      padding: '3px 9px',
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      color: C.muted,
                      background: 'transparent',
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div
                className="swcode"
                style={{
                  overflowX: 'auto',
                  padding: '10px 0',
                  fontFamily: MONO,
                  fontSize: 12.5,
                  lineHeight: 1.65,
                }}
              >
                {code.src.map((line, i) => {
                  const ln = i + 1
                  const active = ln === activeLine
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        padding: '0 14px',
                        background: active ? C.pink + '1c' : 'transparent',
                        borderLeft: `3px solid ${active ? C.pink : 'transparent'}`,
                        transition: 'background .2s',
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          textAlign: 'right',
                          marginRight: 14,
                          color: active ? C.pink : C.faint,
                          userSelect: 'none',
                          flex: '0 0 auto',
                        }}
                      >
                        {ln}
                      </span>
                      <span style={{ whiteSpace: 'pre' }}>
                        {tokenize(line, lang).map((tok, k) => (
                          <span
                            key={k}
                            style={{
                              color: tok.c ? C.code[tok.c] : C.code.def,
                            }}
                          >
                            {tok.t}
                          </span>
                        ))}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* what's happening */}
            <Panel title="WHAT'S HAPPENING">
              {cur.formula && (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: phaseColor,
                    marginBottom: 8,
                  }}
                >
                  {cur.formula}
                </div>
              )}
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                {cur.msg}
              </div>
            </Panel>

            {/* legend */}
            <Panel title="LEGEND">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  fontSize: 12,
                  color: C.muted,
                }}
              >
                <LegendItem color={C.amber} text="Current window (expanding)" />
                <LegendItem color={C.rose} text="Shrinking from the left" />
                <LegendItem color={C.emerald} text="Best window found" />
                <LegendItem color={C.indigo} text="L / R pointers" pointer />
              </div>
            </Panel>

            {/* all approaches */}
            <Panel title="ALL APPROACHES">
              <ApproachRow
                active={appr === 'brute'}
                name="Brute"
                t={problem.approaches.brute.time}
                s={problem.approaches.brute.space}
                onClick={() => setAppr('brute')}
              />
              <ApproachRow
                active={appr === 'slide'}
                name="Window"
                t={problem.approaches.slide.time}
                s={problem.approaches.slide.space}
                onClick={() => setAppr('slide')}
              />
            </Panel>
          </div>
        </div>

        {/* controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 16,
            padding: 14,
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
          }}
        >
          <button
            className="swbtn"
            style={btn()}
            onClick={() => {
              setStep(0)
              setPlaying(false)
            }}
          >
            ⏮ Reset
          </button>
          <button
            className="swbtn"
            style={btn()}
            onClick={() => {
              setPlaying(false)
              setStep((s) => Math.max(0, s - 1))
            }}
          >
            ← Prev
          </button>
          <button
            className="swbtn"
            style={btn({
              background: C.emerald + '1f',
              borderColor: C.emerald + '88',
              color: C.emerald,
            })}
            onClick={() => {
              if (step >= steps.length - 1) setStep(0)
              setPlaying((p) => !p)
            }}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            className="swbtn"
            style={btn()}
            onClick={() => {
              setPlaying(false)
              setStep((s) => Math.min(steps.length - 1, s + 1))
            }}
          >
            Next →
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: C.faint }}>Speed</span>
          <input
            className="swrange"
            type="range"
            min={150}
            max={1200}
            step={50}
            value={sliderVal}
            onChange={(e) => setSliderVal(+e.target.value)}
            style={{ width: 120 }}
          />
          <span
            style={{
              fontSize: 12.5,
              color: C.muted,
              fontFamily: MONO,
              minWidth: 78,
              textAlign: 'right',
            }}
          >
            Step {Math.min(step + 1, steps.length)}/{steps.length}
          </span>
        </div>

        {/* complexity cards */}
        <div
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}
        >
          <CplxCard
            title="TIME COMPLEXITY"
            big={approach.time}
            naive={problem.approaches.brute.time}
            opt={problem.approaches.slide.time}
            note={
              appr === 'slide'
                ? problem.approaches.slide.note
                : problem.approaches.brute.note
            }
          />
          <CplxCard
            title="SPACE COMPLEXITY"
            big={approach.space}
            naive={problem.approaches.brute.space}
            opt={problem.approaches.slide.space}
            note={
              appr === 'slide'
                ? 'Only a few pointers / a small set — no extra copies of the input.'
                : 'Brute force keeps recomputing but stores little; the cost is in time, not space.'
            }
          />
        </div>
      </div>
    </div>
  )
}

/* --------------------------------------------------------- tiny sub views */
function Ptr({ label, color }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'swpulse 1.4s infinite',
      }}
    >
      <span style={{ fontSize: 9, color }}>▲</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          color,
          fontFamily: 'monospace',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div
      style={{
        flex: '1 1 90px',
        background: C.panel2,
        border: `1px solid ${C.border2}`,
        borderRadius: 10,
        padding: '9px 12px',
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.faint,
          letterSpacing: 0.6,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color,
          fontFamily: 'monospace',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function LegendItem({ color, text, pointer }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      {pointer ? (
        <span
          style={{
            color,
            fontWeight: 800,
            fontSize: 12,
            fontFamily: 'monospace',
            width: 14,
            textAlign: 'center',
          }}
        >
          ▲
        </span>
      ) : (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: color + '26',
            border: `2px solid ${color}`,
          }}
        />
      )}
      {text}
    </div>
  )
}

function ApproachRow({ active, name, t, s, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '9px 11px',
        borderRadius: 9,
        cursor: 'pointer',
        marginBottom: 4,
        background: active ? C.red + '14' : 'transparent',
        borderLeft: `3px solid ${active ? C.red : 'transparent'}`,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: active ? '#fff' : C.muted,
        }}
      >
        {name}
      </span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: C.faint }}>
        T:<span style={{ color: C.amber }}>{t}</span>
        {'  '}S:<span style={{ color: C.indigo }}>{s}</span>
      </span>
    </div>
  )
}

function CplxCard({ title, big, naive, opt, note }) {
  return (
    <div
      style={{
        flex: '1 1 300px',
        minWidth: 280,
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: 1.5,
          color: C.faint,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          fontFamily: 'monospace',
          color: C.pink,
          marginBottom: 10,
        }}
      >
        {big}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12.5,
          fontFamily: 'monospace',
          marginBottom: 10,
        }}
      >
        <span style={{ color: C.red }}>naive {naive}</span>
        <span style={{ color: C.faint }}>→</span>
        <span style={{ color: C.emerald }}>optimized {opt}</span>
      </div>
      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
        {note}
      </div>
    </div>
  )
}
