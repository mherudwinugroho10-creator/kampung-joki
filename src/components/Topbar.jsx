import { Calendar, Menu } from 'lucide-react'

export default function Topbar({ title, sub, isMobile, onMenuClick }) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: isMobile ? 'short' : 'long',
    day: 'numeric',
    month: isMobile ? 'short' : 'long',
    year: 'numeric'
  })

  return (
    <header style={{
      height: 60,
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
      boxShadow: '0 1px 0 #E5E7EB, 0 2px 12px rgba(0,0,0,0.04)',
      gap: 12,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
        {/* Hamburger di mobile */}
        {isMobile && (
          <button onClick={onMenuClick} style={{
            width:36, height:36, borderRadius:9,
            background:'var(--bg)', border:'1px solid var(--border)',
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', flexShrink:0, outline:'none',
          }}>
            <Menu size={18} color="var(--text)" />
          </button>
        )}
        <div style={{ minWidth:0 }}>
          <h1 style={{
            fontSize: isMobile ? 15 : 17,
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{title}</h1>
          {!isMobile && (
            <p style={{ fontSize:11.5, color:'var(--muted)', margin:0, marginTop:2 }}>{sub}</p>
          )}
        </div>
      </div>

      {/* Date */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: isMobile ? '6px 10px' : '7px 14px',
        background: '#F8FAFC',
        border: '1px solid var(--border)',
        borderRadius: 99,
        fontSize: isMobile ? 11 : 12,
        color: 'var(--text-2)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        <Calendar size={12} color="var(--cyan)" />
        {today}
      </div>
    </header>
  )
}