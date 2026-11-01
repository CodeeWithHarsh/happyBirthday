import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartShape, Sparkle } from './Icons'

const COLORS = ['#ef8fab', '#f7a1bb', '#ffc2d1', '#e9cfa3', '#ffffff']

/**
 * Explodes hearts & sparkles outward from its center each time `burstKey`
 * changes to a new truthy value. Place it inside a `relative` parent.
 */
export default function HeartBurst({ burstKey, count = 18, distance = 160, className = '' }) {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    if (!burstKey) return
    const id = burstKey
    const parts = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const d = distance * (0.55 + Math.random() * 0.6)
      return {
        x: Math.cos(angle) * d,
        y: Math.sin(angle) * d - 30,
        size: 10 + Math.random() * 16,
        rot: Math.random() * 120 - 60,
        color: COLORS[i % COLORS.length],
        sparkle: i % 3 === 0,
        delay: Math.random() * 0.12,
      }
    })
    setBursts((b) => [...b, { id, parts }])
    const t = setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1800)
    return () => clearTimeout(t)
  }, [burstKey, count, distance])

  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`} aria-hidden="true">
      {bursts.map(({ id, parts }) =>
        parts.map((p, i) => (
          <motion.span
            key={`${id}-${i}`}
            className="absolute"
            style={{ color: p.color, width: p.size, height: p.size }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{ x: p.x, y: p.y, scale: [0, 1.2, 1], opacity: [1, 1, 0], rotate: p.rot }}
            transition={{ duration: 1.4, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            {p.sparkle ? <Sparkle className="h-full w-full" /> : <HeartShape className="h-full w-full drop-shadow" />}
          </motion.span>
        )),
      )}
    </div>
  )
}
