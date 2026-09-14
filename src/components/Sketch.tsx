import type { ReactElement } from "react"

export type SketchKind = "models" | "agents" | "policy" | "industry" | "research" | "learn" | "signal"

type SketchProps = {
  kind: SketchKind | string
  className?: string
}

/** Resolve a free-form topic label ("Models", "open weights", ...) to a sketch. */
function sketchFor(topic: string): SketchKind {
  const key = topic.toLowerCase()
  if (key.includes("tool") || key.includes("model") || key.includes("weight") || key.includes("helper")) return "models"
  if (key.includes("work") || key.includes("job") || key.includes("agent")) return "agents"
  if (key.includes("rule") || key.includes("policy") || key.includes("law") || key.includes("act")) return "policy"
  if (key.includes("money") || key.includes("industry") || key.includes("price") || key.includes("spend")) return "industry"
  if (key.includes("trust") || key.includes("research") || key.includes("privacy") || key.includes("scam")) return "research"
  if (key.includes("learn") || key.includes("module") || key.includes("path")) return "learn"
  return "signal"
}

/** Ink line drawings used as covers. No images to fetch; new topics get a drawing for free. */
export function Sketch({ kind, className }: SketchProps) {
  const resolved = (
    ["models", "agents", "policy", "industry", "research", "learn", "signal"].includes(kind)
      ? kind
      : sketchFor(kind)
  ) as SketchKind

  return (
    <span className={className ? `sketch ${className}` : "sketch"} aria-hidden="true">
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet">
        {draw[resolved]}
      </svg>
    </span>
  )
}

const draw: Record<SketchKind, ReactElement> = {
  // stacked layers with a highlighted middle weight
  models: (
    <>
      <path d="M30 70 L80 88 L130 70 L80 52 Z" />
      <path d="M30 52 L80 70 L130 52 L80 34 Z" className="fill" />
      <path d="M30 52 L80 70 L130 52 L80 34 Z" />
      <path d="M30 34 L80 52 L130 34 L80 16 Z" />
      <path d="M30 34 L30 70 M130 34 L130 70 M80 52 L80 88" className="thin dash" />
      <circle cx="80" cy="52" r="3.5" className="fill" />
    </>
  ),
  // a loop with a stop gate and a pointing hand
  agents: (
    <>
      <path d="M46 50 a34 34 0 1 1 68 0" />
      <path d="M114 50 a34 34 0 0 1 -52 30" />
      <path d="M106 42 L114 50 L122 42" />
      <path d="M62 80 L52 82 L58 72" />
      <rect x="70" y="40" width="20" height="20" rx="4" />
      <path d="M74 50 L86 50 M80 44 L80 56" className="thin" />
      <path d="M20 74 L38 74 M20 82 L32 82" className="thin dash" />
      <circle cx="80" cy="16" r="3" className="fill" />
    </>
  ),
  // a document with a round stamp
  policy: (
    <>
      <rect x="40" y="14" width="66" height="76" rx="6" />
      <path d="M52 32 L94 32 M52 44 L94 44 M52 56 L80 56 M52 68 L74 68" className="thin" />
      <circle cx="108" cy="70" r="18" />
      <circle cx="108" cy="70" r="12" className="dash thin" />
      <path d="M100 70 L106 76 L118 62" />
      <circle cx="108" cy="70" r="18" className="fill" />
    </>
  ),
  // rising bars with a cloud of spend above
  industry: (
    <>
      <path d="M24 84 L136 84" />
      <rect x="34" y="60" width="16" height="24" rx="3" />
      <rect x="58" y="48" width="16" height="36" rx="3" className="fill" />
      <rect x="58" y="48" width="16" height="36" rx="3" />
      <rect x="82" y="36" width="16" height="48" rx="3" />
      <rect x="106" y="22" width="16" height="62" rx="3" />
      <path d="M30 30 c-6 -12 12 -20 20 -10 c6 -12 22 -8 20 4 c10 0 10 14 0 14 L34 38 c-8 0 -10 -6 -4 -8" className="thin" />
      <path d="M34 54 L54 42 L78 34 L102 20" className="thin dash" />
    </>
  ),
  // magnifier over a lattice of points
  research: (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <circle key={`${r}-${c}`} cx={40 + c * 24} cy={30 + r * 22} r="2.6" className="fill" />
        )),
      )}
      <path d="M40 30 L64 52 L88 30 L112 52 M40 74 L64 52 M88 74 L112 52" className="thin" />
      <circle cx="96" cy="50" r="22" />
      <path d="M112 66 L134 88" />
      <path d="M84 44 a12 12 0 0 1 10 -8" className="thin" />
    </>
  ),
  // open book with a bookmark
  learn: (
    <>
      <path d="M22 26 C46 16 66 20 80 30 C94 20 114 16 138 26 L138 84 C114 74 94 78 80 88 C66 78 46 74 22 84 Z" />
      <path d="M80 30 L80 88" />
      <path d="M34 40 L66 34 M34 52 L66 46 M34 64 L60 60 M94 34 L126 40 M94 46 L126 52" className="thin" />
      <path d="M104 26 L104 56 L110 50 L116 56 L116 28" className="fill" />
      <path d="M104 26 L104 56 L110 50 L116 56 L116 28" />
    </>
  ),
  // a waveform collapsing into one line
  signal: (
    <>
      <path d="M16 50 L30 50 L38 26 L48 74 L58 34 L68 66 L78 44 L88 56 L98 48 L110 52 L144 50" />
      <path d="M16 62 L60 62 L70 78 L80 46 L92 68 L104 58 L144 60" className="thin dash" />
      <circle cx="144" cy="50" r="3.5" className="fill" />
    </>
  ),
}
