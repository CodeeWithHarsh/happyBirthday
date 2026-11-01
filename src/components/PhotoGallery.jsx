import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import SmartImage from './ui/SmartImage'
import SecretSurprise from './SecretSurprise'
import { HeartShape, Sparkle } from './ui/Icons'
import { EASE } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'
import { useScrollLock } from '../hooks/useScrollLock'

/* ── Art-directed scrapbook layout ─────────────────────────────────────────
   One "page" holds 9 photos, each slot shaped for the photo that sits in it
   (tall, wide, square-ish) and overlapping its neighbours a little. Extra
   photos start a new, mirrored page. [colStart, colEnd, rowStart, rowEnd, tilt, z] */
const DESKTOP_PAGE = { rows: 26, cols: 12, slots: [
  [1, 4, 1, 8, -5, 1],
  [4, 10, 2, 8, 2, 2],
  [10, 13, 1, 9, 4, 1],
  [1, 5, 9, 17, 3, 1],
  [5, 8, 7, 15, -3, 3],
  [8, 13, 8, 14, -2, 2],
  [2, 5, 17, 25, -3, 2],
  [5, 9, 14, 22, 2, 1],
  [9, 12, 15, 23, 4, 2],
] }
const MOBILE_PAGE = { rows: 37, cols: 6, slots: [
  [1, 4, 1, 7, -4, 1],
  [1, 6, 7, 12, 2, 2],
  [4, 7, 2, 8, 4, 1],
  [3, 7, 12, 18, -3, 1],
  [1, 4, 12, 19, 3, 2],
  [1, 6, 19, 24, -2, 1],
  [3, 7, 23, 30, 3, 2],
  [1, 4, 29, 36, -3, 1],
  [4, 7, 30, 36, 4, 2],
] }

function place(page, index) {
  const pageIndex = Math.floor(index / page.slots.length)
  const [c1, c2, r1, r2, tilt, z] = page.slots[index % page.slots.length]
  const mirror = pageIndex % 2 === 1
  const line = page.cols + 2
  const base = pageIndex * page.rows
  return {
    col: mirror ? `${line - c2} / ${line - c1}` : `${c1} / ${c2}`,
    row: `${base + r1} / ${base + r2}`,
    tilt: mirror ? -tilt : tilt,
    z,
  }
}

// A different entrance for every photo
const ENTRANCES = [
  { opacity: 0, x: -140 },
  { opacity: 0, x: 140 },
  { opacity: 0, scale: 0.8 },
  { opacity: 0, rotateOffset: 22 },
  { opacity: 0, filter: 'blur(18px)' },
  // never start fully clipped: a 100% inset has no visible area, so whileInView never fires
  { clipPath: 'inset(65% 0% 0% 0%)' },
  { opacity: 0, y: 120 },
  { opacity: 0, y: -100, scale: 1.12, rotateOffset: -14 },
]

const normalize = (p) => (typeof p === 'string' ? { src: p } : p)

