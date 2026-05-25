import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Terminal } from 'lucide-react'

const glitchKeyframes = `
@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-3px, 0); }
  20%       { clip-path: inset(30% 0 50% 0); transform: translate(3px, 0); }
  40%       { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
  60%       { clip-path: inset(80% 0 5% 0);  transform: translate(2px, 0); }
  80%       { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 0); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: inset(50% 0 30% 0); transform: translate(3px, 0); }
  25%       { clip-path: inset(10% 0 80% 0); transform: translate(-3px, 0); }
  50%       { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); }
  75%       { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 0); }
}

@keyframes scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

@keyframes flicker {
  0%, 95%, 100% { opacity: 1; }
  96%            { opacity: 0.4; }
  97%            { opacity: 1; }
  98%            { opacity: 0.6; }
}
`

const codeLines = [
  { text: '> initializing route resolver...', delay: 0 },
  { text: '  scanning algorithm registry...', delay: 0.3 },
  { text: '  checking nested paths...', delay: 0.6 },
  { text: '  [ERR] route not found: 0x404', delay: 0.9, error: true },
  { text: '  [ERR] null pointer → /this-path', delay: 1.1, error: true },
  { text: '  fallback handler triggered', delay: 1.4, warn: true },
]

export default function NotFound() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(canvas.offsetWidth * dpr)
      canvas.height = Math.floor(canvas.offsetHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let animId

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <style>{glitchKeyframes}</style>

      <div
        className="relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden select-none"
        style={{ fontFamily: "'Geist Mono', monospace" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.015) 2px, rgba(34,211,238,0.015) 4px)',
          }}
        />

        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)',
            animation: 'scanline 6s linear infinite',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
            style={{
              borderColor: 'rgba(34,211,238,0.3)',
              color: 'rgba(34,211,238,0.8)',
              background: 'rgba(34,211,238,0.05)',
            }}
          >
            <Terminal size={12} />
            <span>algoscope / routes / not-found</span>
          </motion.div>

          <div
            className="relative"
            style={{ animation: 'flicker 8s infinite' }}
          >
            <h1
              className="text-[120px] font-bold leading-none tracking-tighter"
              style={{
                color: '#22d3ee',
                fontFamily: "'Geist Mono', monospace",
                textShadow: '0 0 20px rgba(34,211,238,0.5)',
              }}
            >
              404
            </h1>

            <div
              aria-hidden="true"
              className="absolute inset-0 text-[120px] font-bold leading-none tracking-tighter"
              style={{
                color: '#f43f5e',
                fontFamily: "'Geist Mono', monospace",
                animation: 'glitch-1 3.5s infinite',
                opacity: 0.7,
              }}
            >
              404
            </div>

            <div
              aria-hidden="true"
              className="absolute inset-0 text-[120px] font-bold leading-none tracking-tighter"
              style={{
                color: '#818cf8',
                fontFamily: "'Geist Mono', monospace",
                animation: 'glitch-2 3.5s infinite',
                opacity: 0.7,
              }}
            >
              404
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p
              className="text-xl font-medium mb-1"
              style={{ color: 'var(--color-text-primary, #f1f5f9)' }}
            >
              Page not found
            </p>

            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary, #94a3b8)' }}
            >
              This route doesn&apos;t exist in the algorithm registry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full rounded-xl p-4 text-xs text-left"
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '0.5px solid rgba(34,211,238,0.2)',
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 pb-2"
              style={{ borderBottom: '0.5px solid rgba(34,211,238,0.1)' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" />

              <span
                className="ml-2 text-xs"
                style={{ color: 'rgba(34,211,238,0.4)' }}
              >
                terminal
              </span>
            </div>

            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + line.delay }}
                className="leading-6"
                style={{
                  color: line.error
                    ? '#f87171'
                    : line.warn
                      ? '#fbbf24'
                      : 'rgba(34,211,238,0.7)',
                }}
              >
                {line.text}

                {i === codeLines.length - 1 && (
                  <span
                    style={{
                      animation: 'cursor-blink 1s step-end infinite',
                      color: '#22d3ee',
                    }}
                  >
                    _
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex gap-3"
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: '#22d3ee',
                color: '#0f172a',
                fontFamily: "'Geist Mono', monospace",
              }}
            >
              <Home size={15} />
              Go home
            </Link>

            <button
              onClick={() =>
                window.history.length > 1 ? navigate(-1) : navigate('/')
              }
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'transparent',
                color: 'rgba(34,211,238,0.8)',
                border: '0.5px solid rgba(34,211,238,0.3)',
                fontFamily: "'Geist Mono', monospace",
              }}
            >
              <ArrowLeft size={15} />
              Go back
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
