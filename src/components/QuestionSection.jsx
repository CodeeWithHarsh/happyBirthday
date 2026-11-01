import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeartShape, Sparkle } from './ui/Icons'
import HeartBurst from './ui/HeartBurst'
import { EASE, Reveal } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { pinkBurst } from '../utils/effects'

const PAD = 14 // min distance from the visible edges
const rand = (a, b) => a + Math.random() * (b - a)
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
const inflate = (r, m) => ({ x: r.x - m, y: r.y - m, w: r.w + m * 2, h: r.h + m * 2 })

/** Converts a viewport rect into coordinates relative to `origin`. */
const toLocal = (rect, origin) => ({ x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height })

/**
 * "Will you stay with me forever?"
 * At first only NO is offered — and it runs away. After a few attempts YES
 * appears and keeps growing more tempting. NO always stays inside the visible
 * part of this section, never over YES, never causing horizontal scroll.
 */
export default function QuestionSection({ accepted, onYes, children }) {
  const { question } = birthdayData
  const showYesAfter = Math.max(1, question.showYesAfter ?? 3)
  const sectionRef = useRef(null)
  const rowRef = useRef(null)
  const yesRef = useRef(null)
  const noFlowRef = useRef(null)
  const noFloatRef = useRef(null)
  const titleRef = useRef(null)
  const lastDodge = useRef(0)

  const [attempts, setAttempts] = useState(0)
  const [noPos, setNoPos] = useState(null) // null = sitting in its original spot
  const [origin, setOrigin] = useState(null)
  const [burst, setBurst] = useState(0)

  const yesVisible = attempts >= showYesAfter
  const yesScale = 1 + Math.min(attempts, 6) * 0.05
  // The "YES appears" line takes one turn; the regular reactions continue after it.
  const special = question.yesAppears ? 1 : 0
  const reactionIndex = attempts > showYesAfter ? attempts - 1 - special : attempts - 1
  const reaction =
    attempts === showYesAfter && special
      ? question.yesAppears
      : attempts > 0
        ? question.reactions[reactionIndex % question.reactions.length]
        : null

  // YES makes an entrance: a little confetti pop where it appears.
  useEffect(() => {
    if (!yesVisible) return
    const raf = requestAnimationFrame(() => {
      const r = yesRef.current?.getBoundingClientRect()
      if (r) pinkBurst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, count: 60, spread: 90 })
    })
    return () => cancelAnimationFrame(raf)
  }, [yesVisible])

  const dodge = useCallback(() => {
    const now = performance.now()
    if (now - lastDodge.current < 350) return
    lastDodge.current = now

    const section = sectionRef.current
    const noEl = (noPos ? noFloatRef : noFlowRef).current
    if (!section || !noEl) return

    const s = section.getBoundingClientRect()
    const current = toLocal(noEl.getBoundingClientRect(), s)
    const bw = noEl.offsetWidth
    const bh = noEl.offsetHeight
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight

    // Visible part of the section, in section coordinates.
    const minX = Math.max(PAD, -s.left + PAD)
    const maxX = Math.max(minX, Math.min(s.width, vw - s.left) - PAD - bw)
    const minY = Math.max(PAD, -s.top + PAD + 10)
    const maxY = Math.max(minY, Math.min(s.height, vh - s.top) - PAD - bh)

    // Keep a generous gap around YES (it's growing too) — or, before it has
    // appeared, around the spot in the middle where it is about to appear.
    const row = rowRef.current ? toLocal(rowRef.current.getBoundingClientRect(), s) : null
    const yes = yesRef.current
      ? toLocal(yesRef.current.getBoundingClientRect(), s)
      : row && { x: row.x + row.w / 2 - 150, y: row.y, w: 300, h: row.h }
    const yesZone = yes ? inflate(yes, 28 + yes.w * 0.12) : null
    const anchor = yes ?? current
    const titleZone = titleRef.current ? inflate(toLocal(titleRef.current.getBoundingClientRect(), s), 6) : null
    // ...and away from the floating music button and other overlays (status bar, scroll hint, back button).
    const musicZone = { x: vw - s.left - 96, y: vh - s.top - 96, w: 96, h: 96 }
    const overlayZones = [...document.querySelectorAll('[data-avoid]')].map((el) => inflate(toLocal(el.getBoundingClientRect(), s), 10))

    const minJump = Math.min(150, (maxX - minX) / 3 + 40)
    const fits = (c, avoid) =>
      !avoid.some((z) => z && overlaps(c, z)) && Math.hypot(c.x - current.x, c.y - current.y) > minJump

    let spot = null
    for (const avoid of [[yesZone, musicZone, ...overlayZones, titleZone], [yesZone, musicZone, ...overlayZones], [yesZone]]) {
      for (let i = 0; i < 60 && !spot; i++) {
        const c = { x: rand(minX, maxX), y: rand(minY, maxY), w: bw, h: bh }
        if (fits(c, avoid)) spot = c
      }
      if (spot) break
    }
    // Fallback: the visible corner farthest from YES.
    if (!spot) {
      const corners = [
        { x: minX, y: minY },
        { x: maxX, y: minY },
        { x: minX, y: maxY },
        { x: maxX, y: maxY },
      ]
      spot = corners.reduce((best, c) =>
        Math.hypot(c.x - anchor.x, c.y - anchor.y) > Math.hypot(best.x - anchor.x, best.y - anchor.y) ? c : best,
      )
    }

    if (!noPos) setOrigin({ x: current.x, y: current.y })
    const next = attempts + 1
    setAttempts(next)
    if (next === showYesAfter) setBurst(Date.now())
    setNoPos({
      x: spot.x,
      y: spot.y,
      rotate: rand(-16, 16),
      scale: Math.max(0.72, 1 - next * 0.04),
    })
  }, [attempts, noPos, showYesAfter])

  // Keep the runaway button inside the section if the screen size changes.
  useEffect(() => {
    if (!noPos) return
    const onResize = () => {
      const s = sectionRef.current?.getBoundingClientRect()
      const el = noFloatRef.current
      if (!s || !el) return
      setNoPos((p) =>
        p && {
          ...p,
          x: Math.min(Math.max(PAD, p.x), s.width - el.offsetWidth - PAD),
          y: Math.min(Math.max(PAD, p.y), s.height - el.offsetHeight - PAD),
        },
      )
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [noPos])

  const noHandlers = {
    // Desktop: it escapes before the mouse even arrives.
    onPointerEnter: (e) => e.pointerType === 'mouse' && dodge(),
    // Touch / pen: it escapes the moment she taps.
    onPointerDown: (e) => {
      e.preventDefault()
      dodge()
    },
    // Keyboard (Enter / Space) or any click that sneaks through.
    onClick: (e) => {
      e.preventDefault()
      dodge()
    },
  }

  const sayYes = () => {
    setBurst(Date.now())
    onYes()
  }

  return (
    <section
      ref={sectionRef}
      id="question"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden theme-bg px-5 py-24"
    >
      {/* playful bubbly background */}
      <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(#f9b4c6_1.2px,transparent_1.2px)] bg-size-[26px_26px] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="ambient" aria-hidden="true">
        <div className="blob animate-drift top-[10%] left-[5%] h-[30vmax] w-[30vmax] bg-blush-300/70" />
        <div className="blob animate-drift right-[0%] bottom-[5%] h-[28vmax] w-[28vmax] bg-blush-200/70 [animation-delay:-7s]" />
      </div>
      {[
        'top-[14%] left-[12%] h-8 w-8 -rotate-12',
        'top-[22%] right-[10%] h-6 w-6 rotate-12',
        'bottom-[18%] left-[16%] h-5 w-5 rotate-6',
        'bottom-[12%] right-[18%] h-9 w-9 -rotate-6',
      ].map((c, i) => (
        <HeartShape key={i} className={`animate-float-slow absolute text-blush-300 ${c}`} style={{ animationDelay: `${-i * 1.5}s` }} />
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <div ref={titleRef}>
          <Reveal className="text-[11px] font-normal tracking-[0.35em] text-gold uppercase">{question.eyebrow}</Reveal>
          <Reveal as="h2" delay={0.15} scale={0.9} className="mt-5 font-display text-[2.7rem] leading-[1.05] font-medium text-rose-deep sm:text-6xl md:text-7xl">
            {question.title}
          </Reveal>
        </div>

        {/* reaction bubble (fixed height so nothing jumps) */}
        <div className="mt-8 flex h-20 items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {accepted ? (
              <motion.p
                key="accepted"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-script text-4xl text-rose-ink sm:text-5xl"
              >
                {question.accepted}
              </motion.p>
            ) : (
              reaction && (
                <motion.p
                  key={attempts}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="glass max-w-[90vw] rounded-3xl px-5 py-2.5 font-display text-lg text-rose-ink italic sm:text-xl"
                >
                  {reaction}
                </motion.p>
              )
            )}
          </AnimatePresence>
        </div>

        {!accepted && (
          <Reveal delay={0.3} className="mt-6 w-full">
            {/* fixed height, so nothing jumps when buttons come and go */}
            <div ref={rowRef} className="flex min-h-28 items-center justify-center">
              {/* YES — only appears after she has chased NO a few times */}
              <AnimatePresence>
                {yesVisible && (
                  <motion.div
                    key="yes"
                    className="relative"
                    initial={{ opacity: 0, scale: 0, rotate: -14, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                    transition={{ type: 'spring', stiffness: 220, damping: 13 }}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="absolute -inset-4 rounded-full bg-blush-400/50 blur-xl"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.1, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.button
                      ref={yesRef}
                      type="button"
                      onClick={sayYes}
                      animate={{ scale: yesScale }}
                      whileHover={{ scale: yesScale * 1.08 }}
                      whileTap={{ scale: yesScale * 0.94 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="relative rounded-full bg-linear-to-r from-[#f7a1bb] via-blush-500 to-[#e7799a] px-12 py-5 font-display text-2xl font-semibold tracking-wide text-white shadow-[0_14px_40px_-8px_rgba(231,121,154,0.85),inset_0_1px_0_rgba(255,255,255,0.5)] outline-none focus-visible:ring-4 focus-visible:ring-white sm:px-14 sm:text-3xl"
                    >
                      {question.yes}
                    </motion.button>
                    <Sparkle className="animate-twinkle absolute -top-3 -right-2 h-4 w-4 text-gold" />
                    <Sparkle className="animate-twinkle absolute -bottom-2 -left-3 h-3 w-3 text-gold [animation-delay:0.8s]" />
                    <HeartBurst burstKey={burst} count={26} distance={220} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NO — its starting spot, until the first time it runs away */}
              {!noPos && (
                <button
                  ref={noFlowRef}
                  type="button"
                  {...noHandlers}
                  aria-label="No (careful — this button is very shy)"
                  className="rounded-full border-2 border-blush-300 bg-white/80 px-8 py-4 font-display text-xl font-medium text-rose-ink shadow-[0_8px_24px_-10px_rgba(194,79,120,0.4)] backdrop-blur transition-colors select-none sm:text-2xl"
                  style={{ touchAction: 'manipulation' }}
                >
                  {question.no}
                </button>
              )}
            </div>
          </Reveal>
        )}

        {!accepted && attempts >= showYesAfter + 3 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 font-display text-base text-rose-ink/60 italic">
            {question.hint}
          </motion.p>
        )}
      </div>

      {/* NO — the runaway version */}
      {noPos && !accepted && (
        <motion.button
          ref={noFloatRef}
          type="button"
          {...noHandlers}
          aria-label="No (careful — this button is very shy)"
          initial={{ x: origin?.x ?? noPos.x, y: origin?.y ?? noPos.y, rotate: 0, scale: 1 }}
          animate={{ x: noPos.x, y: noPos.y, rotate: noPos.rotate, scale: noPos.scale }}
          transition={{ type: 'spring', stiffness: 520, damping: 24, mass: 0.6 }}
          className="absolute top-0 left-0 z-20 rounded-full border-2 border-blush-300 bg-white/90 px-8 py-4 font-display text-xl font-medium whitespace-nowrap text-rose-ink shadow-[0_8px_24px_-10px_rgba(194,79,120,0.4)] select-none sm:text-2xl"
          style={{ touchAction: 'manipulation' }}
        >
          {question.no}
        </motion.button>
      )}

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}
