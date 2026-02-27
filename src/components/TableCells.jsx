import { rankLabel } from './OrderForm'

export const fmtRp   = n => n != null ? 'Rp ' + parseFloat(n).toLocaleString('id-ID') : '—'
export const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{ day:'numeric', month:'short', year:'numeric' }) : '—'

// RankCell — support KEDUA format: props langsung ATAU object order dari DB
export const RankCell = (props) => {
  // Format 1: <RankCell rank=... level=... star=... targetRank=... targetLevel=... targetStar=... />
  // Format 2: spread object order langsung dari DB (current_rank, current_level, current_star, target_rank...)
  const fromRank  = props.rank         ?? props.current_rank
  const fromLevel = props.level        ?? props.current_level
  const fromStar  = props.star         ?? props.current_star
  const toRank    = props.targetRank   ?? props.target_rank
  const toLevel   = props.targetLevel  ?? props.target_level
  const toStar    = props.targetStar   ?? props.target_star

  if (!fromRank && !toRank) return <span style={{ color:'#CBD5E1' }}>—</span>

  const fromLabel = fromRank ? rankLabel(fromRank, fromLevel, fromStar) : '—'
  const toLabel   = toRank   ? rankLabel(toRank,   toLevel,   toStar)   : '—'

  return (
    <span style={{ fontSize:12.5, whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:4 }}>
      <span style={{ color:'#94A3B8' }}>{fromLabel}</span>
      <span style={{ color:'#06B6D4', margin:'0 4px', fontWeight:300 }}>→</span>
      <b style={{ color:'#0F172A' }}>{toLabel}</b>
    </span>
  )
}

export const NegaraCell = ({ country }) => (
  <span style={{
    display:'inline-block', padding:'3px 9px', borderRadius:6,
    fontSize:11, fontWeight:700,
    background: country==='MY' ? '#FEF9C3' : '#EFF6FF',
    color:      country==='MY' ? '#A16207' : '#1D4ED8',
    border:     `1.5px solid ${country==='MY' ? '#FDE68A' : '#BFDBFE'}`,
    whiteSpace: 'nowrap',
  }}>
    {country==='MY' ? '🇲🇾 MY' : '🇮🇩 ID'}
  </span>
)

export const TipeCell = ({ type }) => (
  <span style={{
    display:'inline-block', padding:'4px 11px', borderRadius:99,
    fontSize:11, fontWeight:700, whiteSpace:'nowrap',
    background: type==='joki' ? '#E0F9F7' : '#FFF3E8',
    color:      type==='joki' ? '#0E7490' : '#C2410C',
    border:     `1.5px solid ${type==='joki' ? '#A5F3FC' : '#FDBA74'}`,
  }}>
    {type==='joki' ? '⚔️ Joki' : '🛡️ Gendong'}
  </span>
)

export const TotalCell  = ({ v }) => <span style={{ fontWeight:700, color:'#0F172A', whiteSpace:'nowrap' }}>{fmtRp(v)}</span>
export const ProfitCell = ({ v }) => <b style={{ color:'#059669', fontSize:13, whiteSpace:'nowrap' }}>{fmtRp(v)}</b>
export const WorkerCell = ({ name }) => <span style={{ color:'#64748B', fontSize:12.5 }}>{name||'—'}</span>
export const DateCell   = ({ d }) => <span style={{ color:'#94A3B8', fontSize:12, whiteSpace:'nowrap' }}>{fmtDate(d)}</span>

export const StatusBadge = ({ s }) => {
  const m = {
    pending:     { label:'Pending',     bg:'#FFFBEB', color:'#B45309', border:'#FDE68A' },
    in_progress: { label:'In Progress', bg:'#EFF6FF', color:'#1D4ED8', border:'#BFDBFE' },
    done:        { label:'Done ✓',      bg:'#F0FDF4', color:'#15803D', border:'#BBF7D0' },
  }[s] || { label:s, bg:'#F3F4F6', color:'#6B7280', border:'#E5E7EB' }
  return (
    <span style={{
      display:'inline-block', padding:'4px 11px', borderRadius:99,
      fontSize:11, fontWeight:700, whiteSpace:'nowrap',
      background:m.bg, color:m.color, border:`1.5px solid ${m.border}`,
    }}>
      {m.label}
    </span>
  )
}

export const ReqHeroCell = ({ hero, lane }) => {
  if (!hero && !lane) return <span style={{ color:'#CBD5E1', fontSize:12 }}>—</span>
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      {hero && <span style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', whiteSpace:'nowrap' }}>{hero}</span>}
      {lane && (
        <span style={{
          fontSize:10.5, fontWeight:700, color:'#0E7490',
          background:'#CFFAFE', padding:'1px 7px', borderRadius:99,
          display:'inline-block', width:'fit-content', whiteSpace:'nowrap',
        }}>
          {lane}
        </span>
      )}
    </div>
  )
}