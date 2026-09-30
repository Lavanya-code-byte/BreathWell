import PageHeader from '../components/PageHeader.jsx'
import About from '../components/About.jsx'
import Symptoms from '../components/Symptoms.jsx'
import Types from '../components/Types.jsx'
import Triggers from '../components/Triggers.jsx'
import Living from '../components/Living.jsx'

export default function AboutAsthma() {
  return (
    <>
      <PageHeader
        crumb="About Asthma"
        eyebrow="The Complete Guide"
        title="About Asthma"
        lede="Everything you need to understand your condition — what asthma is, how it shows up, the major types, the triggers that set it off, and how to live fully with it."
      />
      <div className="page-body">
        <About />
        <Symptoms />
        <Types />
        <Triggers />
        <Living />
      </div>
    </>
  )
}
