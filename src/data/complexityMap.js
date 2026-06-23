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
  hanoi: {
    best: 'O(2^N)',
    average: 'O(2^N)',
    worst: 'O(2^N)',
    space: 'O(N)',
  },
  graphcoloring: {
    best: 'O(k^V)',
    average: 'O(k^V)',
    worst: 'O(k^V)',
    space: 'O(V)',
  },
  gcd: {
    best: 'O(log min(a, b))',
    average: 'O(log min(a, b))',
    worst: 'O(log min(a, b))',
    space: 'O(1)',
  },
  fastexpo: {
    best: 'O(log exp)',
    average: 'O(log exp)',
    worst: 'O(log exp)',
    space: 'O(1)',
  },
  bitmanip: {
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(1)',
    space: 'O(1)',
  },
  sieve: {
    best: 'O(N log log N)',
    average: 'O(N log log N)',
    worst: 'O(N log log N)',
    space: 'O(N)',
  },

  prim: {
    best: 'O((E + V) log E)',
    average: 'O((E + V) log E)',
    worst: 'O((E + V) log E)',
    space: 'O(V)',
  },

  kruskal: {
    best: 'O(E log E)',
    average: 'O(E log E)',
    worst: 'O(E log E)',
    space: 'O(V + E)',
  },
  fibonacci: {
    best: 'O(2^N)',
    average: 'O(2^N)',
    worst: 'O(2^N)',
    space: 'O(N)',
  },
  kmp: {
    best: 'O(n + m)',
    average: 'O(n + m)',
    worst: 'O(n + m)',
    space: 'O(m)',
  },

  rabinkarp: {
    best: 'O(n + m)',
    average: 'O(n + m)',
    worst: 'O(n * m)',
    space: 'O(1)',
  },

  zalgorithm: {
    best: 'O(n + m)',
    average: 'O(n + m)',
    worst: 'O(n + m)',
    space: 'O(n + m)',
  },
  histogram: {
    best: 'O(N)',
    average: 'O(N)',
    worst: 'O(N)',
    space: 'O(N)',
  },
  matrix: {
    best: 'O(R * C)',
    average: 'O(R * C)',
    worst: 'O(R * C)',
    space: 'O(C)',
  },
}
