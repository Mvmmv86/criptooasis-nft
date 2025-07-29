import { useEffect, useRef, useState } from 'react'

const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)'
    
    switch (direction) {
      case 'up':
        return 'translate3d(0, 50px, 0)'
      case 'down':
        return 'translate3d(0, -50px, 0)'
      case 'left':
        return 'translate3d(-50px, 0, 0)'
      case 'right':
        return 'translate3d(50px, 0, 0)'
      default:
        return 'translate3d(0, 50px, 0)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  )
}

export default ScrollReveal