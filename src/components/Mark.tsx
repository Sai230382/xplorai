/** Inner glyph only. The nav plate, tilt, and ink shadow stay in CSS. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M16 16 L48 48" stroke="#f4f1ea" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M48 16 L16 48" stroke="#f4f1ea" strokeWidth="8.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="7.2" fill="#d4bf8a" stroke="#14121c" strokeWidth="2.8" />
    </svg>
  )
}
