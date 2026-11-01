import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { HeartShape, Sparkle } from './Icons'
import { move } from '../../utils/motion'

const SPARKLES = [
  { top: '-18%', left: '6%', size: 12, delay: 0 },
  { top: '-26%', right: '14%', size: 9, delay: 0.7 },
  { bottom: '-22%', left: '22%', size: 8, delay: 1.3 },
  { bottom: '-14%', right: '4%', size: 13, delay: 0.4 },
  { top: '30%', left: '-7%', size: 9, delay: 1.8 },
  { top: '20%', right: '-6%', size: 10, delay: 1 },
]

const HEARTS = [
  { left: '12%', delay: 0, size: 12 },
  { left: '48%', delay: 1.4, size: 10 },
  { left: '82%', delay: 0.7, size: 13 },
]

/**
 * The signature pink button: soft pulsing glow, shimmer sweep, twinkling
 * sparkles and little hearts floating up around it.
 */
const GlowButton = forwardRef(function GlowButton({ children, className = '', size = 'lg', decorations = true, ...props }, ref) {
  const sizing = size === 'lg' ? 'px-9 py-4 text-lg sm:px-11 sm:py-5 sm:text-xl' : 'px-7 py-3 text-base sm:text-lg'

  return (
    <div className="relative inline-flex">
      {/* pulsing glow */}
      <motion.span
        aria-hidden="true"
        className="absolute -inset-3 rounded-full bg-blush-400/60 blur-xl"
        animate={{ opacity: [0.45, 0.9, 0.45], transform: move(['scale(0.95)', 'scale(1.08)', 'scale(0.95)']) }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {decorations &&
        SPARKLES.map((s, i) => (
          <Sparkle
            key={i}
            className="animate-twinkle absolute text-gold"
            style={{ ...s, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}

      {/* the rise and the pulse are split across two layers so each keeps its own keyframes */}
      {decorations &&
        HEARTS.map((h, i) => {
          const loop = { duration: 2.8, repeat: Infinity, delay: h.delay, ease: 'easeOut' }
          return (
            <motion.span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute -top-2 text-blush-500"
              style={{ left: h.left, width: h.size, height: h.size }}
              animate={{ transform: move(['translateY(0px)', 'translateY(-38px)']) }}
              transition={loop}
            >
              <motion.span
                className="block h-full w-full"
                animate={{ opacity: [0, 0.9, 0], transform: move(['scale(0.6)', 'scale(1)', 'scale(0.8)']) }}
                transition={loop}
              >
                <HeartShape className="h-full w-full" />
              </motion.span>
            </motion.span>
          )
        })}

      <motion.button
        ref={ref}
        type="button"
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        className={`group relative overflow-hidden rounded-full bg-linear-to-r from-[#f7a1bb] via-blush-500 to-[#e7799a] font-display font-semibold tracking-wide text-white shadow-[0_10px_35px_-6px_rgba(231,121,154,0.75),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none focus-visible:ring-4 focus-visible:ring-white/80 ${sizing} ${className}`}
        {...props}
      >
        <span
          aria-hidden="true"
          className="shimmer absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/50 to-transparent"
          style={{ animation: 'shimmer 3.2s ease-in-out infinite' }}
        />
        <span className="relative">{children}</span>
      </motion.button>
    </div>
  )
})

export default GlowButton
