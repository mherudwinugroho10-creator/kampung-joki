import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Completed from './pages/Completed'
import Analytics from './pages/Analytics'

const titles = {
  dashboard: { title:'Dashboard',     sub:'Selamat datang kembali 👋' },
  orders:    { title:'Semua Order',   sub:'Kelola seluruh data order Anda' },
  completed: { title:'Order Selesai', sub:'Rekap order yang telah done' },
  analytics: { title:'Analitik',      sub:'Performa bisnis Kampung Joki' },
}

export default function App() {
  const [page,      setPage]      = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handle = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
    }
    window.addEventListener('resize', handle)
    handle()
    return () => window.removeEventListener('resize', handle)
  }, [])

  const renderPage = () => {
    switch(page) {
      case 'dashboard':  return <Dashboard setPage={setPage} />
      case 'orders':     return <Orders />
      case 'completed':  return <Completed />
      case 'analytics':  return <Analytics />
      default:           return <Dashboard setPage={setPage} />
    }
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position:'fixed', inset:0,
            background:'rgba(0,0,0,0.5)',
            zIndex:99,
          }}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
        // Mobile: sidebar as drawer
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          height: '100vh',
          zIndex: 100,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(.4,0,.2,1)',
        }}>
          <Sidebar
            page={page}
            setPage={v => { setPage(v); setMobileOpen(false) }}
            collapsed={false}
            setCollapsed={() => {}}
          />
        </div>
      ) : (
        // Desktop: sidebar in flow
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      {/* Main */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
      }}>
        <Topbar
          {...titles[page]}
          isMobile={isMobile}
          onMenuClick={() => setMobileOpen(p => !p)}
        />
        <main style={{ flex:1, padding: isMobile ? '16px' : '28px 32px', minWidth:0 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}