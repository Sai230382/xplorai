import { useEffect } from "react"
import { hostOf, newToolsWeek, type NewTool } from "../data/newtools"
import { shortDate } from "./format"

function Sources({ urls }: { urls: string[] }) {
  return (
    <ul className="v4-nt-sources" aria-label="Sources">
      {urls.map((url) => (
        <li key={url}>
          <a className="v4-source" href={url} target="_blank" rel="noreferrer">
            {hostOf(url)} <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function ToolCard({ tool, index }: { tool: NewTool; index: number }) {
  const soon = tool.status === "coming_soon"
  return (
    <li id={`tool-${index + 1}`} className={`v4-nt-tool${soon ? " is-soon" : ""}`}>
      <div className="v4-story-meta">
        <span className="v4-story-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="v4-chip">{tool.category}</span>
        {tool.pick_of_week && <span className="v4-chip v4-chip-pick">Pick of the week</span>}
        {soon && tool.available_from && (
          <span className="v4-chip v4-chip-soon">Coming {shortDate(tool.available_from)}</span>
        )}
      </div>
      <h3>
        <a href={tool.url} target="_blank" rel="noreferrer">
          {tool.name}
        </a>
      </h3>
      <p className="v4-nt-when">
        {soon ? "Unveiled" : "Launched"} {shortDate(tool.launch_date)} · {hostOf(tool.url)}
      </p>
      <p className="v4-nt-one">{tool.one_liner}</p>
      <dl className="v4-nt-facts">
        <div>
          <dt>Who it’s for</dt>
          <dd>{tool.who_its_for}</dd>
        </div>
        <div>
          <dt>Pricing</dt>
          <dd>{tool.pricing}</dd>
        </div>
      </dl>
      <p className="v4-nt-eli5">
        <span aria-hidden="true">✦</span> In plain words: {tool.eli5}
      </p>
      <Sources urls={tool.sources} />
    </li>
  )
}

/** "New AI tools this week": trend context, the week's picks with a 5-minute walkthrough, then every launch. */
export function NewToolsPage() {
  const { label, window: span, trends, tools } = newToolsWeek
  const picks = tools.filter((t) => t.pick_of_week && t.status !== "coming_soon" && t.try_steps?.length)

  useEffect(() => {
    document.title = "New AI tools this week · XplorAI"
  }, [])

  return (
    <>
      <section id="top" className="v4-section v4-nt-intro" aria-labelledby="v4-nt-title">
        <header className="v4-head">
          <div>
            <p className="v4-cap">New AI tools this week · {label}</p>
            <h2 id="v4-nt-title">
              New AI tools this week,
              <br />
              and who they’re actually for
            </h2>
          </div>
          <p className="v4-head-meta">
            {tools.length} launches · {span}
            <br />
            Every link and date checked against its source
          </p>
        </header>

        <div className="v4-nt-trends">
          <h3 className="v4-cap">Why this matters</h3>
          <ul>
            {trends.map((trend) => (
              <li key={trend.theme} className="v4-nt-trend">
                <h4>{trend.theme}</h4>
                <p>{trend.why_it_matters}</p>
                <Sources urls={trend.sources} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {picks.length > 0 && (
        <section className="v4-section v4-radar v4-nt-picks" aria-labelledby="v4-nt-picks-title">
          <div className="v4-radar-main">
            <header>
              <p className="v4-cap v4-cap-light">Picks of the week</p>
              <h2 id="v4-nt-picks-title">Try it in 5 minutes</h2>
            </header>
            <div className="v4-nt-try-list">
              {picks.map((tool) => (
                <article key={tool.name} className="v4-nt-try">
                  <h3>
                    <a href={tool.url} target="_blank" rel="noreferrer">
                      {tool.name}
                    </a>
                  </h3>
                  <p className="v4-tool-desc">{tool.one_liner}</p>
                  <ol>
                    {tool.try_steps!.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p className="v4-tool-why">
                    <span aria-hidden="true">✦</span> Good first project: {tool.use_cases[0]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="v4-section" aria-labelledby="v4-nt-list-title">
        <header className="v4-head">
          <div>
            <p className="v4-cap">Every launch</p>
            <h2 id="v4-nt-list-title">All {tools.length} this week</h2>
          </div>
          <a className="v4-text-link" href="/tools">
            See every tool on the radar <span aria-hidden="true">→</span>
          </a>
        </header>
        <ol className="v4-nt-tools">
          {tools.map((tool, i) => (
            <ToolCard key={tool.name} tool={tool} index={i} />
          ))}
        </ol>
      </section>
    </>
  )
}
