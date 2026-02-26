import { LayoutDashboard, ClipboardList, CheckCircle2, BarChart3 } from 'lucide-react'

const nav = [
  { id:'dashboard', label:'Dashboard',   icon:LayoutDashboard },
  { id:'orders',    label:'Semua Order', icon:ClipboardList   },
  { id:'completed', label:'Order Done',  icon:CheckCircle2    },
  { id:'analytics', label:'Analitik',    icon:BarChart3       },
]

function HamburgerIcon({ collapsed }) {
  const line = (width, y) => (
    <div style={{
      width,
      height: 2,
      borderRadius: 2,
      background: '#fff',
      transition: 'width 0.25s cubic-bezier(.4,0,.2,1)',
      position: 'absolute',
      top: y,
      left: 0,
    }} />
  )
  return (
    <div style={{ width: 18, height: 14, position: 'relative', flexShrink: 0 }}>
      {line(18, 0)}
      {line(collapsed ? 18 : 13, 6)}
      {line(18, 12)}
    </div>
  )
}

export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  const W = collapsed ? 68 : 232

  return (
    <div style={{
      width: W,
      minWidth: W,
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      transition: 'width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)',
      zIndex: 100,
    }}>
      <div style={{
        width: W,
        height: '100vh',
        background: 'var(--dark)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.28s cubic-bezier(.4,0,.2,1)',
        position: 'relative',
      }}>

        {/* Header */}
        <div style={{
          height: 64,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
        }}>

          {/* Logo — fade out saat collapsed */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            paddingLeft: 18,
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            opacity: collapsed ? 0 : 1,
            transition: 'opacity 0.2s',
            pointerEvents: collapsed ? 'none' : 'auto',
            whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'var(--cyan)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/logo.jpeg" alt="KJ"
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                onError={e => e.target.style.display='none'} />
            </div>
            <div>
              <div style={{ color:'#fff', fontWeight:800, fontSize:13.5, letterSpacing:'-0.01em' }}>
                Kampung Joki
              </div>
              <div style={{ color:'var(--cyan)', fontSize:2, fontWeight:700, letterSpacing:'0.14em', marginTop:1 }}>
                MLBB MANAGEMENT
              </div>
            </div>
          </div>

          {/* Hamburger Toggle — posisi absolute di kanan saat expanded, tengah saat collapsed */}
          <button
            onClick={() => setCollapsed(p => !p)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              position: 'absolute',
              right: collapsed ? '50%' : 0,
              transform: collapsed ? 'translateX(50%)' : 'translateX(0)',
              top: 0,
              width: 44,
              height: 64,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              outline: 'none',
              transition: 'right 0.28s cubic-bezier(.4,0,.2,1), transform 0.28s cubic-bezier(.4,0,.2,1), background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <HamburgerIcon collapsed={collapsed} />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex:1, padding: collapsed ? '14px 8px' : '14px 10px', overflowY:'auto' }}>
          <div style={{
            fontSize: 9, fontWeight: 800, color: '#334155',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '2px 10px', marginBottom: 10,
            opacity: collapsed ? 0 : 1,
            height: collapsed ? 0 : 'auto',
            overflow: 'hidden',
            transition: 'opacity 0.2s',
          }}>
            Menu Utama
          </div>

          {nav.map(item => {
            const Icon = item.icon
            const active = page === item.id
            return (
              <button key={item.id}
                onClick={() => setPage(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? 0 : 10,
                  width: '100%',
                  padding: collapsed ? '11px 0' : '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: active ? 'var(--cyan)' : 'transparent',
                  color: active ? '#fff' : '#64748B',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'Plus Jakarta Sans',
                  cursor: 'pointer',
                  marginBottom: 2,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                  boxShadow: active ? '0 4px 14px rgba(6,182,212,0.25)' : 'none',
                }}
                onMouseEnter={e => {
                  if(!active){
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = '#cbd5e1'
                  }
                }}
                onMouseLeave={e => {
                  if(!active){
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#64748B'
                  }
                }}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} style={{ flexShrink:0 }} />
                <span style={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 0.2s, width 0.28s',
                  display: 'block',
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* User info */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: collapsed ? '12px 0' : '12px 14px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10, flexShrink: 0,
          transition: 'padding 0.28s',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--cyan), #0284C7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 10.5, color: '#fff',
          }}>KJ</div>
          <div style={{
            overflow: 'hidden',
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity 0.2s, width 0.28s',
            whiteSpace: 'nowrap',
          }}>
            <div style={{ color:'#e2e8f0', fontSize:12, fontWeight:700 }}>Owner & Carissa</div>
            <div style={{ color:'#475569', fontSize:10, marginTop:1 }}>Administrator</div>
          </div>
        </div>

      </div>
    </div>
  )
}