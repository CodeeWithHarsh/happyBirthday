import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import IntroScreen from './components/IntroScreen'
import FloatingParticles from './components/FloatingParticles'
import ScrollProgress from './components/ScrollProgress'
import CursorTrail from './components/CursorTrail'
import MusicPlayer from './components/MusicPlayer'
import Hero from './components/Hero'
import HerPortrait from './components/HerPortrait'
import AboutYou from './components/AboutYou'
import PhotoGallery from './components/PhotoGallery'
import RevealPhoto from './components/RevealPhoto'
import ShayariSection from './components/ShayariSection'
import LoveLetter from './components/LoveLetter'
import QuestionSection from './components/QuestionSection'
import Celebration from './components/Celebration'
import FinalSurprise from './components/FinalSurprise'
import GateCover from './components/story/GateCover'
import ContentPage from './components/story/ContentPage'
import ChapterCover from './components/story/ChapterCover'
import ChapterEnd from './components/story/ChapterEnd'
import StoryNav from './components/story/StoryNav'
import ChapterProgress from './components/story/ChapterProgress'
import { HeartShape } from './components/ui/Icons'
import { MusicProvider, useMusic } from './context/MusicContext'
import { StoryContext } from './context/StoryContext'
import { birthdayData, fill } from './data/birthdayData'
import { pinkBurst } from './utils/effects'

/* The story, chapter by chapter. Each chapter = a cover page + its own page.
   Every chapter shares Chapter 1's colours: `cover` is the cover's background,
   `page` fills any space below the section. */
const THEME = {
  page: '#fff8fa',
  cover: 'radial-gradient(ellipse at 50% 35%, #fff8fa 0%, #ffe4ec 55%, #ffd1dc 100%)',
}
const CHAPTERS = [
  { id: 'portrait', Section: HerPortrait, ...THEME },
  { id: 'about', Section: AboutYou, ...THEME },
  { id: 'gallery', Section: PhotoGallery, ...THEME },
  { id: 'reveal', Section: RevealPhoto, ...THEME },
  { id: 'shayari', Section: ShayariSection, ...THEME },
  { id: 'letter', Section: LoveLetter, ...THEME },
  { id: 'question', Section: QuestionSection, ...THEME },
]

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const INTRO_BG = 'radial-gradient(ellipse at 50% 40%, #fff8fa 0%, #ffe4ec 45%, #ffd1dc 100%)'
const TRANSITION_LOCK = 1700 // ms — ignore extra clicks while a page is turning

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <Story />
      </MusicProvider>
    </MotionConfig>
  )
}

function Story() {
  const { chapters, navigation } = birthdayData
  const [loading, setLoading] = useState(true)
  const [nav, setNav] = useState({ index: 0, direction: 1 })
  const [furthest, setFurthest] = useState(0) // the furthest page she has reached
  const [completed, setCompleted] = useState(() => new Set()) // chapters read to the end — unlocks the next one
  const [celebrating, setCelebrating] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const lockedUntil = useRef(0)
  const music = useMusic()

  const pages = useMemo(
    () => [
      { key: 'intro', type: 'intro' },
      { key: 'hero', type: 'hero', title: birthdayData.hero.title },
      ...CHAPTERS.flatMap((c) => [
        { key: `cover-${c.id}`, type: 'cover', id: c.id, chapter: c, title: chapters[c.id].title },
        { key: `page-${c.id}`, type: 'content', id: c.id, chapter: c, title: chapters[c.id].title },
      ]),
      { key: 'final', type: 'final', title: birthdayData.final.intro },
    ],
    [chapters],
  )

  useEffect(() => {
    document.title = fill(birthdayData.pageTitle)
  }, [])

  const finishLoading = useCallback(() => setLoading(false), [])

  useEffect(() => {
    setFurthest((f) => Math.max(f, nav.index))
  }, [nav.index])

  const markComplete = useCallback((id) => setCompleted((s) => (s.has(id) ? s : new Set(s).add(id))), [])

  const go = useCallback(
    (toIndex) => {
      const now = performance.now()
      if (now < lockedUntil.current) return
      lockedUntil.current = now + TRANSITION_LOCK
      setNav((n) => {
        const target = toIndex(n.index)
        if (target === n.index || target < 0 || target >= pages.length) return n
        return { index: target, direction: target > n.index ? 1 : -1 }
      })
    },
    [pages.length],
  )

  const story = useMemo(
    () => ({
      pages,
      index: nav.index,
      furthest,
      completed,
      markComplete,
      direction: nav.direction,
      accepted,
      next: () => go((i) => i + 1),
      back: () => go((i) => i - 1),
      goTo: (target) => go(() => target),
    }),
    [pages, nav, furthest, completed, markComplete, accepted, go],
  )

  const openCover = () => {
    pinkBurst({ x: 0.5, y: 0.55, count: 80, spread: 120 })
    story.next()
  }

  const openSurprise = () => {
    if (birthdayData.startMusicOnOpen) music.play()
    openCover()
  }

  const continueToFinal = () => {
    setCelebrating(false)
    setAccepted(true)
    markComplete('question')
    story.goTo(pages.length - 1)
  }

  const renderPage = (page) => {
    switch (page.type) {
      case 'intro':
        return (
          <GateCover key={page.key} background={INTRO_BG}>
            <IntroScreen onOpen={openSurprise} />
          </GateCover>
        )
      case 'hero':
        return (
          <ContentPage key={page.key} background={THEME.page}>
            <Hero />
          </ContentPage>
        )
      case 'cover':
        return (
          <GateCover key={page.key} background={page.chapter.cover} dark={page.chapter.dark}>
            <ChapterCover
              chapter={chapters[page.id]}
              numeral={NUMERALS[CHAPTERS.indexOf(page.chapter)]}
              buttonText={navigation.open}
              onOpen={openCover}
              dark={page.chapter.dark}
            />
          </GateCover>
        )
      case 'content': {
        const { Section, dark } = page.chapter
        const isQuestion = page.id === 'question'
        return (
          <ContentPage key={page.key} background={page.chapter.page} light={dark}>
            <Section {...(isQuestion ? { accepted, onYes: () => setCelebrating(true) } : {})}>
              {!isQuestion ? (
                <ChapterEnd light={dark} />
              ) : accepted ? (
                <ChapterEnd buttonText={navigation.toFinal} />
              ) : (
                <p className="relative z-10 mt-16 flex items-center justify-center gap-2 text-center font-display text-lg text-rose-ink/60 italic">
                  <HeartShape className="animate-heartbeat h-4 w-4 text-blush-400" />
                  {birthdayData.question.lockedHint}
                </p>
              )}
            </Section>
          </ContentPage>
        )
      }
      case 'final':
        return (
          <ContentPage key={page.key} background={THEME.page} zIndex={25}>
            <FinalSurprise>
              <ChapterEnd buttonText={navigation.again} onClick={() => story.goTo(1)} />
            </FinalSurprise>
          </ContentPage>
        )
      default:
        return null
    }
  }

  return (
    <StoryContext.Provider value={story}>
      <AnimatePresence>{loading && <LoadingScreen key="loading" onDone={finishLoading} />}</AnimatePresence>

      {!loading && (
        <>
          <AnimatePresence>{renderPage(pages[nav.index])}</AnimatePresence>

          <FloatingParticles fixed zIndex={35} density={0.8} />
          <ScrollProgress value={nav.index / (pages.length - 1)} />
          <ChapterProgress />
          <StoryNav />
          <MusicPlayer />
          <CursorTrail />
          <Celebration open={celebrating} onContinue={continueToFinal} />
        </>
      )}
    </StoryContext.Provider>
  )
}
