// Helper to create unique IDs for internal nodes
let internalIdCounter = 0

const createStep = ({
  lineKey,
  type,
  forest,
  picked = [],
  newParentId = null,
  freqTable = [],
  codes = {},
  message = '',
  variables = {},
  duration = 1000,
}) => ({
  lineKey,
  type,
  forest: structuredClone(forest),
  picked,
  newParentId,
  freqTable,
  codes,
  message,
  variables,
  duration,
})

// Helper to assign binary codes to leaf nodes by traversing the final tree
function assignCodes(node, currentCode, codesObj) {
  if (!node) return
  if (node.char !== null) {
    node.code = currentCode
    codesObj[node.char] = currentCode
    return
  }
  if (node.left) {
    node.left.bit = '0'
    assignCodes(node.left, currentCode + '0', codesObj)
  }
  if (node.right) {
    node.right.bit = '1'
    assignCodes(node.right, currentCode + '1', codesObj)
  }
}

export function generateHuffmanSteps(text) {
  const steps = []
  internalIdCounter = 0

  if (!text || text.trim() === '') {
    return [
      createStep({
        lineKey: 'init',
        type: 'start',
        forest: [],
        message: 'Please provide a non-empty string input.',
        duration: 800,
      }),
    ]
  }

  // Step 1: Calculate character frequencies
  steps.push(
    createStep({
      lineKey: 'init',
      type: 'start',
      forest: [],
      message: `Analyzing input text: "${text}". Starting Huffman Coding.`,
      variables: { textLength: text.length },
      duration: 1000,
    })
  )

  const freq = {}
  for (let char of text) {
    freq[char] = (freq[char] || 0) + 1
  }

  const freqTable = Object.keys(freq)
    .map((char) => ({ char, freq: freq[char] }))
    .sort((a, b) => b.freq - a.freq || a.char.localeCompare(b.char))

  steps.push(
    createStep({
      lineKey: 'freq',
      type: 'freq-table',
      forest: [],
      freqTable,
      message: 'Calculated character frequencies from the input text.',
      variables: { uniqueChars: freqTable.length },
      duration: 1200,
    })
  )

  // Step 2: Initialize priority queue
  let forest = Object.keys(freq).map((char) => ({
    id: `leaf_${char}`,
    char,
    freq: freq[char],
    left: null,
    right: null,
    bit: '',
  }))

  // Sort initially
  forest.sort((a, b) => a.freq - b.freq || a.char.localeCompare(b.char))

  steps.push(
    createStep({
      lineKey: 'pq',
      type: 'init-nodes',
      forest,
      freqTable,
      message:
        'Created initial leaf nodes. Sorting them in the priority queue.',
      variables: { forestSize: forest.length },
      duration: 1200,
    })
  )

  // Special case: Single unique character
  if (forest.length === 1) {
    const root = forest[0]
    const codes = {}
    root.bit = '0'
    root.code = '0'
    codes[root.char] = '0'

    steps.push(
      createStep({
        lineKey: 'finish',
        type: 'complete',
        forest: [root],
        freqTable,
        codes,
        message: 'Only one unique character found. Trivial tree created.',
        variables: { forestSize: 1 },
        duration: 1500,
      })
    )
    return steps
  }

  // Step 3: Repeatedly merge nodes
  while (forest.length > 1) {
    steps.push(
      createStep({
        lineKey: 'loop',
        type: 'loop-start',
        forest,
        freqTable,
        message: `Current forest size is ${forest.length}. We need to merge until only 1 root remains.`,
        variables: { forestSize: forest.length },
        duration: 800,
      })
    )

    // Sort priority queue
    forest.sort((a, b) => {
      if (a.freq !== b.freq) return a.freq - b.freq
      const valA = a.char || ''
      const valB = b.char || ''
      return valA.localeCompare(valB)
    })

    steps.push(
      createStep({
        lineKey: 'sort',
        type: 'sort-pq',
        forest,
        freqTable,
        message: 'Sorted priority queue by frequency ascending.',
        variables: { forestSize: forest.length },
        duration: 800,
      })
    )

    // Pick two lowest
    const left = forest[0]
    const right = forest[1]

    steps.push(
      createStep({
        lineKey: 'pick',
        type: 'pick-two',
        forest,
        picked: [left.id, right.id],
        freqTable,
        message: `Picked two nodes with lowest frequencies: Node "${left.char || 'internal'}" (${left.freq}) and Node "${right.char || 'internal'}" (${right.freq}).`,
        variables: { left: left.freq, right: right.freq },
        duration: 1200,
      })
    )

    // Merge them
    forest.splice(0, 2) // remove left and right from forest

    const parentId = `internal_${internalIdCounter++}`
    left.bit = '0'
    right.bit = '1'

    const parent = {
      id: parentId,
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
      bit: '',
    }

    forest.push(parent)

    steps.push(
      createStep({
        lineKey: 'merge',
        type: 'merge-nodes',
        forest,
        picked: [left.id, right.id],
        newParentId: parentId,
        freqTable,
        message: `Merged nodes into parent with sum frequency = ${parent.freq}. Left child assigned bit 0, right assigned 1.`,
        variables: { mergedFreq: parent.freq },
        duration: 1200,
      })
    )

    // Stage re-insertion and sort for loop repeat
    forest.sort((a, b) => a.freq - b.freq)

    steps.push(
      createStep({
        lineKey: 'push',
        type: 're-insert',
        forest,
        newParentId: parentId,
        freqTable,
        message: `Inserted merged node back into priority queue.`,
        variables: { forestSize: forest.length },
        duration: 1000,
      })
    )
  }

  // Tree is complete. Generate final prefix codes
  const finalRoot = forest[0]
  const codes = {}
  assignCodes(finalRoot, '', codes)

  steps.push(
    createStep({
      lineKey: 'finish',
      type: 'complete',
      forest: [finalRoot],
      freqTable,
      codes,
      message:
        'Huffman tree construction complete. Traversed tree to generate optimal binary codes.',
      variables: { uniqueCharsCount: Object.keys(codes).length },
      duration: 1800,
    })
  )

  return steps
}
