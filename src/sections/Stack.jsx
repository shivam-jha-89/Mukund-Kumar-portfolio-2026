import { useState } from 'react'
import { SectionLabel } from '../components/SectionLabel'
import { RevealLines } from '../components/Reveal'
import { SkillSystem } from '../components/SkillSystem'
import { focus } from '../data/skills'
export function Stack() {
  return (
    <>
      <section id="stack" className="section">
        <div className="container ed-grid">
          <div className="ed-label">
            <SectionLabel>stack</SectionLabel>
          </div>
          <div className="ed-main">
            <RevealLines className="h-lg" lines={['What I build with,', 'and where it shows up.']} />
            <SkillSystem />
          </div>
        </div>
      </section>
      <Building />
    </>
  )
}
function Building() {
  const [id, setId] = useState(focus[0].id)
  const current = focus.find((f) => f.id === id) ?? focus[0]
  return (
    <section id="building" className="section alt">
      <div className="container ed-grid">
        <div className="ed-label">
          <SectionLabel>currently building</SectionLabel>
        </div>
        <div className="ed-main focus">
          <ul className="focus-list mono" aria-label="Focus areas">
            {focus.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className={id === f.id ? 'on' : ''}
                  aria-pressed={id === f.id}
                  onClick={() => setId(f.id)}
                  data-cursor="button"
                >
                  <span aria-hidden="true">{id === f.id ? '> ' : '  '}</span>--focus {f.cmd}
                </button>
              </li>
            ))}
          </ul>
          <div className="focus-out mono" key={current.id} aria-live="polite">
            <p className="cmd">$ Kumar --focus {current.cmd}</p>
            {current.lines.map((l, i) => (
              <p key={l} className="out-line" style={{ ['--i']: i }}>
                &gt; {l}
              </p>
            ))}
            <span className="caret" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
