import { type FormEvent, useState } from "react"
import { about } from "../data/methodology"
import { nav, site } from "../data/site"
import { Mark } from "./Mark"

export function Footer() {
  const [joined, setJoined] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setJoined(true)
  }

  return (
    <footer className="footer">
      <div aria-hidden="true" className="foot-tear" />
      <div aria-hidden="true" className="foot-dots" />
      <div className="foot-grid">
        <div className="foot-col">
          <span className="foot-brand">
            <span className="mark" aria-hidden="true">
              <Mark />
            </span>
            <span className="foot-mark">
              {site.name}
              <span aria-hidden="true" className="gc">
                {site.name}
              </span>
              <span aria-hidden="true" className="gv">
                {site.name}
              </span>
            </span>
          </span>
          <p className="foot-tag">{site.lede}</p>
        </div>

        <div className="foot-col">
          <div className="foot-h">Explore</div>
          <ul>
            {nav.map((item) => (
              <li key={item.id}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-col">
          <div className="foot-h">The desk</div>
          <ul>
            <li>
              <a href="#library">{about.title}</a>
            </li>
            <li>
              <a href="#library">How we edit</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={`https://${site.domain}`}>{site.domain}</a>
            </li>
          </ul>
        </div>

        <div className="foot-col">
          <div className="foot-h">Get the briefing</div>
          {joined ? (
            <p className="news-note" role="status">
              Thanks — the next briefing lands in your inbox.
            </p>
          ) : (
            <form
              className="news-form"
              action={`mailto:${site.email}?subject=Join%20the%20XplorAI%20briefing`}
              method="post"
              encType="text/plain"
              onSubmit={onSubmit}
            >
              <input aria-label="Email address" name="email" placeholder="you@example.com" type="email" required />
              <button className="btn gold sm" type="submit">
                Join
              </button>
            </form>
          )}
          <p className="news-note">One briefing a week, no noise. Unsubscribe anytime.</p>
        </div>
      </div>
      <div className="copy">
        © 2026 {site.name} · {site.edition}
      </div>
    </footer>
  )
}
