import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { desks, type DeskId, currentEdition } from "./data/edition"
import { featuredLaunch } from "./data/launches"
import { featuredModule, learnCatalog } from "./data/learn"
import { libraryVolumes } from "./data/library"
import { newsStories, todayBriefing } from "./data/news"
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
} from "./data/radar"
import { site } from "./data/site"
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion"

type RouteId = "front" | "brief" | "academy" | "tools" | "playbook"
type ToolsTab = "niche" | "directory"

const ROUTE_TITLES: Record<Exclude<RouteId, "front">, string> = {
  brief: "Weekly Brief — XplorAI",
  tools: "Tools Radar — XplorAI",
  academy: "AI Academy — XplorAI",
  playbook: "Strategy Playbook — XplorAI",
}

const HASH_ALIASES: Record<string, RouteId> = {
  "": "front",
  front: "front",
  top: "front",
  brief: "brief",
  news: "brief",
  tools: "tools",
  launches: "tools",
  academy: "academy",
  library: "academy",
  playbook: "playbook",
}

type ButterflyClip = {
  id: string
  bucket: "brief" | "tools" | "academy"
  paint: string
  desk: string
  headline: string
  stack: [number, number, number, number]
  spread: [number, number, number, number]
  dock: [number, number, number, number]
}

const PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [1, 4],
  [4, 6],
]

const IMPASTO_TONES = [
  "tone-cream",
  "tone-peri",
  "tone-indigo",
  "tone-lav",
  "tone-slate",
] as const

type ShelfBook = {
  id: string
  num: string
  title: string
  genre: string
  tip: string
  dek: string
  summary: string
  takeaways: string[]
  href: string
  cta: string
  height: number
  tone: string
  dark: boolean
}

