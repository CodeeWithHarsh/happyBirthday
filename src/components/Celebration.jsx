import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlowButton from './ui/GlowButton'
import { HeartShape } from './ui/Icons'
import { EASE } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { celebrate } from '../utils/effects'
import { useScrollLock } from '../hooks/useScrollLock'
import { move } from '../utils/motion'

/** The huge YES celebration: flash, confetti, heart rain, glowing screen. */
export default function Celebration({ open, onContinue }) {
  useScrollLock(open)
  return <AnimatePresence>{open && <CelebrationScene onContinue={onContinue} />}</AnimatePresence>
}

function CelebrationScene({ onContinue }) {
  const { celebration } = birthdayData
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const stop = celebrate()
    const timers = [
      setTimeout(() => setStage(1), 450),
      setTimeout(() => setStage(2), 2300),
      setTimeout(() => setStage(3), 4300),
    ]
    return () => {
      stop()
      timers.forEach(clearTimeout)
    }
  }, [])

  // Hearts rising across the whole screen
  const hearts = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        size: 12 + Math.random() * 28,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 120,
        color: ['#ef8fab', '#f7a1bb', '#ffc2d1', '#ffffff', '#e9cfa3'][i % 5],
      })),
    [],
  )

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.9 } }}
      role="dialog"
      aria-modal="true"
      aria-label="Celebration"
    >
      {/* glowing pink world */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#fff5f8_0%,#ffd1dc_45%,#ef8fab_100%)]"
        initial={{ transform: move('scale(1.4)') }}
        animate={{ transform: move('scale(1)') }}
        transition={{ duration: 2.4, ease: EASE }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 aspect-square w-[130vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),transparent)]"
        animate={{ transform: move(['scale(0.6)', 'scale(1)', 'scale(0.6)']), opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* screen flash */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.15, 1] }}
      />

      {/* rising hearts */}
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute -bottom-15"
          style={{ left: h.left, width: h.size, height: h.size, color: h.color }}
          initial={{ transform: move('translateX(0px) translateY(0vh) rotate(0deg)'), opacity: 0 }}
          animate={{ transform: move(`translateX(${h.drift}px) translateY(-115vh) rotate(${h.drift / 4}deg)`), opacity: [0, 1, 1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeOut' }}
        >
          <HeartShape className="h-full w-full drop-shadow-[0_4px_10px_rgba(231,121,154,0.5)]" />
        </motion.span>
      ))}

      {/* words */}
      <motion.div
        className="relative z-10 max-w-3xl text-center"
        initial={{ scale: 1.25 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: EASE }}
      >
        <motion.div
          className="mx-auto h-20 w-20 text-[#e7799a] sm:h-24 sm:w-24"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: [0, 1.4, 1], rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          <HeartShape className="animate-heartbeat h-full w-full drop-shadow-[0_10px_30px_rgba(231,121,154,0.8)]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.3, filter: 'blur(20px)' }}
          animate={stage >= 1 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          className="mt-6 font-display text-6xl font-semibold tracking-wide text-[#b83d68] drop-shadow-[0_4px_24px_rgba(255,255,255,0.95)] sm:text-8xl"
        >
          {celebration.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={stage >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, ease: EASE }}
          className="mt-6 font-display text-2xl text-rose-deep italic sm:text-4xl"
        >
          {celebration.line1}
        </motion.p>

        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: EASE }}
              className="mt-8"
            >
              <p className="font-script text-3xl text-rose-ink sm:text-5xl">{celebration.line2}</p>
              <div className="mt-10">
                <GlowButton onClick={onContinue} autoFocus>
                  {celebration.button}
                </GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
