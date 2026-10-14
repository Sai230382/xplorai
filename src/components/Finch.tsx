/** Painted finch. The card hangs from the feet, so nothing is tied above the bird. */
export function Finch({ tone }: { tone: "rules" | "money" | "learn" }) {
  const id = `finch-${tone}`
  const body = tone === "money" ? "#34377f" : "#24265e"
  const bodyDeep = tone === "money" ? "#24265e" : "#1a1c42"
  const wingHi = tone === "money" ? "#e4dcff" : tone === "learn" ? "#c4b4ff" : "#9aa6f2"
  const wing = tone === "money" ? "#c4b4ff" : tone === "learn" ? "#7d8ef0" : "#5c6de0"
  const belly = tone === "money" ? "#f4f1ea" : "#e4dcff"

  return (
    <span className={`fly fly-bird tone-${tone}`}>
      <svg className="finch" viewBox="0 0 240 180" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor={wingHi} />
            <stop offset="28%" stopColor={body} />
            <stop offset="100%" stopColor={bodyDeep} />
          </radialGradient>
          <radialGradient id={`${id}-head`} cx="40%" cy="36%" r="68%">
            <stop offset="0%" stopColor={wingHi} />
            <stop offset="42%" stopColor={body} />
            <stop offset="100%" stopColor={bodyDeep} />
          </radialGradient>
          <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={wingHi} />
            <stop offset="48%" stopColor={wing} />
            <stop offset="100%" stopColor={body} />
          </linearGradient>
          <linearGradient id={`${id}-beak`} x1="0" y1="1" x2="0.2" y2="0">
            <stop offset="0%" stopColor="#a8643a" />
            <stop offset="55%" stopColor="#d49262" />
            <stop offset="100%" stopColor="#f0c39a" />
          </linearGradient>
        </defs>

        <g className="bird-tail">
          <path d="M86 112 C42 98 16 112 22 132 C52 126 74 122 90 116 Z" fill={bodyDeep} />
          <path d="M90 122 C40 128 14 154 34 166 C62 154 82 140 96 128 Z" fill={body} />
          <path d="M84 104 C46 84 22 86 26 104 C50 100 70 104 90 112 Z" fill={wing} />
        </g>

        <g className="bird-wing bird-wing-far">
          <path
            className="bird-wing-shape"
            d="M156 108 C186 92 220 74 228 92 C218 116 186 132 158 122 C150 118 150 112 156 108 Z"
            fill={`url(#${id}-wing)`}
          />
          <path className="bird-wing-line" d="M168 108 C190 100 210 96 222 100" />
          <path className="bird-wing-line" d="M164 116 C188 112 208 112 220 116" />
        </g>

        <ellipse className="bird-body" cx="132" cy="118" rx="54" ry="38" fill={`url(#${id}-body)`} />
        <ellipse className="bird-belly" cx="142" cy="128" rx="30" ry="18" fill={belly} />

        <g className="bird-wing bird-wing-near">
          <path
            className="bird-wing-shape"
            d="M118 112 C78 102 46 74 56 48 C78 36 118 46 146 74 C164 94 150 118 124 122 C112 118 112 114 118 112 Z"
            fill={`url(#${id}-wing)`}
          />
          <path className="bird-wing-line" d="M70 62 C98 70 124 86 142 102" />
          <path className="bird-wing-line" d="M64 78 C96 84 122 98 140 112" />
          <path className="bird-wing-line" d="M78 52 C104 58 126 70 140 84" />
        </g>

        <circle className="bird-head" cx="162" cy="70" r="28" fill={`url(#${id}-head)`} />
        <ellipse className="bird-cheek" cx="150" cy="80" rx="8" ry="5.5" fill="#e7b08a" />
        <circle cx="172" cy="66" r="4.4" fill="#14121c" />
        <circle cx="173.6" cy="64.4" r="1.5" fill="#f4f1ea" />

        <path
          className="bird-beak"
          d="M150 58 C156 34 164 18 174 16 C184 18 188 36 182 58 C172 52 160 52 150 58 Z"
          fill={`url(#${id}-beak)`}
        />
        <path className="bird-beak-inner" d="M160 52 C166 36 172 28 176 26 C180 34 178 48 170 52 Z" />

        <path className="bird-feet" d="M118 150 C112 162 104 166 110 168 M122 152 C118 164 126 168 132 166" />
        <path className="bird-feet" d="M108 166 C114 164 118 166 116 170 M128 166 C134 164 138 168 134 172" />
      </svg>
    </span>
  )
}
