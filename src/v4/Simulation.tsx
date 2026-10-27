import { useId, useState } from "react"
import type { EditionStory } from "../data/edition"
import {
  activeSimulation,
  evaluateFormula,
  formatResultWithUnit,
  type CalcInput,
  type CalculatorWidget,
  type CompareWidget,
  type SimulationWidget,
  type StepperWidget,
} from "../data/simulation"

type Props = {
  onOpenStory: (story: EditionStory) => void
}

function Stats({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <dl className="v4-sim-stats">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function ChoiceGroup({
  label,
  name,
  options,
  selected,
  onSelect,
}: {
  label: string
  name: string
  options: { id: string; label: string }[]
  selected: string
  onSelect: (id: string) => void
}) {
  const labelId = useId()
  return (
    <div className="v4-sim-control">
      <p id={labelId} className="v4-sim-control-label">
        {label}
      </p>
      <div className="v4-sim-choices" role="radiogroup" aria-labelledby={labelId}>
        {options.map((option) => (
          <label className="v4-sim-choice" key={option.id}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function Stepper({ widget }: { widget: StepperWidget }) {
  const [index, setIndex] = useState(0)
  const inputId = useId()
  const item = widget.items[index] ?? widget.items[0]
  const max = widget.items.length - 1

  return (
    <div className="v4-sim-grid">
      <div className="v4-sim-controls">
        <label className="v4-sim-control-label" htmlFor={inputId}>
          {widget.label}
        </label>
        <input
          id={inputId}
          className="v4-sim-range"
          type="range"
          min={0}
          max={max}
          step={1}
          value={index}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={index}
          aria-valuetext={`${item.name}, ${index + 1} of ${widget.items.length}`}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
        <div className="v4-sim-marks" aria-hidden="true">
          {widget.items.map((mark, markIndex) => (
            <button
              key={`${mark.label}-${markIndex}`}
              type="button"
              tabIndex={-1}
              aria-pressed={markIndex === index}
              onClick={() => setIndex(markIndex)}
            >
              {mark.label}
            </button>
          ))}
        </div>
      </div>
      <div className="v4-sim-readout" aria-live="polite">
        <p className="v4-sim-readout-name">{item.name}</p>
        {item.caption ? <p className="v4-sim-caption">{item.caption}</p> : null}
        <Stats stats={item.stats} />
      </div>
    </div>
  )
}

function sliderValue(input: CalcInput, raw: string) {
  const next = Number(raw)
  if (!Number.isFinite(next)) return input.value
  return Math.min(input.max, Math.max(input.min, next))
}

function Calculator({ widget }: { widget: CalculatorWidget }) {
  const baseId = useId()
  const [values, setValues] = useState(() => Object.fromEntries(widget.inputs.map((input) => [input.id, input.value])))
  const [toggleId, setToggleId] = useState(widget.toggle?.options[0].id ?? "")
  const multiplier = widget.toggle?.options.find((option) => option.id === toggleId)?.multiplier ?? 1
  const raw = evaluateFormula(widget.formula, values)
  const result = raw === null ? null : raw * multiplier
  const shown = result === null ? "—" : formatResultWithUnit(result, widget.result.unit, widget.result.decimals)

  return (
    <div className="v4-sim-grid">
      <div className="v4-sim-controls">
        {widget.inputs.map((input) => {
          const fieldId = `${baseId}-${input.id}`
          const display = input.unit ? `${values[input.id]} ${input.unit}` : String(values[input.id])
          return (
            <div className="v4-sim-field" key={input.id}>
              <div className="v4-sim-field-top">
                <label htmlFor={fieldId}>{input.label}</label>
                {input.control === "slider" ? <output htmlFor={fieldId}>{display}</output> : null}
              </div>
              {input.control === "number" ? (
                <input
                  id={fieldId}
                  className="v4-sim-number"
                  type="number"
                  inputMode="decimal"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={values[input.id]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [input.id]: sliderValue(input, event.target.value) }))
                  }
                />
              ) : (
                <input
                  id={fieldId}
                  className="v4-sim-range"
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={values[input.id]}
                  aria-valuetext={display}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [input.id]: sliderValue(input, event.target.value) }))
                  }
                />
              )}
            </div>
          )
        })}
        {widget.toggle ? (
          <ChoiceGroup
            label={widget.toggle.label}
            name={`${baseId}-toggle`}
            options={widget.toggle.options}
            selected={toggleId}
            onSelect={setToggleId}
          />
        ) : null}
      </div>
      <div className="v4-sim-readout">
        <p className="v4-sim-result" aria-live="polite">
          <span className="v4-sim-result-label">{widget.result.label}</span>
          <strong>{shown}</strong>
        </p>
      </div>
    </div>
  )
}

function Compare({ widget }: { widget: CompareWidget }) {
  const name = useId()
  const [selected, setSelected] = useState(widget.options[0].id)
  const option = widget.options.find((item) => item.id === selected) ?? widget.options[0]
  const summary = `${option.label}. ${option.stats.map((stat) => `${stat.label} ${stat.value}`).join(". ")}.`

  return (
    <div className="v4-sim-grid">
      <div className="v4-sim-controls">
        <ChoiceGroup
          label={widget.label}
          name={name}
          options={widget.options}
          selected={selected}
          onSelect={setSelected}
        />
        {option.caption ? <p className="v4-sim-caption">{option.caption}</p> : null}
      </div>
      <div className="v4-sim-readout">
        <p className="sr-only" aria-live="polite">
          {summary}
        </p>
        <Stats stats={option.stats} />
      </div>
    </div>
  )
}

function Widget({ widget }: { widget: SimulationWidget }) {
  if (widget.type === "stepper") return <Stepper widget={widget} />
  if (widget.type === "calculator") return <Calculator widget={widget} />
  return <Compare widget={widget} />
}

/** Interactive lead for one story in today's edition. Renders nothing when the file does not apply. */
export function StorySimulation({ onOpenStory }: Props) {
  const active = activeSimulation()
  if (!active) return null
  const { simulation, story } = active

  return (
    <section className="v4-sim" aria-labelledby="v4-sim-title" data-sim-widget={simulation.widget.type}>
      <p className="v4-cap">{simulation.kicker}</p>
      <h3 id="v4-sim-title">{simulation.title}</h3>
      <p className="v4-sim-intro">{simulation.intro}</p>
      <Widget widget={simulation.widget} />
      <p className="v4-sim-note">{simulation.note}</p>
      <ul className="v4-sim-sources">
        {simulation.sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="v4-text-link" onClick={() => onOpenStory(story)}>
        Full story and action steps <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
