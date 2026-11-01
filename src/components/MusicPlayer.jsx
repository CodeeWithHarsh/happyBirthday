import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { birthdayData } from '../data/birthdayData'
import { move } from '../utils/motion'

/** Floating glass music button, available everywhere. Autoplay lives in MusicContext. */
export default function MusicPlayer() {
  const { playing, missing, toggle } = useMusic()
  const [hover, setHover] = useState(false)
  const [nudge, setNudge] = useState(true)
  const [missingHint, setMissingHint] = useState(false)
  const hintTimer = useRef(0)

  const flashMissingHint = () => {
    setMissingHint(true)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setMissingHint(false), 4000)
  }

  // Show the "Play our song" label briefly so she notices the button.
  useEffect(() => {
    const t = setTimeout(() => setNudge(false), 6000)
    return () => clearTimeout(t)
  }, [])

  // If the song file isn't there yet, say so for a few seconds — then get out of the way.
  useEffect(() => {
    if (missing) flashMissingHint()
  }, [missing])

  useEffect(() => () => clearTimeout(hintTimer.current), [])

  if (!birthdayData.music) return null

  const label = missing ? `Add ${birthdayData.music} ♡` : playing ? `Now playing · ${birthdayData.musicTitle}` : 'Play our song'
  const showLabel = hover || missingHint || (nudge && !playing && !missing)

  const onClick = () => {
    toggle()
    if (missing) flashMissingHint()
  }

  return (
    <div
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-70 flex items-center gap-3 sm:right-6 sm:bottom-6"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AnimatePresence>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            className="glass rounded-full px-4 py-2 font-display text-sm whitespace-nowrap text-rose-ink italic"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onClick}
        data-music-toggle
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={playing ? 'Pause our song' : 'Play our song'}
        aria-pressed={playing}
        className="glass relative grid h-14 w-14 place-items-center rounded-full text-rose-ink shadow-[0_8px_30px_rgba(239,143,171,0.45)]"
      >
        {playing && (
          <span className="absolute inset-0 animate-ping rounded-full bg-blush-300/40 [animation-duration:2.4s]" aria-hidden="true" />
        )}
        {playing ? (
          <span className="relative flex h-5 items-end gap-0.75" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="h-full w-0.75 origin-bottom rounded-full bg-blush-500"
                animate={{ transform: move(['scaleY(0.3)', 'scaleY(1)', 'scaleY(0.45)', 'scaleY(0.8)', 'scaleY(0.3)']) }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </span>
        ) : (
          <Music className="relative h-5 w-5" strokeWidth={1.6} />
        )}
      </motion.button>
    </div>
  )
}
