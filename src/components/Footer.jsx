import React from 'react'
import { motion } from 'framer-motion'
import githubIcon from '../assets/github-mark-white.svg'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <motion.footer
      className="relative m-auto w-full text-slate-300 overflow-hidden rounded-xl bg-black/40 border-t border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40 "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm border border-white/10 overflow-hidden p-1">
                <img
                  src="/logo3.png"
                  alt=""
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight logo-font">
                AlgoScope
              </h3>
            </div>
            <p className="text-slate-400 text-sm max-w-xs font-light leading-relaxed">
              Visualize and understand algorithms with smooth, interactive
              animations.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Sorting', path: '/sort' },
                { name: 'Searching', path: '/search' },
                { name: 'Graphs', path: '/spath' },
                { name: 'Array Search', path: '/ldssearch' },
                { name: 'ADTs', path: '/adt' },
                { name: "Kadane's Algorithm", path: '/kadane' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <div className="flex flex-col space-y-3">
              <Link
                to="/about"
                onClick={() => window.scrollTo(0, 0)}
                className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
              >
                About
              </Link>

              <div className="flex items-center space-x-3">
                <motion.a
                  href="https://github.com/algoscope-hq/AlgoScope.git"
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={githubIcon}
                    alt="GitHub"
                    className="h-5 w-5 opacity-80 hover:opacity-100"
                  />
                </motion.a>
                <motion.a
                  href="https://discord.gg/Yj43j7YV9T"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg
                    fill="white"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 opacity-80 hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2758-3.68-.2758-5.4876 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.0276 13.0276 0 01-1.8713-.892.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.2259 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                  </svg>
                </motion.a>
              </div>
              <div className="text-sm text-slate-400">
                Maintained by{' '}
                <a
                  className="text-white hover:text-cyan-400 transition-colors"
                  href="https://github.com/Bimbok"
                >
                  bimbok
                </a>{' '}
                &{' '}
                <a
                  className="text-white hover:text-cyan-400 transition-colors"
                  href="https://github.com/adityapaul26"
                >
                  adityapaul26
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-white/5 bg-black/20 backdrop-blur-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="container mx-auto px-6 py-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} AlgoScope — Open Source Algorithm
            Visualizer
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
