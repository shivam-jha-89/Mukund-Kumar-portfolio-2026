import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { avatar } from '../data/avatarPaths'
import '../styles/hero-avatar.css'

const c = avatar.colors
const ec = avatar.eyeColors
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const Layer = ({ d, fill, cls }) => (d ? <path className={cls} d={d} fill={fill} fillRule="evenodd" /> : null)

/**
 * Expressions are 5 numbers:
 *  s  smile (-1 frown .. 1 big smile)     o  mouth open (0..1)
 *  a  asymmetry (smirk, -1 left .. 1 right)  sq squint (-1 wide .. 1 closed)   br brows (-1 down .. 1 up)
 */
const EXPR = {
  neutral: { s: 0.05, o: 0, a: 0, sq: 0, br: 0 },
  smirk: { s: 0.3, o: 0, a: 0.9, sq: 0.1, br: 0.15 },
  smile: { s: 0.75, o: 0, a: 0, sq: 0.3, br: 0.3 },
  grin: { s: 1, o: 0.8, a: 0, sq: 0.6, br: 0.55 },
  hmm: { s: -0.2, o: 0, a: -0.7, sq: 0, br: -0.3 },
}
const IDLE = ['smirk', 'hmm', 'smile']

/** Mouth as a quadratic curve (+ a lower lip when open). Face centre is x = 364, mouth line y = 406. */
function mouthPath(s, o, a) {
  const cx = 364
  const y0 = 406
  const w = 32 + 16 * Math.max(s, 0) + 8 * o
  const x0 = cx - w / 2
  const x1 = cx + w / 2
  const lift = 6 * s
  const yl = y0 - lift
  const yr = y0 - lift - 5 * a
  const mid = y0 - lift + 23 * s * (1 - o) ** 2
  const ctrl = 2 * mid - (yl + yr) / 2
  const upper = `M${x0.toFixed(1)} ${yl.toFixed(1)}Q${cx} ${ctrl.toFixed(1)} ${x1.toFixed(1)} ${yr.toFixed(1)}`
  const low = 2 * (mid + o * 30) - (yl + yr) / 2
  return { line: upper, fill: `${upper}Q${cx} ${low.toFixed(1)} ${x0.toFixed(1)} ${yl.toFixed(1)}Z` }
}
const rest = mouthPath(EXPR.neutral.s, 0, 0)

/**
 * The portrait in the hero (desktop and wide tablets). Transparent background, only the character.
 * Eyes follow the cursor, the head turns toward it, it blinks, and its expression changes:
 * a smirk when the cursor comes near, a smile when you hover it, a grin and a nod when you click,
 * and a random idle look every few seconds. Reduced motion: a still, neutral face.
 */
