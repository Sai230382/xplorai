import { useLayoutEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

gsap.registerPlugin(ScrollTrigger)

type RevealProps = {
  children: ReactNode
  /** Elements matching this selector inside the wrapper are staggered. */
  selector?: string
  delay?: number
  className?: string
}

export function Reveal({ children, selector, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const node = ref.current
    if (!node || reduced) return

    const targets = selector ? gsap.utils.toArray<HTMLElement>(selector, node) : [node]
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 26, filter: "blur(6px)" })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        delay,
        ease: "power3.out",
        stagger: 0.12,
        // Hand transforms back to CSS so hover states on the children still work.
        onComplete: () => gsap.set(targets, { clearProps: "transform,filter,opacity" }),
        scrollTrigger: {
          trigger: node,
          start: "top 82%",
          once: true,
        },
      })
    }, node)

    return () => ctx.revert()
  }, [selector, delay, reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
