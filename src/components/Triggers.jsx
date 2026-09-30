import { useOutletContext } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const TRIGGERS = [
  { icon: 'bed', title: 'Dust Mites', text: 'Wash bedding weekly in hot water; use allergen-proof covers.' },
  { icon: 'pollen', title: 'Pollen', text: 'Track local counts; keep windows shut on high-pollen days.' },
  { icon: 'paw', title: 'Pet Dander', text: 'Keep pets out of bedrooms; wash hands after contact.' },
  { icon: 'pollution', title: 'Air Pollution', text: 'Avoid outdoor exertion on poor AQI days; use masks if needed.' },
  { icon: 'cigarette', title: 'Tobacco Smoke', text: 'Both smoking and second-hand smoke severely worsen asthma.' },
  { icon: 'cold', title: 'Cold Air & Weather', text: 'Cover your nose with a scarf in cold or dusty winds.' },
  { icon: 'virus', title: 'Colds & Flu', text: 'Respiratory infections are the #1 attack trigger; get vaccinated.' },
  { icon: 'heart', title: 'Strong Emotions', text: 'Stress, anxiety and even hard laughter can tighten airways.' },
]

export default function Triggers() {
  const { onOpenChat } = useOutletContext()
  return (
    <section className="section soft" id="triggers">
      <div className="container">
        <div className="center" style={{ marginBottom: 52 }}>
          <Reveal><span className="eyebrow"><i></i>Identify &amp; Avoid</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">Common asthma triggers</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">Triggers irritate sensitive airways and set off symptoms. Yours may be unique — keep a diary to spot patterns.</p>
          </Reveal>
        </div>
        <div className="grid trig-grid">
          {TRIGGERS.map((t, i) => (
            <Reveal key={t.title} delay={(i % 4) * 0.07} className="trig">
              <span className="ic"><Icon name={t.icon} size={26} /></span>
              <h4>{t.title}</h4>
              <p>{t.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="note-strip ai-note">
          <span className="ic"><Icon name="sparkles" size={22} /></span>
          <p>
            <b>Not sure what's triggering you?</b> Ask BreatheWell AI about any specific trigger — dust, cold weather,
            exercise, pets, pollution — for tailored avoidance tips. <button onClick={onOpenChat}>Ask now</button>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
