// Shared Background Component
const Background = () => (
  <div className="absolute inset-0 z-0 pointer-events-none fixed">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
  </div>
)

function App() {
  const darkTheme = 'bg-[#020617] text-slate-200'

            className={`min-h-screen flex flex-col ${darkTheme} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Home has its own background, so we might not need the shared one here if it conflicts, but let's keep it consistent or let Home override */}
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              <Home />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
    {
      path: '/search',
      element: (
        <>
          <motion.div
            className={`min-h-screen flex flex-col ${darkTheme} relative overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Background />
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              <VisualizerPage />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
    {
      path: '/spath',
      element: (
        <>
          <motion.div
            className={`min-h-screen flex flex-col ${darkTheme} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Background />
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              <ShortestPathPage />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
    {
      path: '/about',
      element: (
        <>
          <motion.div
            className={`min-h-screen flex flex-col ${darkTheme} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Background />
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              <AboutAlgoScope />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
    {
      path: '/sort',
      element: (
        <>
          <motion.div
            className={`min-h-screen flex flex-col ${darkTheme} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Background />
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              <SortingVisualizerPage />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
    {
      path: '/ldssearch',
      element: (
        <>
          <motion.div
            className={`min-h-screen flex flex-col ${darkTheme} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Background />
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              <ArrayVisualizerPage />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
    {
      path: '/adt',
      element: (
        <>
          <motion.div
            className={`min-h-screen flex flex-col ${darkTheme} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Background />
            <div className="flex-1 flex flex-col gap-4 p-4 z-10">
              <Navbar />
              {/* Insert the Data Structures Layout here */}
              <DSLayout />
              <Footer />
            </div>
          </motion.div>
        </>
      ),
    },
  ])

  return (
    <>
      <RouterProvider router={route} />
    </>
  )
}

export default App
