import { useState } from 'react'
import './ClickSpark.css'

export default function ClickSpark({
  sparkColor = 'var(--accent)',
  sparkSize = 10,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 500,
  children,
  className = '',
}) {
  const [sparks, setSparks] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now() + Math.random()

    const newSpark = { id, x, y }
    setSparks((prev) => [...prev, newSpark])

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id))
    }, duration)
  }

  return (
    <div className={`click-spark-container ${className}`} onClick={handleClick}>
      {children}
      {sparks.map((spark) => (
        <svg
          key={spark.id}
          className="click-spark-svg"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${sparkRadius * 2}px`,
            height: `${sparkRadius * 2}px`,
            transform: 'translate(-50%, -50%)',
          }}
          viewBox={`0 0 ${sparkRadius * 2} ${sparkRadius * 2}`}
          aria-hidden="true"
        >
          {Array.from({ length: sparkCount }).map((_, i) => {
            const angle = (i * 360) / sparkCount
            const rad = (angle * Math.PI) / 180
            const x2 = sparkRadius + Math.cos(rad) * sparkRadius
            const y2 = sparkRadius + Math.sin(rad) * sparkRadius
            const x1 = sparkRadius + Math.cos(rad) * (sparkRadius - sparkSize)
            const y1 = sparkRadius + Math.sin(rad) * (sparkRadius - sparkSize)

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={sparkColor}
                strokeWidth="2"
                strokeLinecap="round"
                className="spark-ray"
                style={{
                  animationDuration: `${duration}ms`,
                }}
              />
            )
          })}
        </svg>
      ))}
    </div>
  )
}
