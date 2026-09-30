import { Link, useOutletContext } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

export default function Hero() {
  const { onOpenChat } = useOutletContext()

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div>
          <Reveal><span className="eyebrow ai"><i></i>AI-Powered Patient Education Hub</span></Reveal>
          <Reveal delay={0.08}>
            <h1>Every breath matters. <span className="hl">Take control</span> of your asthma.</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lede">
              Clear, trustworthy education for people living with asthma — now with a built-in
              AI assistant that answers your questions, analyzes your symptoms and builds your
              personal action plan. Free, instant, and always available.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="hero-actions">
              <button className="btn btn-ai" onClick={onOpenChat}>
                <Icon name="bot" size={18} /> Chat with BreatheWell AI
              </button>
              <Link to="/about" className="btn btn-outline">Explore Topics</Link>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <Link to="/ai-tools" className="hero-ai-link">
              <Icon name="sparkles" size={15} />
              Try the AI Symptom Analyzer &amp; Action Plan Generator →
            </Link>
          </Reveal>
          <Reveal delay={0.36}>
            <div className="hero-trust">
              <div className="trust-avatars">
                <span style={{ background: '#0e7490' }}>RK</span>
                <span style={{ background: '#14b8a6' }}>AS</span>
                <span style={{ background: '#4d5fa8' }}>MP</span>
                <span style={{ background: '#0f8a6d' }}>+</span>
              </div>
              <p>
                <b>Trusted by patients &amp; caregivers</b>
                <span className="stars">★★★★★</span> Content aligned with WHO &amp; GINA guidance.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="hero-visual">
          <div className="float-chip chip1">
            <span className="ic" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}><Icon name="check" size={22} /></span>
            <span><b>Green Zone</b><small>Symptoms under control</small></span>
          </div>
          <button className="float-chip chip3" onClick={onOpenChat} aria-label="Open AI chat">
            <span><b>Ask me anything</b><small>AI assistant · online</small></span>
            <Icon name="sparkles" size={20} />
          </button>
          <div className="hero-card">
            <svg className="hero-ill" viewBox="0 0 420 380" fill="none" role="img" aria-label="Illustration of healthy lungs and airways">
              <defs>
                <linearGradient id="lungL" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#bdeef4" /><stop offset="1" stopColor="#7fd8e2" />
                </linearGradient>
                <linearGradient id="lungR" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#a9ecdf" /><stop offset="1" stopColor="#67d6c0" />
                </linearGradient>
                <linearGradient id="trach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0e7490" /><stop offset="1" stopColor="#14b8c4" />
                </linearGradient>
              </defs>
              <circle cx="210" cy="190" r="168" fill="#eef9fb" />
              <circle cx="210" cy="190" r="128" fill="#e2f5f8" />
              <path d="M210 40 v88" stroke="url(#trach)" strokeWidth="20" strokeLinecap="round" />
              <path d="M196 128 C150 122 108 140 92 190 C76 240 82 292 96 316 C104 330 122 334 142 330 C172 324 192 296 196 258 Z" fill="url(#lungL)" />
              <path d="M224 128 C270 122 312 140 328 190 C344 240 338 292 324 316 C316 330 298 334 278 330 C248 324 228 296 224 258 Z" fill="url(#lungR)" />
              <path d="M210 128 C210 150 196 158 178 170 C164 180 156 194 152 210 M178 170 C170 190 170 208 174 226 M152 210 C146 226 146 242 150 256" stroke="#0e7490" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M210 128 C210 150 224 158 242 170 C256 180 264 194 268 210 M242 170 C250 190 250 208 246 226 M268 210 C274 226 274 242 270 256" stroke="#0f8a6d" strokeWidth="7" strokeLinecap="round" fill="none" />
              <g strokeLinecap="round">
                <path d="M118 76 q14 -12 30 -4" stroke="#7fd8e2" strokeWidth="6" fill="none" />
                <path d="M282 66 q16 -10 32 0" stroke="#67d6c0" strokeWidth="6" fill="none" />
                <circle cx="96" cy="118" r="6" fill="#14b8c4" />
                <circle cx="330" cy="112" r="6" fill="#34d3a2" />
                <circle cx="60" cy="200" r="5" fill="#9fe6ee" />
                <circle cx="362" cy="196" r="5" fill="#8fe3cf" />
                <circle cx="140" cy="330" r="6" fill="#67d6c0" />
                <circle cx="286" cy="334" r="6" fill="#14b8c4" />
              </g>
            </svg>
          </div>
          <div className="float-chip chip2">
            <span className="ic" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}><Icon name="activity" size={22} /></span>
            <span><b>Peak Flow 88%</b><small>Personal best tracking</small></span>
          </div>
        </Reveal>
      </div>
      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 55 C240 95 480 10 720 35 C960 60 1200 90 1440 45 L1440 92 L0 92 Z" fill="#fff" />
      </svg>
    </section>
  )
}
