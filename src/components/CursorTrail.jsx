import { useEffect, useRef } from 'react'
import { getSprite } from '../utils/sprites'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery'

const TRAIL = [
  ['heart', '#f7a1bb'],
  ['heart', '#ffc2d1'],
  ['sparkle', '#ffffff'],
  ['sparkle', '#f6dcae'],
  ['dot', '#ffd1dc'],
]

/** Desktop-only: a soft glow that follows the cursor and leaves tiny hearts & sparkles. */
export default function CursorTrail() {
  const finePointer = useFinePointer()
  const reduced = usePrefersReducedMotion()
  if (!finePointer || reduced) return null
  return <Trail />
}

function Trail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const glow = getSprite('dot', 'rgba(255,170,195,0.55)')
    const parts = []
    const mouse = { x: -100, y: -100 }
    const follower = { x: -100, y: -100 }
    let lastSpawn = { x: 0, y: 0 }
    let raf = 0
    let running = false

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }

    const loop = () => {
      follower.x += (mouse.x - follower.x) * 0.18
      follower.y += (mouse.y - follower.y) * 0.18

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.globalAlpha = 0.9
      ctx.setTransform(dpr, 0, 0, dpr, follower.x * dpr, follower.y * dpr)
      ctx.drawImage(glow, -22, -22, 44, 44)

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life -= 1
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.015
        const t = p.life / p.max
        ctx.globalAlpha = t * 0.85
        ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr)
        const s = p.size * (0.5 + t * 0.5)
        ctx.drawImage(p.sprite, -s / 2, -s / 2, s, s)
      }

      const settled = Math.abs(mouse.x - follower.x) < 0.3 && Math.abs(mouse.y - follower.y) < 0.3
      if (parts.length === 0 && settled) {
        running = false
        return
      }
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      mouse.x = e.clientX
      mouse.y = e.clientY
      const dx = mouse.x - lastSpawn.x
      const dy = mouse.y - lastSpawn.y
      if (dx * dx + dy * dy > 26 * 26) {
        lastSpawn = { ...mouse }
        const [type, color] = TRAIL[(Math.random() * TRAIL.length) | 0]
        const max = 40 + Math.random() * 25
        parts.push({
          sprite: getSprite(type, color),
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 0.3,
          size: type === 'heart' ? 10 + Math.random() * 6 : 8 + Math.random() * 6,
          life: max,
          max,
        })
        if (parts.length > 40) parts.shift()
      }
      start()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-90 h-full w-full" />
}
