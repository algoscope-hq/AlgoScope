import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { X } from 'lucide-react'

const HAS_CLERK = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
import { motion, AnimatePresence } from 'framer-motion'
import { getNavLinkClasses } from './navbarLinkStyles'

import githubIcon from '../assets/github-mark-white.svg'
import logo from '../assets/logo2.png'
import SearchBar from './SearchBar'
import { useTheme } from '../context/useTheme'

const bounceTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 15,
}

const topVariants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: 45, y: 6 },
}

const middleVariants = {
  closed: { opacity: 1 },
  open: { opacity: 0 },
}

const bottomVariants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: -45, y: -6 },
}

const Line = ({ variants }) => (
  <motion.div
    className="h-0.5 w-5 bg-current"
    variants={variants}
    transition={bounceTransition}
  />
)

const ThemeToggleButton = ({ compact = false, ...props }) => {
  const { isDark, toggleTheme } = useTheme()
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`theme-toggle inline-flex items-center justify-center rounded-xl border transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 ${
        compact ? 'h-10 w-10' : 'h-10 w-10 md:h-10 md:w-10'
      }`}
      {...props}
    >
      {isDark ? (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36-1.42 1.42M7.05 16.95l-1.41 1.41m12.72 0-1.42-1.41M7.05 7.05 5.64 5.64M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"
          />
        </svg>
      )}
    </button>
  )
}

