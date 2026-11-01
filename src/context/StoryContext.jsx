import { createContext, useContext } from 'react'
import { useScroll } from 'framer-motion'

/** Page navigation: { pages, index, furthest, completed, markComplete, direction, next, back, goTo, accepted } */
export const StoryContext = createContext(null)
export const useStory = () => useContext(StoryContext)

/** The scroll container of the page a component lives in. */
export const PageScrollContext = createContext(null)

/** `useScroll` that follows the current page's own scroll container. */
export function usePageScroll(target, offset) {
  const container = useContext(PageScrollContext)
  return useScroll({ target, offset, ...(container ? { container } : {}) })
}
