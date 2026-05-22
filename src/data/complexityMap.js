export const complexityMap = {
  dijkstra: {
    best: 'O((V + E) log V)',
    average: 'O((V + E) log V)',
    worst: 'O((V + E) log V)',
    space: 'O(V)',
  },

  bellmanford: {
    best: 'O(V * E)',
    average: 'O(V * E)',
    worst: 'O(V * E)',
    space: 'O(V)',
  },

  floydwarshall: {
    best: 'O(V³)',
    average: 'O(V³)',
    worst: 'O(V³)',
    space: 'O(V²)',
  },

  bfs: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V)',
  },

  dfs: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V)',
  },

  bubble: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
  },

  selection: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
  },

  insertion: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
  },

  quick: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
  },

  merge: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
  },

  heap: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
  },

  counting: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)',
    space: 'O(k)',
  },

  radix: {
    best: 'O(nk)',
    average: 'O(nk)',
    worst: 'O(nk)',
    space: 'O(n + k)',
  },

  linear: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
  },

  binary: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
  },

  shell: {
    best: 'O(n log n)',
    average: 'O(n log² n)',
    worst: 'O(n²)',
    space: 'O(1)',
  },
  nqueens: {
    best: 'O(N!)',
    average: 'O(N!)',
    worst: 'O(N!)',
    space: 'O(N²)',
  },

  sudoku: {
    best: 'O(1)',
    average: 'O(9^M)',
    worst: 'O(9^M)',
    space: 'O(M)',
  },
}
