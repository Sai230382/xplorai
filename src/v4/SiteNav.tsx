import { useEffect, useState } from "react"
import { NEW_TOOLS_PATH } from "../data/newtools"
import { navHref } from "./format"
import { Logo } from "./Logo"

const LINKS = [
  { href: "#brief", label: "The Brief" },
  { href: "#on-x", label: "On X" },
  { href: "#tools", label: "Tools" },
  { href: NEW_TOOLS_PATH, label: "New this week" },
  { href: "#shipped", label: "Shipped" },
] as const

export function SiteNav({ home = true }: { home?: boolean }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`v4-nav${solid ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="v4-brand-lockup">
        <a className="v4-brand" href={home ? "#top" : "/"} aria-label={home ? "XplorAI, back to top" : "XplorAI home"}>
          <Logo />
        </a>
        <span className="v4-byline">by S.AI</span>
      </div>
      <button
        className="v4-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="v4-nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav id="v4-nav-links" className="v4-nav-links" aria-label="Primary">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={navHref(link.href, home)}
            aria-current={!home && link.href === NEW_TOOLS_PATH ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a className="v4-pill v4-pill-ink" href="#subscribe" onClick={() => setOpen(false)}>
          Get the Brief
        </a>
      </nav>
    </header>
  )
}
