# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.0] - 2026-06-07

### Added

- format & lint
- format & lint
- add algorithm notes and annotations feature

### Fixed

- format & lint
- remove deprecated 'node' npm package from dependencies
- correct formFieldLabel layout on signup form
- improve SpeedSlider responsive UI for mobile devices

### 📂 Changed Files

```
- 📁 **api/**
  - ✏️ index.js
- 📁 **src/**
  - 📁 **components/**
    - 📁 **arraySearch/**
      - ✏️ VisualizerPage.jsx
    - 📁 **kadaneAlgo/**
      - ✏️ VisualizerPage.jsx
    - 📁 **mooreVotingAlgo/**
      - ✏️ VisualizerPage.jsx
    - 📁 **notes/**
      - ➕ AlgorithmNotes.jsx
    - 📁 **sortingAlgo/**
      - ✏️ VisualizerPage.jsx
    - ✏️ AlgoCard.jsx
    - ✏️ AppLayout.jsx
    - ➕ DifficultyBadge.jsx
    - ➕ difficultyColors.js
    - ✏️ Home.jsx
    - ➕ LearningPathSuggestions.jsx
    - ✏️ Navbar.jsx
    - ✏️ SpeedSlider.jsx
  - 📁 **data/**
    - ➕ difficultyMap.js
  - ✏️ App.jsx
  - ✏️ main.jsx
- ✏️ CHANGELOG.md
- ✏️ package.json
```

## [1.10.0] - 2026-06-06

### Added

- updated the searchbar with dsu and dp-journey
- add operating systems section and category page
- improve onboarding tour accessibility, restore previous button, and add mobile selector fallbacks
- implement guided onboarding tour spotlight on home page
- Add DP Optimization Journey visualizer with recursion tree and space complexity analysis
- add disjoint set union visualizer
- updated search and explore bar
- add graph coloring visualizer
- add aria-label to LinkedIn icon buttons for accessibility
- add LinkedIn icons for both maintainers to footer social links
- add scroll-to-bottom button alongside scroll-to-top
- centralize app version from package.json and display dynamically across UI
- add math theory deep links
- add FFT algorithm visualization
- add reset all functionality to grid visualizer

### Fixed

