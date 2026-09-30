import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import { analyzeImageFile } from '../ai/imageAnalyze.js'
import { useOutletContext } from 'react-router-dom'

/* ---------------- severity questions ---------------- */
const QUESTIONS = [
  {
    id: 'day', q: 'How often do you get daytime symptoms (cough, wheeze, breathlessness)?',
    opts: [
      { t: 'Rarely / never', s: 0 }, { t: 'Up to 2 days/week', s: 1 }, { t: 'More than 2 days/week', s: 2 }, { t: 'Every day', s: 3 },
    ],
  },
  {
    id: 'night', q: 'How often does asthma wake you at night?',
    opts: [
      { t: 'Never', s: 0 }, { t: 'Less than once a month', s: 1 }, { t: 'Once a week or more', s: 2 }, { t: 'Most nights', s: 3 },
    ],
  },
  {
    id: 'reliever', q: 'How often do you need your reliever (blue) inhaler?',
    opts: [
      { t: 'Rarely / never', s: 0 }, { t: 'Up to 2× a week', s: 1 }, { t: 'Most days', s: 2 }, { t: 'Several times a day', s: 3 },
    ],
  },
  {
    id: 'limit', q: 'How much does asthma limit your normal activities?',
    opts: [
      { t: 'Not at all', s: 0 }, { t: 'Slightly', s: 1 }, { t: 'Moderately', s: 2 }, { t: 'Severely', s: 3 },
    ],
  },
]

const LEVELS = [
  {
    max: 1, key: 'intermittent', num: 1, name: 'Level 1 · Intermittent', cls: 'lv1',
    text: 'Your answers suggest symptoms are infrequent (≤2 days a week, minimal night waking). This pattern resembles Intermittent asthma — the mildest level. Keep triggers in check and review with a doctor at least yearly.',
  },
  {
    max: 3, key: 'mild', num: 2, name: 'Level 2 · Mild Persistent', cls: 'lv2',
    text: 'Symptoms appear more than twice a week but not daily, with minor limitations — a Mild Persistent pattern. Daily or as-needed controller therapy usually brings this to full control. Book a routine review.',
  },
  {
    max: 6, key: 'moderate', num: 3, name: 'Level 3 · Moderate Persistent', cls: 'lv3',
    text: 'Daily symptoms and/or weekly night waking point to a Moderate Persistent pattern. This level needs regular controller medication and a written action plan — please book an appointment soon to review treatment.',
  },
  {
    max: 12, key: 'severe', num: 4, name: 'Level 4 · Severe (uncontrolled pattern)', cls: 'lv4',
    text: 'Constant symptoms, frequent night waking and heavy reliever use are the signature of a Severe / very poorly controlled pattern. Please arrange a medical review within days — and seek urgent care for any emergency signs (trouble speaking, blue lips).',
  },
]

const STATUS_LINES = [
  'Reading photo…',
  'Mapping skin & lip regions…',
  'Analyzing color across lip area…',
  'Scanning for bluish / dusky tint…',
  'Checking nail-bed hue…',
  'Scoring severity pattern…',
]

