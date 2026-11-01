import { useEffect, useRef } from 'react'
import { getSprite, PARTICLE_COLORS } from '../utils/sprites'

const DEFAULT_MIX = { heart: 0.24, sparkle: 0.18, star: 0.22, dot: 0.2, petal: 0.16 }

const SIZE_RANGE = {
  heart: [9, 20],
  sparkle: [8, 15],
  star: [4, 8],
  dot: [10, 26],
  petal: [12, 20],
}

const ALPHA_RANGE = {
  heart: [0.22, 0.5],
  sparkle: [0.45, 0.9],
  star: [0.5, 0.95],
  dot: [0.35, 0.75],
  petal: [0.35, 0.65],
}

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

function pickType(mix) {
  let r = Math.random()
  for (const [type, w] of Object.entries(mix)) {
    if ((r -= w) <= 0) return type
  }
  return 'dot'
}

function makeParticle(w, h, mix, anywhere) {
  const type = pickType(mix)
  const falls = type === 'petal'
  return {
    type,
    sprite: getSprite(type, pick(PARTICLE_COLORS[type])),
    x: rand(0, w),
    y: anywhere ? rand(0, h) : falls ? -30 : h + 30,
    size: rand(...SIZE_RANGE[type]),
    alpha: rand(...ALPHA_RANGE[type]),
    vy: falls ? rand(0.18, 0.4) : -rand(0.1, 0.35),
    sway: rand(0.15, 0.45),
    swayFreq: rand(0.0004, 0.0011),
    phase: rand(0, Math.PI * 2),
    rot: rand(-0.4, 0.4),
    vr: type === 'petal' ? rand(-0.012, 0.012) : rand(-0.002, 0.002),
    twinkle: type === 'sparkle' || type === 'star' ? rand(0.0015, 0.004) : 0,
  }
}

/**
 * Slow, elegant ambient particles (hearts, sparkles, stars, glows, petals)
 * drawn on a single canvas.
 *
 * Props:
 *  - fixed:   cover the viewport (true) or fill the nearest positioned parent
 *  - density: multiplier for the particle count
 *  - mix:     relative weights for each particle type
 */
export default function FloatingParticles({ fixed = true, density = 1, mix = DEFAULT_MIX, className = '', zIndex = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let particles = []
    let raf = 0
    let last = performance.now()

    const resize = () => {
      const target = fixed ? { width: window.innerWidth, height: window.innerHeight } : canvas.parentElement.getBoundingClientRect()
      w = target.width
      h = target.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const count = Math.round(Math.min(42, Math.max(12, (w * h) / 36000)) * density * (reduced ? 0.4 : 1))
      if (particles.length > count) particles.length = count
      while (particles.length < count) particles.push(makeParticle(w, h, mix, true))
      if (reduced) draw(performance.now())
    }

    const draw = (now) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const a = p.twinkle ? p.alpha * (0.45 + 0.55 * Math.abs(Math.sin(now * p.twinkle + p.phase))) : p.alpha
        const cos = Math.cos(p.rot) * dpr
        const sin = Math.sin(p.rot) * dpr
        ctx.globalAlpha = a
        ctx.setTransform(cos, sin, -sin, cos, p.x * dpr, p.y * dpr)
        ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size)
      }
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 16.67, 3)
      last = now
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.vy * dt
        p.x += Math.sin(now * p.swayFreq + p.phase) * p.sway * dt
        p.rot += p.vr * dt
        if (p.y < -40 || p.y > h + 40 || p.x < -40 || p.x > w + 40) particles[i] = makeParticle(w, h, mix, false)
      }
      draw(now)
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(fixed ? document.documentElement : canvas.parentElement)
    if (!reduced) raf = requestAnimationFrame(tick)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixed, density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${fixed ? 'fixed' : 'absolute'} inset-0 h-full w-full ${className}`}
      style={{ zIndex }}
    />
  )
}
