import React from 'react'
import { motion } from 'framer-motion'

const modules = [
  {
    title: 'CPU Scheduling',
    description: 'Visualize FCFS, SJF, Round Robin, and Priority Scheduling.',
  },
  {
    title: 'Page Replacement',
    description: 'Explore FIFO, LRU, and Optimal page replacement algorithms.',
  },
  {
    title: 'Disk Scheduling',
    description:
      'Understand SCAN, C-SCAN, SSTF, and disk head movement strategies.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

export default function OperatingSystemsPage() {
  return (
    <div className="theme-home min-h-screen w-full overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full border theme-border bg-white/[0.03] px-4 py-1.5">
            <span className="font-mono text-xs uppercase tracking-[0.25em] theme-text-muted">
              Operating Systems
            </span>
          </div>

          <h1 className="logo-font text-4xl font-semibold tracking-tight theme-text-strong md:text-5xl">
            Operating Systems
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-7 theme-text-muted md:text-base">
            Learn how operating systems manage processes, memory, and storage
            through interactive visualizations.
          </p>
        </motion.div>

        <div className="mt-20 mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
          <span className="font-mono text-sm uppercase tracking-[0.3em] theme-text-subtle">
            Modules
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 theme-text-strong" />
        </div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {modules.map((module) => (
            <motion.div
              key={module.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl border theme-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">
                <span className="text-xs font-medium text-cyan-400">
                  Coming Soon
                </span>
              </div>

              <h2 className="mb-3 text-xl font-semibold theme-text-strong">
                {module.title}
              </h2>

              <p className="text-sm leading-6 theme-text-muted">
                {module.description}
              </p>

              <div className="mt-6 text-sm font-medium text-cyan-400 transition-transform duration-300 group-hover:translate-x-1">
                Planned Module →
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
