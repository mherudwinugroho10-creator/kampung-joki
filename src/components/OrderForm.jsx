import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, DollarSign } from 'lucide-react'

const WORKERS = ['Pajar', 'Perdy', 'Candra', 'Akmal', 'Ivan','Nugraha','Syam','Ghil','R']
const TIERED  = ['Warrior','Elite','Master','Grandmaster','Epic','Legend']
const MYTHICS = ['Placement','Mythic','Mythical Honor','Mythical Glory','Mythical Immortal']
export const ALL_RANKS = [...TIERED, ...MYTHICS]

export const getRankType = r => TIERED.includes(r) ? 'tiered' : r === 'Placement' ? 'match' : 'points'

export const POINTS_CFG = {
  'Mythic':            { min:0,   max:24   },
  'Mythical Honor':    { min:25,  max:49   },
  'Mythical Glory':    { min:50,  max:99   },
  'Mythical Immortal': { min:100, max:9999 },
}

export const rankLabel = (rank, level, star) => {
  const t = getRankType(rank)
  if (t === 'tiered') return `${rank} ${level ?? 1}★${star ?? 1}`
  if (t === 'match')  return `Placement (${star ?? 1}/10)`
  return `${rank} [${star ?? 0} pts]`
}

const RC = {
  'Warrior':           { bg:'#F3F4F6', color:'#4B5563', border:'#D1D5DB' },
  'Elite':             { bg:'#FEF9C3', color:'#A16207', border:'#FDE047' },
  'Master':            { bg:'#EDE9FE', color:'#6D28D9', border:'#C4B5FD' },
  'Grandmaster':       { bg:'#FCE7F3', color:'#9D174D', border:'#F9A8D4' },
  'Epic':              { bg:'#EFF6FF', color:'#1D4ED8', border:'#93C5FD' },
  'Legend':            { bg:'#DCFCE7', color:'#15803D', border:'#86EFAC' },
  'Placement':         { bg:'#F0FDFA', color:'#0E7490', border:'#67E8F9' },
  'Mythic':            { bg:'#FFFBEB', color:'#B45309', border:'#FCD34D' },
  'Mythical Honor':    { bg:'#FFFBEB', color:'#B45309', border:'#FCD34D' },
  'Mythical Glory':    { bg:'#FFF7ED', color:'#C2410C', border:'#FDBA74' },
  'Mythical Immortal': { bg:'#FEF2F2', color:'#B91C1C', border:'#FCA5A5' },
}
const rc = r => RC[r] || RC['Warrior']

const Btn = ({ active, onClick, children, color, bg, border }) => (
  <button type="button" onClick={onClick} style={{
    width:34, height:34, borderRadius:8, cursor:'pointer',
    border:`1.5px solid ${active ? border : '#E5E7EB'}`,
    background: active ? bg : '#FAFAFA',
    color: active ? color : '#9CA3AF',
    fontWeight:700, fontSize:13, transition:'all 0.1s',
    display:'flex', alignItems:'center', justifyContent:'center',
  }}>{children}</button>
)

const TieredInput = ({ level, star, onChange, r }) => {
  const { color, bg, border } = rc(r)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <div>
        <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:6 }}>LEVEL</div>
        <div style={{ display:'flex', gap:5 }}>
          {[5,4,3,2,1].map(l => (
            <Btn key={l} active={l===level} onClick={() => onChange(l, star)} color={color} bg={bg} border={border}>{l}</Btn>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:6 }}>BINTANG</div>
        <div style={{ display:'flex', gap:5 }}>
          {[1,2,3,4,5].map(b => (
            <Btn key={b} active={b<=star} onClick={() => onChange(level, b)} color={color} bg={bg} border={border}>
              <span style={{ fontSize:14 }}>{b <= star ? '★' : '☆'}</span>
            </Btn>
          ))}
        </div>
      </div>
    </div>
  )
}

