import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { HeartShape } from '../ui/Icons'
import { useStory } from '../../context/StoryContext'
import { birthdayData } from '../../data/birthdayData'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

/**
 * The status bar at the top: one step per chapter plus the final heart.
 * Chapters unlock one at a time — finishing a chapter opens the next.
 * Completed chapters show a tick and can be revisited; locked ones show a lock.
 */
export default function ChapterProgress() {
  const { pages, index, furthest, completed, goTo } = useStory()
  const [notice, setNotice] = useState(null)
  const noticeTimer = useRef(0)

  const steps = useMemo(() => {
    const list = []
    pages.forEach((p, i) => {
      if (p.type === 'cover') list.push({ key: p.id, title: p.title, cover: i, end: i + 1 })
      if (p.type === 'final') list.push({ key: 'final', title: p.title, cover: i, end: i, final: true })
    })
    return list
  }, [pages])

  useEffect(() => () => clearTimeout(noticeTimer.current), [])

  if (index < 1) return null // not during the intro

  // A chapter is finished once she has reached its "Up next" ending (or moved past it).
  const isDone = (s) => !s.final && (completed.has(s.key) || furthest > s.end)

  const statusOf = (s, i) => {
    if (index >= s.cover && index <= s.end) return 'current'
    if (isDone(s)) return 'done'
    // Unlocked if she has been there before, or the chapter before it is finished.
    // Chapter I opens from the birthday page; the final heart only after YES.
    const unlocked = furthest >= s.cover || (!s.final && (i === 0 ? furthest >= 1 : isDone(steps[i - 1])))
    return unlocked ? 'open' : 'locked'
  }

  const current = steps.find((s, i) => statusOf(s, i) === 'current')

  const showNotice = (s) => {
    // name the chapter she still has to finish — the first one not finished yet
    const pending = steps.find((x) => !x.final && !isDone(x))
    const text =
      s.final || !pending
        ? birthdayData.navigation.lockedFinal
        : birthdayData.navigation.locked.replace('{chapter}', pending.title)
    setNotice(text)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 2600)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-75 flex flex-col items-center px-16 sm:top-5">
      <motion.nav
        aria-label="Chapters"
        data-avoid
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="glass pointer-events-auto flex flex-col items-center rounded-full px-2.5 py-2 sm:px-5"
      >
        <ol className="flex items-center">
          {steps.map((s, i) => (
            <li key={s.key} className="flex items-center">
              {i > 0 && <Connector filled={isDone(steps[i - 1])} />}
              <Step step={s} numeral={NUMERALS[i]} status={statusOf(s, i)} onOpen={() => goTo(s.cover)} onLocked={() => showNotice(s)} />
            </li>
          ))}
        </ol>
        {current && (
          <AnimatePresence mode="wait">
            <motion.p
              key={current.key}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mt-1 hidden text-[10px] tracking-[0.25em] text-rose-ink/80 uppercase sm:block"
            >
              {current.title}
            </motion.p>
          </AnimatePresence>
        )}
      </motion.nav>

      <AnimatePresence>
        {notice && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mt-3 rounded-2xl px-4 py-2 text-center font-display text-base text-rose-ink italic"
          >
            {notice}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Connector({ filled }) {
  return (
    <span className="relative h-0.5 w-1.5 overflow-hidden rounded-full bg-rose-ink/15 sm:mx-1 sm:w-5" aria-hidden="true">
      <motion.span
        className="absolute inset-0 origin-left bg-linear-to-r from-blush-400 to-blush-500"
        initial={false}
        animate={{ scaleX: filled ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </span>
  )
}

function Step({ step, numeral, status, onOpen, onLocked }) {
  const controls = useAnimationControls()
  const locked = status === 'locked'

  const onClick = () => {
    if (locked) {
      controls.start({ x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.45 } })
      onLocked()
    } else if (status !== 'current') onOpen()
  }

  const label = `${step.final ? 'The last surprise' : `Chapter ${numeral}`}: ${step.title}${
    locked ? ' (locked)' : status === 'done' ? ' (finished)' : status === 'current' ? ' (you are here)' : ''
  }`

  const look = {
    done: 'bg-linear-to-br from-blush-400 to-blush-500 text-white shadow-[0_4px_12px_-4px_rgba(231,121,154,0.9)]',
    current: 'bg-white text-rose-deep ring-2 ring-gold/70 shadow-[0_0_16px_rgba(239,143,171,0.8)]',
    open: 'bg-white/90 text-rose-ink ring-1 ring-blush-300',
    locked: 'bg-white/40 text-rose-ink/40',
  }[status]

  return (
    <motion.button
      type="button"
      animate={controls}
      onClick={onClick}
      aria-label={label}
      aria-current={status === 'current' ? 'step' : undefined}
      className={`group relative grid h-5.5 w-5.5 place-items-center rounded-full font-display text-[10px] font-semibold transition-colors sm:h-7 sm:w-7 sm:text-xs ${look} ${
        locked ? 'cursor-not-allowed' : status === 'current' ? 'cursor-default' : 'cursor-pointer hover:scale-110'
      }`}
    >
      {status === 'current' && (
        <motion.span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full border border-blush-400"
          animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {/* re-keyed on every status change, so an unlock pops in */}
      <motion.span
        key={status}
        className="relative grid place-items-center"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
      >
        {locked ? (
          <Lock className="h-3 w-3" strokeWidth={2.2} />
        ) : status === 'done' ? (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        ) : step.final || status === 'current' ? (
          <HeartShape className="h-3.5 w-3.5 text-blush-500" />
        ) : (
          numeral
        )}
      </motion.span>

      {/* tooltip (desktop) */}
      <span className="pointer-events-none absolute top-full left-1/2 mt-3 hidden -translate-x-1/2 rounded-full bg-rose-deep/90 px-3 py-1 text-[10px] font-normal tracking-[0.15em] whitespace-nowrap text-white uppercase opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        {locked ? '🔒 ' : ''}
        {step.title}
      </span>
    </motion.button>
  )
}
