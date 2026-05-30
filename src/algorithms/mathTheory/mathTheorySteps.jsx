import { createStep, formatComplex } from '../../lib/utils'

// ─────────────────────────────────────────────
// EUCLIDEAN GCD  (Euclidean modulo vs naive subtraction)
// ─────────────────────────────────────────────

export function generateEuclideanGCDSteps(a, b) {
  const steps = []
  let x = a,
    y = b

  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      array: [x, y],
      message: `Start: gcd(${x}, ${y})`,
      variables: { a: x, b: y },
      duration: 700,
    })
  )

  while (y !== 0) {
    const remainder = x % y
    steps.push(
      createStep({
        lineKey: 'modulo',
        type: 'compare',
        array: [x, y],
        indices: [0, 1],
        message: `gcd(${x}, ${y}) → ${x} % ${y} = ${remainder}`,
        variables: { a: x, b: y, remainder },
        duration: 900,
      })
    )
    x = y
    y = remainder
    steps.push(
      createStep({
        lineKey: 'assign',
        type: 'swap',
        array: [x, y],
        indices: [0, 1],
        message: `→ gcd(${x}, ${y})`,
        variables: { a: x, b: y },
        duration: 700,
      })
    )
  }

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      array: [x, 0],
      message: `GCD = ${x}`,
      variables: { result: x },
      duration: 900,
    })
  )

  return steps
}

export function generateNaiveGCDSteps(a, b) {
  const steps = []
  let x = a,
    y = b

  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      array: [x, y],
      message: `Start: naive gcd(${x}, ${y}) — subtract smaller from larger`,
      variables: { a: x, b: y },
      duration: 700,
    })
  )

  while (x !== y) {
    steps.push(
      createStep({
        lineKey: 'compare',
        type: 'compare',
        array: [x, y],
        indices: [0, 1],
        message: `${x} ≠ ${y} — subtract`,
        variables: { a: x, b: y },
        duration: 500,
      })
    )
    if (x > y) {
      x -= y
    } else {
      y -= x
    }
    steps.push(
      createStep({
        lineKey: 'subtract',
        type: 'swap',
        array: [x, y],
        indices: [0, 1],
        message: `→ (${x}, ${y})`,
        variables: { a: x, b: y },
        duration: 450,
      })
    )
  }

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      array: [x, x],
      message: `GCD = ${x}`,
      variables: { result: x },
      duration: 900,
    })
  )

  return steps
}

// ─────────────────────────────────────────────
// FAST EXPONENTIATION  (binary expo vs naive)
// ─────────────────────────────────────────────

export function generateFastExpoSteps(base, exp) {
  const steps = []
  let result = 1
  let b = base
  let e = exp
  const bits = e.toString(2).split('').map(Number)

  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      array: bits,
      message: `Compute ${base}^${exp}. Binary of ${exp} = ${bits.join('')}`,
      variables: { base, exp, result, b },
      duration: 900,
    })
  )

  let bitIdx = bits.length - 1
  while (e > 0) {
    const bit = e & 1
    const currentBitPos = bitIdx

    steps.push(
      createStep({
        lineKey: 'checkBit',
        type: 'compare',
        array: bits,
        indices: [currentBitPos],
        message: `Bit ${bit}: ${bit === 1 ? `result × b → ${result} × ${b} = ${result * b}` : 'bit is 0, skip multiply'}`,
        variables: { bit, b, result, e },
        duration: 850,
      })
    )

    if (bit === 1) {
      result *= b
      steps.push(
        createStep({
          lineKey: 'multiply',
          type: 'swap',
          array: bits,
          indices: [currentBitPos],
          message: `result = ${result}`,
          variables: { bit, b, result, e },
          duration: 700,
        })
      )
    }

    b *= b
    e >>= 1
    bitIdx--

    if (e > 0) {
      steps.push(
        createStep({
          lineKey: 'square',
          type: 'inner-loop',
          array: bits,
          message: `Square base: b = ${b}`,
          variables: { b, result, e },
          duration: 650,
        })
      )
    }
  }

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      array: bits,
      message: `${base}^${exp} = ${result}`,
      variables: { result },
      duration: 900,
    })
  )

  return steps
}

