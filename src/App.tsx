import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { BirdCarrier, ButterflyCarrier } from "./components/Carrier"
import { carrierSprite } from "./data/carriers"
import { LaunchSim } from "./components/LaunchSim"
import { Mark } from "./components/Mark"
import { desks, type DeskId, currentEdition, type EditionStory } from "./data/edition"
import { featuredLaunch } from "./data/launches"
import { featuredModule, learnCatalog } from "./data/learn"
import { libraryVolumes } from "./data/library"
import { newsStories, todayBriefing } from "./data/news"
import { xPostDate, xPosts, xPostText } from "./data/xposts"
import { radarPulse } from "./data/radar"
import { site } from "./data/site"
import { useMaxWidth } from "./hooks/useMaxWidth"
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion"

type RouteId = "front" | "brief" | "academy" | "tools" | "playbook"

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

type Carrier = "butterfly" | "bird"

type ButterflyClip = {
  id: string
  bucket: "brief" | "tools" | "academy"
  paint: string
  desk: string
  headline: string
  href: string
  carrier: Carrier
  storyId?: string
  stack: [number, number, number, number]
  spread: [number, number, number, number]
  dock: [number, number, number, number]
}

/** Sailboat lake loop. WebM is first; MP4 is the fallback source. */
const HERO_POSTER = "/doors/hero2-poster.jpg"
const HERO_STILL = "/doors/hero2-still.jpg"
const HERO_VIDEO_WEBM = "/doors/hero2-loop.webm"
const HERO_VIDEO_MP4 = "/doors/hero2-loop.mp4"

const SECTION_LINKS = [
  { id: "brief", label: "Brief", cta: "Open the Brief" },
  { id: "academy", label: "Academy", cta: "Enter the Academy" },
  { id: "tools", label: "Tools", cta: "Explore Tools" },
  { id: "playbook", label: "Playbook", cta: "Open the Playbook" },
] as const

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

/** Full hero headline. Wraps in the caption; never clipped with an ellipsis. */
function conciseHeadline(theme: string) {
  const dashIdx = theme.indexOf(" — ")
  const base = dashIdx > 0 ? theme.slice(0, dashIdx) : theme
  return base.trim()
}

/** Extracts the first 1–2 crisp sentences for scannable card previews */
function firstSentence(text: string, maxChars = 175) {
  const clean = text.trim()
  const match = clean.match(/^[^.!?]+[.!?]/)
  const first = match ? match[0].trim() : clean
  if (first.length <= maxChars) return first
  return `${first.slice(0, maxChars - 3).replace(/\s+\S*$/, "")}…`
}

const PLORAI_CHARS = ["p", "l", "o", "r", "A", "I"] as const

