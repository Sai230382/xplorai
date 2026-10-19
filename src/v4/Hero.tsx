import { currentEdition } from "../data/edition"
import { site } from "../data/site"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

const POSTER = "/hero/hero3-poster.jpg"

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const glance = currentEdition.columns.changed.slice(0, 3)

  return (
    <section id="top" className="v4-hero" aria-labelledby="v4-hero-title">
      {reduced ? (
        <img className="v4-hero-media" src={POSTER} alt="" />
      ) : (
        <video className="v4-hero-media" poster={POSTER} autoPlay muted loop playsInline aria-hidden="true">
          <source src="/hero/hero3-mobile.mp4" type="video/mp4" media="(max-width: 760px)" />
          <source src="/hero/hero3-loop.webm" type="video/webm" />
          <source src="/hero/hero3-loop.mp4" type="video/mp4" />
        </video>
      )}
      <div className="v4-hero-wash" aria-hidden="true" />
      <div className="v4-hero-fade" aria-hidden="true" />

      <div className="v4-hero-copy">
        <p className="v4-cap">
          {currentEdition.edition} · {currentEdition.date}
        </p>
        <h1 id="v4-hero-title">
          AI moves fast.
          <br />
          We help you keep pace.
        </h1>
        <p className="v4-hero-sub">
          What changed in AI, which new tools are worth a try, and what people are building. In plain words, checked
          against a real source.
        </p>
        <div className="v4-hero-ctas">
          <a className="v4-pill v4-pill-indigo v4-pill-lg" href="#brief">
            Read today’s Brief <span aria-hidden="true">→</span>
          </a>
          <span className="v4-hero-note">{site.tagline.split(":")[0]}, free</span>
        </div>
      </div>

      <div className="v4-glance" aria-label="Today in 60 seconds">
        <div className="v4-glance-label">
          <span className="v4-cap v4-cap-light">Today in</span>
          <span className="v4-glance-big">60 seconds</span>
        </div>
        {glance.map((item, i) => (
          <a className="v4-glance-card" key={item.title} href="#brief">
            <span className="v4-cap v4-cap-light">0{i + 1}</span>
            <strong>{item.title}</strong>
            <span className="v4-glance-body">{item.body}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
