import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import SmartImage from './ui/SmartImage'
import GlowButton from './ui/GlowButton'
import HeartBurst from './ui/HeartBurst'
import { HeartShape } from './ui/Icons'
import { EASE, Reveal } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { pinkBurst } from '../utils/effects'

/** A blurred photo hiding a surprise. */
export default function RevealPhoto({ children }) {
  const { reveal } = birthdayData
  const [revealed, setRevealed] = useState(false)
  const [burst, setBurst] = useState(0)
  const frameRef = useRef(null)

  const onReveal = () => {
    setRevealed(true)
    setBurst(Date.now())
    const r = frameRef.current.getBoundingClientRect()
    pinkBurst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, count: 120, spread: 120 })
  }

  return (
    <section className="relative overflow-hidden theme-bg px-5 pt-10 pb-24 sm:pt-12 sm:pb-32">
      <div className="ambient" aria-hidden="true">
        <div className="blob top-[30%] left-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 bg-blush-300/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <Reveal className="mb-10 text-center text-[11px] font-normal tracking-[0.35em] text-gold uppercase">A little secret</Reveal>

        <Reveal y={50} scale={0.95}>
          {/* portrait frame, shaped for the photo collage so none of its frames get cropped */}
          <div ref={frameRef} className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-3/4 overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-[0_40px_90px_-30px_rgba(194,79,120,0.6)]">
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={revealed ? { filter: 'blur(0px)', scale: 1 } : { filter: 'blur(26px)', scale: 1.18 }}
                transition={{ duration: revealed ? 2.2 : 0, ease: EASE }}
              >
                <SmartImage src={reveal.photo} alt="A special memory" className="h-full w-full" />
              </motion.div>

              {/* veil + prompt */}
              <AnimatePresence>
                {!revealed && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-b from-white/30 via-blush-200/40 to-blush-300/60 px-6 text-center"
                    exit={{ opacity: 0, transition: { duration: 1.2 } }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="glass mb-6 grid h-14 w-14 place-items-center rounded-full text-rose-ink"
                    >
                      <Lock className="h-5 w-5" strokeWidth={1.6} />
                    </motion.div>
                    <h2 className="max-w-md font-display text-3xl leading-tight font-medium text-rose-deep sm:text-5xl">{reveal.title}</h2>
                    <div className="mt-8">
                      <GlowButton size="md" onClick={onReveal}>
                        {reveal.button}
                      </GlowButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* light sweep when revealed */}
              {revealed && (
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />
              )}
            </div>

            <HeartBurst burstKey={burst} count={30} distance={260} />
          </div>
        </Reveal>

        {/* the romantic message */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.92, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1.1, duration: 1.2, ease: EASE }}
              className="glass relative z-10 mx-auto mt-6 w-[90%] max-w-xl rounded-4xl px-7 py-8 text-center sm:mt-8 sm:px-10"
            >
              <HeartShape className="animate-heartbeat mx-auto h-8 w-8 text-blush-500" />
              <h3 className="mt-4 font-script text-4xl text-rose-ink sm:text-5xl">{reveal.messageTitle}</h3>
              <p className="mt-4 font-display text-lg leading-relaxed text-rose-deep/85 italic sm:text-xl">{reveal.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}
