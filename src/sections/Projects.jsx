import { SectionLabel } from '../components/SectionLabel'
import { RevealLines } from '../components/Reveal'
import { ProjectShowcase } from '../components/ProjectShowcase'
import { projects } from '../data/projects'
export function Projects() {
  return (
    <section id="work" className="section work">
      <div className="container work-head ed-grid">
        <div className="ed-label">
          <SectionLabel>selected work</SectionLabel>
        </div>
        <div className="ed-main">
          <RevealLines className="h-xl" lines={["Things I've built."]} />
          <p className="work-intro">
            Four projects. Scroll through each one to step through how it works, or hover a stage to jump to
            it.
          </p>
        </div>
      </div>
      <ol className="work-list">
        {projects.map((p, i) => (
          <ProjectShowcase key={p.id} project={p} index={i} total={projects.length} />
        ))}
      </ol>
    </section>
  )
}
