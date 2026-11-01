import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GlowButton from './ui/GlowButton'
import { EASE, LetterReveal } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { move } from '../utils/motion'

// When each line appears (ms) — after the gate has swung shut. The last entry is the button.
const TIMELINE = [1300, 3600, 5600, 7200]

/**
 * Dreamy, mysterious opening. Nothing about birthdays yet...
 * It sits in front of the 3D gate, so "Open My Surprise" swings the gate open.
 */
export default function IntroScreen({ onOpen }) {
  const [stage, setStage] = useState(0)
  const [first, second, third] = birthdayData.intro.lines

  useEffect(() => {
    const timers = TIMELINE.map((t, i) => setTimeout(() => setStage(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      {/* drifting soft lights */}
      <div className="blob animate-drift top-[-10%] left-[-10%] h-[55vmax] w-[55vmax] bg-[#ffc2d1]/60" />
      <div className="blob animate-drift right-[-15%] bottom-[-15%] h-[50vmax] w-[50vmax] bg-[#f6dcae]/50 [animation-delay:-6s]" />
      <motion.div
        className="blob top-1/2 left-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 bg-white/70"
        animate={{ transform: move(['scale(1)', 'scale(1.15)', 'scale(1)']), opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
        <h1 className="font-script text-[3.4rem] leading-tight text-rose-ink sm:text-7xl md:text-8xl">
          <LetterReveal text={first} show={stage >= 1} stagger={0.07} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={stage >= 2 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.6, ease: EASE }}
          className="mt-6 font-display text-2xl text-rose-ink/80 italic sm:text-3xl"
        >
          {second}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(8px)' }}
          animate={stage >= 3 ? { opacity: 1, letterSpacing: '0.3em', filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.8, ease: EASE }}
          className="mt-8 text-sm font-normal text-gold uppercase sm:text-base"
        >
          {third}
        </motion.p>

        <motion.div
          className="relative mt-14 min-h-24"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={stage >= 4 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {stage >= 4 && (
            <GlowButton onClick={onOpen} autoFocus>
              {birthdayData.intro.button}
            </GlowButton>
          )}
        </motion.div>
      </div>
    </div>
  )
}
