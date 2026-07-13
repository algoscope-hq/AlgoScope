export const ROUTE_DIFFICULTIES = {
  '/sort': 'Beginner',
  '/search': 'Beginner',
  '/spath': 'Intermediate',
  '/ldssearch': 'Beginner',
  '/adt': 'Intermediate',
  '/kadane': 'Intermediate',
  '/moore-voting': 'Beginner',
  '/math-theory': 'Intermediate',
  '/string-algorithms': 'Advanced',
  '/dynamic-programming': 'Intermediate',
  '/dp-journey': 'Advanced',
  '/backtracking': 'Advanced',
  '/monotonic-stack': 'Advanced',
}

export const NEXT_TOPICS_MAP = {
  Beginner: [
    { name: 'Graph Algorithms', href: '/spath', difficulty: 'Intermediate' },
    {
      name: "Moore's Voting",
      href: '/moore-voting',
      difficulty: 'Beginner',
    },
    { name: 'Abstract Data Types', href: '/adt', difficulty: 'Intermediate' },
  ],
  Intermediate: [
    {
      name: 'String Algorithms',
      href: '/string-algorithms',
      difficulty: 'Advanced',
    },
    {
      name: 'Dynamic Programming',
      href: '/dynamic-programming',
      difficulty: 'Intermediate',
    },
    { name: 'Backtracking', href: '/backtracking', difficulty: 'Advanced' },
  ],
  Advanced: [
    {
      name: 'DP Optimization Journey',
      href: '/dp-journey',
      difficulty: 'Advanced',
    },
    { name: 'Practice Sandbox', href: '/practice', difficulty: 'Intermediate' },
    {
      name: 'Guess the Algorithm',
      href: '/challenge',
      difficulty: 'Intermediate',
    },
  ],
}
