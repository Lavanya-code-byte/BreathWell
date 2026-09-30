import { useState } from 'react'
import Reveal from './Reveal.jsx'

const QUESTIONS = [
  { id: 1, text: 'Have you had daytime asthma symptoms (cough, wheeze, breathlessness) more than twice a week?' },
  { id: 2, text: 'Have you woken up at night because of your asthma?' },
  { id: 3, text: 'Have you needed your reliever (blue) inhaler more than twice a week?' },
  { id: 4, text: 'Has asthma limited your normal activities, work or exercise?' },
]

const RESULTS = {
  green: {
    cls: 'rz-green', title: 'Likely well controlled',
    msg: 'Great news — over the past 4 weeks your answers suggest asthma is not interfering with your life. Keep taking your controller daily, keep triggers in check, and review your plan with your doctor at least once a year.',
  },
  amber: {
    cls: 'rz-amber', title: 'Possibly partly controlled',
    msg: 'Your answers suggest asthma is affecting you more than it should. Modern treatment aims for zero night waking and almost no symptoms — book an appointment with your doctor soon to review your inhaler plan and technique.',
  },
  red: {
    cls: 'rz-red', title: 'Suggests poor control — see a doctor soon',
    msg: 'Your answers indicate asthma is significantly affecting your daily life. Please arrange a medical review as soon as possible — your treatment plan likely needs adjusting. If you have severe symptoms right now, use your reliever and follow the emergency guidance on this page.',
  },
}

export default function SelfCheck() {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const done = Object.keys(answers).length === QUESTIONS.length

  const answer = (id, val) => {
    setAnswers(a => ({ ...a, [id]: val }))
    setResult(null)
  }

  const showResult = () => {
    const yes = Object.values(answers).filter(v => v === 'yes').length
    const key = yes === 0 ? 'green' : yes <= 2 ? 'amber' : 'red'
    setResult({ ...RESULTS[key], yes })
  }

  return (
    <section className="section" id="self-check">
      <div className="container">
        <div className="center" style={{ marginBottom: 44 }}>
          <Reveal><span className="eyebrow"><i></i>60-Second Check</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">How well controlled is your asthma?</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="section-lede">Answer 4 quick questions about the last 4 weeks — based on the control questions used in international asthma guidelines.</p>
          </Reveal>
        </div>

        <Reveal className="quiz-wrap" delay={0.2}>
          <div className="quiz-note">This is an educational self-check, <b>not a diagnosis</b>. Always discuss the result with your doctor.</div>
          {QUESTIONS.map(q => (
            <div className="q-row" key={q.id}>
              <p>{q.id}. {q.text}</p>
              <div className="yn">
                <button className={answers[q.id] === 'yes' ? 'sel-yes' : ''} onClick={() => answer(q.id, 'yes')}>Yes</button>
                <button className={answers[q.id] === 'no' ? 'sel-no' : ''} onClick={() => answer(q.id, 'no')}>No</button>
              </div>
            </div>
          ))}
          <div className="quiz-foot">
            <button className="btn btn-primary" disabled={!done} onClick={showResult}>See My Result</button>
            {!done && <p style={{ marginTop: 12, fontSize: 13.5, color: 'var(--muted)' }}>Answer all 4 questions to unlock your result.</p>}
          </div>
          {result && (
            <div className={`quiz-result result-zone ${result.cls}`}>
              <h4>{result.title} <span style={{ fontWeight: 600, fontSize: 13.5, opacity: 0.7 }}>({result.yes} of 4 flags)</span></h4>
              <p>{result.msg}</p>
              <p style={{ marginTop: 10, fontSize: 12.5, opacity: 0.75 }}>Educational self-check — not a medical diagnosis.</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
