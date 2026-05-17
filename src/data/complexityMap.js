export const complexityMap = {
  dijkstra: {
    time: 'O((V + E) log V)',
    space: 'O(V)',
  },

  bellmanford: {
    time: 'O(V * E)',
    space: 'O(V)',
  },

  floydwarshall: {
    time: 'O(V^3)',
    space: 'O(V^2)',
  },

  bfs: {
    time: 'O(V + E)',
    space: 'O(V)',
  },

  dfs: {
    time: 'O(V + E)',
    space: 'O(V)',
  },

  bubble: {
    time: 'O(n²)',
    space: 'O(1)',
  },

  selection: {
    time: 'O(n²)',
    space: 'O(1)',
  },

  insertion: {
    time: 'O(n²)',
    space: 'O(1)',
  },

  quick: {
    time: 'O(n log n) avg, O(n²) worst',
    space: 'O(log n)',
  },

  merge: {
    time: 'O(n log n)',
    space: 'O(n)',
  },

  heap: {
    time: 'O(n log n)',
    space: 'O(1)',
  },

  counting: {
    time: 'O(n + k)',
    space: 'O(k)',
  },

  radix: {
    time: 'O(nk)',
    space: 'O(n + k)',
  },

  linear: {
    time: 'O(n)',
    space: 'O(1)',
  },

  binary: {
    time: 'O(log n)',
    space: 'O(1)',
  },

  shell: {
    time: 'O(n log n) - O(n²)',
    space: 'O(1)',
  },
}
