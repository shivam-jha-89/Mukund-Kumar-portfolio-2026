import { useEffect, useRef } from 'react'
export function StageList({ stages, stage, layout, onPick }) {
  const ref = useRef(null)
  useEffect(() => {
    const list = ref.current
    if (!list || layout !== 'inline' || list.scrollWidth <= list.clientWidth) return
    const li = list.children[stage]
    if (!li) return
    list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' })
  }, [stage, layout])
  return (
    <ol ref={ref} className={layout === 'vertical' ? 'stages-v' : 'stages-i'} aria-label="Stages">
      {stages.map((s, i) => (
        <li key={s.name} className={`stage ${i < stage ? 'done' : ''} ${i === stage ? 'active' : ''}`}>
          <button
            type="button"
            className="stage-btn"
            aria-current={i === stage ? 'step' : undefined}
            onMouseEnter={() => onPick(i)}
            onMouseLeave={() => onPick(null)}
            onFocus={() => onPick(i)}
            onBlur={() => onPick(null)}
            onClick={() => onPick(i)}
          >
            <span className="node" aria-hidden="true" />
            <span className="idx mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="name">{s.name}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}
