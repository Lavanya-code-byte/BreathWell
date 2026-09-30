import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { getResponse, DEFAULT_CHIPS } from '../../ai/engine.js'

/* ---------- text rendering helpers ---------- */
function stripMd(text) {
  return text.replace(/\*\*/g, '').replace(/•/g, '').replace(/[🚩✅⚠️💡😊💙🌿🟢🟡🔴]/g, '')
}

function renderInline(str) {
  return str.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : <span key={i}>{p}</span>
  )
}

/** Renders assistant text with **bold** and • bullet lines. Trusted content only. */
function renderText(text) {
  const out = []
  let bullets = []
  const flush = key => {
    if (!bullets.length) return
    out.push(
      <ul key={key}>
        {bullets.map((b, i) => (
          <li key={i}><span style={{ color: 'var(--teal-600)', flex: 'none', fontWeight: 800 }}>•</span><span>{renderInline(b)}</span></li>
        ))}
      </ul>
    )
    bullets = []
  }
  text.split('\n').forEach((line, i) => {
    const t = line.trim()
    if (t.startsWith('• ')) { bullets.push(t.slice(2)); return }
    flush('b' + i)
    if (t !== '') out.push(<p key={'p' + i} style={i > 0 ? { marginTop: 6 } : undefined}>{renderInline(t)}</p>)
  })
  flush('end')
  return out
}

const WELCOME = {
  role: 'assistant',
  text: `Hello! I'm **BreatheWell AI** — your personal asthma education assistant. 🌿\n\nAsk me anything: symptoms, triggers, inhalers, action plans, emergencies, or living with asthma. You can type, or tap the **microphone** and simply speak.\n\n*Educational only — never a substitute for your doctor or emergency care.*`,
  chips: DEFAULT_CHIPS,
}

export default function ChatWidget({ open, setOpen }) {
  const [messages, setMessages] = useState([WELCOME])
  const [chips, setChips] = useState(DEFAULT_CHIPS)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [ttsOn, setTtsOn] = useState(false)
  const [listening, setListening] = useState(false)

  const msgsRef = useRef(null)
  const inputRef = useRef(null)
  const recogRef = useRef(null)
  const finalRef = useRef('')
  const timerRef = useRef(null)

  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    const el = msgsRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
    // closing: stop voice/tts
    if (recogRef.current) { try { recogRef.current.stop() } catch (e) { void e } }
    if (ttsSupported) window.speechSynthesis.cancel()
    setListening(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const speak = text => {
    if (!ttsOn || !ttsSupported) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(stripMd(text))
    u.rate = 1.02
    window.speechSynthesis.speak(u)
  }

  const send = raw => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text }])
    setChips([])
    setTyping(true)

    const response = getResponse(text)
    const delay = Math.min(650 + response.text.length * 2.2, 2300)
    timerRef.current = setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, response])
      setChips(response.chips || [])
      speak(response.text)
    }, delay)
  }

  const toggleListen = () => {
    if (!SR) return
    if (listening) {
      try { recogRef.current?.stop() } catch (e) { void e }
      setListening(false)
      return
    }
    const rec = new SR()
    recogRef.current = rec
    rec.lang = 'en-IN'
    rec.interimResults = true
    rec.continuous = false
    finalRef.current = ''

    rec.onresult = e => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalRef.current += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setInput((finalRef.current + interim).trim())
    }
    rec.onend = () => {
      setListening(false)
      const said = finalRef.current.trim()
      if (said) send(said)
    }
    rec.onerror = () => setListening(false)

    setInput('')
    setListening(true)
    try { rec.start() } catch (e) { void e; setListening(false) }
  }

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open BreatheWell AI chat">
          <span className="ai-badge">AI</span>
          <Icon name="message" size={28} />
        </button>
      )}

      {open && (
        <div className="chat-panel" role="dialog" aria-label="BreatheWell AI assistant">
          <div className="chat-head">
            <span className="bot-ava"><Icon name="bot" size={26} /></span>
            <div className="names">
              <b>BreatheWell AI</b>
              <small><span className="on-dot"></span>Online · instant · runs on your device</small>
            </div>
            {ttsSupported && (
              <button
                className={`hbtn ${ttsOn ? 'on' : ''}`}
                onClick={() => { setTtsOn(v => !v); if (ttsOn) window.speechSynthesis.cancel() }}
                title={ttsOn ? 'Mute spoken answers' : 'Hear spoken answers'}
                aria-label="Toggle spoken answers"
              >
                <Icon name={ttsOn ? 'volume' : 'volumeX'} size={18} />
              </button>
            )}
            <button className="hbtn" onClick={() => setOpen(false)} aria-label="Close chat">
              <Icon name="x" size={18} />
            </button>
          </div>

          <div className="chat-msgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role} ${m.emergency ? 'emergency' : ''}`}>
                <span className="m-ava">
                  <Icon name={m.role === 'user' ? 'person' : m.emergency ? 'alertTri' : 'bot'} size={17} />
                </span>
                <div className="bubble">
                  {m.emergency && <Icon name="alertTri" size={18} style={{ color: 'var(--red)', marginBottom: 6 }} />}
                  {m.role === 'user' ? m.text : renderText(m.text)}
                  {m.emergency && <a className="b-cta" href="tel:108">Call 108 / 102 now</a>}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg assistant">
                <span className="m-ava"><Icon name="bot" size={17} /></span>
                <div className="bubble"><span className="typing-dots"><i></i><i></i><i></i></span></div>
              </div>
            )}
          </div>

          {chips.length > 0 && !typing && (
            <div className="chat-chips">
              {chips.map(c => <button key={c} className="q-chip" onClick={() => send(c)}>{c}</button>)}
            </div>
          )}

          {listening && <div className="listening-bar">Listening… speak your question now</div>}

          <div className="chat-input">
            {SR && (
              <button className={`cbtn mic ${listening ? 'listening' : ''}`} onClick={toggleListen} aria-label="Voice input" title="Speak your question">
                <Icon name="mic" size={19} />
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder={listening ? 'Listening…' : 'Ask about asthma…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              aria-label="Type your asthma question"
            />
            <button className="cbtn send" onClick={() => send()} disabled={!input.trim() || typing} aria-label="Send message">
              <Icon name="send" size={19} />
            </button>
          </div>
          <div className="chat-tiny">Education, not medical advice or diagnosis. Emergencies → call 108 / 102.</div>
        </div>
      )}
    </>
  )
}
