import { useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
/** Nudges its child a few pixels toward the pointer. Primary actions only. */
export function MagneticButton({ children, strength = 0.22 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const fine = useMediaQuery('(pointer: fine)')
  const enabled = fine && !reduce
  const move = (e) => {
    const el = ref.current
    if (!enabled || !el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }
  const leave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <span ref={ref} className="magnetic" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  )
}
