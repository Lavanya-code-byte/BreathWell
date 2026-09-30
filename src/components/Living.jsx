import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const TIPS = [
  { icon: 'calendar', title: 'Never skip controllers', text: 'Take preventer inhalers daily, even on symptom-free days. Set phone reminders and pair doses with brushing your teeth.' },
  { icon: 'runner', title: 'Keep moving', text: 'Regular exercise strengthens lungs and heart. Warm up well, keep your reliever handy, and choose activities you enjoy.' },
  { icon: 'clock', title: 'Review regularly', text: 'See your doctor at least once or twice a year — and after any attack — to review medicines, technique and your action plan.' },
  { icon: 'vaccine', title: 'Get vaccinated', text: 'Flu and pneumonia hit asthmatic lungs harder. Ask your doctor about annual flu shots and other recommended vaccines.' },
  { icon: 'sleepHeart', title: 'Manage stress', text: 'Breathing exercises, yoga, and adequate sleep reduce stress-related flare-ups. Seek support if anxiety affects your breathing.' },
  { icon: 'notes', title: 'Track your symptoms', text: 'Keep a simple symptom and peak-flow diary. Patterns reveal triggers early and help your doctor fine-tune treatment.' },
]

export default function Living() {
  return (
    <section className="section" id="living">
      <div className="container">
        <div className="center" style={{ marginBottom: 52 }}>
          <Reveal><span className="eyebrow"><i></i>Thriving, Not Just Coping</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">Living well with asthma</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">Well-controlled asthma shouldn't stop you from doing what you love. These habits make a real difference.</p>
          </Reveal>
        </div>
        <div className="living-grid">
          {TIPS.map((t, i) => (
            <Reveal key={t.title} delay={(i % 3) * 0.08} className="live-card">
              <span className="ic"><Icon name={t.icon} size={24} /></span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
