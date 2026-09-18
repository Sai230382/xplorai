import { Fragment, useEffect, useState } from "react"
import { weekCover } from "../data/covers"
import { cover, type CoverWireItem } from "../data/hero"
import { ctas } from "../data/site"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function CoverWire({ items }: { items: CoverWireItem[] }) {
  const reduced = usePrefersReducedMotion()
  const first = items[0]
  const [typed, setTyped] = useState({ desk: first?.desk ?? "", text: "" })

  useEffect(() => {
    if (reduced) return

    let cancelled = false

    async function run() {
      let index = 0
      while (!cancelled) {
        const item = items[index]
        if (!item) return
        setTyped({ desk: item.desk, text: "" })
        for (let cursor = 1; cursor <= item.line.length; cursor += 1) {
          if (cancelled) return
          setTyped({ desk: item.desk, text: item.line.slice(0, cursor) })
          await wait(28)
        }
        await wait(2200)
        for (let cursor = item.line.length - 1; cursor >= 0; cursor -= 1) {
          if (cancelled) return
          setTyped({ desk: item.desk, text: item.line.slice(0, cursor) })
          await wait(12)
        }
        index = (index + 1) % items.length
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [items, reduced])

  const desk = reduced ? (first?.desk ?? "") : typed.desk
  const text = reduced ? (first?.line ?? "") : typed.text

  return (
    <div className="hero-wire" aria-live="polite">
      <span className="hero-wire-desk">{desk}</span>
      <p className="hero-wire-line">
        <span>{text}</span>
        {reduced ? null : <span className="caret" aria-hidden="true" />}
      </p>
    </div>
  )
}

function TickerSet({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <div className="hero-ticker-set" aria-hidden={hidden ? true : undefined}>
      {items.map((bit, index) => (
        <Fragment key={`${bit}-${index}`}>
          {index > 0 ? <span className="dot" aria-hidden="true" /> : null}
          <span>{bit}</span>
        </Fragment>
      ))}
      <span className="dot" aria-hidden="true" />
    </div>
  )
}

function Ticker({ items }: { items: string[] }) {
  return (
    <div className="hero-ticker" aria-label="This week’s desks">
      <div className="hero-ticker-track">
        <TickerSet items={items} />
        <TickerSet items={items} hidden />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="hero" aria-label={cover.tagline}>
      <div className="film" aria-hidden="true" />

      <div className="hero-frame">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="starburst">{cover.kicker}</span>
            <h1 className="stack" aria-label={cover.tagline}>
              {cover.taglineLines.map((line) => (
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
            <p className="hero-lede">{cover.lede}</p>
            <CoverWire items={cover.wire} />
            <div className="hero-ctas">
              <a className="btn peri" href={ctas.briefing.href}>
                {ctas.briefing.label}
              </a>
            </div>
            <span className="read-dir">
              Scroll to read the week <i>→</i>
            </span>
          </div>

          <figure className="hero-plate">
            <img src={weekCover} alt={cover.plateAlt} />
            <figcaption>
              <span>{cover.plateCaption}</span>
              <span>{cover.plateDate}</span>
            </figcaption>
          </figure>
        </div>

        <Ticker items={cover.ticker} />
      </div>
    </section>
  )
}
