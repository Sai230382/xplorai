import { useEffect, useState } from "react"
import { Logo } from "./Logo"

const LINKS = [
  { href: "#brief", label: "The Brief" },
  { href: "#on-x", label: "On X" },
  { href: "#tools", label: "Tools" },
  { href: "#shipped", label: "Shipped" },
] as const

export function SiteNav() {
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
        <a className="v4-brand" href="#top" aria-label="XplorAI, back to top">
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
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
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
