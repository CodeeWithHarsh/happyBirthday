import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import HeartBurst from './ui/HeartBurst'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { pinkBurst } from '../utils/effects'
import { useScrollLock } from '../hooks/useScrollLock'
import { move } from '../utils/motion'

/** A tiny, barely-visible heart. Clicking it reveals a secret message. */
export default function SecretSurprise({ className = '' }) {
  const [open, setOpen] = useState(false)
  const [burst, setBurst] = useState(0)
  useScrollLock(open)

  const discover = (e) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    pinkBurst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, count: 50, spread: 100 })
    setOpen(true)
    setTimeout(() => setBurst(Date.now()), 350)
  }

  return (
    <>
      <button
        type="button"
        onClick={discover}
        aria-label="A tiny secret heart"
        className={`group grid h-11 w-11 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blush-400 ${className}`}
      >
        {/* every few seconds it "breathes" and glints, so a curious eye catches it */}
        <motion.span
          className="relative grid place-items-center"
          animate={{ transform: move(['scale(1)', 'scale(1)', 'scale(1.45)', 'scale(1)', 'scale(1.3)', 'scale(1)']), opacity: [0.55, 0.55, 1, 0.75, 1, 0.55] }}
          transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.7, 0.78, 0.86, 0.93, 1] }}
        >
          <HeartShape className="h-5 w-5 text-blush-500 drop-shadow-[0_0_6px_rgba(239,143,171,0.8)] transition duration-500 group-hover:scale-150" />
          <Sparkle className="animate-twinkle absolute -top-2 -right-2.5 h-2.5 w-2.5 text-gold" />
        </motion.span>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-100 flex items-center justify-center bg-blush-100/70 p-5 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Secret message"
            >
              <motion.div
                className="glass relative w-full max-w-md rounded-[2.5rem] px-8 py-12 text-center"
                initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                onClick={(e) => e.stopPropagation()}
              >
                <HeartBurst burstKey={burst} count={24} distance={200} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full text-rose-ink/60 transition hover:bg-white/70 hover:text-rose-ink"
                >
                  <X className="h-4 w-4" />
                </button>

                <motion.div
                  className="mx-auto h-16 w-16 text-blush-500"
                  animate={{ transform: move(['scale(1)', 'scale(1.18)', 'scale(1)', 'scale(1.12)', 'scale(1)']) }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  <HeartShape className="h-full w-full drop-shadow-[0_8px_18px_rgba(239,143,171,0.7)]" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.4, duration: 1, ease: EASE }}
                  className="mt-6 font-script text-4xl text-rose-ink"
                >
                  {birthdayData.secret.line1}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.8, duration: 1, ease: EASE }}
                  className="mt-4 font-display text-xl text-rose-deep italic"
                >
                  {birthdayData.secret.line2}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
