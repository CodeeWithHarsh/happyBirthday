import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { birthdayData } from '../data/birthdayData'

const MusicContext = createContext(null)
const TARGET_VOLUME = 0.6

export function MusicProvider({ children }) {
  const audioRef = useRef(null)
  const fadeRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [missing, setMissing] = useState(false)

  const fadeTo = useCallback((target, done) => {
    const audio = audioRef.current
    if (!audio) return
    cancelAnimationFrame(fadeRef.current)
    const start = audio.volume
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min((now - t0) / 1800, 1)
      audio.volume = start + (target - start) * p
      if (p < 1) fadeRef.current = requestAnimationFrame(step)
      else done?.()
    }
    fadeRef.current = requestAnimationFrame(step)
  }, [])

  /** Resolves to true once the song is playing, false if it couldn't start. */
  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false
    try {
      // Only start from silence if it isn't already playing (or fading out).
      if (audio.paused) audio.volume = 0
      await audio.play()
      setPlaying(true)
      setMissing(false)
      fadeTo(TARGET_VOLUME)
      return true
    } catch (err) {
      setPlaying(false)
      // NotAllowedError just means the browser wants a tap first — the file is fine.
      if (err?.name === 'NotSupportedError') setMissing(true)
      return false
    }
  }, [fadeTo])

  const pause = useCallback(() => {
    setPlaying(false)
    fadeTo(0, () => audioRef.current?.pause())
  }, [fadeTo])

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause])

  useEffect(() => () => cancelAnimationFrame(fadeRef.current), [])

  // Autoplay: try right away; if the browser blocks sound, start on the first
  // tap / click / key press anywhere. Stops listening once the song is playing.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !birthdayData.music || !birthdayData.autoplayMusic) return
    let cancelled = false
    const events = ['pointerdown', 'touchend', 'keydown']
    const unlock = (e) => {
      if (e.target.closest?.('[data-music-toggle]')) return // the music button handles itself
      play()
    }
    const stop = () => {
      events.forEach((ev) => window.removeEventListener(ev, unlock, true))
      audio.removeEventListener('playing', stop)
    }
    play().then((ok) => {
      if (ok || cancelled) return
      events.forEach((ev) => window.addEventListener(ev, unlock, true))
      audio.addEventListener('playing', stop)
    })
    return () => {
      cancelled = true
      stop()
    }
  }, [play])

  return (
    <MusicContext.Provider value={{ playing, missing, play, pause, toggle }}>
      <audio
        ref={audioRef}
        src={birthdayData.music}
        loop
        preload="auto"
        onError={() => {
          setMissing(true)
          setPlaying(false)
        }}
      />
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)
