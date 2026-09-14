import type { CSSProperties } from "react"

type MisprintProps = {
  text: string
  as?: "h1" | "h2" | "h3" | "h4" | "span"
  id?: string
  className?: string
  style?: CSSProperties
  /** Sentence case, same gold / periwinkle ghosts. Use for long headlines. */
  quiet?: boolean
}

/** Display heading with offset periwinkle / gold ghost layers, like an over‑inked print. */
export function Misprint({ text, as = "h2", id, className, style, quiet = false }: MisprintProps) {
  const Tag = as
  const classes = ["misprint", quiet ? "is-quiet" : "", className].filter(Boolean).join(" ")
  return (
    <Tag id={id} className={classes} style={style}>
      {text}
      <span aria-hidden="true" className="ghost a">
        {text}
      </span>
      <span aria-hidden="true" className="ghost b">
        {text}
      </span>
    </Tag>
  )
}
