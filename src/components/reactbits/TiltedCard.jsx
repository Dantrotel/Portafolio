import { useRef, useState } from 'react'
import './TiltedCard.css'

export default function TiltedCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  glareMaxOpacity = 0.25,
  as: Component = 'div',
  ...props
}) {
  const cardRef = useRef(null)
  const [transformStyle, setTransformStyle] = useState('')
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = (mouseX / width - 0.5) * 2
    const yPct = (mouseY / height - 0.5) * 2

    const rotateX = -yPct * maxTilt
    const rotateY = xPct * maxTilt

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    )

    if (glare) {
      const angle = Math.atan2(mouseY - height / 2, mouseX - width / 2) * (180 / Math.PI) - 90
      setGlareStyle({
        opacity: glareMaxOpacity,
        background: `linear-gradient(${angle}deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 80%)`,
      })
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlareStyle({ opacity: 0 })
  }

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`tilted-card ${className}`}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      {...props}
    >
      {glare && (
        <div
          className="tilted-card-glare"
          style={{
            ...glareStyle,
            transition: isHovered ? 'opacity 0.2s ease-out' : 'opacity 0.5s ease-out',
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  )
}
