import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { featuredModule } from "../data/learn"
import { Reveal } from "./Reveal"
import { Sketch } from "./Sketch"

const stepSketch = ["learn", "research", "policy", "agents", "signal"] as const

export function ContinueLearning() {
  const [done, setDone] = useState<string[]>([])
  const countRef = useRef<HTMLSpanElement>(null)
  const shown = useRef({ value: 0 })

  const total = featuredModule.steps.length
  const percent = Math.round((done.length / total) * 100)
  const minutesLeft = featuredModule.steps
    .filter((step) => !done.includes(step.id))
    .reduce((sum, step) => sum + step.minutes, 0)

  // Count the big number toward the real completion state.
  useEffect(() => {
    const node = countRef.current
    if (!node) return
    const tween = gsap.to(shown.current, {
      value: percent,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        node.textContent = String(Math.round(shown.current.value))
      },
    })
    return () => {
      tween.kill()
    }
  }, [percent])

  function toggle(id: string) {
    setDone((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const status = done.length === 0 ? "Not started" : done.length === total ? "Complete" : `${done.length} of ${total} steps`

  return (
    <section id="learn" className="cr" aria-labelledby="learn-title">
      <div className="split">
        <div className="left">
          <div className="head-chip">
            <span>AI Academy</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <span className="bubble">{status}</span>
            <span className="bubble lav">{minutesLeft} min left</span>
          </div>

          <div className="count" aria-live="polite" aria-label={`${percent} percent complete`}>
            <span ref={countRef}>0</span>
            <span className="pct">%</span>
          </div>
          <div className="count-lbl">Module completion</div>

          <p className="eyebrow" style={{ marginTop: 28, color: "var(--peri)" }}>
            {featuredModule.kicker}
          </p>
          <h2 id="learn-title" className="section-title" style={{ marginTop: 10 }}>
            {featuredModule.title}
          </h2>
          <p className="section-body">{featuredModule.dek}</p>

          <ul className="meta-list">
            <li>
              <span>Time</span>
              {featuredModule.time}
            </li>
            <li>
              <span>Level</span>
              {featuredModule.difficulty}
            </li>
            <li>
              <span>Outcome</span>
              {featuredModule.outcome}
            </li>
          </ul>

          <div className="tools">
            {featuredModule.tools.map((tool) => (
              <p key={tool.name}>
                <strong>{tool.name}.</strong> {tool.use}
              </p>
            ))}
          </div>
        </div>

        <Reveal className="cards" selector=".crcard">
          {featuredModule.steps.map((step, index) => {
            const complete = done.includes(step.id)
            return (
              <article key={step.id} className={complete ? "crcard is-done" : "crcard"}>
                <div className="cov">
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <Sketch kind={stepSketch[index % stepSketch.length]} />
                  <span className="tag tag-gold">{step.minutes} min</span>
                </div>
                <div className="meta">
                  <div>
                    <div className="chap">
                      Step {index + 1} of {total} · {featuredModule.diagram[index]?.label ?? "Practice"}
                    </div>
                    <h3 className="ttl">{step.title}</h3>
                    <p className="sub">{step.body}</p>
                  </div>
                  <div>
                    <p className="example">{step.example}</p>
                    <div className="bar-row">
                      <span>{complete ? "Done" : "Open"}</span>
                      <span>{complete ? "0 min left" : `${step.minutes} min`}</span>
                    </div>
                    <div className="track" role="presentation">
                      <div className="fill" style={{ ["--p" as string]: complete ? 1 : 0 }} />
                    </div>
                    <div className="acts">
                      <button
                        type="button"
                        className={complete ? "btn gold sm" : "btn peri sm"}
                        aria-pressed={complete}
                        aria-label={`${complete ? "Mark incomplete" : "Mark complete"}: ${step.title}`}
                        onClick={() => toggle(step.id)}
                      >
                        {complete ? "Completed ✓" : "Mark complete"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
