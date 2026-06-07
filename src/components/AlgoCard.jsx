import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MoveUpRight } from 'lucide-react'
import DifficultyBadge from './DifficultyBadge'

const MotionLink = motion(Link)

export default function AlgoCard({
  title,
  description,
  link,
  color,
  difficulty,
}) {
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

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
    hover: {
      scale: 1.02,
      y: -8,
      transition: { duration: 0.2 },
    },
  }

  const colorClasses =
    color || 'theme-card theme-border hover:border-neutral-700'

  return (
    <MotionLink
      to={link}
      onClick={() => window.scrollTo(0, 0)}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative block w-full rounded-3xl p-8 backdrop-blur-2xl transition-all duration-500 ease-out text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 overflow-hidden ${colorClasses} border hover:-translate-y-2 hover:shadow-2xl`}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      {/* Dynamic Mouse Spotlight Background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isHovering
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--theme-border-strong), transparent 40%)`
            : 'transparent',
        }}
      />

      {/* Subtle Inner Glow Border tracking mouse */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{
          background: isHovering
            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--theme-border), transparent 40%)`
            : 'transparent',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* Background Dots Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-700 bg-[radial-gradient(var(--theme-text-strong)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Decorative Abstract Shape */}
      <div className="absolute top-8 right-8 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 dark:mix-blend-overlay">
        <div className="w-20 h-20 border-[1px] border-current rounded-full absolute -top-4 -right-4 group-hover:scale-[1.3] transition-transform duration-700 ease-out theme-text-strong" />
        <div className="w-16 h-16 border-[1px] border-current rounded-xl absolute top-0 right-0 transform rotate-45 group-hover:rotate-90 group-hover:scale-110 transition-all duration-700 ease-out theme-text-strong" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full min-h-[200px]">
        <div className="mb-4 mt-2 flex flex-col gap-3 items-start">
          {difficulty && <DifficultyBadge difficulty={difficulty} />}
          <h2 className="text-2xl md:text-3xl font-extrabold theme-text-strong tracking-tight mb-3 transition-all duration-300">
            {title}
          </h2>
          <div className="w-8 h-1 bg-current opacity-20 rounded-full group-hover:w-16 group-hover:opacity-60 transition-all duration-500 ease-out theme-text-strong" />
        </div>

        <p className="text-base theme-text-muted leading-relaxed mb-10 group-hover:theme-text-strong transition-colors duration-300 max-w-[90%] font-light">
          {description}
        </p>

        {/* Bottom Action */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t theme-border group-hover:border-current group-hover:border-opacity-30 transition-colors duration-500 theme-text-muted">
          <span className="text-sm font-bold tracking-widest uppercase theme-text-subtle group-hover:theme-text-strong transition-colors duration-300">
            Explore
          </span>

          <div className="flex items-center justify-center w-12 h-12 rounded-2xl theme-media-surface border theme-border group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <MoveUpRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </MotionLink>
  )
}
