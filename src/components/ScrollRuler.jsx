import { motion, useScroll } from 'motion/react'
/** Page progress, drawn as a hairline on the right edge. Wide screens only. */
export function ScrollRuler() {
  const { scrollYProgress } = useScroll()
  return (
    <div className="ruler" aria-hidden="true">
      <motion.span className="ruler-fill" style={{ scaleY: scrollYProgress }} />
    </div>
  )
}
