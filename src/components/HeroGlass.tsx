import { type CSSProperties, type Ref, useEffect, useState } from "react"
import { site } from "../data/site"

const LETTERS = ["P", "L", "O", "R", "A", "I"] as const

/** Chosen line. Alternates live in the PR description. */
export const HERO_LINE = "AI moves fast. We help you keep pace."

const TYPE_START_MS = 1600
const TYPE_STEP_MS = 52

function Plaque({
  plaqueRef,
  reduced,
}: {
  plaqueRef?: Ref<HTMLDivElement>
  reduced: boolean
}) {
  return (
    <div className={`hero-plaque${reduced ? " is-still" : ""}`} ref={plaqueRef}>
      <svg className="paint-defs" width="0" height="0" aria-hidden="true">
        <filter id="plaque-brush" x="-8%" y="-20%" width="116%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <p className="hero-plaque-logo">
        <svg className="hero-butterfly" viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="plaque-wing-up" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#24265e" />
              <stop offset="58%" stopColor="#5c6de0" />
              <stop offset="100%" stopColor="#c4b4ff" />
            </linearGradient>
            <linearGradient id="plaque-wing-low" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1b1c48" />
              <stop offset="65%" stopColor="#5c6de0" />
              <stop offset="100%" stopColor="#f4f1ea" />
            </linearGradient>
          </defs>
          <g className="plaque-wing plaque-wing-l">
            <path d="M 31 31 C 24 17 14 7 5 9 C 2 10 3 19 10 26 C 16 31 24 32 31 32 Z" fill="url(#plaque-wing-up)" />
            <path d="M 31 33 C 23 34 14 38 8 46 C 4 52 7 57 13 55 C 21 52 27 42 31 34 Z" fill="url(#plaque-wing-low)" />
            <path d="M 30 31 C 21 23 13 16 6 13 M 30 34 C 22 40 15 47 10 53" stroke="#f4f1ea" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
          </g>
          <g className="plaque-wing plaque-wing-r">
            <path d="M 33 31 C 40 17 50 7 59 9 C 62 10 61 19 54 26 C 48 31 40 32 33 32 Z" fill="url(#plaque-wing-up)" />
            <path d="M 33 33 C 41 34 50 38 56 46 C 60 52 57 57 51 55 C 43 52 37 42 33 34 Z" fill="url(#plaque-wing-low)" />
            <path d="M 34 31 C 43 23 51 16 58 13 M 34 34 C 42 40 49 47 54 53" stroke="#f4f1ea" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
          </g>
          <path d="M 31.3 22 C 29 15 24 10 19 9 M 32.7 22 C 35 15 40 10 45 9" stroke="#14121c" strokeWidth="1.25" strokeLinecap="round" />
          <circle cx="18.8" cy="9" r="1.4" fill="#24265e" />
          <circle cx="45.2" cy="9" r="1.4" fill="#24265e" />
          <rect x="30.4" y="20" width="3.2" height="24" rx="1.6" fill="#14121c" />
        </svg>
        <span className="hero-plaque-letters" aria-hidden="true">
          {LETTERS.map((letter, index) => (
            <span key={letter} className="hero-plaque-letter" style={{ "--i": index } as CSSProperties}>
              {letter}
            </span>
          ))}
        </span>
        <span className="sr-only">XPLORAI</span>
      </p>
      <p className="hero-plaque-edition">
        {site.edition} · {site.date}
      </p>
    </div>
  )
}

export function HeroGlass({
  glassRef,
  reduced = false,
  line = false,
}: {
  glassRef?: Ref<HTMLDivElement>
  reduced?: boolean
  line?: boolean
}) {
  const [count, setCount] = useState(line && !reduced ? 0 : HERO_LINE.length)

  useEffect(() => {
    if (!line || reduced) {
      setCount(HERO_LINE.length)
      return
    }
    setCount(0)
    let ticks = 0
    let interval = 0
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        ticks += 1
        setCount(Math.min(ticks, HERO_LINE.length))
        if (ticks >= HERO_LINE.length) window.clearInterval(interval)
      }, TYPE_STEP_MS)
    }, TYPE_START_MS)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [line, reduced])

  if (!line) return <Plaque plaqueRef={glassRef} reduced={reduced} />

  return (
    <div className="hero-plaque-wrap" ref={glassRef}>
      <Plaque reduced={reduced} />
      <p className="hero-plaque-line" aria-label={HERO_LINE}>
        <span className="hero-plaque-line-sizer" aria-hidden="true">
          {HERO_LINE}
        </span>
        <span className="hero-plaque-line-live" aria-hidden="true">
          {HERO_LINE.slice(0, count)}
          {reduced ? null : <span className="hero-plaque-caret" />}
        </span>
      </p>
    </div>
  )
}
