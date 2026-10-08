import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { RevealLines } from './Reveal'
import { Action } from './Action'
import { ProjectVisual } from './ProjectVisual'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useAutoStages } from '../hooks/useAutoStages'
export function ProjectShowcase({ project, index, total }) {
  const wide = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion() ?? false
  const pinned = wide && !reduce
  const n = project.stages.length
  const articleRef = useRef(null)
  const visualRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ['start start', 'end end'] })
  const [scrollStage, setScrollStage] = useState(0)
  const [picked, setPicked] = useState(null)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pinned) return
    const t = Math.min(0.999, Math.max(0, (v - 0.04) / 0.9))
    setScrollStage(Math.floor(t * n))
  })
  const autoStage = useAutoStages(visualRef, n, !pinned, reduce)
  const stage = picked ?? (pinned ? scrollStage : autoStage)
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.1, 1] } },
  }
  return (
    <li
      className="project"
      ref={articleRef}
      style={pinned ? { height: `${100 + n * 28}vh` } : undefined}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="project-pane" data-cursor="view">
        <div className="container project-grid">
          <div className="project-text">
            <div className="project-head">
              <div className="project-index" aria-label={`Project ${index + 1} of ${total}`}>
                <span className="num">{String(index + 1).padStart(2, '0')}</span>
                <span className="of mono">/ {String(total).padStart(2, '0')}</span>
                <span className="ticks" aria-hidden="true">
                  {Array.from({ length: total }, (_, k) => (
                    <i key={k} className={k === index ? 'on' : ''} />
                  ))}
                </span>
              </div>
              <RevealLines as="h3" className="project-title" lines={[project.title]} />
              <span id={`${project.id}-title`} hidden>
                {project.title}
              </span>
              <p className="project-desc">{project.description}</p>
            </div>
            <div className="project-tail">
              <motion.ul
                className="tech"
                aria-label="Technology"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ staggerChildren: reduce ? 0 : 0.055, delayChildren: 0.25 }}
              >
                {project.tech.map((t) => (
                  <motion.li key={t} variants={item}>
                    {t}
                  </motion.li>
                ))}
              </motion.ul>
              <dl className="project-meta mono">
                {project.meta.map((m) => (
                  <div key={m.k}>
                    <dt>{m.k}</dt>
                    <dd>{m.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="project-links">
                <Action variant="ghost" href={project.links.github}>
                  GitHub
                </Action>
                <Action variant="ghost" href={project.links.demo}>
                  Live demo
                </Action>
                {project.links.architecture && (
                  <Action variant="ghost" href={project.links.architecture}>
                    Architecture
                  </Action>
                )}
              </div>
            </div>
          </div>
          <div className="project-visual" ref={visualRef} data-kind={project.kind}>
            <ProjectVisual project={project} stage={stage} onPick={setPicked} />
            <div className="stage-bar" role="group" aria-label="Jump to stage">
              {project.stages.map((st, k) => (
                <button
                  key={st.name}
                  type="button"
                  className={`seg ${k < stage ? 'done' : ''} ${k === stage ? 'active' : ''}`}
                  aria-label={`Stage ${k + 1}: ${st.name}`}
                  aria-current={k === stage ? 'step' : undefined}
                  onClick={() => setPicked(k)}
                />
              ))}
            </div>
            <p className="stage-label mono" aria-hidden="true">
              <span>{String(stage + 1).padStart(2, '0')}</span> {project.stages[stage].name}
            </p>
            <p className="stage-note" key={stage} aria-live="polite">
              {project.stages[stage].note}
            </p>
            <p className="visual-caption mono">{project.visualCaption}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
