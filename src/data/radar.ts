import radar from "../content/radar.json"

export type RadarTool = {
  n: string
  w: string
  c: string
  tl: string
  d: string
  f: string[]
  u: string[]
  e: string
  s: number
  p: string
  st: string
}

export type RadarQuote = {
  who: string
  text: string
  source: string
}

export type RadarLaunch = {
  name: string
  date: string
  desc: string
  why: string
}

export type RadarTrend = {
  title: string
  desc: string
}

export type RadarFunding = {
  company: string
  amount: string
  valuation: string
  context: string
}

export type RadarFrontier = {
  org: string
  name: string
  model: string
  note: string
}

export const radarCategories = radar.categories
export const radarTools = radar.tools as RadarTool[]
export const radarPulse = radar.pulse as {
  week: string
  launches: RadarLaunch[]
  funding: RadarFunding[]
  quotes: RadarQuote[]
  trends: RadarTrend[]
}
export const radarFrontier = radar.frontier as {
  closed: RadarFrontier[]
  open: RadarFrontier[]
}
export const radarGems = radar.gems
export const radarQuickPicks = radar.quickPicks

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "have",
  "want",
  "need",
  "can",
  "make",
  "use",
  "get",
  "like",
  "also",
  "just",
  "into",
])

export function toolTerms(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((term) => term.length > 1 && !STOP.has(term))
}

export function scoreTool(tool: RadarTool, terms: string[]) {
  const hay = [tool.n, tool.c, tool.tl, tool.d, ...(tool.f ?? []), ...(tool.u ?? []), tool.e ?? ""]
    .join(" ")
    .toLowerCase()
  let score = tool.s * 0.5
  for (const term of terms) {
    if (!hay.includes(term)) continue
    score += 3
    if (tool.n.toLowerCase().includes(term)) score += 5
    if (tool.c.toLowerCase().includes(term)) score += 4
  }
  return score
}

export function filterTools(tools: RadarTool[], category: string, query: string) {
  const q = query.trim().toLowerCase()
  return tools
    .filter((tool) => (category === "All" ? true : tool.c === category))
    .filter((tool) => {
      if (!q) return true
      return (
        tool.n.toLowerCase().includes(q) ||
        tool.c.toLowerCase().includes(q) ||
        tool.tl.toLowerCase().includes(q)
      )
    })
    .slice()
    .sort((a, b) => b.s - a.s || a.n.localeCompare(b.n))
}

export function findTools(tools: RadarTool[], query: string) {
  const terms = toolTerms(query)
  if (!terms.length) return []
  return tools
    .map((tool) => ({ tool, score: scoreTool(tool, terms) }))
    .filter((row) => row.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}

export function toolKey(tool: RadarTool) {
  return `${tool.n}::${tool.c}`
}

export function shortHost(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
}

export function gemTool(name: string) {
  return radarTools.find((tool) => tool.n === name)
}
