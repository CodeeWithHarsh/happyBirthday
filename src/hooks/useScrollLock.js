import { useEffect } from 'react'

/** Prevents the page behind an overlay from scrolling while `locked` is true. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    document.body.classList.add('scroll-locked')
    return () => document.body.classList.remove('scroll-locked')
  }, [locked])
}
