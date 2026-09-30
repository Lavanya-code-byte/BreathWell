import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Treatment from '../components/Treatment.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'

export default function TreatmentPage() {
  return (
    <>
      <PageHeader
        crumb="Treatment"
        eyebrow="Medicines & Technique"
        title="Treatment & Inhalers"
        lede="The two pillars of modern asthma therapy — quick-relief and daily control — plus advanced options for severe cases and the inhaler technique that makes them work."
      />
      <div className="page-body">
        <Treatment />

        <section className="section soft" id="treatment-faq">
          <div className="container">
            <div className="center" style={{ marginBottom: 40 }}>
              <Reveal><span className="eyebrow"><i></i>Keep Going</span></Reveal>
              <Reveal delay={0.08}><h2 className="section-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>Medicines work best inside a plan</h2></Reveal>
              <Reveal delay={0.16}>
                <p className="section-lede">Pair your treatment with the traffic-light action plan and know exactly when to step up, step down, or seek emergency care.</p>
              </Reveal>
            </div>
            <Reveal className="center" delay={0.2}>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <Link to="/action-plan" className="btn btn-primary">Build My Action Plan <Icon name="arrowRight" size={16} /></Link>
                <Link to="/ai-tools" className="btn btn-ai"><Icon name="sparkles" size={16} /> Try the AI Tools</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  )
}
