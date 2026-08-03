import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'AlgoScope'
const SITE_URL = 'https://algo-scope-virid.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`
const DEFAULT_TITLE = 'AlgoScope | Interactive Algorithm Visualizer'
const DEFAULT_DESCRIPTION =
  'Visualize algorithms in real-time with interactive animations, synchronized code highlighting, and educational tools.'

const pageMetadata = {
  '/': {
    title: 'AlgoScope | Interactive Algorithm & Data Structure Visualizer',
    description:
      'Visualize algorithms and data structures in real-time with step-by-step animations, synchronized code execution, speed controls, and interactive learning tools.',
  },
  '/sort': {
    title: 'Sorting Algorithms Visualizer | AlgoScope',
    description:
      'Explore sorting algorithms with interactive animations, step playback, and synchronized code views for Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, and Shell sort.',
  },
  '/search': {
    title: 'Graph Traversal & Search Visualizer (BFS & DFS) | AlgoScope',
    description:
      'Learn BFS (Breadth-First Search) and DFS (Depth-First Search) visually with animated graph node exploration and synchronized code execution steps.',
  },
  '/spath': {
    title: 'Shortest Path & MST Algorithms Visualizer | AlgoScope',
    description:
      "Visualize Dijkstra, Bellman-Ford, Floyd-Warshall, A* Search, Prim's, and Kruskal's algorithms on interactive graph grids in real-time.",
  },
  '/ldssearch': {
    title: 'Array Search Visualizer (Linear & Binary Search) | AlgoScope',
    description:
      'Compare Linear Search and Binary Search on sorted and unsorted arrays with real-time animations, index pointers, and synchronized code steps.',
  },
  '/adt': {
    title: 'Data Structures Explorer & Visualizer | AlgoScope',
    description:
      'Understand Abstract Data Types visually with interactive views for Stacks, Queues, Binary Trees, Binary Heaps, Priority Queues, DSU, and Linked Lists.',
  },
  '/practice': {
    title: 'Interactive Algorithm Code Sandbox | AlgoScope',
    description:
      'Practice algorithms directly in your browser with a multi-language Monaco code editor, test cases, and instant feedback inside AlgoScope.',
  },
  '/kadane': {
    title: "Kadane's Algorithm Visualizer (Max Subarray Sum) | AlgoScope",
    description:
      "Visualize Kadane's algorithm step-by-step to understand maximum subarray sums with interactive array animations and synchronized code execution.",
  },
  '/moore-voting': {
    title: "Moore's Voting Algorithm Visualizer (Majority Element) | AlgoScope",
    description:
      "Visualize Moore's voting algorithm step-by-step to understand how it identifies the majority element in an array with interactive animations and O(1) space complexity.",
  },
  '/about': {
    title: 'About AlgoScope | Interactive Algorithm Learning Platform',
    description:
      'Learn about AlgoScope, its mission to make computer science intuitive, and the interactive features built to visualize complex algorithms.',
  },
  '/challenge': {
    title: 'Guess the Algorithm Challenge | AlgoScope',
    description:
      'Test your algorithm recognition skills! Watch real-time execution animations and guess which sorting or searching algorithm is running.',
  },
  '/math-theory': {
    title: 'Math & Algorithm Complexity Theory | AlgoScope',
    description:
      'Explore the mathematical foundations behind algorithms. Learn complexity theory, proofs, FFT, Fibonacci sequences, and core math concepts.',
  },
  '/string-algorithms': {
    title: 'String Matching Algorithms Visualizer | AlgoScope',
    description:
      'Visualize string matching algorithms step-by-step. Master KMP (Knuth-Morris-Pratt), Rabin-Karp, Z-Algorithm, Naive Search, and Trie structures.',
  },
  '/dynamic-programming': {
    title:
      'Dynamic Programming Visualizer (Memoization & Tabulation) | AlgoScope',
    description:
      'Learn Dynamic Programming interactively. Visualize 1D and 2D DP grids, recursion tree pruning, memoization tables, and space optimization.',
  },
  '/backtracking': {
    title: 'Backtracking Algorithms Visualizer | AlgoScope',
    description:
      'Understand recursive backtracking algorithms with interactive visualizations. Explore N-Queens, Sudoku Solver, Maze Pathfinding, and Knight Tour decision trees.',
  },
  '/dp-journey': {
    title: 'DP Optimization Journey | AlgoScope',
    description:
      'Follow step-by-step dynamic programming optimizations. See how algorithms evolve from exponential brute-force recursion to optimal O(n) space DP.',
  },
  '/sliding-window': {
    title: 'Sliding Window Pattern Visualizer | AlgoScope',
    description:
      'Visualize fixed and variable length sliding window techniques on arrays and strings. Master Max Subarray Sum, Longest Substring, and Window problems.',
  },
  '/two-pointer': {
    title: 'Two Pointer Technique Visualizer | AlgoScope',
    description:
      'Watch two pointers converge in real time. Learn Two Sum (Sorted), Container With Most Water, Valid Palindrome, and Trapping Rain Water in O(n) time.',
  },
  '/monotonic-stack': {
    title: 'Monotonic Stack & Queue Visualizer | AlgoScope',
    description:
      'Learn monotonic stacks and queues step-by-step. Visualize Next Greater Element, Daily Temperatures, and Largest Rectangle in Histogram.',
  },
  '/operating-systems': {
    title: 'Operating Systems Visualizers & Concepts | AlgoScope',
    description:
      'Learn core Operating System concepts visually: CPU Scheduling algorithms, Memory Page Replacement policies, and Disk Head Scheduling.',
  },
  '/operating-systems/cpu-scheduling': {
    title: 'CPU Scheduling Algorithms Visualizer | AlgoScope',
    description:
      'Visualize FCFS, Shortest Job First (SJF), Round Robin (RR), and Priority CPU Scheduling with Gantt charts, waiting times, and turnaround metrics.',
  },
  '/operating-systems/page-replacement': {
    title: 'Page Replacement Algorithms Visualizer | AlgoScope',
    description:
      'Visualize FIFO, Least Recently Used (LRU), and Optimal Page Replacement memory management policies with frame tables and page fault counters.',
  },
  '/operating-systems/disk-scheduling': {
    title: 'Disk Scheduling Algorithms Visualizer | AlgoScope',
    description:
      'Visualize FCFS, SSTF, SCAN (Elevator), C-SCAN, and LOOK disk head scheduling algorithms with track movement paths and seek counts.',
  },
  '/concepts': {
    title: 'Algorithm Concepts & Problem Solving Patterns | AlgoScope',
    description:
      'Overview of essential computer science algorithms, data structures, complexity classes, and algorithmic problem-solving patterns.',
  },
  '/favorites': {
    title: 'Your Bookmarked Algorithm Visualizations | AlgoScope',
    description:
      'Access your saved and bookmarked algorithm visualizers, data structures, and learning paths on AlgoScope.',
  },
}

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, selector.match(/"([^"]+)"/)?.[1] ?? '')
    document.head.appendChild(element)
  }

  element.setAttribute('content', value)
}

