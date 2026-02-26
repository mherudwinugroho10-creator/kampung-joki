import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import OrderForm, { rankLabel } from '../components/OrderForm'
import DataTable from '../components/DataTable'
import { RankCell, NegaraCell, TipeCell, TotalCell, ProfitCell, StatusBadge, ReqHeroCell } from '../components/TableCells'
import {
  ShoppingBag, CheckCircle2, TrendingUp,
  Plus, ArrowRight, Activity
} from 'lucide-react'

const fmt = n => n ? 'Rp ' + parseFloat(n).toLocaleString('id-ID') : 'Rp 0'

export default function Dashboard({ setPage }) {
  const [stats, setStats]       = useState({ total:0, done:0, active:0, revenue:0, pendingRevenue:0 })
  const [recent, setRecent]     = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    if (!data) { setLoading(false); return }
    const done    = data.filter(o=>o.status==='done')
    const active  = data.filter(o=>o.status!=='done')
    const revenue = done.reduce((s,o)=>s+parseFloat(o.owner_price||0),0)
    const pending = active.reduce((s,o)=>s+parseFloat(o.total_price||0),0)
    setStats({ total:data.length, done:done.length, active:active.length, revenue, pendingRevenue:pending })
    setRecent(data.slice(0,6))
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  const statCards = [
    { icon:ShoppingBag,  label:'Total Order',  value:stats.total,        sub:'Semua waktu',      color:'#06B6D4', bg:'#CFFAFE' },
    { icon:Activity,     label:'Aktif',         value:stats.active,       sub:'Sedang berjalan',  color:'#F59E0B', bg:'#FEF3C7' },
    { icon:CheckCircle2, label:'Selesai',        value:stats.done,         sub:'Order done',       color:'#10B981', bg:'#D1FAE5' },
    { icon:TrendingUp,   label:'Profit Owner',   value:fmt(stats.revenue), sub:'Total keuntungan', color:'#8B5CF6', bg:'#EDE9FE' },
  ]

  return (
    <div style={{ width:'100%', minWidth:0 }}>
      {/* Hero bar */}
      <div style={{
        background:'linear-gradient(135deg, var(--dark) 0%, #1E293B 100%)',
        borderRadius:16, padding:'22px 24px', marginBottom:20,
        display:'flex', alignItems:'flex-start', justifyContent:'space-between',
        position:'relative', overflow:'hidden', gap:12,
      }}>
        <div style={{ position:'absolute',right:-40,top:-40,width:200,height:200,borderRadius:'50%',background:'rgba(6,182,212,0.08)' }} />
        <div style={{ position:'absolute',right:60,bottom:-60,width:160,height:160,borderRadius:'50%',background:'rgba(6,182,212,0.05)' }} />
        <div style={{ position:'relative', flex:1, minWidth:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:6 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:'#10B981',boxShadow:'0 0 0 3px rgba(16,185,129,0.2)' }} />
            <span style={{ fontSize:10,fontWeight:700,color:'#64748B',letterSpacing:'0.1em' }}>LIVE DASHBOARD</span>
          </div>
          <h2 style={{ fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-0.03em',lineHeight:1.15,marginBottom:5 }}>
            Kampung Joki MLBB
          </h2>
          <p style={{ fontSize:12,color:'#64748B',fontWeight:500,margin:0 }}>
            {stats.active > 0
              ? `${stats.active} order aktif`
              : 'Siap terima order baru'}
          </p>
        </div>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,position:'relative',flexShrink:0 }}>
          <button className="btn-primary" onClick={()=>setShowForm(true)}
            style={{ fontSize:13, padding:'10px 18px', whiteSpace:'nowrap' }}>
            <Plus size={15} /> Order Baru
          </button>
          <div style={{ fontSize:11,color:'#475569',fontWeight:500,textAlign:'right' }}>
            Pending: <b style={{ color:'#F59E0B' }}>{fmt(stats.pendingRevenue)}</b>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-card-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        {statCards.map((s,i) => {
          const Icon = s.icon
          return (
            <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*60}ms` }}>
              <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Icon size={20} style={{ color:s.color }} />
                </div>
              </div>
              <div style={{ fontSize:28,fontWeight:800,color:'var(--text)',letterSpacing:'-0.04em',lineHeight:1,marginBottom:6 }}>{s.value}</div>
              <div style={{ fontSize:11,fontWeight:700,color:s.color,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:12,color:'var(--muted)' }}>{s.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Recent orders */}
      <div className="card fade-up" style={{ animationDelay:'300ms' }}>
        <div style={{ padding:'20px 24px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div>
            <h3 style={{ fontSize:15,fontWeight:700,color:'var(--text)',letterSpacing:'-0.01em' }}>Order Terbaru</h3>
            <p style={{ fontSize:12,color:'var(--muted)',marginTop:2 }}>6 order terakhir yang masuk</p>
          </div>
          <button onClick={()=>setPage('orders')} style={{ display:'flex',alignItems:'center',gap:6,fontSize:13,fontWeight:600,color:'var(--cyan)',background:'none',border:'none',cursor:'pointer' }}>
            Lihat Semua <ArrowRight size={14} />
          </button>
        </div>

        <DataTable
          loading={loading}
          emptyText="Belum ada order"
          columns={[
            { label:'No',       width:'60px',  align:'center', render: (o,idx) => <span style={{ fontWeight:800, fontSize:12, color:'#0E7490', background:'#CFFAFE', padding:'3px 9px', borderRadius:6 }}>{idx + 1}</span> },
            { label:'Rank',     width:'120px', align:'left',   render: o => <RankCell rank={o.current_rank} level={o.current_level} star={o.current_star} targetRank={o.target_rank} targetLevel={o.target_level} targetStar={o.target_star} /> },
            { label:'Negara',   width:'80px',  align:'center', render: o => <NegaraCell country={o.country} /> },
            { label:'Tipe',     width:'110px', align:'center', render: o => <TipeCell type={o.service_type} /> },
            { label:'Req Hero', width:'110px', align:'left',   render: o => <ReqHeroCell hero={o.req_hero} lane={o.req_lane} /> },
            { label:'Total',    width:'130px', align:'center', render: o => <TotalCell v={o.total_price} /> },
            { label:'Profit',   width:'130px', align:'center', render: o => <ProfitCell v={o.owner_price} /> },
            { label:'Status',   width:'110px', align:'center', render: o => <StatusBadge s={o.status} /> },
          ]}
          rows={recent.map(o => ({ ...o, _key: o.id }))}
        />
      </div>

      {showForm && <OrderForm onClose={()=>setShowForm(false)} onSuccess={load} />}
    </div>
  )
}