function Wayfinding({
  current,
  onNavigate,
}: {
  current: RouteId
  onNavigate: (id: string) => void
}) {
  return (
    <nav className="wayfinding" aria-label="Jump between sections">
      <a
        href="#front"
        aria-current={current === "front" ? "true" : undefined}
        onClick={(event) => {
          event.preventDefault()
          onNavigate("front")
        }}
      >
        ↑ Top
      </a>
      {SECTION_LINKS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={current === item.id ? "true" : undefined}
          onClick={(event) => {
            event.preventDefault()
            onNavigate(item.id)
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

function CloudBank({ soft = false }: { soft?: boolean }) {
  const paper = soft ? "rgba(244,241,234,0.55)" : "rgba(244,241,234,0.82)"
  const lav = soft ? "rgba(196,180,255,0.28)" : "rgba(196,180,255,0.5)"
  return (
    <svg className="cloud-bank" viewBox="0 0 800 220" aria-hidden="true">
      <g fill={paper}>
        <ellipse cx="150" cy="120" rx="120" ry="36" />
        <ellipse cx="230" cy="98" rx="70" ry="42" />
        <ellipse cx="90" cy="108" rx="54" ry="28" />
        <ellipse cx="520" cy="130" rx="140" ry="34" />
        <ellipse cx="600" cy="104" rx="78" ry="40" />
        <ellipse cx="450" cy="118" rx="60" ry="26" />
      </g>
      <g fill={lav}>
        <ellipse cx="210" cy="112" rx="80" ry="22" />
        <ellipse cx="560" cy="122" rx="90" ry="20" />
      </g>
    </svg>
  )
}

function MobileHero({
  clips,
  poster,
  onOpen,
  onNavigate,
}: {
  clips: ButterflyClip[]
  poster: string
  onOpen: (clip: ButterflyClip) => void
  onNavigate: (id: string) => void
}) {
  return (
    <section id="front" className="mobile-hero" aria-label="This week">
      <div className="mobile-hero-sky" aria-hidden="true">
        <img src={poster} alt="" />
      </div>
      <div className="mobile-hero-body">
        <p className="mobile-kicker">
          {site.edition} · {site.date}
        </p>
        <h2>{site.headline}</h2>
        <p className="hero-tagline">{site.tagline}</p>
        <div className="story-cards">
          {clips.map((clip) => (
            <a
              key={clip.id}
              className={`story-card desk-${clip.desk.toLowerCase()}`}
              href={clip.href}
              onClick={(event) => {
                event.preventDefault()
                onOpen(clip)
              }}
            >
              <span className="story-chip">{clip.desk}</span>
              <p>{clip.headline}</p>
              <span className="story-go">
                {clip.storyId ? "Read the story →" : "Enter the Academy →"}
              </span>
            </a>
          ))}
        </div>
        <div className="hero-entries">
          {SECTION_LINKS.filter((item) => item.id !== "playbook").map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(item.id)
              }}
            >
              {item.cta} →
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const narrow = useMaxWidth(768)
  const [active, setActive] = useState<RouteId>("front")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [logoFlutter, setLogoFlutter] = useState(false)

  // Modal state for Weekly Brief stories & Editor's Note
  const [activeStoryModal, setActiveStoryModal] = useState<EditionStory | null>(() => {
    if (typeof window === "undefined") return null
    const raw = window.location.hash.replace(/^#/, "")
    if (!raw.startsWith("story-")) return null
    return newsStories.find((item) => item.id === raw.slice(6)) ?? null
  })
  const [editorNoteModalOpen, setEditorNoteModalOpen] = useState(false)

  const [selectedVolumeId, setSelectedVolumeId] = useState<string>(() => {
    const fallback = libraryVolumes[0]?.id ?? "academy"
    if (typeof window === "undefined") return fallback
    const raw = window.location.hash.replace(/^#/, "")
    if (!raw.startsWith("lib-")) return fallback
    return raw.slice(4) || fallback
  })
  const volumeDeskRef = useRef<HTMLElement>(null)

  const reelRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const colsRef = useRef<HTMLDivElement>(null)
  const mistRef = useRef<HTMLDivElement>(null)
  const collageRef = useRef<HTMLDivElement>(null)
  const clipRefs = useRef<(HTMLElement | null)[]>([])

  // Close modals on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveStoryModal(null)
        setEditorNoteModalOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

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
        carrier: "butterfly",
        desk: deskLabel(trustStory.topic),
        headline: conciseHeadline(trustStory.theme),
        href: `#story-${trustStory.id}`,
        storyId: trustStory.id,
        stack: [13, 24, -7, 0.78],
        spread: [14, 28, -6, 1],
        dock: [13, 66, -3, 0.46],
      },
      {
        id: "brief-2",
        bucket: "brief",
        paint: "brief-2",
        carrier: "bird",
        desk: deskLabel(rulesStory.topic),
        headline: conciseHeadline(rulesStory.theme),
        href: `#story-${rulesStory.id}`,
        storyId: rulesStory.id,
        stack: [27, 58, 5, 0.82],
        spread: [24, 68, 4, 1.08],
        dock: [24, 76, 2, 0.42],
      },
      {
        id: "brief-3",
        bucket: "brief",
        paint: "brief-3",
        carrier: "bird",
        desk: deskLabel(moneyStory.topic),
        headline: conciseHeadline(moneyStory.theme),
        href: `#story-${moneyStory.id}`,
        storyId: moneyStory.id,
        stack: [40, 22, -3, 0.84],
        spread: [35, 24, -2, 0.98],
        dock: [33, 60, -1, 0.4],
      },
      {
        id: "tools-1",
        bucket: "tools",
        paint: "tools-1",
        carrier: "butterfly",
        desk: deskLabel(toolsStory.topic),
        headline: conciseHeadline(toolsStory.theme),
        href: `#story-${toolsStory.id}`,
        storyId: toolsStory.id,
        stack: [53, 56, 6, 0.8],
        spread: [50, 50, 1, 1.06],
        dock: [78, 66, 2, 0.44],
      },
      {
        id: "tools-2",
        bucket: "tools",
        paint: "tools-2",
        carrier: "butterfly",
        desk: deskLabel(workStory.topic),
        headline: conciseHeadline(workStory.theme),
        href: `#story-${workStory.id}`,
        storyId: workStory.id,
        stack: [66, 24, -5, 0.82],
        spread: [66, 26, -5, 1.02],
        dock: [90, 76, -2, 0.42],
      },
      {
        id: "academy-1",
        bucket: "academy",
        paint: "academy-1",
        carrier: "butterfly",
        desk: "Learn",
        headline: conciseHeadline(
          currentEdition.columns.matters[0]?.title ?? "A pledge is not an enforcement docket",
        ),
        href: "#academy",
        stack: [78, 58, 3, 0.78],
        spread: [76, 66, 4, 1.02],
        dock: [52, 64, 3, 0.44],
      },
      {
        id: "academy-2",
        bucket: "academy",
        paint: "academy-2",
        carrier: "bird",
        desk: "Learn",
        headline: conciseHeadline(
          currentEdition.columns.matters[1]?.title ?? "Always-on agents need permission design",
        ),
        href: "#academy",
        stack: [90, 22, -6, 0.76],
        spread: [86, 36, -3, 1.04],
        dock: [64, 76, -2, 0.4],
      },
    ]
  }, [])

  const pendingNav = useRef<RouteId | null>(null)

  function navigate(id: string) {
    setMenuOpen(false)
    const target: RouteId = id === "top" ? "front" : (id as RouteId)
    pendingNav.current = target
    setActive(target)
    const behavior: ScrollBehavior = reducedMotion || narrow ? "auto" : "smooth"
    if (target === "front") {
      window.scrollTo({ top: 0, behavior })
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior, block: "start" })
      window.setTimeout(() => {
        document.querySelector<HTMLElement>(`#${target} h2`)?.focus({ preventScroll: true })
      }, behavior === "smooth" ? 700 : 0)
    }
    const hash = target === "front" ? "" : `#${target}`
    history.pushState(null, "", `${window.location.pathname}${window.location.search}${hash}`)
  }

  function openClip(clip: ButterflyClip) {
    setMenuOpen(false)
    const behavior: ScrollBehavior = reducedMotion || narrow ? "auto" : "smooth"
    if (clip.storyId) {
      const story = newsStories.find((item) => item.id === clip.storyId) ?? null
      document.getElementById(`story-${clip.storyId}`)?.scrollIntoView({ behavior, block: "start" })
      if (story) setActiveStoryModal(story)
      history.pushState(null, "", `#story-${clip.storyId}`)
      return
    }
    const id = clip.href.replace("#", "")
    document.getElementById(id)?.scrollIntoView({ behavior, block: "start" })
    history.pushState(null, "", clip.href)
  }

  useEffect(() => {
    if (!activeStoryModal) return
    document.getElementById("modal-story-title")?.focus()
  }, [activeStoryModal])

  useLayoutEffect(() => {
    const raw = window.location.hash.replace(/^#/, "")
    if (raw.startsWith("lib-")) {
      document.getElementById("academy")?.scrollIntoView({ behavior: "auto", block: "start" })
      return
    }
    if (raw.startsWith("story-")) {
      document.getElementById(`story-${raw.slice(6)}`)?.scrollIntoView({ behavior: "auto", block: "start" })
      return
    }
    const mapped = HASH_ALIASES[raw] ?? "front"
    if (mapped === "front") return
    document.getElementById(mapped)?.scrollIntoView({ behavior: "auto", block: "start" })
  }, [])

  useEffect(() => {
    const ids: RouteId[] = ["front", "brief", "academy", "tools", "playbook"]
    let frame = 0
    function update() {
      const mast = document.querySelector<HTMLElement>(".mast")?.offsetHeight ?? 58
      const locked = pendingNav.current
      if (locked) {
        const arrived =
          locked === "front"
            ? window.scrollY <= 2
            : Math.abs((document.getElementById(locked)?.getBoundingClientRect().top ?? 999) - mast) < 4
        setShowTop(window.scrollY > 520)
        if (!arrived) return
        pendingNav.current = null
      }
      const line = window.scrollY + mast + 24
      let current: RouteId = "front"
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= line) current = id
      }
      setActive((prev) => (prev === current ? prev : current))
      setShowTop(window.scrollY > 520)
      const raw = window.location.hash.replace(/^#/, "")
      if (raw.startsWith("story-") && current === "brief") return
      if (raw.startsWith("lib-") && current === "academy") return
      const nextHash = current === "front" ? "" : `#${current}`
      if (window.location.hash !== nextHash) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`)
      }
    }
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    function onScrollEnd() {
      pendingNav.current = null
      update()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("scrollend", onScrollEnd)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("scrollend", onScrollEnd)
    }
  }, [])

  useEffect(() => {
    document.title = active === "front" ? site.name : ROUTE_TITLES[active]
  }, [active])

  // Settled wordmark on load. A later breeze never shifts letters sideways into each other.
  useEffect(() => {
    if (reducedMotion) return
    let clearTimer = 0
    const arm = () => {
      setLogoFlutter(true)
      window.clearTimeout(clearTimer)
      clearTimer = window.setTimeout(() => setLogoFlutter(false), 1700)
    }
    const first = window.setTimeout(arm, 2400)
    const interval = window.setInterval(arm, 9000)
    return () => {
      window.clearTimeout(first)
      window.clearTimeout(clearTimer)
      window.clearInterval(interval)
    }
  }, [reducedMotion])

  function triggerLogoFlutter() {
    if (reducedMotion || logoFlutter) return
    setLogoFlutter(true)
    window.setTimeout(() => setLogoFlutter(false), 1450)
  }

  // Desktop only. Mobile renders painted cards and must not run this loop.
  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.add("js")
    if (reducedMotion || narrow) return

    const reel = reelRef.current
    const pin = pinRef.current
    const line = lineRef.current
    const sky = skyRef.current
    const svg = svgRef.current
    const columns = colsRef.current
    if (!reel || !pin || !line || !sky || !svg || !columns) return

    const paths = Array.from(svg.querySelectorAll("path"))
    const colNodes = Array.from(columns.querySelectorAll<HTMLElement>(".col"))
    const mist = mistRef.current
    const collage = collageRef.current

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
      const now = performance.now() / 1000
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`)

      const centers: { x: number; y: number; open: number; shut: number; bucket: string }[] = []

      clips.forEach((clipData, index) => {
        const el = clipRefs.current[index]
        if (!el) return
        const delay = index * 0.012
        const lift = easeOut(span(p, 0.04 + delay, 0.22 + delay))
        const travel = span(p, 0.08, 0.48)
        const exit = smooth(span(p, 0.5 + index * 0.016, 0.72 + index * 0.01))
        const driftAngle = travel * Math.PI * 1.4 + index * 1.1
        const fly: [number, number, number, number] = [
          clipData.spread[0] + Math.sin(driftAngle) * 5.5,
          clipData.spread[1] + Math.cos(driftAngle * 1.15) * 6.5,
          clipData.spread[2] + Math.sin(driftAngle * 1.3) * 9,
          clipData.spread[3],
        ]
        const lifted = pose(clipData.stack, fly, lift)
        const alive = 1 - exit
        const sway = Math.sin(now * 0.8 + index * 1.15) * 12 * alive
        const bob = Math.cos(now * 0.95 + index * 0.8) * 7 * alive
        const wobble = Math.sin(now * 0.7 + index) * 3.2 * alive
        const flap = mix(
          0.18,
          0.44 + 0.56 * Math.abs(Math.sin(travel * Math.PI * 3.2 + index * 0.85)),
          lift,
        )
        const spreadX = lifted[0] + (lifted[0] - 50) * exit * 0.28
        const x = (spreadX / 100) * w + sway
        const y = (lifted[1] / 100) * h + bob - exit * (h * 0.72 + 36)

        el.style.setProperty("--flap", String(flap))
        el.style.opacity = String(alive)
        el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${lifted[3]})`
        const flyNode = el.querySelector<HTMLElement>(".fly")
        if (flyNode) flyNode.style.transform = `rotate(${lifted[2] + wobble - exit * 10}deg)`
        const pendant = el.querySelector<HTMLElement>(".pendant")
        if (pendant) pendant.style.opacity = String(alive)

        centers[index] = {
          x,
          y,
          open: lift * alive,
          shut: exit,
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

      const mistAmount = smooth(span(p, 0.46, 0.74))
      if (mist) mist.style.opacity = String(mistAmount)
      sky.style.opacity = String(1 - smooth(span(p, 0.7, 0.9)) * 0.4)

      let doorSum = 0
      colNodes.forEach((col, index) => {
        const rise = smooth(span(p, 0.58 + index * 0.045, 0.78 + index * 0.03))
        doorSum += rise
        col.style.opacity = String(rise)
        col.style.transform = `translate3d(0, ${(1 - rise) * 72}px, 0)`
      })
      const doors = colNodes.length ? doorSum / colNodes.length : 0
      const columnsLive = doors > 0.72
      columns.style.opacity = "1"
      columns.style.pointerEvents = columnsLive ? "auto" : "none"
      columns.style.zIndex = columnsLive ? "8" : "6"
      if (collage) collage.style.zIndex = doors > 0.84 ? "2" : "7"
      if (columnsLive) columns.removeAttribute("inert")
      else columns.setAttribute("inert", "")

      const dock = dockRef.current
      if (dock) {
        const shown = 1 - smooth(span(p, 0.06, 0.2))
        dock.style.opacity = String(shown)
        const dockLive = shown > 0.65
        dock.style.pointerEvents = dockLive ? "auto" : "none"
        if (dockLive) dock.removeAttribute("inert")
        else dock.setAttribute("inert", "")
      }

      if (p < 0.42) line.textContent = site.headline
      else line.textContent = site.bridge
      line.style.opacity = String(1 - smooth(span(p, 0.5, 0.66)))
    }

    let alive = true
    let raf = 0
    function loop() {
      if (!alive || !reel) return
      const past = window.scrollY > reel.offsetTop + reel.offsetHeight + 40
      if (!document.hidden && !past) frame()
      if (document.hidden || past) {
        raf = 0
        return
      }
      raf = window.requestAnimationFrame(loop)
    }
    function kick() {
      if (!raf) raf = window.requestAnimationFrame(loop)
    }

    window.addEventListener("scroll", kick, { passive: true })
    window.addEventListener("resize", kick)
    document.addEventListener("visibilitychange", kick)
    kick()
    return () => {
      alive = false
      window.cancelAnimationFrame(raf)
      window.removeEventListener("scroll", kick)
      window.removeEventListener("resize", kick)
      document.removeEventListener("visibilitychange", kick)
      colNodes.forEach((col) => {
        col.style.opacity = ""
        col.style.transform = ""
      })
      if (collage) collage.style.zIndex = ""
      if (mist) mist.style.opacity = ""
    }
  }, [clips, reducedMotion, narrow])

  // Desktop lake loop. Sources attach after load so they stay off the LCP path.
  // Mobile never mounts the element. Reduced motion keeps the poster and does not fetch video.
  useEffect(() => {
    if (narrow || reducedMotion) return
    const video = videoRef.current
    const sky = skyRef.current
    if (!video || !sky) return
    let cancelled = false

    function arm(webmSrc: string, mp4Src: string) {
      if (cancelled || !video) return
      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      video.setAttribute("muted", "")
      video.setAttribute("playsinline", "")
      video.setAttribute("webkit-playsinline", "")
      video.querySelectorAll("source").forEach((node) => node.remove())
      const webm = document.createElement("source")
      webm.src = webmSrc
      webm.type = "video/webm"
      const mp4 = document.createElement("source")
      mp4.src = mp4Src
      mp4.type = "video/mp4"
      video.append(webm, mp4)

      const start = () => {
        if (cancelled || !video) return
        video.muted = true
        const attempt = video.play()
        if (!attempt) return
        attempt.then(() => sky?.classList.add("has-video")).catch(() => {})
      }

      video.addEventListener("canplay", start, { once: true })
      video.load()
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) start()
    }

    function attach() {
      if (cancelled) return
      arm(HERO_VIDEO_WEBM, HERO_VIDEO_MP4)
    }

    if (document.readyState === "complete") window.requestAnimationFrame(attach)
    else window.addEventListener("load", attach, { once: true })

    return () => {
      cancelled = true
      video.pause()
      video.querySelectorAll("source").forEach((node) => node.remove())
      video.removeAttribute("src")
      video.load()
      sky.classList.remove("has-video")
    }
  }, [narrow, reducedMotion])

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
  const verifiedCount = currentEdition.stories.length
  const verifiedLabel = `${verifiedCount} verified ${verifiedCount === 1 ? "story" : "stories"}`
  const introPillars = [
    { id: "brief", title: "Brief", line: "What changed, and what to do next." },
    { id: "academy", title: "Academy", line: "Learn the part that affects your work." },
    { id: "tools", title: "Tools", line: "Niche launches worth a look." },
  ] as const

  return (
    <div className={`doors-app section-${active}`}>
      <svg className="defs" aria-hidden="true">
        <defs>
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
          <a
            href="#front"
            className={`brand-logo ${logoFlutter ? "is-fluttering" : ""}`}
            aria-label={site.name}
            onMouseEnter={triggerLogoFlutter}
            onFocus={triggerLogoFlutter}
            onClick={(event) => {
              event.preventDefault()
              navigate("front")
            }}
          >
            <span className="x-butterfly" aria-hidden="true">
              <Mark className="x-butterfly-svg" />
            </span>
            <span className="plorai" aria-hidden="true">
              {PLORAI_CHARS.map((ch, idx) => (
                <span
                  key={idx}
                  className={`plorai-ch ${idx >= 4 ? "is-ai" : ""}`}
                  style={{ "--char-i": idx } as CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
          </a>
        </h1>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav id="primary-nav" className={menuOpen ? "nav is-open" : "nav"} aria-label="Primary">
          {SECTION_LINKS.map((item, index) => (
            <span key={item.id} className="nav-item">
              {index > 0 ? (
                <span className="dot" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(item.id)
                }}
              >
                {item.label}
              </a>
            </span>
          ))}
        </nav>
      </header>

      <main>
        {narrow ? (
          <MobileHero clips={clips} poster={HERO_STILL} onOpen={openClip} onNavigate={navigate} />
        ) : (
          <div className="reel" id="front" ref={reelRef}>
            <div className="reel-pin" id="reel-pin" ref={pinRef}>
              <div className="pile-sky" id="pile-sky" ref={skyRef} aria-hidden="true">
                <img src={HERO_POSTER} alt="" />
                {reducedMotion ? null : (
                  <video
                    ref={videoRef}
                    className="pile-video"
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    poster={HERO_POSTER}
                    aria-hidden="true"
                  />
                )}
                <div className="lake-shimmer">
                  <svg viewBox="0 0 1200 220" preserveAspectRatio="none">
                    <path
                      fill="rgba(244,241,234,0.34)"
                      d="M0 90 C 160 40 320 140 480 90 C 640 40 800 140 960 88 C 1080 56 1160 100 1200 92 L 1200 220 L 0 220 Z"
                    />
                    <path
                      fill="rgba(196,180,255,0.28)"
                      d="M0 120 C 200 80 400 160 620 118 C 820 80 1000 150 1200 112 L 1200 220 L 0 220 Z"
                    />
                    <path
                      fill="rgba(92,109,224,0.22)"
                      d="M0 150 C 180 130 380 180 560 150 C 780 118 980 170 1200 142 L 1200 220 L 0 220 Z"
                    />
                  </svg>
                  <span className="lake-sweep" />
                </div>
                <div className="cloud-layer cloud-far">
                  <CloudBank />
                  <CloudBank />
                </div>
                <div className="cloud-layer cloud-near">
                  <CloudBank soft />
                  <CloudBank soft />
                </div>
              </div>
              <div className="hero-mist" ref={mistRef} aria-hidden="true" />
              <p className="reel-line" id="reel-line" ref={lineRef}>
                {site.headline}
              </p>
              <div className="collage" id="collage" ref={collageRef} aria-hidden="true">
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
                    data-carrier={clip.carrier}
                    style={
                      {
                        zIndex: 10 + (index === 3 ? 8 : 3 - Math.abs(index - 3)),
                        "--flap-delay": `${index * -0.62}s`,
                        "--flap-duration": `${(4.1 + index * 0.28).toFixed(2)}s`,
                        "--sway-duration": `${(3.5 + index * 0.24).toFixed(2)}s`,
                      } as CSSProperties
                    }
                  >
                    {clip.carrier === "bird" ? (
                      <BirdCarrier
                        src={carrierSprite(
                          "bird",
                          clips.slice(0, index).filter((item) => item.carrier === "bird").length,
                        )}
                      />
                    ) : (
                      <ButterflyCarrier
                        src={carrierSprite(
                          "butterfly",
                          clips.slice(0, index).filter((item) => item.carrier === "butterfly").length,
                        )}
                      />
                    )}
                    <div className="pendant">
                      <span className="leash" aria-hidden="true" />
                      <div className="words">
                        <span className="desk">{clip.desk}</span>
                        <p>{clip.headline}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="columns" ref={colsRef}>
                <a
                  className="col col-brief"
                  href="#brief"
                  aria-label="Open the Brief. What changed in AI this week — and what it means at work."
                  onClick={(event) => {
                    event.preventDefault()
                    navigate("brief")
                  }}
                >
                  <span className="top">
                    <span className="meta">understand</span>
                    <span className="door-cta">
                      Open the Brief →
                    </span>
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
                  aria-label="Enter the Academy. Learn AI like a craft, not a feed."
                  onClick={(event) => {
                    event.preventDefault()
                    navigate("academy")
                  }}
                >
                  <span className="top">
                    <span className="meta">learn</span>
                    <span className="door-cta">
                      Enter the Academy →
                    </span>
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
                  aria-label="Explore Tools. Find the tool worth trying before the noise wins."
                  onClick={(event) => {
                    event.preventDefault()
                    navigate("tools")
                  }}
                >
                  <span className="top">
                    <span className="meta">use</span>
                    <span className="door-cta">
                      Explore Tools →
                    </span>
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
              <div className="hero-dock" ref={dockRef}>
                <p className="hero-tagline">{site.tagline}</p>
                <div className="hero-entries">
                  {SECTION_LINKS.filter((item) => item.id !== "playbook").map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(event) => {
                        event.preventDefault()
                        navigate(item.id)
                      }}
                    >
                      {item.cta} →
                    </a>
                  ))}
                </div>
                <button
                  type="button"
                  className="scroll-cue"
                  onClick={() => {
                    window.scrollBy({
                      top: Math.round(window.innerHeight * 0.72),
                      behavior: reducedMotion ? "auto" : "smooth",
                    })
                  }}
                >
                  Scroll
                  <span className="scroll-cue-chev" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="site-intro" aria-labelledby="what-is-xplorai">
          <div className="site-intro-shell">
            <article className="glass-card site-intro-card">
              <h2 id="what-is-xplorai">What is XplorAI</h2>
              <p>
                XplorAI is a short briefing for people who use AI at work and are tired of sorting the noise.
                Three times a week it says what changed, why it matters for your job, and what to do next —
                in plain words, checked against a real source. The Academy is there when you want to go
                deeper. The Tools pulse is a few niche launches worth a look, not every tool on the internet.
              </p>
              <div className="site-pillars">
                {introPillars.map((pillar) => (
                  <a
                    key={pillar.id}
                    className="glass-card site-pillar"
                    href={`#${pillar.id}`}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate(pillar.id)
                    }}
                  >
                    <span className="desk">{pillar.title}</span>
                    <span>{pillar.line}</span>
                  </a>
                ))}
              </div>
            </article>
          </div>
        </section>

        {xPosts.length > 0 ? (
          <section className="from-x" aria-labelledby="from-x-title">
            <div className="from-x-shell">
              <p className="kicker">From X</p>
              <h2 id="from-x-title">What the builders are saying</h2>
              <div className="from-x-strip">
                {xPosts.map((post) => (
                  <article key={post.url} className="glass-card xpost">
                    <header className="xpost-who">
                      {post.avatarUrl ? (
                        <img src={post.avatarUrl} alt="" width={44} height={44} />
                      ) : null}
                      <div>
                        <strong>{post.name}</strong>
                        <span>@{post.handle}</span>
                      </div>
                    </header>
                    <p className="xpost-text">{xPostText(post.text)}</p>
                    <footer>
                      <time dateTime={post.postedAt}>{xPostDate(post.postedAt)}</time>
                      <a href={post.url} target="_blank" rel="noreferrer">
                        View on X
                      </a>
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ——— DOOR 1: WEEKLY BRIEF (Concise Editorial Cards + Story Modal) ——— */}
          <section id="brief" className="dest is-active" aria-label="Weekly Brief">
            <div className="dest-shell">
              <div className="dest-mast">
                <div>
                  <p className="kicker">Weekly Brief</p>
                  <h2 tabIndex={-1}>{site.edition}</h2>
                </div>
                <p className="dest-meta">
                  {site.date} · {verifiedLabel}
                </p>
              </div>

              <p className="dest-lede">
                {verifiedLabel} this week. Scan the one-line takeaways below, or click any story to open its full briefing and work notes in a modal.
              </p>

              {/* Concise 3-column At-a-Glance Strip (replaces the giant wall-of-text Editor's Note) */}
              <article className="edition-glance painterly-card">
                <div className="glance-head">
                  <div>
                    <span className="desk">This week at a glance · {site.date}</span>
                    <h3>The 60-second executive summary</h3>
                  </div>
                  <button
                    type="button"
                    className="doors-btn"
                    onClick={() => setEditorNoteModalOpen(true)}
                  >
                    Read full editor’s note & open questions
                  </button>
                </div>
                <div className="glance-grid">
                  {currentEdition.columns.changed.slice(0, 3).map((item, idx) => (
                    <div key={item.title} className="glance-col">
                      <span className="desk">0{idx + 1} · Signal</span>
                      <h4>{item.title}</h4>
                      <p>{firstSentence(item.body, 140)}</p>
                    </div>
                  ))}
                </div>
              </article>

              {/* Crisp Painterly Story Cards (Implies + Example in Practice + Quote -> Click for Full Modal) */}
              <div className="proofs">
                {newsStories.map((story, index) => {
                  const tone = IMPASTO_TONES[index % IMPASTO_TONES.length]
                  return (
                    <article
                      id={`story-${story.id}`}
                      key={story.id}
                      className={`proof painterly-proof ${tone} proof-concise`}
                      onClick={() => setActiveStoryModal(story)}
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

                        <div className="proof-crisp-grid">
                          <div className="crisp-cell">
                            <span className="desk">What this implies</span>
                            <p>{story.imply}</p>
                          </div>
                          <div className="crisp-cell">
                            <span className="desk">Example in practice</span>
                            <p>{firstSentence(story.example, 185)}</p>
                          </div>
                        </div>

                        <blockquote
                          className="proof-source proof-source-compact"
                          onClick={(e) => e.stopPropagation()}
                        >
                          “{firstSentence(story.source.quote, 190)}”
                          <footer>
                            —{" "}
                            <a href={story.source.url} target="_blank" rel="noreferrer">
                              {story.source.title} ↗
                            </a>
                          </footer>
                        </blockquote>

                        <div className="proof-actions">
                          <button
                            type="button"
                            className="doors-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveStoryModal(story)
                            }}
                          >
                            Read full story & action steps →
                          </button>
                          <span className="proof-click-hint">Click card for full details</span>
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
                      <p>{firstSentence(item.body, 150)}</p>
                    </div>
                  ))}
                </div>
                <div className="synth-col">
                  <span className="desk">Why it matters</span>
                  {currentEdition.columns.matters.map((item) => (
                    <div key={item.title} className="synth-item painterly-card">
                      <h4>{item.title}</h4>
                      <p>{firstSentence(item.body, 150)}</p>
                    </div>
                  ))}
                </div>
                <div className="synth-col">
                  <span className="desk">What to watch</span>
                  {currentEdition.columns.watch.map((item) => (
                    <div key={item.title} className="synth-item painterly-card">
                      <h4>{item.title}</h4>
                      <p>{firstSentence(item.body, 150)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Wayfinding current={active} onNavigate={navigate} />
            </div>
          </section>

        {/* ——— DOOR 2: AI ACADEMY & LIBRARY (Expandable Painterly Books, No Photos) ——— */}
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

              <Wayfinding current={active} onNavigate={navigate} />
            </div>
          </section>

        {/* ——— DOOR 3: TOOLS PULSE ——— */}
          <section id="tools" className="dest is-active" aria-label="Tools Radar">
            <div className="dest-shell">
              <div className="dest-mast">
                <div>
                  <p className="kicker">Tools Radar</p>
                  <h2 tabIndex={-1}>On the scope this week</h2>
                </div>
                <p className="dest-meta">
                  {radarPulse.launches.length} niche launches · last pulse{" "}
                  {currentEdition.toolsPulseDate || radarPulse.week}
                </p>
              </div>
              <p className="dest-lede">
                Niche tools that shipped recently, before they turn into noise.
              </p>

              <section id="niche-launches" className="radar-major-section" aria-labelledby="niche-heading">
                <div className="section-banner">
                  <div>
                    <span className="desk">
                      Last tools pulse: {currentEdition.toolsPulseDate || radarPulse.week}
                    </span>
                    <h3 id="niche-heading">New Niche Tool Launches</h3>
                    <p className="section-banner-sub">
                      A short list of builders that shipped recently. Each card includes an illustrative example drawn from that tool’s description.
                    </p>
                  </div>
                </div>

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
                          {launch.demo ? <LaunchSim demo={launch.demo} /> : null}
                          <p className="niche-why">
                            <strong>Why it’s on our radar:</strong> {launch.why}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>

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
              </section>

              <Wayfinding current={active} onNavigate={navigate} />
            </div>
          </section>

        {/* ——— DOOR 4: STRATEGY PLAYBOOK (Pure Painterly Surfaces, No Photos) ——— */}
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

              <Wayfinding current={active} onNavigate={navigate} />
            </div>
          </section>
      </main>

      <button type="button" className="to-top" hidden={!showTop} onClick={() => navigate("front")}>
        Back to top
      </button>

      {/* ——— MODAL 1: FULL STORY BRIEFING & WORK NOTES ——— */}
      {activeStoryModal ? (
        <div
          className="doors-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-story-title"
          onClick={() => setActiveStoryModal(null)}
        >
          <article
            className="doors-modal painterly-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top-bar">
              <span className="desk">
                {deskLabel(activeStoryModal.topic)} · {site.edition} · {site.date}
              </span>
              <button
                type="button"
                className="doors-btn"
                onClick={() => setActiveStoryModal(null)}
              >
                Close ✕
              </button>
            </div>

            <h3 id="modal-story-title" className="modal-title" tabIndex={-1}>
              {activeStoryModal.theme}
            </h3>
            <p className="modal-audience">
              <strong>Who this touches:</strong> {activeStoryModal.audience}
            </p>

            <div className="modal-grid">
              <div className="modal-section">
                <span className="desk">What changed</span>
                <p>{activeStoryModal.changed}</p>
              </div>
              <div className="modal-section">
                <span className="desk">Why it matters</span>
                <p>{activeStoryModal.matters}</p>
                <p className="modal-imply">
                  <strong>Operating implication:</strong> {activeStoryModal.imply}
                </p>
              </div>
            </div>

            <div className="modal-work-box">
              <span className="desk">If you actually use it at work</span>
              <ul>
                {activeStoryModal.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
              <p className="modal-example">
                <strong>Example in practice:</strong> {activeStoryModal.example}
              </p>
            </div>

            <div className="modal-foot-split">
              <div>
                <span className="desk">What to watch next</span>
                <p>{activeStoryModal.watch}</p>
              </div>
              <blockquote className="proof-source">
                “{activeStoryModal.source.quote}”
                <footer>
                  —{" "}
                  <a href={activeStoryModal.source.url} target="_blank" rel="noreferrer">
                    {activeStoryModal.source.title} ↗
                  </a>
                </footer>
              </blockquote>
            </div>
          </article>
        </div>
      ) : null}

      {/* ——— MODAL 2: FULL EDITOR'S NOTE & OPEN QUESTIONS ——— */}
      {editorNoteModalOpen ? (
        <div
          className="doors-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-editor-title"
          onClick={() => setEditorNoteModalOpen(false)}
        >
          <article
            className="doors-modal painterly-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top-bar">
              <span className="desk">
                Editor’s Note · {site.edition} · {site.date}
              </span>
              <button
                type="button"
                className="doors-btn"
                onClick={() => setEditorNoteModalOpen(false)}
              >
                Close ✕
              </button>
            </div>

            <h3 id="modal-editor-title" className="modal-title" tabIndex={-1}>
              {todayBriefing.title}
            </h3>

            <div className="modal-section">
              <span className="desk">Full weekly synthesis</span>
              <p>{todayBriefing.summary}</p>
            </div>

            <div className="modal-work-box">
              <span className="desk">What remains open & unverified</span>
              <p>{todayBriefing.uncertainty}</p>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  )
}