export function generateNaiveExpoSteps(base, exp) {
  const steps = []
  let result = 1

  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      array: [result],
      message: `Compute ${base}^${exp} naively — multiply ${exp} times`,
      variables: { base, exp, result },
      duration: 700,
    })
  )

  for (let i = 1; i <= exp; i++) {
    result *= base
    steps.push(
      createStep({
        lineKey: 'multiply',
        type: 'compare',
        array: [result],
        indices: [0],
        message: `Step ${i}: result × ${base} = ${result}`,
        variables: { step: i, base, result },
        duration: 500,
      })
    )
  }

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      array: [result],
      message: `${base}^${exp} = ${result}`,
      variables: { result },
      duration: 900,
    })
  )

  return steps
}

// ─────────────────────────────────────────────
// BIT MANIPULATION
// ─────────────────────────────────────────────

export function generateBitOpSteps(a, b, operation) {
  const steps = []

  const toBits = (n) => {
    const bits = []
    for (let i = 7; i >= 0; i--) bits.push((n >> i) & 1)
    return bits
  }

  const bitsA = toBits(a)
  const bitsB = toBits(b)

  let result
  let opLabel
  switch (operation) {
    case 'AND':
      result = a & b
      opLabel = 'AND'
      break
    case 'OR':
      result = a | b
      opLabel = 'OR'
      break
    case 'XOR':
      result = a ^ b
      opLabel = 'XOR'
      break
    case 'NOT':
      result = ~a & 0xff
      opLabel = 'NOT'
      break
    case 'LSHIFT':
      result = (a << 1) & 0xff
      opLabel = 'LEFT SHIFT'
      break
    case 'RSHIFT':
      result = a >> 1
      opLabel = 'RIGHT SHIFT'
      break
    default:
      result = a & b
      opLabel = 'AND'
  }

  const bitsResult = toBits(result)

  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      array: bitsA,
      message: `Operation: ${a} ${opLabel} ${operation === 'NOT' || operation === 'LSHIFT' || operation === 'RSHIFT' ? '' : b}`,
      variables: { a, b, operation },
      duration: 700,
    })
  )

  for (let i = 0; i < 8; i++) {
    let msg
    if (operation === 'AND')
      msg = `Bit ${7 - i}: ${bitsA[i]} AND ${bitsB[i]} = ${bitsResult[i]}`
    else if (operation === 'OR')
      msg = `Bit ${7 - i}: ${bitsA[i]} OR ${bitsB[i]} = ${bitsResult[i]}`
    else if (operation === 'XOR')
      msg = `Bit ${7 - i}: ${bitsA[i]} XOR ${bitsB[i]} = ${bitsResult[i]}`
    else if (operation === 'NOT')
      msg = `Bit ${7 - i}: NOT ${bitsA[i]} = ${bitsResult[i]}`
    else if (operation === 'LSHIFT')
      msg = `Bit ${7 - i}: shift left → ${bitsResult[i]}`
    else msg = `Bit ${7 - i}: shift right → ${bitsResult[i]}`

    steps.push(
      createStep({
        lineKey: 'bitOp',
        type: bitsResult[i] !== bitsA[i] ? 'swap' : 'compare',
        array: bitsA,
        indices: [i],
        message: msg,
        variables: {
          bitIndex: 7 - i,
          aBit: bitsA[i],
          bBit: bitsB[i],
          resultBit: bitsResult[i],
        },
        duration: 600,
      })
    )
  }

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      array: bitsResult,
      message: `Result: ${result} (${bitsResult.join('')})`,
      variables: { result },
      duration: 900,
    })
  )

  return steps
}

// ─────────────────────────────────────────────
// SIEVE OF ERATOSTHENES
// ─────────────────────────────────────────────

export function generateSieveSteps(n) {
  const steps = []
  const isPrime = new Array(n + 1).fill(true)
  if (n >= 0) isPrime[0] = false
  if (n >= 1) isPrime[1] = false

  // Helper to extract primes found so far
  const getPrimesList = (arr) => {
    const list = []
    for (let i = 2; i < arr.length; i++) {
      if (arr[i]) list.push(i)
    }
    return list
  }

  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      array: [...isPrime],
      message: `Initialize isPrime array from 0 to ${n} with true. Mark 0 and 1 as false (not prime).`,
      variables: { i: null, j: null, primesCount: 0 },
      duration: 800,
    })
  )

  for (let i = 2; i * i <= n; i++) {
    steps.push(
      createStep({
        lineKey: 'checkPrime',
        type: 'compare',
        array: [...isPrime],
        indices: [i],
        message: `Check if ${i} is prime: ${isPrime[i] ? 'Yes, search and mark its multiples' : 'No, already marked composite'}`,
        variables: { i, j: null, primesCount: getPrimesList(isPrime).length },
        duration: 750,
      })
    )

    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false
        steps.push(
          createStep({
            lineKey: 'markFalse',
            type: 'swap',
            array: [...isPrime],
            indices: [j],
            message: `Mark multiple of ${i}: ${j} as composite (false).`,
            variables: { i, j, primesCount: getPrimesList(isPrime).length },
            duration: 600,
          })
        )
      }
    }
  }

  const finalPrimes = getPrimesList(isPrime)

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      array: [...isPrime],
      message: `Completed! Found ${finalPrimes.length} primes: [${finalPrimes.join(', ')}]`,
      variables: { i: null, j: null, primesCount: finalPrimes.length },
      duration: 1000,
    })
  )

  return steps
}

