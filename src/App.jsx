import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
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

const PracticePage = lazy(() => import('./components/PracticePage'))
const AboutAlgoScope = lazy(() => import('./components/about/About'))
const NotFound = lazy(() => import('./components/PageNotFound'))

// Simple fallback for Suspense
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
  </div>
)

function App() {
  const route = createBrowserRouter([
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
          <AppLayout>
            <VisualizerPage />
          </AppLayout>
        </Suspense>
      ),
    },
    {
      path: '/spath',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AppLayout>
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
            <SignedIn>
              <PracticePage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
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
          <AppLayout>
            <SortingVisualizerPage />
          </AppLayout>
        </Suspense>
      ),
    },
    {
      path: '/ldssearch',
      element: (
        <Suspense fallback={<PageLoader />}>
          <AppLayout>
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
          <AppLayout>
            <KadaneVisualizerPage />
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

  return <RouterProvider router={route} />
}

export default App
