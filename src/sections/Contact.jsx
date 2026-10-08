import { useEffect, useState } from 'react'
import { SectionLabel } from '../components/SectionLabel'
import { RevealLines } from '../components/Reveal'
import { Icon } from '../components/Icon'
import { profile, mailto, display } from '../data/profile'

const { links } = profile

/** One row per channel. Rows with no link yet show as pending; optional rows are hidden until set. */
const channels = [
  {
    key: 'email',
    label: 'Email',
    icon: 'mail',
    href: mailto(links.email),
    value: links.email,
    pending: 'add email in data/profile.js',
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: 'github',
    href: links.github,
    value: display(links.github),
    pending: 'add link in data/profile.js',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: 'linkedin',
    href: links.linkedin,
    value: display(links.linkedin),
    pending: 'add link in data/profile.js',
  },
  {
    key: 'leetcode',
    label: 'LeetCode',
    icon: 'code',
    href: links.leetcode,
    value: display(links.leetcode),
    optional: true,
  },
  {
    key: 'resume',
    label: 'Resume',
    icon: 'file',
    href: links.resume,
    value: links.resume && 'Download PDF',
    optional: true,
  },
].filter((c) => !c.optional || c.href)

function CopyEmail({ email }) {
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!done) return
    const t = window.setTimeout(() => setDone(false), 1800)
    return () => window.clearTimeout(t)
  }, [done])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setDone(true)
    } catch {
      /* clipboard can be blocked; the mailto link still works */
    }
  }
  return (
    <button
      type="button"
      className="copy-btn mono"
      onClick={copy}
      data-cursor="button"
      aria-label="Copy email address"
    >
      <Icon name={done ? 'check' : 'copy'} size={16} />
      <span aria-live="polite">{done ? 'copied' : 'copy'}</span>
    </button>
  )
}

function Row({ c }) {
  const live = Boolean(c.href)
  const body = (
    <>
      <span className="ch-icon">
        <Icon name={c.icon} size={22} />
      </span>
      <span className="ch-label">{c.label}</span>
      <span className="ch-value mono">{live ? c.value : c.pending}</span>
      <span className="ch-go" aria-hidden="true">
        {live && <Icon name="arrow" size={20} />}
      </span>
    </>
  )
  const external = live && /^https?:/.test(c.href)
  return (
    <li className={`channel ${live ? '' : 'is-pending'}`}>
      {live ? (
        <a
          className="channel-link"
          href={c.href}
          data-cursor={external ? 'open' : 'button'}
          {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        >
          {body}
        </a>
      ) : (
        <span className="channel-link" aria-disabled="true">
          {body}
        </span>
      )}
      {c.key === 'email' && live && <CopyEmail email={c.value} />}
    </li>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section alt">
      <div className="container ed-grid">
        <div className="ed-label">
          <SectionLabel>contact</SectionLabel>
        </div>
        <div className="ed-main">
          <RevealLines className="h-xl" lines={['Have something', 'worth building?', "Let's talk."]} />
          <p className="contact-text">
            Open to internships, engineering opportunities, collaborations and interesting technical problems.
          </p>
          <ul className="channels" aria-label="Ways to reach me">
            {channels.map((c) => (
              <Row key={c.key} c={c} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
