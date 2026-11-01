import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { HeartShape } from './ui/Icons'

/** A thin glowing line at the top that fills as she travels through the story's pages. */
export default function ScrollProgress({ value }) {
  const progress = useSpring(value, { stiffness: 60, damping: 20, restDelta: 0.001 })
  const heartX = useTransform(progress, (v) => `calc(${v * 100}vw - ${v * 14}px)`)

  useEffect(() => {
    progress.set(value)
  }, [value, progress])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-80 h-0.75" aria-hidden="true">
      <div className="absolute inset-0 bg-white/40" />
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-0 origin-left bg-linear-to-r from-blush-300 via-blush-500 to-gold shadow-[0_0_12px_rgba(239,143,171,0.9)]"
      />
      <motion.div style={{ x: heartX }} className="absolute -top-1.25 left-0 h-3.5 w-3.5 text-blush-500 drop-shadow-[0_0_6px_rgba(239,143,171,0.9)]">
        <HeartShape className="h-full w-full" />
      </motion.div>
    </div>
  )
}