// ─────────────────────────────────────────────
// FIBONACCI SEQUENCE (Golden Spiral vs Recursion Tree)
// ─────────────────────────────────────────────

export function generateFibonacciSteps(n) {
  const steps = []

  // 1. Pre-build the entire tree structure skeleton
  const treeState = {}

  function initTree(valN, path = 'root', parentPath = null) {
    treeState[path] = {
      id: path,
      n: valN,
      val: null,
      state: 'inactive',
      parent: parentPath,
      children: [],
    }

    if (valN > 1) {
      const leftPath = path + '-L'
      const rightPath = path + '-R'
      treeState[path].children = [leftPath, rightPath]
      initTree(valN - 1, leftPath, path)
      initTree(valN - 2, rightPath, path)
    }
  }

  initTree(n)

  const getTreeSnapshot = () => {
    const snapshot = {}
    for (const key in treeState) {
      snapshot[key] = { ...treeState[key] }
    }
    return snapshot
  }

  let maxNResolved = 0

  // Start step
  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      message: `Start: Compute fib(${n})`,
      variables: { n, activeNode: null, maxNResolved: 0 },
      treeState: getTreeSnapshot(),
      activePath: null,
      spiralCount: 0,
      duration: 800,
    })
  )

  function recurse(valN, path = 'root') {
    // Set node to active
    treeState[path].state = 'active'

    steps.push(
      createStep({
        lineKey: 'baseCase',
        type: 'compare',
        message: `fib(${valN}) called. Check base case: is n <= 1?`,
        variables: { n: valN, activeNode: path, maxNResolved },
        treeState: getTreeSnapshot(),
        activePath: path,
        spiralCount: maxNResolved,
        duration: 800,
      })
    )

    if (valN <= 1) {
      treeState[path].state = 'resolved'
      treeState[path].val = valN
      maxNResolved = Math.max(maxNResolved, valN)

      steps.push(
        createStep({
          lineKey: 'returnBase',
          type: 'swap',
          message: `Base case met: fib(${valN}) = ${valN}`,
          variables: { n: valN, result: valN, activeNode: path, maxNResolved },
          treeState: getTreeSnapshot(),
          activePath: path,
          spiralCount: maxNResolved,
          duration: 700,
        })
      )
      return valN
    }

    // Recursive left call: fib(n-1)
    const leftVal = recurse(valN - 1, path + '-L')

    // Back to current node
    treeState[path].state = 'active'
    steps.push(
      createStep({
        lineKey: 'recursiveCall',
        type: 'compare',
        message: `Returned fib(${valN - 1}) = ${leftVal}. Now call fib(${valN - 2})`,
        variables: { n: valN, leftVal, activeNode: path, maxNResolved },
        treeState: getTreeSnapshot(),
        activePath: path,
        spiralCount: maxNResolved,
        duration: 800,
      })
    )

    // Recursive right call: fib(n-2)
    const rightVal = recurse(valN - 2, path + '-R')

    // Combine results
    const result = leftVal + rightVal
    treeState[path].state = 'resolved'
    treeState[path].val = result
    maxNResolved = Math.max(maxNResolved, valN)

    steps.push(
      createStep({
        lineKey: 'recursiveCall',
        type: 'swap',
        message: `Combine: fib(${valN}) = fib(${valN - 1}) + fib(${valN - 2}) = ${leftVal} + ${rightVal} = ${result}`,
        variables: {
          n: valN,
          leftVal,
          rightVal,
          result,
          activeNode: path,
          maxNResolved,
        },
        treeState: getTreeSnapshot(),
        activePath: path,
        spiralCount: maxNResolved,
        duration: 950,
      })
    )

    return result
  }

  const finalResult = recurse(n)

  // Final step
  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      message: `Completed! fib(${n}) = ${finalResult}`,
      variables: { n, result: finalResult, activeNode: null, maxNResolved },
      treeState: getTreeSnapshot(),
      activePath: null,
      spiralCount: maxNResolved,
      duration: 1000,
    })
  )

  return steps
}

