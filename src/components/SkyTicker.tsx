import { Fragment } from "react"

function PhraseSet({ phrases, hidden }: { phrases: string[]; hidden?: boolean }) {
  return (
    <div className="sky-lane-set" aria-hidden={hidden ? true : undefined}>
      {phrases.map((phrase, index) => (
        <Fragment key={`${phrase}-${index}`}>
          {index > 0 ? (
            <span className="sky-gap" aria-hidden="true">
              ·
            </span>
          ) : null}
          <span className="sky-phrase">{phrase}</span>
        </Fragment>
      ))}
    </div>
  )
}

function Lane({ id, phrases }: { id: "far" | "near"; phrases: string[] }) {
  return (
    <div className={`sky-lane sky-lane-${id}`}>
      <div className="sky-lane-track">
        <PhraseSet phrases={phrases} />
        <PhraseSet phrases={phrases} hidden />
      </div>
    </div>
  )
}

export function SkyTicker({
  far,
  near,
  mobile,
  reduced,
  variant = "hero",
}: {
  far: string[]
  near: string[]
  mobile: string[]
  reduced: boolean
  variant?: "hero" | "mobile"
}) {
  const spoken = (variant === "mobile" ? mobile : [...near, ...far]).filter(
    (phrase, index, all) => all.indexOf(phrase) === index,
  )
  const staticLine = spoken.slice(0, 3)

  if (reduced) {
    return (
      <p className={`sky-ticker is-static sky-ticker-${variant}`}>
        <span className="sr-only">Today. </span>
        {staticLine.join("  ·  ")}
      </p>
    )
  }

  return (
    <div className={`sky-ticker sky-ticker-${variant}`}>
      <p className="sr-only">{spoken.join(". ")}</p>
      <div className="sky-lanes" aria-hidden="true">
        {variant === "hero" ? <Lane id="far" phrases={far} /> : null}
        <Lane id="near" phrases={variant === "mobile" ? mobile : near} />
      </div>
    </div>
  )
}
