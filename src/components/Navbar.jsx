import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ThemeToggle } from './ThemeToggle'
import { profile, mailto } from '../data/profile'
import { Action } from './Action'
export const sectionOrder = [
  'hero',
  'about',
  'capabilities',
  'work',
  'experience',
  'signals',
  'stack',
  'building',
  'contact',
  'closing',
]
const items = [
  { label: 'About', id: 'about' },
  { label: 'Work', id: 'work' },
  { label: 'Experience', id: 'experience' },
  { label: 'Stack', id: 'stack' },
  { label: 'Contact', id: 'contact' },
]
export function Navbar({ active, dark, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const firstLink = useRef(null)
  // The active nav item is the last one whose section starts above the current section.
  const idx = sectionOrder.indexOf(active)
  let current = ''
  items.forEach((it) => {
    if (sectionOrder.indexOf(it.id) <= idx) current = it.id
  })
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) firstLink.current?.focus()
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a className="brand" href="#hero" data-cursor="button" aria-label={`${profile.name}, back to top`}>
          {profile.brand}
        </a>
        <nav aria-label="Primary" className="nav-links">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`nav-link ${current === it.id ? 'active' : ''}`}
              aria-current={current === it.id ? 'true' : undefined}
              data-cursor="button"
            >
              {it.label}
              {current === it.id && (
                <motion.span
                  layoutId="nav-ind"
                  className="nav-ind"
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.1, 1] }}
                />
              )}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'close' : 'menu'}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="menu-overlay" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {items.map((it, i) => (
            <a
              key={it.id}
              ref={i === 0 ? firstLink : undefined}
              href={`#${it.id}`}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              {it.label}
            </a>
          ))}
        </nav>
        <ul className="menu-social" aria-label="Elsewhere">
          <li>
            <Action variant="text" icon="github" href={profile.links.github}>
              GitHub
            </Action>
          </li>
          <li>
            <Action variant="text" icon="linkedin" href={profile.links.linkedin}>
              LinkedIn
            </Action>
          </li>
          <li>
            <Action variant="text" icon="mail" href={mailto(profile.links.email)}>
              Email
            </Action>
          </li>
        </ul>
      </div>
    </header>
  )
}
