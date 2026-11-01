/**
 * Animations here use full `transform` strings (instead of x / y / scale) so the
 * browser can run them off the main thread. Framer Motion's reduced-motion
 * setting only stills x / y / scale-style values, so for anyone who asked their
 * device to reduce motion, `move()` drops the movement and leaves just the fades.
 */
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const move = (transform) => (reduced ? undefined : transform)
