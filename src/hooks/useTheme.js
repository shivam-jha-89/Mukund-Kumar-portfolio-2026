import { useCallback, useEffect, useState } from 'react'
const read = () => {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
}
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = useCallback(() => {
    const root = document.documentElement
    root.classList.add('theme-anim')
    const next = !root.classList.contains('dark')
    root.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* storage can be unavailable */
    }
    setDark(next)
    window.setTimeout(() => root.classList.remove('theme-anim'), 600)
  }, [])
  // Follow the system setting until the visitor makes a choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => {
      if (read()) return
      document.documentElement.classList.toggle('dark', mq.matches)
      setDark(mq.matches)
    }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return { dark, toggle }
}
