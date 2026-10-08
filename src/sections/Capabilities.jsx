import { useState } from 'react'
import { SectionLabel } from '../components/SectionLabel'
import { RevealLines } from '../components/Reveal'
import { capabilities } from '../data/skills'
export function Capabilities() {
  const [open, setOpen] = useState(0)
  return (
    <section id="capabilities" className="section alt">
      <div className="container">
        <div className="ed-grid">
          <div className="ed-label">
            <SectionLabel>what i build</SectionLabel>
          </div>
          <div className="ed-main">
            <RevealLines className="h-lg" lines={['Systems, models and', 'the interfaces around them.']} />
          </div>
        </div>
        <ul className="cap-list">
          {capabilities.map((c, i) => (
            <li
              key={c.title}
              className={`cap ${open === i ? 'open' : ''}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}
            >
              <h3>
                <button
                  type="button"
                  className="cap-btn"
                  aria-expanded={open === i}
                  aria-controls={`cap-${i}`}
                  onClick={() => setOpen(i)}
                  data-cursor="button"
                >
                  <span className="cap-num mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cap-title">{c.title}</span>
                </button>
              </h3>
              <div className="cap-panel" id={`cap-${i}`} role="region" aria-label={c.title}>
                <div className="cap-inner">
                  <p className="cap-body">{c.body}</p>
                  <ul className="cap-tags mono">
                    {c.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
