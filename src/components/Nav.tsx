import { useEffect, useState } from "react"
import { ctas, nav, site } from "../data/site"
import { Mark } from "./Mark"
import { ScrollProgress } from "./ScrollProgress"

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const onHash = () => setOpen(false)
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Scrollspy: the section whose top has most recently crossed the header line wins.
  useEffect(() => {
    const ids = nav.map((item) => item.href.slice(1))
    const update = () => {
      const line = 120
      let current = ""
      for (const id of ids) {
        const node = document.getElementById(id)
        if (!node) continue
        if (node.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header className="bar">
      <div className="row">
        <a className="brand" href="#top" aria-label={`${site.name} home`}>
          <span className="mark" aria-hidden="true">
            <Mark />
          </span>
          <span>
            <span className="name" style={{ display: "block" }}>
              {site.name}
            </span>
            <span className="sub" style={{ display: "block" }}>
              {site.edition} · {site.date}
            </span>
          </span>
        </a>

        <nav id="site-nav" className={open ? "main is-open" : "main"} aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={active === item.id ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="tools">
          <a className="btn gold sm cta" href={ctas.briefing.href}>
            {ctas.briefing.label}
          </a>
          <button
            type="button"
            className="btn sm nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