const MatchInput = ({ value, onChange }) => (
  <div>
    <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:6 }}>MATCH KE-</div>
    <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
      {[1,2,3,4,5,6,7,8,9,10].map(m => (
        <button key={m} type="button" onClick={() => onChange(m)} style={{
          width:34, height:34, borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:12,
          border:`1.5px solid ${m===value ? '#06B6D4' : '#E5E7EB'}`,
          background: m===value ? '#CFFAFE' : '#FAFAFA',
          color: m===value ? '#0E7490' : '#9CA3AF',
          transition:'all 0.1s',
        }}>{m}</button>
      ))}
    </div>
    <div style={{ marginTop:8, fontSize:11, color:'#0F766E', lineHeight:1.6, padding:'8px 12px', background:'#F0FDFA', borderRadius:8 }}>
      Win 1–5 = +2★ Mythic &nbsp;|&nbsp; Win 6–10 = +1★ Mythic
    </div>
  </div>
)

const PointsInput = ({ value, onChange, rank }) => {
  const cfg = POINTS_CFG[rank] || { min:0, max:9999 }
  const presets = {
    'Mythic':            [0,5,10,15,20,24],
    'Mythical Honor':    [25,30,35,40,45,49],
    'Mythical Glory':    [50,60,70,80,90,99],
    'Mythical Immortal': [100,150,200,300,500],
  }
  const { color, bg, border } = rc(rank)
  return (
    <div>
      <div style={{ fontSize:9, fontWeight:700, color:'var(--muted)', letterSpacing:'0.1em', marginBottom:6 }}>
        POIN {cfg.max < 9999 ? `(${cfg.min}–${cfg.max})` : `(${cfg.min}+)`}
      </div>
      <input type="number" min={cfg.min} max={cfg.max < 9999 ? cfg.max : undefined}
        value={value ?? cfg.min}
        onChange={e => {
          let v = parseInt(e.target.value)||cfg.min
          if(v < cfg.min) v = cfg.min
          if(cfg.max < 9999 && v > cfg.max) v = cfg.max
          onChange(v)
        }}
        className="input" style={{ width:'100%', marginBottom:8 }} />
      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
        {(presets[rank]||[]).map(p => (
          <button key={p} type="button" onClick={() => onChange(p)} style={{
            padding:'4px 10px', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer',
            border:`1.5px solid ${value===p ? border : '#E5E7EB'}`,
            background: value===p ? bg : '#FAFAFA',
            color: value===p ? color : '#9CA3AF',
            transition:'all 0.1s',
          }}>{p}</button>
        ))}
      </div>
    </div>
  )
}

const RankCard = ({ label, rank, level, star, onRankChange, onLevelChange, onStarChange }) => {
  const t = getRankType(rank)
  const { color, bg, border } = rc(rank)
  return (
    <div style={{ padding:'16px', borderRadius:12, border:`1.5px solid ${border}`, background: bg+'33' }}>
      <div style={{ fontSize:9, fontWeight:800, color, letterSpacing:'0.12em', marginBottom:8 }}>{label}</div>
      <select className="input" value={rank}
        style={{ marginBottom:14, background:'#fff', fontWeight:600, fontSize:13 }}
        onChange={e => {
          const nr = e.target.value
          const nt = getRankType(nr)
          onRankChange(nr)
          if(nt==='tiered') { onLevelChange(1); onStarChange(1) }
          else if(nt==='match') onStarChange(1)
          else onStarChange(POINTS_CFG[nr]?.min ?? 0)
        }}>
        {ALL_RANKS.map(r => <option key={r}>{r}</option>)}
      </select>
      {t==='tiered' && <TieredInput level={level??1} star={star??1} onChange={(l,s)=>{onLevelChange(l);onStarChange(s)}} r={rank} />}
      {t==='match'  && <MatchInput value={star??1} onChange={onStarChange} />}
      {t==='points' && <PointsInput value={star} onChange={onStarChange} rank={rank} />}
    </div>
  )
}

