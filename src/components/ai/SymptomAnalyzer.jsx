import { useState } from 'react'
import Icon from '../Icon.jsx'
import { analyzeSymptoms } from '../../ai/engine.js'

const SAMPLES = [
  'I cough every night and wake up wheezing',
  'I use my blue inhaler almost daily and get breathless climbing stairs',
  'Mild wheeze once a week when the weather turns cold',
  'Cannot breathe properly right now and my lips feel blue',
]

const TIER_LABEL = {
  good: 'Looks relatively mild — keep up your preventer routine',
  partly: 'Partly controlled pattern — worth a routine review',
  uncontrolled: 'Poorly controlled pattern — book an appointment soon',
  urgent: 'Possible urgent situation — seek medical care now',
}

export default function SymptomAnalyzer() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)

  const run = () => {
    if (!text.trim() || busy) return
    setBusy(true)
    setResult(null)
    // Simulated "AI thinking" for a natural feel
    setTimeout(() => {
      setResult(analyzeSymptoms(text))
      setBusy(false)
    }, 1100)
  }

  return (
    <div className="analyzer-grid">
      {/* ------- input ------- */}
      <div className="an-form">
        <h4><Icon name="brain" size={18} style={{ display: 'inline', verticalAlign: '-3px', color: '#7c3aed' }} /> Describe how you've been feeling</h4>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 12 }}>
          Write freely in plain words — mention symptoms, when they happen, how often, and how often you use your inhaler. The analyzer detects patterns from guideline control criteria.
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. For the past 2 weeks I've been waking up at night coughing. I use my blue inhaler almost every day, and I get breathless when walking fast…"
          aria-label="Describe your symptoms"
        />
        <div className="an-samples">
          <span>Try an example:</span>
          {SAMPLES.map(s => (
            <button key={s} className="sample-chip" onClick={() => { setText(s); setResult(null) }}>"{s}"</button>
          ))}
        </div>
        <button className="btn btn-ai" onClick={run} disabled={!text.trim() || busy}>
          {busy ? 'Analyzing…' : <>Analyze with AI <Icon name="sparkles" size={16} /></>}
        </button>
      </div>

      {/* ------- output ------- */}
      <div className="an-results">
        <h4><Icon name="clipboard" size={18} style={{ display: 'inline', verticalAlign: '-3px', color: '#7c3aed' }} /> AI analysis</h4>
        {busy && (
          <div className="an-card">
            <div className="analyzing"><span className="spin"></span> Reading your description…</div>
          </div>
        )}

        {!busy && !result && (
          <div className="an-empty">
            <div className="big-ic"><Icon name="sparkles" size={34} /></div>
            <p>Your personalized analysis will appear here — patterns detected, control estimate, and next steps.</p>
          </div>
        )}

        {!busy && result && <AnalysisReport result={result} />}
      </div>
    </div>
  )
}

function AnalysisReport({ result }) {
  if (result.nothingFound) {
    return (
      <div className="an-card">
        <h5><Icon name="alertCircle" size={16} /> Not enough detail</h5>
        <p style={{ fontSize: 14 }}>
          I couldn't recognise specific asthma symptoms in that description. Try mentioning things like
          <b> cough, wheeze, breathlessness, night waking, chest tightness</b>, or how often you use your reliever inhaler.
        </p>
      </div>
    )
  }

  const urgent = result.tier === 'urgent' || result.emergency
  return (
    <div>
      {(result.emergency || result.tier === 'urgent') && (
        <div className="an-banner danger">
          <Icon name="alertTri" size={22} style={{ flex: 'none' }} />
          <p><b>This may need urgent attention.</b> If you're struggling to breathe right now, sit upright, take your reliever (up to 10 puffs) and call 108 / 102 (India) or your local emergency number immediately.</p>
        </div>
      )}

      {result.redFlags.length > 0 && !urgent && (
        <div className="an-banner warn">
          <Icon name="alertCircle" size={22} style={{ flex: 'none' }} />
          <div>
            <b style={{ display: 'block', marginBottom: 2 }}>Warning signs detected in your description:</b>
            <p>{result.redFlags.join(' · ')}</p>
          </div>
        </div>
      )}

      <div className="an-card">
        <h5><Icon name="brain" size={16} style={{ color: '#7c3aed' }} /> What the AI understood</h5>
        <div className="an-tags">
          {result.symptomsFound.map(s => <span key={s} className="an-tag">{s}</span>)}
          {result.timing.map(s => <span key={s} className="an-tag" style={{ background: '#f3effd', borderColor: '#e3dafb', color: '#5b21b6' }}>{s}</span>)}
          {result.relieverMentioned && <span className="an-tag" style={{ background: 'var(--amber-bg)', borderColor: 'var(--amber-line)', color: 'var(--amber)' }}>Reliever use mentioned</span>}
        </div>
      </div>

      <div className="an-card">
        <h5><Icon name="activity" size={16} style={{ color: 'var(--teal-700)' }} /> Control estimate</h5>
        <div className="gauge">
          <span className="marker" style={{ left: `${result.gauge}%` }}></span>
        </div>
        <div className="gauge-lbls"><span>Well controlled</span><span>Partly</span><span>Poor control</span><span>Urgent</span></div>
        <p className="an-verdict">{TIER_LABEL[result.tier]}</p>
        {result.notes.length > 0 && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{result.notes.join(' · ')}</p>
        )}
      </div>

      <div className="an-card">
        <h5><Icon name="clipboard" size={16} style={{ color: 'var(--teal-700)' }} /> Recommended next steps</h5>
        <ul className="an-list">
          {result.advice.map((a, i) => (
            <li key={i}><Icon name="check" size={15} style={{ color: 'var(--teal-600)' }} /><span>{a}</span></li>
          ))}
        </ul>
      </div>

      <div className="an-card">
        <h5><Icon name="stethoscope" size={16} style={{ color: '#7c3aed' }} /> Smart questions for your doctor</h5>
        <ul className="an-list">
          {result.doctorQuestions.map((q, i) => (
            <li key={i}><span style={{ color: '#7c3aed', fontWeight: 800, flex: 'none' }}>{i + 1}.</span><span>{q}</span></li>
          ))}
        </ul>
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)' }}>
        Educational estimate based on your text — not a diagnosis. Only a doctor can assess your asthma control properly.
      </p>
    </div>
  )
}
