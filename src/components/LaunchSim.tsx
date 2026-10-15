import { useEffect, useRef, useState } from "react"
import type { RadarLaunchDemo } from "../data/radar"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function LaunchSim({ demo }: { demo: RadarLaunchDemo }) {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const [replay, setReplay] = useState(0)
  const [typed, setTyped] = useState(0)
  const [shownSteps, setShownSteps] = useState(0)
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    if (reduced) return
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  useEffect(() => {
    if (reduced || !seen) return
    let cancelled = false

    async function run() {
      await wait(16)
      if (cancelled) return
      setTyped(0)
      setShownSteps(0)
      setShowOutput(false)
      await wait(220)
      for (let count = 1; count <= demo.input.length; count += 1) {
        if (cancelled) return
        setTyped(count)
        await wait(26)
      }
      for (let index = 0; index < demo.steps.length; index += 1) {
        if (cancelled) return
        await wait(520)
        setShownSteps(index + 1)
      }
      if (cancelled) return
      await wait(360)
      setShowOutput(true)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [seen, replay, reduced, demo])

  const inputText = reduced ? demo.input : demo.input.slice(0, typed)
  const steps = reduced ? demo.steps : demo.steps.slice(0, shownSteps)
  const outputOn = reduced || showOutput
  const typing = !reduced && seen && typed < demo.input.length

  return (
    <div className="launch-sim glass-card" ref={rootRef}>
      <p className="launch-sim-label">Illustrative example, not the actual product UI</p>
      <div className="launch-sim-stage">
        <div className="launch-sim-input">
          <span className="desk">Example</span>
          <p>
            {inputText}
            {typing ? <span className="launch-sim-caret" aria-hidden="true" /> : null}
          </p>
        </div>
        {steps.length ? (
          <ol className="launch-sim-steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        {outputOn ? (
          <div className="launch-sim-output">
            <span className="desk">Result</span>
            <p>{demo.output}</p>
          </div>
        ) : null}
      </div>
      {reduced ? null : (
        <button
          type="button"
          className="launch-sim-replay"
          onClick={() => {
            setSeen(true)
            setReplay((count) => count + 1)
          }}
        >
          Replay
        </button>
      )}
    </div>
  )
}
