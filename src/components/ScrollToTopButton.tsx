import { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
  const [showTop, setShowTop] = useState(false)
  const [showBottom, setShowBottom] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      const isScrollable = docHeight > windowHeight
      setShowTop(isScrollable && scrollY > 300)
      setShowBottom(isScrollable && scrollY + windowHeight < docHeight - 300)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollToBottom = () =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {showTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3.2}
            stroke="#ffffff"
            className="w-4.5 h-4.5 opacity-80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            />
          </svg>
        </button>
      )}
      {showBottom && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3.2}
            stroke="#ffffff"
            className="w-4.5 h-4.5 opacity-80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ScrollToTopButton
