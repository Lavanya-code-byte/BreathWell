import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'

export default function PageHeader({ crumb, eyebrow, title, lede }) {
  return (
    <div className="page-head">
      <div className="container">
        <Reveal>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>{crumb}</span>
          </nav>
        </Reveal>
        <Reveal delay={0.06}>
          <span className="eyebrow"><i></i>{eyebrow}</span>
        </Reveal>
        <Reveal delay={0.12}><h1>{title}</h1></Reveal>
        {lede && <Reveal delay={0.18}><p className="ph-lede">{lede}</p></Reveal>}
      </div>
    </div>
  )
}