export default function Detect() {
  const { onOpenChat } = useOutletContext()
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState('')
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState({})
  const [stage, setStage] = useState('upload')      // upload | analyzing | done
  const [statusIdx, setStatusIdx] = useState(0)
  const [photoFindings, setPhotoFindings] = useState(null)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  /* rotating status lines while analyzing */
  useEffect(() => {
    if (stage !== 'analyzing') return
    const iv = setInterval(() => setStatusIdx(i => (i + 1) % STATUS_LINES.length), 500)
    return () => clearInterval(iv)
  }, [stage])

  const acceptFile = f => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP…), not audio or other formats.')
      return
    }
    setError('')
    setResult(null)
    setPhotoFindings(null)
    setStage('upload')
    setAnswers(prev => prev) // keep answers
    if (preview) URL.revokeObjectURL(preview)
    const url = URL.createObjectURL(f)
    setFile(f)
    setFileName(f.name || 'Photo')
    setPreview(url)
  }

  const answeredCount = Object.keys(answers).length
  const answeredAll = answeredCount === QUESTIONS.length
  const pick = (id, s) => setAnswers(a => ({ ...a, [id]: s }))

  const runAnalysis = async () => {
    if (!file || !answeredAll) return
    setError('')
    setStage('analyzing')
    setStatusIdx(0)
    const started = Date.now()
    try {
      const { findings } = await analyzeImageFile(file)
      // let the scan animation play for UX
      const minWait = 2800 - (Date.now() - started)
      if (minWait > 0) await new Promise(r => setTimeout(r, minWait))
      const res = buildResult(findings, answers)
      setPhotoFindings(findings)
      setResult(res)
      setStage('done')
    } catch (err) {
      setStage('upload')
      setError(err.message || 'Could not analyze this photo. Try another image (JPG/PNG).')
    }
  }

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null); setPreview(''); setResult(null); setPhotoFindings(null)
    setStage('upload'); setError('')
  }

  return (
    <>
      <PageHeader
        crumb="AI Detection"
        eyebrow="Upload a Photo"
        title="AI Asthma Level Check"
        lede="Upload a close-up photo of your lips, face or fingernails (or the affected person's). The AI scans it on your device for bluish tint and other visible signs, then combines your symptom answers to estimate a severity level."
      />
      <div className="page-body">
        <section className="section" style={{ paddingTop: 64 }}>
          <div className="container">
            <Reveal className="detect-panel">
              {/* steps */}
              <div className="d-steps">
                {['Upload photo', '4 questions', 'Your level'].map((s, i) => {
                  const active = (stage === 'upload' && i <= 1) || (stage === 'analyzing' && i === 1) || (stage === 'done' && i === 2)
                  const doneS = (stage !== 'upload' && i === 0) || (stage === 'done' && i <= 1)
                  return (
                    <div key={s} className={`d-step ${active ? 'on' : ''} ${doneS ? 'done' : ''}`}>
                      <span className="d-n">{doneS ? <Icon name="check" size={13} /> : i + 1}</span>{s}
                    </div>
                  )
                })}
              </div>

              <div className="detect-grid">
                {/* ---------- left: photo ---------- */}
                <div>
                  <h4 className="d-h"><Icon name="person" size={17} style={{ color: '#7c3aed' }} /> Photo of lips, face or fingernails</h4>

                  {!file && stage === 'upload' && (
                    <label
                      className={`upzone ${drag ? 'drag' : ''}`}
                      onDragOver={e => { e.preventDefault(); setDrag(true) }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={e => { e.preventDefault(); setDrag(false); acceptFile(e.dataTransfer.files?.[0]) }}
                    >
                      <input ref={inputRef} type="file" accept="image/*" hidden onChange={e => acceptFile(e.target.files?.[0])} />
                      <span className="up-ic"><Icon name="heart" size={34} /></span>
                      <b>Drop a photo here</b>
                      <p>or click to browse — JPG, PNG, WEBP · a clear close-up of the lips and surrounding skin in good daylight works best (no beauty filters)</p>
                    </label>
                  )}

                  {!file && stage === 'upload' && (
                    <div className="d-photo-sample">
                      <Icon name="alertCircle" size={16} style={{ color: 'var(--amber)', flex: 'none', marginTop: 2 }} />
                      <p><b>Tip:</b> natural window light, lips relaxed, no lipstick or filter, camera 20–30 cm away. For a child, ask them to breathe out gently.</p>
                    </div>
                  )}

                  {file && (
                    <div className="img-wrap">
                      <img src={preview} alt="Uploaded for asthma screening" className="d-photo" />
                      {stage === 'analyzing' && (
                        <>
                          <div className="scanline" />
                          <div className="scan-status"><span className="spin"></span>{STATUS_LINES[statusIdx]}</div>
                        </>
                      )}
                      {stage === 'upload' && !result && (
                        <button className="fc-x photo-x" onClick={reset} aria-label="Remove photo"><Icon name="x" size={15} /></button>
                      )}
                      <div className="img-caption">
                        <Icon name="shield" size={14} style={{ color: 'var(--mint)' }} />
                        {fileName} · analyzed on your device only
                      </div>
                    </div>
                  )}

                  {error && <p className="d-error"><Icon name="alertCircle" size={15} style={{ display: 'inline', verticalAlign: '-2px' }} /> {error}</p>}

                  {file && stage === 'upload' && !result && (
                    <button className="btn btn-ai" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={runAnalysis} disabled={!answeredAll}>
                      <Icon name="sparkles" size={16} />
                      {answeredAll ? 'Analyze & Get My Level' : `Answer ${QUESTIONS.length - answeredCount} more question${QUESTIONS.length - answeredCount > 1 ? 's' : ''} →`}
                    </button>
                  )}
                </div>

                {/* ---------- right: questions ---------- */}
                <div>
                  <h4 className="d-h"><Icon name="clipboard" size={17} style={{ color: '#7c3aed' }} /> Symptom pattern (past 4 weeks)</h4>
                  {QUESTIONS.map((q, qi) => (
                    <div className="d-q" key={q.id}>
                      <p>{qi + 1}. {q.q}</p>
                      <div className="d-opts">
                        {q.opts.map(o => (
                          <button
                            key={o.t}
                            className={`d-opt ${answers[q.id] === o.s ? 'sel' : ''}`}
                            onClick={() => pick(q.id, o.s)}
                          >{o.t}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="quiz-note" style={{ marginTop: 14, marginBottom: 0, fontSize: 12.5 }}>
                    🔒 The photo and answers are processed <b>only on your device</b> — nothing is uploaded or stored.
                  </div>
                </div>
              </div>

              {/* ---------- results ---------- */}
              {result && stage === 'done' && (
                <DetectResult result={result} findings={photoFindings} onReset={reset} onOpenChat={onOpenChat} />
              )}
            </Reveal>

            <Reveal delay={0.1} className="note-strip ai-note" style={{ marginTop: 32 }}>
              <span className="ic"><Icon name="brain" size={22} /></span>
              <p>
                <b>How it works:</b> the engine maps skin and lip regions in your photo and measures how much of that area
                carries a bluish or dusky hue — the visible sign doctors call <b>cyanosis</b>, which can appear when oxygen
                is very low. Your answers are then matched against the standard severity levels used in asthma guidelines
                (intermittent → severe). A photo can <b>never</b> prove or rule out asthma — only a doctor with <b>spirometry</b> can.
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  )
}

/* ---------------- result logic ---------------- */
function buildResult(findings, answers) {
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  let level = LEVELS.find(l => score <= l.max) || LEVELS[3]

  // photo escalation
  let urgent = false
  if (findings.cyanosisFlag) {
    urgent = true
    if (level.num < 3) level = LEVELS[2] // at least moderate if bluish tint is strong
  }
  return { score, level, urgent, susp: findings.cyanosisSuspect }
}

/* ---------------- result rendering ---------------- */
function DetectResult({ result, findings, onReset, onOpenChat }) {
  const L = result.level
  return (
    <div className="d-result">
      {result.urgent && (
        <div className="an-banner danger" style={{ marginBottom: 18 }}>
          <Icon name="alertTri" size={22} style={{ flex: 'none' }} />
          <p><b>Bluish tint detected in the photo.</b> Bluish lips or nails can signal dangerously low oxygen. If this is what you look like <u>right now</u> with breathing difficulty — call <b>108 / 102</b> (India) or your local emergency number immediately.</p>
        </div>
      )}
      {result.susp && !result.urgent && (
        <div className="an-banner warn" style={{ marginBottom: 18 }}>
          <Icon name="alertCircle" size={22} style={{ flex: 'none' }} />
          <p><b>Mild dusky tint noticed.</b> Lighting can fool the camera, but it's worth mentioning to your doctor — especially if lips ever look blue or grey during symptoms.</p>
        </div>
      )}

      {/* level meter */}
      <div className={`result-zone lvl-card ${L.cls}`}>
        <div className="d-result-top">
          <div>
            <span className="d-tier">Estimated severity level</span>
            <h4 style={{ marginTop: 6 }}>{L.name}</h4>
          </div>
          <div className="d-score">{L.num}<small>/4</small></div>
        </div>

        <div className="lvl-track">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`lvl-seg s${n} ${L.num >= n ? 'on' : ''}`}>
              <span className="lvl-dot">{n}</span>
              <span className="lvl-name">{['Intermittent', 'Mild', 'Moderate', 'Severe'][n - 1]}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 16 }}>{L.text}</p>
      </div>

      {/* photo findings */}
      <div className="d-findings">
        <div className="d-find">
          <Icon name="heart" size={20} style={{ color: 'var(--teal-700)' }} />
          <b>{findings.cyanPct}%</b>
          <span>bluish tint in lip/skin area</span>
        </div>
        <div className="d-find">
          <Icon name="person" size={20} style={{ color: 'var(--teal-700)' }} />
          <b>{findings.lipPct > 0 ? 'Found' : 'Not clear'}</b>
          <span>lip region detection</span>
        </div>
        <div className="d-find">
          <Icon name="activity" size={20} style={{ color: 'var(--teal-700)' }} />
          <b>{result.score}/12</b>
          <span>symptom pattern score</span>
        </div>
        <div className="d-find">
          <Icon name="check" size={20} style={{ color: 'var(--teal-700)' }} />
          <b>{findings.issues.length === 0 ? 'Good' : findings.issues.length + ' note' + (findings.issues.length > 1 ? 's' : '')}</b>
          <span>photo quality check</span>
        </div>
      </div>

      {findings.issues.length > 0 && (
        <ul className="an-list" style={{ marginBottom: 18 }}>
          {findings.issues.map((t, i) => (
            <li key={i}><Icon name="alertCircle" size={15} style={{ color: 'var(--amber)' }} /><span>{t} <b>The level above ignores photo quality problems.</b></span></li>
          ))}
        </ul>
      )}

      <p className="d-disclaimer">
        ⚠️ <b>Screening only — not a medical diagnosis.</b> Cameras and lighting can easily mimic or hide bluish tint,
        and true asthma severity is set by a doctor using <b>spirometry</b> and your full history. Share this estimate
        at your appointment; if your lips look blue right now or breathing is hard, treat it as an emergency.
      </p>

      <div className="hero-actions" style={{ marginTop: 8 }}>
        <button className="btn btn-primary" onClick={onReset}><Icon name="heart" size={16} /> Check another photo</button>
        <button className="btn btn-ai" onClick={onOpenChat}><Icon name="sparkles" size={16} /> Discuss with BreatheWell AI</button>
      </div>
    </div>
  )
}
