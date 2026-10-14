export function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="xwing-upper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#24265e" />
          <stop offset="58%" stopColor="#5161d4" />
          <stop offset="100%" stopColor="#c4b4ff" />
        </linearGradient>
        <linearGradient id="xwing-lower" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1b1c48" />
          <stop offset="65%" stopColor="#5161d4" />
          <stop offset="100%" stopColor="#e6dfff" />
        </linearGradient>
      </defs>

      {/* Left X-Wing (Forewing + Hindwing forming left half of X) */}
      <g className="xmark-wing xmark-wing-l">
        <path
          d="M 31 31 C 24 17 14 7 5 9 C 2 10 3 19 10 26 C 16 31 24 32 31 32 Z"
          fill="url(#xwing-upper)"
        />
        <path
          d="M 31 33 C 23 34 14 38 8 46 C 4 52 7 57 13 55 C 21 52 27 42 31 34 Z"
          fill="url(#xwing-lower)"
        />
        <path
          d="M 30 31 C 21 23 13 16 6 13 M 30 34 C 22 40 15 47 10 53"
          stroke="#f4f1ea"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.72"
        />
      </g>

      {/* Right X-Wing (Forewing + Hindwing forming right half of X) */}
      <g className="xmark-wing xmark-wing-r">
        <path
          d="M 33 31 C 40 17 50 7 59 9 C 62 10 61 19 54 26 C 48 31 40 32 33 32 Z"
          fill="url(#xwing-upper)"
        />
        <path
          d="M 33 33 C 41 34 50 38 56 46 C 60 52 57 57 51 55 C 43 52 37 42 33 34 Z"
          fill="url(#xwing-lower)"
        />
        <path
          d="M 34 31 C 43 23 51 16 58 13 M 34 34 C 42 40 49 47 54 53"
          stroke="#f4f1ea"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.72"
        />
      </g>

      {/* Delicate Antennae & Central Thorax */}
      <path
        d="M 31.3 22 C 29 15 24 10 19 9 M 32.7 22 C 35 15 40 10 45 9"
        stroke="#14121c"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="18.8" cy="9" r="1.4" fill="#24265e" />
      <circle cx="45.2" cy="9" r="1.4" fill="#24265e" />
      <rect x="30.4" y="20" width="3.2" height="24" rx="1.6" fill="#14121c" />
    </svg>
  )
}
