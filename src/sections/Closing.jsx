import { RevealLines } from '../components/Reveal'
export function Closing() {
  return (
    <section id="closing" className="section closing" aria-label="Closing statement">
      <div className="container">
        <p className="closing-line">
          <RevealLines as="span" className="h-xl" lines={['Build something useful.']} />
        </p>
        <p className="closing-line">
          <RevealLines as="span" className="h-xl" lines={['Make it work.']} />
        </p>
        <p className="closing-line">
          <RevealLines as="span" className="h-xl" lines={['Then make it better.']} />
          <span className="closing-bar" aria-hidden="true" />
        </p>
      </div>
    </section>
  )
}