- add CORS restrictions, Helmet, rate limiting, and body size limit
- improve Light Mode text and code readability
- added code highlighting to Dynamic Programming
- update repository and issue tracker URLs
- format code with prettier
- integrate useKeyboardShortcuts into Sorting, Shortest Path, and Backtracking visualizers
- address CodeRabbit review comments
- add tooltip and clearer terminal text for non-JS languages in Practice Sandbox
- address review comments
- hide scroll buttons on non-scrollable pages
- enhance hero meta items with icons and background tags for better visual hierarchy
- filter test case seeding check to current algorithm instead of global db emptiness
- improve search modal focus management
- Navbar Practice and Challenge links now highlight on active route
- align footer array search card copy
- make explore dropdown keyboard accessible
- resolve unreachable path bug when source and target are the same node (#496)
- format App.jsx router setup
- resolve synchronous state updates in visualizer useEffect hooks
- format
- Sieve of Eratosthenes visualizer crashes on decimal inputs
- lint & format
- lint & format
- lint & format
- validate dynamic programming inputs
- clamp oversized FFT inputs to maximum supported size
- resolve stale visualizer states and router recreation
- AlgoCard vanish issue
- Fixed the Algo Card
- preserve IndexedDB identities during backup imports (#321)
- irrelevant search suggestions in search bar

### 📂 Changed Files

```
- 📁 **.github/**
  - 📁 **ISSUE_TEMPLATE/**
    - ✏️ config.yml
- 📁 **api/**
  - ✏️ index.js
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **backtracking/**
      - ✏️ backtrackingSources.js
    - 📁 **mathTheory/**
      - ✏️ mathTheorySources.jsx
      - ✏️ mathTheorySteps.jsx
  - 📁 **components/**
    - 📁 **about/**
      - ✏️ About.jsx
    - 📁 **backtrackingAlgo/**
      - ➕ CanvasGraphColoring.jsx
      - ✏️ MenuSetAlgoBacktracking.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **challenge/**
      - ✏️ ChallengeVisualizer.jsx
    - 📁 **dataStructures/**
      - ✏️ adtSources.js
      - ✏️ DSLayout.jsx
      - ➕ dsuIV.jsx
    - 📁 **dynamicProgramming/**
      - ➕ DPOptimizationJourney.jsx
      - ✏️ DPVisualizer.jsx
    - 📁 **hero/**
      - ✏️ Hero.jsx
    - 📁 **kadaneAlgo/**
      - ✏️ CanvasKadane.jsx
    - 📁 **MathTheory/**
      - ➕ CanvasFFT.jsx
      - ✏️ MathSoloVisualizer.jsx
    - 📁 **mooreVotingAlgo/**
      - ✏️ CanvasMooreVoting.jsx
    - 📁 **operatingSystems/**
      - ➕ OperatingSystemsPage.jsx
    - 📁 **shortestPathAlgo/**
      - ✏️ CanvasShortestPath.jsx
      - ✏️ GridVisualizer.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ✏️ Visualizer.jsx
    - 📁 **testCaseManager/**
      - ✏️ TestCaseManager.jsx
    - 📁 **visualizer/**
      - ✏️ CodePanel.jsx
    - ✏️ AlgoCard.jsx
    - ✏️ CodeEditor.jsx
    - ✏️ Footer.jsx
    - ➕ GuidedTour.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ✏️ PracticePage.jsx
    - ✏️ ScrollToTopButton.jsx
    - ✏️ SearchBar.jsx
  - 📁 **data/**
    - ✏️ complexityMap.js
    - ➕ tourSteps.js
  - 📁 **lib/**
    - ✏️ testCaseStore.js
    - ➕ testCaseStore.test.js
    - ✏️ utils.js
    - ➕ version.js
  - ✏️ App.jsx
  - ✏️ input.css
- ✏️ CHANGELOG.md
- ✏️ package-lock.json
- ✏️ package.json
- ➕ SECURITY.md
```

## [1.9.0] - 2026-05-29

### Added

- implement native Floyd-Warshall for solo grid visualizer
- integrate guess the algorithm challenge page into navigation, search, footer, and SEO
- add MCQ quiz game
- add empirical Big-O runtime benchmarking system (#386)
- add responsive scroll-to-top button
- refine grid comparison visualization and scoring
- add grid comparison mode for shortest path algorithms
- add custom array input for search visualizer (linear & binary)

### Fixed

- lint
- restore string algorithms route and improve complexity layout
- correct browser title on valid sub-routes
- overlap between close button and sort dropdown
- resolve formatting and division by zero when maxSize is 1
- address remaining visualization nitpicks
- address comparison mode review feedback
- resolve footer link JSX syntax issue
- make maintainer link styles consistent

### Changed

- standardize semantic theme variable syntax
- replace hardcoded colors with semantic theme variables

### 📂 Changed Files

```
- 📁 **.github/**
  - 📁 **ISSUE_TEMPLATE/**
    - ✏️ feature_request.yml
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **dp/**
      - ➕ dpStepGenerators.js
    - 📁 **sorting/**
      - ✏️ mergeSortSteps.js
  - 📁 **components/**
    - 📁 **arraySearch/**
      - ✏️ Visualizer.jsx
    - 📁 **backtrackingAlgo/**
      - ✏️ VisualizerPage.jsx
    - 📁 **challenge/**
      - ➕ ChallengePage.jsx
      - ➕ ChallengeVisualizer.jsx
    - 📁 **dataStructures/**
      - ✏️ stackIV.jsx
    - 📁 **dynamicProgramming/**
      - ➕ DPVisualizer.jsx
    - 📁 **MathTheory/**
      - ✏️ MathSoloVisualizer.jsx
    - 📁 **shortestPathAlgo/**
      - ➕ GridComparisonMode.jsx
      - ✏️ GridVisualizer.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ➕ RecursiveTree.jsx
      - ✏️ Visualizer.jsx
    - 📁 **stringAlgo/**
      - ✏️ VisualizerPage.jsx
    - 📁 **visualizer/**
      - ✏️ CodePanel.jsx
    - ✏️ AppLayout.jsx
    - ✏️ CodeEditor.jsx
    - ✏️ ComplexityCard.jsx
    - ✏️ Footer.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ✏️ PracticePage.jsx
    - ➕ ProfilerGraph.jsx
    - ➕ ScrollToTopButton.jsx
    - ✏️ SearchBar.jsx
    - ✏️ SeoHead.jsx
  - ✏️ App.jsx
  - ✏️ input.css
- ✏️ CHANGELOG.md
- ✏️ package-lock.json
- ✏️ README.md
```

## [1.8.0] - 2026-05-26

### Added

- add keyboard shortcuts for visualization controls
- add Auto/Step mode toggle for manual step control
- add Practice Sandbox to Explore dropdown
- implemented scroll to top button
- add dynamic breadcrumb navigation for visualizer pages
- add string algo to search bar and explore bar
- redesign 404 page with glitch effect and terminal animation
- add interactive graph canvas builder for BFS, DFS, and shortest-path visualizers
- add Fibonacci Visualizer with Golden Spiral and Recursion Tree modes
- add test case manager with IndexedDB persistence and search
- add test case manager
- add custom array input and validation
- add Sieve of Eratosthenes visualizer and fix math code line highlighting
- add weighted node traversal and interactive cost visualization

### Fixed

- resolve linting and formatting issues
- format & lint
- avoid blocking Space key on focused buttons and links
- format
- format
- harden Worker runtime against benchmark message spoofing (#310)
- add scroll-to-top button
- add scroll-to-top button
- resolve algorithm cards becoming hidden after page refresh
- improve breadcrumb accessibility and route labels
- scale canvas by device pixel ratio for Retina displays
- enhance input validation and bounds safety in generateRandomArray and calculateStepDelay
- add canvas resize handler and go back fallback
- show graph builder toolbar reliably on canvas
- resolve production server startup issue
- clear stale sorting visualization state after interrupted execution (#323)
- lint
- lint
- address PR review for builder edits and stale traversals
- improve Clerk dark mode profile UI visibility
- allow duplicate values in BST and fix negative input bug on Enter
- resolve react-hooks violations in graph builder components
- resolve text overlap in complexity sidebar
- wrap treeState in useMemo, remove unused isLeaf variable
- lint
- added light mode visibility practice button and visible text
- sync live code block with custom array input in Kadane's and Moore's Algo
- format
- format
- format
- preserve weighted node styling during traversal
- step insights now visible by dafault

### Changed

- simplify breadcrumb pathname parsing
- optimize breadcrumb pathname processing
- optimize Google Font loading in index.html
- address CodeRabbit review feedback

### 📂 Changed Files

```
- 📁 **.antigravitycli/**
  - ➕ dca056bd-be77-484a-96bd-dc78d615732b.json
- 📁 **.github/**
  - 📁 **workflows/**
    - ✏️ pipelines.yml
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **backtracking/**
      - ✏️ backtrackingSources.js
    - 📁 **mathTheory/**
      - ✏️ mathTheorySources.jsx
      - ✏️ mathTheorySteps.jsx
    - 📁 **searching/**
      - ✏️ shortestPathSources.js
    - 📁 **sorting/**
      - ✏️ bubbleSortSteps.js
    - 📁 **stringAlgo/**
      - ➕ stringSources.js
  - 📁 **components/**
    - 📁 **arraySearch/**
      - ✏️ Visualizer.jsx
    - 📁 **backtrackingAlgo/**
      - ➕ CanvasTowerOfHanoi.jsx
      - ✏️ MenuSetAlgoBacktracking.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **dataStructures/**
      - ✏️ treeIV.jsx
    - 📁 **hero/**
      - ➕ Hero.jsx
      - ➕ HeroProductPreview.jsx
    - 📁 **kadaneAlgo/**
      - ✏️ VisualizerPage.jsx
    - 📁 **MathTheory/**
      - ➕ CanvasFibonacci.jsx
      - ➕ CanvasSieve.jsx
      - ✏️ MathSoloVisualizer.jsx
    - 📁 **mooreVotingAlgo/**
      - ✏️ VisualizerPage.jsx
    - 📁 **searchAlgo/**
      - ✏️ CanvasSearching.jsx
      - ✏️ MenuSelectNodeSearch.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **shared/**
      - ➕ GraphBuilderToolbar.jsx
    - 📁 **shortestPathAlgo/**
      - ✏️ CanvasShortestPath.jsx
      - ✏️ GridVisualizer.jsx
      - ✏️ MenuSelectNodesShortestPath.jsx
      - ✏️ MenuSetAlgoShortestPath.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ✏️ ComparisonMode.jsx
      - ✏️ Visualizer.jsx
    - 📁 **stringAlgo/**
      - ➕ CanvasKMP.jsx
      - ➕ CanvasRabinKarp.jsx
      - ➕ CanvasZAlgorithm.jsx
      - ➕ CompareMode.jsx
      - ➕ MenuSetStringAlgo.jsx
      - ➕ VisualizerPage.jsx
    - 📁 **testCaseManager/**
      - ➕ TestCaseManager.jsx
    - 📁 **visualizer/**
      - ➕ useKeyboardShortcuts.js
    - ✏️ AlgoCard.jsx
    - ✏️ AppLayout.jsx
    - ➕ Breadcrumbs.jsx
    - ✏️ ComplexityCard.jsx
    - ✏️ Footer.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ✏️ PageNotFound.jsx
    - ✏️ PracticePage.jsx
    - ✏️ SearchBar.jsx
    - ✏️ SeoHead.jsx
  - 📁 **data/**
    - ✏️ complexityMap.js
  - 📁 **lib/**
    - ➕ scheduleNetworkReady.js
    - ➕ testCaseStore.js
    - ✏️ utils.js
    - ➕ utils.test.js
  - ✏️ App.jsx
  - ✏️ input.css
  - ✏️ main.jsx
- ➕ .env.example
- ✏️ CHANGELOG.md
- ✏️ index.html
- ✏️ package-lock.json
- ✏️ package.json
- ✏️ README.md
- ➕ vitest.config.js
```

## [1.7.0] - 2026-05-22

### Added

- implement dual execution comparison mode in practice sandbox
- Improve Footer Section Design, Layout, and Responsiveness
- improve sign-in page UI and accessibility
- add grid-specific shortest path source implementations
- add grid-specific shortest path source implementations
- add speed and language controls to MathSoloVisualizer
- add code download functionality to sandbox editor
- add grid-based shortest path visualizer
- implement step backward functionality in visualizers
- add download button for code snippets
- add session history panel for recent algorithms

### Fixed

- format
- format
- improve keyboard accessibility for algorithm cards
- remove unused floyd-warshall parameter
- improve grid shortest path implementations
- add missing Math Theory to search and explore bar
- stabilize grid visualizer interactions
- resolve lint issues in grid visualizer
- resolve grid visualizer review issues
- resolve linting issues in Navbar (cascading renders and missing dependencies)
- resolve navbar hook dependency warning
- improve session history stability
- fixed the bug where the size decreased when clicked
- Search bar put in the center

### Changed

- optimize grid visualizer rendering
- move recent algorithms into explore dropdown

### 📂 Changed Files

```
- 📁 **.github/**
  - 📁 **ISSUE_TEMPLATE/**
    - ✏️ bug_report.yml
    - ✏️ feature_request.yml
  - 📁 **workflows/**
    - ✏️ conventional-commits.yml
    - ✏️ release-please.yml
- 📁 **scripts/**
  - ✏️ append-file-tree.cjs
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **backtracking/**
      - ➕ backtrackingSources.js
    - 📁 **mathTheory/**
      - ➕ mathTheorySources.jsx
      - ➕ mathTheorySteps.jsx
    - 📁 **searching/**
      - ✏️ shortestPathSources.js
  - 📁 **components/**
    - 📁 **arraySearch/**
      - ✏️ Visualizer.jsx
    - 📁 **backtrackingAlgo/**
      - ➕ CanvasNQueens.jsx
      - ➕ CanvasSudoku.jsx
      - ➕ ComparisonMode.jsx
      - ➕ MenuSetAlgoBacktracking.jsx
      - ➕ sudokuUtils.js
      - ➕ VisualizerPage.jsx
    - 📁 **MathTheory/**
      - ➕ CanvasBitManip.jsx
      - ➕ CanvasFastExpo.jsx
      - ➕ CanvasGCD.jsx
      - ➕ MathComparisonMode.jsx
      - ➕ MathSoloVisualizer.jsx
    - 📁 **shortestPathAlgo/**
      - ➕ GridVisualizer.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ✏️ Visualizer.jsx
    - 📁 **visualizer/**
      - ✏️ CodePanel.jsx
      - ✏️ useStepPlayback.js
    - ✏️ AlgoCard.jsx
    - ✏️ AppLayout.jsx
    - ✏️ CodeEditor.jsx
    - ✏️ Footer.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ✏️ PracticePage.jsx
    - ✏️ SearchBar.jsx
  - 📁 **context/**
    - ➕ theme.js
    - ➕ ThemeProvider.jsx
    - ➕ useTheme.js
  - 📁 **data/**
    - ✏️ complexityMap.js
  - ✏️ App.css
  - ✏️ App.jsx
  - ✏️ input.css
  - ✏️ main.jsx
- ❌ .env.example
- ✏️ CHANGELOG.md
- ✏️ index.html
- ✏️ package-lock.json
- ✏️ package.json
```

## [1.6.1] - 2026-05-19

### Fixed

- checkout main branch instead of detached HEAD for changelog rebuild

### 📂 Changed Files

```
- 📁 **.github/**
  - 📁 **workflows/**
    - ✏️ release-please.yml
    - ❌ release.yml
- ✏️ CHANGELOG.md
```

## [1.6.0] - 2026-05-19

### Added

- pr tamplate add
- refine Comparison Mode SEO metadata and update sitemap
- add dynamic SEO metadata for Comparison Mode and missing routes
- tooltip hover jsx file added to src/components
- implement interactive binary heap and priority queue visualizers
- add best average and worst case complexity analysis
- dynamically display Ctrl/Enter or ⌘/Return based on user OS
- add algorithm comparison mode with side-by-side visualization for all the types of algorithm
- Moore Voting Algorithm
- Moore Voting Algorithm
- Moore Voting Algorithm
- Moore Voting Algorithm
- add interactive complexity graph visualization

### Fixed

- tooltip hover feature added to all category files
- reset query and results state on modal close
- added Moore's Voting Algorithm to searchbar
- adjust vertical spacing for status display banner
- format & lint
- show graph only for selected algorithm
- format & lint
- format ComplexityGraph component
- folder fix
- update lockfile and dependencies

### Changed

- SEO update

### 📂 Changed Files

```
- 📁 **.github/**
  - 📁 **ISSUE_TEMPLATE/**
    - ➕ bug_report.yml
    - ➕ config.yml
    - ➕ feature_request.yml
  - 📁 **workflows/**
    - ➕ conventional-commits.yml
    - ➕ release-please.yml
    - ➕ release.yml
  - ➕ pull_request_template.md
- 📁 **public/**
  - ✏️ sitemap.xml
- 📁 **scripts/**
  - ➕ append-file-tree.cjs
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **mooreVoting/**
      - ➕ mooreVotingSources.js
  - 📁 **assets/**
    - 📁 **new-home-images/**
      - ➕ MooreVoting.png
  - 📁 **components/**
    - 📁 **arraySearch/**
      - ➕ ComparisonMode.jsx
      - ✏️ Visualizer.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **dataStructures/**
      - ✏️ adtSources.js
      - ➕ binaryHeapIV.jsx
      - ➕ ComparisonMode.jsx
      - ✏️ DSLayout.jsx
      - ➕ priorityQueueIV.jsx
    - 📁 **kadaneAlgo/**
      - ✏️ CanvasKadane.jsx
      - ✏️ MenuSetAlgoKadane.jsx
    - 📁 **mooreVotingAlgo/**
      - ➕ CanvasMooreVoting.jsx
      - ➕ MenuSetAlgoMooreVoting.jsx
      - ➕ VisualizerPage.jsx
    - 📁 **searchAlgo/**
      - ➕ ComparisonMode.jsx
      - ✏️ MenuSelectAlgorithm.jsx
      - ✏️ MenuSelectNodeSearch.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **shortestPathAlgo/**
      - ➕ ComparisonMode.jsx
      - ✏️ MenuSelectNodesShortestPath.jsx
      - ✏️ MenuSetAlgoShortestPath.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ➕ ComparisonMode.jsx
      - ✏️ Visualizer.jsx
      - ✏️ VisualizerPage.jsx
    - ✏️ ComplexityCard.jsx
    - ➕ ComplexityGraph.jsx
    - ✏️ Footer.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ✏️ SearchBar.jsx
    - ✏️ SeoHead.jsx
    - ✏️ SpeedSlider.jsx
    - ➕ Tooltip.jsx
  - 📁 **data/**
    - ✏️ complexityMap.js
  - ✏️ App.jsx
- ➕ .coderabbit.yml
- ❌ AlgoScope.zip
- ✏️ CHANGELOG.md
- ✏️ package-lock.json
- ✏️ package.json
- ✏️ README.md
```

## [1.5.0] - 2026-05-17

### Added

- add multi-language code viewer for ADT modules
- add +/- precision buttons to speed control slider
- Add Copy Code button to CodeEditor component
- add Shell Sort algorithm visualization
- move Practice button from Navbar to hero CTA
- add close (X) button to search modal
- implement multi-language support across searching, sorting, and shortest path visualizers
- convert navbar search into modal search UI
- convert navbar search into modal search UI
- Clerk auth add
- add explore dropdown and move secondary links to footer
- add Vercel Middleware to serve dynamic SEO metadata to crawlers
- implement dynamic SEO metadata and refactor Visualizer to use derived state
- improve audio error handling in speed slider
- add tick sound feedback to speed slider
- backend init+lint fix
- backend init
- refactor Terminal component to use forwardRef and implement smooth scrolling to console
- implement JavaScript execution and output terminal in Practice Sandbox
- enable font ligatures in CodeEditor
- fix PracticePage width and standardize premium layout
- optimize CodeEditor and PracticePage for premium aesthetic
- Practice area with code editor add

### Fixed

- clerk dark mode
- lint & formating
- resolve status display layout misalignment and spacing issues
- lint & formating
- align search bar vertically in Navbar with items-center
- Adding Array Search, ADTs and Kadane's Algorithm to the Explore section of the Footer
- solved linting issues
- apply prettier formatting
- add ADT, Array Search, and Kadane's algorithm to explore dropdown
- add ADT, Array Search, and Kadane's algorithm to explore dropdown
- resolve main.jsx merge conflict
- lint & formating
- lint & formating
- format and review
- run prettier to resolve CI/CD formatting failures
- reset starting node dropdown in search module
- reset source and target dropdowns in pathfinding module
- use 'name' attribute for Twitter meta tags to improve social sharing
- a small linting and format fix
- formating fix
- README, about bimbok
- remove redundant AppLayout in PracticePage to fix double header issue
- linting error fix
- utilize more space
- replace dim footer logo with logo3

### Changed

- resolve merge conflicts keeping UI layout improvements
- improve UI layout and UX for sort and arraysearch visualizer pages
- improve UI layout and UX for visualizer pages

### 📂 Changed Files

```
- 📁 **api/**
  - ➕ .env.example
  - ➕ index.js
  - ➕ package-lock.json
  - ➕ package.json
  - ➕ vercel.json
- 📁 **public/**
  - ➕ preview.png
  - ➕ robots.txt
  - ➕ sitemap.xml
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **kadane/**
      - ➕ kadaneSources.js
    - 📁 **searching/**
      - ✏️ binarySearchSteps.js
      - ✏️ graphSearchSources.js
      - ✏️ linearSearchSteps.js
      - ➕ searchingSources.js
      - ✏️ shortestPathSources.js
    - 📁 **sorting/**
      - ✏️ bubbleSortSteps.js
      - ✏️ countingSortSteps.js
      - ✏️ heapSortSteps.js
      - ✏️ insertionSortSteps.js
      - ✏️ mergeSortSteps.js
      - ✏️ quickSortSteps.js
      - ✏️ radixSortSteps.js
      - ✏️ selectionSortSteps.js
      - ➕ shellSortSteps.js
  - 📁 **assets/**
    - 📁 **new-home-images/**
      - ➕ KadaneImg.png
    - ➕ click.wav
  - 📁 **components/**
    - 📁 **about/**
      - ✏️ About.jsx
    - 📁 **arraySearch/**
      - ✏️ Visualizer.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **dataStructures/**
      - ➕ adtSources.js
      - ✏️ DSLayout.jsx
      - ✏️ stackIV.jsx
    - 📁 **kadaneAlgo/**
      - ➕ CanvasKadane.jsx
      - ➕ MenuSetAlgoKadane.jsx
      - ➕ VisualizerPage.jsx
    - 📁 **searchAlgo/**
      - ✏️ CanvasSearching.jsx
      - ✏️ MenuSelectAlgorithm.jsx
      - ✏️ MenuSelectNodeSearch.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **shortestPathAlgo/**
      - ✏️ CanvasShortestPath.jsx
      - ✏️ MenuSelectNodesShortestPath.jsx
      - ✏️ MenuSetAlgoShortestPath.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ✏️ Visualizer.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **visualizer/**
      - ✏️ CodePanel.jsx
      - ✏️ useStepPlayback.js
    - ✏️ AlgoCard.jsx
    - ✏️ AppLayout.jsx
    - ➕ CodeEditor.jsx
    - ➕ ComplexityCard.jsx
    - ✏️ Footer.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ➕ PracticePage.jsx
    - ✏️ SearchBar.jsx
    - ➕ SeoHead.jsx
    - ✏️ SpeedSlider.jsx
    - ✏️ StatusDisplay.jsx
  - 📁 **data/**
    - ➕ complexityMap.js
  - 📁 **lib/**
    - ➕ utils.js
  - ✏️ App.jsx
  - ✏️ input.css
  - ✏️ main.jsx
- ➕ .env.example
- ✏️ .gitignore
- ➕ AlgoScope.zip
- ➕ CHANGELOG.md
- ✏️ CONTRIBUTING.md
- ✏️ eslint.config.js
- ✏️ index.html
- ✏️ package-lock.json
- ✏️ package.json
- ✏️ README.md
- ✏️ vercel.json
```

## [1.2.0] - 2026-05-11

### Added

- version bump
- search add(ctrl+k)
- redesign About page for a premium aesthetic
- add language selection to all algorithm sections
- refactor array search section to use unified playback system
- refactor all sorting algorithms to use step-playback engine
- improve bubble sort visualizer layout
- "new live code in bubble sort"
- add discord icon to footer and fix alignment
- discord-server invite link add

### Fixed

- version bumb
- add descriptive alt text to Navbar logo image
- linting fix
- formatting fix
- refine code viewer layout
- build, lint, format
- update broken footer links
- format - 2
- bubble sort fix page
- format
- repo links update
- dependency array add
- Canvas reload fix+lint fix2
- Canvas reload fix+lint fix
- Canvas reload fix
- add JavaScript heap sort implementation to CodeDisplay
- replace deleted author images with github profile urls
- formating fix
- resolve linting errors and improve component structure

### Changed

- implement route-level lazy loading and component memoization

### 📂 Changed Files

```
- 📁 **.flowbite-react/**
  - ❌ class-list.json
  - ❌ config.json
  - ❌ init.tsx
- 📁 **.github/**
  - 📁 **workflows/**
    - ➕ pipelines.yml
- 📁 **.vscode/**
  - ❌ extensions.json
- 📁 **public/**
  - ➕ _redirects
  - ➕ logo3.png
- 📁 **src/**
  - 📁 **algorithms/**
    - 📁 **searching/**
      - ➕ binarySearchSteps.js
      - ➕ graphSearchSources.js
      - ➕ linearSearchSteps.js
      - ➕ shortestPathSources.js
    - 📁 **sorting/**
      - ➕ bubbleSortSteps.js
      - ➕ countingSortSteps.js
      - ➕ heapSortSteps.js
      - ➕ insertionSortSteps.js
      - ➕ mergeSortSteps.js
      - ➕ quickSortSteps.js
      - ➕ radixSortSteps.js
      - ➕ selectionSortSteps.js
  - 📁 **assets/**
    - 📁 **old-home-images/**
      - ❌ bfs_dfs.png
      - ❌ graph.png
      - ❌ new-arr.png
      - ❌ Picture1.png
    - ❌ goku.png
    - ❌ logo.png
    - ❌ sukuna.png
  - 📁 **components/**
    - 📁 **about/**
      - ✏️ About.jsx
    - 📁 **arraySearch/**
      - ❌ BinarySearch.jsx
      - ❌ CodeDisplay.jsx
      - ❌ LinearSearch.jsx
      - ➕ Visualizer.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **dataStructures/**
      - ✏️ stackIV.jsx
      - ✏️ treeIV.jsx
    - 📁 **searchAlgo/**
      - ✏️ CanvasSearching.jsx
      - ❌ CodeDisplay.jsx
      - ✏️ MenuSelectAlgorithm.jsx
      - ❌ MenuSetAlgoSearch.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **shortestPathAlgo/**
      - ✏️ CanvasShortestPath.jsx
      - ❌ CodeDisplayShortestPath.jsx
      - ✏️ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ❌ CodeDisplay.jsx
      - ✏️ Visualizer.jsx
      - ✏️ VisualizerPage.jsx
    - 📁 **visualizer/**
      - ➕ CodePanel.jsx
      - ➕ useStepPlayback.js
    - ➕ AppLayout.jsx
    - ✏️ Footer.jsx
    - ✏️ Home.jsx
    - ✏️ Navbar.jsx
    - ➕ PageNotFound.jsx
    - ➕ SearchBar.jsx
    - ✏️ SpeedSlider.jsx
    - ✏️ StatusDisplay.jsx
  - 📁 **lib/**
    - ❌ utils.js
  - ✏️ App.jsx
  - ❌ output.css
- ✏️ .gitignore
- ❌ 2026-01-01-204659_hyprshot.png
- ➕ CODE_OF_CONDUCT.md
- ❌ components.json
- ✏️ CONTRIBUTING.md
- ✏️ eslint.config.js
- ✏️ index.html
- ✏️ jsconfig.json
- ✏️ nginx.conf
- ✏️ package-lock.json
- ✏️ package.json
- ✏️ README.md
- ✏️ vercel.json
- ✏️ vite.config.js
- ❌ yarn.lock
```

## [1.0.0] - 2026-05-07

### Added

- README update+CONTRIBUTING add
- add prominent arrow pointing to stack top
- stack, queue, tree is added.
- add smooth scroll to 'Start Exploring' button and fix eslint config
- add copy code button to code viewers

### Fixed

- ensure async animations complete reliably using onComplete

### Changed

- update home page images and organize assets

### 📂 Changed Files

```
- 📁 **.flowbite-react/**
  - ➕ class-list.json
  - ➕ config.json
  - ➕ init.tsx
- 📁 **.github/**
  - 📁 **workflows/**
    - ➕ main.yml
- 📁 **.vscode/**
  - ➕ extensions.json
- 📁 **public/**
  - ➕ logo.png
  - ➕ logo2.png
- 📁 **src/**
  - 📁 **assets/**
    - 📁 **new-home-images/**
      - ➕ adt.png
      - ➕ array.png
      - ➕ search.png
      - ➕ shortestPath.png
      - ➕ traversal.png
    - 📁 **old-home-images/**
      - ➕ bfs_dfs.png
      - ➕ graph.png
      - ➕ new-arr.png
      - ➕ Picture1.png
    - ➕ github-mark-white.svg
    - ➕ goku.png
    - ➕ logo.png
    - ➕ logo2.png
    - ➕ sukuna.png
  - 📁 **components/**
    - 📁 **about/**
      - ➕ About.jsx
      - ➕ AuthorCard.jsx
      - ➕ FeatureCard.jsx
    - 📁 **arraySearch/**
      - ➕ BinarySearch.jsx
      - ➕ CodeDisplay.jsx
      - ➕ LinearSearch.jsx
      - ➕ VisualizerPage.jsx
    - 📁 **dataStructures/**
      - ➕ DSLayout.jsx
      - ➕ queueIV.jsx
      - ➕ stackIV.jsx
      - ➕ treeIV.jsx
    - 📁 **searchAlgo/**
      - ➕ CanvasSearching.jsx
      - ➕ CodeDisplay.jsx
      - ➕ MenuSelectAlgorithm.jsx
      - ➕ MenuSelectNodeSearch.jsx
      - ➕ MenuSetAlgoSearch.jsx
      - ➕ VisualizerPage.jsx
    - 📁 **shortestPathAlgo/**
      - ➕ CanvasShortestPath.jsx
      - ➕ CodeDisplayShortestPath.jsx
      - ➕ MenuSelectNodesShortestPath.jsx
      - ➕ MenuSetAlgoShortestPath.jsx
      - ➕ ShortestPathPage.jsx
    - 📁 **sortingAlgo/**
      - ➕ CodeDisplay.jsx
      - ➕ Visualizer.jsx
      - ➕ VisualizerPage.jsx
    - ➕ AlgoCard.jsx
    - ➕ Footer.jsx
    - ➕ Home.jsx
    - ➕ Navbar.jsx
    - ➕ SpeedSlider.jsx
    - ➕ StatusDisplay.jsx
  - 📁 **lib/**
    - ➕ utils.js
  - ➕ App.css
  - ➕ App.jsx
  - ➕ input.css
  - ➕ main.jsx
  - ➕ output.css
- ➕ .dockerignore
- ➕ .gitignore
- ➕ .prettierrc
- ➕ 2026-01-01-204659_hyprshot.png
- ➕ components.json
- ➕ CONTRIBUTING.md
- ➕ Dockerfile
- ➕ eslint.config.js
- ➕ index.html
- ➕ jsconfig.json
- ➕ LICENSE
- ➕ nginx.conf
- ➕ package-lock.json
- ➕ package.json
- ➕ README.md
- ➕ vercel.json
- ➕ vite.config.js
- ➕ yarn.lock
```
