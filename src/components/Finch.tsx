/** Painted finch. The leash mark is where the hanging string meets the beak. */
export function Finch({ tone }: { tone: "rules" | "money" | "learn" }) {
  return (
    <span className={`fly fly-bird tone-${tone}`}>
      <svg className="finch" viewBox="0 0 120 96" aria-hidden="true">
        <path
          className="bird-tail"
          d="M36 60 C16 52 6 40 7 32 C12 46 10 64 26 72 C32 68 35 64 36 60Z"
        />
        <ellipse className="bird-body" cx="58" cy="64" rx="28" ry="18" />
        <ellipse className="bird-belly" cx="66" cy="70" rx="15" ry="9" />
        <g className="bird-wing">
          <path
            className="bird-wing-shape"
            d="M46 60 C36 34 64 24 82 40 C72 54 58 64 44 62Z"
          />
          <path className="bird-wing-line" d="M50 52 C60 42 72 40 78 46" />
        </g>
        <circle className="bird-head" cx="86" cy="42" r="14" />
        <circle className="bird-cheek" cx="80" cy="48" r="4.5" />
        <circle cx="90" cy="40" r="2.15" fill="#14121c" />
        <circle cx="90.7" cy="39.3" r="0.7" fill="#f4f1ea" />
        <path className="bird-beak" d="M92 32 L108 12 L84 34Z" />
        <path className="bird-beak-inner" d="M92 33 L104 20 L86 35Z" />
        <path className="bird-feet" d="M50 80 L44 92 M54 81 L54 93 M60 80 L66 91" />
      </svg>
      <span className="string-knot" />
    </span>
  )
}
