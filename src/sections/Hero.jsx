import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { MagneticButton } from '../components/MagneticButton'
import { Action } from '../components/Action'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { profile } from '../data/profile'
import { HeroAvatar } from '../components/HeroAvatar'
const ease = [0.2, 0.7, 0.1, 1]
export function Hero() {
  const reduce = useReducedMotion() ?? false
  const fine = useMediaQuery('(pointer: fine)')
  const ref = useRef(null)
  const cross = useRef(null)
  const readout = useRef(null)
  // Ambient layer: a crosshair that reads out pointer position. Starts after the entrance is done.
  useEffect(() => {
    const el = ref.current
    const cr = cross.current
    const ro = readout.current
    if (!el || !cr || !ro || !fine || reduce) return
    let raf = 0
    let x = 0
    let y = 0
    let ready = false
    const timer = window.setTimeout(() => (ready = true), 1700)
    const apply = () => {
      raf = 0
      cr.style.setProperty('--x', `${x}px`)
      cr.style.setProperty('--y', `${y}px`)
      ro.textContent = `x ${String(Math.round(x)).padStart(4, '0')}  y ${String(Math.round(y)).padStart(4, '0')}`
    }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x = e.clientX - r.left
      y = e.clientY - r.top
      if (ready) cr.classList.add('on')
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const leave = () => cr.classList.remove('on')
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [fine, reduce])
  const fade = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.2 : 0.8, delay: reduce ? 0 : delay, ease },
  })
  const name = (word, delay) => (
    <span className="line">
      <motion.span
        className="line-inner"
        initial={reduce ? { opacity: 0 } : { y: '108%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={{ duration: reduce ? 0.2 : 1, delay: reduce ? 0 : delay, ease }}
      >
        {word}
      </motion.span>
    </span>
  )
  return (
    <section id="hero" className="hero" ref={ref}>
      <HeroAvatar />
      <div className="hero-guides" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="hero-cross" ref={cross} aria-hidden="true">
        <span className="cx" />
        <span className="cy" />
        <span className="readout mono" ref={readout} />
      </div>

      <div className="container hero-inner">
        <motion.p className="label hero-label" {...fade(0.1)}>
          <span aria-hidden="true">{'// '}</span>full-stack engineer / ai builder
          <span className="caret" aria-hidden="true" />
        </motion.p>

        <h1 className="hero-name">
          {name('Shivam', 0.3)}
          {name('Kumar', 0.45)}
        </h1>

        <div className="hero-row">
          <motion.p className="hero-statement" {...fade(0.95)}>
            I build full-stack applications, AI-powered systems and data products that turn complex ideas into
            usable software.
          </motion.p>
        </div>

        <motion.div className="hero-actions" {...fade(1.25)}>
          <MagneticButton>
            <Action href="#work" arrow>
              View my work
            </Action>
          </MagneticButton>
          <Action href="#contact" variant="ghost">
            Let's connect
          </Action>
          <span className="hero-social">
            <Action variant="text" icon="github" href={profile.links.github}>
              GitHub
            </Action>
            <Action variant="text" icon="linkedin" href={profile.links.linkedin}>
              LinkedIn
            </Action>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