export function HeroAvatar() {
  const wide = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion() ?? false
  const svg = useRef(null)
  const mLine = useRef(null)
  const mFill = useRef(null)

  useEffect(() => {
    const el = svg.current
    if (!wide || !el) return
    el.classList.add('ready')
    if (reduce) return

    const hero = el.closest('.hero') || document
    const cur = { ...EXPR.neutral }
    let tgt = { ...EXPR.neutral }
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0
    let hovering = false
    let near = false
    let override = null
    const timers = new Set()
    const later = (fn, ms) => {
      const t = window.setTimeout(() => {
        timers.delete(t)
        fn()
      }, ms)
      timers.add(t)
      return t
    }

    const set = (k, v) => el.style.setProperty(k, v)
    const apply = () => {
      raf = 0
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      let moving = Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002
      for (const k of Object.keys(cur)) {
        const d = tgt[k] - cur[k]
        cur[k] += d * 0.16
        if (Math.abs(d) > 0.004) moving = true
      }
      set('--ex', `${(x * 10).toFixed(2)}px`)
      set('--ey', `${(y * 3).toFixed(2)}px`)
      set('--hr', `${(x * 3.4).toFixed(2)}deg`)
      set('--hx', `${(x * 6).toFixed(2)}px`)
      set('--hy', `${(y * 3.5).toFixed(2)}px`)
      // expression
      const m = mouthPath(cur.s, cur.o, cur.a)
      mLine.current?.setAttribute('d', m.line)
      mFill.current?.setAttribute('d', m.fill)
      mFill.current?.setAttribute('opacity', cur.o > 0.05 ? '1' : '0')
      set('--eyes-sy', (cur.sq > 0 ? 1 - 0.55 * cur.sq : 1 - 0.18 * cur.sq).toFixed(3))
      set('--lid-dy', `${(4 * cur.sq).toFixed(2)}px`)
      const rl = clamp(cur.br + 0.5 * Math.max(-cur.a, 0), -0.55, 1)
      const rr = clamp(cur.br + 0.5 * Math.max(cur.a, 0), -0.55, 1)
      set('--brl', `${(-9 * rl).toFixed(2)}px`)
      set('--brr', `${(-9 * rr).toFixed(2)}px`)
      if (moving) raf = requestAnimationFrame(apply)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    let idle = null
    const decide = () => {
      const name = override ?? (hovering ? 'smile' : near ? 'smirk' : (idle ?? 'neutral'))
      tgt = { ...EXPR[name] }
      kick()
    }
    const express = (name, ms) => {
      override = name
      decide()
      later(() => {
        override = null
        decide()
      }, ms)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const hx = r.left + r.width * 0.56
      const hy = r.top + r.height * 0.43
      tx = clamp((e.clientX - hx) / (window.innerWidth * 0.45), -1, 1)
      ty = clamp((e.clientY - hy) / (window.innerHeight * 0.45), -1, 1)
      const wasHover = hovering
      const wasNear = near
      hovering = Boolean(e.target.closest && e.target.closest('.avatar-btn'))
      near = Math.hypot(e.clientX - hx, e.clientY - hy) < r.width * 0.6
      if (hovering !== wasHover || near !== wasNear) decide()
      kick()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      hovering = false
      near = false
      decide()
    }

    // blink
    const blink = () => {
      el.classList.add('blink')
      later(() => el.classList.remove('blink'), 140)
      later(blink, 2800 + Math.random() * 3600)
    }
    later(blink, 1900)
    // a greeting once the portrait has faded in
    later(() => express('smile', 1200), 2400)
    // a random idle look, only when nothing else is going on
    const idleLoop = () => {
      if (!override && !hovering && !near) {
        idle = IDLE[Math.floor(Math.random() * IDLE.length)]
        decide()
        later(() => {
          idle = null
          decide()
        }, 1700)
      }
      later(idleLoop, 5500 + Math.random() * 3500)
    }
    later(idleLoop, 6500)

    el.__express = express
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach((t) => window.clearTimeout(t))
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      delete el.__express
    }
  }, [wide, reduce])

  const onClick = () => {
    const el = svg.current
    if (!el || reduce) return
    el.classList.remove('nod')
    void el.getBoundingClientRect() // restart the animation on repeat clicks
    el.classList.add('nod')
    el.__express?.('grin', 1500)
  }

  if (!wide) return null
  return (
    <figure className="hero-avatar">
      <button
        type="button"
        className="avatar-btn"
        onClick={onClick}
        aria-label="Portrait of Kumar. Activate to make him smile."
      >
        <svg
          ref={svg}
          className="avatar-svg"
          viewBox="70 62 520 626"
          aria-hidden="true"
          focusable="false"
          onAnimationEnd={(e) => e.currentTarget.classList.remove('nod')}
        >
          {/* light outline, shown in dark mode only so the black hair never disappears into the page */}
          <path className="edge" d={avatar.body.sil} />
          <g className="head edge-head">
            <g className="nodg">
              <path className="edge" d={avatar.head.sil} />
            </g>
          </g>

          <g className="body">
            <Layer d={avatar.body.sil} fill={c.ink} />
            {['hood', 'hoodl', 'navy', 'slate', 'skin', 'skinsh'].map((n) => (
              <Layer key={n} d={avatar.body[n]} fill={c[n]} />
            ))}
          </g>
          <g className="head">
            <g className="nodg">
              <Layer d={avatar.head.sil} fill={c.ink} />
              {['hoodl', 'navy', 'slate', 'skin', 'skinsh', 'hair'].map((n) => (
                <Layer key={n} d={avatar.head[n]} fill={c[n]} />
              ))}
              <Layer cls="ring" d={avatar.head.cyan} fill={c.cyan} />
              <g className="eyes">
                <g className="eyes-sq">
                  {['l', 'r'].map((t) => (
                    <g key={t}>
                      <clipPath id={`eye-clip-${t}`}>
                        <path d={avatar.eyes[t].socket} />
                      </clipPath>
                      <g clipPath={`url(#eye-clip-${t})`}>
                        <path d={avatar.eyes[t].socket} fill={ec.sclera} />
                        <g className="iris">
                          <Layer d={avatar.eyes[t].iris} fill={ec.iris} />
                          <Layer d={avatar.eyes[t].brown} fill={ec.brown} />
                        </g>
                      </g>
                    </g>
                  ))}
                </g>
              </g>
              <g className="lid">
                <Layer d={avatar.lid} fill={c.ink} />
              </g>
              <g className="brow brow-l">
                <Layer d={avatar.brows.l} fill={c.ink} />
              </g>
              <g className="brow brow-r">
                <Layer d={avatar.brows.r} fill={c.ink} />
              </g>
              <path ref={mFill} className="mouth-fill" d={rest.fill} fill={c.ink} opacity="0" />
              <path
                ref={mLine}
                className="mouth"
                d={rest.line}
                fill="none"
                stroke={c.ink}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </button>
      <figcaption className="mono">// click to say hi</figcaption>
    </figure>
  )
}
