import { motion } from 'framer-motion'
import { HeartShape, Sparkle } from '../ui/Icons'

const SWING = 105 // degrees each door turns when fully open
const SIDES = ['left', 'right']

/**
 * A full-screen pair of 3D gate doors with the cover content floating in front.
 *
 * Everything is driven by one CSS variable on the outer element, `--open`
 * (0 = shut, 1 = wide open), so the doors, the light and the content always
 * move together:
 *  - arriving: the doors swing shut over the page she just finished
 *  - leaving:  the content fades forward, the doors swing inward and light
 *              pours through the gap while the next page rises behind
 */
export default function GateCover({ background, dark = false, children, zIndex = 30 }) {
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex, perspective: 1400, '--open': 1 }}
      initial={{ '--open': 1 }}
      animate={{ '--open': 0, transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ '--open': 1, transition: { duration: 1.7, ease: [0.6, 0, 0.25, 1] } }}
    >
      {/* light pouring through the gate as it opens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,rgba(255,236,242,0.95)_30%,rgba(255,209,220,0.6)_60%,transparent_85%)]"
        style={{ opacity: 'min(calc(var(--open) * 3.5), calc((1 - var(--open)) * 2.2))' }}
      />

      {/* the doors — the whole gate pushes towards her as it opens */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', transform: 'scale(calc(1 + var(--open) * 0.12))' }}
      >
        {SIDES.map((side) => (
          <Door key={side} side={side} background={background} dark={dark} />
        ))}
      </div>

      {/* the cover content floats in front and drifts forward as the doors open */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 'calc(1 - var(--open) * 3.5)',
          transform: 'scale(calc(1 + var(--open) * 0.35))',
          filter: 'blur(calc(var(--open) * 18px))',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

function Door({ side, background, dark }) {
  const left = side === 'left'
  const line = dark ? 'border-white/30' : 'border-gold/45'
  const lineSoft = dark ? 'border-white/15' : 'border-gold/25'
  const ornament = dark ? 'text-white/35' : 'text-gold/70'

  return (
    <div
      className="absolute inset-y-0 w-1/2"
      style={{
        [left ? 'left' : 'right']: 0,
        transformStyle: 'preserve-3d',
        transformOrigin: left ? 'left center' : 'right center',
        transform: `rotateY(calc(var(--open) * ${left ? SWING : -SWING}deg))`,
        opacity: 'calc((1 - var(--open)) * 4)',
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
        <div className="absolute inset-0 bg-rose-deep" style={{ opacity: 'calc(var(--open) * 0.45)' }} />
      </div>

      {/* door thickness, seen as it swings */}
      <div
        className={`absolute inset-y-0 w-4 ${left ? 'right-0 origin-right' : 'left-0 origin-left'}`}
        style={{
          transform: `rotateY(${left ? -90 : 90}deg)`,
          background: 'linear-gradient(180deg,#f3dcb6,#c9a26b 50%,#f3dcb6)',
        }}
      />
    </div>
  )
}
