export function SectionLabel({ children }) {
  return (
    <p className="label">
      <span aria-hidden="true">{'// '}</span>
      {children}
    </p>
  )
}
