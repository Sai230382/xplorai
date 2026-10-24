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
          <ul className="v4-social" aria-label="Sai Kiran">
            <li>
              <a href="https://x.com/Shoonyagyaan" target="_blank" rel="noopener">
                <svg className="v4-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
                @Shoonyagyaan
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@S.ai-fi" target="_blank" rel="noopener">
                <svg className="v4-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
                YouTube
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
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
