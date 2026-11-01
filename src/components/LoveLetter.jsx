import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import HeartBurst from './ui/HeartBurst'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE } from './ui/RevealText'
import { birthdayData, fill } from '../data/birthdayData'

/** Emotional, deeper-rose section: an envelope that opens into a letter. */
export default function LoveLetter({ children }) {
  const { letter } = birthdayData
  const [stage, setStage] = useState('closed') // closed → opening → open
  const [burst, setBurst] = useState(0)

  const open = () => {
    if (stage !== 'closed') return
    setStage('opening')
    setBurst(Date.now())
    setTimeout(() => setStage('open'), 1300)
  }

  return (
    <section className="relative overflow-hidden theme-bg px-5 py-24 sm:py-32">
      <div className="ambient" aria-hidden="true">
        <div className="blob top-[15%] left-[-10%] h-[45vmax] w-[45vmax] bg-blush-300/30" />
        <div className="blob right-[-10%] bottom-[5%] h-[40vmax] w-[40vmax] bg-blush-200/70" />
      </div>

      <div className="relative z-10">
        <SectionHeading eyebrow="Read this slowly" title={letter.title} />

        <div className="mx-auto mt-14 flex min-h-105 max-w-2xl items-start justify-center sm:mt-20">
          <AnimatePresence mode="wait">
            {stage !== 'open' ? (
              <Envelope key="envelope" opening={stage === 'opening'} onOpen={open} hint={letter.envelopeHint} burst={burst} />
            ) : (
              <Letter key="letter" letter={letter} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}

function Envelope({ opening, onOpen, hint, burst }) {
  return (
    <motion.div
      className="relative flex w-full flex-col items-center"
      initial={{ opacity: 0, y: 50, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, amount: 0.5 }}
      exit={{ opacity: 0, y: 80, scale: 0.9, transition: { duration: 0.6 } }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <div className="relative aspect-3/2 w-[min(88vw,460px)] perspective-[1000px]">
        {/* back of envelope */}
        <div className="absolute inset-0 z-0 rounded-xl bg-[#f9e6e0] shadow-[0_30px_70px_-20px_rgba(74,31,49,0.6)]" />

        {/* letter peeking out */}
        <motion.div
          className="paper absolute inset-x-[7%] top-[6%] bottom-[8%] z-2 rounded-md shadow-md"
          animate={opening ? { y: '-38%' } : { y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          <div className="mx-auto mt-[12%] h-1 w-1/2 rounded bg-blush-200" />
          <div className="mx-auto mt-3 h-1 w-2/3 rounded bg-blush-200/70" />
          <div className="mx-auto mt-3 h-1 w-1/2 rounded bg-blush-200/50" />
        </motion.div>

        {/* front pocket */}
        <div
          className="absolute inset-0 z-3 rounded-xl bg-linear-to-b from-[#fcefea] to-[#f6dcd6]"
          style={{ clipPath: 'polygon(0 30%, 50% 62%, 100% 30%, 100% 100%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 z-3 rounded-xl"
          style={{ clipPath: 'polygon(0 100%, 50% 58%, 100% 100%)', background: 'linear-gradient(0deg,#f3d3cc,#fae7e2)' }}
        />

        {/* flap — outside face + inside face */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[62%] origin-top"
          style={{ transformStyle: 'preserve-3d', zIndex: opening ? 1 : 5 }}
          animate={{ rotateX: opening ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <div
            className="absolute inset-0 rounded-t-xl bg-linear-to-b from-[#f7dcd5] to-[#eec4bc]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }}
          />
          <div
            className="absolute inset-0 rounded-t-xl bg-linear-to-b from-[#f3cfc7] to-[#fbe9e4]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          />
        </motion.div>

        {/* wax seal */}
        <motion.button
          type="button"
          onClick={onOpen}
          aria-label="Open the letter"
          className="absolute top-[62%] left-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#e88aa6,#b44a6d_60%,#8c3b57)] text-white shadow-[0_6px_18px_rgba(107,42,66,0.55),inset_0_2px_4px_rgba(255,255,255,0.35)] outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:h-18 sm:w-18"
          animate={opening ? { scale: 0, opacity: 0, rotate: 90 } : { scale: [1, 1.08, 1] }}
          transition={opening ? { duration: 0.4 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
        >
          <HeartShape className="h-7 w-7 drop-shadow" />
        </motion.button>

        <HeartBurst burstKey={burst} count={20} distance={200} />
      </div>

      <motion.p
        className="mt-8 font-display text-lg text-rose-ink/80 italic"
        animate={{ opacity: opening ? 0 : [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: opening ? 0 : Infinity }}
      >
        {hint} ♡
      </motion.p>
    </motion.div>
  )
}

function Letter({ letter }) {
  // Blank lines become short pauses; each written line gets its own beat.
  let t = 0.9
  const timed = letter.lines.map((line) => {
    const at = t
    t += line ? 0.55 : 0.35
    return { line, at }
  })

  const lineAnim = (delay) => ({
    initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { delay, duration: 1.1, ease: EASE },
  })

  return (
    <motion.article
      className="paper relative w-full rounded-[1.75rem] px-7 py-12 shadow-[0_40px_100px_-30px_rgba(74,31,49,0.7)] sm:px-14 sm:py-16"
      initial={{ opacity: 0, y: 120, scale: 0.85, rotate: 2 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      {/* gold corners */}
      <span className="absolute top-4 left-4 h-8 w-8 rounded-tl-xl border-t border-l border-gold/60" aria-hidden="true" />
      <span className="absolute top-4 right-4 h-8 w-8 rounded-tr-xl border-t border-r border-gold/60" aria-hidden="true" />
      <span className="absolute bottom-4 left-4 h-8 w-8 rounded-bl-xl border-b border-l border-gold/60" aria-hidden="true" />
      <span className="absolute right-4 bottom-4 h-8 w-8 rounded-br-xl border-r border-b border-gold/60" aria-hidden="true" />
      <Sparkle className="animate-twinkle absolute top-8 right-10 h-4 w-4 text-gold" />

      <motion.p {...lineAnim(0.5)} className="font-script text-4xl text-rose-ink sm:text-5xl">
        {fill(letter.salutation)}
      </motion.p>

      <div className="mt-6 font-display text-[1.3rem] leading-relaxed text-rose-deep sm:text-2xl sm:leading-relaxed">
        {timed.map(({ line, at }, i) =>
          line ? (
            <motion.p key={i} {...lineAnim(at)}>
              {line}
            </motion.p>
          ) : (
            <div key={i} className="h-5" aria-hidden="true" />
          ),
        )}
      </div>

      <motion.div {...lineAnim(t + 0.4)} className="mt-10 text-right">
        <p className="font-display text-lg text-rose-ink/80 italic">{letter.signoff}</p>
        <p className="mt-1 font-script text-5xl text-rose-ink">{fill(letter.signature)}</p>
        <HeartShape className="animate-heartbeat mt-3 ml-auto h-6 w-6 text-blush-500" />
      </motion.div>
    </motion.article>
  )
}
