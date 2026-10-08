import { createElement } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const ease = [0.2, 0.7, 0.1, 1]

/**
 * Each line slides up out of its own mask when the heading enters the viewport.
 * The observed element is the (unclipped) wrapper, never the translated line,
 * so the reveal always fires, even for small text on phones.
 */
export function RevealLines({ lines, as = 'h2', className = '', delay = 0, stagger = 0.09 }) {
  const reduce = useReducedMotion()
  const variants = {
    hidden: reduce ? { opacity: 0 } : { y: '108%' },
    show: (i) => ({
      ...(reduce ? { opacity: 1 } : { y: 0 }),
      transition: { duration: reduce ? 0.2 : 0.9, delay: delay + i * stagger, ease },
    }),
  }
  return createElement(
    as,
    { className: `lines ${className}` },
    <motion.span
      className="reveal-root"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
    >
      {lines.map((text, i) => (
        <span className="line" key={i}>
          <motion.span className="line-inner" variants={variants} custom={i}>
            {text}
          </motion.span>
        </span>
      ))}
    </motion.span>,
  )
}
