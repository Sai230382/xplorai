import { useEffect, useState } from "react"

/** Matches a max-width query. The first read is synchronous so mobile never paints the desktop hero. */
export function useMaxWidth(px: number) {
  const query = `(max-width: ${px}px)`
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [query])

  return matches
}
