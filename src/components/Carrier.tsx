import { useState } from "react"

function LegacyButterfly() {
  return (
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
  )
}

/** Painted sprite, split into wing halves that rotate on Y around the body. */
export function ButterflyCarrier({ src }: { src: string }) {
  const [ready, setReady] = useState(false)

  return (
    <>
      {ready ? null : <LegacyButterfly />}
      <span className="fly fly-butterfly" hidden={!ready} aria-hidden="true">
        <span className="sprite-wing sprite-wing-l">
          <img
            src={src}
            alt=""
            draggable={false}
            onLoad={() => setReady(true)}
            onError={() => setReady(false)}
          />
        </span>
        <span className="sprite-wing sprite-wing-r">
          <img src={src} alt="" draggable={false} onError={() => setReady(false)} />
        </span>
      </span>
    </>
  )
}

const WING_TONES = {
  rules: { upper: "#5c6de0", lower: "#24265e", spot: "#c4b4ff", edge: "#f4f1ea" },
  money: { upper: "#c4b4ff", lower: "#5c6de0", spot: "#f4f1ea", edge: "#24265e" },
  learn: { upper: "#f4f1ea", lower: "#8b9bff", spot: "#5c6de0", edge: "#24265e" },
} as const

function WingShapes({
  variant,
  tone,
}: {
  variant: "round" | "long"
  tone: "rules" | "money" | "learn"
}) {
  const { upper, lower, spot, edge } = WING_TONES[tone]
  if (variant === "long") {
    return (
      <>
        <path
          fill={upper}
          stroke={edge}
          strokeWidth="1.1"
          d="M96 44 C74 8 34 2 14 26 C2 40 10 56 30 56 C54 56 78 50 96 48 Z"
        />
        <path
          fill={lower}
          stroke={edge}
          strokeWidth="1.1"
          d="M96 52 C74 60 42 66 24 84 C12 100 18 116 34 114 C50 112 60 98 70 84 C82 70 90 62 96 56 Z"
        />
        <circle cx="34" cy="36" r="4.2" fill={spot} />
        <circle cx="48" cy="44" r="2.6" fill={spot} />
        <circle cx="36" cy="96" r="3.4" fill={spot} />
        <path className="vein" d="M94 46 C68 28 36 22 16 30" />
        <path className="vein" d="M94 50 C66 48 38 52 22 64" />
        <path className="vein" d="M92 58 C68 78 42 102 28 124" />
      </>
    )
  }
  return (
    <>
      <path
        fill={upper}
        stroke={edge}
        strokeWidth="1.1"
        d="M96 46 C80 16 46 6 22 22 C8 34 8 56 26 66 C48 78 76 66 96 52 Z"
      />
      <path
        fill={lower}
        stroke={edge}
        strokeWidth="1.1"
        d="M96 56 C76 66 44 74 24 96 C12 114 30 124 48 114 C70 102 88 80 96 64 Z"
      />
      <circle cx="34" cy="40" r="5" fill={spot} />
      <circle cx="52" cy="48" r="3" fill={spot} />
      <circle cx="38" cy="90" r="4.2" fill={spot} />
      <path className="vein" d="M94 48 C68 36 38 30 22 26" />
      <path className="vein" d="M94 52 C66 54 40 60 26 74" />
      <path className="vein" d="M92 60 C68 78 44 98 32 112" />
    </>
  )
}

/** Until bird sprites publish, the card is carried by a butterfly with its own wing shape. */
function ButterflyStandIn({
  tone,
  variant,
}: {
  tone: "rules" | "money" | "learn"
  variant: "round" | "long"
}) {
  return (
    <span className={`fly fly-variant variant-${variant}`} aria-hidden="true">
      <span className="wing wing-l">
        <svg viewBox="0 0 100 120">
          <WingShapes variant={variant} tone={tone} />
        </svg>
      </span>
      <span className="wing wing-r">
        <svg viewBox="0 0 100 120">
          <g transform="translate(100 0) scale(-1 1)">
            <WingShapes variant={variant} tone={tone} />
          </g>
        </svg>
      </span>
      <span className="thorax" />
      <span className="antennae" />
    </span>
  )
}

/** Painted bird sprite. A gentle bob and tilt stand in for the wing beat. */
export function BirdCarrier({
  src,
  tone,
  variant = "round",
}: {
  src: string
  tone: "rules" | "money" | "learn"
  variant?: "round" | "long"
}) {
  const [ready, setReady] = useState(false)

  return (
    <>
      {ready ? null : <ButterflyStandIn tone={tone} variant={variant} />}
      <span className="fly fly-bird fly-bird-sprite" hidden={!ready} aria-hidden="true">
        <img
          src={src}
          alt=""
          draggable={false}
          onLoad={() => setReady(true)}
          onError={() => setReady(false)}
        />
      </span>
    </>
  )
}
