import React, { useState } from 'react'
import LogPanel from './LogPanel.jsx' 
import { Navbar } from './Navbar'
import Footer from './Footer'
import { motion } from 'framer-motion'
import SeoHead from './SeoHead'
import Breadcrumbs from './Breadcrumbs'

const Background = () => (
  <div className="absolute inset-0 z-0 pointer-events-none fixed">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
  </div>
)

export default function AppLayout({ children, showBackground = true }) {
  const darkTheme = 'bg-[#020617] text-slate-200'
  
  // States to hold execution logs
  const [logs, setLogs] = useState([])
  const [activeStack, setActiveStack] = useState([])

  return (
    <motion.div
      className={`min-h-screen flex flex-col ${darkTheme} relative overflow-hidden`}
      className="theme-app min-h-screen flex flex-col relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SeoHead />

      {showBackground && <Background />}

      <div className="flex-1 flex flex-col gap-4 p-2 sm:p-4 z-10">
        <Navbar />

        {/* Main Workspace Layout (Row format for sidebar alignment) */}
        <div className="flex-1 flex w-full gap-4 items-stretch relative">
          
          {/* Left Side: Existing components like grid, bars, forms */}
          <div className="flex-1 min-w-0">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
               return React.cloneElement(child, { setLogs, setActiveStack })
              }
              return child
            })}
          </div>

          {/* Right Side: Collapsible Console-Style Panel */}
          <LogPanel logs={logs} activeStack={activeStack} />
        </div>
        <Breadcrumbs />

        <div className="flex-1">{children}</div>

        <Footer />
      </div>
    </motion.div>
  )
}