const algorithmLinks = [
  { name: 'Search', href: '/search', difficulty: 'Beginner' },
  { name: 'Sort', href: '/sort', difficulty: 'Beginner' },
  { name: 'Array Search', href: '/ldssearch', difficulty: 'Beginner' },
  { name: 'Shortest Path', href: '/spath', difficulty: 'Intermediate' },
  { name: 'Abstract Data Types', href: '/adt', difficulty: 'Intermediate' },
  { name: "Kadane's Algorithm", href: '/kadane', difficulty: 'Intermediate' },
  {
    name: "Moore's Voting Algorithm",
    href: '/moore-voting',
    difficulty: 'Intermediate',
  },
  { name: 'Math Theory', href: '/math-theory', difficulty: 'Intermediate' },
  {
    name: 'String Algorithms',
    href: '/string-algorithms',
    difficulty: 'Advanced',
  },
  { name: 'Backtracking', href: '/backtracking', difficulty: 'Advanced' },
  {
    name: 'Dynamic Programming',
    href: '/dynamic-programming',
    difficulty: 'Advanced',
  },
  {
    name: 'DP Optimization Journey',
    href: '/dp-journey',
    difficulty: 'Advanced',
  },
  {
    name: 'Sliding Window',
    href: '/sliding-window',
    difficulty: 'Advanced',
  },
  {
    name: 'Two Pointer Approach',
    href: '/two-pointer',
    difficulty: 'Advanced',
  },
  {
    name: 'Greedy Algorithms',
    href: '/greedy',
    difficulty: 'Intermediate',
  },
  {
    name: 'Monotonic Stack',
    href: '/monotonic-stack',
    difficulty: 'Advanced',
  },
  { name: 'Practice Sandbox', href: '/practice', difficulty: 'Intermediate' },
  {
    name: 'Guess the Algorithm',
    href: '/challenge',
    difficulty: 'Intermediate',
  },
]

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [exploreOpen, setExploreOpen] = useState(false)
  const exploreButtonRef = useRef(null)
  const { isDark } = useTheme()

  const { pathname } = useLocation()
  const isExploreMenuOpen = hoveredTab === 'explore' || exploreOpen
  const isExploreActive = algorithmLinks.some(
    (link) =>
      link.href !== '/practice' &&
      link.href !== '/challenge' &&
      pathname.startsWith(link.href)
  )

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('algo-history')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to parse algo-history:', error)
      return []
    }
  })

  useEffect(() => {
    const current = algorithmLinks.find((link) => link.href === pathname)?.name

    if (current) {
      const timer = setTimeout(() => {
        setHistory((prev) => {
          if (prev[0] === current) return prev
          const updated = [current, ...prev.filter((item) => item !== current)]
          return updated.slice(0, 5)
        })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    localStorage.setItem('algo-history', JSON.stringify(history))
  }, [history])

  const closeExploreMenu = useCallback(() => {
    setExploreOpen(false)
    setHoveredTab((current) => (current === 'explore' ? null : current))
  }, [])

  const handleExploreKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setExploreOpen((current) => !current)
      setHoveredTab('explore')
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeExploreMenu()
      exploreButtonRef.current?.focus()
    }
  }

  const handleExploreBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeExploreMenu()
    }
  }

  return (
    <header className="sticky top-3 z-50 mx-auto mb-6 w-full max-w-7xl px-3 py-2 sm:px-4 lg:px-6">
      <div className="theme-navbar rounded-[28px] border border-slate-200/80 bg-white/75 px-3.5 py-3 shadow-[0_20px_70px_-24px_rgba(15,23,42,0.28)] backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/75 dark:shadow-[0_20px_70px_-24px_rgba(2,6,23,0.55)]">
        <div className="relative flex min-h-14 items-center justify-between gap-3">
          <Link
            to="/"
            data-tour="logo-brand"
            className="group flex min-w-0 flex-row items-center gap-3 text-xl font-semibold tracking-tight"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-gradient-to-br from-indigo-500/15 via-white to-cyan-400/20 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-md dark:border-slate-800/70 dark:from-indigo-500/20 dark:via-slate-900/70 dark:to-cyan-400/10">
              <img src={logo} alt="AlgoScope Logo" className="h-8 w-8" />
            </div>

            <span className="text-[1.3rem] font-semibold tracking-[-0.03em] text-slate-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300 logo-font">
              AlgoScope
            </span>
          </Link>

          {/* Desktop Search */}
          <div
            data-tour="search-bar"
            className="hidden flex-1 justify-center md:flex md:max-w-sm lg:max-w-md xl:max-w-lg"
          >
            <SearchBar onOpen={closeExploreMenu} />
          </div>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <ul
              className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-slate-800/80 dark:bg-slate-900/70"
              onMouseLeave={() => setHoveredTab(null)}
            >
              {/* Explore Trigger */}
              <li
                className="relative group py-1.5"
                onMouseEnter={() => setHoveredTab('explore')}
                onBlur={handleExploreBlur}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault()
                    closeExploreMenu()
                    exploreButtonRef.current?.focus()
                  }
                }}
              >
                <button
                  ref={exploreButtonRef}
                  data-tour="explore-nav"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isExploreMenuOpen}
                  aria-controls="desktop-explore-menu"
                  onClick={() => {
                    setExploreOpen((current) => !current)
                    setHoveredTab('explore')
                  }}
                  onKeyDown={handleExploreKeyDown}
                  className={`relative z-10 cursor-pointer ${getNavLinkClasses({ isActive: isExploreActive, isDark: isDark })}`}
                >
                  Explore
                </button>
                {isExploreMenuOpen && (
                  <motion.div
                    layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-full border border-slate-300/30 bg-slate-200/70 dark:border-slate-800/50 dark:bg-slate-900/70 -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}

                <div
                  id="desktop-explore-menu"
                  role="menu"
                  className={`absolute left-0 top-full mt-3 w-72 max-h-[70vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_20px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl transition-all duration-300 z-50 dark:border-slate-800/80 dark:bg-slate-950/95 ${
                    isExploreMenuOpen
                      ? 'visible opacity-100 translate-y-0'
                      : 'invisible opacity-0 translate-y-2'
                  }`}
                >
                  {algorithmLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      role="menuitem"
                      onClick={closeExploreMenu}
                      className={`block rounded-2xl border-l-2 px-4 py-2.5 text-sm transition-all duration-200 ${
                        pathname === link.href
                          ? 'border-indigo-600 bg-indigo-50/80 font-semibold text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                          : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="my-2 border-t border-slate-200 dark:border-slate-800/80" />

                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Recent
                  </p>

                  {history.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-slate-500">
                      No recent algorithms
                    </p>
                  ) : (
                    history.map((item) => {
                      const matched = algorithmLinks.find(
                        (link) => link.name === item
                      )

                      return (
                        <Link
                          key={item}
                          to={matched?.href || '/'}
                          role="menuitem"
                          onClick={closeExploreMenu}
                          className="block rounded-lg px-4 py-2 text-sm transition-all duration-200 border-l-2 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          {item}
                        </Link>
                      )
                    })
                  )}
                </div>
              </li>

              {/* Top Level Link: Concepts */}
              <li
                className="relative py-1.5"
                onMouseEnter={() => setHoveredTab('concepts')}
              >
                <Link
                  to="/concepts"
                  className={getNavLinkClasses({
                    isActive: pathname === '/concepts',
                    isDark: isDark,
                  })}
                >
                  Concepts
                </Link>
                {hoveredTab === 'concepts' && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/50 rounded-lg -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </li>

              {/* Top Level Link: Practice */}
              <li
                className="relative py-1.5"
                onMouseEnter={() => setHoveredTab('practice')}
              >
                <Link
                  to="/practice"
                  data-tour="practice-nav"
                  className={getNavLinkClasses({
                    isActive: pathname === '/practice',
                    isDark: isDark,
                  })}
                >
                  Practice
                </Link>
                {hoveredTab === 'practice' && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/50 rounded-lg -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </li>

              {/* Top Level Link: Challenge */}
              <li
                className="relative py-1.5"
                onMouseEnter={() => setHoveredTab('challenge')}
              >
                <Link
                  to="/challenge"
                  data-tour="challenge-nav"
                  className={getNavLinkClasses({
                    isActive: pathname === '/challenge',
                    isDark: isDark,
                  })}
                >
                  Challenge
                </Link>
                {hoveredTab === 'challenge' && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/50 rounded-lg -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </li>

              {/* Top Level Link: Favorites */}
              <li
                className="relative py-1.5"
                onMouseEnter={() => setHoveredTab('favorites')}
              >
                <Link
                  to="/favorites"
                  data-tour="favorites-nav"
                  className={getNavLinkClasses({
                    isActive: pathname === '/favorites',
                    isDark: isDark,
                  })}
                >
                  Favorites
                </Link>
                {hoveredTab === 'favorites' && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/60 border border-slate-300/30 dark:border-slate-800/50 rounded-lg -z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
              </li>
            </ul>

            <ThemeToggleButton data-tour="theme-toggle" />

            <a
              href="https://github.com/algoscope-hq/AlgoScope"
              data-tour="github-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              title="GitHub Repository"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800/80"
            >
              <img
                src={githubIcon}
                alt="GitHub"
                className="w-5 h-5 dark:invert-0 invert"
              />
            </a>

            <div
              data-tour="profile-nav"
              className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800/80 pl-3 lg:pl-4"
            >
              {HAS_CLERK ? (
                <>
                  <SignedOut>
                    <Link
                      to="/sign-in"
                      className="theme-button-primary relative group overflow-hidden rounded-full border border-slate-200/80 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(79,70,229,0.16)] active:scale-95 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200"
                    >
                      <span className="relative z-10">Sign In</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox:
                            'w-9 h-9 border border-white/10 shadow-xl',
                        },
                      }}
                    />
                  </SignedIn>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  className="theme-button-primary relative group overflow-hidden rounded-full border border-slate-200/80 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(79,70,229,0.16)] active:scale-95 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggleButton compact />

            {HAS_CLERK && (
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-8 h-8 border border-white/10',
                    },
                  }}
                />
              </SignedIn>
            )}

            <motion.button
              type="button"
              data-tour="mobile-menu-btn"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              animate={open ? 'open' : 'closed'}
              className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800/80"
            >
              <Line variants={topVariants} />
              <Line variants={middleVariants} />
              <Line variants={bottomVariants} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Portaled to document.body for viewport fixed positioning) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] md:hidden"
                />
                {/* Slide-out Drawer Panel */}
                <motion.div
                  key="mobile-drawer"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-[92vw] max-w-[22rem] rounded-l-[28px] border-l border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl z-[110] md:hidden flex flex-col dark:border-slate-800/80 dark:bg-slate-950/95"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800/80">
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={logo}
                        alt="AlgoScope Logo"
                        className="w-8 h-8"
                      />
                      <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white logo-font">
                        AlgoScope
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-2xl p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Drawer Body - Scrollable */}
                  <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                    {/* Search */}
                    <div className="w-full">
                      <SearchBar
                        onOpen={() => {
                          closeExploreMenu()
                          setOpen(false)
                        }}
                      />
                    </div>

                    {/* Nav list */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 px-2">
                        Explore Algorithms
                      </h3>
                      <ul className="space-y-1">
                        {algorithmLinks.map((link) => (
                          <li key={link.name}>
                            <Link
                              to={link.href}
                              onClick={() => setOpen(false)}
                              className={`block rounded-2xl border-l-2 px-4 py-2.5 text-sm transition-all duration-200 ${
                                pathname === link.href
                                  ? 'border-indigo-600 bg-indigo-50/80 font-semibold text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                              }`}
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                    {HAS_CLERK ? (
                      <SignedOut>
                      <Link
                        to="/sign-in"
                        className="group relative flex w-full overflow-hidden rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 active:scale-[0.98]"
                      >
                        <span className="relative z-10">Sign In</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>
                    </SignedOut>
                    ) : (
                      <button
                        title="Auth not configured"
                        disabled
                        className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500 opacity-50 transition-all duration-300 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900"
                      >
                        Sign In
                      </button>
                    )}

                    <a
                      href="https://github.com/algoscope-hq/AlgoScope"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <img
                        src={githubIcon}
                        alt="Github Repository Link"
                        className="w-5 h-5 dark:invert-0 invert"
                      />
                      <span>Github</span>
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  )
}
