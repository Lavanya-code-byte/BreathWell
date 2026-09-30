import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const SIGNS = [
  'Too breathless to speak in full sentences; unable to lie flat',
  'Reliever inhaler gives no relief, or relief lasts less than 3 hours',
  'Lips, tongue or fingernails turning blue or grey',
  'Chest pulling in at the ribs when breathing; dizziness or confusion',
  'Peak flow below 50% of personal best after using the reliever',
]

const STEPS = [
  { bold: 'Sit upright', text: ' — never lie down. Loosen tight clothing and try to stay calm; slow, steady breaths.' },
  { bold: 'Take your reliever inhaler', text: ' (usually blue) — one puff every 30–60 seconds, up to 10 puffs, as per your action plan. A spacer helps greatly.' },
  { bold: "If symptoms worsen or don't improve after 10 puffs,", text: " call an ambulance immediately — don't drive yourself." },
  { bold: 'If the ambulance takes longer than 15 minutes,', text: ' repeat step 2 while waiting. Never be afraid of "wasting" emergency services\u2019 time.' },
]

export default function Emergency() {
  return (
    <section className="section emergency" id="emergency">
      <div className="container em-grid">
        <Reveal>
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,.14)', borderColor: 'rgba(255,255,255,.25)', color: '#ffd9d2' }}>
            <i style={{ background: '#ff8a75' }}></i>Act Fast, Stay Calm
          </span>
          <h2 className="section-title">Recognising an asthma emergency</h2>
          <p className="lede-light">Most asthma deaths are preventable. Knowing the danger signs — and acting early — saves lives. Treat the following as a medical emergency:</p>
          <div className="em-signs">
            {SIGNS.map(s => (
              <div className="em-sign" key={s}><Icon name="alertTri" size={18} />{s}</div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18} className="em-steps">
          <h3>
            <span className="hic"><Icon name="activity" size={22} /></span>
            What to do during an attack
          </h3>
          {STEPS.map((s, i) => (
            <div className="em-step" key={i}>
              <span className="n">{i + 1}</span>
              <p><b>{s.bold}</b>{s.text}</p>
            </div>
          ))}
          <div className="em-call">Emergency numbers — India: <span>108 / 102</span> · US: <span>911</span></div>
        </Reveal>
      </div>
    </section>
  )
}
