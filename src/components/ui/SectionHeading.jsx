import { Reveal } from './RevealText'
import { HeartShape } from './Icons'

export default function SectionHeading({ eyebrow, title, subtitle, light = false, className = '' }) {
  return (
    <div className={`mx-auto max-w-3xl px-4 text-center ${className}`}>
      {eyebrow && (
        <Reveal className={`mb-4 text-[11px] font-normal tracking-[0.35em] uppercase ${light ? 'text-blush-200' : 'text-gold'}`}>
          {eyebrow}
        </Reveal>
      )}
      <Reveal
        as="h2"
        delay={0.1}
        className={`font-display text-[2.6rem] leading-[1.05] font-medium sm:text-5xl md:text-6xl ${
          light ? 'text-white' : 'text-rose-deep'
        }`}
      >
        {title}
      </Reveal>
      <Reveal delay={0.25} className={`ornament mx-auto mt-6 w-fit ${light ? 'text-blush-200!' : ''}`}>
        <HeartShape className="h-3.5 w-3.5" />
      </Reveal>
      {subtitle && (
        <Reveal
          as="p"
          delay={0.35}
          className={`mx-auto mt-5 max-w-xl font-display text-lg italic sm:text-xl ${light ? 'text-white/85' : 'text-rose-ink/75'}`}
        >
          {subtitle}
        </Reveal>
      )}
    </div>
  )
}
