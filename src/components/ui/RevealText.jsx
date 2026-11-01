import { motion } from 'framer-motion'
import { move } from '../../utils/motion'

export const EASE = [0.22, 1, 0.36, 1]

// Motion values are animated as full `transform` strings (not x / y / scale)
// throughout, so the browser can run them off the main thread — that keeps
// scrolling and page turns smooth on phones.

/** Blur → clear + slide-up reveal for a block of text, triggered on scroll. */
export function Reveal({ as = 'div', children, delay = 0, y = 24, blur = 10, scale = 1, amount = 0.4, className = '', ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      initial={{ opacity: 0, transform: move(`translateY(${y}px) scale(${scale})`), filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, transform: move('translateY(0px) scale(1)'), filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/**
 * Splits text into letters that float in one by one.
 * - default: animates when scrolled into view
 * - pass `show` (boolean) to control it manually
 */
export function LetterReveal({ text, className = '', delay = 0, stagger = 0.045, show }) {
  const target = { opacity: 1, transform: move('translateY(0em)'), filter: 'blur(0px)' }
  const trigger =
    show === undefined ? { whileInView: target, viewport: { once: true } } : { animate: show ? target : undefined }

  // Letters are grouped per word so a line can only ever break between words.
  let i = 0
  return (
    <span className={className} aria-label={text} role="text">
      {text.split(' ').map((word, w, words) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word + (w < words.length - 1 ? ' ' : '')).map((ch) => {
            const n = i++
            return (
              <motion.span
                key={n}
                className="inline-block whitespace-pre"
                initial={{ opacity: 0, transform: move('translateY(0.4em)'), filter: 'blur(8px)' }}
                {...trigger}
                transition={{ duration: 0.9, delay: delay + n * stagger, ease: EASE }}
              >
                {ch}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}
