import { currentEdition } from "../data/edition"
import { radarPulse } from "../data/radar"
import { shortDate, splitLaunchName } from "./format"

export function Radar() {
  const pulse = currentEdition.toolsPulseDate ?? radarPulse.week

  return (
    <section id="tools" className="v4-section v4-radar" aria-labelledby="v4-radar-title">
      <img className="v4-radar-backdrop" src="/scenes/tools-market.jpg" alt="" loading="lazy" />
      <div className="v4-radar-wash" aria-hidden="true" />
      <div className="v4-radar-main">
        <header>
          <p className="v4-cap v4-cap-light">Tools radar · last pulse {shortDate(pulse)}</p>
          <h2 id="v4-radar-title">
            New tools worth a look,
            <br />
            before everyone else finds them
          </h2>
        </header>

        <ul className="v4-tools">
          {radarPulse.launches.map((launch) => {
            const { name, where, href } = splitLaunchName(launch.name)
            const why = launch.why.replace(/^Why it’s on our radar:\s*/u, "")
            return (
              <li key={launch.name} className="v4-tool">
                <div className="v4-tool-top">
                  <h3>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer">
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </h3>
                  <span className="v4-tool-where">
                    {where && `${where} · `}
                    {shortDate(launch.date)}
                  </span>
                </div>
                <p className="v4-tool-desc">{launch.desc}</p>
                <p className="v4-tool-why">
                  <span aria-hidden="true">✦</span> On our radar: {why}
                </p>
              </li>
            )
          })}
        </ul>

        <a className="v4-text-link v4-text-link-light" href="/tools">
          See every tool on the radar <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
