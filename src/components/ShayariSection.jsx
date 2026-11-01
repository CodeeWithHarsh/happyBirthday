import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import GlowButton from './ui/GlowButton'
import HeartBurst from './ui/HeartBurst'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE, LetterReveal } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { pinkBurst } from '../utils/effects'

const REACT_FOR = 1900 // ms the reaction stays before the shayari begins
const HOLD_FOR = 1600 // ms she has to hold the heart for "hold" questions
const LINE_GAP = 0.6 // s between verses

// A fixed starfield (no randomness, so it never jumps between renders)
const STARS = Array.from({ length: 48 }, (_, i) => ({
  left: `${(i * 37.7) % 100}%`,
  top: `${(i * 53.3 + 7) % 100}%`,
  size: 1 + (i % 3),
  delay: `${(i % 7) * 0.45}s`,
}))

const burstFrom = (el, count = 70) => {
  const r = el?.getBoundingClientRect()
  if (r) pinkBurst({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, count, spread: 100 })
}

/** "Dil Ki Baatein" — a little mehfil under a blush sky with a golden moon. One shayari at a time, each behind a dramatic question. */
export default function ShayariSection({ children }) {
  const { shayari } = birthdayData
  const { poems } = shayari
  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState('ask') // ask → react → reveal
  const [reaction, setReaction] = useState(null)
  const [done, setDone] = useState(() => new Set())
  const [finished, setFinished] = useState(false)
  const [burst, setBurst] = useState(0)
  const cardRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const open = (i, doneSet = done) => {
    clearTimeout(timer.current)
    setCurrent(i)
    setReaction(null)
    setPhase(doneSet.has(i) ? 'reveal' : 'ask')
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const answer = (text) => {
    setReaction(text)
    setPhase('react')
    setBurst(Date.now())
    burstFrom(cardRef.current, 50)
    timer.current = setTimeout(() => setPhase('reveal'), REACT_FOR)
  }

  const wah = () => {
    setBurst(Date.now())
    burstFrom(cardRef.current, 90)
    const nextDone = new Set(done).add(current)
    setDone(nextDone)
    const upcoming = [...poems.keys()].find((i) => i > current && !nextDone.has(i)) ?? [...poems.keys()].find((i) => !nextDone.has(i))
    if (upcoming === undefined) setFinished(true)
    else open(upcoming, nextDone)
  }

  const poem = poems[current]
  const counter = shayari.counter.replace('{n}', current + 1).replace('{total}', poems.length)

  return (
    <section className="relative overflow-hidden theme-bg px-5 py-24 sm:py-32">
      {/* blush sky: twinkling dots and a golden moon */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-blush-400"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, opacity: 0.7 }}
          />
        ))}
        <div className="absolute top-4 right-4 h-12 w-12 rounded-full sm:top-10 sm:right-[8%] bg-[radial-gradient(circle_at_35%_35%,#fffaf0_0%,#f6dcae_60%,#e3bf86_100%)] shadow-[0_0_80px_30px_rgba(246,220,174,0.28)] sm:h-28 sm:w-28" />
        <div className="blob bottom-[5%] left-[-15%] h-[45vmax] w-[45vmax] bg-blush-300/50" />
      </div>

      <div className="relative z-10">
        <SectionHeading eyebrow={shayari.eyebrow} title={shayari.title} subtitle={shayari.subtitle} />

        {/* progress: one heart per shayari — read ones can be opened again */}
        <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-1 sm:gap-2.5" role="tablist" aria-label="Shayari">
          {poems.map((p, i) => {
            const isDone = done.has(i)
            const isCurrent = i === current
            return (
              <button
                key={p.title}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`${i + 1}. ${p.title}`}
                disabled={!isDone || isCurrent}
                onClick={() => open(i)}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isCurrent ? 'bg-white/80 ring-2 ring-blush-400' : ''} ${isDone && !isCurrent ? 'cursor-pointer hover:scale-110' : ''}`}
              >
                <HeartShape
                  filled={isDone || isCurrent}
                  className={`h-4 w-4 ${isDone ? 'text-blush-500' : isCurrent ? 'animate-heartbeat text-blush-500' : 'text-blush-300'}`}
                />
              </button>
            )
          })}
        </div>
        {finished && <p className="mt-3 text-center text-xs tracking-wide text-rose-ink/60">{shayari.reread}</p>}

        {/* the card */}
        <div ref={cardRef} className="relative mx-auto mt-8 max-w-2xl scroll-mt-24">
          <AnimatePresence mode="wait">
            <motion.article
              key={current}
              initial={{ opacity: 0, y: 40, rotateX: 12, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)', transition: { duration: 0.45 } }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative rounded-[2.2rem] border border-white bg-white/70 px-5 pt-8 pb-10 text-center shadow-[0_30px_80px_-30px_rgba(194,79,120,0.45)] backdrop-blur-md sm:px-12 sm:pt-10 sm:pb-12"
            >
              <Sparkle className="animate-twinkle absolute top-5 left-6 h-4 w-4 text-gold" />
              <Sparkle className="animate-twinkle absolute top-8 right-7 h-3 w-3 text-gold [animation-delay:1.2s]" />
              <HeartBurst burstKey={burst} count={24} distance={200} />

              <p className="text-[11px] tracking-[0.35em] text-gold uppercase">{counter}</p>
              <h3 className="mt-2 font-script text-4xl text-rose-ink sm:text-5xl">{poem.title}</h3>

              <div className="mt-8 min-h-56">
                <AnimatePresence mode="wait">
                  {phase === 'ask' && <Ask key="ask" ask={poem.ask} onAnswer={answer} />}
                  {phase === 'react' && (
                    <motion.div
                      key="react"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="flex min-h-56 flex-col items-center justify-center gap-5"
                    >
                      <HeartShape className="animate-heartbeat h-12 w-12 text-blush-400 drop-shadow-[0_0_24px_rgba(249,180,198,0.8)]" />
                      <p className="max-w-md font-display text-2xl text-rose-deep italic sm:text-3xl">{reaction}</p>
                    </motion.div>
                  )}
                  {phase === 'reveal' && (
                    <Verses
                      key="reveal"
                      poem={poem}
                      irshaad={shayari.irshaad}
                      quick={done.has(current)}
                      button={finished ? null : done.size === poems.length - 1 && !done.has(current) ? shayari.last : shayari.wah}
                      onWah={wah}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {finished && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            className="mx-auto mt-14 max-w-xl text-center font-script text-4xl leading-snug text-rose-ink sm:text-5xl"
          >
            {shayari.finale}
          </motion.p>
        )}
      </div>

      {/* chapter ending: only once every shayari has had its "Wah! Wah!" */}
      {finished && children}
    </section>
  )
}

/** The dramatic question in front of each shayari. */
function Ask({ ask, onAnswer }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)', transition: { duration: 0.4 } }}
      className="flex flex-col items-center"
    >
      <p className="max-w-lg font-display text-[1.7rem] leading-snug text-rose-deep sm:text-4xl">
        <LetterReveal text={ask.question} show stagger={0.025} />
      </p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(2.2, ask.question.length * 0.025 + 0.3), duration: 0.7, ease: EASE }}
        className="mt-9 w-full"
      >
        {ask.type === 'choice' && <Choices options={ask.options} onAnswer={onAnswer} />}
        {ask.type === 'dodge' && <Dodge ask={ask} onAnswer={onAnswer} />}
        {ask.type === 'hold' && <Hold ask={ask} onAnswer={onAnswer} />}
      </motion.div>
    </motion.div>
  )
}

const pill =
  'rounded-full border-2 border-blush-300 bg-white/85 px-6 py-3 font-display text-lg text-rose-ink shadow-[0_8px_24px_-10px_rgba(194,79,120,0.4)] backdrop-blur transition-colors hover:border-blush-400 hover:bg-white sm:text-xl'

function Choices({ options, onAnswer }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {options.map((o) => (
        <motion.button
          key={o.label}
          type="button"
          whileHover={{ scale: 1.07, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => onAnswer(o.reaction)}
          className={pill}
        >
          {o.label}
        </motion.button>
      ))}
    </div>
  )
}

/** One honest button, one that runs away every time she reaches for it. */
function Dodge({ ask, onAnswer }) {
  const areaRef = useRef(null)
  const runRef = useRef(null)
  const stayRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0, rotate: 0 })
  const [chases, setChases] = useState(0)
  const last = useRef(0)

  const run = () => {
    const now = performance.now()
    if (now - last.current < 300) return
    last.current = now
    const area = areaRef.current?.getBoundingClientRect()
    const btn = runRef.current?.getBoundingClientRect()
    const stay = stayRef.current?.getBoundingClientRect()
    if (!area || !btn || !stay) return
    // Where the button would sit without any offset (its spot in the row)
    const homeX = btn.left - area.left - pos.x
    const homeY = btn.top - area.top - pos.y
    // Hop somewhere inside the answer area, below the honest button, clearly away from where it was
    const minY = stay.bottom - area.top + 10
    const maxY = Math.max(minY, area.height - btn.height)
    const maxX = Math.max(0, area.width - btn.width)
    let next
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * maxX
      const y = minY + Math.random() * (maxY - minY)
      next = { x: x - homeX, y: y - homeY, rotate: Math.random() * 24 - 12 }
      if (Math.hypot(next.x - pos.x, next.y - pos.y) > 90) break
    }
    setPos(next)
    setChases((c) => c + 1)
  }

  const runHandlers = {
    onPointerEnter: (e) => e.pointerType === 'mouse' && run(),
    onPointerDown: (e) => {
      e.preventDefault()
      run()
    },
    onClick: (e) => {
      e.preventDefault()
      run()
    },
  }

  return (
    <div ref={areaRef} className="relative flex h-44 flex-wrap content-start items-start justify-center gap-4">
      <GlowButton ref={stayRef} size="md" decorations={false} onClick={() => onAnswer(ask.stay.reaction)}>
        {ask.stay.label}
      </GlowButton>
      <motion.button
        ref={runRef}
        type="button"
        {...runHandlers}
        animate={pos}
        transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.6 }}
        className={`${pill} relative z-20 select-none`}
        style={{ touchAction: 'manipulation' }}
        aria-label={`${ask.run} (this button is very shy)`}
      >
        {ask.run}
      </motion.button>
      <AnimatePresence>
        {chases >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute inset-x-0 -bottom-9 font-display text-base text-rose-ink/80 italic"
          >
            {ask.chased}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Press and hold the heart — a ring fills up, then the "drawer" opens. */
function Hold({ ask, onAnswer }) {
  const [holding, setHolding] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const start = (e) => {
    e.preventDefault()
    if (holding) return
    setHolding(true)
    timer.current = setTimeout(() => onAnswer(ask.reaction), HOLD_FOR)
  }
  const stop = () => {
    clearTimeout(timer.current)
    setHolding(false)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.button
        type="button"
        aria-label={ask.hint}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !e.repeat && start(e)}
        onKeyUp={stop}
        onContextMenu={(e) => e.preventDefault()}
        animate={holding ? { scale: 1.12, rotate: [0, -3, 3, -3, 0] } : { scale: 1, rotate: 0 }}
        transition={holding ? { rotate: { repeat: Infinity, duration: 0.35 }, scale: { duration: 0.3 } } : { duration: 0.3 }}
        className="relative grid h-32 w-32 place-items-center rounded-full outline-none select-none focus-visible:ring-4 focus-visible:ring-blush-300"
        style={{ touchAction: 'none' }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(239,143,171,0.25)" strokeWidth="4" />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#ef8fab"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: holding ? 1 : 0 }}
            transition={{ duration: holding ? HOLD_FOR / 1000 : 0.3, ease: 'linear' }}
          />
        </svg>
        <HeartShape className="h-16 w-16 text-blush-500 drop-shadow-[0_0_28px_rgba(239,143,171,0.7)]" />
      </motion.button>
      <p className="font-display text-lg text-rose-ink/80 italic">{ask.hint}</p>
    </div>
  )
}

/** "Irshaad..." then the lines rise one by one; "Wah! Wah!" waits at the end. */
function Verses({ poem, irshaad, quick, button, onWah }) {
  const [skip, setSkip] = useState(quick)
  const highlight = new Set((poem.highlight ?? []).map((h) => h.toLowerCase()))
  const gap = skip ? 0.08 : LINE_GAP
  const start = skip ? 0.1 : 1.1
  const end = start + poem.lines.length * gap + 0.3

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      onClick={() => setSkip(true)}
      className="flex flex-col items-center"
    >
      <p className="font-display text-xl text-gold italic sm:text-2xl">
        <LetterReveal text={irshaad} show stagger={skip ? 0 : 0.07} />
      </p>
      <div className="mt-6 space-y-3 sm:space-y-4">
        {poem.lines.map((line, i) => {
          const glow = highlight.has(line.trim().toLowerCase())
          return (
            <motion.p
              key={`${skip}-${i}`}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: start + i * gap, ease: EASE }}
              className={
                glow
                  ? 'font-script text-[2.1rem] leading-tight text-gradient-rose sm:text-5xl'
                  : 'font-display text-[1.3rem] leading-snug text-rose-deep italic sm:text-2xl'
              }
            >
              {line}
            </motion.p>
          )
        })}
      </div>
      {button && (
        <motion.div
          key={`wah-${skip}`}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: end, ease: EASE }}
          className="mt-10"
          onClick={(e) => e.stopPropagation()}
        >
          <GlowButton size="md" onClick={onWah}>
            {button}
          </GlowButton>
        </motion.div>
      )}
    </motion.div>
  )
}
