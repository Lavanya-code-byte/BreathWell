import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const ZONES = [
  {
    cls: 'z-green', name: 'Green — Go', pf: 'Peak flow: 80–100% of your best', icon: 'check',
    points: [
      'Breathing is good, no cough or wheeze',
      'You sleep and exercise normally',
      'Action: keep taking your daily controller exactly as prescribed',
    ],
  },
  {
    cls: 'z-amber', name: 'Yellow — Caution', pf: 'Peak flow: 50–79% of your best', icon: 'alertTri',
    points: [
      'Cough, wheeze, chest tightness, or night waking',
      'Reliever helps, but symptoms keep returning',
      'Action: use reliever, follow your plan, contact your doctor within 24–48 hrs',
    ],
  },
  {
    cls: 'z-red', name: 'Red — Danger', pf: 'Peak flow: below 50% of your best', icon: 'alertTri',
    points: [
      'Severe breathlessness, cannot speak in full sentences',
      'Reliever is not working or not lasting',
      'Action: take reliever now and seek emergency care immediately',
    ],
  },
]

function Calculator() {
  const [best, setBest] = useState('')
  const [now, setNow] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)

  const calculate = () => {
    const b = parseFloat(best), n = parseFloat(now)
    setError(false)
    if (!b || !n || Number.isNaN(b) || Number.isNaN(n) || b < 50 || b > 900 || n < 50 || n > 900 || n > b * 1.05) {
      setError(true)
      setResult(null)
      return
    }
    const pct = Math.round((n / b) * 100)
    if (pct >= 80) {
      setResult({ pct, cls: 'rz-green', title: 'Green Zone — Well Controlled', msg: 'Your airways are doing well. Continue your daily controller exactly as prescribed and keep up normal activities. Recheck your peak flow if symptoms change.' })
    } else if (pct >= 50) {
      setResult({ pct, cls: 'rz-amber', title: 'Yellow Zone — Caution', msg: "Your asthma may be flaring. Take your reliever as your action plan directs, avoid known triggers, and contact your doctor within 24–48 hours to review your medicines." })
    } else {
      setResult({ pct, cls: 'rz-red', title: 'Red Zone — Danger', msg: 'This is a medical alert. Take your reliever now (1 puff every 30–60 seconds, up to 10 puffs) and seek emergency care immediately — call 108 / 102 (India) or your local emergency number.' })
    }
  }

  return (
    <Reveal className="calc-wrap" id="calculator">
      <div className="calc-form">
        <h3>Peak Flow Zone Calculator</h3>
        <p>
          Enter your personal best and today's peak-flow reading to see which zone you're in.
          Not sure of your personal best? Your doctor can help establish it over 2 weeks of twice-daily readings.
        </p>
        <div className="field">
          <label htmlFor="pfbest">Your personal best (L/min)</label>
          <input id="pfbest" type="number" min="50" max="900" placeholder="e.g. 400" inputMode="numeric" value={best} onChange={e => setBest(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pfnow">Today's reading (L/min)</label>
          <input id="pfnow" type="number" min="50" max="900" placeholder="e.g. 320" inputMode="numeric" value={now} onChange={e => setNow(e.target.value)} onKeyDown={e => e.key === 'Enter' && calculate()} />
        </div>
        <button className="btn btn-primary" onClick={calculate}>
          Calculate My Zone <Icon name="arrowRight" size={16} />
        </button>
        {error && <p className="err-msg">Please enter valid numbers (50–900); today's reading should be close to or below your best.</p>}
      </div>
      <div className="calc-result">
        {result ? (
          <div className={`result-zone ${result.cls}`}>
            <div className="r-pct">{result.pct}%</div>
            <h4>{result.title}</h4>
            <p>{result.msg}</p>
            <p style={{ marginTop: 12, fontSize: 12.5, opacity: 0.75 }}>Educational tool only — always follow the written action plan from your own doctor.</p>
          </div>
        ) : (
          <div className="result-empty">
            <div className="big-ic"><Icon name="activity" size={38} /></div>
            <h4 style={{ marginBottom: 6, fontSize: 17 }}>Your zone will appear here</h4>
            <p style={{ fontSize: 14 }}>Fill in the form and we'll show your zone — plus what to do next.</p>
          </div>
        )}
      </div>
    </Reveal>
  )
}

export default function ActionPlan() {
  return (
    <section className="section soft" id="action-plan">
      <div className="container">
        <div className="center" style={{ marginBottom: 52 }}>
          <Reveal><span className="eyebrow"><i></i>Traffic-Light System</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">The asthma action plan</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">A written action plan — made with your doctor — tells you exactly what to do each day and when symptoms flare. It uses three simple zones.</p>
          </Reveal>
        </div>

        <div className="grid zones">
          {ZONES.map((z, i) => (
            <Reveal key={z.name} delay={i * 0.08} className={`zone ${z.cls}`}>
              <div className="zhead"><span className="dot"></span><h3>{z.name}</h3></div>
              <span className="pf">{z.pf}</span>
              <ul>
                {z.points.map(pt => (
                  <li key={pt}><Icon name={z.icon} size={16} />{pt}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Calculator />

        <Reveal className="note-strip ai-note" style={{ marginTop: 34 }}>
          <span className="ic"><Icon name="sparkles" size={22} /></span>
          <p>
            <b>Want a personalised plan on paper?</b> The <Link to="/ai-tools" style={{ color: '#5b21b6', fontWeight: 700, textDecoration: 'underline' }}>AI Action Plan Generator</Link>
            creates a printable plan tailored to your medicines, triggers and peak flow — ready to review with your doctor.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