export default function OrderForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    player_id:'', country:'ID',
    req_hero: '',
    req_lane: '',
    current_rank:'Epic', current_level:1, current_star:1,
    target_rank:'Legend', target_level:5, target_star:5,
    service_type:'joki', total_price:'', worker_price:'', worker_name:'', notes:'',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const f = (k,v) => setForm(p=>({...p,[k]:v}))

  const ownerNum = form.total_price && form.worker_price
    ? Math.max(0, parseFloat(form.total_price)-parseFloat(form.worker_price)) : null

  const handleSubmit = async e => {
    e.preventDefault()
    if(!form.total_price||!form.worker_price) { setError('Harga wajib diisi.'); return }
    if(parseFloat(form.worker_price)>parseFloat(form.total_price)) { setError('Fee worker melebihi total.'); return }
    setLoading(true); setError('')
    const t_cur = getRankType(form.current_rank)
    const t_tgt = getRankType(form.target_rank)
    const { error:err } = await supabase.from('orders').insert([{
      player_id:     form.player_id || '',
      country:       form.country,
      current_rank:  form.current_rank,
      current_level: t_cur==='tiered' ? form.current_level : null,
      current_star:  form.current_star,
      target_rank:   form.target_rank,
      target_level:  t_tgt==='tiered' ? form.target_level : null,
      target_star:   form.target_star,
      service_type:  form.service_type,
      total_price:   parseFloat(form.total_price),
      worker_price:  parseFloat(form.worker_price),
      owner_price:   Math.max(0,parseFloat(form.total_price)-parseFloat(form.worker_price)),
      worker_name:   form.worker_name||null,
      notes:         form.notes||null,
      req_hero:      form.req_hero||null,
      req_lane:      form.req_lane||null,
      status:        'pending',
    }])
    setLoading(false)
    if(err) { setError('Gagal: '+err.message); return }
    onSuccess(); onClose()
  }

  return (
    <div className="overlay fade-in" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal scale-in" style={{ maxWidth:720 }}>
        <div className="modal-head">
          <div>
            <h2 style={{ fontSize:18, fontWeight:700, color:'var(--text)' }}>Tambah Order Baru</h2>
            <p style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Isi semua data dengan benar</p>
          </div>
          <button onClick={onClose} style={{ width:32,height:32,borderRadius:8,background:'#F3F4F6',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <X size={14} color="var(--muted)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div style={{ padding:'10px 14px',borderRadius:10,marginBottom:20,background:'#FEF2F2',border:'1px solid #FECACA',fontSize:13,color:'#DC2626' }}>{error}</div>}

          {/* Negara & Tipe */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
            <div>
              <label className="label">Negara *</label>
              <select className="input" value={form.country} onChange={e=>f('country',e.target.value)}>
                <option value="ID">🇮🇩 Indonesia</option>
                <option value="MY">🇲🇾 Malaysia</option>
              </select>
            </div>
            <div>
              <label className="label">Tipe Layanan *</label>
              <select className="input" value={form.service_type} onChange={e=>f('service_type',e.target.value)}>
                <option value="joki">⚔️ Joki — Main Sendiri</option>
                <option value="gendong">🛡️ Gendong — Duo Carry</option>
              </select>
            </div>
          </div>

          {/* Req Hero */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'#64748B', letterSpacing:'0.12em', marginBottom:12 }}>
              REQ HERO (OPSIONAL)
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="label">Nama Hero</label>
                <input className="input"
                  placeholder="Contoh: Fanny, Lancelot..."
                  value={form.req_hero || ''}
                  onChange={e => f('req_hero', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Lane / Role</label>
                <select className="input"
                  value={form.req_lane || ''}
                  onChange={e => f('req_lane', e.target.value)}
                  style={{ cursor:'pointer' }}>
                  <option value="">— Pilih Lane —</option>
                  <option value="Mid">🎯 Mid</option>
                  <option value="Side">⚔️ Side</option>
                  <option value="Jungler">🌿 Jungler</option>
                  <option value="Exp">💪 Exp Lane</option>
                  <option value="Roam">🛡️ Roam</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height:1,background:'var(--border)',marginBottom:20 }} />
          <div style={{ fontSize:9,fontWeight:800,color:'var(--muted)',letterSpacing:'0.12em',marginBottom:12 }}>BREAKDOWN RANK</div>

          {/* Preview */}
          <div style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'linear-gradient(135deg,#F8FAFC,#F0FDFA)',border:'1.5px solid #CFFAFE',borderRadius:10,marginBottom:16 }}>
            <div>
              <div style={{ fontSize:9,color:'var(--muted)',fontWeight:700,letterSpacing:'0.08em',marginBottom:2 }}>DARI</div>
              <div style={{ fontWeight:800,fontSize:14,color:'var(--text)' }}>{rankLabel(form.current_rank,form.current_level,form.current_star)}</div>
            </div>
            <div style={{ flex:1,textAlign:'center',color:'var(--cyan)',fontSize:18,fontWeight:300 }}>→</div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:9,color:'var(--muted)',fontWeight:700,letterSpacing:'0.08em',marginBottom:2 }}>KE</div>
              <div style={{ fontWeight:800,fontSize:14,color:'var(--cyan-dark)' }}>{rankLabel(form.target_rank,form.target_level,form.target_star)}</div>
            </div>
            <span style={{ marginLeft:8,background:form.service_type==='joki'?'#F0FDFA':'#FFF7ED',color:form.service_type==='joki'?'#0891B2':'#EA580C',padding:'3px 10px',borderRadius:99,fontSize:10,fontWeight:700 }}>{form.service_type}</span>
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20 }}>
            <RankCard label="RANK AWAL" rank={form.current_rank} level={form.current_level} star={form.current_star}
              onRankChange={v=>f('current_rank',v)} onLevelChange={v=>f('current_level',v)} onStarChange={v=>f('current_star',v)} />
            <RankCard label="RANK TUJUAN" rank={form.target_rank} level={form.target_level} star={form.target_star}
              onRankChange={v=>f('target_rank',v)} onLevelChange={v=>f('target_level',v)} onStarChange={v=>f('target_star',v)} />
          </div>

          <div style={{ height:1,background:'var(--border)',marginBottom:20 }} />
          <div style={{ fontSize:9,fontWeight:800,color:'var(--muted)',letterSpacing:'0.12em',marginBottom:12 }}>HARGA & WORKER</div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
            <div>
              <label className="label">Total Harga (Rp) *</label>
              <input className="input" type="number" min="0" placeholder="0" value={form.total_price} onChange={e=>f('total_price',e.target.value)} />
            </div>
            <div>
              <label className="label">Fee Worker (Rp) *</label>
              <input className="input" type="number" min="0" placeholder="0" value={form.worker_price} onChange={e=>f('worker_price',e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label className="label">Profit Owner (auto)</label>
            <div style={{ padding:'11px 14px',borderRadius:10,background:ownerNum!=null?'#ECFDF5':'#F9FAFB',border:`1.5px solid ${ownerNum!=null?'#6EE7B7':'var(--border)'}`,fontSize:16,fontWeight:800,color:ownerNum!=null?'#059669':'var(--muted)',display:'flex',alignItems:'center',gap:8,transition:'all 0.2s' }}>
              <DollarSign size={15} />
              {ownerNum!=null ? `Rp ${ownerNum.toLocaleString('id-ID')}` : 'Otomatis terhitung'}
            </div>
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div>
              <label className="label">Worker</label>
              <select className="input" value={form.worker_name} onChange={e=>f('worker_name',e.target.value)}>
                <option value="">Belum ditentukan</option>
                {WORKERS.map(w=><option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Catatan</label>
              <input className="input" placeholder="Catatan tambahan..." value={form.notes} onChange={e=>f('notes',e.target.value)} />
            </div>
          </div>

          <div style={{ display:'flex',gap:10,marginTop:24 }}>
            <button type="button" className="btn-ghost" style={{ flex:1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary" style={{ flex:2,justifyContent:'center',opacity:loading?0.7:1 }} disabled={loading}>
              {loading?'Menyimpan...':'+ Simpan Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}