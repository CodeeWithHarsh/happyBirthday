import { motion } from 'framer-motion'
import GlowButton from './ui/GlowButton'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE } from './ui/RevealText'
import { birthdayData, fill } from '../data/birthdayData'
import { useStory } from '../context/StoryContext'

const reveal = (delay, extra = {}) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(14px)', scale: 0.96, ...extra },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
  transition: { duration: 1.5, delay: delay + 0.5, ease: EASE }, // + the page's own entrance
})

/** Bright, romantic, full-screen birthday page — the first page after the intro. */
export default function Hero() {
  const { hero, navigation } = birthdayData
  const { next } = useStory()

  // "Happy Birthday, My Love ♡" → serif first half + script second half
  const comma = hero.title.indexOf(',')
  const lead = comma > -1 ? hero.title.slice(0, comma + 1) : ''
  const main = comma > -1 ? hero.title.slice(comma + 1).trim() : hero.title

  return (
    <section
      className="relative flex min-h-svh items-center justify-center overflow-hidden theme-bg px-5 pt-20 pb-28"
    >
      {/* layered dreamy light */}
      <div className="ambient" aria-hidden="true">
        <div className="blob animate-drift top-[-15%] left-[-20%] h-[70vmax] w-[70vmax] bg-blush-300/70" />
        <div className="blob animate-drift right-[-25%] bottom-[-20%] h-[60vmax] w-[60vmax] bg-blush-200/70 [animation-delay:-9s]" />
        <div className="blob top-[30%] left-1/2 h-[30vmax] w-[30vmax] -translate-x-1/2 bg-white/90" />
      </div>

      {/* slowly turning ornamental rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 600 600" className="animate-spin-slow h-[min(120vw,760px)] w-[min(120vw,760px)] opacity-60">
          <circle cx="300" cy="300" r="290" fill="none" stroke="#e9cfa3" strokeWidth="0.8" strokeDasharray="2 10" />
          <circle cx="300" cy="300" r="250" fill="none" stroke="#ffd1dc" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p {...reveal(0.6)} className="mb-6 text-[11px] font-normal tracking-[0.4em] text-gold uppercase sm:text-xs">
          {fill(hero.eyebrow)}
        </motion.p>

        <h1 className="text-rose-deep">
          {lead && (
            <motion.span {...reveal(0.9)} className="block font-display text-4xl font-medium tracking-tight sm:text-6xl md:text-7xl">
              {lead}
            </motion.span>
          )}
          <motion.span
            {...reveal(1.4, { scale: 0.85 })}
            className="text-gradient-rose -mt-1 block py-3 font-script text-[4.6rem] leading-[1.05] sm:text-[7.5rem] md:text-[9rem]"
          >
            {main}
          </motion.span>
        </h1>

        <motion.div {...reveal(2.1, { y: 0, scale: 0.7 })} className="mt-4 flex items-center justify-center gap-3 sm:gap-6">
          <span className="h-px w-8 shrink-0 bg-linear-to-r from-transparent to-gold sm:w-20" />
          <span className="text-gradient-gold font-display text-xl tracking-[0.22em] whitespace-nowrap uppercase sm:text-3xl sm:tracking-[0.3em]">{hero.date}</span>
          <span className="h-px w-8 shrink-0 bg-linear-to-l from-transparent to-gold sm:w-20" />
        </motion.div>

        <motion.p {...reveal(2.7)} className="mx-auto mt-8 max-w-xl font-display text-xl leading-relaxed text-rose-ink/80 italic sm:text-2xl">
          {hero.subtitle}
        </motion.p>

        <motion.div {...reveal(3.4, { scale: 0.85 })} className="mt-12">
          <GlowButton onClick={next}>{navigation.begin}</GlowButton>
        </motion.div>
      </div>

      {/* floating decorations */}
      <Sparkle className="animate-twinkle absolute top-[18%] left-[12%] h-4 w-4 text-gold" />
      <Sparkle className="animate-twinkle absolute top-[26%] right-[14%] h-3 w-3 text-blush-500 [animation-delay:1.2s]" />
      <Sparkle className="animate-twinkle absolute bottom-[24%] left-[20%] h-3 w-3 text-blush-400 [animation-delay:0.6s]" />
      <HeartShape className="animate-float-slow absolute top-[14%] right-[22%] hidden h-6 w-6 text-blush-300 sm:block" />
      <HeartShape className="animate-float-slow absolute bottom-[30%] left-[8%] h-5 w-5 text-blush-400/70 [animation-delay:-2s]" />
    </section>
  )
}
