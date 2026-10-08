import { Navbar, sectionOrder } from './components/Navbar'
import { CustomCursor } from './components/CustomCursor'
import { ScrollRuler } from './components/ScrollRuler'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Capabilities } from './sections/Capabilities'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Achievements } from './sections/Achievements'
import { Stack } from './sections/Stack'
import { Contact } from './sections/Contact'
import { Closing } from './sections/Closing'
import { useTheme } from './hooks/useTheme'
import { useActiveSection } from './hooks/useActiveSection'
export default function App() {
  const { dark, toggle } = useTheme()
  const active = useActiveSection(sectionOrder)
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Navbar active={active} dark={dark} onToggleTheme={toggle} />
      <CustomCursor />
      <ScrollRuler />
      <main>
        <Hero />
        <About />
        <Capabilities />
        <Projects />
        <Experience />
        <Achievements />
        <Stack />
        <Contact />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
