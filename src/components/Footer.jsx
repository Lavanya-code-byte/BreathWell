import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <span className="flogo"><Icon name="lungs" size={22} /></span>
              BreatheWell
            </div>
            <p className="foot-desc">
              Empowering people with asthma — and those who care for them — with clear, trustworthy,
              AI-enhanced education.
            </p>
          </div>
          <div className="foot-col">
            <h4>LEARN</h4>
            <ul>
              <li><Link to="/about">What is Asthma?</Link></li>
              <li><Link to="/about" >Symptoms & Types</Link></li>
              <li><Link to="/about">Triggers & Living Well</Link></li>
              <li><Link to="/treatment">Treatments</Link></li>
              <li><Link to="/action-plan">Emergency Guide</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>TAKE ACTION</h4>
            <ul>
              <li><Link to="/action-plan">Asthma Action Plan</Link></li>
              <li><Link to="/action-plan#calculator">Peak Flow Calculator</Link></li>
              <li><Link to="/ai-tools">AI Symptom Analyzer</Link></li>
              <li><Link to="/detect">AI Asthma Detection</Link></li>
              <li><Link to="/action-plan#self-check">Control Self-Check</Link></li>
              <li><Link to="/contact">FAQs & Contact</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>GET HELP</h4>
            <ul className="foot-contact">
              <li><Icon name="phone" size={16} />Emergency (India): 108 / 102</li>
              <li><Icon name="mail" size={16} />support@breathewell.example</li>
              <li><Icon name="mapPin" size={16} />Ask your local doctor or pulmonologist for a personalised plan</li>
            </ul>
          </div>
        </div>
        <div className="footnote">
          <p className="fdisclaimer">
            <b>Medical disclaimer:</b> The content and AI tools on this website are for general educational purposes
            only and do not constitute medical advice, diagnosis or treatment. Always seek the advice of a qualified
            physician with any questions about a medical condition. Never disregard professional medical advice or
            delay seeking it because of something you have read here. Statistics are approximate figures from WHO
            and GINA public reports.
          </p>
          <div className="row">
            <span>© {new Date().getFullYear()} BreatheWell — AI Asthma Care &amp; Patient Education Center.</span>
            <span>Built with care for every breath.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
