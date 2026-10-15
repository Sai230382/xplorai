import type { Ref } from "react"
import { site } from "../data/site"

type GlassLink = { id: string; label: string }

export function HeroGlass({
  links,
  glassRef,
  onNavigate,
}: {
  links: readonly GlassLink[]
  glassRef: Ref<HTMLDivElement>
  onNavigate: (id: string) => void
}) {
  return (
    <div className="hero-glass" ref={glassRef}>
      <div className="hero-glass-frost" aria-hidden="true" />
      <div className="hero-glass-copy">
        <p className="hero-glass-kicker">
          {site.edition} · {site.date}
        </p>
        <nav className="hero-glass-nav" aria-label="Sections">
          {links.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(item.id)
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <p className="hero-glass-intro">{site.lede}</p>
      </div>
    </div>
  )
}

export function HeroWordmark({ wordRef }: { wordRef: Ref<HTMLParagraphElement> }) {
  return (
    <p className="hero-word" ref={wordRef} aria-hidden="true">
      <span className="hero-word-knock">
        <span className="hero-word-text">XPLORAI</span>
      </span>
      <span className="hero-word-solid">
        <span className="hero-word-text">XPLORAI</span>
      </span>
    </p>
  )
}
