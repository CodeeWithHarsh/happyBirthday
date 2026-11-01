import { motion } from 'framer-motion'
import GlowButton from '../ui/GlowButton'
import { HeartShape } from '../ui/Icons'
import { EASE, LetterReveal } from '../ui/RevealText'
import { move } from '../../utils/motion'

// Starts once the gate has swung shut
const BASE = 0.9

const show = (delay) => ({
  initial: { opacity: 0, transform: move('translateY(18px)'), filter: 'blur(10px)' },
  animate: { opacity: 1, transform: move('translateY(0px)'), filter: 'blur(0px)' },
  transition: { duration: 1.2, delay: BASE + delay, ease: EASE },
})

/**
 * The title page of a chapter, floating in front of the gate doors:
 * a large faint numeral, the chapter label, its title, a few teaser lines
 * and the "Open" button.
 */
export default function ChapterCover({ chapter, numeral, buttonText, onOpen, dark = false }) {
  const ink = dark ? 'text-white' : 'text-rose-deep'
  const soft = dark ? 'text-white/85' : 'text-rose-ink/85'
  const linesStart = 1.1

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-6">
      {/* soft halo so the words read clearly over the doors */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[70vmin] w-[min(92vw,820px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          dark ? 'bg-plum/45' : 'bg-white/75'
        }`}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* gold crest with the chapter numeral */}
        {numeral && (
          <motion.div
            aria-hidden="true"
            className="relative mb-6 grid h-16 w-16 place-items-center"
            initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: BASE - 0.2 }}
          >
            <span className={`absolute inset-0 rounded-full border ${dark ? 'border-white/40' : 'border-gold/60'}`} />
            <span className={`animate-spin-slow absolute -inset-1.5 rounded-full border border-dashed ${dark ? 'border-white/25' : 'border-gold/40'}`} />
            <span
              className={`absolute inset-1.5 rounded-full shadow-[0_6px_18px_-6px_rgba(201,162,107,0.7)] ${
                dark ? 'bg-white/10' : 'bg-[radial-gradient(circle_at_35%_30%,#fffaf0,#f6e3c4)]'
              }`}
            />
            <span className={`relative font-display text-2xl font-semibold ${dark ? 'text-white' : 'text-gradient-gold'}`}>{numeral}</span>
          </motion.div>
        )}

        <motion.p {...show(0)} className={`text-[11px] font-normal tracking-[0.45em] uppercase sm:text-xs ${dark ? 'text-blush-200' : 'text-gold'}`}>
          {chapter.label}
        </motion.p>

        <h2 className={`mt-5 font-display text-5xl leading-[1.05] font-medium sm:text-7xl ${ink}`}>
          <LetterReveal text={chapter.title} show delay={BASE + 0.2} stagger={0.035} />
        </h2>

        <motion.div {...show(0.75)} className={`ornament mt-7 ${dark ? 'text-blush-200!' : ''}`}>
          <HeartShape className="h-3.5 w-3.5" />
        </motion.div>

        <div className="mt-7 space-y-1">
          {chapter.lines.map((line, i) => (
            <motion.p key={i} {...show(linesStart + i * 0.55)} className={`font-display text-xl italic sm:text-2xl ${soft}`}>
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div {...show(linesStart + chapter.lines.length * 0.55 + 0.2)} className="mt-12">
          <GlowButton onClick={onOpen} autoFocus>
            {buttonText}
          </GlowButton>
        </motion.div>
      </div>
    </div>
  )
}
