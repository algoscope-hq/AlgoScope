import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels = {
  sort: 'Sorting',
  sorting: 'Sorting',
  search: 'Searching',
  searching: 'Searching',
  spath: 'Shortest Path & MST',
  'shortest-path': 'Shortest Path & MST',
  adt: 'Data Structures',
  'data-structures': 'Data Structures',
  ldssearch: 'Array Search',
  'array-search': 'Array Search',
  'math-theory': 'Math Theory',
  'string-algorithms': 'String Algorithms',
  graph: 'Graph Algorithms',
  visualizer: 'Visualizer',
  compare: 'Compare Mode',
  kadane: "Kadane's Algorithm",
  'moore-voting': "Moore's Voting",
  backtracking: 'Backtracking',
  'dynamic-programming': 'Dynamic Programming',
  'dp-journey': 'DP Journey',
  'sliding-window': 'Sliding Window',
  'two-pointer': 'Two Pointer',
  'monotonic-stack': 'Monotonic Stack',
  greedy: 'Greedy Algorithms',
  'operating-systems': 'Operating Systems',
  'cpu-scheduling': 'CPU Scheduling',
  'page-replacement': 'Page Replacement',
  'disk-scheduling': 'Disk Scheduling',
  concepts: 'Concepts',
  practice: 'Practice Sandbox',
  challenge: 'Challenge Mode',
  favorites: 'Favorites',
  about: 'About',
}

export default function Breadcrumbs() {
  const location = useLocation()

  const pathnames = useMemo(
    () => location.pathname.split('/').filter(Boolean),
    [location.pathname]
  )

  if (pathnames.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-2 sm:px-1 text-sm text-slate-400 overflow-x-auto"
    >
      <ol className="flex items-center flex-wrap gap-2">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-200"
          >
            <Home size={15} />
            <span>Home</span>
          </Link>
        </li>

        {pathnames.map((segment, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`

          const isLast = index === pathnames.length - 1

          const label =
            routeLabels[segment] ||
            segment
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())

          return (
            <li key={routeTo} className="flex items-center gap-2">
              <ChevronRight size={15} className="text-slate-600" />

              {isLast ? (
                <span
                  aria-current="page"
                  className="text-cyan-400 font-medium whitespace-nowrap"
                >
                  {label}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-cyan-400 transition-colors duration-200 whitespace-nowrap"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
