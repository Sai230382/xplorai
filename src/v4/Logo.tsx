import type { CSSProperties } from "react"
import { Mark } from "../components/Mark"

const CHARS = ["p", "l", "o", "r", "A", "I"] as const

/** The site's signature mark: the butterfly is the "X", followed by "plorAI". Wings and letters flutter on hover/focus. */
export function Logo({ tone = "ink" }: { tone?: "ink" | "light" }) {
  return (
    <span className={`v4-logo v4-logo-${tone}`}>
      <span className="v4-logo-x" aria-hidden="true">
        <Mark className="v4-logo-svg" />
      </span>
      <span className="v4-logo-word" aria-hidden="true">
        {CHARS.map((ch, i) => (
          <span key={i} className={`v4-logo-ch${i >= 4 ? " is-ai" : ""}`} style={{ "--char-i": i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
      <span className="sr-only">XplorAI</span>
    </span>
  )
}
