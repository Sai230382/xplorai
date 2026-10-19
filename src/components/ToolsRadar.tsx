import { useMemo, useRef, useState } from "react"
import {
  filterTools,
  findTools,
  gemTool,
  radarCategories,
  radarFrontier,
  radarGems,
  radarPulse,
  radarQuickPicks,
  radarTools,
  shortHost,
  toolKey,
  type RadarTool,
} from "../data/radar"

function Signal({ value }: { value: number }) {
  return (
    <span className="radar-sig" aria-label={`Signal ${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < value ? "on" : undefined} />
      ))}
    </span>
  )
}

function ToolCard({
  tool,
  why,
  onOpen,
}: {
  tool: RadarTool
  why?: string
  onOpen: (id: string) => void
}) {
  return (
    <button type="button" className="radar-card" onClick={() => onOpen(toolKey(tool))}>
      <span className="radar-card-cat">{tool.c}</span>
      <strong>{tool.n}</strong>
      <span className="radar-card-tl">{why ?? tool.tl}</span>
      <Signal value={tool.s} />
    </button>
  )
}

function ToolDetail({ tool, onClose }: { tool: RadarTool; onClose: () => void }) {
  return (
    <article className="radar-detail" id="radar-detail">
      <p className="radar-kicker">{tool.c}</p>
      <h3>{tool.n}</h3>
      <p className="radar-detail-tl">{tool.tl}</p>
      <p className="radar-detail-meta">
        <Signal value={tool.s} />
        <span>Signal {tool.s}/5</span>
        {tool.p ? <span>{tool.p}</span> : null}
      </p>
      <p>{tool.d}</p>
      {tool.f?.length ? (
        <div className="radar-detail-block">
          <p>
            <strong>What it does.</strong>
          </p>
          <ul>
            {tool.f.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {tool.u?.length ? (
        <div className="radar-detail-block">
          <p>
            <strong>If you actually use it.</strong>
          </p>
          <ul>
            {tool.u.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {tool.e ? (
        <p className="radar-detail-eli">
          <strong>In plain language.</strong> {tool.e}
        </p>
      ) : null}
      <div className="radar-detail-actions">
        <a className="btn peri sm" href={tool.w} target="_blank" rel="noreferrer">
          Visit {shortHost(tool.w)}
        </a>
        <button type="button" className="btn ink sm" onClick={onClose}>
          Back to the shelf
        </button>
      </div>
    </article>
  )
}

export function ToolsRadar() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [finding, setFinding] = useState(false)
  const [findQuery, setFindQuery] = useState("")
  const [pick, setPick] = useState<number | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const shelf = useMemo(() => filterTools(radarTools, category, query), [category, query])
  const matches = useMemo(() => findTools(radarTools, findQuery), [findQuery])
  const opened = radarTools.find((tool) => toolKey(tool) === open) ?? null

  function openTool(id: string) {
    setOpen(id)
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  const counts = useMemo(() => {
    const next: Record<string, number> = { All: radarTools.length }
    for (const tool of radarTools) next[tool.c] = (next[tool.c] ?? 0) + 1
    return next
  }, [])

  return (
    <div className="radar" id="radar">
      <div className="radar-controls">
        <div className="radar-modes" role="tablist" aria-label="Radar mode">
          <button
            type="button"
            role="tab"
            aria-selected={!finding}
            className={!finding ? "is-on" : undefined}
            onClick={() => setFinding(false)}
          >
            Browse
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={finding}
            className={finding ? "is-on" : undefined}
            onClick={() => setFinding(true)}
          >
            Find my tool
          </button>
        </div>
        {finding ? (
          <label className="radar-search">
            <span className="visually-hidden">Describe what you need</span>
            <textarea
              rows={2}
              placeholder="Describe what you need — e.g. animate a character from a photo"
              value={findQuery}
              onChange={(event) => {
                setFindQuery(event.target.value)
                setPick(null)
              }}
            />
          </label>
        ) : (
          <label className="radar-search">
            <span className="visually-hidden">Search tools</span>
            <input
              type="search"
              placeholder="Search tools…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        )}
      </div>

      {finding ? (
        <div className="radar-picks">
          {radarQuickPicks.map((item, index) => (
            <button
              key={item.l}
              type="button"
              className={pick === index ? "is-on" : undefined}
              onClick={() => {
                setPick(index)
                setFindQuery(item.l)
              }}
            >
              {item.l}
            </button>
          ))}
        </div>
      ) : (
        <div className="radar-chips" role="tablist" aria-label="Tool categories">
          {["All", ...radarCategories.filter((name) => counts[name])].map((name) => (
            <button
              key={name}
              type="button"
              className={category === name ? "is-on" : undefined}
              onClick={() => setCategory(name)}
            >
              {name}
              <span>{counts[name] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      <div ref={detailRef}>{opened ? <ToolDetail tool={opened} onClose={() => setOpen(null)} /> : null}</div>

      {finding ? (
        <section className="radar-sec" aria-label="Recommendations">
          <h3 className="radar-sec-label">
            {findQuery.trim().length > 2 ? `${matches.length} recommendations` : "Type what you need, or try a quick pick"}
          </h3>
          <div className="radar-grid">
            {matches.map(({ tool }) => (
              <ToolCard key={toolKey(tool)} tool={tool} onOpen={openTool} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {!query && category === "All" ? (
            <div className="radar-pulse">
              <p className="radar-kicker">Weekly pulse · {radarPulse.week}</p>
              <p className="radar-pulse-lede">
                Lesser-known launches and the ops layer around them. Mainstream headlines live in{" "}
                <a href="#news">this week’s brief</a>, not here.
              </p>

              <section className="radar-sec">
                <h3 className="radar-sec-label">Notable launches</h3>
                <div className="radar-grid">
                  {radarPulse.launches.map((launch) => (
                    <article key={launch.name} className="radar-note">
                      <h4>{launch.name}</h4>
                      <p className="radar-kicker">{launch.date}</p>
                      <p>{launch.desc}</p>
                      <p className="radar-why">{launch.why}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="radar-sec">
                <h3 className="radar-sec-label">Frontier watch — the giants we don’t track</h3>
                <p className="radar-sec-sub">Closed frontier</p>
                <div className="radar-grid radar-grid-tight">
                  {radarFrontier.closed.map((item) => (
                    <article key={item.name} className="radar-note">
                      <p className="radar-kicker">{item.org}</p>
                      <h4>{item.name}</h4>
                      <p className="radar-why">{item.model}</p>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>
                <p className="radar-sec-sub">Open weights</p>
                <div className="radar-grid radar-grid-tight">
                  {radarFrontier.open.map((item) => (
                    <article key={item.name} className="radar-note">
                      <p className="radar-kicker">{item.org}</p>
                      <h4>{item.name}</h4>
                      <p className="radar-why">{item.model}</p>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="radar-sec">
                <h3 className="radar-sec-label">Expert takes</h3>
                {radarPulse.quotes.map((quote) => (
                  <blockquote key={quote.who} className="radar-quote">
                    <p>“{quote.text}”</p>
                    <footer>
                      — {quote.who}
                      {quote.source ? ` · ${quote.source}` : ""}
                    </footer>
                  </blockquote>
                ))}
              </section>

              <section className="radar-sec">
                <h3 className="radar-sec-label">What this week is doing</h3>
                {radarPulse.trends.map((trend) => (
                  <article key={trend.title} className="radar-note radar-note-wide">
                    <h4>{trend.title}</h4>
                    <p>{trend.desc}</p>
                  </article>
                ))}
              </section>

              <section className="radar-sec">
                <h3 className="radar-sec-label">Hidden gems</h3>
                <div className="radar-grid">
                  {radarGems.map((gem) => {
                    const tool = gemTool(gem.name)
                    if (!tool) return null
                    return <ToolCard key={gem.name} tool={tool} why={gem.why} onOpen={openTool} />
                  })}
                </div>
              </section>
            </div>
          ) : null}

          <section className="radar-sec" aria-label="The shelf">
            <h3 className="radar-sec-label">
              The shelf · {shelf.length} {shelf.length === 1 ? "tool" : "tools"}
            </h3>
            <div className="radar-grid">
              {shelf.map((tool) => (
                <ToolCard key={toolKey(tool)} tool={tool} onOpen={openTool} />
              ))}
            </div>
            {!shelf.length ? <p className="radar-empty">No tools match that search.</p> : null}
          </section>
        </>
      )}
    </div>
  )
}
