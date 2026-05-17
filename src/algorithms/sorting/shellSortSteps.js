import { createStep } from '../../lib/utils'

export const shellSortSources = {
  javascript: {
    code: `function shellSort(arr) {
  const n = arr.length;
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort for this gap size.
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
}`,
    lineMap: {
      function: 1,
      outerLoop: 4,
      middleLoop: 6,
      setupTemp: 7,
      innerLoop: 9,
      compare: 9,
      shift: 10,
      insert: 12,
      complete: 15,
    },
  },
  python: {
    code: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    # Start with a big gap, then reduce the gap
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2`,
    lineMap: {
      function: 1,
      outerLoop: 5,
      middleLoop: 6,
      setupTemp: 7,
      innerLoop: 9,
      compare: 9,
      shift: 10,
      insert: 12,
      complete: 13,
    },
  },
  cpp: {
    code: `void shellSort(int arr[], int n) {
    // Start with a big gap, then reduce the gap
    for (int gap = n / 2; gap > 0; gap /= 2) {
        // Do a gapped insertion sort for this gap size.
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}`,
    lineMap: {
      function: 1,
      outerLoop: 3,
      middleLoop: 5,
      setupTemp: 6,
      innerLoop: 8,
      compare: 8,
      shift: 9,
      insert: 11,
      complete: 14,
    },
  },
  java: {
    code: `public void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}`,
    lineMap: {
      function: 1,
      outerLoop: 3,
      middleLoop: 4,
      setupTemp: 5,
      innerLoop: 7,
      compare: 7,
      shift: 8,
      insert: 10,
      complete: 13,
    },
  },
}

export function getShellSortSource(language = 'javascript') {
  const lang = language.toLowerCase()
  return shellSortSources[lang] ?? shellSortSources.javascript
}

export function resolveShellSortLine(language, lineKey) {
  if (!lineKey) return undefined
  const source = getShellSortSource(language)
  return source.lineMap[lineKey] ?? shellSortSources.javascript.lineMap[lineKey]
}

export function generateShellSortSteps(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const n = arr.length
  const sortedIndices = []

  steps.push(
    createStep({
      lineKey: 'function',
      type: 'start',
      array: arr,
      sortedIndices,
      message: 'Shell Sort starts.',
      variables: { n },
      duration: 700,
    })
  )

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(
      createStep({
        lineKey: 'outerLoop',
        type: 'outer-loop',
        array: arr,
        sortedIndices: [...sortedIndices],
        message: `Decreasing gap size to ${gap}.`,
        variables: { gap, n },
        duration: 800,
      })
    )

    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      steps.push(
        createStep({
          lineKey: 'middleLoop',
          type: 'middle-loop',
          array: arr,
          indices: [i],
          sortedIndices: [...sortedIndices],
          message: `Picking element ${temp} (at index ${i}) for gapped insertion.`,
          variables: { gap, i, temp },
          duration: 600,
        })
      )

      let j = i
      while (j >= gap) {
        steps.push(
          createStep({
            lineKey: 'compare',
            type: 'compare',
            array: arr,
            indices: [j, j - gap],
            sortedIndices: [...sortedIndices],
            message: `Compare ${temp} with element at index ${j - gap} (${arr[j - gap]}).`,
            variables: { gap, i, j, temp },
            duration: 500,
          })
        )

        if (arr[j - gap] > temp) {
          arr[j] = arr[j - gap]
          steps.push(
            createStep({
              lineKey: 'shift',
              type: 'swap',
              array: arr,
              indices: [j, j - gap],
              sortedIndices: [...sortedIndices],
              message: `${arr[j - gap]} > ${temp}, shifting ${arr[j - gap]} to the right.`,
              variables: { gap, i, j, temp },
              duration: 700,
            })
          )
          j -= gap
        } else {
          break
        }
      }

      arr[j] = temp
      steps.push(
        createStep({
          lineKey: 'insert',
          type: 'active',
          array: arr,
          indices: [j],
          sortedIndices: [...sortedIndices],
          message: `Inserting ${temp} at its correct gap-sorted position (index ${j}).`,
          variables: { gap, i, j, temp },
          duration: 800,
        })
      )
    }

    // In the last pass (gap=1), we can start marking elements as sorted
    if (gap === 1) {
      // All elements are essentially sorted after gap 1 pass
    }
  }

  steps.push(
    createStep({
      lineKey: 'complete',
      type: 'complete',
      array: arr,
      sortedIndices: Array.from({ length: n }, (_, index) => index),
      message: 'Shell Sort is complete! The array is now fully sorted.',
      variables: { n },
      duration: 900,
    })
  )

  return steps
}
