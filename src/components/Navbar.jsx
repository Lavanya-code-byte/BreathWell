import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

const LINKS = [
  { to: '/about', label: 'About Asthma' },
  { to: '/treatment', label: 'Treatment' },
  { to: '/action-plan', label: 'Action Plan' },
  { to: '/ai-tools', label: 'AI Tools' },
  { to: '/detect', label: 'AI Detection' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="topbar">
        <span className="tb-item"><Icon name="alertCircle" size={14} /> <strong>Emergency?</strong> Severe asthma attack → call <a href="tel:108">108 / 102</a> (India) · <a href="tel:911">911</a> (US)</span>
      </div>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand" aria-label="BreatheWell home">
            <span className="logo"><Icon name="lungs" size={24} /></span>
            <span className="brand-text">
              BreatheWell
              <small>AI Asthma Education Center</small>
            </span>
          </Link>

          <nav className="nav-center" aria-label="Main navigation">
            <ul className="nav-links">
              <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
              {LINKS.map(l => {
                const highlight = l.to === '/detect'
                return (
                  <li key={l.to}>
                    <NavLink to={l.to} className={({ isActive }) => `${isActive ? 'active' : ''} ${highlight ? 'nav-highlight' : ''}`}>
                      {l.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="nav-actions">
            <button className="btn btn-ai nav-ask" onClick={onOpenChat}>
              <Icon name="sparkles" size={16} /> Ask AI
            </button>
            <button className="hamburger" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && setMobileOpen(false)}>
        <div className="mobile-panel">
          <div className="mp-head">
            <span className="brand-mp"><Icon name="lungs" size={20} /> BreatheWell</span>
            <button className="close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <Icon name="x" size={20} />
            </button>
          </div>
          <nav>
            <NavLink to="/" end>Home</NavLink>
            {LINKS.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
            <a onClick={() => { setMobileOpen(false); navigate('/action-plan#emergency') }} style={{ cursor: 'pointer', color: 'var(--red)' }}>🚨 Emergency Guide</a>
            <button className="btn btn-ai" onClick={() => { setMobileOpen(false); onOpenChat() }}>
              <Icon name="sparkles" size={16} /> Ask BreatheWell AI
            </button>
          </nav>
        </div>
      </div>
    </>
  )
}
