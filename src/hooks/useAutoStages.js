import { useEffect, useState } from 'react'
/**
 * Steps through `count` stages once when the element scrolls into view.
 * Used where the scroll-pinned layout is not available (tablet, phone,
 * reduced motion). With reduced motion every stage is shown at once.
 */
export function useAutoStages(ref, count, enabled, reduce) {
  const [stage, setStage] = useState(reduce ? count - 1 : 0)
  useEffect(() => {
    if (!enabled) return
    if (reduce) {
      setStage(count - 1)
      return
    }
    const el = ref.current
    if (!el) return
    let timer
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        let i = 0
        setStage(0)
        timer = window.setInterval(() => {
          i += 1
          setStage(i)
          if (i >= count - 1) window.clearInterval(timer)
        }, 750)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(timer)
    }
  }, [ref, count, enabled, reduce])
  return stage
}
