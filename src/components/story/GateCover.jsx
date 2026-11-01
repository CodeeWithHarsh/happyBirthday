import { useEffect } from 'react'
import { animate, motion, useMotionValue, usePresence, useTransform } from 'framer-motion'
import { HeartShape, Sparkle } from '../ui/Icons'

const SWING = 105 // degrees each door turns when fully open

/**
 * A full-screen pair of 3D gate doors with the cover content floating in front.
 *
 * Everything is driven by one motion value, `open` (0 = shut, 1 = wide open),
 * so the doors, the light and the content always move together:
 *  - arriving: the doors swing shut over the page she just finished
 *  - leaving:  the content fades forward, the doors swing inward and light
 *              pours through the gap while the next page rises behind
 *
 * Each layer gets its own transform/opacity from `open` (rather than sharing an
 * inherited CSS variable), so a frame only restyles those few layers instead of
 * every element on the cover — much smoother on phones.
 */
export default function GateCover({ background, dark = false, children, zIndex = 30 }) {
  const open = useMotionValue(1)
  const [isPresent, safeToRemove] = usePresence()

  useEffect(() => {
    const controls = isPresent
      ? animate(open, 0, { duration: 1.3, ease: [0.22, 1, 0.36, 1] })
      : animate(open, 1, { duration: 1.7, ease: [0.6, 0, 0.25, 1], onComplete: safeToRemove })
    return () => controls.stop()
  }, [isPresent, open, safeToRemove])

  const lightOpacity = useTransform(open, (v) => Math.min(v * 3.5, (1 - v) * 2.2))
  const gateTransform = useTransform(open, (v) => `scale(${1 + v * 0.12})`)
  const contentOpacity = useTransform(open, (v) => 1 - v * 3.5)
  const contentTransform = useTransform(open, (v) => `scale(${1 + v * 0.35})`)
  const contentFilter = useTransform(open, (v) => `blur(${v * 18}px)`)

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex, perspective: 1400 }}>
      {/* light pouring through the gate as it opens */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,rgba(255,236,242,0.95)_30%,rgba(255,209,220,0.6)_60%,transparent_85%)]"
        style={{ opacity: lightOpacity }}
      />

      {/* the doors — the whole gate pushes towards her as it opens */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: gateTransform }}>
        <Door left open={open} background={background} dark={dark} />
        <Door open={open} background={background} dark={dark} />
      </motion.div>

      {/* the cover content floats in front and drifts forward as the doors open */}
      <motion.div className="absolute inset-0" style={{ opacity: contentOpacity, transform: contentTransform, filter: contentFilter }}>
        {children}
      </motion.div>
    </div>
  )
}

function Door({ left = false, open, background, dark }) {
  const line = dark ? 'border-white/30' : 'border-gold/45'
  const lineSoft = dark ? 'border-white/15' : 'border-gold/25'
  const ornament = dark ? 'text-white/35' : 'text-gold/70'

  const transform = useTransform(open, (v) => `rotateY(${v * (left ? SWING : -SWING)}deg)`)
  const opacity = useTransform(open, (v) => (1 - v) * 4)
  const shade = useTransform(open, (v) => v * 0.45)

  return (
    <motion.div
      className="absolute inset-y-0 w-1/2"
      style={{
        [left ? 'left' : 'right']: 0,
        transformStyle: 'preserve-3d',
        transformOrigin: left ? 'left center' : 'right center',
        transform,
        opacity,
      }}
    >
      {/* face */}
      <div className="absolute inset-0 overflow-hidden" style={{ background, backgroundSize: '200% 100%', backgroundPosition: left ? 'left center' : 'right center' }}>
        {/* depth: darker near the hinge, catching light near the seam */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${left ? 90 : 270}deg, rgba(107,42,66,${dark ? 0.35 : 0.12}) 0%, transparent 35%, rgba(255,255,255,${dark ? 0.08 : 0.3}) 100%)`,
          }}
        />

        {/* a slow light sheen gliding across the doors */}
        <div className="gate-sheen absolute inset-y-0 w-1/3" style={{ animationDelay: left ? '0s' : '0.9s' }} />

        {/* carved frame */}
        <div className={`absolute inset-y-4 rounded-[1.75rem] border sm:inset-y-8 ${line} ${left ? 'right-2 left-4 sm:right-4 sm:left-8' : 'right-4 left-2 sm:right-8 sm:left-4'}`} />
        <div className={`absolute inset-y-6 rounded-3xl border border-dashed sm:inset-y-11 ${lineSoft} ${left ? 'right-4 left-6 sm:right-7 sm:left-11' : 'right-6 left-4 sm:right-11 sm:left-7'}`} />

        {/* arched upper panel + lower panel */}
        <div className={`absolute top-[12%] left-1/2 h-[40%] w-[62%] -translate-x-1/2 rounded-t-full border shadow-[inset_0_2px_18px_rgba(140,59,87,0.08)] ${line} ${dark ? 'bg-white/5' : 'bg-white/20'}`} />
        <div className={`absolute top-[15%] left-1/2 h-[36%] w-[52%] -translate-x-1/2 rounded-t-full border ${lineSoft}`} />
        <div className={`absolute bottom-[10%] left-1/2 h-[22%] w-[62%] -translate-x-1/2 rounded-2xl border shadow-[inset_0_2px_18px_rgba(140,59,87,0.08)] ${line} ${dark ? 'bg-white/5' : 'bg-white/20'}`} />
        <HeartShape className={`absolute bottom-[19%] left-1/2 h-5 w-5 -translate-x-1/2 ${ornament}`} />
        <Sparkle className={`absolute top-[30%] left-1/2 h-4 w-4 -translate-x-1/2 ${ornament}`} />

        {/* the meeting edge, trimmed in gold */}
        <div className={`absolute inset-y-0 w-0.75 bg-linear-to-b from-champagne via-gold to-champagne ${left ? 'right-0' : 'left-0'}`} />

        {/* shadow deepening as the door swings away */}
        <motion.div className="absolute inset-0 bg-rose-deep" style={{ opacity: shade }} />
      </div>

      {/* door thickness, seen as it swings */}
      <div
        className={`absolute inset-y-0 w-4 ${left ? 'right-0 origin-right' : 'left-0 origin-left'}`}
        style={{
          transform: `rotateY(${left ? -90 : 90}deg)`,
          background: 'linear-gradient(180deg,#f3dcb6,#c9a26b 50%,#f3dcb6)',
        }}
      />
    </motion.div>
  )
}
