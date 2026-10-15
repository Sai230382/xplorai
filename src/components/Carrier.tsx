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

/** Higgsfield butterfly, split so each wing folds toward the body. */
export function PaintedButterfly({ src }: { src: string }) {
  return (
    <span className="critter-flutter">
      <span className="critter-wing critter-wing-l">
        <img src={src} alt="" draggable={false} />
      </span>
      <span className="critter-wing critter-wing-r">
        <img src={src} alt="" draggable={false} />
      </span>
    </span>
  )
}

/** Higgsfield bird. The parent banks; this sprite only beats its wings now and then. */
export function PaintedBird({ src }: { src: string }) {
  return <img className="critter-bird" src={src} alt="" draggable={false} />
}