/** "Our Little Memories" — a cinematic scrapbook, not a grid. */
export default function PhotoGallery({ children }) {
  const { gallery } = birthdayData
  const photos = gallery.photos.map(normalize)
  const [active, setActive] = useState(null)

  return (
    <section className="grain relative overflow-hidden theme-bg px-4 py-24 sm:px-6 sm:py-32">
      <div className="ambient" aria-hidden="true">
        <div className="blob top-[10%] left-[-10%] h-[45vmax] w-[45vmax] bg-blush-200/70" />
        <div className="blob right-[-10%] bottom-[10%] h-[40vmax] w-[40vmax] bg-blush-300/50" />
      </div>

      <div className="relative z-10">
        <SectionHeading eyebrow="Warm little moments" title={gallery.title} subtitle={gallery.subtitle} />

        <div className="relative mx-auto mt-16 max-w-5xl sm:mt-24">
          <div className="scrapbook">
            {photos.map((photo, i) => (
              <ScrapPhoto key={photo.src + i} photo={photo} index={i} onOpen={() => setActive(i)} />
            ))}
          </div>

          {/* stickers & doodles */}
          <span className="pointer-events-none absolute -top-10 right-2 rotate-12 font-script text-4xl text-blush-500/80 sm:-top-14 sm:text-5xl" aria-hidden="true">
            xoxo
          </span>
          <Sparkle className="animate-twinkle pointer-events-none absolute top-[45%] -left-1 z-30 h-5 w-5 text-gold" />
          <Sparkle className="animate-twinkle pointer-events-none absolute top-[20%] right-[1%] z-30 h-4 w-4 text-gold [animation-delay:1s]" />
          <HeartShape className="animate-float-slow pointer-events-none absolute top-[62%] right-0 z-30 h-6 w-6 text-blush-400" />

          {/* ♡ the hidden secret heart */}
          <SecretSurprise className="absolute -bottom-6 left-0 z-30" />
        </div>
      </div>

      <Lightbox photos={photos} index={active} setIndex={setActive} />

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}

function ScrapPhoto({ photo, index, onOpen }) {
  const d = place(DESKTOP_PAGE, index)
  const m = place(MOBILE_PAGE, index)
  const { rotateOffset = 0, ...entrance } = ENTRANCES[index % ENTRANCES.length]
  const kind = photo.frame ?? (photo.caption ? 'polaroid' : index % 2 ? 'tape' : 'plain')

  const target = { opacity: 1, x: 0, y: 0, scale: 1, rotate: d.tilt }
  if (entrance.filter) Object.assign(target, { filter: 'blur(0px)', transitionEnd: { filter: 'none' } })
  if (entrance.clipPath) Object.assign(target, { clipPath: 'inset(-20% -20% -20% -20%)', transitionEnd: { clipPath: 'none' } })

  const frame = {
    polaroid: 'bg-white p-2 pb-10 sm:p-3 sm:pb-14 shadow-[0_18px_40px_-14px_rgba(120,60,40,0.35)]',
    tape: 'bg-white p-1.5 sm:p-2 shadow-[0_14px_34px_-14px_rgba(120,60,40,0.35)]',
    plain: 'rounded-3xl p-1 bg-white/90 shadow-[0_18px_40px_-14px_rgba(194,79,120,0.4)]',
    corners: 'bg-[#fffaf6] p-2.5 sm:p-3.5 shadow-[0_16px_36px_-14px_rgba(120,60,40,0.35)]',
  }[kind]

  return (
    <motion.figure
      className="scrap-item relative m-0 cursor-zoom-in"
      style={{ '--d-col': d.col, '--d-row': d.row, '--m-col': m.col, '--m-row': m.row, zIndex: d.z }}
      initial={{ rotate: d.tilt + rotateOffset, ...entrance }}
      whileInView={target}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, ease: EASE, delay: (index % 3) * 0.08 }}
      whileHover={{ rotate: 0, scale: 1.05, zIndex: 25, transition: { type: 'spring', stiffness: 220, damping: 18 } }}
      onClick={onOpen}
    >
      <div className={`relative flex h-full flex-col ${frame}`}>
        {kind === 'tape' && <span className="tape" aria-hidden="true" />}
        <SmartImage
          src={photo.src}
          alt={photo.caption ?? `Memory ${index + 1}`}
          position={photo.position}
          className={`min-h-0 flex-1 ${kind === 'plain' ? 'rounded-[1.3rem]' : ''}`}
        />
        {kind === 'corners' && <PhotoCorners />}
        {kind === 'polaroid' && (
          <figcaption className="absolute inset-x-2 bottom-1 line-clamp-2 text-center font-script text-[1.05rem] leading-[1.1] text-rose-ink sm:bottom-3 sm:text-[1.7rem] sm:leading-tight">
            {photo.caption}
          </figcaption>
        )}
      </div>
    </motion.figure>
  )
}

/** Old-album photo corners holding the picture onto the page. */
function PhotoCorners() {
  const corner = 'absolute h-5 w-5 bg-blush-400/90 shadow-sm sm:h-7 sm:w-7'
  return (
    <span aria-hidden="true">
      <span className={`${corner} top-1 left-1 [clip-path:polygon(0_0,100%_0,0_100%)]`} />
      <span className={`${corner} top-1 right-1 [clip-path:polygon(0_0,100%_0,100%_100%)]`} />
      <span className={`${corner} bottom-1 left-1 [clip-path:polygon(0_0,100%_100%,0_100%)]`} />
      <span className={`${corner} right-1 bottom-1 [clip-path:polygon(100%_0,100%_100%,0_100%)]`} />
    </span>
  )
}

function Lightbox({ photos, index, setIndex }) {
  const open = index !== null
  useScrollLock(open)

  const go = useCallback((dir) => setIndex((i) => (i + dir + photos.length) % photos.length), [photos.length, setIndex])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, setIndex])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-blush-200/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              className="relative m-0 max-w-[min(92vw,900px)] bg-white p-2 pb-14 shadow-2xl sm:p-3 sm:pb-16"
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.45, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(1)
                else if (info.offset.x > 70) go(-1)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage src={photos[index].src} alt={photos[index].caption ?? ''} className="h-[min(70svh,640px)] w-[min(86vw,860px)]" imgClassName="object-contain! bg-blush-50" eager />
              <figcaption className="absolute inset-x-0 bottom-3 text-center font-script text-2xl text-rose-ink sm:bottom-4 sm:text-3xl">
                {photos[index].caption ?? '♡'}
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <LightboxButton className="top-4 right-4" label="Close" onClick={() => setIndex(null)}>
            <X className="h-5 w-5" />
          </LightboxButton>
          <LightboxButton className="top-1/2 left-2 -translate-y-1/2 sm:left-6" label="Previous photo" onClick={() => go(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </LightboxButton>
          <LightboxButton className="top-1/2 right-2 -translate-y-1/2 sm:right-6" label="Next photo" onClick={() => go(1)}>
            <ChevronRight className="h-5 w-5" />
          </LightboxButton>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function LightboxButton({ className, label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`absolute grid h-11 w-11 place-items-center rounded-full bg-white/85 text-rose-ink shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white ${className}`}
    >
      {children}
    </button>
  )
}
