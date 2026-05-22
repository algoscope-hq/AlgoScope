import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const MotionLink = motion(Link)

export default function AlgoCard({
  title,
  description,
  link,
  image,
  imageAlt,
  color,
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Extract color classes or fallback
  const colorClasses =
    color || 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'

  return (
    <MotionLink
      to={link}
      className={`group relative block w-full rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 ease-out text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 overflow-hidden ${colorClasses} border hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]`}
      variants={cardVariants}
      whileHover={{ y: -10 }}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Subtle background glow on hover */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors duration-700 pointer-events-none" />

      {/* Icon/Image Container */}
      {image && (
        <div className="relative z-10 w-20 h-20 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 mb-8 group-hover:scale-105 group-hover:border-white/20 transition-all duration-500 ease-out shadow-2xl">
          <img
            src={image}
            alt={imageAlt || `${title} visualization`}
            className="w-12 h-12 object-contain opacity-70 group-hover:opacity-100 transition-all duration-500"
          />
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-300">
          {title}
        </h2>

        <p className="text-base text-slate-400 leading-relaxed mb-10 group-hover:text-slate-300 transition-colors duration-300">
          {description}
        </p>

        {/* Bottom Action */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/[0.05]">
          <span className="text-sm font-bold tracking-widest uppercase text-cyan-400/80 group-hover:text-cyan-400 transition-colors duration-300">
            Explore Visualizer
          </span>

          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-500 shadow-lg">
            <ArrowRight className="w-5 h-5 group-hover:rotate-[45deg] transition-transform duration-500" />
          </div>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent group-hover:w-full transition-all duration-700 ease-in-out" />
    </MotionLink>
  )
}
