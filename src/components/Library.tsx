import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { libraryVolumes } from "../data/library"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { Misprint } from "./Misprint"

gsap.registerPlugin(ScrollTrigger)

export function Library() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const [selectedId, setSelectedId] = useState(libraryVolumes[0].id)

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#lib-", "")
      if (libraryVolumes.some((volume) => volume.id === id)) setSelectedId(id)
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [])

  useLayoutEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".spine", root).forEach((spine) => {
        const depth = Number(spine.dataset.depth) || -0.1
        gsap.fromTo(
          spine,
          { y: -depth * 160 },
          {
            y: depth * 160,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const selected = libraryVolumes.find((volume) => volume.id === selectedId) ?? libraryVolumes[0]
  const briefRef = useRef<HTMLDivElement>(null)

  function scrollToBrief() {
    briefRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  }

  function openVolume(id: string) {
    if (selectedId === id) {
      scrollToBrief()
      return
    }
    setSelectedId(id)
    const url = new URL(window.location.href)
    url.hash = `lib-${id}`
    history.replaceState(null, "", url)
  }

  return (
    <section id="library" className="shelf" aria-labelledby="library-title" ref={rootRef}>
      <div className="split">
        <div className="left">
          <span className="bubble" style={{ marginBottom: 18 }}>
            Library · {libraryVolumes.length} volumes
          </span>
          <Misprint as="h2" id="library-title" text="The library." className="section-title" />
          <p className="section-body">
            The 14-module Training Academy and the Strategy Playbook from the live site, plus three field notes on
            the market, on tests, and on the setup around a helper. Tap a spine to open the book, then tap again to
            read below.
          </p>
          <div className="acts">
            <a className="btn gold sm" href="/academy/index.html" target="_blank" rel="noreferrer">
              Open the academy
            </a>
            <a className="btn sm" href="/playbook/index.html" target="_blank" rel="noreferrer">
              Open the playbook
            </a>
          </div>
        </div>

        <div className="right">
          <div className="rack-shell">
            <div className="rack" role="list" aria-label="Library volumes">
              {libraryVolumes.map((volume, index) => (
                <a
                  key={volume.id}
                  id={`lib-${volume.id}`}
                  role="listitem"
                  className={["spine", volume.skin, selectedId === volume.id ? "is-on is-open" : ""]
                    .filter(Boolean)
                    .join(" ")}
                  href={`#lib-${volume.id}`}
                  data-depth={index % 2 === 0 ? -0.08 : -0.14}
                  title={volume.title}
                  style={{ height: volume.height, backgroundImage: `url(${volume.cover})` }}
                  aria-current={selectedId === volume.id ? "true" : undefined}
                  aria-label={
                    selectedId === volume.id
                      ? `${volume.title}, open. Tap again to read below.`
                      : `Open ${volume.title}`
                  }
                  onClick={(event) => {
                    event.preventDefault()
                    openVolume(volume.id)
                  }}
                >
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="stitle">{volume.title}</span>
                  <span className="gn">{volume.genre}</span>
                  <span className="tip">{volume.tip}</span>
                  <span className="spine-page" aria-hidden="true" style={{ backgroundImage: `url(${volume.cover})` }}>
                    <span className="page-kicker">{volume.genre}</span>
                    <span className="page-title">{volume.title}</span>
                    <span className="page-cta">Read below</span>
                  </span>
                </a>
              ))}
            </div>
            <div className="board" aria-hidden="true" />
            <div className="board2" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="lib-brief-wrap" id="lib-brief" ref={briefRef}>
        <article className="lib-brief" aria-live="polite">
        <div className="lib-brief-head">
          <span className="bubble gold">{selected.genre}</span>
          <span className="eyebrow" style={{ opacity: 0.7 }}>
            {selected.tip}
          </span>
        </div>
        <Misprint as="h3" text={selected.title} className="lib-brief-title" />
        <p className="lib-dek">{selected.dek}</p>
        <p>{selected.summary}</p>
        <ol className="lib-takes">
          {selected.takeaways.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <a
          className="btn gold sm"
          href={selected.href}
          {...(selected.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {selected.cta}
        </a>
      </article>
      </div>
    </section>
  )
}
