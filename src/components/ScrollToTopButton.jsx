import React, { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial mode
    setIsDark(document.documentElement.classList.contains('dark'))

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    toggleVisibility()

    // Listen for theme change toggles on the HTML element
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
      observer.disconnect()
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
          style={{
            // Hardcoded hex values to guarantee the colors match your mockup image perfectly
            backgroundColor: isDark ? '#0f285d' : '#6366f1', 
            color: '#ffffff', // Ensures the arrow is always crisp white
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
          }}
          className="fixed bottom-6 right-6 z-50 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          {/* Thick, striking white arrow matching the mockup */}
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