import { useMemo, useState } from 'react'
import { skillGroups, techAliases } from '../data/skills'
import { projects } from '../data/projects'
function projectsUsing(skill) {
  const names = [skill, ...(techAliases[skill] ?? [])].map((s) => s.toLowerCase())
  return projects.filter((p) => p.tech.some((t) => names.includes(t.toLowerCase()))).map((p) => p.title)
}
/** Technologies grouped by layer. Hovering one dims the other layers and shows which projects use it. */
export function SkillSystem() {
  const [hot, setHot] = useState(null)
  const used = useMemo(() => (hot ? projectsUsing(hot) : []), [hot])
  const hotGroup = hot ? skillGroups.find((g) => g.items.includes(hot))?.label : null
  return (
    <div className="skills" data-hot={hot ? 'true' : 'false'}>
      <ul className="skill-rows">
        {skillGroups.map((g) => (
          <li className="skill-row" key={g.label} data-hot-row={hotGroup === g.label}>
            <p className="mono skill-label">{g.label}</p>
            <ul className="skill-items">
              {g.items.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className={`skill ${hot === s ? 'is-hot' : ''}`}
                    onMouseEnter={() => setHot(s)}
                    onMouseLeave={() => setHot(null)}
                    onFocus={() => setHot(s)}
                    onBlur={() => setHot(null)}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="mono skill-readout" aria-live="polite">
        {hot
          ? used.length
            ? `${hot} is used in ${used.join(', ')}`
            : `${hot} is not listed on a project above`
          : 'Hover or focus a technology to see where it is used.'}
      </p>
    </div>
  )
}
