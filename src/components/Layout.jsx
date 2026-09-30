import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import ChatWidget from './ai/ChatWidget.jsx'
import Icon from './Icon.jsx'

function ToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`to-top ${show ? 'show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <Icon name="arrowUp" size={20} />
    </button>
  )
}

export default function Layout() {
  const [chatOpen, setChatOpen] = useState(false)
  const { pathname, hash } = useLocation()

  /* scroll to top (or to #anchor) on every route change */
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  const openChat = () => setChatOpen(true)

  return (
    <>
      <Navbar onOpenChat={openChat} />
      <main className="page-anim" key={pathname}>
        <Outlet context={{ onOpenChat: openChat }} />
      </main>
      <Footer />
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
      <ToTop />
    </>
  )
}
