import { type ReactNode, useEffect, useRef } from "react"
import { currentEdition, type EditionStory } from "../data/edition"

type ModalProps = {
  title: string
  kicker: string
  onClose: () => void
  children: ReactNode
}

function Modal({ title, kicker, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className="v4-modal"
      aria-labelledby="v4-modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="v4-modal-inner">
        <div className="v4-modal-top">
          <p className="v4-cap">{kicker}</p>
          <button type="button" className="v4-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <h2 id="v4-modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}

export function StoryModal({ story, onClose }: { story: EditionStory; onClose: () => void }) {
  return (
    <Modal title={story.theme} kicker={`${currentEdition.edition} · ${story.topic}`} onClose={onClose}>
      <p className="v4-modal-for">For {story.audience.charAt(0).toLowerCase() + story.audience.slice(1)}</p>
      <h3>What changed</h3>
      <p>{story.changed}</p>
      <h3>Why it matters</h3>
      <p>{story.matters}</p>
      <h3>What it means for you</h3>
      <p>{story.imply}</p>
      {story.uses.length > 0 && (
        <>
          <h3>What to do</h3>
          <ul>
            {story.uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </>
      )}
      <h3>In practice</h3>
      <p>{story.example}</p>
      <h3>What to watch</h3>
      <p>{story.watch}</p>
      <blockquote>
        <p>“{story.source.quote}”</p>
        <a href={story.source.url} target="_blank" rel="noreferrer">
          {story.source.title} ↗
        </a>
      </blockquote>
    </Modal>
  )
}

export function NoteModal({ onClose }: { onClose: () => void }) {
  const e = currentEdition
  return (
    <Modal title={e.kicker} kicker={`${e.edition} · ${e.date}`} onClose={onClose}>
      <h3>The week in one paragraph</h3>
      <p>{e.summary}</p>
      <h3>What we’re still unsure about</h3>
      <p>{e.uncertainty}</p>
      {e.columns.watch.length > 0 && (
        <>
          <h3>What to watch next</h3>
          <ul>
            {e.columns.watch.map((item) => (
              <li key={item.title}>
                <strong>{item.title}.</strong> {item.body}
              </li>
            ))}
          </ul>
        </>
      )}
    </Modal>
  )
}
