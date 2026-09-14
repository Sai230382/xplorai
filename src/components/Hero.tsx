import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { coverForDesk, mosaicCovers, signalCovers } from "../data/covers"
import { heroFragments } from "../data/hero"
import { featuredLaunch } from "../data/launches"
import { ctas, site } from "../data/site"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const AUTOPLAY_DELAY = 1.1
const AUTOPLAY_DURATION = 6
const UNPACK_AT = 0.28
const UNPACK_DURATION = 0.9
const MOSAIC_AT = 0.42
const COLS = 3
const BAND = 6
const TILE = 78

function navHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--nav-h")
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 74
}

const COMPACT_QUERY = "(max-width: 900px)"

function useCompactViewport() {
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(COMPACT_QUERY).matches : false,
  )
  useEffect(() => {
    const media = window.matchMedia(COMPACT_QUERY)
    const onChange = () => setCompact(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])
  return compact
}

function fragmentCover(index: number) {
  return mosaicCovers[index % mosaicCovers.length]
}

export function Hero() {
  const prefersReduced = usePrefersReducedMotion()
  const compact = useCompactViewport()
  const reduced = prefersReduced || compact
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    const rail = railRef.current
    if (!rail) return
    const tween = gsap.to(rail, { xPercent: -50, duration: 42, ease: "none", repeat: -1 })
    const band = rail.parentElement
    const pause = () => tween.pause()
    const play = () => tween.play()
    band?.addEventListener("pointerenter", pause)
    band?.addEventListener("pointerleave", play)
    return () => {
      band?.removeEventListener("pointerenter", pause)
      band?.removeEventListener("pointerleave", play)
      tween.kill()
    }
  }, [prefersReduced])

  useLayoutEffect(() => {
    if (reduced) return
    const stage = stageRef.current
    const root = rootRef.current
    const field = fieldRef.current
    const pin = pinRef.current
    if (!stage || !root || !field || !pin) return

    const ctx = gsap.context(() => {
      const fragments = gsap.utils.toArray<HTMLElement>(".hero-fragment", field)
      const slots = gsap.utils.toArray<HTMLElement>(".hero-slot", stage)
      const phases = gsap.utils.toArray<HTMLElement>(".hero-phase span", stage)

      gsap.set(fragments, { xPercent: -50, yPercent: -50, width: TILE, height: TILE, borderRadius: 999 })

      const slotOffset = (index: number) => {
        const slot = slots[index]
        const stageRect = stage.getBoundingClientRect()
        const rect = slot.getBoundingClientRect()
        return {
          x: rect.left + rect.width / 2 - (stageRect.left + stageRect.width / 2),
          y: rect.top + rect.height / 2 - (stageRect.top + stageRect.height / 2),
          w: rect.width,
          h: rect.height,
        }
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: pin,
          start: () => `top ${navHeight()}px`,
          end: "+=160%",
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * timeline.duration()
            stage.classList.toggle("is-mosaic", t >= MOSAIC_AT)
            const phase = t < MOSAIC_AT ? 0 : 1
            phases.forEach((node, index) => node.classList.toggle("is-on", index === phase))
          },
        },
      })

      fragments.forEach((node, index) => {
        const item = heroFragments.find((entry) => entry.id === node.dataset.id)
        if (!item) return

        timeline.fromTo(
          node,
          {
            x: () => ((item.scatter.x - 50) / 100) * stage.clientWidth,
            y: () => ((item.scatter.y - 50) / 100) * stage.clientHeight,
            rotation: item.scatter.rotate,
            width: TILE,
            height: TILE,
            borderRadius: 999,
            "--o": item.priority === "high" ? 0.95 : 0.72,
          },
          {
            x: () => slotOffset(index).x,
            y: () => slotOffset(index).y,
            rotation: 0,
            width: () => slotOffset(index).w,
            height: () => slotOffset(index).h,
            borderRadius: 16,
            "--o": 1,
            duration: UNPACK_DURATION,
            ease: "power3.inOut",
          },
          UNPACK_AT + Math.floor(index / COLS) * 0.04 + (index % COLS) * 0.012,
        )
      })

      timeline.to({}, { duration: 0.45 })

      const trigger = timeline.scrollTrigger
      const freshLoad = window.scrollY < 8 && !window.location.hash
      if (trigger && freshLoad) {
        const html = document.documentElement
        const restoreScrollBehavior = () => {
          html.style.scrollBehavior = ""
        }
        gsap.delayedCall(AUTOPLAY_DELAY, () => {
          if (window.scrollY > 8 || document.hidden) return
          html.style.scrollBehavior = "auto"
          gsap.to(window, {
            scrollTo: { y: trigger.end - 2, autoKill: true },
            duration: AUTOPLAY_DURATION,
            ease: "power1.inOut",
            onComplete: restoreScrollBehavior,
            onInterrupt: restoreScrollBehavior,
          })
        })
      }
    }, root)

    return () => ctx.revert()
  }, [reduced])

  const heroClass = ["hero", reduced ? "is-static" : "", entered ? "is-in" : ""].filter(Boolean).join(" ")
  const railItems = [...featuredLaunch.signals, ...featuredLaunch.signals]

  return (
    <section id="top" className={heroClass} ref={rootRef} aria-label={site.tagline}>
      <div className="film" aria-hidden="true" />

      <div className="hero-inner" ref={pinRef}>
        <div className="hero-text">
          <span className="starburst">{site.edition} · this week</span>
          <h1 className="stack" aria-label={site.tagline}>
            {site.taglineLines.map((line) => (
              <span key={line} className="ln">
                {line}
                <span aria-hidden="true" className="gc">
                  {line}
                </span>
                <span aria-hidden="true" className="gv">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-lede">{site.lede}</p>
          <div className="hero-ctas">
            <a className="btn peri" href={ctas.briefing.href}>
              {ctas.briefing.label}
            </a>
            <a className="btn" href={ctas.how.href}>
              {ctas.how.label}
            </a>
          </div>
          <span className="read-dir" aria-hidden="true">
            Scroll to read the week <i>→</i>
          </span>
        </div>

        <div className="hero-stage" ref={stageRef} aria-hidden="true">
          <div className="hero-mosaic">
            {heroFragments.map((fragment) => (
              <span key={fragment.id} className="hero-slot" />
            ))}
          </div>

          <div className="hero-field" ref={fieldRef}>
            {heroFragments.map((fragment, index) => (
              <span
                key={fragment.id}
                className="hero-fragment"
                data-id={fragment.id}
                data-kind={fragment.kind}
                data-priority={fragment.priority}
                data-row={Math.floor(index / BAND)}
                style={{ backgroundImage: `url(${fragmentCover(index)})` }}
              >
                <span className="hero-fragment-label">{fragment.text}</span>
              </span>
            ))}
          </div>

          <div className="hero-static-grid">
            {heroFragments.map((fragment, index) => (
              <span
                key={fragment.id}
                className="hero-fragment"
                data-kind={fragment.kind}
                data-row={Math.floor(index / BAND)}
                style={{ backgroundImage: `url(${fragmentCover(index)})` }}
              >
                <span className="hero-fragment-label">{fragment.text}</span>
              </span>
            ))}
          </div>

          <div className="hero-phase">
            <span className="is-on">Signals</span>
            <span>Stories</span>
          </div>
        </div>
      </div>

      <div className="rail-band" aria-label="This week’s signals">
        <div className="rail" ref={railRef}>
          {railItems.map((signal, index) => (
            <article key={`${signal.id}-${index}`} className="vcard" aria-hidden={index >= featuredLaunch.signals.length}>
              <div className="cov">
                <img src={signalCovers[signal.id] ?? coverForDesk(signal.topic)} alt="" />
              </div>
              <div className="cap">
                <div className="t">{signal.raw}</div>
                <div className="a">{signal.topic} desk</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
