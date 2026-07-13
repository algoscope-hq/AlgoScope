import { motion } from 'framer-motion'
import { ArrowRight, LayoutGrid, Globe, Code2, Unlock } from 'lucide-react'
import { HeroProductPreview } from './HeroProductPreview'
import { APP_VERSION } from '../../lib/version'
import { VISUALIZER_COUNT } from '../../data/visualizerData'

const ease = [0.22, 1, 0.36, 1]

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease } },
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="theme-grid absolute inset-0 bg-[length:40px_40px] opacity-[0.26] [mask-image:radial-gradient(ellipse_80%_65%_at_65%_25%,#000_35%,transparent_88%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_42%_at_72%_32%,rgba(56,189,248,0.04),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_18%_55%,rgba(255,255,255,0.035),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_78%_35%,rgba(255,255,255,0.05),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.32] mix-blend-overlay [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjAyNSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-4 pt-[5rem] pb-10 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-[5.75rem] lg:pb-16">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.30fr)_minmax(0,0.70fr)] lg:gap-12 xl:gap-14">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="mx-auto w-full max-w-lg text-center sm:mx-0 sm:max-w-none sm:text-left lg:max-w-[340px] xl:max-w-[360px]"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border theme-border bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] theme-text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <motion.span
                  className="size-1.5 rounded-full bg-emerald-500"
                  animate={{ opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                {APP_VERSION} · open source
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              data-tour="hero-heading"
              variants={item}
              className="logo-font mt-4 text-[1.9rem] font-semibold leading-[1.04] tracking-[-0.04em] theme-text-strong sm:mt-5 sm:text-[2.4rem] lg:text-[2.75rem] xl:text-[2.95rem]"
            >
              Algorithms,
              <br />
              <span className="theme-text-muted">made </span>
              <span className="theme-text-strong dark:[text-shadow:0_0_40px_rgba(255,255,255,0.08)]">
                visible
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mx-auto mt-4 max-w-[34ch] font-mono text-[13px] leading-[1.6] theme-text-muted sm:mx-0 sm:mt-5 sm:text-[14px]"
            >
              Backtracking, graph traversal, and tree algorithms—watch every
              decision unfold in real time.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-6 flex w-full flex-col gap-2.5 sm:mt-7 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
            >
              <a
                href="#explore"
                data-tour="explore-visualizers-cta"
                onClick={(e) => {
                  e.preventDefault()
                  document
                    .getElementById('explore')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] theme-button-primary px-4 text-[13px] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-[transform,box-shadow,background] duration-300 active:scale-[0.98] sm:h-10 sm:w-auto sm:justify-start"
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                  }}
                />
                Explore visualizers
                <ArrowRight
                  className="relative size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </a>
              <a
                href="/practice"
                data-tour="practice-cta"
                className="inline-flex h-11 w-full items-center justify-center rounded-[10px] border theme-button-secondary px-4 text-[13px] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 active:scale-[0.98] sm:h-10 sm:w-auto"
              >
                Practice
              </a>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 border-t theme-border pt-5 text-[10px] theme-text-muted sm:mt-8 sm:justify-start sm:gap-x-3 sm:pt-6 sm:text-[11px]"
            >
              <Meta
                t={`${VISUALIZER_COUNT} visualizers`}
                icon={<LayoutGrid className="size-3" />}
              />
              <Meta t="Runs in browser" icon={<Globe className="size-3" />} />
              <Meta t="Open source" icon={<Code2 className="size-3" />} />
              <Meta t="Free to use" icon={<Unlock className="size-3" />} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease }}
            className="relative min-w-0 w-full"
          >
            <div
              className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05),transparent_68%)] blur-xl sm:-inset-4 sm:blur-2xl"
              aria-hidden
            />
            <HeroProductPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Meta({ t, icon }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md">
      {icon && <span className="opacity-50">{icon}</span>}
      <span>{t}</span>
    </span>
  )
}
