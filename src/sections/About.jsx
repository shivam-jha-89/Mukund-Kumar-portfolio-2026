import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { SectionLabel } from '../components/SectionLabel'
import { useMediaQuery } from '../hooks/useMediaQuery'
const statement = 'I like building things that actually work.'.split(' ')
function Word({ word, i, n, p, reduce }) {
  const start = (i / n) * 0.8
  const opacity = useTransform(p, [start, start + 0.18], [0.14, 1])
  return (
    <motion.span style={reduce ? undefined : { opacity }} className="word">
      {word}{' '}
    </motion.span>
  )
}
/** Words of the statement come up as the section scrolls past. */
function Statement({ reduce }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  return (
    <h2 className="h-xl about-statement" ref={ref}>
      {statement.map((w, i) => (
        <Word key={i} word={w} i={i} n={statement.length} p={scrollYProgress} reduce={reduce} />
      ))}
    </h2>
  )
}
function ConceptWord({ word, p, from, reduce, plus }) {
  const x = useTransform(p, [0, 1], [from, '0vw'])
  const weight = useTransform(p, [0, 1], [240, 800])
  const opacity = useTransform(p, [0, 0.6], [0.2, 1])
  return (
    <div className="concept">
      <span className="concept-plus mono" aria-hidden="true">
        {plus ? '+' : ''}
      </span>
      <motion.span
        className="concept-word"
        style={reduce ? { fontWeight: 800 } : { x, fontWeight: weight, opacity }}
      >
        {word}
      </motion.span>
    </div>
  )
}
/** Four words start out of line and light, then settle into one column as the section scrolls. */
function Concepts({ reduce }) {
  const ref = useRef(null)
  const wide = useMediaQuery('(min-width: 768px)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'center 0.5'] })
  const k = wide ? 14 : 5
  const words = [
    { w: 'Product', f: `${-k}vw` },
    { w: 'Engineering', f: `${k * 0.6}vw` },
    { w: 'AI', f: `${-k * 0.8}vw` },
    { w: 'Data', f: `${k}vw` },
  ]
  return (
    <div className="concepts" ref={ref} role="list" aria-label="Where my work sits">
      {words.map((c, i) => (
        <div role="listitem" key={c.w}>
          <ConceptWord word={c.w} from={c.f} p={scrollYProgress} reduce={reduce} plus={i > 0} />
        </div>
      ))}
    </div>
  )
}
export function About() {
  const reduce = useReducedMotion() ?? false
  return (
    <section id="about" className="section">
      <div className="container ed-grid">
        <div className="ed-label">
          <SectionLabel>about</SectionLabel>
        </div>
        <div className="ed-main">
          <Statement reduce={reduce} />
          <div className="about-body">
            <p>
              I am a Computer Science and Engineering (Data Science) student focused on full-stack
              development, backend systems, AI integration and applied machine learning.
            </p>
            <p>My work usually sits where these four overlap.</p>
          </div>
          <Concepts reduce={reduce} />
        </div>
      </div>
    </section>
  )
}
