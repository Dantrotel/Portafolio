import { useState, useEffect, useRef } from 'react'
import './Magnet.css'

export default function Magnet({
  children,
  padding = 40,
  disabled = false,
  magnetStrength = 2.5,
  activeTransition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
  inactiveTransition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
  className = '',
  wrapperClassName = '',
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const magnetRef = useRef(null)

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2

      const distX = Math.abs(centerX - e.clientX)
      const distY = Math.abs(centerY - e.clientY)

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsHovered(true)
        const offsetX = (e.clientX - centerX) / magnetStrength
        const offsetY = (e.clientY - centerY) / magnetStrength
        setPosition({ x: offsetX, y: offsetY })
      } else {
        setIsHovered(false)
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [padding, disabled, magnetStrength])

  const transitionStyle = isHovered ? activeTransition : inactiveTransition

  return (
    <div
      ref={magnetRef}
      className={`magnet-wrapper ${wrapperClassName}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: transitionStyle,
        willChange: 'transform',
      }}
    >
      <div className={className}>{children}</div>
    </div>
  )
}
