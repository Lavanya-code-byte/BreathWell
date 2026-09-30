import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'

function Counter({ target }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      obs.disconnect()
      const dur = 1600
      const t0 = performance.now()
      const tick = t => {
        const p = Math.min((t - t0) / dur, 1)
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{val}</span>
}

const STATS = [
  { target: 262, suffix: 'M+', text: 'people worldwide live with asthma — one of the most common chronic conditions on Earth.' },
  { target: 34, suffix: 'M+', text: 'estimated asthma patients in India — about 2–3% of the population, across all ages.' },
  { prefix: '#', target: 1, text: 'most common chronic disease of childhood worldwide — early education protects young lungs.' },
  { target: 80, suffix: '%', text: 'of asthma deaths are considered preventable with correct treatment, monitoring and action plans.' },
]

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="grid">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="stat">
              <div className="num">{s.prefix || ''}<Counter target={s.target} /><em>{s.suffix || ''}</em></div>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
