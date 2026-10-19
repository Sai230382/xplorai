import { featuredLaunch } from "../data/launches"
import { Misprint } from "./Misprint"
import { ToolsRadar } from "./ToolsRadar"

export function LaunchLab() {
  return (
    <section id="launches" className="lab" aria-labelledby="launch-title">
      <div className="lab-inner">
        <div className="lab-head">
          <span className="bubble gold">Tools radar · 110 lesser-known tools</span>
          <Misprint as="h2" id="launch-title" text="The tools." className="section-title" />
          <p className="section-body">
            Search by what you need. The radar is the lesser-known shelf — not a second write-up of this week’s brief.
            Mainstream launches stay in the brief; they appear here only as a pointer.
          </p>
        </div>

        <article className="lab-featured">
          <div>
            <span className="bubble lav">From this week’s brief · {featuredLaunch.released}</span>
            <h3>{featuredLaunch.name}</h3>
            <p className="lab-featured-maker">{featuredLaunch.maker}</p>
            <p>
              Covered on the Tools desk in the brief — not again here. The radar below is for tools that have not hit
              that kind of awareness yet.
            </p>
          </div>
          <a className="btn sm" href="#news">
            Read it in the brief
          </a>
        </article>

        <ToolsRadar />
      </div>
    </section>
  )
}
