import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'
import SymptomAnalyzer from './ai/SymptomAnalyzer.jsx'
import PlanGenerator from './ai/PlanGenerator.jsx'

const FEATURES = [
  {
    icon: 'message',
    title: 'Conversational AI Assistant',
    text: 'Ask anything, anytime — 30+ asthma topics understood in plain English, from myths to emergencies.',
    pills: ['Instant answers', 'Voice input', 'Spoken replies', 'Emergency detection'],
    action: 'chat',
    link: 'Open the chat →',
  },
  {
    icon: 'heart',
    title: 'AI Photo Level Check',
    text: 'Upload a photo of your lips, face or fingernails — on-device vision checks for warning tints and rates severity 1–4.',
    pills: ['Photo upload', 'Cyanosis check', 'Level 1–4', 'On-device & private'],
    action: 'detect',
    link: 'Open level check →',
  },
  {
    icon: 'clipboard',
    title: 'AI Action Plan Generator',
    text: 'Answer a few questions and get a printable green-yellow-red action plan tailored to your medicines and triggers.',
    pills: ['Personalized zones', 'Trigger-aware', 'Printable PDF', 'Doctor-ready'],
    action: 'plan',
    link: 'Build a plan ↓',
  },
]

export default function AiTools() {
  const { onOpenChat } = useOutletContext()
  const navigate = useNavigate()
  const [tab, setTab] = useState('analyzer')

  const handleFeature = f => {
    if (f.action === 'chat') onOpenChat()
    else if (f.action === 'detect') navigate('/detect')
    else if (f.action === 'analyzer') select('analyzer')
    else select('plan')
  }
  const select = t => {
    setTab(t)
    setTimeout(() => document.querySelector('.ai-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  return (
    <section className="section ai-section" id="ai-tools">
      <div className="ai-orbs">
        <span className="orb" style={{ width: 180, height: 180, background: 'rgba(124,58,237,.25)', top: '12%', left: '6%' }}></span>
        <span className="orb" style={{ width: 120, height: 120, background: 'rgba(20,184,196,.3)', top: '60%', right: '8%', animationDelay: '2s' }}></span>
        <span className="orb" style={{ width: 90, height: 90, background: 'rgba(52,211,162,.28)', top: '78%', left: '20%', animationDelay: '3.6s' }}></span>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="center">
          <Reveal><span className="eyebrow ai"><i></i>Powered by BreatheWell AI</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">AI tools that work for your lungs</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">
              Three intelligent tools to help you understand, monitor and manage asthma — running privately in your browser,
              24/7, completely free.
            </p>
          </Reveal>
        </div>

        <div className="ai-cards">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="ai-card">
              <span className="ai-ic"><Icon name={f.icon} size={26} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <div className="ai-pills">{f.pills.map(p => <span key={p}>{p}</span>)}</div>
              <button className="link" onClick={() => handleFeature(f)}>{f.link}</button>
            </Reveal>
          ))}
        </div>

        <Reveal className="ai-panel" delay={0.15}>
          <div className="ai-tabs">
            <button className={`ai-tab ${tab === 'analyzer' ? 'active' : ''}`} onClick={() => setTab('analyzer')}>
              <Icon name="brain" size={19} /> AI Symptom Analyzer
            </button>
            <button className={`ai-tab ${tab === 'plan' ? 'active' : ''}`} onClick={() => setTab('plan')}>
              <Icon name="clipboard" size={19} /> AI Action Plan Generator
            </button>
          </div>
          <div className="ai-tab-body" key={tab}>
            <span className="disclaimer-chip">
              <Icon name="alertCircle" size={15} />
              AI output is educational guidance only — always confirm with a qualified doctor.
            </span>
            {tab === 'analyzer' ? <SymptomAnalyzer /> : <PlanGenerator />}
          </div>
        </Reveal>

        <Reveal className="note-strip ai-note" delay={0.1} style={{ marginTop: 28, background: 'rgba(255,255,255,.07)', borderColor: 'rgba(255,255,255,.15)' }}>
          <span className="ic" style={{ background: 'rgba(255,255,255,.12)' }}><Icon name="shield" size={22} /></span>
          <p style={{ color: '#c9c2ec' }}>
            <b style={{ color: '#fff' }}>Private by design.</b> Everything you type into these tools is processed on your
            own device — nothing is uploaded, stored or shared.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
