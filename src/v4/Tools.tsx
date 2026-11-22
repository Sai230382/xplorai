import { useEffect, useMemo, useState } from "react"
import {
  filterTools,
  radarCategories,
  radarPulse,
  radarTools,
  toolKey,
  type RadarTool,
} from "../data/radar"
import { shortDate } from "./format"
import { ToolModal } from "./Modal"

function Signal({ value }: { value: number }) {
  return (
    <span className="v4-sig" aria-label={`Signal ${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < value ? "on" : undefined} />
      ))}
    </span>
  )
}

/** Full tools directory at /tools, fed by src/content/radar.json. */
export function ToolsPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [open, setOpen] = useState<RadarTool | null>(null)

  useEffect(() => {
    document.title = "The Tools Radar · XplorAI"
  }, [])

  const counts = useMemo(() => {
    const next: Record<string, number> = { All: radarTools.length }
    for (const tool of radarTools) next[tool.c] = (next[tool.c] ?? 0) + 1
    return next
  }, [])

  const shelf = useMemo(() => filterTools(radarTools, category, query), [category, query])
  const filtersOn = query.trim() !== "" || category !== "All"

  return (
    <>
      <section className="v4-section v4-dir" aria-labelledby="v4-dir-title">
        <header className="v4-head">
          <div>
            <p className="v4-cap">The Tools Radar · last pulse {shortDate(radarPulse.week)}</p>
            <h2 id="v4-dir-title">Every tool on the radar</h2>
          </div>
          <p className="v4-head-meta">
            {radarTools.length} tools · {radarCategories.length} categories
            <br />
            Each one scored 1–5 for signal, in plain words
          </p>
        </header>

        <div className="v4-dir-controls">
          <label className="sr-only" htmlFor="v4-dir-q">
            Search tools
          </label>
          <input
            id="v4-dir-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category"
          />
          <div className="v4-dir-cats" role="toolbar" aria-label="Filter by category">
            {["All", ...radarCategories].map((cat) => (
              <button
                key={cat}
                type="button"
                className={category === cat ? "is-on" : undefined}
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
              >
                {cat} <span>{counts[cat] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="v4-dir-count">
          {filtersOn ? `${shelf.length} of ${radarTools.length} tools` : `${radarTools.length} tools`}
        </p>

        {shelf.length === 0 ? (
          <p className="v4-dir-empty">No tools match that search. Try another word, or choose All.</p>
        ) : (
          <ul className="v4-dir-grid">
            {shelf.map((tool) => (
              <li key={toolKey(tool)}>
                <button type="button" className="v4-dir-card" onClick={() => setOpen(tool)}>
                  <span className="v4-dir-card-top">
                    <span className="v4-chip">{tool.c}</span>
                    <Signal value={tool.s} />
                  </span>
                  <strong>{tool.n}</strong>
                  <span className="v4-dir-tl">{tool.tl}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {open && <ToolModal tool={open} onClose={() => setOpen(null)} />}
    </>
  )
}
