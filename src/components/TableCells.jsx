import { rankLabel } from './OrderForm'

export const parseRank = (rank, level, star) => {
  try { return rankLabel(rank, level, star) } catch { return rank || '—' }
}

export const fmtRp = n => n ? 'Rp ' + parseFloat(n).toLocaleString('id-ID') : '—'
export const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const NoCell = ({ n }) => (
  <span style={{ fontWeight: 800, fontSize: 11, color: '#0E7490', background: '#CFFAFE', padding: '3px 9px', borderRadius: 6 }}>
    #{n}
  </span>
)

export const RankCell = ({ rank, level, star, targetRank, targetLevel, targetStar }) => (
  <span style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
    <span style={{ color: '#94A3B8' }}>{parseRank(rank, level, star)}</span>
    <span style={{ color: '#06B6D4', margin: '0 6px', fontWeight: 400 }}>→</span>
    <b style={{ color: '#0F172A' }}>{parseRank(targetRank, targetLevel, targetStar)}</b>
  </span>
)

export const NegaraCell = ({ country }) => (
  <span style={{
    display: 'inline-block',
    padding: '3px 9px', borderRadius: 6,
    fontSize: 11, fontWeight: 700,
    background: country === 'MY' ? '#FEF9C3' : '#EFF6FF',
    color: country === 'MY' ? '#A16207' : '#1D4ED8',
    border: `1.5px solid ${country === 'MY' ? '#FDE68A' : '#BFDBFE'}`,
  }}>
    {country === 'MY' ? '🇲🇾 MY' : '🇮🇩 ID'}
  </span>
)

export const TipeCell = ({ type }) => (
  <span style={{
    display: 'inline-block',
    padding: '4px 11px', borderRadius: 99,
    fontSize: 11, fontWeight: 700,
    background: type === 'joki' ? '#E0F9F7' : '#FFF3E8',
    color: type === 'joki' ? '#0E7490' : '#C2410C',
    border: `1.5px solid ${type === 'joki' ? '#A5F3FC' : '#FDBA74'}`,
  }}>
    {type === 'joki' ? '⚔️ Joki' : '🛡️ Gendong'}
  </span>
)

export const ProfitCell = ({ v }) => (
  <b style={{ color: '#059669', fontSize: 13 }}>{fmtRp(v)}</b>
)

export const TotalCell = ({ v }) => (
  <span style={{ fontWeight: 700, color: '#0F172A' }}>{fmtRp(v)}</span>
)

export const WorkerCell = ({ name }) => (
  <span style={{ color: '#64748B', fontSize: 12.5 }}>{name || '—'}</span>
)

export const DateCell = ({ d }) => (
  <span style={{ color: '#94A3B8', fontSize: 12 }}>{fmtDate(d)}</span>
)

export const StatusBadge = ({ s }) => {
  const m = {
    pending:     { label: 'Pending',     bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
    in_progress: { label: 'In Progress', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
    done:        { label: 'Done ✓',      bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  }[s] || { label: s, bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
  return (
    <span style={{ display: 'inline-block', padding: '4px 11px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: m.bg, color: m.color, border: `1.5px solid ${m.border}` }}>
      {m.label}
    </span>
  )
}

export const ReqHeroCell = ({ hero, lane }) => {
  if (!hero && !lane) return <span style={{ color:'#CBD5E1', fontSize:12 }}>—</span>
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      {hero && <span style={{ fontSize:12, fontWeight:600, color:'var(--text-2)' }}>{hero}</span>}
      {lane && (
        <span style={{ fontSize:10.5, fontWeight:700, color:'#0E7490', background:'#CFFAFE', padding:'1px 7px', borderRadius:99, display:'inline-block', width:'fit-content' }}>
          {lane}
        </span>
      )}
    </div>
  )
}