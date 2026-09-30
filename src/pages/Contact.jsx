import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import FAQ from '../components/FAQ.jsx'
import CTA from '../components/CTA.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'

const INFO = [
  { icon: 'phone', title: 'Emergency (India)', text: '108 / 102 — for severe asthma attacks, call an ambulance immediately. US: 911.' },
  { icon: 'mail', title: 'Email us', text: 'support@breathewell.example — we reply to education questions within 2 working days.' },
  { icon: 'stethoscope', title: 'Medical advice', text: 'For personal medical decisions, consult a qualified physician or pulmonologist — this site cannot replace them.' },
]

const TOPICS = ['General question', 'Site feedback', 'AI tool issue', 'Content suggestion', 'Partnership']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [sent, setSent] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const submit = e => {
    e.preventDefault()
    if (form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim()) setSent(true)
  }

  return (
    <>
      <PageHeader
        crumb="Contact"
        eyebrow="We'd Love to Hear From You"
        title="Contact & FAQs"
        lede="Questions about the site or its tools? Browse the FAQs below or send us a message — and remember, our AI assistant is available 24/7 for asthma education questions."
      />
      <div className="page-body">
        <section className="section" id="contact-form" style={{ paddingBottom: 70 }}>
          <div className="container about-grid" style={{ gridTemplateColumns: '1fr 1.1fr' }}>
            <div>
              <Reveal><span className="eyebrow"><i></i>Get in Touch</span></Reveal>
              <Reveal delay={0.08}><h2 className="section-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>How to reach us</h2></Reveal>
              <Reveal delay={0.14}>
                <p style={{ color: 'var(--body)', marginBottom: 26 }}>
                  BreatheWell is an independent education project. For anything related to the website, use the form —
                  for your health, please see a doctor.
                </p>
              </Reveal>
              <div className="about-points" style={{ marginTop: 0 }}>
                {INFO.map((c, i) => (
                  <Reveal key={c.title} delay={0.16 + i * 0.07} className="about-point">
                    <span className="ic"><Icon name={c.icon} size={24} /></span>
                    <div><h4>{c.title}</h4><p>{c.text}</p></div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.18}>
              <div className="quiz-wrap" style={{ maxWidth: 'none', margin: 0 }}>
                {sent ? (
                  <div className="quiz-result result-zone rz-green" style={{ margin: 0, textAlign: 'center' }}>
                    <h4>✓ Message sent!</h4>
                    <p>Thank you, {form.name.split(' ')[0]} — we've received your note and will get back to you at <b>{form.email}</b> soon.</p>
                    <button className="btn btn-outline" style={{ marginTop: 18 }} onClick={() => { setForm({ name: '', email: '', topic: TOPICS[0], message: '' }); setSent(false) }}>
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <h3 style={{ fontSize: 20, marginBottom: 20 }}>Send us a message</h3>
                    <div className="cfield"><label htmlFor="c-name">Your name</label>
                      <input id="c-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Priya Sharma" required /></div>
                    <div className="cfield"><label htmlFor="c-email">Email address</label>
                      <input id="c-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required /></div>
                    <div className="cfield"><label htmlFor="c-topic">Topic</label>
                      <select id="c-topic" value={form.topic} onChange={e => set('topic', e.target.value)}>
                        {TOPICS.map(t => <option key={t}>{t}</option>)}
                      </select></div>
                    <div className="cfield"><label htmlFor="c-msg">Message</label>
                      <textarea id="c-msg" rows="5" value={form.message} onChange={e => set('message', e.target.value)} placeholder="How can we help?" required /></div>
                    <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                      Send Message <Icon name="send" size={16} />
                    </button>
                    <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
                      Please don't share sensitive personal medical details in this form.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        <FAQ />
        <CTA />
      </div>
    </>
  )
}
