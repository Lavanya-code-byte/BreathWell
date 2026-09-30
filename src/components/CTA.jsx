import { useState } from 'react'
import Reveal from './Reveal.jsx'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = e => {
    e.preventDefault()
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setDone(true)
      setEmail('')
    }
  }

  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <div className="cta-inner">
            <div>
              <h2>Get asthma tips &amp; new AI guides in your inbox</h2>
              <p>Join thousands of patients and caregivers receiving practical, doctor-reviewed breathing tips once a month. No spam, unsubscribe anytime.</p>
            </div>
            <div>
              <form className="nl-form" onSubmit={submit}>
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button className="btn btn-white" type="submit">Subscribe</button>
              </form>
              {done && <p className="nl-msg">✓ Thank you! Please check your inbox to confirm your subscription.</p>}
              <p className="nl-small">By subscribing you agree to receive educational emails from BreatheWell.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
