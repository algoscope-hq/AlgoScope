import React from 'react'
import { Navbar } from './Navbar'
import Footer from './Footer'
import { motion } from 'framer-motion'
import SeoHead from './SeoHead'
import Breadcrumbs from './Breadcrumbs'
import ScrollToTopButton from './ScrollToTopButton'
import AlgorithmNotes from './notes/AlgorithmNotes'

const Background = () => (
  <div className="absolute inset-0 z-0 pointer-events-none fixed">
    <div className="theme-grid absolute inset-0 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
  </div>
)

export default function AppLayout({
  children,
  showBackground = true,
  notesKey,
}) {
  return (
    <motion.div
      className="theme-app min-h-screen flex flex-col relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SeoHead />

      {showBackground && <Background />}

      <div className="flex-1 flex flex-col gap-4 p-2 sm:p-4 z-10">
        <Navbar />

        <Breadcrumbs />

        {notesKey ? (
          <AlgorithmNotes key={notesKey} storageKey={notesKey} />
        ) : null}

        <div className="flex-1">{children}</div>

        <Footer />
        <ScrollToTopButton />
      </div>
    </motion.div>
  )
}
