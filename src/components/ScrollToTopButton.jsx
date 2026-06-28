import { useEffect, useState, useRef } from 'react'

const ScrollToTopButton = () => {
  const [showTop, setShowTop] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  const [isIdle, setIsIdle] = useState(true)
  const idleTimerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      const isScrollable = docHeight > windowHeight
      setShowTop(isScrollable && scrollY > 300)
      setShowBottom(isScrollable && scrollY + windowHeight < docHeight - 300)

      setIsIdle(false)
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 2000)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollToBottom = () =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })

  const btnBase =
    'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-out border border-white/10 backdrop-blur-sm'
  const btnVisible = `opacity-100 translate-y-0 ${isIdle ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`
  const btnHidden = 'opacity-0 translate-y-4 pointer-events-none'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`${btnBase} ${showTop ? btnVisible : btnHidden} bg-slate-800/80 hover:bg-violet-600 text-slate-300 hover:text-white`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3.2}
          stroke="currentColor"
          className="w-4.5 h-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </button>
      <button
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        className={`${btnBase} ${showBottom ? btnVisible : btnHidden} bg-slate-800/80 hover:bg-violet-600 text-slate-300 hover:text-white`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3.2}
          stroke="currentColor"
          className="w-4.5 h-4.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      </button>
    </div>
  )
}

export default ScrollToTopButton
