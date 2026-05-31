import React from 'react'
import AuthorCard from './AuthorCard'
import FeatureCard from './FeatureCard'
import { motion } from 'framer-motion'
import { APP_VERSION } from '../../lib/version'

export default function AboutAlgoScope() {
  const aditya = 'https://github.com/adityapaul26.png'
  const bratik = 'https://github.com/Bimbok.png'
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Real-time Visualization',
      description:
        'Watch algorithms come alive with smooth, step-by-step animations',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: 'Adjustable Speed',
      description: 'Control animation speed to learn at your own pace',
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: 'Multiple Algorithms',
      description: 'Explore sorting, searching, and graph algorithms',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      title: 'Clean Code View',
      description: 'See implementation in multiple programming languages',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-12 lg:py-20">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-20 space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-4">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
            Our Mission
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
          Visualizing the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Future of DSA
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
          AlgoScope transforms abstract code into dynamic, step-by-step
          animations, empowering the next generation of developers to master
          logic through motion.
        </p>
      </motion.div>

      {/* Main Grid Content */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* About Card */}
        <motion.div
          className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl overflow-hidden relative group"
          variants={itemVariants}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10 group-hover:bg-cyan-500/20 transition-colors duration-700"></div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-10 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Our Story
            </h2>
          </div>

          <div className="text-xl space-y-6 text-slate-300 leading-relaxed font-light">
            <p>
              AlgoScope was born from a simple observation:{' '}
              <span className="text-white font-medium italic underline decoration-cyan-500/50 underline-offset-4">
                Logic is easier to understand when you can see it.
              </span>
            </p>
            <p>
              In a world of static textbooks and dry documentation, we wanted to
              build a tool that felt alive. By merging cutting-edge web
              technologies with academic rigor, we&apos;ve created a sandbox
              where complexity becomes clarity.
            </p>{' '}
            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5">
              <div>
                <p className="text-2xl font-bold text-white">10+</p>
                <p className="text-sm text-slate-500 uppercase tracking-widest">
                  Algorithms
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-sm text-slate-500 uppercase tracking-widest">
                  Languages
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-sm text-slate-500 uppercase tracking-widest">
                  Interactive
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400 font-mono">
                  {APP_VERSION}
                </p>
                <p className="text-sm text-slate-500 uppercase tracking-widest">
                  Version
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Vision Card */}
        <motion.div
          className="lg:col-span-4 bg-gradient-to-br from-indigo-600/20 to-purple-900/30 backdrop-blur-xl rounded-[2.5rem] p-8 border border-indigo-500/20 shadow-2xl flex flex-col justify-center"
          variants={itemVariants}
        >
          <div className="bg-indigo-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
            Empowering Visual Learning
          </h3>
          <p className="text-indigo-100/70 text-lg font-light leading-relaxed">
            We believe that understanding the &quot;how&quot; and
            &quot;why&quot; is more important than memorizing syntax. AlgoScope
            is our contribution to making computer science more accessible to
            everyone.
          </p>
        </motion.div>

        {/* Features Sub-grid */}
        <div className="lg:col-span-12 mt-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-10 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full shadow-[0_0_15px_rgba(192,132,252,0.5)]"></div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Core Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="lg:col-span-12 mt-12 pb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
              <h2 className="text-4xl font-bold text-white tracking-tight">
                The Architects
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div variants={itemVariants}>
              <AuthorCard
                name="Aditya Paul"
                role="Full Stack Architect"
                image={aditya}
                github="https://github.com/adityapaul26"
                linkedin="https://linkedin.com/in/aditya-paul-b8881a31b/"
                description="Specializing in complex state management and high-performance frontend animations."
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AuthorCard
                name="Bratik Mukherjee"
                role="SYSTEM ARCHITECT & MAINTAINER"
                image={bratik}
                github="https://github.com/Bimbok"
                linkedin="https://linkedin.com/in/bratik-mukherjee"
                description="Focused on creating seamless user experiences and intuitive algorithm visualizations."
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
