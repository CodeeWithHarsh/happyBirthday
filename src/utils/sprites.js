/* Pre-rendered particle sprites — drawing images is much cheaper than
   building gradients/paths for every particle on every frame. */

const HEART_PATH =
  'M16 28.5S3 20.6 3 11.6C3 7.4 6.2 4.5 9.8 4.5c2.6 0 4.8 1.5 6.2 3.6 1.4-2.1 3.6-3.6 6.2-3.6 3.6 0 6.8 2.9 6.8 7.1 0 9-13 16.9-13 16.9z'

const SIZE = 64
const cache = new Map()

function sparklePath(g, r) {
  g.beginPath()
  g.moveTo(0, -r)
  g.quadraticCurveTo(0, 0, r, 0)
  g.quadraticCurveTo(0, 0, 0, r)
  g.quadraticCurveTo(0, 0, -r, 0)
  g.quadraticCurveTo(0, 0, 0, -r)
  g.closePath()
}

export function getSprite(type, color) {
  const key = `${type}|${color}`
  if (cache.has(key)) return cache.get(key)

  const c = document.createElement('canvas')
  c.width = c.height = SIZE
  const g = c.getContext('2d')
  const mid = SIZE / 2

  switch (type) {
    case 'heart': {
      const k = 1.25
      g.translate(mid - 16 * k, mid - 16 * k)
      g.scale(k, k)
      g.shadowColor = color
      g.shadowBlur = 6
      g.fillStyle = color
      g.fill(new Path2D(HEART_PATH))
      break
    }
    case 'sparkle':
    case 'star': {
      g.translate(mid, mid)
      g.shadowColor = color
      g.shadowBlur = 12
      g.fillStyle = color
      sparklePath(g, type === 'sparkle' ? 22 : 14)
      g.fill()
      break
    }
    case 'petal': {
      g.translate(mid, mid)
      const grad = g.createLinearGradient(0, -22, 0, 22)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(1, color)
      g.fillStyle = grad
      g.beginPath()
      g.moveTo(0, -22)
      g.bezierCurveTo(16, -12, 14, 14, 0, 22)
      g.bezierCurveTo(-14, 14, -16, -12, 0, -22)
      g.fill()
      break
    }
    default: {
      // soft glowing dot
      const grad = g.createRadialGradient(mid, mid, 0, mid, mid, mid)
      grad.addColorStop(0, color)
      grad.addColorStop(0.25, color)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      g.fillStyle = grad
      g.fillRect(0, 0, SIZE, SIZE)
    }
  }

  cache.set(key, c)
  return c
}

export const PARTICLE_COLORS = {
  heart: ['#f7a1bb', '#ef8fab', '#ffc2d1', '#f4b0c4'],
  sparkle: ['#ffffff', '#f6dcae', '#ffd1dc'],
  star: ['#ffffff', '#f6dcae'],
  dot: ['#ffffff', '#ffd1dc', '#f6e2c0'],
  petal: ['#ffc8d6', '#ffb3c7', '#f9c4d2'],
}
