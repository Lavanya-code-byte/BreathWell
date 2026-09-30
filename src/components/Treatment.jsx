import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const CARDS = [
  {
    cls: 'tc-reliever', tag: 'Quick Relief', title: 'Reliever Inhalers',
    text: 'Fast-acting bronchodilators that relax tightened airway muscles within minutes. Used when symptoms strike — not for daily prevention.',
    points: ['Works in 5–15 minutes', 'Always carry it with you', 'Needing it >2×/week = see your doctor'],
    examples: 'Salbutamol (Albuterol), Levosalbutamol',
  },
  {
    cls: 'tc-controller', tag: 'Daily Prevention', title: 'Controller Inhalers',
    text: 'Inhaled corticosteroids (often combined with long-acting bronchodilators) that calm airway inflammation over time. Taken daily — even when you feel fine.',
    points: ['Prevents attacks & symptoms', 'Low doses are safe & non-addictive', 'Rinse mouth after use to prevent thrush'],
    examples: 'Budesonide, Fluticasone, Beclometasone ± Formoterol/Salmeterol',
  },
  {
    cls: 'tc-severe', tag: 'Specialist Care', title: 'Advanced Therapies',
    text: 'For severe or difficult-to-control asthma, specialists may add tablets or targeted biologic injections that block specific inflammatory pathways.',
    points: ['Leukotriene modifiers (tablets)', 'Biologics for allergic/eosinophilic asthma', 'Allergen immunotherapy in select cases'],
    examples: 'Montelukast · Omalizumab, Mepolizumab, Dupilumab',
  },
]

const STEPS = [
  { title: 'Shake it', text: 'Remove the cap and shake the inhaler well for 5 seconds.' },
  { title: 'Breathe out', text: 'Exhale fully, away from the inhaler. Use a spacer if advised.' },
  { title: 'Seal & press', text: 'Seal lips around the mouthpiece; press the canister once.' },
  { title: 'Inhale slowly', text: 'Breathe in slowly and deeply at the same time as pressing.' },
  { title: 'Hold & rinse', text: 'Hold breath ~10 seconds. Rinse mouth after steroid inhalers.' },
]

export default function Treatment() {
  return (
    <section className="section" id="treatment">
      <div className="container">
        <div className="center" style={{ marginBottom: 52 }}>
          <Reveal><span className="eyebrow"><i></i>Treatment Options</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">How asthma is treated</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">Modern asthma care rests on two kinds of inhalers — with advanced options for severe cases. Your doctor tailors the plan to you.</p>
          </Reveal>
        </div>

        <div className="treat-grid">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className={`treat-card ${c.cls}`}>
              <span className="tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <ul>
                {c.points.map(pt => (
                  <li key={pt}><Icon name="check" size={16} />{pt}</li>
                ))}
              </ul>
              <div className="examples"><b>Common medicines:</b> {c.examples}</div>
            </Reveal>
          ))}
        </div>

        <div className="center" style={{ margin: '72px 0 40px' }}>
          <Reveal><span className="eyebrow"><i></i>Technique Matters</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>Using a metered-dose inhaler correctly</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">Up to 90% of patients use inhalers incorrectly. Ask your doctor or pharmacist to check your technique at every visit.</p>
          </Reveal>
        </div>

        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="step">
              <div className="n">{i + 1}</div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
