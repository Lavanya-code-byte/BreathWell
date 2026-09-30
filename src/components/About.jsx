import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const POINTS = [
  { icon: 'lungs', title: 'Inflammation', text: 'The lining of the airways becomes swollen and extra-sensitive, producing excess mucus.' },
  { icon: 'notes', title: 'Constriction', text: 'Muscles around the airways tighten (bronchospasm), narrowing the passage for air.' },
  { icon: 'wind', title: 'Variable symptoms', text: 'Coughing, wheezing, chest tightness and breathlessness that come and go — often worse at night.' },
]

const ROWS = [
  { label: 'Normal airway', sub: 'Air flows freely', w: '92%', grad: 'linear-gradient(90deg,#34d3a2,#7ce8c4)', caption: 'Relaxed muscles, thin lining, clear passage.' },
  { label: 'Inflamed airway', sub: 'Swelling begins', w: '55%', grad: 'linear-gradient(90deg,#f0b45a,#f6cf8e)', caption: 'Airway walls swell and mucus builds up.' },
  { label: 'Asthma attack', sub: 'Severe narrowing', w: '22%', grad: 'linear-gradient(90deg,#e1685a,#ee9d92)', caption: 'Muscles squeeze tight — breathing becomes difficult.' },
]

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div>
          <Reveal><span className="eyebrow"><i></i>Understanding Asthma</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">What exactly is asthma?</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede" style={{ color: 'var(--body)', marginBottom: 8 }}>
              Asthma is a long-term (chronic) condition that affects the airways — the tubes that
              carry air in and out of your lungs. It is <b>not contagious</b>, and with the right
              care, most people with asthma live full, active lives.
            </p>
          </Reveal>
          <div className="about-points">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={0.16 + i * 0.08} className="about-point">
                <span className="ic"><Icon name={p.icon} size={24} /></span>
                <div><h4>{p.title}</h4><p>{p.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="airway-card">
          <h3>Inside your airways</h3>
          <p className="sub">How an asthma flare narrows the passage for air</p>
          <div className="airway-rows">
            {ROWS.map(r => (
              <div className="airway-row" key={r.label}>
                <div className="lbl">{r.label}<small>{r.sub}</small></div>
                <div>
                  <div className="airway-track">
                    <div className="fill" style={{ '--w': r.w, background: r.grad }} />
                  </div>
                  <p>{r.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
