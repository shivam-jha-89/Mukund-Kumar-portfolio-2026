import { SectionLabel } from '../components/SectionLabel'
import { RevealLines } from '../components/Reveal'
import { Timeline } from '../components/Timeline'
import { experience } from '../data/experience'
export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container ed-grid">
        <div className="ed-label">
          <SectionLabel>experience</SectionLabel>
        </div>
        <div className="ed-main">
          <RevealLines className="h-lg" lines={['Where the', 'work happened.']} />
          <div className="tl-wrap">
            <Timeline items={experience} />
          </div>
        </div>
      </div>
    </section>
  )
}
