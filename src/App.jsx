import { useState } from 'react'
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

const SIDEBAR_W     = 232
const SIDEBAR_W_COL = 68

export default function App() {
  const [page,      setPage]      = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const sideW = collapsed ? SIDEBAR_W_COL : SIDEBAR_W

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
      {/* Sidebar — lebar berubah, konten ikut otomatis */}
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content — flex:1 otomatis isi sisa lebar */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
      }}>
        <Topbar {...titles[page]} />
        <main style={{ flex:1, padding:'28px 32px', minWidth:0 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}