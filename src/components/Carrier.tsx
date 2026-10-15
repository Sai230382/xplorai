/** Painted sprite, split into wing halves that rotate on Y around the body. */
export function ButterflyCarrier({ src }: { src: string }) {
  return (
    <span className="fly fly-butterfly" aria-hidden="true">
      <span className="sprite-wing sprite-wing-l">
        <img src={src} alt="" draggable={false} />
      </span>
      <span className="sprite-wing sprite-wing-r">
        <img src={src} alt="" draggable={false} />
      </span>
    </span>
  )
}

/** Painted bird sprite. A gentle bob and tilt stand in for the wing beat. */
export function BirdCarrier({ src }: { src: string }) {
  return (
    <span className="fly fly-bird fly-bird-sprite" aria-hidden="true">
      <img src={src} alt="" draggable={false} />
    </span>
  )
}
