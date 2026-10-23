import { site } from "../data/site"
import { Logo } from "./Logo"

export function SiteFooter() {
  return (
    <footer id="subscribe" className="v4-footer">
      <div className="v4-footer-top">
        <img className="v4-footer-butterfly" src="/carriers/butterfly-1.webp" alt="" width={180} height={140} />
        <div className="v4-footer-copy">
          <h2>Keep pace with AI, in plain words.</h2>
          <form
            className="v4-signup"
            action={`mailto:${site.email}?subject=Join%20the%20XplorAI%20briefing`}
            method="post"
            encType="text/plain"
          >
            <label className="sr-only" htmlFor="v4-email">
              Your email
            </label>
            <input id="v4-email" name="email" type="email" placeholder="you@work.com" required />
            <button type="submit" className="v4-pill v4-pill-indigo">
              Get the Brief
            </button>
          </form>
          <p className="v4-footer-note">{site.tagline} Free, and every story is linked to its source.</p>
        </div>
      </div>
      <div className="v4-footer-bottom">
        <div className="v4-footer-brand">
          <a className="v4-brand" href="#top" aria-label="XplorAI, back to top">
            <Logo tone="light" />
          </a>
          <p className="v4-credit">
            {"by S.AI ("}
            <a href="https://x.com/Shoonyagyaan" target="_blank" rel="noopener">
              Sai Kiran
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {")"}
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="#brief">The Brief</a>
          <a href="#on-x">On X</a>
          <a href="/tools">Tools</a>
          <a href="#shipped">Shipped</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </nav>
      </div>
    </footer>
  )
}
