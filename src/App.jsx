import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import AboutAsthma from './pages/AboutAsthma.jsx'
import TreatmentPage from './pages/Treatment.jsx'
import ActionPlanPage from './pages/ActionPlanPage.jsx'
import AiToolsPage from './pages/AiToolsPage.jsx'
import Detect from './pages/Detect.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutAsthma />} />
          <Route path="treatment" element={<TreatmentPage />} />
          <Route path="action-plan" element={<ActionPlanPage />} />
          <Route path="ai-tools" element={<AiToolsPage />} />
          <Route path="detect" element={<Detect />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
