import { Link, useOutletContext } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const SYMPTOMS = [
  { icon: 'wind', title: 'Wheezing', text: 'A whistling or squeaky sound when you breathe — especially when exhaling. Often the most recognised sign.' },
  { icon: 'heart', title: 'Shortness of breath', text: "Feeling like you can't get enough air in, or that breathing takes real effort — even during mild activity." },
  { icon: 'chest', title: 'Chest tightness', text: 'A squeezing, heavy, or band-like feeling across the chest — sometimes described as "a weight on my chest".' },
  { icon: 'cough', title: 'Persistent coughing', text: 'A dry cough that lingers — often worse at night, early morning, during exercise, or when laughing.' },
  { icon: 'moon', title: 'Disturbed sleep', text: 'Night-time coughing, wheezing or breathlessness that wakes you up — a sign asthma may be poorly controlled.' },
  { icon: 'zap', title: 'Fatigue & low stamina', text: 'Feeling tired quickly or struggling with activities others find easy, because your body works harder to breathe.' },
]

export default function Symptoms() {
  const { onOpenChat } = useOutletContext()
  return (
    <section className="section soft" id="symptoms">
      <div className="container">
        <div className="center" style={{ marginBottom: 52 }}>
          <Reveal><span className="eyebrow"><i></i>Know the Signs</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">Common symptoms of asthma</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">Symptoms vary from person to person and episode to episode. You may have some — but rarely all — of these signs.</p>
          </Reveal>
        </div>
        <div className="grid cards-3">
          {SYMPTOMS.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08} className="sym-card">
              <span className="ic"><Icon name={s.icon} size={26} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="note-strip">
          <span className="ic"><Icon name="alertCircle" size={24} /></span>
          <p>
            <b>Don't self-diagnose.</b> These symptoms can overlap with other conditions. If you recognise them in yourself or your child, book an appointment with a doctor for proper tests such as spirometry or peak-flow measurement.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="note-strip ai-note">
          <span className="ic"><Icon name="sparkles" size={22} /></span>
          <p>
            <b>Experiencing some of these?</b> Describe how you've been feeling in plain words and let our
            <Link to="/ai-tools" style={{ color: '#5b21b6', fontWeight: 700, textDecoration: 'underline' }}> AI Symptom Analyzer </Link>
            highlight patterns, warning signs and the right questions to take to your doctor — or simply
            <button onClick={onOpenChat}> chat with BreatheWell AI</button>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