// FAST FOURIER TRANSFORM  (Cooley-Tukey DFT vs FFT)

//helpers

function toPolar(re, im) {
  const mag = Math.sqrt(re * re + im * im)
  const phase = Math.atan2(im, re)
  return { mag: +mag.toFixed(3), phase: +phase.toFixed(3) }
}

// Bit-reverse permutation
function bitReverse(arr) {
  const n = arr.length
  const bits = Math.log2(n)
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    let rev = 0
    let tmp = i
    for (let b = 0; b < bits; b++) {
      rev = (rev << 1) | (tmp & 1)
      tmp >>= 1
    }
    out[rev] = arr[i]
  }
  return out
}

// Signal generator for FFT presets
export function generateSignal(n, type) {
  switch (type) {
    case 'sine':
      return Array.from(
        { length: n },
        (_, i) => +Math.sin((2 * Math.PI * i) / n).toFixed(4)
      )
    case 'cosine':
      return Array.from(
        { length: n },
        (_, i) => +Math.cos((2 * Math.PI * i) / n).toFixed(4)
      )
    case 'impulse':
      return Array.from({ length: n }, (_, i) => (i === 0 ? 1 : 0))
    case 'square':
      return Array.from({ length: n }, (_, i) => (i < n / 2 ? 1 : -1))
    case 'ramp':
      return Array.from({ length: n }, (_, i) => i + 1)
    case 'noise':
      return Array.from(
        { length: n },
        () => +(Math.random() * 2 - 1).toFixed(4)
      )
    default:
      return Array.from({ length: n }, (_, i) => i + 1)
  }
}

// generateFFTSteps
// input: number[]  (real-valued signal, length must be power of 2, 4–16)

