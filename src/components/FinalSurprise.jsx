import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import SmartImage from './ui/SmartImage'
import HeartBurst from './ui/HeartBurst'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE, LetterReveal } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { pinkBurst } from '../utils/effects'

const HEART_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 29.5S2 21 2 11.3C2 6.7 5.5 3.5 9.5 3.5c2.8 0 5.1 1.6 6.5 3.9 1.4-2.3 3.7-3.9 6.5-3.9 4 0 7.5 3.2 7.5 7.8 0 9.7-14 18.2-14 18.2z'/%3E%3C/svg%3E\")"

/*  Stage timeline (ms after the section comes into view)
    1 "One Last Thing..."  2 misty photo  3 photo + glow  4 title
    5..7 wishes            8 "I Love You"  9 P.S.                       */
const STAGES = [0, 2600, 4400, 6200, 7600, 9000, 10400, 12000, 14200]

/** The climax: blush → misty photo → photo comes into focus → glowing pink → I love you. */
export default function FinalSurprise({ children }) {
  const { final } = birthdayData
  const stageRef = useRef(null)
  const loveRef = useRef(null)
  const inView = useInView(stageRef, { once: true, amount: 0.5 })
  const [stage, setStage] = useState(0)
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    if (!inView) return
    const timers = STAGES.map((t, i) => setTimeout(() => setStage(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [inView])

  // Celebrate the "I love you"
  useEffect(() => {
    if (stage !== 8) return
    setBurst(Date.now())
    const r = loveRef.current?.getBoundingClientRect()
    if (r) pinkBurst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, count: 90, spread: 110 })
  }, [stage])

  const show = (n, extra = {}) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(10px)', ...extra },
    animate: stage >= n ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {},
    transition: { duration: 1.4, ease: EASE },
  })

  return (
    <section id="final" className="relative flex min-h-svh flex-col items-center overflow-hidden px-5 pt-24 pb-16 sm:pt-28">
      {/* the same blush base as every other page */}
      <div className="theme-bg absolute inset-0" />
      {/* glowing pink world fades in once the photo is revealed */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,#fff5f8_0%,#ffe4ec_30%,#ffd1dc_58%,#f3a9be_85%,#e48aa6_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? 1 : 0 }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* photo stage */}
        <div ref={stageRef} className="relative grid aspect-square w-[min(92vw,520px)] place-items-center">
          {/* "One Last Thing..." */}
          <motion.p
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-display text-4xl text-rose-deep italic sm:text-6xl"
            animate={stage >= 2 ? { opacity: 0, y: -30, filter: 'blur(10px)' } : {}}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <LetterReveal text={final.intro} show={stage >= 1} stagger={0.08} />
          </motion.p>

          {/* heart glow */}
          <motion.div
            className="absolute inset-[-12%] text-blush-500 blur-2xl"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={stage >= 2 ? { opacity: stage >= 3 ? 0.9 : 0.55, scale: 1 } : {}}
            transition={{ duration: 2, ease: EASE }}
            aria-hidden="true"
          >
            <HeartShape className="h-full w-full" />
          </motion.div>

          {/* heart-shaped photo: misty → in focus */}
          {/* absolute + inset-0 keeps the photo box exactly square, so finalPhotoPosition can place her face */}
          <motion.div
            className="absolute inset-0"
            style={{ WebkitMaskImage: HEART_MASK, maskImage: HEART_MASK, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(16px) saturate(0.6) brightness(1.15)' }}
            animate={
              stage >= 3
                ? { opacity: 1, scale: 1, filter: 'blur(0px) saturate(1) brightness(1)' }
                : stage >= 2
                  ? { opacity: 1, scale: 0.94, filter: 'blur(12px) saturate(0.6) brightness(1.15)' }
                  : {}
            }
            transition={{ duration: stage >= 3 ? 2.2 : 1.6, ease: EASE }}
          >
            <SmartImage src={birthdayData.finalPhoto} position={birthdayData.finalPhotoPosition} alt="My favourite person" className="h-full w-full" />
          </motion.div>

          <Sparkle className="animate-twinkle absolute top-[6%] left-[4%] h-5 w-5 text-gold" />
          <Sparkle className="animate-twinkle absolute top-[14%] right-[2%] h-4 w-4 text-white [animation-delay:1s]" />
          <HeartShape className="animate-float-slow absolute right-[6%] bottom-[16%] h-7 w-7 text-white drop-shadow" />
        </div>

        <motion.h2 {...show(4, { scale: 0.9 })} className="mt-10 font-script text-[3.6rem] leading-[1.1] text-gradient-rose sm:text-8xl">
          {final.title}
        </motion.h2>

        <div className="mt-6 space-y-3 sm:mt-8">
          {final.wishes.map((wish, i) => (
            <motion.p key={i} {...show(5 + i)} className="font-display text-xl leading-relaxed text-rose-deep italic sm:text-2xl">
              {wish}
            </motion.p>
          ))}
        </div>

        <motion.div ref={loveRef} {...show(8, { scale: 0.6 })} className="relative mt-14">
          <HeartBurst burstKey={burst} count={30} distance={240} />
          <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
            <span className="absolute inset-0 animate-ping rounded-full bg-blush-400/30 [animation-duration:2.2s]" />
            <HeartShape className="animate-heartbeat relative h-full w-full text-[#e7799a] drop-shadow-[0_12px_30px_rgba(231,121,154,0.8)]" />
          </div>
          <p className="mt-6 font-display text-5xl font-semibold tracking-wide text-rose-deep sm:text-7xl">{final.love}</p>
        </motion.div>

        <motion.p {...show(9)} className="mt-14 max-w-md font-display text-base text-rose-ink/70 italic">
          {final.ps}
        </motion.p>
        <motion.p {...show(9)} className="mt-6 text-[11px] tracking-[0.35em] text-rose-ink/60 uppercase">
          {final.footer}
        </motion.p>
      </div>

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}
