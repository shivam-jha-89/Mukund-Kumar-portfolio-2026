import { Icon } from './Icon'

/**
 * A link styled as a button. When `href` is empty it renders a clearly marked,
 * non-clickable placeholder instead of a dead link.
 */
export function Action({
  href,
  children,
  variant = 'primary',
  arrow = false,
  icon,
  pendingNote = 'link pending',
}) {
  const cls = `action action-${variant}`
  const inner = (
    <>
      {icon && <Icon name={icon} size={variant === 'text' ? 16 : 18} />}
      {children}
    </>
  )
  if (!href) {
    return (
      <span className={`${cls} is-pending`} aria-disabled="true" title="This link has not been added yet">
        {inner}
        {variant !== 'text' && <small className="pending-tag">{pendingNote}</small>}
      </span>
    )
  }
  const external = /^https?:/.test(href)
  return (
    <a
      className={cls}
      href={href}
      data-cursor={external ? 'open' : 'button'}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {inner}
      {arrow && (
        <span className="arrow" aria-hidden="true">
          →
        </span>
      )}
    </a>
  )
}
