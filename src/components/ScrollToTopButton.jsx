import { useEffect, useState } from 'react'
import { useTheme } from '../context/useTheme'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { isDark } = useTheme()

  useEffect(() => {
    let throttleTimeout = null

    const throttledToggle = () => {
      if (throttleTimeout) return

      throttleTimeout = setTimeout(() => {
        setIsVisible(window.scrollY > 300)
        throttleTimeout = null
      }, 150)
    }

    window.addEventListener('scroll', throttledToggle, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledToggle)
      if (throttleTimeout) clearTimeout(throttleTimeout)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            isDark ? 'bg-blue-950' : 'bg-indigo-500'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3.8}
            stroke="currentColor"
            style={{ width: '24px', height: '24px' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            />
          </svg>
        </button>
      )}
    </>
  )
}

export default ScrollToTopButton
