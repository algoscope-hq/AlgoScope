import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import githubIcon from '../assets/github-mark-white.svg'
import { APP_VERSION } from '../lib/version'

const Footer = () => {
  const algorithms = [
    {
      name: 'Sorting',
      path: '/sort',
      desc: 'Bubble, Merge, Quick & more',
      complexity: 'O(N log N)',
      color: 'hover:border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
    },
    {
      name: 'Searching',
      path: '/search',
      desc: 'Binary, Linear, & optimization',
      complexity: 'O(log N)',
      color: 'hover:border-blue-500/30 text-blue-400 bg-blue-500/5',
    },
    {
      name: 'Graphs',
      path: '/spath',
      desc: 'Dijkstra, BFS, DFS pathfinding',
      complexity: 'O(V + E)',
      color: 'hover:border-purple-500/30 text-purple-400 bg-purple-500/5',
    },
    {
      name: 'Backtracking',
      path: '/backtracking',
      desc: 'N-Queens, Sudoku solver & more',
      complexity: 'O(N!)',
      color: 'hover:border-rose-500/30 text-rose-400 bg-rose-500/5',
    },
    {
      name: 'Array Search',
      path: '/ldssearch',
      desc: 'Linear and Binary search visualization',
      complexity: 'O(log N)',
      color: 'hover:border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    },
    {
      name: 'Challenges',
      path: '/challenge',
      desc: 'Guess the running algorithm game',
      complexity: 'Interactive',
      color: 'hover:border-yellow-500/30 text-yellow-400 bg-yellow-500/5',
    },
  ]

  const performanceMetrics = [
    { label: 'Constant', notation: 'O(1)' },
    { label: 'Logarithmic', notation: 'O(log N)' },
    { label: 'Linear', notation: 'O(N)' },
    { label: 'Linearithmic', notation: 'O(N log N)' },
    { label: 'Quadratic', notation: 'O(N²)' },
  ]

  return (
    <motion.footer
      className="theme-footer relative max-w-7xl mx-auto mt-24 mb-6 overflow-hidden rounded-2xl border theme-border backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[120px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Box 1: Core Brand Showcase */}
        <div className="lg:col-span-1 theme-media-surface border theme-border rounded-xl p-6 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 theme-media-surface rounded-xl flex items-center justify-center p-1.5 border theme-border backdrop-blur shadow-inner">
                <img
                  src="/logo3.png"
                  alt="AlgoScope"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight theme-text-strong logo-font">
                  AlgoScope
                </h3>
                {/* Fixed Gap Space here */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-500 dark:text-cyan-400/80">
                    Telemetry Active
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm font-light leading-relaxed theme-text-muted">
              Deconstructing complex data structures and algorithm runtime
              behaviors through smooth, interactive web modules.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t theme-border">
            <div className="flex gap-2">
              <motion.a
                href="https://github.com/algoscope-hq/AlgoScope.git"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 theme-media-surface border theme-border rounded-lg flex items-center justify-center theme-text-muted hover:theme-text-strong transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <img
                  src={githubIcon}
                  alt="GitHub"
                  className="h-4 w-4 theme-text-muted invert dark:invert-0 opacity-80"
                />
              </motion.a>
              <motion.a
                href="https://discord.gg/Yj43j7YV9T"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 theme-media-surface border theme-border rounded-lg flex items-center justify-center theme-text-muted hover:text-[#5865F2] hover:bg-[#5865F2]/10 hover:border-[#5865F2]/20 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2758-3.68-.2758-5.4876 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.0276 13.0276 0 01-1.8713-.892.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.2259 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/aditya-paul-b8881a31b/"
                target="_blank"
                rel="noreferrer"
                title="Aditya Paul on LinkedIn"
                aria-label="Aditya Paul on LinkedIn"
                className="w-9 h-9 theme-media-surface border theme-border rounded-lg flex items-center justify-center theme-text-muted hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/20 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/bratik-mukherjee"
                target="_blank"
                rel="noreferrer"
                title="Bratik Mukherjee on LinkedIn"
                aria-label="Bratik Mukherjee on LinkedIn"
                className="w-9 h-9 theme-media-surface border theme-border rounded-lg flex items-center justify-center theme-text-muted hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/20 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
            </div>
            <Link
              to="/about"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs theme-text-muted hover:theme-text-strong font-medium transition-colors"
            >
              About Project &rarr;
            </Link>
          </div>
        </div>

        {/* Box 2: Interactive Bento Grid Hub */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {algorithms.map((algo, i) => {
            const badgeClasses = algo.color.split(' ').slice(1).join(' ')
            const borderHoverClass = algo.color.split(' ')[0]

            return (
              <Link
                key={i}
                to={algo.path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`group relative theme-media-surface border theme-border ${borderHoverClass} rounded-xl p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-md font-semibold theme-text-muted group-hover:theme-text-strong transition-colors">
                      {algo.name} Module
                    </h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border theme-border backdrop-blur-sm ${badgeClasses} tracking-wide font-medium shadow-sm transition-all duration-300 group-hover:scale-105`}
                    >
                      {algo.complexity}
                    </span>
                  </div>
                  <p className="text-xs theme-text-muted group-hover:theme-text-strong transition-colors font-light leading-relaxed opacity-70 group-hover:opacity-100">
                    {algo.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-wider theme-text-subtle group-hover:theme-text-strong font-semibold transition-colors">
                  <span>Launch Visualizer</span>
                  <span className="text-xs transform group-hover:translate-x-0.5 transition-transform duration-300">
                    &rarr;
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Box 3: Minimalist Bottom Ribbon & Interactive Complexity Counter */}
      <div className="mt-10 flex flex-col items-center gap-5 border-t border-slate-800 pt-6">
        <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="theme-text-muted font-medium">AlgoScope</span>{' '}
            &bull; Open Source Sandbox{' '}
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              {APP_VERSION}
            </span>
          </p>
          <div className="text-[11px] theme-text-subtle">
            Maintained by{' '}
            <a
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              href="https://github.com/Bimbok"
              target="_blank"
              rel="noreferrer"
            >
              bimbok
            </a>
            {' & '}
            <a
              target="_blank"
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              href="https://github.com/adityapaul26"
              rel="noreferrer"
            >
              adityapaul26
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 theme-media-surface border theme-border px-3 py-1.5 rounded-xl backdrop-blur-sm w-full lg:w-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider theme-text-subtle mr-1 cursor-default">
            Asymptotic Scales:
          </span>
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-[10px] font-mono px-2 py-0.5 rounded theme-media-surface border theme-border theme-text-muted cursor-help shadow-sm"
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(251, 113, 133, 0.05)',
                borderColor: 'rgba(251, 113, 133, 0.2)',
                color: '#fb7185',
              }}
              title={`${metric.label} Growth Rate`}
            >
              {metric.notation}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
