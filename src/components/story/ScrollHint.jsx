import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { birthdayData } from '../../data/birthdayData'

const NEAR_END = 140 // px left to scroll before the hint hides

/**
 * "Scroll ↓" hint at the bottom of a page, shown only while there is more of
 * the page below. Tapping it glides down a screen.
 */
export default function ScrollHint({ scrollRef, light = false }) {
  const [more, setMore] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > NEAR_END)
    check()
    el.addEventListener('scroll', check, { passive: true })
    // the page grows as images load and sections animate in
    const ro = new ResizeObserver(check)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    // wait for the page's own entrance before showing the hint
    const t = setTimeout(() => setReady(true), 1800)
    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
      clearTimeout(t)
    }
  }, [scrollRef])

  const scrollDown = () => scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight * 0.8, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {ready && more && (
        <motion.button
          type="button"
          data-scroll-hint
          data-avoid
          onClick={scrollDown}
          aria-label="Scroll down to see more"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className={`absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full px-4 pt-2 pb-1.5 backdrop-blur-md ${
            light ? 'bg-white/15 text-white ring-1 ring-white/30' : 'glass text-rose-ink'
          }`}
        >
          <span className="text-[10px] tracking-[0.35em] uppercase">{birthdayData.navigation.scroll}</span>
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
