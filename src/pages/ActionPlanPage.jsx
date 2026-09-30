import PageHeader from '../components/PageHeader.jsx'
import ActionPlan from '../components/ActionPlan.jsx'
import SelfCheck from '../components/SelfCheck.jsx'
import Emergency from '../components/Emergency.jsx'

export default function ActionPlanPage() {
  return (
    <>
      <PageHeader
        crumb="Action Plan"
        eyebrow="Control & Emergency Readiness"
        title="Asthma Action Plan"
        lede="A traffic-light system for daily decisions, a peak-flow calculator, a 60-second control check — and the emergency steps that save lives."
      />
      <div className="page-body">
        <ActionPlan />
        <SelfCheck />
        <Emergency />
      </div>
    </>
  )
}
