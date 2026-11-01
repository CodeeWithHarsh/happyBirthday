import confetti from 'canvas-confetti'

const PINKS = ['#ffd1dc', '#ffb3c7', '#ef8fab', '#ffe4ec', '#ffffff', '#e9cfa3', '#f7a1bb']

let heartShape
const getHeart = () => {
  if (!heartShape) {
    try {
      heartShape = confetti.shapeFromPath({
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
      })
    } catch {
      heartShape = 'circle'
    }
  }
  return heartShape
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Small pink burst from a point (x/y are 0–1 of the viewport). */
export function pinkBurst({ x = 0.5, y = 0.5, count = 70, spread = 80 } = {}) {
  if (prefersReducedMotion()) return
  const heart = getHeart()
  confetti({
    particleCount: count,
    spread,
    startVelocity: 32,
    ticks: 180,
    origin: { x, y },
    colors: PINKS,
    shapes: [heart, 'circle'],
    scalar: 1.1,
    zIndex: 120,
  })
}

/** The big YES celebration — several waves of hearts and confetti. */
export function celebrate() {
  if (prefersReducedMotion()) {
    confetti({ particleCount: 60, spread: 120, origin: { y: 0.6 }, colors: PINKS, ticks: 120, zIndex: 120, gravity: 2 })
    return () => {}
  }
  const heart = getHeart()
  const end = Date.now() + 3200
  let frame
  const base = { colors: PINKS, zIndex: 120, ticks: 260 }

  // Center heart explosion
  confetti({ ...base, particleCount: 160, spread: 360, startVelocity: 45, origin: { x: 0.5, y: 0.45 }, shapes: [heart], scalar: 1.6 })
  confetti({ ...base, particleCount: 120, spread: 120, startVelocity: 55, origin: { x: 0.5, y: 0.7 }, shapes: ['circle', 'square'] })

  // Side cannons for ~3 seconds
  const loop = () => {
    confetti({ ...base, particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, shapes: [heart, 'circle'], scalar: 1.2 })
    confetti({ ...base, particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, shapes: [heart, 'circle'], scalar: 1.2 })
    if (Date.now() < end) frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)

  // Falling heart rain
  const rain = setTimeout(() => {
    confetti({ ...base, particleCount: 140, spread: 180, startVelocity: 20, gravity: 0.6, origin: { x: 0.5, y: -0.1 }, shapes: [heart], scalar: 1.3, ticks: 400 })
  }, 900)

  return () => {
    cancelAnimationFrame(frame)
    clearTimeout(rain)
  }
}
