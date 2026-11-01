import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import SmartImage from './ui/SmartImage'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE, Reveal } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { useFinePointer } from '../hooks/useMediaQuery'
import { usePageScroll } from '../context/StoryContext'

const ORBIT_HEARTS = [0, 72, 144, 216, 288]

/** Her portrait in an arch frame: glow, rings, orbiting hearts, 3D tilt. */
export default function HerPortrait({ children }) {
  const ref = useRef(null)
  const finePointer = useFinePointer()
  const { portrait } = birthdayData

  // Scroll parallax
  const { scrollYProgress } = usePageScroll(ref, ['start end', 'end start'])
  const ringsY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const photoY = useTransform(scrollYProgress, [0, 1], [30, -30])

  // Pointer tilt (desktop)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 14 })

  const onMove = (e) => {
    if (!finePointer) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden theme-bg px-5 py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* ── Photo ── */}
        <div className="relative mx-auto flex w-full justify-center perspective-distant" onPointerMove={onMove} onPointerLeave={onLeave}>
          {/* rings */}
          <motion.div style={{ y: ringsY }} className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="absolute aspect-square w-[min(108vw,560px)] rounded-full border border-gold/30" />
            <div className="absolute aspect-square w-[min(96vw,500px)] rounded-full border border-dashed border-blush-400/50 animate-spin-slow" />
            <div className="animate-spin-slow absolute aspect-square w-[min(84vw,440px)] [animation-direction:reverse] [animation-duration:60s]">
              {ORBIT_HEARTS.map((deg, i) => (
                <span
                  key={deg}
                  className="absolute top-1/2 left-1/2 h-4 w-4 text-blush-400"
                  style={{ transform: `rotate(${deg}deg) translateY(calc(-1 * min(42vw, 220px))) rotate(-${deg}deg)`, margin: '-8px' }}
                >
                  {i % 2 ? <Sparkle className="h-full w-full text-gold" /> : <HeartShape className="h-full w-full" />}
                </span>
              ))}
            </div>
          </motion.div>

          {/* glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2, delay: 0.9, ease: EASE }}
            className="absolute top-1/2 left-1/2 aspect-square w-[min(80vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(239,143,171,0.65),rgba(255,209,220,0.35),transparent)] blur-2xl"
          />

          <motion.div style={{ rotateX, rotateY, y: photoY }} className="relative transform-3d">
            <motion.div
              initial={{ opacity: 0, scale: 0.82, filter: 'blur(24px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.8, ease: EASE }}
              className="relative"
            >
              <SmartImage
                src={birthdayData.heroPhoto}
                alt="The birthday girl"
                className="aspect-4/5 w-[min(74vw,360px)] rounded-t-[999px] rounded-b-[2.5rem] border-[6px] border-white shadow-[0_30px_80px_-20px_rgba(194,79,120,0.55)]"
              />
              {/* soft inner light */}
              <div className="pointer-events-none absolute inset-1.5 rounded-t-[999px] rounded-b-[2.2rem] bg-linear-to-t from-rose-deep/15 via-transparent to-white/10" />

              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -8 }}
                whileInView={{ opacity: 1, y: 0, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 1, ease: EASE }}
                className="glass absolute -bottom-6 -left-4 rounded-2xl px-4 py-2 sm:-left-10"
              >
                <span className="font-script text-2xl text-rose-ink sm:text-3xl">{portrait.eyebrow}</span>
              </motion.div>
              <HeartShape className="animate-heartbeat absolute -top-2 -right-2 h-10 w-10 text-blush-500 drop-shadow-[0_6px_14px_rgba(239,143,171,0.7)] sm:-right-6" />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Words ── */}
        <div className="relative text-center lg:text-left">
          <Reveal className="text-[11px] font-normal tracking-[0.35em] text-gold uppercase">{birthdayData.birthday}</Reveal>
          <Reveal as="blockquote" delay={0.15} className="mt-6 font-display text-3xl leading-snug text-rose-deep sm:text-4xl md:text-[2.75rem]">
            <span className="mr-1 font-script text-6xl leading-none text-blush-400">“</span>
            {portrait.quote}
          </Reveal>
          <Reveal delay={0.35} className="ornament mx-auto mt-8 w-fit lg:mx-0">
            <HeartShape className="h-3.5 w-3.5" />
          </Reveal>
          <Reveal as="p" delay={0.5} className="mt-6 font-script text-3xl text-rose-ink sm:text-4xl">
            {portrait.caption}
          </Reveal>
        </div>
      </div>

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}
