import { useRef } from 'react'
import { motion } from 'framer-motion'
import ScrollHint from './ScrollHint'
import { EASE } from '../ui/RevealText'
import { PageScrollContext, useStory } from '../../context/StoryContext'

/**
 * A chapter's own page: full screen, with its own scroll and a "Scroll ↓"
 * hint whenever there is more below.
 * Coming forward it rises up behind the opening gate; going back it simply
 * fades in. It stays put while a gate swings shut over it, then disappears.
 */
export default function ContentPage({ background, children, zIndex = 20, light = false }) {
  const ref = useRef(null)
  const { direction } = useStory()
  const forward = direction > 0

  return (
    <motion.div
      className="fixed inset-0"
      style={{ zIndex, background }}
      initial={forward ? { opacity: 0, scale: 0.9, y: 60 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 1.1, delay: forward ? 0.3 : 0.1, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 1.2 } }}
    >
      <div ref={ref} className="page-scroll absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain">
        <PageScrollContext.Provider value={ref}>{children}</PageScrollContext.Provider>
      </div>
      <ScrollHint scrollRef={ref} light={light} />
    </motion.div>
  )
}
