import { StageList } from './StageList'
/* ---------- EnergyCast: a schematic time series, no real values ---------- */
const N = 96
const W = 580
const H = 230
const X0 = 30
const Y0 = 20
const base = (i) =>
  0.5 + 0.16 * Math.sin((i / 12) * 2 * Math.PI) + 0.08 * Math.sin((i / 48) * 2 * Math.PI + 1)
const actual = (i) => base(i) + 0.03 * Math.sin(i * 1.9) + 0.02 * Math.sin(i * 0.77 + 2)
const px = (i) => X0 + (i / (N - 1)) * W
const py = (v) => Y0 + (1 - v) * H
const line = (from, to, fn) =>
  Array.from({ length: to - from + 1 }, (_, k) => {
    const i = from + k
    return `${k === 0 ? 'M' : 'L'}${px(i).toFixed(1)} ${py(fn(i)).toFixed(1)}`
  }).join(' ')
const SPLIT = 64
const END = 80
const pathActual = line(0, END, actual)
const pathFit = line(0, SPLIT, base)
const pathPredicted = line(SPLIT, END, (i) => base(i) + 0.018 * Math.sin(i * 0.7))
const pathForecast = line(END, N - 1, base)
const band = (() => {
  const up = Array.from({ length: N - END }, (_, k) => {
    const i = END + k
    return `${px(i).toFixed(1)} ${py(base(i) + 0.03 + 0.004 * k).toFixed(1)}`
  })
  const dn = Array.from({ length: N - END }, (_, k) => {
    const i = N - 1 - k
    return `${px(i).toFixed(1)} ${py(base(i) - 0.03 - 0.004 * (N - 1 - i)).toFixed(1)}`
  })
  return `M${up.join(' L')} L${dn.join(' L')} Z`
})()
function SignalVisual({ stage }) {
  const ticks = Array.from({ length: 9 }, (_, k) => k * 12)
  return (
    <svg
      className="sig"
      viewBox="0 0 640 280"
      role="img"
      aria-label="Schematic of a time series being fitted, validated and forecast"
    >
      <line className="axis" x1={X0} y1={Y0 + H} x2={X0 + W} y2={Y0 + H} />
      <rect
        className={`layer hold ${stage >= 3 ? 'on' : ''}`}
        x={px(SPLIT)}
        y={Y0}
        width={px(END) - px(SPLIT)}
        height={H}
      />
      <g className={`layer ${stage >= 1 ? 'on' : ''}`}>
        {ticks.map((i) => (
          <line key={i} className="tick" x1={px(i)} y1={Y0} x2={px(i)} y2={Y0 + H} />
        ))}
        <text x={px(12) + 6} y={Y0 + 12}>
          daily cycle
        </text>
      </g>
      <path className={`actual ${stage >= 0 ? 'on' : ''}`} d={pathActual} pathLength={1} />
      <path className={`fit layer ${stage >= 2 ? 'on' : ''}`} d={pathFit} />
      <path className={`pred layer ${stage >= 3 ? 'on' : ''}`} d={pathPredicted} />
      <g className={`fc ${stage >= 4 ? 'on' : ''}`}>
        <path className="band" d={band} />
        <path className="forecast" d={pathForecast} />
      </g>
      <text className={`layer ${stage >= 0 ? 'on' : ''}`} x={X0} y={Y0 + H + 22}>
        history
      </text>
      <text className={`layer ${stage >= 2 ? 'on' : ''}`} x={px(30)} y={Y0 + H + 22}>
        fitted
      </text>
      <text className={`layer ${stage >= 3 ? 'on' : ''}`} x={px(SPLIT) + 4} y={Y0 + H + 22}>
        held out
      </text>
      <text className={`layer ${stage >= 4 ? 'on' : ''}`} x={px(END) + 8} y={Y0 + H + 22}>
        forecast
      </text>
    </svg>
  )
}
/* ---------- TaskFlow: states a task passes through ---------- */
const cols = ['backlog', 'in progress', 'in review', 'done']
const actors = ['member', 'member', 'member', 'admin']
const events = ['task created', 'task moved', 'submission sent', 'submission approved']
function BoardVisual({ stage }) {
  return (
    <div className="board" data-stage={stage}>
      <div className="board-cols">
        {cols.map((c, i) => (
          <div className="board-col" key={c}>
            <p className="mono">{c}</p>
            {i === 0 && <span className="chip ghost">T-2</span>}
            {i === 1 && <span className="chip ghost">T-4</span>}
            {i === 3 && <span className="chip ghost">T-5</span>}
          </div>
        ))}
        <span className={`gate ${stage >= 3 ? 'open' : ''}`}>
          <span className="mono">{stage >= 3 ? 'approved' : 'needs approval'}</span>
        </span>
        <span className="chip-slot" style={{ ['--col']: stage }}>
          <span className="chip main">T-1</span>
        </span>
      </div>
      <div className="board-status mono">
        <span>actor: {actors[stage]}</span>
        <span>
          <i className="dot" aria-hidden="true" /> socket.io: {events[stage]}
        </span>
      </div>
    </div>
  )
}
/* ---------- HireSense: document in, ranking and feedback out ---------- */
const bars = [120, 150, 90, 140, 110, 150, 100, 130, 80]
const jd = [140, 100, 130, 90, 120]
const rowY = (i) => 34 + i * 22
const skillRows = [2, 3, 4]
const jdSkillRows = [0, 2, 3]
function ParseVisual({ stage }) {
  return (
    <svg
      className="parse"
      viewBox="0 0 640 350"
      role="img"
      aria-label="Schematic of a resume being parsed, matched against a job description and ranked"
    >
      <g>
        <rect className="doc" x="10" y="10" width="190" height="220" />
        {bars.map((w, i) => (
          <rect
            key={i}
            className={`bar ${stage >= 2 && skillRows.includes(i) ? 'skill' : ''}`}
            x="26"
            y={rowY(i)}
            width={w}
            height="8"
          />
        ))}
        <g className={`layer ${stage >= 1 ? 'on' : ''}`}>
          <line className="split" x1="18" y1="70" x2="192" y2="70" />
          <line className="split" x1="18" y1="136" x2="192" y2="136" />
        </g>
      </g>
      <g className={`layer ${stage >= 3 ? 'on' : ''}`}>
        <rect className="doc" x="440" y="10" width="190" height="130" />
        {jd.map((w, i) => (
          <rect
            key={i}
            className={`bar ${jdSkillRows.includes(i) ? 'skill' : ''}`}
            x="456"
            y={30 + i * 20}
            width={w}
            height="8"
          />
        ))}
        {skillRows.map((r, k) => (
          <path
            key={r}
            className="link"
            pathLength={1}
            d={`M200 ${rowY(r) + 4} C 320 ${rowY(r) + 4}, 320 ${30 + jdSkillRows[k] * 20 + 4}, 440 ${30 + jdSkillRows[k] * 20 + 4}`}
          />
        ))}
        <text x="285" y="190">
          tf-idf, cosine
        </text>
      </g>
      <g className={`layer ${stage >= 4 ? 'on' : ''}`}>
        {[300, 220, 150].map((w, i) => (
          <g key={w}>
            <text x="14" y={278 + i * 22}>
              {i + 1}
            </text>
            <rect className="rank" x="40" y={270 + i * 22} width={w} height="10" />
          </g>
        ))}
      </g>
      <g className={`layer ${stage >= 5 ? 'on' : ''}`}>
        <text x="440" y="262">
          ats checks
        </text>
        {Array.from({ length: 7 }, (_, i) => (
          <rect
            key={i}
            className="check"
            x={440 + i * 28}
            y="272"
            width="20"
            height="20"
            style={{ transitionDelay: `${i * 90}ms` }}
          />
        ))}
      </g>
    </svg>
  )
}
export function ProjectVisual({ project, stage, onPick }) {
  const { kind, stages } = project
  if (kind === 'pipeline') {
    return <StageList stages={stages} stage={stage} layout="vertical" onPick={onPick} />
  }
  return (
    <div className="visual-stack">
      <div className="visual-frame">
        {kind === 'signal' && <SignalVisual stage={stage} />}
        {kind === 'board' && <BoardVisual stage={stage} />}
        {kind === 'parse' && <ParseVisual stage={stage} />}
      </div>
      <StageList stages={stages} stage={stage} layout="inline" onPick={onPick} />
    </div>
  )
}