const CURRICULUM_VOLUMES: ShelfBook[] = [
  {
    id: "mod-01",
    num: "M01",
    title: "What AI is",
    genre: "Module 01",
    tip: "Foundational · 15 min",
    dek: "AI, machine learning, NLP, and generative AI — how they differ from plain rules-based automation.",
    summary:
      "Most workplace confusion comes from calling every piece of software 'AI'. This module draws the clean line between deterministic software, predictive machine learning, and generative models that synthesize new text, code, or media.",
    takeaways: [
      "Deterministic rules follow fixed paths; machine learning predicts from historical patterns; generative AI samples probable outputs.",
      "Do not buy a generative model for a job a 10-line SQL query or deterministic script solves with 100% reliability.",
      "Every generative step introduces variance — plan where human or programmatic verification sits.",
    ],
    href: "/academy/index.html",
    cta: "Start Module 01 in Academy",
    height: 320,
    tone: "tone-cream",
    dark: false,
  },
  {
    id: "mod-02",
    num: "M02",
    title: "How models work",
    genre: "Module 02",
    tip: "Foundational · 20 min",
    dek: "Tokens, context windows, temperature, and why fluent models still hallucinate.",
    summary:
      "Language models do not look up facts in a database; they predict the next token given the context window. Understanding tokens, attention, and sampling explains why context quality beats prompt length.",
    takeaways: [
      "Tokens are the billing and memory unit — stuffing irrelevant docs into the context degrades reasoning.",
      "Hallucination is a structural property of next-token sampling, not a temporary bug.",
      "Ground answers in retrieved documents with forced quotes whenever accuracy matters.",
    ],
    href: "/academy/index.html",
    cta: "Start Module 02 in Academy",
    height: 360,
    tone: "tone-indigo",
    dark: true,
  },
  {
    id: "mod-03",
    num: "M03",
    title: "Copilots to agents",
    genre: "Module 03",
    tip: "Intermediate · 25 min",
    dek: "Moving from chat turns to background loops that call tools, read files, and wait for approval.",
    summary:
      "A copilot waits for your keystroke; an agent runs a plan-act-observe loop with tools and a computer. The jump in value comes with a jump in blast radius, requiring scoped permissions and stop conditions.",
    takeaways: [
      "Chat is synchronous and human-paced; agents run multi-step loops across APIs and filesystems.",
      "Never grant an agent write access to production systems without an explicit approval gate.",
      "Cap loop turns and token budgets so a stuck agent fails loudly instead of burning spend.",
    ],
    href: "/academy/index.html",
    cta: "Start Module 03 in Academy",
    height: 310,
    tone: "tone-lav",
    dark: false,
  },
  {
    id: "mod-04",
    num: "M04",
    title: "The tools map",
    genre: "Module 04",
    tip: "Practical · 20 min",
    dek: "How the 2026 AI landscape splits across frontier labs, open weights, coding harnesses, and vertical apps.",
    summary:
      "A field guide to which layer does what: frontier reasoning models, fast workhorse models, open-weight local models, and the orchestration harnesses that connect them to your work.",
    takeaways: [
      "Route routine extraction and drafting to cheap workhorse or open-weight models; save frontier models for hard synthesis.",
      "Own your prompts, evals, and data connectors so you can swap model providers in an afternoon.",
      "Evaluate tools on workflow fit and permission hygiene, not benchmark tweets.",
    ],
    href: "/academy/index.html",
    cta: "Start Module 04 in Academy",
    height: 340,
    tone: "tone-peri",
    dark: true,
  },
  {
    id: "mod-05",
    num: "M05",
    title: "Prompting & lab",
    genre: "Module 05",
    tip: "Hands-on · 30 min",
    dek: "Writing structured specifications, few-shot examples, and output schemas that survive real inputs.",
    summary:
      "Good prompting is specification writing. State the role, the exact input boundaries, the verification rules, and the output structure — then test it against edge cases in the interactive Prompt Lab.",
    takeaways: [
      "Replace vague adjectives ('write a great summary') with measurable constraints ('3 bullets, max 80 words, cite source').",
      "Two real input-output examples beat three paragraphs of abstract instructions.",
      "Give the model an explicit escape hatch ('write INSUFFICIENT_DATA if missing') to prevent fabrication.",
    ],
    href: "/academy/index.html",
    cta: "Open Prompt Lab in Academy",
    height: 375,
    tone: "tone-slate",
    dark: true,
  },
]

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v))
}
function smooth(t: number) {
  return t * t * (3 - 2 * t)
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
function span(p: number, a: number, b: number) {
  return clamp((p - a) / (b - a), 0, 1)
}
function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function pose(
  from: [number, number, number, number],
  to: [number, number, number, number],
  t: number,
): [number, number, number, number] {
  return [
    mix(from[0], to[0], t),
    mix(from[1], to[1], t),
    mix(from[2], to[2], t),
    mix(from[3], to[3], t),
  ]
}

function deskLabel(id: DeskId) {
  return desks.find((desk) => desk.id === id)?.label ?? id
}

function conciseHeadline(theme: string) {
  const dashIdx = theme.indexOf(" — ")
  if (dashIdx > 0) return theme.slice(0, dashIdx)
  const semiIdx = theme.indexOf("; ")
  if (semiIdx > 0) return theme.slice(0, semiIdx)
  return theme
}

function Signal({ value }: { value: number }) {
  return (
    <span className="doors-sig" aria-label={`Signal ${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < value ? "on" : undefined} />
      ))}
    </span>
  )
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [route, setRoute] = useState<RouteId>("front")
  const [openStoryId, setOpenStoryId] = useState<string | null>(newsStories[0]?.id ?? null)
  const [selectedVolumeId, setSelectedVolumeId] = useState<string>(libraryVolumes[0]?.id ?? "academy")
  const volumeDeskRef = useRef<HTMLElement>(null)

  // Tools Radar interactive state: two clean tabs ("niche" vs "directory") + compact pagination
  const [toolsTab, setToolsTab] = useState<ToolsTab>("niche")
  const [toolQuery, setToolQuery] = useState("")
  const [toolCategory, setToolCategory] = useState(radarCategories[0] ?? "Vibe Coding")
  const [findingTool, setFindingTool] = useState(false)
  const [findQuery, setFindQuery] = useState("")
  const [quickPick, setQuickPick] = useState<number | null>(null)
  const [showAllInCat, setShowAllInCat] = useState(false)
  const [openToolKey, setOpenToolKey] = useState<string | null>(null)
  const toolDetailRef = useRef<HTMLDivElement>(null)

  const reelRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const colsRef = useRef<HTMLDivElement>(null)
  const clipRefs = useRef<(HTMLElement | null)[]>([])

  // Combine the 5 core Library Volumes + 5 Curriculum Modules into unified expandable ShelfBooks
  const allShelfBooks: ShelfBook[] = useMemo(() => {
    const fromLib: ShelfBook[] = libraryVolumes.map((vol, idx) => ({
      id: vol.id,
      num: String(idx + 1).padStart(2, "0"),
      title: vol.title,
      genre: vol.genre,
      tip: vol.tip,
      dek: vol.dek,
      summary: vol.summary,
      takeaways: vol.takeaways,
      href: vol.href,
      cta: vol.cta,
      height: vol.height,
      tone: IMPASTO_TONES[idx % IMPASTO_TONES.length],
      dark: idx % 2 === 1,
    }))
    return [...fromLib, ...CURRICULUM_VOLUMES]
  }, [])

  // Build the 7 butterflies dynamically from live edition.json stories & columns
  const clips: ButterflyClip[] = useMemo(() => {
    const trustStory = newsStories.find((s) => s.topic === "trust") ?? newsStories[0]
    const rulesStory = newsStories.find((s) => s.topic === "rules") ?? newsStories[1]
    const moneyStory = newsStories.find((s) => s.topic === "money") ?? newsStories[4]
    const toolsStory = newsStories.find((s) => s.topic === "tools") ?? newsStories[2]
    const workStory = newsStories.find((s) => s.topic === "work") ?? newsStories[3]

    return [
      {
        id: "brief-1",
        bucket: "brief",
        paint: "brief-1",
        desk: deskLabel(trustStory.topic),
        headline: conciseHeadline(trustStory.theme),
        stack: [16, 42, -7, 0.78],
        spread: [14, 28, -6, 1],
        dock: [13, 66, -3, 0.46],
      },
      {
        id: "brief-2",
        bucket: "brief",
        paint: "brief-2",
        desk: deskLabel(rulesStory.topic),
        headline: conciseHeadline(rulesStory.theme),
        stack: [27, 58, 5, 0.82],
        spread: [24, 68, 4, 1.08],
        dock: [24, 76, 2, 0.42],
      },
      {
        id: "brief-3",
        bucket: "brief",
        paint: "brief-3",
        desk: deskLabel(moneyStory.topic),
        headline: conciseHeadline(moneyStory.theme),
        stack: [38, 38, -3, 0.84],
        spread: [35, 24, -2, 0.98],
        dock: [33, 60, -1, 0.4],
      },
      {
        id: "tools-1",
        bucket: "tools",
        paint: "tools-1",
        desk: deskLabel(toolsStory.topic),
        headline: conciseHeadline(toolsStory.theme),
        stack: [50, 54, 6, 0.8],
        spread: [50, 50, 1, 1.06],
        dock: [78, 66, 2, 0.44],
      },
      {
        id: "tools-2",
        bucket: "tools",
        paint: "tools-2",
        desk: deskLabel(workStory.topic),
        headline: conciseHeadline(workStory.theme),
        stack: [62, 40, -5, 0.82],
        spread: [66, 26, -5, 1.02],
        dock: [90, 76, -2, 0.42],
      },
      {
        id: "academy-1",
        bucket: "academy",
        paint: "academy-1",
        desk: "Learn",
        headline: currentEdition.columns.matters[0]?.title ?? "A pledge is not an enforcement docket",
        stack: [74, 56, 3, 0.78],
        spread: [76, 66, 4, 1.02],
        dock: [52, 64, 3, 0.44],
      },
      {
        id: "academy-2",
        bucket: "academy",
        paint: "academy-2",
        desk: "Learn",
        headline: currentEdition.columns.matters[1]?.title ?? "Always-on agents need permission design",
        stack: [85, 43, -6, 0.76],
        spread: [86, 36, -3, 1.04],
        dock: [64, 76, -2, 0.4],
      },
    ]
  }, [])

  // Sync URL hash to active door route
  useEffect(() => {
    function syncHash(moveFocus: boolean) {
      const raw = window.location.hash.replace("#", "")
      if (raw.startsWith("lib-")) {
        const volId = raw.replace("lib-", "")
        if (allShelfBooks.some((v) => v.id === volId)) {
          setSelectedVolumeId(volId)
        }
        setRoute("academy")
        document.title = ROUTE_TITLES.academy
        return
      }
      const mapped = HASH_ALIASES[raw] ?? "front"
      setRoute(mapped)
      document.title = mapped === "front" ? site.name : ROUTE_TITLES[mapped]
      if (moveFocus) {
        window.scrollTo({ top: 0, behavior: "auto" })
        if (mapped !== "front") {
          window.requestAnimationFrame(() => {
            const heading = document.querySelector<HTMLElement>(`#${mapped} h2`)
            heading?.focus({ preventScroll: true })
          })
        }
      }
    }

    syncHash(false)
    const onHash = () => syncHash(true)
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [allShelfBooks])

  // Scroll-driven butterfly collage choreography on #front
  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.add("js")
    if (reducedMotion || route !== "front") return

    const reel = reelRef.current
    const pin = pinRef.current
    const line = lineRef.current
    const sky = skyRef.current
    const svg = svgRef.current
    const columns = colsRef.current
    if (!reel || !pin || !line || !sky || !svg || !columns) return

    const paths = Array.from(svg.querySelectorAll("path"))

    function frame() {
      if (!reel || !pin || !line || !sky || !svg || !columns) return
      const mastEl = document.querySelector<HTMLElement>(".mast")
      const mast = mastEl ? mastEl.offsetHeight : 58
      pin.style.top = `${mast}px`
      pin.style.height = `${Math.max(window.innerHeight - mast, 320)}px`
      const range = Math.max(reel.offsetHeight - pin.offsetHeight, 1)
      const scrolled = window.scrollY - Math.max(0, reel.offsetTop - mast)
      const p = clamp(scrolled / range, 0, 1)
      const w = pin.clientWidth
      const h = pin.clientHeight
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`)

      const centers: { x: number; y: number; open: number; shut: number; bucket: string }[] = []

      clips.forEach((clipData, index) => {
        const el = clipRefs.current[index]
        if (!el) return
        const delay = index * 0.012
        const lift = easeOut(span(p, 0.04 + delay, 0.24 + delay))
        const travel = span(p, 0.08, 0.68)
        const shut = smooth(span(p, 0.64 + delay * 0.4, 0.86))
        const driftAngle = travel * Math.PI * 1.4 + index * 1.1
        const fly: [number, number, number, number] = [
          clipData.spread[0] + Math.sin(driftAngle) * 5.5,
          clipData.spread[1] + Math.cos(driftAngle * 1.15) * 6.5,
          clipData.spread[2] + Math.sin(driftAngle * 1.3) * 9,
          clipData.spread[3],
        ]
        const lifted = pose(clipData.stack, fly, lift)
        const at = pose(lifted, clipData.dock, shut)
        const fade = smooth(span(p, 0.72, 0.86))
        const wordsFade = smooth(span(p, 0.64, 0.76))
        const flap = mix(0.18, 0.44 + 0.56 * Math.abs(Math.sin(travel * Math.PI * 3.2 + index * 0.85)), lift)

        el.style.setProperty("--flap", String(flap))
        el.style.opacity = String(1 - fade)
        el.style.transform = `translate(${(at[0] / 100) * w}px,${(at[1] / 100) * h}px) translate(-50%,-50%) scale(${at[3]})`
        const flyNode = el.querySelector<HTMLElement>(".fly")
        if (flyNode) flyNode.style.transform = `rotate(${at[2]}deg)`
        const wordsNode = el.querySelector<HTMLElement>(".words")
        if (wordsNode) wordsNode.style.opacity = String(1 - wordsFade)

        centers[index] = {
          x: (at[0] / 100) * w,
          y: (at[1] / 100) * h,
          open: lift,
          shut,
          bucket: clipData.bucket,
        }
      })

      let openSum = 0
      centers.forEach((c) => {
        openSum += c.open
      })
      const openAvg = centers.length ? openSum / centers.length : 0

      PAIRS.forEach((pair, index) => {
        const a = centers[pair[0]]
        const b = centers[pair[1]]
        const path = paths[index]
        if (!a || !b || !path) return
        const cross = a.bucket === b.bucket ? 1 : 1 - Math.max(a.shut, b.shut)
        const alpha = Math.min(a.open, b.open) * (1 - Math.max(a.shut, b.shut)) * cross
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy / len
        const ny = dx / len
        const bow = (index % 2 === 0 ? 1 : -1) * (0.22 + alpha * 0.55) * Math.min(len * 0.42, 150)
        const drift = ((index % 3) - 1) * 28 * alpha
        const c1x = a.x + dx * 0.28 + nx * bow + drift
        const c1y = a.y + dy * 0.18 + ny * bow
        const c2x = a.x + dx * 0.72 - nx * bow * 0.65
        const c2y = a.y + dy * 0.84 - ny * bow * 0.4 + drift
        path.setAttribute("d", `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`)
        path.setAttribute("stroke-opacity", String(alpha * 0.15 * (1 - openAvg)))
      })

      const doors = smooth(span(p, 0.74, 0.92))
      sky.style.opacity = String((0.55 + openAvg * 0.45) * (1 - doors))
      columns.style.opacity = String(doors)
      columns.style.pointerEvents = doors > 0.92 ? "auto" : "none"

      if (p < 0.16) line.textContent = "This week, still in a pile."
      else if (p < 0.7) line.textContent = "Understand what changed. Learn it. Then use it."
      line.style.opacity = String(1 - smooth(span(p, 0.58, 0.74)))
    }

    let ticking = false
    function onScrollOrResize() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        frame()
      })
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)
    frame()
    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }
  }, [clips, reducedMotion, route])

  // Tools Radar computed lists
  const effectiveCategory = toolQuery.trim() ? "All" : toolCategory
  const shelfTools = useMemo(
    () => filterTools(radarTools, effectiveCategory, toolQuery),
    [effectiveCategory, toolQuery],
  )
  const visibleShelfTools = useMemo(() => {
    if (showAllInCat || toolQuery.trim()) return shelfTools
    return shelfTools.slice(0, 9)
  }, [shelfTools, showAllInCat, toolQuery])

  const matchedTools = useMemo(() => findTools(radarTools, findQuery), [findQuery])
  const openedTool: RadarTool | null = useMemo(
    () => radarTools.find((t) => toolKey(t) === openToolKey) ?? null,
    [openToolKey],
  )
  const toolCounts = useMemo(() => {
    const next: Record<string, number> = { All: radarTools.length }
    for (const tool of radarTools) next[tool.c] = (next[tool.c] ?? 0) + 1
    return next
  }, [])

  function openToolDetail(key: string) {
    setOpenToolKey(key)
    window.requestAnimationFrame(() => {
      toolDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    })
  }

  function handleBookClick(bookId: string) {
    if (selectedVolumeId === bookId) {
      volumeDeskRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      })
      return
    }
    setSelectedVolumeId(bookId)
  }

  const selectedBook =
    allShelfBooks.find((b) => b.id === selectedVolumeId) ?? allShelfBooks[0]

  const briefLines = clips.filter((c) => c.bucket === "brief")
  const academyLines = clips.filter((c) => c.bucket === "academy")
  const toolsLines = clips.filter((c) => c.bucket === "tools")

  return (
    <div className={`doors-app route-${route}`}>
      <svg className="defs" aria-hidden="true">
        <defs>
          {/* Procedural impasto canvas texture filter for painterly cards & sections */}
          <filter id="impasto-paper" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.14"
              numOctaves="3"
              seed="7"
              result="brush"
            />
            <feColorMatrix
              in="brush"
              type="matrix"
              values="0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0 0.12  0 0 0 0.12 0"
            />
          </filter>

          <symbol id="wing-left" viewBox="0 0 100 120">
            <path
              d="M 96,46 C 82,30 58,18 34,22 C 20,25 18,36 28,45 C 44,53 74,51 96,49 Z"
              fill="var(--wing-glow)"
              opacity="0.32"
            />
            <path
              d="M 38,8 C 22,7 7,12 8,28 C 10,36 18,40 28,35 C 36,30 42,18 38,8 Z"
              fill="var(--wing-edge)"
              opacity="0.28"
            />
            <path
              d="M 96,47 C 70,34 42,22 10,20 M 64,32 C 44,24 26,14 16,10 M 70,36 C 48,36 26,36 11,36 M 78,42 C 58,46 38,50 22,50 M 96,54 C 68,64 42,74 18,82 M 74,62 C 56,78 44,94 48,113"
              fill="none"
              stroke="var(--wing-edge)"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
            <path
              d="M 96,46 C 84,22 54,4 22,8 C 6,10 3,24 9,38 C 14,49 26,56 46,56 C 68,56 86,52 96,49 M 96,52 C 74,56 44,54 20,66 C 8,73 10,89 22,99 C 33,108 42,107 49,116 C 55,112 58,103 68,99 C 82,93 92,76 96,58"
              fill="none"
              stroke="var(--wing-edge)"
              strokeWidth="0.75"
              strokeLinejoin="round"
            />
            <circle cx="13" cy="18" r="1.5" fill="var(--wing-glow)" opacity="0.75" />
            <circle cx="11" cy="27" r="1.2" fill="var(--wing-glow)" opacity="0.7" />
            <circle cx="19" cy="78" r="1.4" fill="var(--wing-glow)" opacity="0.7" />
          </symbol>
          <symbol id="wing-right" viewBox="0 0 100 120">
            <g transform="translate(100, 0) scale(-1, 1)">
              <use href="#wing-left" />
            </g>
          </symbol>
        </defs>
      </svg>

      <header className="mast">
        <h1 className="wordmark">
          <a href="#front">{site.name}</a>
        </h1>
        <nav className="nav" aria-label="Primary">
          <a href="#brief" aria-current={route === "brief" ? "page" : undefined}>
            Brief
          </a>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <a href="#academy" aria-current={route === "academy" ? "page" : undefined}>
            Academy
          </a>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <a href="#tools" aria-current={route === "tools" ? "page" : undefined}>
            Tools
          </a>
          <span className="dot" aria-hidden="true">
            ·
          </span>
          <a href="#playbook" aria-current={route === "playbook" ? "page" : undefined}>
            Playbook
          </a>
        </nav>
      </header>

      <main id="front">
        {route === "front" ? (
          <div className="reel" id="reel" ref={reelRef}>
            <div className="reel-pin" id="reel-pin" ref={pinRef}>
              <div className="pile-sky" id="pile-sky" ref={skyRef} aria-hidden="true">
                <img src="/doors/xplorai-door-land.png" alt="" />
              </div>
              <p className="reel-line" id="reel-line" ref={lineRef}>
                This week, still in a pile.
              </p>
              <div className="collage" id="collage" aria-hidden="true">
                <svg className="web" id="web" ref={svgRef}>
                  {PAIRS.map((_, idx) => (
                    <path key={idx} />
                  ))}
                </svg>
                {clips.map((clip, index) => (
                  <article
                    key={clip.id}
                    ref={(el) => {
                      clipRefs.current[index] = el
                    }}
                    className="clip"
                    data-bucket={clip.bucket}
                    data-paint={clip.paint}
                    style={{
                      zIndex: 10 + (index === 3 ? 8 : 3 - Math.abs(index - 3)),
                    }}
                  >
                    <span className="fly" aria-hidden="true">
                      <span className="wing wing-l">
                        <svg viewBox="0 0 100 120">
                          <use href="#wing-left" />
                        </svg>
                      </span>
                      <span className="wing wing-r">
                        <svg viewBox="0 0 100 120">
                          <use href="#wing-right" />
                        </svg>
                      </span>
                      <span className="thorax" />
                      <span className="antennae" />
                    </span>
                    <div className="words">
                      <span className="desk">{clip.desk}</span>
                      <p>{clip.headline}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="columns" ref={colsRef}>
                <a
                  className="col col-brief"
                  href="#brief"
                  aria-label="Weekly Brief. What changed in AI this week — and what it means at work."
                >
                  <span className="top">
                    <span className="meta">understand</span>
                    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 12h15M13 6.5 18.5 12 13 17.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2>What changed in AI this week — and what it means at work.</h2>
                  <ul className="paint-lines">
                    {briefLines.map((item) => (
                      <li key={item.id}>{item.headline}</li>
                    ))}
                  </ul>
                  <span className="plate">
                    <img src="/doors/brief.jpg" alt="" />
                  </span>
                  <span className="land" aria-hidden="true">
                    <img src="/doors/xplorai-door-land.png" alt="" />
                  </span>
                </a>

                <a
                  className="col col-academy"
                  href="#academy"
                  aria-label="AI Academy. Learn AI like a craft, not a feed."
                >
                  <span className="top">
                    <span className="meta">learn</span>
                    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 12h15M13 6.5 18.5 12 13 17.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2>Learn AI like a craft, not a feed.</h2>
                  <ul className="paint-lines">
                    {academyLines.map((item) => (
                      <li key={item.id}>{item.headline}</li>
                    ))}
                  </ul>
                  <span className="plate">
                    <img src="/doors/academy.png?v=6" alt="" />
                  </span>
                  <span className="land" aria-hidden="true">
                    <img src="/doors/xplorai-door-land.png" alt="" />
                  </span>
                </a>

                <a
                  className="col col-tools"
                  href="#tools"
                  aria-label="Tools Radar. Find the tool worth trying before the noise wins."
                >
                  <span className="top">
                    <span className="meta">use</span>
                    <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 12h15M13 6.5 18.5 12 13 17.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2>Find the tool worth trying before the noise wins.</h2>
                  <ul className="paint-lines">
                    {toolsLines.map((item) => (
                      <li key={item.id}>{item.headline}</li>
                    ))}
                  </ul>
                  <span className="plate">
                    <img src="/doors/tools.png?v=3" alt="" />
                  </span>
                  <span className="land" aria-hidden="true">
                    <img src="/doors/xplorai-door-land.png" alt="" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        ) : null}

        {/* ——— DOOR 1: WEEKLY BRIEF (Pure Painterly CSS Surfaces, No Photos) ——— */}
        {route === "brief" ? (
          <section id="brief" className="dest is-active" aria-label="Weekly Brief">
            <div className="dest-shell">
              <div className="dest-mast">
                <div>
                  <p className="kicker">Weekly Brief</p>
                  <h2 tabIndex={-1}>{site.edition}</h2>
                </div>
                <p className="dest-meta">
                  {site.date} · {currentEdition.stats.scanned} scanned → {currentEdition.stats.verified} verified
                </p>
              </div>

              <p className="dest-lede">
                One edition. Read it down the page: what changed, why it matters, then the things you can try at work.
              </p>

              {/* Edition executive summary & uncertainty banner */}
              <article className="edition-overview painterly-card">
                <span className="desk">Editor’s note · {todayBriefing.kicker}</span>
                <h3>{todayBriefing.title}</h3>
                <p>{todayBriefing.summary}</p>
                <p className="edition-uncertainty">
                  <strong>What remains open.</strong> {todayBriefing.uncertainty}
                </p>
              </article>

              <div className="proofs">
                {newsStories.map((story, index) => {
                  const isExpanded = openStoryId === story.id
                  const tone = IMPASTO_TONES[index % IMPASTO_TONES.length]
                  return (
                    <article
                      key={story.id}
                      className={`proof painterly-proof ${tone} ${index === 0 ? "proof-lead" : ""} ${
                        isExpanded ? "is-expanded" : ""
                      }`}
                    >
                      <div className="proof-swatch" aria-hidden="true">
                        <span className="swatch-num">{String(index + 1).padStart(2, "0")}</span>
                        <span className="swatch-desk">{deskLabel(story.topic)}</span>
                      </div>
                      <div className="proof-body">
                        <div className="proof-top-row">
                          <span className="desk">
                            {deskLabel(story.topic)} · {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="proof-aud">{story.audience}</span>
                        </div>
                        <h3>{story.theme}</h3>
                        <p>
                          <strong>Changed.</strong> {story.changed}
                        </p>
                        <p>
                          <strong>Matters.</strong> {story.matters}
                        </p>

                        {isExpanded ? (
                          <div className="proof-drawer">
                            <p>
                              <strong>What this implies.</strong> {story.imply}
                            </p>
                            <div className="proof-uses">
                              <strong>If you actually use it:</strong>
                              <ul>
                                {story.uses.map((u) => (
                                  <li key={u}>{u}</li>
                                ))}
                              </ul>
                            </div>
                            <p>
                              <strong>Example in practice.</strong> {story.example}
                            </p>
                            <p>
                              <strong>Watch next.</strong> {story.watch}
                            </p>
                            <blockquote className="proof-source">
                              “{story.source.quote}”
                              <footer>
                                —{" "}
                                <a href={story.source.url} target="_blank" rel="noreferrer">
                                  {story.source.title} ↗
                                </a>
                              </footer>
                            </blockquote>
                          </div>
                        ) : null}

                        <div className="proof-actions">
                          <button
                            type="button"
                            className="doors-btn"
                            aria-expanded={isExpanded}
                            onClick={() => setOpenStoryId(isExpanded ? null : story.id)}
                          >
                            {isExpanded ? "Fold work notes" : "Read work notes & source"}
                          </button>
                          <a
                            className="doors-link-subtle"
                            href={story.source.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Primary source ↗
                          </a>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Three-column synthesis from edition.columns */}
              <div className="brief-synthesis">
                <div className="synth-col">
                  <span className="desk">What changed</span>
                  {currentEdition.columns.changed.map((item) => (
                    <div key={item.title} className="synth-item painterly-card">
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="synth-col">
                  <span className="desk">Why it matters</span>
                  {currentEdition.columns.matters.map((item) => (
                    <div key={item.title} className="synth-item painterly-card">
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="synth-col">
                  <span className="desk">What to watch</span>
                  {currentEdition.columns.watch.map((item) => (
                    <div key={item.title} className="synth-item painterly-card">
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a className="back" href="#front">
                ← Front door
              </a>
            </div>
          </section>
        ) : null}

        {/* ——— DOOR 2: AI ACADEMY & LIBRARY (Expandable Painterly Books, No Photos) ——— */}
        {route === "academy" ? (
          <section id="academy" className="dest is-active" aria-label="AI Academy">
            <div className="dest-shell">
              <div className="dest-mast">
                <div>
                  <p className="kicker">AI Academy & Library</p>
                  <h2 tabIndex={-1}>Paths, not feeds</h2>
                </div>
                <p className="dest-meta">5 library volumes · 14 modules · click any spine to unfold</p>
              </div>
              <p className="dest-lede">
                The books. Click any spine on the shelf to unfold its cover leaf in place, then click again (or read below) to open the full volume.
              </p>

              {/* Interactive Expandable Bookcase */}
              <div className="doors-subhead">
                <span>Interactive Bookcase · Click a spine to unfold the book</span>
                <a className="doors-pill-link" href="/academy/index.html">
                  Launch full 14-module Academy ↗
                </a>
              </div>

              <div className="bookcase" role="region" aria-label="Interactive Library Shelf">
                <div className="shelf-row">
                  {allShelfBooks.map((book) => {
                    const isOpen = selectedBook.id === book.id
                    return (
                      <div
                        key={book.id}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        aria-label={`${book.title} (${book.genre}). ${
                          isOpen ? "Expanded. Click to jump to full summary." : "Click to expand book."
                        }`}
                        className={`spine-book spine-expandable ${book.tone} ${
                          book.dark ? "dark" : ""
                        } ${isOpen ? "is-open" : ""}`}
                        style={{
                          height: `${book.height}px`,
                        }}
                        onClick={() => handleBookClick(book.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleBookClick(book.id)
                          }
                        }}
                      >
                        <span className="spine-face">
                          <span className="num">{book.num}</span>
                          <h3>{book.title}</h3>
                          <span className="spine-genre">{book.genre}</span>
                        </span>

                        {/* 3D Unfolding Book Cover Leaf (pure painterly wash, no photo) */}
                        <div
                          className={`spine-leaf ${book.tone}`}
                          aria-hidden={!isOpen}
                          onClick={(e) => {
                            e.stopPropagation()
                            volumeDeskRef.current?.scrollIntoView({
                              behavior: reducedMotion ? "auto" : "smooth",
                              block: "start",
                            })
                          }}
                        >
                          <div className="leaf-inner">
                            <div className="leaf-top">
                              <span className="leaf-kicker">{book.genre}</span>
                              <span className="leaf-tip">{book.tip}</span>
                            </div>
                            <h4 className="leaf-title">{book.title}</h4>
                            <p className="leaf-dek">{book.dek}</p>
                            <div className="leaf-foot">
                              <a
                                className="leaf-open-link"
                                href={book.href}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {book.cta} ↗
                              </a>
                              <span className="leaf-scroll-hint">Notes ↓</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Volume Reading Desk */}
              {selectedBook ? (
                <article className="volume-desk painterly-panel" ref={volumeDeskRef} aria-live="polite">
                  <div className="volume-desk-head">
                    <div>
                      <span className="desk">
                        {selectedBook.genre} · {selectedBook.tip}
                      </span>
                      <h3>{selectedBook.title}</h3>
                      <p className="volume-dek">{selectedBook.dek}</p>
                    </div>
                    <a className="doors-btn doors-btn-light" href={selectedBook.href}>
                      {selectedBook.cta} →
                    </a>
                  </div>
                  <p className="volume-summary">{selectedBook.summary}</p>
                  <div className="volume-takeaways">
                    <span className="desk">Key operating takeaways</span>
                    <ul>
                      {selectedBook.takeaways.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ) : null}

              {/* Featured Hands-On Workshop from src/data/learn.ts */}
              <article className="academy-workshop painterly-panel">
                <div className="workshop-head">
                  <div>
                    <span className="desk">
                      Hands-on build · {featuredModule.time} · {featuredModule.difficulty}
                    </span>
                    <h3>{featuredModule.title}</h3>
                    <p>{featuredModule.dek}</p>
                  </div>
                  <div className="workshop-outcome">
                    <span className="desk">Outcome</span>
                    <p>{featuredModule.outcome}</p>
                  </div>
                </div>

                <div className="workshop-steps">
                  {featuredModule.steps.map((step, idx) => (
                    <div key={step.id} className="workshop-step">
                      <span className="desk">
                        Step 0{idx + 1} · {step.minutes} min
                      </span>
                      <h4>{step.title}</h4>
                      <p>{step.body}</p>
                      <p className="step-example">
                        <strong>Spec:</strong> {step.example}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="workshop-more">
                  <span className="desk">More practical drills in the Academy</span>
                  <div className="workshop-catalog">
                    {learnCatalog.map((item) => (
                      <a key={item.title} href="/academy/index.html" className="catalog-card">
                        <span className="desk">
                          {item.level} · {item.time}
                        </span>
                        <strong>{item.title}</strong>
                      </a>
                    ))}
                  </div>
                </div>
              </article>

              <a className="back" href="#front">
                ← Front door
              </a>
            </div>
          </section>
        ) : null}

        {/* ——— DOOR 3: TOOLS RADAR (Two Focused Painterly Views, No Photo Clutter) ——— */}
        {route === "tools" ? (
          <section id="tools" className="dest is-active" aria-label="Tools Radar">
            <div className="dest-shell">
              <div className="dest-mast">
                <div>
                  <p className="kicker">Tools Radar</p>
                  <h2 tabIndex={-1}>On the scope this week</h2>
                </div>
                <p className="dest-meta">
                  {radarPulse.launches.length} new niche launches · {radarTools.length} tools indexed
                </p>
              </div>
              <p className="dest-lede">
                Switch between <strong>New Niche Tool Launches</strong> for this week’s under-the-radar releases and hidden gems, or open the <strong>Tools Directory</strong> to browse one category at a time without endless scrolling.
              </p>

              {/* Two-Room Mode Switcher (prevents vertical overload) */}
              <div className="radar-room-tabs" role="tablist" aria-label="Tools Radar sections">
                <button
                  type="button"
                  role="tab"
                  aria-selected={toolsTab === "niche"}
                  className={`room-tab ${toolsTab === "niche" ? "is-active" : ""}`}
                  onClick={() => setToolsTab("niche")}
                >
                  <span className="room-num">01</span>
                  <span className="room-label">
                    <strong>New Niche Tool Launches</strong>
                    <small>{radarPulse.launches.length} new drops + {radarGems.length} hidden gems</small>
                  </span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={toolsTab === "directory"}
                  className={`room-tab ${toolsTab === "directory" ? "is-active" : ""}`}
                  onClick={() => setToolsTab("directory")}
                >
                  <span className="room-num">02</span>
                  <span className="room-label">
                    <strong>Tools Directory</strong>
                    <small>Browse by category or match by task ({radarTools.length} tools)</small>
                  </span>
                </button>
              </div>

              {/* Active Tool Inspection Drawer (shared between both rooms) */}
              <div ref={toolDetailRef}>
                {openedTool ? (
                  <article className="doors-tool-inspect painterly-card">
                    <div className="inspect-head">
                      <div>
                        <span className="desk">
                          {openedTool.c} · {openedTool.p || "Pricing on site"}
                        </span>
                        <h3>{openedTool.n}</h3>
                        <p className="inspect-tl">{openedTool.tl}</p>
                      </div>
                      <div className="inspect-actions">
                        <a
                          className="doors-btn"
                          href={openedTool.w}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit {shortHost(openedTool.w)} ↗
                        </a>
                        <button
                          type="button"
                          className="doors-btn doors-btn-light"
                          onClick={() => setOpenToolKey(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    <p className="inspect-desc">{openedTool.d}</p>
                    <div className="inspect-cols">
                      {openedTool.f?.length ? (
                        <div>
                          <span className="desk">What it does</span>
                          <ul>
                            {openedTool.f.map((f) => (
                              <li key={f}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {openedTool.u?.length ? (
                        <div>
                          <span className="desk">If you actually use it</span>
                          <ul>
                            {openedTool.u.map((u) => (
                              <li key={u}>{u}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                    {openedTool.e ? (
                      <p className="inspect-plain">
                        <strong>In plain language.</strong> {openedTool.e}
                      </p>
                    ) : null}
                  </article>
                ) : null}
              </div>

              {/* =========================================================
                  TAB 01: NEW NICHE TOOL LAUNCHES
              ========================================================= */}
              {toolsTab === "niche" ? (
                <section id="niche-launches" className="radar-major-section" aria-labelledby="niche-heading">
                  <div className="section-banner">
                    <div>
                      <span className="desk">Section 01 · Weekly Pulse ({radarPulse.week})</span>
                      <h3 id="niche-heading">New Niche Tool Launches</h3>
                      <p className="section-banner-sub">
                        Specialized sandboxes, agent firewalls, MCP gateways, and lesser-known builders that shipped recently — before they hit mainstream noise.
                      </p>
                    </div>
                  </div>

                  {/* Painterly Impasto Swatch Cards for Niche Launches (No Photos) */}
                  <div className="niche-launches-grid">
                    {radarPulse.launches.map((launch, index) => {
                      const tone = IMPASTO_TONES[(index + 1) % IMPASTO_TONES.length]
                      return (
                        <article key={launch.name} className={`niche-launch-card ${tone}`}>
                          <div className="niche-card-swatch">
                            <div className="niche-swatch-meta">
                              <span className="niche-badge">New Niche Launch</span>
                              <span className="desk">{launch.date}</span>
                            </div>
                            <h4>{launch.name}</h4>
                          </div>
                          <div className="niche-card-body">
                            <p className="niche-desc">{launch.desc}</p>
                            <p className="niche-why">
                              <strong>Why it’s on our radar:</strong> {launch.why}
                            </p>
                          </div>
                        </article>
                      )
                    })}
                  </div>

                  {/* Featured Launch Deep-Dive + Niche Launch Trends */}
                  <div className="niche-split-row">
                    <article className="tools-spotlight painterly-panel">
                      <span className="desk">
                        {featuredLaunch.kicker} · {featuredLaunch.maker} · {featuredLaunch.released}
                      </span>
                      <h4>{featuredLaunch.name}</h4>
                      <p>{featuredLaunch.overview}</p>
                      <div className="spotlight-cols">
                        <div>
                          <span className="desk">How to pilot it</span>
                          <ul>
                            {featuredLaunch.useCases.map((u) => (
                              <li key={u}>{u}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="desk">Guardrails & limits</span>
                          <ul>
                            {featuredLaunch.limitations.map((l) => (
                              <li key={l}>{l}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>

                    <div className="niche-trends-col">
                      <span className="desk">Niche Launch Patterns This Week</span>
                      {radarPulse.trends.map((trend) => (
                        <article key={trend.title} className="niche-trend-card painterly-panel">
                          <h4>{trend.title}</h4>
                          <p>{trend.desc}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  {/* Under-the-Radar Hidden Gems */}
                  <div className="explorer-gems">
                    <div className="doors-subhead">
                      <span>Under-the-Radar Niche Gems · Click any gem to inspect</span>
                      <span>{radarGems.length} curated picks</span>
                    </div>
                    <div className="doors-tool-grid">
                      {radarGems.map((gem) => {
                        const t = gemTool(gem.name)
                        if (!t) return null
                        return (
                          <button
                            key={gem.name}
                            type="button"
                            className={`doors-tool-card is-gem ${
                              openToolKey === toolKey(t) ? "is-selected" : ""
                            }`}
                            onClick={() => openToolDetail(toolKey(t))}
                          >
                            <div className="card-top">
                              <span className="desk">{t.c}</span>
                              <Signal value={t.s} />
                            </div>
                            <h4>{t.n}</h4>
                            <p>{gem.why}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </section>
              ) : null}

              {/* =========================================================
                  TAB 02: TOOLS DIRECTORY (CURATED BY CATEGORY, NEVER 110 AT ONCE)
              ========================================================= */}
              {toolsTab === "directory" ? (
                <section id="tools-directory" className="radar-major-section" aria-labelledby="directory-heading">
                  <div className="section-banner">
                    <div>
                      <span className="desk">
                        Section 02 · Curated Shelf ({radarCategories.length} categories · {radarTools.length} tools total)
                      </span>
                      <h3 id="directory-heading">Tools Directory</h3>
                      <p className="section-banner-sub">
                        Pick a category shelf below (9–14 tools each) or describe your workflow in <strong>Match by task</strong> so you never have to scroll a 110-item wall.
                      </p>
                    </div>
                    <a className="doors-pill-link" href="/tools/index.html">
                      Open standalone Tools Radar ↗
                    </a>
                  </div>

                  <div className="doors-radar-explorer">
                    <div className="explorer-bar">
                      <div className="explorer-modes" role="tablist" aria-label="Radar search mode">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={!findingTool}
                          className={!findingTool ? "is-on" : undefined}
                          onClick={() => setFindingTool(false)}
                        >
                          Browse by category
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={findingTool}
                          className={findingTool ? "is-on" : undefined}
                          onClick={() => setFindingTool(true)}
                        >
                          Match by task
                        </button>
                      </div>

                      {findingTool ? (
                        <label className="explorer-input">
                          <span className="sr-only">Describe the task you want to do</span>
                          <input
                            type="search"
                            placeholder="Describe a job — e.g. transcribe noisy meetings, test prompts, animate product shots…"
                            value={findQuery}
                            onChange={(e) => {
                              setFindQuery(e.target.value)
                              setQuickPick(null)
                            }}
                          />
                        </label>
                      ) : (
                        <label className="explorer-input">
                          <span className="sr-only">Search across all 110 tools</span>
                          <input
                            type="search"
                            placeholder="Search all 110 tools by name or keyword…"
                            value={toolQuery}
                            onChange={(e) => setToolQuery(e.target.value)}
                          />
                        </label>
                      )}
                    </div>

                    {findingTool ? (
                      <div className="explorer-chips">
                        {radarQuickPicks.map((item, idx) => (
                          <button
                            key={item.l}
                            type="button"
                            className={quickPick === idx ? "is-on" : undefined}
                            onClick={() => {
                              setQuickPick(idx)
                              setFindQuery(item.l)
                            }}
                          >
                            {item.l}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="explorer-chips" role="tablist" aria-label="Tool categories">
                        {radarCategories
                          .filter((c) => toolCounts[c])
                          .map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              className={effectiveCategory === cat ? "is-on" : undefined}
                              onClick={() => {
                                setToolCategory(cat)
                                setToolQuery("")
                                setShowAllInCat(false)
                              }}
                            >
                              {cat} <span>{toolCounts[cat] ?? 0}</span>
                            </button>
                          ))}
                        <button
                          type="button"
                          className={effectiveCategory === "All" ? "is-on" : undefined}
                          onClick={() => {
                            setToolCategory("All")
                            setShowAllInCat(false)
                          }}
                        >
                          All <span>{radarTools.length}</span>
                        </button>
                      </div>
                    )}

                    {/* Main Tool Grid (capped at 9 unless expanded) */}
                    <div className="explorer-results">
                      <div className="doors-subhead">
                        <span>
                          {findingTool
                            ? findQuery.trim().length > 1
                              ? `Top ${matchedTools.length} matched tools`
                              : "Pick a task prompt above or type your workflow"
                            : toolQuery.trim()
                              ? `${shelfTools.length} matching tools across all categories`
                              : `${effectiveCategory} Shelf · Showing ${visibleShelfTools.length} of ${shelfTools.length} tools`}
                        </span>
                      </div>

                      <div className="doors-tool-grid">
                        {(findingTool ? matchedTools.map((m) => m.tool) : visibleShelfTools).map((tool) => (
                          <button
                            key={toolKey(tool)}
                            type="button"
                            className={`doors-tool-card ${
                              openToolKey === toolKey(tool) ? "is-selected" : ""
                            }`}
                            onClick={() => openToolDetail(toolKey(tool))}
                          >
                            <div className="card-top">
                              <span className="desk">{tool.c}</span>
                              <Signal value={tool.s} />
                            </div>
                            <h4>{tool.n}</h4>
                            <p>{tool.tl}</p>
                          </button>
                        ))}
                      </div>

                      {!findingTool && !toolQuery.trim() && shelfTools.length > 9 ? (
                        <div className="shelf-more-bar">
                          <button
                            type="button"
                            className="doors-btn doors-btn-light"
                            onClick={() => setShowAllInCat((v) => !v)}
                          >
                            {showAllInCat
                              ? "Show top 9 only"
                              : `Show all ${shelfTools.length} tools in ${effectiveCategory}`}
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Frontier Watch (Closed & Open-Weight) */}
                    <div className="frontier-watch">
                      <span className="desk">Frontier model baselines · Closed & Open-weight</span>
                      <div className="frontier-grid">
                        {[...radarFrontier.closed, ...radarFrontier.open].map((item) => (
                          <article key={item.name} className="frontier-card painterly-panel">
                            <span className="desk">{item.org}</span>
                            <h4>{item.name}</h4>
                            <p className="frontier-model">{item.model}</p>
                            <p>{item.note}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}

              <a className="back" href="#front">
                ← Front door
              </a>
            </div>
          </section>
        ) : null}

        {/* ——— DOOR 4: STRATEGY PLAYBOOK (Pure Painterly Surfaces, No Photos) ——— */}
        {route === "playbook" ? (
          <section id="playbook" className="dest is-active" aria-label="Strategy Playbook">
            <div className="dest-shell">
              <div className="dest-mast">
                <div>
                  <p className="kicker">Strategy Playbook</p>
                  <h2 tabIndex={-1}>Where the value sits, which model to pick, and how to price the work</h2>
                </div>
                <p className="dest-meta">7 chapters · interactive pricing studio</p>
              </div>
              <p className="dest-lede">
                Every AI application pays someone above it in the stack. Before you build, buy, or quote a client contract, map the substrate, the model tier, and the verification cost.
              </p>

              <div className="proofs">
                {libraryVolumes
                  .filter((v) => v.id !== "academy")
                  .map((vol, idx) => {
                    const tone = IMPASTO_TONES[idx % IMPASTO_TONES.length]
                    return (
                      <article
                        key={vol.id}
                        className={`proof painterly-proof ${tone} ${idx === 0 ? "proof-lead" : ""}`}
                      >
                        <div className="proof-swatch" aria-hidden="true">
                          <span className="swatch-num">0{idx + 1}</span>
                          <span className="swatch-desk">{vol.genre}</span>
                        </div>
                        <div className="proof-body">
                          <div className="proof-top-row">
                            <span className="desk">
                              {vol.genre} · 0{idx + 1}
                            </span>
                            <span className="proof-aud">{vol.tip}</span>
                          </div>
                          <h3>{vol.title}</h3>
                          <p>
                            <strong>Thesis.</strong> {vol.dek}
                          </p>
                          <p>{vol.summary}</p>
                          <div className="proof-uses">
                            <strong>Operating rules:</strong>
                            <ul>
                              {vol.takeaways.map((t) => (
                                <li key={t}>{t}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="proof-actions">
                            <a className="doors-btn" href={vol.href}>
                              {vol.cta} →
                            </a>
                          </div>
                        </div>
                      </article>
                    )
                  })}
              </div>

              <a className="back" href="#front">
                ← Front door
              </a>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
