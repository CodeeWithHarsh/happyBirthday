import { motion } from 'framer-motion'
import { Feather, Heart, Laugh, Moon, Smile, Sparkles, Star, Sun, Flower2 } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import SmartImage from './ui/SmartImage'
import { HeartShape } from './ui/Icons'
import { EASE } from './ui/RevealText'
import { birthdayData } from '../data/birthdayData'

const ICONS = { smile: Smile, heart: Heart, sparkles: Sparkles, laugh: Laugh, sun: Sun, star: Star, flower: Flower2, moon: Moon, feather: Feather }

/** "Do you know what makes you special?" — floating glass cards, each with a portrait photo. */
export default function AboutYou({ children }) {
  const { qualities } = birthdayData

  return (
    <section className="relative overflow-hidden theme-bg px-5 py-24 sm:py-32">
      <div className="ambient" aria-hidden="true">
        <div className="blob top-[20%] right-[-10%] h-[40vmax] w-[40vmax] bg-blush-300/60" />
        <div className="blob bottom-[0%] left-[-15%] h-[35vmax] w-[35vmax] bg-blush-200/70" />
      </div>

      <div className="relative z-10">
        <SectionHeading eyebrow="A little about you" title={qualities.title} subtitle={qualities.subtitle} />

        <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-6 sm:mt-20 md:flex-row md:flex-wrap md:justify-center md:gap-8">
          {qualities.items.map((item, i) => (
            <QualityCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* chapter ending: "Up next" + turn the page */}
      {children}
    </section>
  )
}

function QualityCard({ item, index }) {
  const Icon = ICONS[item.icon] ?? Heart
  const tilt = index % 2 ? 1.5 : -1.5
  // Staggered heights on desktop, gentle left/right offsets on mobile
  const offset = index % 2 ? 'self-end md:self-auto md:mt-20' : 'self-start md:self-auto'

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.1, delay: (index % 3) * 0.15, ease: EASE }}
      className={`w-[88%] max-w-sm md:w-75 ${offset}`}
    >
      {/* idle float lives on its own layer so it never fights the hover transform */}
      <div className="animate-float-slow" style={{ animationDelay: `${-index * 1.3}s` }}>
        <motion.article
          whileHover={{ y: -12, rotate: tilt, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="group glass relative overflow-hidden rounded-4xl p-3 transition-shadow duration-500 hover:shadow-[0_25px_60px_-15px_rgba(239,143,171,0.65)]"
        >
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blush-300/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-60" />

          {/* portrait photo */}
          <div className="relative">
            <SmartImage
              src={item.image}
              alt={item.title}
              position={item.position}
              className="aspect-4/5 w-full rounded-3xl shadow-[0_14px_30px_-14px_rgba(140,59,87,0.45)]"
              imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-t from-rose-deep/30 via-transparent to-transparent" />

            <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 font-display text-sm tracking-[0.25em] text-rose-ink">
              {String(index + 1).padStart(2, '0')}
            </span>
            <HeartShape className="absolute top-3.5 right-3.5 h-7 w-7 scale-50 text-white opacity-0 drop-shadow-[0_4px_10px_rgba(194,79,120,0.7)] transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />

            <div className="absolute -bottom-6 left-5 grid h-12 w-12 place-items-center rounded-2xl border-2 border-white bg-linear-to-br from-blush-300 to-blush-500 text-white shadow-[0_8px_20px_-6px_rgba(239,143,171,0.9)]">
              <Icon className="h-5 w-5" strokeWidth={1.7} />
            </div>
          </div>

          <div className="relative px-4 pt-9 pb-4 sm:px-5">
            <h3 className="font-display text-[1.65rem] leading-tight font-medium text-rose-deep">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-rose-ink/75">{item.text}</p>
          </div>
        </motion.article>
      </div>
    </motion.div>
  )
}
