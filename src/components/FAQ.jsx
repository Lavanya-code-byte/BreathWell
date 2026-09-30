import { useState } from 'react'
import Icon from './Icon.jsx'
import Reveal from './Reveal.jsx'

const FAQS = [
  {
    q: 'Is asthma curable?',
    a: "There is currently no cure, but asthma is highly manageable. With the right daily controller medicine, trigger control and a personal action plan, most people achieve complete symptom control. Children's symptoms sometimes ease as they grow, though asthma can return later in life.",
  },
  {
    q: 'Are steroid inhalers dangerous or addictive?',
    a: 'No — this is one of the most harmful asthma myths. Inhaled corticosteroids are NOT anabolic steroids, they are not addictive, and the doses reaching your body are very small because the medicine goes straight to the lungs. Untreated asthma is far more dangerous than these well-studied medicines.',
  },
  {
    q: 'Can children outgrow asthma?',
    a: "Some children — particularly those with mild, allergy-related wheeze — find symptoms fade in the teenage years. However, underlying airway sensitivity often remains and can return in adulthood. Never stop a child's preventer medicine without a doctor's advice.",
  },
  {
    q: 'Is it safe to exercise with asthma?',
    a: 'Yes — and it is encouraged. Many Olympic athletes have asthma. The key is good control: daily preventer, gradual warm-up, reliever before exercise if your doctor recommends it, and avoiding cold, dry or polluted air. If exercise regularly triggers symptoms, your overall control needs reviewing.',
  },
  {
    q: 'Is asthma contagious?',
    a: 'Not at all. You cannot catch asthma from another person. It develops from genetic tendency plus environmental factors. However, colds and flu — which ARE contagious — can trigger attacks in someone who already has asthma.',
  },
  {
    q: 'Does diet affect asthma?',
    a: 'No single food cures asthma, but a balanced diet rich in fruits, vegetables and whole grains supports lung health, and a healthy weight makes asthma easier to control. Sulphite preservatives trigger a minority. Discuss suspected food reactions with your doctor rather than cutting out food groups yourself.',
  },
  {
    q: 'Why is my asthma worse at night?',
    a: "Night-time worsening is extremely common — the body's anti-inflammatory hormones dip overnight, dust mites concentrate in bedding, and lying flat can trigger reflux. Regular night waking is a classic sign of poor control: raise it at your next doctor's visit.",
  },
  {
    q: 'How do I know if my treatment is working?',
    a: 'Well-controlled asthma means: daytime symptoms no more than twice a week, no night waking, no activity limits, and reliever needed no more than twice a week. If any box is unticked, your plan likely needs adjusting. Try the 60-second control check on this page.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="section soft" id="faq">
      <div className="container">
        <div className="center" style={{ marginBottom: 48 }}>
          <Reveal><span className="eyebrow"><i></i>Your Questions, Answered</span></Reveal>
          <Reveal delay={0.08}><h2 className="section-title">Frequently asked questions</h2></Reveal>
        </div>
        <Reveal className="faq-list" delay={0.14}>
          {FAQS.map((f, i) => {
            const open = openIdx === i
            return (
              <div className={`faq-item ${open ? 'open' : ''}`} key={f.q}>
                <button className="faq-q" onClick={() => setOpenIdx(open ? -1 : i)} aria-expanded={open}>
                  {f.q}
                  <span className="chev"><Icon name="chevronDown" size={16} /></span>
                </button>
                <div className="faq-a"><div><p>{f.a}</p></div></div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
