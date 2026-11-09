import { useEffect, useRef } from 'react'

export default function DotGrid({
  dotColor = 'rgba(143, 179, 238, 0.25)',
  activeColor = 'rgba(143, 179, 238, 0.9)',
  spacing = 28,
  dotRadius = 1.25,
  activeRadius = 3.5,
  proximity = 120,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let mouse = { x: -1000, y: -1000 }

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 }
    }

    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove)
      parent.addEventListener('mouseleave', handleMouseLeave)
    }

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const cols = Math.floor(rect.width / spacing)
      const rows = Math.floor(rect.height / spacing)
      const offsetX = (rect.width - cols * spacing) / 2
      const offsetY = (rect.height - rows * spacing) / 2

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing
          const y = offsetY + j * spacing

          const dx = mouse.x - x
          const dy = mouse.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)

          let currentRadius = dotRadius
          let currentColor = dotColor

          if (dist < proximity) {
            const factor = 1 - dist / proximity
            currentRadius = dotRadius + (activeRadius - dotRadius) * factor
            currentColor = activeColor
          }

          ctx.beginPath()
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
          ctx.fillStyle = currentColor
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', updateSize)
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [dotColor, activeColor, spacing, dotRadius, activeRadius, proximity])

  return (
    <canvas
      ref={canvasRef}
      className={`dot-grid-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