export function generateFFTSteps(inputSignal) {
  const steps = []
  const n = inputSignal.length

  // Clamp / pad to nearest power of 2 between 4 and 16
  const validN = [4, 8, 16].find((p) => p >= n) ?? 16
  const signal = [...inputSignal]
  while (signal.length < validN) signal.push(0)
  const finalSignal = signal.slice(0, validN)

  const totalStages = Math.log2(validN)
  const naiveTotalOps = validN * validN
  let fftOps = 0

  // Build initial node array (complex: im = 0 for real input)
  const makeNodes = (arr, state = 'idle') =>
    arr.map((v, i) => ({
      index: i,
      re: +(typeof v === 'object' ? v.re : v).toFixed(3),
      im: +(typeof v === 'object' ? v.im : 0).toFixed(3),
      state,
    }))

  // ── Step 0: start ─────────────────────────
  steps.push(
    createStep({
      lineKey: 'start',
      type: 'start',
      stage: 0,
      nodes: makeNodes(finalSignal, 'idle'),
      butterflies: [],
      naiveOps: naiveTotalOps,
      fftOps: 0,
      message: `Input signal x[n] of length ${validN}. DFT naively needs ${naiveTotalOps} ops. FFT will use only ${validN * totalStages} ops.`,
      variables: {
        n: validN,
        stage: 0,
        totalStages,
        naiveOps: naiveTotalOps,
        fftOps: 0,
      },
      duration: 1000,
    })
  )

  // ── Step 1: bit-reverse permutation ──────
  const permuted = bitReverse(finalSignal)
  steps.push(
    createStep({
      lineKey: 'bitReverse',
      type: 'compare',
      stage: 0,
      nodes: makeNodes(permuted, 'active'),
      butterflies: [],
      naiveOps: naiveTotalOps,
      fftOps,
      message: `Bit-reverse permutation: reorder indices so recursive halves are contiguous. x = [${permuted.join(', ')}]`,
      variables: {
        n: validN,
        stage: 0,
        totalStages,
        naiveOps: naiveTotalOps,
        fftOps,
      },
      duration: 900,
    })
  )

  // Working buffer of complex numbers
  let buf = permuted.map((v) => ({ re: v, im: 0 }))

  // ── Steps 2+: butterfly stages ───────────
  for (let s = 1; s <= totalStages; s++) {
    const half = 1 << (s - 1) // half = 2^(s-1)
    const full = 1 << s // full = 2^s

    // Announce stage
    steps.push(
      createStep({
        lineKey: 'stageLoop',
        type: 'compare',
        stage: s,
        nodes: makeNodes(buf, 'idle'),
        butterflies: [],
        naiveOps: naiveTotalOps,
        fftOps,
        message: `Stage ${s} of ${totalStages}: merge ${validN / full} group(s) of size ${full} using ${half}-point twiddle factors.`,
        variables: {
          n: validN,
          stage: s,
          totalStages,
          naiveOps: naiveTotalOps,
          fftOps,
        },
        duration: 800,
      })
    )

    // Process each group
    for (let k = 0; k < validN; k += full) {
      for (let j = 0; j < half; j++) {
        const topIdx = k + j
        const botIdx = k + j + half

        // Twiddle factor: W = e^(-2πi·j/full) = cos(…) - i·sin(…)
        const angle = (-2 * Math.PI * j) / full
        const twRe = Math.cos(angle)
        const twIm = Math.sin(angle)

        // Show which butterfly is being computed
        const nodesSnapshot = makeNodes(buf, 'idle')
        nodesSnapshot[topIdx] = { ...nodesSnapshot[topIdx], state: 'active' }
        nodesSnapshot[botIdx] = { ...nodesSnapshot[botIdx], state: 'computing' }

        steps.push(
          createStep({
            lineKey: 'butterfly',
            type: 'compare',
            stage: s,
            nodes: nodesSnapshot,
            butterflies: [
              {
                top: topIdx,
                bot: botIdx,
                twiddleRe: +twRe.toFixed(3),
                twiddleIm: +twIm.toFixed(3),
              },
            ],
            naiveOps: naiveTotalOps,
            fftOps,
            message: `Butterfly (${topIdx}, ${botIdx}): W = ${formatComplex(twRe, twIm)} · X[${botIdx}]`,
            variables: {
              n: validN,
              stage: s,
              topIdx,
              botIdx,
              totalStages,
              naiveOps: naiveTotalOps,
              fftOps,
            },
            duration: 700,
          })
        )

        // Apply butterfly
        const tRe = twRe * buf[botIdx].re - twIm * buf[botIdx].im
        const tIm = twRe * buf[botIdx].im + twIm * buf[botIdx].re

        const newTopRe = buf[topIdx].re + tRe
        const newTopIm = buf[topIdx].im + tIm
        const newBotRe = buf[topIdx].re - tRe
        const newBotIm = buf[topIdx].im - tIm

        buf[topIdx] = { re: newTopRe, im: newTopIm }
        buf[botIdx] = { re: newBotRe, im: newBotIm }
        fftOps += 2

        // Show result of butterfly
        const afterNodes = makeNodes(buf, 'idle')
        afterNodes[topIdx] = { ...afterNodes[topIdx], state: 'done' }
        afterNodes[botIdx] = { ...afterNodes[botIdx], state: 'done' }

        steps.push(
          createStep({
            lineKey: 'butterflyResult',
            type: 'swap',
            stage: s,
            nodes: afterNodes,
            butterflies: [],
            naiveOps: naiveTotalOps,
            fftOps,
            message: `X[${topIdx}] = ${formatComplex(newTopRe, newTopIm)},  X[${botIdx}] = ${formatComplex(newBotRe, newBotIm)}`,
            variables: {
              n: validN,
              stage: s,
              topIdx,
              botIdx,
              totalStages,
              naiveOps: naiveTotalOps,
              fftOps,
            },
            duration: 650,
          })
        )
      }
    }
  }

  // ── Final step ────────────────────────────
  const output = buf.map((c, i) => ({
    index: i,
    ...toPolar(c.re, c.im),
    re: +c.re.toFixed(2),
    im: +c.im.toFixed(2),
    state: 'done',
  }))

  steps.push(
    createStep({
      lineKey: 'result',
      type: 'complete',
      stage: totalStages,
      nodes: output,
      butterflies: [],
      naiveOps: naiveTotalOps,
      fftOps,
      message: `FFT complete! ${fftOps} ops vs ${naiveTotalOps} for naive DFT. Speedup: ${(naiveTotalOps / fftOps).toFixed(1)}×`,
      variables: {
        n: validN,
        stage: totalStages,
        totalStages,
        naiveOps: naiveTotalOps,
        fftOps,
        speedup: +(naiveTotalOps / fftOps).toFixed(1),
      },
      duration: 1200,
    })
  )

  return steps
}
