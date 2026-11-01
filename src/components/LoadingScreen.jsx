import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { birthdayData } from '../data/birthdayData'
import { move } from '../utils/motion'

const HEART = 'M16 28.5S3 20.6 3 11.6C3 7.4 6.2 4.5 9.8 4.5c2.6 0 4.8 1.5 6.2 3.6 1.4-2.1 3.6-3.6 6.2-3.6 3.6 0 6.8 2.9 6.8 7.1 0 9-13 16.9-13 16.9z'
const MIN_DURATION = 2600

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = img.onerror = resolve
    img.src = src
  })
}

/** Heart-drawing loader shown while fonts and the first photos warm up. */
export default function LoadingScreen({ onDone }) {
  useEffect(() => {
    let cancelled = false
    const minWait = new Promise((r) => setTimeout(r, MIN_DURATION))
    const maxWait = new Promise((r) => setTimeout(r, 6000))
    const assets = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      preload(birthdayData.heroPhoto),
    ])
    Promise.all([minWait, Promise.race([assets, maxWait])]).then(() => !cancelled && onDone())
    return () => {
      cancelled = true
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-110 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#fff8fa_0%,#ffe4ec_60%,#ffd1dc_100%)]"
      exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.9, ease: 'easeInOut' } }}
      role="status"
      aria-live="polite"
    >
      <div className="relative h-28 w-28">
        <motion.div
          className="absolute inset-0 rounded-full bg-blush-300/60 blur-2xl"
          animate={{ transform: move(['scale(0.8)', 'scale(1.15)', 'scale(0.8)']), opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <svg viewBox="0 0 32 32" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="loader-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffb3c7" />
              <stop offset="1" stopColor="#e0708f" />
            </linearGradient>
          </defs>
          <motion.path
            d={HEART}
            fill="none"
            stroke="url(#loader-grad)"
            strokeWidth="0.9"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 2.2, times: [0, 0.7, 1], repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d={HEART}
            fill="url(#loader-grad)"
            style={{ transformOrigin: '16px 16px' }}
            animate={{ opacity: [0, 0, 0.9, 0], scale: [0.6, 0.6, 1, 1.05] }}
            transition={{ duration: 2.2, times: [0, 0.55, 0.8, 1], repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-8 font-display text-xl text-rose-ink italic sm:text-2xl"
      >
        {birthdayData.loadingText}
        <span className="inline-flex w-6">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            >
              .
            </motion.span>
          ))}
        </span>
      </motion.p>
    </motion.div>
  )
}
