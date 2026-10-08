import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
/** A vertical line draws as you scroll and each milestone switches on when the line reaches it. */
export function Timeline({ items }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.55'] })
  const [count, setCount] = useState(reduce ? items.length : 0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return
    const n = items.length
    setCount(v <= 0.02 ? 0 : Math.min(n, Math.floor(v * n) + 1))
  })
  return (
    <ol className="tl" ref={ref}>
      <span className="tl-line" aria-hidden="true" />
      <motion.span
        className="tl-fill"
        aria-hidden="true"
        style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }}
      />
      {items.map((it, i) => (
        <li className="tl-item" key={it.title} data-active={i < count}>
          <span className="tl-dot" aria-hidden="true" />
          <div className="tl-body">
            <p className="mono tl-when">{it.when}</p>
            <h3 className="tl-title">{it.title}</h3>
            <p className="tl-text">{it.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