function setLink(selector, rel, href) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function formatLabel(str) {
  if (!str) return ''
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function SeoHead() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(search)
    const algo = searchParams.get('algo')
    const type = searchParams.get('type')
    const problem = searchParams.get('problem')
    const mode = searchParams.get('mode')

    const baseMetadata = pageMetadata[pathname] ?? {
      title: 'Page Not Found | AlgoScope',
      description:
        'The requested AlgoScope page could not be found. Explore algorithm visualizations, code walkthroughs, and learning tools from the homepage.',
      noIndex: true,
    }

    let { title, description } = baseMetadata

    // Comparison Mode logic across all visualizers
    if (mode === 'compare') {
      if (pathname === '/sort') {
        title = 'Sorting Algorithms Comparison | AlgoScope'
        description =
          'Compare multiple sorting algorithms side-by-side. Analyze performance metrics, comparisons, and swaps in real-time to find the most efficient sort.'
      } else if (pathname === '/search') {
        title = 'Graph Search Comparison (BFS vs DFS) | AlgoScope'
        description =
          'See the difference between Breadth-First Search and Depth-First Search. Compare traversal order and node exploration patterns in real-time.'
      } else if (pathname === '/spath') {
        title = 'Shortest Path Algorithms Comparison | AlgoScope'
        description =
          'Compare Dijkstra, Bellman-Ford, and Floyd-Warshall side-by-side. Watch how different algorithms find the most efficient route through a graph.'
      } else if (pathname === '/ldssearch') {
        title = 'Linear vs Binary Search Comparison | AlgoScope'
        description =
          'Visualize the performance gap between Linear and Binary search. Compare step counts and search patterns on arrays in real-time.'
      } else if (pathname === '/adt') {
        const formattedType = type ? formatLabel(type) : 'Data Structure'
        title = `${formattedType} Operations Comparison | AlgoScope`
        description = `Compare different operations and implementation patterns for ${formattedType} data structures side-by-side.`
      } else if (pathname === '/backtracking') {
        title = 'Backtracking Algorithms Comparison | AlgoScope'
        description =
          'Compare decision tree exploration and pruning speed across N-Queens, Sudoku, Maze, and Knight Tour algorithms.'
      } else if (pathname === '/string-algorithms') {
        title = 'String Matching Algorithms Comparison | AlgoScope'
        description =
          'Compare KMP, Rabin-Karp, Z-Algorithm, and Naive pattern matching side-by-side on custom text strings.'
      }
    }
    // Deep links via ?problem=... or ?algo=... or ?type=...
    const problemKey = (problem || algo || '').toLowerCase()

    if (pathname === '/dynamic-programming') {
      if (problemKey === 'lcs') {
        title = 'Longest Common Subsequence (LCS) Visualizer | AlgoScope'
        description =
          'Learn the Longest Common Subsequence (LCS) algorithm visually in dynamic programming. Understand 2D DP table construction, character match transitions, and path traceback.'
      } else if (problemKey === 'knapsack') {
        title =
          '0/1 Knapsack Problem Visualizer (Dynamic Programming) | AlgoScope'
        description =
          'Master the 0/1 Knapsack problem step-by-step. Visualize weight vs capacity dynamic programming grids, item inclusion/exclusion decisions, and optimal value maximization.'
      } else if (problemKey === 'coin-change' || problemKey === 'coinchange') {
        title =
          'Coin Change Problem Visualizer (Dynamic Programming) | AlgoScope'
        description =
          'Visualize the Coin Change algorithm with 1D dynamic programming arrays. Track min coin combinations, subproblem optimal substructure, and step-by-step state transitions.'
      } else if (problemKey === 'lis') {
        title = 'Longest Increasing Subsequence (LIS) Visualizer | AlgoScope'
        description =
          'Understand Longest Increasing Subsequence (LIS) with dynamic array animations. Compare element indices, DP array values, and optimal sub-sequence extensions.'
      }
    } else if (pathname === '/dp-journey') {
      const approach = searchParams.get('approach')
      const approachText = approach
        ? ` (${formatLabel(approach)} approach)`
        : ''
      if (problemKey === 'fibonacci') {
        title = `Fibonacci DP Optimization${approachText} | AlgoScope`
        description =
          'Trace Fibonacci sequence optimizations step-by-step: Exponential O(2^n) recursion tree vs O(n) memoization, DP tabulation, and O(1) space optimization.'
      } else if (
        problemKey === 'climbingstairs' ||
        problemKey === 'climbing-stairs'
      ) {
        title = `Climbing Stairs DP Visualizer${approachText} | AlgoScope`
        description =
          'Solve the Climbing Stairs problem using Dynamic Programming. Visualize step combinations, recurrence relations, and space-optimized Fibonacci-like states.'
      } else if (
        problemKey === 'houserobber' ||
        problemKey === 'house-robber'
      ) {
        title = `House Robber DP Visualizer${approachText} | AlgoScope`
        description =
          'Visualize the House Robber problem step-by-step. Learn dynamic decision making between robbing current house vs skipping adjacent houses for maximum profit.'
      } else if (problemKey === 'coinchange' || problemKey === 'coin-change') {
        title = `Coin Change DP Optimization${approachText} | AlgoScope`
        description =
          'Watch Coin Change algorithm optimization journey from recursive brute force to top-down memoization and bottom-up DP tabulation.'
      }
    } else if (pathname === '/sliding-window') {
      const approach = searchParams.get('approach')
      const approachText =
        approach === 'brute' ? ' (Brute Force)' : ' (Sliding Window)'
      if (problemKey === 'maxsum' || problemKey === 'maxsubarray') {
        title = `Max Sum Subarray of Size K${approachText} | AlgoScope`
        description =
          'Visualize Maximum Sum Subarray of fixed size K. See window expansion, element addition/subtraction, and O(n) linear sliding window performance.'
      } else if (
        problemKey === 'longestsubstr' ||
        problemKey === 'longestsubstring'
      ) {
        title = `Longest Substring Without Repeating Characters${approachText} | AlgoScope`
        description =
          'Master Longest Substring Without Repeating Characters visually. Track expanding right pointer, contracting left pointer, and character set frequency.'
      } else if (problemKey === 'minlen' || problemKey === 'minsubarraylen') {
        title = `Minimum Size Subarray Sum${approachText} | AlgoScope`
        description =
          'Visualize Minimum Size Subarray Sum >= S. Learn variable-length sliding windows, pointer contraction, and target sum evaluation.'
      } else if (problemKey === 'maxvowels') {
        title = `Max Vowels in Substring of Length K${approachText} | AlgoScope`
        description =
          'Visualize Maximum Vowels in Substring of size K using sliding window. Track vowel count updates in O(n) time.'
      }
    } else if (pathname === '/two-pointer') {
      if (
        problemKey === 'twosum' ||
        problemKey === 'two_sum' ||
        problemKey === 'two-sum'
      ) {
        title = 'Two Sum (Sorted Array) Two Pointer Visualizer | AlgoScope'
        description =
          'Solve Two Sum on sorted arrays using two converging pointers. Watch L and R pointers adjust based on target sum in O(n) time and O(1) space.'
      } else if (problemKey === 'container') {
        title = 'Container With Most Water Visualizer | AlgoScope'
        description =
          'Visualize Container With Most Water using two pointers. Learn greedy pointer movement based on height bounds to maximize area.'
      } else if (problemKey === 'palindrome') {
        title = 'Valid Palindrome Two Pointer Visualizer | AlgoScope'
        description =
          'Check if an array or string is a Valid Palindrome step-by-step. Watch inward moving left and right pointers compare characters.'
      } else if (problemKey === 'trapping') {
        title = 'Trapping Rain Water Two Pointer Visualizer | AlgoScope'
        description =
          'Master Trapping Rain Water with two pointers. Track left max and right max elevation boundaries to compute trapped water volume in O(n) time.'
      }
    } else if (pathname === '/monotonic-stack') {
      if (problemKey === 'histogram') {
        title = 'Largest Rectangle in Histogram (Monotonic Stack) | AlgoScope'
        description =
          'Visualize Largest Rectangle in Histogram using a monotonic stack. See bar height comparisons, stack push/pop operations, and max area calculation.'
      } else if (
        problemKey === 'nextgreater' ||
        problemKey === 'next_greater' ||
        problemKey === 'next-greater'
      ) {
        title = 'Next Greater Element (Monotonic Stack) | AlgoScope'
        description =
          'Master Next Greater Element algorithm step-by-step using a monotonic decreasing stack. See element traversal and answer array updates.'
      } else if (
        problemKey === 'dailytemp' ||
        problemKey === 'daily_temp' ||
        problemKey === 'daily-temp'
      ) {
        title = 'Daily Temperatures (Monotonic Stack) | AlgoScope'
        description =
          'Solve Daily Temperatures problem visually. Track index differences and monotonic stack state for waiting days calculation.'
      } else if (
        problemKey === 'maximalrectangle' ||
        problemKey === 'maximal_rectangle' ||
        problemKey === 'maximal-rectangle'
      ) {
        title = 'Maximal Rectangle in Binary Matrix | AlgoScope'
        description =
          'Visualize Maximal Rectangle in a binary matrix. Learn row-by-row histogram reduction and monotonic stack evaluation.'
      }
    } else if (pathname === '/backtracking') {
      if (problemKey === 'nqueens') {
        title = 'N-Queens Backtracking Problem Visualizer | AlgoScope'
        description =
          'Visualize the N-Queens problem with step-by-step recursive backtracking animations. Track queen placement, row/column/diagonal constraints, and backtracks.'
      } else if (problemKey === 'sudoku') {
        title = 'Sudoku Solver Backtracking Visualizer | AlgoScope'
        description =
          'Watch recursive Sudoku solver place numbers 1-9 in 9x9 grid cells with constraint validation, cell backtracking, and visual search tree.'
      } else if (problemKey === 'maze') {
        title = 'Maze Pathfinding & Generation Backtracking | AlgoScope'
        description =
          'Visualize maze solving and generation using recursive backtracking. Track decision paths, dead ends, and solution routes.'
      } else if (problemKey === 'knight') {
        title = "Knight's Tour Backtracking Visualizer | AlgoScope"
        description =
          "Master Knight's Tour problem on a chessboard with recursive backtracking. Track knight jump moves and cell visit order."
      } else if (problemKey === 'graph-coloring') {
        title = 'Graph Coloring Backtracking Visualizer | AlgoScope'
        description =
          'Visualize K-Coloring graph backtracking algorithm. Explore vertex assignment, adjacent color conflicts, and search tree pruning.'
      } else if (problemKey === 'hanoi') {
        title = 'Tower of Hanoi Recursive Visualizer | AlgoScope'
        description =
          'Watch Tower of Hanoi solved recursively step-by-step. Visualize disk moves, source/auxiliary/destination pegs, and recurrence relation.'
      }
    } else if (pathname === '/string-algorithms') {
      if (problemKey === 'kmp') {
        title = 'KMP (Knuth-Morris-Pratt) Pattern Matching | AlgoScope'
        description =
          'Visualize KMP string matching with prefix lookup table (LPS/Pi array). Track pattern shifts and linear O(n+m) text search.'
      } else if (problemKey === 'rabinkarp' || problemKey === 'rabin-karp') {
        title = 'Rabin-Karp Rolling Hash String Matching | AlgoScope'
        description =
          'Understand Rabin-Karp algorithm with rolling hash animations. Track hash value computation, hash collisions, and substring verification.'
      } else if (problemKey === 'zalgorithm' || problemKey === 'z-algorithm') {
        title = 'Z-Algorithm String Matching Visualizer | AlgoScope'
        description =
          'Visualize Z-Algorithm with Z-array construction. Track prefix match lengths and Z-box boundaries for linear pattern search.'
      }
    } else if (pathname === '/operating-systems/cpu-scheduling') {
      if (problemKey === 'fcfs') {
        title = 'First-Come First-Served (FCFS) CPU Scheduling | AlgoScope'
        description =
          'Visualize FCFS CPU scheduling with interactive Gantt charts, arrival order queues, waiting time, and turnaround time metrics.'
      } else if (problemKey === 'sjf') {
        title = 'Shortest Job First (SJF) CPU Scheduling | AlgoScope'
        description =
          'Master Shortest Job First (SJF) non-preemptive CPU scheduling visually. See process execution ordering by shortest burst time.'
      } else if (problemKey === 'srtf') {
        title =
          'Shortest Remaining Time First (SRTF) CPU Scheduling | AlgoScope'
        description =
          'Visualize SRTF preemptive CPU scheduling with dynamic burst updates, process preemption, and Gantt chart execution.'
      } else if (problemKey === 'priority') {
        title = 'Priority CPU Scheduling Visualizer | AlgoScope'
        description =
          'Learn Priority CPU scheduling visually. Track process priority queues, preemption logic, and execution metrics.'
      } else if (
        problemKey === 'rr' ||
        problemKey === 'roundrobin' ||
        problemKey === 'round-robin'
      ) {
        title = 'Round Robin (RR) CPU Scheduling Visualizer | AlgoScope'
        description =
          'Visualize Round Robin CPU scheduling with time quantum slices, ready queue rotation, and context switching Gantt charts.'
      } else if (
        problemKey === 'multilevelqueue' ||
        problemKey === 'multilevel-queue'
      ) {
        title = 'Multilevel Queue CPU Scheduling Visualizer | AlgoScope'
        description =
          'Understand Multilevel Queue CPU scheduling across high and low priority queues with preemptive time-slicing.'
      }
    } else if (pathname === '/math-theory') {
      if (problemKey === 'gcd') {
        title = 'Euclidean GCD Algorithm Visualizer | AlgoScope'
        description =
          'Visualize Euclidean algorithm for Greatest Common Divisor (GCD) step-by-step with modulo reductions and quotient steps.'
      } else if (problemKey === 'expo') {
        title = 'Fast Exponentiation (Binary Exponentiation) | AlgoScope'
        description =
          'Master Fast Exponentiation (a^b in O(log b) steps). Visualize bitwise exponent shifts, squaring, and multiplication.'
      } else if (problemKey === 'sieve') {
        title = 'Sieve of Eratosthenes Prime Visualizer | AlgoScope'
        description =
          'Visualize Sieve of Eratosthenes prime number generation step-by-step. See composite number elimination and prime array filtering.'
      } else if (problemKey === 'fibonacci') {
        title = 'Fibonacci Sequence & Golden Ratio Visualizer | AlgoScope'
        description =
          'Explore Fibonacci sequence generation, golden ratio convergence, and recursive tree breakdown visually.'
      } else if (problemKey === 'fft') {
        title = 'Fast Fourier Transform (FFT) Visualizer | AlgoScope'
        description =
          'Understand Fast Fourier Transform (FFT) visually. Explore butterfly diagrams, frequency spectrum decomposition, and signal processing.'
      } else if (problemKey === 'bits') {
        title = 'Bitwise Operations Visualizer | AlgoScope'
        description =
          'Visualize bitwise AND, OR, XOR, NOT, and bit shift operations on binary integers with bitmask displays.'
      }
    }
    // Generic fallback for ?algo=... or ?type=...
    else if (algo) {
      const formattedAlgo = formatLabel(algo)

      if (pathname === '/sort') {
        title = `${formattedAlgo} Sort Visualizer | AlgoScope`
        description = `Interactive ${formattedAlgo} sort visualization. Watch how ${formattedAlgo} sort organizes data step-by-step with real-time animations and synchronized code.`
      } else if (pathname === '/search') {
        if (algo === 'bfs') {
          title = 'Breadth-First Search (BFS) Visualizer | AlgoScope'
          description =
            'Explore Breadth-First Search level by level with animated graph queues, node distance tracking, and synchronized code execution.'
        } else if (algo === 'dfs') {
          title = 'Depth-First Search (DFS) Visualizer | AlgoScope'
          description =
            'Explore Depth-First Search recursively with animated call stacks, backtrack paths, and synchronized node traversal.'
        } else {
          title = `${formattedAlgo} Graph Search Visualizer | AlgoScope`
          description = `Visualize ${formattedAlgo} graph search algorithm. Explore nodes and edges in real-time to understand traversal patterns.`
        }
      } else if (pathname === '/spath') {
        if (algo === 'prim') {
          title = "Prim's MST Visualizer | AlgoScope"
          description =
            "Visualize Prim's Minimum Spanning Tree algorithm step-by-step. Watch how Prim's greedily selects the lowest-weight edge to grow the MST from a starting node."
        } else if (algo === 'kruskal') {
          title = "Kruskal's MST Visualizer | AlgoScope"
          description =
            "Visualize Kruskal's Minimum Spanning Tree algorithm step-by-step. See how Kruskal's sorts edges and uses a Union-Find structure to build the MST without cycles."
        } else if (algo === 'dijkstra') {
          title = "Dijkstra's Shortest Path Visualizer | AlgoScope"
          description =
            "Visualize Dijkstra's algorithm for finding the shortest paths between nodes in a weighted graph with real-time distance updates."
        } else if (algo === 'bellmanford') {
          title = 'Bellman-Ford Algorithm Visualizer | AlgoScope'
          description =
            'Visualize the Bellman-Ford algorithm step-by-step. Learn how edge relaxation detects negative weight cycles in graphs.'
        } else if (algo === 'floydwarshall') {
          title = 'Floyd-Warshall All-Pairs Shortest Path | AlgoScope'
          description =
            'Visualize the Floyd-Warshall dynamic programming algorithm for all-pairs shortest paths on graph adjacency matrices.'
        } else {
          title = `${formattedAlgo} Shortest Path Visualizer | AlgoScope`
          description = `Discover paths using ${formattedAlgo} shortest path algorithm. Interactive visualization showing optimal routes through a graph.`
        }
      } else if (pathname === '/ldssearch') {
        title = `${formattedAlgo} Search Visualizer | AlgoScope`
        description = `Watch ${formattedAlgo} search in action. A step-by-step interactive visualization of ${formattedAlgo} search on arrays with index tracking and metrics.`
      }
    } else if (type && pathname === '/adt') {
      const formattedType = formatLabel(type)
      title = `${formattedType} Data Structure Visualizer | AlgoScope`
      description = `Deep dive into the ${formattedType} data structure. Interactive visualization of ${formattedType} operations, memory pointers, and behavior.`
    }

    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}${search}`
    const robotsContent = baseMetadata.noIndex
      ? 'noindex, nofollow'
      : 'index, follow'

    document.title = title
    setLink('link[rel="canonical"]', 'canonical', canonicalUrl)
    setMeta('meta[name="description"]', 'name', description)
    setMeta('meta[name="robots"]', 'name', robotsContent)
    setMeta('meta[property="og:title"]', 'property', title)
    setMeta('meta[property="og:description"]', 'property', description)
    setMeta('meta[property="og:url"]', 'property', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', DEFAULT_IMAGE)
    setMeta(
      'meta[property="og:image:alt"]',
      'property',
      'AlgoScope interface preview showing algorithm visualizations'
    )

    // Twitter-specific tags (use 'name' attribute)
    setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', title)
    setMeta('meta[name="twitter:description"]', 'name', description)
    setMeta('meta[name="twitter:image"]', 'name', DEFAULT_IMAGE)
    setMeta(
      'meta[name="twitter:image:alt"]',
      'name',
      'AlgoScope interface preview showing algorithm visualizations'
    )

    const structuredDataScript = document.getElementById(
      'algoscope-structured-data'
    )

    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              description: DEFAULT_DESCRIPTION,
            },
            {
              '@type': 'SoftwareApplication',
              name: SITE_NAME,
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web',
              url: canonicalUrl,
              image: DEFAULT_IMAGE,
              description: description,
            },
          ],
        },
        null,
        2
      )
    }
  }, [pathname, search])

  return null
}
