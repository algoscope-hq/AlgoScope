import { createStep } from '../../lib/utils'

export const mergeSortSources = {
  javascript: {
    code: `function mergeSort(arr, l, r) {
  if (l < r) {
    let m = Math.floor((l + r) / 2);
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
}

function merge(arr, l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = arr.slice(l, m + 1);
  let R = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i++];
    } else {
      arr[k] = R[j++];
    }
    k++;
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 10,
      setupSubarrays: 13,
      compare: 17,
      overwrite: 18,
      complete: 25,
    },
  },
  python: {
    code: `def merge_sort(arr, l, r):
    if l < r:
        m = (l + r) // 2
        merge_sort(arr, l, m)
        merge_sort(arr, m + 1, r)
        merge(arr, l, m, r)

def merge(arr, l, m, r):
    L = arr[l:m+1]
    R = arr[m+1:r+1]
    i = j = 0
    k = l
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
    while i < len(L):
        arr[k] = L[i]
        i += 1; k += 1
    while j < len(R):
        arr[k] = R[j]
        j += 1; k += 1`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 8,
      setupSubarrays: 9,
      compare: 13,
      overwrite: 14,
      complete: 24,
    },
  },
  java: {
    code: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[] = new int[n1];
    int R[] = new int[n2];
    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i++];
        } else {
            arr[k] = R[j++];
        }
        k++;
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 10,
      setupSubarrays: 15,
      compare: 19,
      overwrite: 20,
      complete: 28,
    },
  },
  cpp: {
    code: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i++];
        } else {
            arr[k] = R[j++];
        }
        k++;
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 10,
      setupSubarrays: 14,
      compare: 18,
      overwrite: 19,
      complete: 27,
    },
  },
  c: {
    code: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 10,
      setupSubarrays: 13,
      compare: 17,
      overwrite: 17,
      complete: 22,
    },
  },
  rust: {
    code: `fn merge_sort(arr: &mut [i32], l: usize, r: usize) {
    if l < r {
        let m = l + (r - l) / 2;
        merge_sort(arr, l, m);
        merge_sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

fn merge(arr: &mut [i32], l: usize, m: usize, r: usize) {
    let left_half = arr[l..=m].to_vec();
    let right_half = arr[m + 1..=r].to_vec();
    let (mut i, mut j, mut k) = (0, 0, l);
    while i < left_half.len() && j < right_half.len() {
        if left_half[i] <= right_half[j] {
            arr[k] = left_half[i];
            i += 1;
        } else {
            arr[k] = right_half[j];
            j += 1;
        }
        k += 1;
    }
    while i < left_half.len() {
        arr[k] = left_half[i];
        i += 1; k += 1;
    }
    while j < right_half.len() {
        arr[k] = right_half[j];
        j += 1; k += 1;
    }
}`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 10,
      setupSubarrays: 11,
      compare: 15,
      overwrite: 16,
      complete: 27,
    },
  },
  go: {
    code: `func mergeSort(arr []int, l, r int) {
    if l < r {
        m := l + (r-l)/2
        mergeSort(arr, l, m)
        mergeSort(arr, m+1, r)
        merge(arr, l, m, r)
    }
}

func merge(arr []int, l, m, r int) {
    n1, n2 := m-l+1, r-m
    L := make([]int, n1)
    R := make([]int, n2)
    copy(L, arr[l:m+1])
    copy(R, arr[m+1:r+1])
    i, j, k := 0, 0, l
    for i < n1 && j < n2 {
        if L[i] <= R[j] {
            arr[k] = L[i]; i++
        } else {
            arr[k] = R[j]; j++
        }
        k++
    }
    for i < n1 {
        arr[k] = L[i]; i++; k++
    }
    for j < n2 {
        arr[k] = R[j]; j++; k++
    }
}`,
    lineMap: {
      function: 1,
      recursion: 2,
      mergeCall: 6,
      mergeFunc: 10,
      setupSubarrays: 14,
      compare: 18,
      overwrite: 19,
      complete: 29,
    },
  },
}

export function getMergeSortSource(language = 'javascript') {
  return mergeSortSources[language] ?? mergeSortSources.javascript
}

export function resolveMergeSortLine(language, lineKey) {
  if (!lineKey) return undefined
  const source = getMergeSortSource(language)
  return source.lineMap[lineKey] ?? mergeSortSources.javascript.lineMap[lineKey]
}

export function generateMergeSortSteps(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const n = arr.length
  let nodeId = 0
  let recursionTree = []

  const snapshotTree = () =>
    recursionTree
      .filter((node) => node.status !== 'hidden')
      .map((node) => ({
        ...node,
      }))
  const performMergeSort = (l, r, depth = 0, parentId = null) => {
    const currentNode = {
      id: nodeId++,
      label: `mergeSort(${l}, ${r})`,
      type: 'divide',
      l,
      r,
      depth,
      parentId,
      status: 'active',
    }

    recursionTree.push(currentNode)
    steps.push(
      createStep({
        lineKey: 'recursion',
        type: 'divide',
        array: arr,
        recursionTree: snapshotTree(),
        activeNode: currentNode.id,
        indices: [l, r],
        message: `Dividing range [${l}, ${r}]`,
        variables: { l, r },
        duration: 500,
      })
    )
    steps.push(
      createStep({
        lineKey: 'recursion',
        type: 'outer-loop',
        array: arr,
        recursionTree: snapshotTree(),
        activeNode: currentNode.id,
        indices: [l, r],
        message: `Merge Sort on range [${l}, ${r}].`,
        variables: { l, r },
        duration: 500,
      })
    )

    if (l < r) {
      const m = Math.floor((l + r) / 2)
      performMergeSort(l, m, depth + 1, currentNode.id)
      performMergeSort(m + 1, r, depth + 1, currentNode.id)

      const mergeNode = {
        id: nodeId++,
        label: `merge(${l}, ${r})`,
        type: 'merge',
        l,
        r,
        depth,
        parentId: currentNode.id,
        status: 'active',
      }

      recursionTree.push(mergeNode)

      steps.push(
        createStep({
          lineKey: 'mergeCall',
          type: 'merge-phase',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: mergeNode?.id,
          indices: [l, r],
          message: `Merging [${l}, ${m}] and [${m + 1}, ${r}]`,
          variables: { l, m, r },
          duration: 600,
        })
      )
      performMerge(l, m, r, mergeNode)
      currentNode.status = 'completed'

      steps.push(
        createStep({
          lineKey: 'recursion',
          type: 'divide-complete',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: currentNode.id,
          indices: [l, r],
          message: `Completed mergeSort(${l}, ${r})`,
          variables: { l, r },
          duration: 400,
        })
      )
    } else {
      currentNode.status = 'completed'

      steps.push(
        createStep({
          lineKey: 'recursion',
          type: 'base-case',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: currentNode.id,
          indices: [l],
          message: `Base case reached at index ${l}`,
          variables: { l, r },
          duration: 300,
        })
      )
    }
  }

  const performMerge = (l, m, r, mergeNode) => {
    steps.push(
      createStep({
        lineKey: 'mergeCall',
        type: 'merge-start',
        array: arr,
        recursionTree: snapshotTree(),
        activeNode: mergeNode?.id,
        indices: [l, r],
        message: `Merging subarrays [${l}, ${m}] and [${m + 1}, ${r}].`,
        variables: { l, m, r },
        duration: 600,
      })
    )

    const L = arr.slice(l, m + 1)
    const R = arr.slice(m + 1, r + 1)

    steps.push(
      createStep({
        lineKey: 'setupSubarrays',
        type: 'setup',
        array: arr,
        recursionTree: snapshotTree(),
        activeNode: mergeNode?.id,
        indices: [l, r],
        message: `Copied subarrays into temporary storage.`,
        variables: { l, m, r, L, R },
        duration: 500,
      })
    )

    let i = 0,
      j = 0,
      k = l

    while (i < L.length && j < R.length) {
      steps.push(
        createStep({
          lineKey: 'compare',
          type: 'compare',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: mergeNode?.id,
          indices: [k, l + i, m + 1 + j],
          message: `Compare L[${i}] (${L[i]}) and R[${j}] (${R[j]}).`,
          variables: { l, m, r, i, j, k, leftVal: L[i], rightVal: R[j] },
          duration: 400,
        })
      )

      if (L[i] <= R[j]) {
        arr[k] = L[i]
        i++
      } else {
        arr[k] = R[j]
        j++
      }

      steps.push(
        createStep({
          lineKey: 'overwrite',
          type: 'insert',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: mergeNode?.id,
          indices: [k],
          message: `Overwrite index ${k} with ${arr[k]}.`,
          variables: { l, m, r, i, j, k },
          duration: 500,
        })
      )
      k++
    }

    while (i < L.length) {
      arr[k] = L[i]
      steps.push(
        createStep({
          lineKey: 'overwrite',
          type: 'insert',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: mergeNode?.id,
          indices: [k],
          message: `Copy remaining element ${L[i]} from left subarray.`,
          variables: { l, m, r, i, j, k },
          duration: 400,
        })
      )
      i++
      k++
    }

    while (j < R.length) {
      arr[k] = R[j]
      steps.push(
        createStep({
          lineKey: 'overwrite',
          type: 'insert',
          array: arr,
          recursionTree: snapshotTree(),
          activeNode: mergeNode?.id,
          indices: [k],
          message: `Copy remaining element ${R[j]} from right subarray.`,
          variables: { l, m, r, i, j, k },
          duration: 400,
        })
      )
      j++
      k++
    }
    mergeNode.status = 'completed'

    steps.push(
      createStep({
        lineKey: 'mergeCall',
        type: 'merge-complete',
        array: arr,
        recursionTree: snapshotTree(),
        activeNode: mergeNode?.id,
        indices: [l, r],
        message: `Merge completed for [${l}, ${r}]`,
        variables: { l, m, r },
        duration: 500,
      })
    )
  }

  steps.push(
    createStep({
      lineKey: 'function',
      type: 'start',
      array: arr,
      message: 'Merge Sort starts.',
      variables: { n },
      duration: 700,
    })
  )

  performMergeSort(0, n - 1)

  steps.push(
    createStep({
      lineKey: 'complete',
      type: 'complete',
      array: arr,
      recursionTree: snapshotTree(),
      activeNode: null,
      sortedIndices: Array.from({ length: n }, (_, index) => index),
      message: 'Merge Sort is complete.',
      variables: { n },
      duration: 900,
    })
  )

  return steps
}
