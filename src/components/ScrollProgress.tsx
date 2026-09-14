import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let frame = 0

    const update = () => {
      frame = 0
      const doc = document.documentElement
      const travel = doc.scrollHeight - window.innerHeight
      const ratio = travel <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / travel))
      node.style.transform = `scaleX(${ratio})`
      node.setAttribute("aria-valuenow", String(Math.round(ratio * 100)))
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    update()

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="scroll-progress"
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  )
}
