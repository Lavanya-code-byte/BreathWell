import { useState } from 'react'
import Icon from '../Icon.jsx'
import { generatePlan } from '../../ai/engine.js'

const TRIGGER_OPTIONS = ['Dust mites', 'Pollen', 'Pet dander', 'Smoke', 'Air pollution', 'Cold air', 'Exercise', 'Strong odors', 'Stress', 'Weather changes']

const inputStyle = {
  width: '100%', padding: '12px 15px', borderRadius: 12, border: '1.5px solid var(--line)',
  fontSize: 14.5, fontFamily: 'inherit', outline: 'none', background: 'var(--bg-soft)', color: 'var(--ink)',
}
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }

export default function PlanGenerator() {
  const [form, setForm] = useState({
    name: '', ageGroup: 'Adult (18–64)', controller: '', reliever: '',
    personalBest: '', nightSymptoms: 'no', exerciseSymptoms: 'no', relieverFreq: '0',
    triggers: [],
  })
  const [plan, setPlan] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleTrigger = t =>
    set('triggers', form.triggers.includes(t) ? form.triggers.filter(x => x !== t) : [...form.triggers, t])

  const build = () => setPlan(generatePlan(form))

  const print = () => {
    document.body.classList.add('printing-plan')
    window.print()
    setTimeout(() => document.body.classList.remove('printing-plan'), 800)
  }

  return (
    <div className="analyzer-grid">
      {/* ------- form ------- */}
      <div className="an-form">
        <h4><Icon name="clipboard" size={18} style={{ display: 'inline', verticalAlign: '-3px', color: '#7c3aed' }} /> Your details</h4>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 16 }}>
          Fill in a few details and the AI will assemble a draft action plan you can print and review with your doctor.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle} htmlFor="pg-name">First name (optional)</label>
            <input id="pg-name" style={inputStyle} placeholder="e.g. Aarav" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-age">Age group</label>
            <select id="pg-age" style={inputStyle} value={form.ageGroup} onChange={e => set('ageGroup', e.target.value)}>
              <option>Child (under 12)</option>
              <option>Teen (12–17)</option>
              <option>Adult (18–64)</option>
              <option>Senior (65+)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-ctl">Controller inhaler (daily)</label>
            <input id="pg-ctl" style={inputStyle} placeholder="e.g. Budesonide + Formoterol" value={form.controller} onChange={e => set('controller', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-rel">Reliever inhaler (rescue)</label>
            <input id="pg-rel" style={inputStyle} placeholder="e.g. Salbutamol" value={form.reliever} onChange={e => set('reliever', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-pf">Peak flow personal best (L/min)</label>
            <input id="pg-pf" type="number" style={inputStyle} placeholder="e.g. 400" value={form.personalBest} onChange={e => set('personalBest', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-rf">Reliever puffs used per week</label>
            <select id="pg-rf" style={inputStyle} value={form.relieverFreq} onChange={e => set('relieverFreq', e.target.value)}>
              <option value="0">0–2 times (good control)</option>
              <option value="3">3–5 times (a warning sign)</option>
              <option value="6">6+ times / daily (see doctor soon)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-ns">Night waking from asthma?</label>
            <select id="pg-ns" style={inputStyle} value={form.nightSymptoms} onChange={e => set('nightSymptoms', e.target.value)}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="pg-es">Symptoms during exercise?</label>
            <select id="pg-es" style={inputStyle} value={form.exerciseSymptoms} onChange={e => set('exerciseSymptoms', e.target.value)}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <div style={{ margin: '18px 0 20px' }}>
          <label style={labelStyle}>My known triggers (tap to select)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TRIGGER_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => toggleTrigger(t)}
                className="sample-chip"
                style={form.triggers.includes(t) ? { background: '#5b21b6', color: '#fff', borderColor: '#5b21b6' } : undefined}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-ai" onClick={build}>Generate My Plan <Icon name="sparkles" size={16} /></button>
      </div>

      {/* ------- output ------- */}
      <div className="an-results">
        <h4><Icon name="printer" size={18} style={{ display: 'inline', verticalAlign: '-3px', color: '#7c3aed' }} /> Your AI-generated plan</h4>
        {!plan && (
          <div className="an-empty">
            <div className="big-ic"><Icon name="clipboard" size={34} /></div>
            <p>Your personalised, printable action plan will appear here after you fill in the form.</p>
          </div>
        )}
        {plan && <PlanOutput plan={plan} onPrint={print} />}
      </div>
    </div>
  )
}

function PlanOutput({ plan, onPrint }) {
  return (
    <div className="plan-output">
      {plan.flags.length > 0 && (
        <div className="an-banner warn" style={{ marginBottom: 14 }}>
          <Icon name="alertCircle" size={20} style={{ flex: 'none' }} />
          <p><b>AI noticed:</b> {plan.flags.join(' · ')} — these may signal under-controlled asthma. Show this plan to your doctor.</p>
        </div>
      )}

      <div className="paper printable-area" id="plan-print">
        <div className="paper-head">
          <div>
            <b>{plan.name === 'My' ? 'My' : `${plan.name}'s`} Asthma Action Plan</b>
            <small>BreatheWell · generated {plan.date} · {plan.ageGroup}</small>
          </div>
          <span className="paper-logo"><Icon name="lungs" size={20} /></span>
        </div>

        <div className="paper-zone green">
          <div className="pz-head"><span className="pz-dot"></span><b>GREEN — Every day</b><span className="pz-pf">{plan.green}</span></div>
          <ul>{plan.daily.map((d, i) => <li key={i}>✓ {d}</li>)}</ul>
        </div>

        <div className="paper-zone amber">
          <div className="pz-head"><span className="pz-dot"></span><b>YELLOW — Caution</b><span className="pz-pf">{plan.yellow}</span></div>
          <ul>{plan.yellowSteps.map((d, i) => <li key={i}>• {d}</li>)}</ul>
        </div>

        <div className="paper-zone red">
          <div className="pz-head"><span className="pz-dot"></span><b>RED — Emergency</b><span className="pz-pf">{plan.red}</span></div>
          <ul>{plan.redSteps.map((d, i) => <li key={i}>• {d}</li>)}</ul>
        </div>

        <p className="paper-foot">
          Draft plan for discussion — must be reviewed and approved by your doctor before use.
          Emergency: 108 / 102 (India) · 911 (US).
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onPrint} style={{ fontSize: 14, padding: '11px 20px' }}>
          <Icon name="printer" size={16} /> Print / Save PDF
        </button>
        <p style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center', margin: 0 }}>
          Take the printed plan to your next appointment for validation.
        </p>
      </div>
    </div>
  )
}
