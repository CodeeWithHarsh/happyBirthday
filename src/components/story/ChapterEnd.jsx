import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import GlowButton from '../ui/GlowButton'
import { HeartShape } from '../ui/Icons'
import { Reveal } from '../ui/RevealText'
import { useStory } from '../../context/StoryContext'
import { birthdayData } from '../../data/birthdayData'

/**
 * "Up next: …" + a button that turns to the next page. Sits at the end of every
 * chapter — reaching it marks the chapter as finished, which unlocks the next one.
 */
export default function ChapterEnd({ light = false, buttonText, onClick, title }) {
  const { pages, index, next, markComplete } = useStory()
  // Remember which page this ending belongs to: while the page is leaving, the
  // story has already moved on and `index` points at the next page.
  const [at] = useState(index)
  const ref = useRef(null)
  const reached = useInView(ref, { once: true, amount: 0.4 })
  const pageId = pages[at]?.id
  const { navigation } = birthdayData
  const upcoming = title ?? pages[at + 1]?.title

  useEffect(() => {
    if (reached && pageId) markComplete(pageId)
  }, [reached, pageId, markComplete])

  return (
    <div ref={ref} className="relative z-10 mt-20 flex flex-col items-center px-4 pb-6 text-center sm:mt-28">
      <Reveal className={`ornament ${light ? 'text-blush-200!' : ''}`}>
        <HeartShape className="h-3.5 w-3.5" />
      </Reveal>
      {upcoming && (
        <>
          <Reveal delay={0.1} className={`mt-6 text-[11px] font-normal tracking-[0.35em] uppercase ${light ? 'text-blush-200' : 'text-gold'}`}>
            {navigation.upNext}
          </Reveal>
          <Reveal delay={0.2} className={`mt-3 font-display text-2xl italic sm:text-3xl ${light ? 'text-white' : 'text-rose-deep'}`}>
            {upcoming}
          </Reveal>
        </>
      )}
      <Reveal delay={0.35} className="mt-8">
        <GlowButton size="md" onClick={onClick ?? next}>
          {buttonText ?? navigation.next}
        </GlowButton>
      </Reveal>
    </div>
  )
}
