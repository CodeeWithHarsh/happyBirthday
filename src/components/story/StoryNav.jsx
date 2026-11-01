import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useStory } from '../../context/StoryContext'
import { birthdayData } from '../../data/birthdayData'

/** Small floating "back" button (the chapter name lives in the status bar). */
export default function StoryNav() {
  const { index, back } = useStory()

  return (
    <AnimatePresence>
      {index >= 2 && (
        <motion.button
          type="button"
          data-avoid
          onClick={back}
          aria-label={birthdayData.navigation.back}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="glass fixed top-3 left-3 z-76 grid h-10 w-10 place-items-center rounded-full text-rose-ink transition hover:scale-105 sm:top-5 sm:left-6 sm:h-11 sm:w-11"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
