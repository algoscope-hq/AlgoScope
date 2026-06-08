import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
// import DPVisualizer from "./components/dynamicProgramming/DPVisualizer";

const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
import AppLayout from './components/AppLayout'

// Lazy load pages for better performance
const Home = lazy(() =>
  import('./components/Home').then((module) => ({ default: module.Home }))
)
const SortingVisualizerPage = lazy(
  () => import('./components/sortingAlgo/VisualizerPage')
)
const VisualizerPage = lazy(() =>
  import('./components/searchAlgo/VisualizerPage').then((module) => ({
    default: module.VisualizerPage,
  }))
)

const MathTheory = lazy(() =>
  import('./components/MathTheory/MathSoloVisualizer').then((module) => ({
    default: module.MathSoloVisualizer,
  }))
)
const ShortestPathPage = lazy(() =>
  import('./components/shortestPathAlgo/ShortestPathPage').then((module) => ({
    default: module.ShortestPathPage,
  }))
)
const DSLayout = lazy(() =>
  import('./components/dataStructures/DSLayout').then((module) => ({
    default: module.DSLayout,
  }))
)
const ArrayVisualizerPage = lazy(
  () => import('./components/arraySearch/VisualizerPage')
)

const KadaneVisualizerPage = lazy(
  () => import('./components/kadaneAlgo/VisualizerPage')
)

const MooreVotingVisualizerPage = lazy(
  () => import('./components/mooreVotingAlgo/VisualizerPage')
)

const BacktrackingVisualizerPage = lazy(
  () => import('./components/backtrackingAlgo/VisualizerPage')
)
const StringAlgoVisualizerPage = lazy(
  () => import('./components/stringAlgo/VisualizerPage')
)

const DPVisualizerPage = lazy(
  () => import('./components/dynamicProgramming/DPVisualizer')
)
const DPOptimizationJourneyPage = lazy(
  () => import('./components/dynamicProgramming/DPOptimizationJourney') // Path to your main component
)
const PracticePage = lazy(() => import('./components/PracticePage'))
const AboutAlgoScope = lazy(() => import('./components/about/About'))
const NotFound = lazy(() => import('./components/PageNotFound'))
const ChallengePage = lazy(() => import('./components/challenge/ChallengePage'))
const OperatingSystemsPage = lazy(
  () => import('./components/operatingSystems/OperatingSystemsPage')
)

// Simple fallback for Suspense
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout showBackground={false}>
          <Home />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/search',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-search">
          <VisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/math-theory',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-math-theory">
          <MathTheory />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/spath',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-shortest-path">
          <ShortestPathPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/practice',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          {HAS_CLERK ? (
            <>
              <SignedIn>
                <PracticePage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          ) : import.meta.env.DEV ? (
            // Allow access to PracticePage only in development when Clerk is not configured
            <PracticePage />
          ) : (
            // In non-dev environments without Clerk, redirect to home (or show unauthorized)
            <Navigate to="/" replace />
          )}
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <AboutAlgoScope />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/sort',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-sorting">
          <SortingVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/ldssearch',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-array-search">
          <ArrayVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/adt',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <DSLayout />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/kadane',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-kadane">
          <KadaneVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/moore-voting',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-moore-voting">
          <MooreVotingVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/backtracking',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-backtracking">
          <BacktrackingVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/dynamic-programming',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-dynamic-programming">
          <DPVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/dp-journey',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-dp-journey">
          <DPOptimizationJourneyPage />
        </AppLayout>
      </Suspense>
    ),
  },

  {
    path: '/challenge',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <ChallengePage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/string-algorithms',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout notesKey="algo-notes-string-algorithms">
          <StringAlgoVisualizerPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '/operating-systems',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <OperatingSystemsPage />
        </AppLayout>
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <NotFound />
        </AppLayout>
      </Suspense>
    ),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
