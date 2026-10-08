import { SectionLabel } from '../components/SectionLabel'
import { achievements } from '../data/experience'
export function Achievements() {
  return (
    <section id="signals" className="section alt">
      <div className="container ed-grid">
        <div className="ed-label">
          <SectionLabel>signals</SectionLabel>
        </div>
        <div className="ed-main">
          <ul className="signals">
            {achievements.map((a) => (
              <li key={a.title} className="signal">
                <h3 className="signal-title">{a.title}</h3>
                <p className="signal-org">{a.org}</p>
                <p className="signal-note mono">{a.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
