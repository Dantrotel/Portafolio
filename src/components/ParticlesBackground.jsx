import { useEffect, useRef } from 'react'

export default function ParticlesBackground({ darkMode }) {
  const canvasRef = useRef(null)
  const isDarkRef = useRef(darkMode)

  useEffect(() => {
    isDarkRef.current = darkMode
  }, [darkMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H
    const mouse = { x: -9999, y: -9999, clicking: false }

    /* ── Constants ── */
    const NODE_COUNT   = 90
    const CONNECT_DIST = 160
    const REPEL_DIST   = 120
    const ATTRACT_DIST = 200
    const SPEED_MAX    = 1.8

    /* ── Resize ── */
    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    /* ── Nodes ── */
    let nodes = []

    function createNodes() {
      nodes = []
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x:   Math.random() * W,
          y:   Math.random() * H,
          vx:  (Math.random() - 0.5) * 1.2,
          vy:  (Math.random() - 0.5) * 1.2,
          radius: 1.8 + Math.random() * 2.5,
          hue: 180 + Math.random() * 80,
          pulseOffset: Math.random() * Math.PI * 2,
          energy: 0,
        })
      }
    }

    /* ── Ripples ── */
    let ripples = []

    function addRipple(x, y) {
      ripples.push({ x, y, r: 0, maxR: 200, life: 1.0 })
    }

    function updateRipples() {
      for (const r of ripples) {
        r.r    += 5
        r.life -= 0.022
      }
      ripples = ripples.filter(r => r.life > 0)
    }

    function drawRipples() {
      const isDark = isDarkRef.current
      for (const r of ripples) {
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(210, 100%, ${isDark ? 70 : 50}%, ${r.life * 0.35})`
        ctx.lineWidth   = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(r.x, r.y, r.r * 0.55, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(270, 100%, ${isDark ? 75 : 55}%, ${r.life * 0.2})`
        ctx.lineWidth   = 1
        ctx.stroke()
      }
    }

    /* ── Update Nodes ── */
    function updateNodes() {
      const t = performance.now() * 0.001

      for (const n of nodes) {
        /* Mouse interaction */
        const mdx  = n.x - mouse.x
        const mdy  = n.y - mouse.y
        const mdist = Math.hypot(mdx, mdy)

        if (mouse.clicking && mdist < ATTRACT_DIST) {
          n.vx -= (mdx / mdist) * 0.6
          n.vy -= (mdy / mdist) * 0.6
          n.energy = Math.min(1, n.energy + 0.05)
        } else if (mdist < REPEL_DIST) {
          const f = (REPEL_DIST - mdist) / REPEL_DIST * 0.4
          n.vx += (mdx / mdist) * f
          n.vy += (mdy / mdist) * f
          n.energy = Math.min(1, n.energy + 0.02)
        }

        /* Ripple push */
        for (const rp of ripples) {
          const rdx  = n.x - rp.x
          const rdy  = n.y - rp.y
          const rd   = Math.hypot(rdx, rdy)
          const diff = Math.abs(rd - rp.r)
          if (diff < 30) {
            const f = (1 - diff / 30) * rp.life * 0.8
            n.vx += (rdx / (rd + 1)) * f
            n.vy += (rdy / (rd + 1)) * f
            n.energy = Math.min(1, n.energy + 0.08)
          }
        }

        /* Slow drift / breathing */
        n.vx += Math.sin(t * 0.3 + n.pulseOffset) * 0.008
        n.vy += Math.cos(t * 0.25 + n.pulseOffset * 1.3) * 0.008

        /* Speed limit */
        const spd = Math.hypot(n.vx, n.vy)
        if (spd > SPEED_MAX) {
          n.vx = (n.vx / spd) * SPEED_MAX
          n.vy = (n.vy / spd) * SPEED_MAX
        }

        /* Damping */
        n.vx *= 0.985
        n.vy *= 0.985

        n.x += n.vx
        n.y += n.vy

        /* Wrap edges */
        if (n.x < -20)  n.x = W + 20
        if (n.x > W+20) n.x = -20
        if (n.y < -20)  n.y = H + 20
        if (n.y > H+20) n.y = -20

        /* Energy decay */
        n.energy *= 0.97
      }
    }

    /* ── Draw Connections ── */
    function drawConnections() {
      const isDark = isDarkRef.current
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > CONNECT_DIST) continue

          const t     = 1 - dist / CONNECT_DIST
          const energy= (a.energy + b.energy) * 0.5
          const hue   = 200 + energy * 60
          const alpha = t * t * (0.18 + energy * 0.55)
          const width = t * (0.5 + energy * 1.5)

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)

          const mx  = (a.x + b.x) * 0.5 + Math.sin(performance.now() * 0.0008 + i) * 8 * t
          const my  = (a.y + b.y) * 0.5 + Math.cos(performance.now() * 0.0006 + j) * 8 * t
          ctx.quadraticCurveTo(mx, my, b.x, b.y)

          ctx.strokeStyle = isDark 
            ? `hsla(${hue}, 90%, 65%, ${alpha})`
            : `hsla(${hue}, 80%, 55%, ${alpha})`
          ctx.lineWidth   = width
          ctx.stroke()
        }
      }
    }

    /* ── Draw Nodes ── */
    function drawNodes() {
      const isDark = isDarkRef.current
      const t = performance.now() * 0.001
      for (const n of nodes) {
        const pulse  = 0.5 + 0.5 * Math.sin(t * 1.8 + n.pulseOffset)
        const r      = n.radius + pulse * 1.2 + n.energy * 4
        const hue    = n.hue + n.energy * 40
        const bright = isDark ? 55 + n.energy * 30 : 45 + n.energy * 20

        /* Outer glow */
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4)
        grad.addColorStop(0,   `hsla(${hue}, 90%, ${bright}%, ${0.5 + n.energy * 0.4})`)
        grad.addColorStop(0.4, `hsla(${hue}, 80%, ${bright - 10}%, ${0.12 + n.energy * 0.15})`)
        grad.addColorStop(1,   `hsla(${hue}, 70%, 50%, 0)`)

        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        /* Core dot */
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hue}, 95%, ${bright + 15}%)`
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`
        ctx.shadowBlur  = isDark ? (8 + n.energy * 12) : (4 + n.energy * 8)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    /* ── Background Stars ── */
    let stars = []
    function createStars() {
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.8,
        a: Math.random() * 0.4 + 0.05,
      }))
    }
    function drawStars() {
      const isDark = isDarkRef.current
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? `rgba(180, 200, 255, ${s.a})` : `rgba(99, 102, 241, ${s.a * 0.6})`
        ctx.fill()
      }
    }

    /* ── Main Loop ── */
    let animationFrameId
    function loop() {
      const isDark = isDarkRef.current
      
      // Clear screen with a slight transparency for trails
      // #f8fafc is rgb(248, 250, 252) for light mode, #030510 is rgb(3, 5, 16) for dark
      ctx.fillStyle = isDark ? 'rgba(3, 5, 16, 0.18)' : 'rgba(248, 250, 252, 0.18)'
      ctx.fillRect(0, 0, W, H)

      drawStars()
      updateRipples()
      drawRipples()
      updateNodes()
      drawConnections()
      drawNodes()

      animationFrameId = requestAnimationFrame(loop)
    }

    /* ── Events ── */
    const handleResize = () => { resize(); createStars() }
    const handleMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const handleMouseDown = e => { mouse.clicking = true; addRipple(e.clientX, e.clientY) }
    const handleMouseUp = () => { mouse.clicking = false }
    const handleClick = e => { addRipple(e.clientX, e.clientY) }
    
    const handleTouchStart = e => {
      const t = e.touches[0]
      mouse.x = t.clientX; mouse.y = t.clientY
      mouse.clicking = true
      addRipple(t.clientX, t.clientY)
    }
    const handleTouchMove = e => {
      const t = e.touches[0]
      mouse.x = t.clientX; mouse.y = t.clientY
    }
    const handleTouchEnd = () => { mouse.clicking = false }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    /* ── Init ── */
    resize()
    createNodes()
    createStars()
    loop()

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}
