import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
const labels = { view: 'view', open: 'open', button: '→' }
/** A small dot that follows the pointer and names what is under it. Fine pointers only. */
export function CustomCursor() {
  const fine = useMediaQuery('(pointer: fine)')
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [state, setState] = useState('default')
  useEffect(() => {
    if (!fine || reduce) return
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0
    const el = ref.current
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      el?.classList.add('on')
    }
    const over = (e) => {
      const t = e.target?.closest?.('[data-cursor]')
      setState(t?.dataset.cursor ?? 'default')
    }
    const leave = () => el?.classList.remove('on')
    const tick = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      if (el) el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseover', over)
    document.documentElement.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [fine, reduce])
  if (!fine || reduce) return null
  return (
    <div ref={ref} className={`cursor ${state}`} aria-hidden="true">
      <div className="cursor-body">
        <span>{labels[state] ?? ''}</span>
      </div>
    </div>
  )
}
