import { Calendar } from 'lucide-react'

export default function Topbar({ title, sub }) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  })

  return (
    <header style={{
      height: 64,
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
      boxShadow: '0 1px 0 #E5E7EB, 0 2px 12px rgba(0,0,0,0.04)',
    }}>
      {/* Left: title */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <h1 style={{
          fontSize: 17,
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: 0,
        }}>{title}</h1>
        <p style={{ fontSize:11.5, color:'var(--muted)', margin:0, marginTop:2 }}>{sub}</p>
      </div>

      {/* Right: date */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '7px 14px',
        background: '#F8FAFC',
        border: '1px solid var(--border)',
        borderRadius: 99,
        fontSize: 12, color: 'var(--text-2)', fontWeight: 500,
        whiteSpace: 'nowrap',
      }}>
        <Calendar size={13} color="var(--cyan)" />
        {today}
      </div>
    </header>
  )
}