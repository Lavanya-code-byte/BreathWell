import { useState } from 'react'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

export const ASTHMA_TYPES = [
  {
    id: 'allergic', label: 'Allergic', icon: 'pollen',
    title: 'Allergic (Atopic) Asthma',
    text: 'The most common type, often beginning in childhood. Symptoms are set off by allergens in the environment, and it frequently runs in families alongside eczema or hay fever.',
    points: ['Triggered by dust mites, pollen, pet dander, mould', 'Often seasonal — worse in spring or monsoon', 'Responds well to inhaled corticosteroids & trigger avoidance'],
  },
  {
    id: 'eib', label: 'Exercise-Induced', icon: 'runner',
    title: 'Exercise-Induced Bronchoconstriction (EIB)',
    text: 'Airways narrow during or shortly after physical activity — especially in cold, dry air. It does NOT mean you should stop exercising; managed well, athletes with EIB compete at elite levels.',
    points: ['Symptoms peak 5–15 minutes after exercise', 'Warm-up routines and pre-exercise reliever medication help', 'Swimming in warm, humid air is often better tolerated'],
  },
  {
    id: 'occupational', label: 'Occupational', icon: 'factory',
    title: 'Occupational Asthma',
    text: 'Caused or worsened by substances inhaled at work. Symptoms often improve on weekends or holidays and return during the work week — a key diagnostic clue.',
    points: ['Common culprits: flour dust, wood dust, chemicals, fumes, latex', 'Affects bakers, painters, welders, cleaners, health workers', 'Early diagnosis and exposure control can be life-changing'],
  },
  {
    id: 'nocturnal', label: 'Nocturnal', icon: 'moonStar',
    title: 'Nocturnal (Night-time) Asthma',
    text: "Symptoms that flare between roughly 2–4 a.m., driven by the body's natural circadian rhythm, dust mites in bedding, and lying flat. Waking at night is a red flag for poor control.",
    points: ['Night-time symptoms mean control needs reviewing', 'Allergen-proof bedding and regular controller use help', 'Acid reflux (GERD) at night can make it worse'],
  },
  {
    id: 'cva', label: 'Cough-Variant', icon: 'cough',
    title: 'Cough-Variant Asthma',
    text: 'The main — sometimes only — symptom is a persistent dry cough, without obvious wheezing or breathlessness. It is frequently misdiagnosed as a lingering cold or throat irritation.',
    points: ['Chronic cough lasting more than 6–8 weeks', 'Often triggered by cold air, exercise or dust', 'Untreated, it can progress to classic asthma — treat early'],
  },
  {
    id: 'severe', label: 'Severe Asthma', icon: 'shield',
    title: 'Severe Asthma',
    text: 'Affects roughly 5–10% of people with asthma. Symptoms and attacks persist despite high-dose standard treatment, and require specialist care — but modern "biologic" therapies have transformed outcomes.',
    points: ['Frequent flare-ups despite high-dose inhalers', 'Managed by pulmonologists with personalised plans', 'Biologic injections target specific inflammation pathways'],
  },
]

export default function Types() {
  const [active, setActive] = useState(ASTHMA_TYPES[0].id)
  const type = ASTHMA_TYPES.find(t => t.id === active)

  return (
    <section className="section" id="types">
      <div className="container">
        <div className="center">
          <Reveal><span className="eyebrow"><i></i>Not One-Size-Fits-All</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">Types of asthma</h2></Reveal>
          <Reveal delay={0.16}><p className="section-lede">Asthma shows up in different forms. Explore the most common types below.</p></Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="tabs">
            {ASTHMA_TYPES.map(t => (
              <button key={t.id} className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="tab-panel" key={type.id}>
          <div>
            <h3>{type.title}</h3>
            <p>{type.text}</p>
            <ul>
              {type.points.map(pt => (
                <li key={pt}><Icon name="check" size={17} style={{ color: 'var(--teal-600)' }} />{pt}</li>
              ))}
            </ul>
          </div>
          <div className="tab-visual" style={{ background: 'linear-gradient(140deg,#eef9fb,#d6f2f5)', color: 'var(--teal-700)' }}>
            <Icon name={type.icon} size={140} strokeWidth={1.1} />
          </div>
        </div>
      </div>
    </section>
  )
}
