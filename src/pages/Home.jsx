import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import Stats from '../components/Stats.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'

const CARDS = [
  {
    to: '/about', icon: 'lungs', tint: '#eef9fb', color: '#0e7490',
    title: 'Understanding Asthma',
    text: 'What asthma is, why airways react, the 6 symptom patterns and all major types — explained in plain words.',
    tag: 'Start here',
  },
  {
    to: '/treatment', icon: 'chest', tint: '#e8f8f0', color: '#0f8a6d',
    title: 'Treatment & Inhalers',
    text: 'Reliever vs controller medicines, steroid myths busted, and the correct 5-step inhaler technique.',
    tag: 'Know your meds',
  },
  {
    to: '/action-plan', icon: 'clipboard', tint: '#fdf4e3', color: '#b4741a',
    title: 'Action Plan & Control',
    text: 'The green–yellow–red zone system, peak flow calculator, control self-check and emergency first-aid steps.',
    tag: 'Stay safe',
  },
  {
    to: '/detect', icon: 'heart', tint: '#f3effd', color: '#7c3aed',
    title: 'AI Level Check',
    text: 'Upload a photo of lips, face or fingernails — the AI checks for visible warning signs and rates severity 1–4.',
    tag: 'AI-powered',
  },
]

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />

      {/* Explore the center */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 48 }}>
            <Reveal><span className="eyebrow"><i></i>Explore the Center</span></Reveal>
            <Reveal delay={0.08}><h2 className="section-title">Your complete asthma education library</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="section-lede">Four deep-dive sections — plus interactive AI tools — built to take you from worried to confident.</p>
            </Reveal>
          </div>
          <div className="grid cards-4 explore-grid">
            {CARDS.map((c, i) => (
              <Reveal key={c.to} delay={i * 0.07} className="explore-card">
                <Link to={c.to}>
                  <span className="x-ic" style={{ background: c.tint, color: c.color }}><Icon name={c.icon} size={28} /></span>
                  <span className="x-tag" style={{ color: c.color }}>{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="x-link" style={{ color: c.color }}>Open section <Icon name="arrowRight" size={15} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI Detection banner */}
      <section className="section" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="container">
          <Reveal className="detect-cta">
            <div className="dc-left">
              <span className="dc-badge"><Icon name="sparkles" size={14} /> NEW · ON-DEVICE AI</span>
              <h2>Is it asthma? Let AI check.</h2>
              <p>Upload a photo of your lips, face or fingernails — BreatheWell AI scans it on your device for visible warning signs and estimates your asthma severity level (1–4) from your answers.</p>
              <div className="hero-actions" style={{ marginBottom: 0 }}>
                <Link to="/detect" className="btn btn-white">
                  <Icon name="heart" size={17} /> Try AI Level Check
                </Link>
                <Link to="/ai-tools" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff', background: 'transparent' }}>Explore AI Tools</Link>
              </div>
            </div>
            <div className="dc-right">
              <div className="dc-wave">
                {Array.from({ length: 26 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 13) * 0.09}s` }} />)}
              </div>
              <span className="dc-freq">on-device photo scan</span>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section soft" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="about-grid">
            <Reveal>
              <span className="eyebrow"><i></i>Why BreatheWell</span>
              <h2 className="section-title">Education is the most under-prescribed asthma treatment</h2>
              <p style={{ color: 'var(--body)', fontSize: 16.5 }}>
                Studies consistently show that patients who understand their condition use inhalers more correctly,
                avoid more triggers, and land in emergency rooms far less often. BreatheWell puts that knowledge —
                and practical AI tools — in one calm, trustworthy place.
              </p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link to="/about" className="btn btn-primary">Start Learning <Icon name="arrowRight" size={16} /></Link>
                <Link to="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="about-points" style={{ marginTop: 0 }}>
                <div className="about-point"><span className="ic"><Icon name="brain" size={24} /></span><div><h4>AI guidance, 24/7</h4><p>Ask questions any time, in plain words — no appointment needed.</p></div></div>
                <div className="about-point"><span className="ic"><Icon name="shield" size={24} /></span><div><h4>Evidence-based content</h4><p>Aligned with WHO and GINA guidance, written for real patients.</p></div></div>
                <div className="about-point"><span className="ic"><Icon name="check" size={24} /></span><div><h4>Action, not just theory</h4><p>Calculators, self-checks and printable plans you can use today.</p></div></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
