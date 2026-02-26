import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/DataTable'
import { NoCell, RankCell, NegaraCell, TipeCell, TotalCell, ProfitCell, WorkerCell, DateCell, ReqHeroCell } from '../components/TableCells'
import { CheckCircle2, TrendingUp, DollarSign, Award, Calendar } from 'lucide-react'

const fmt = n => n ? 'Rp '+parseFloat(n).toLocaleString('id-ID') : 'Rp 0'

export default function Completed() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    supabase.from('orders').select('*').eq('status','done')
      .order('completed_at',{ascending:false})
      .then(({data})=>{ setOrders(data||[]); setLoading(false) })
  },[])

  const gross  = orders.reduce((s,o)=>s+parseFloat(o.total_price||0),0)
  const profit = orders.reduce((s,o)=>s+parseFloat(o.owner_price||0),0)
  const worker = orders.reduce((s,o)=>s+parseFloat(o.worker_price||0),0)

  const byMonth = {}
  orders.forEach(o=>{
    const k = new Date(o.completed_at||o.created_at)
      .toLocaleDateString('id-ID',{month:'long',year:'numeric'})
    if(!byMonth[k]) byMonth[k]=[]
    byMonth[k].push(o)
  })

  return (
    <div>
      {/* Stats */}
      <div className="stat-card-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { icon:CheckCircle2, label:'TOTAL SELESAI',  value:orders.length, color:'#10B981', bg:'#D1FAE5' },
          { icon:DollarSign,   label:'GROSS REVENUE',  value:fmt(gross),    color:'#06B6D4', bg:'#CFFAFE' },
          { icon:TrendingUp,   label:'PROFIT OWNER',   value:fmt(profit),   color:'#8B5CF6', bg:'#EDE9FE' },
          { icon:Award,        label:'DIBAYAR WORKER', value:fmt(worker),   color:'#F59E0B', bg:'#FEF3C7' },
        ].map((s,i)=>{
          const Icon=s.icon
          return (
            <div key={i} style={{ padding:'20px', borderRadius:14, background:'var(--card)', border:'1px solid var(--border)' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                <Icon size={17} style={{ color:s.color }} />
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:3 }}>{s.value}</div>
              <div style={{ fontSize:9.5, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.1em' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {loading && <div style={{ textAlign:'center', padding:60, color:'var(--muted)' }}>Memuat data...</div>}

      {!loading && orders.length===0 && (
        <div style={{ textAlign:'center', padding:'60px 24px', background:'var(--card)', borderRadius:16, border:'1px solid var(--border)' }}>
          <CheckCircle2 size={32} style={{ margin:'0 auto 12px', opacity:0.2, display:'block', color:'#10B981' }} />
          <p style={{ color:'var(--muted)', fontSize:13 }}>Belum ada order yang selesai</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {Object.entries(byMonth).map(([month,mo])=>{
          const mp = mo.reduce((s,o)=>s+parseFloat(o.owner_price||0),0)
          const mg = mo.reduce((s,o)=>s+parseFloat(o.total_price||0),0)
          return (
            <div key={month} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
              {/* Month header */}
              <div style={{ padding:'16px 22px', background:'linear-gradient(135deg,#F8FAFC,#F0FDFA)', borderBottom:'1px solid #E5E7EB', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:'#CFFAFE', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Calendar size={15} color="var(--cyan-dark)" />
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{month}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>{mo.length} order selesai</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:15, fontWeight:800, color:'#059669', letterSpacing:'-0.02em' }}>{fmt(mp)}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', marginTop:1 }}>dari {fmt(mg)} gross</div>
                </div>
              </div>

              <DataTable
                columns={[
                  { label:'No',          width:'60px',  align:'center', render: o => <NoCell n={o.order_number} /> },
                  { label:'Rank',        width:'120px', align:'center', render: o => <RankCell rank={o.current_rank} level={o.current_level} star={o.current_star} targetRank={o.target_rank} targetLevel={o.target_level} targetStar={o.target_star} /> },
                  { label:'Negara',      width:'80px',  align:'center', render: o => <NegaraCell country={o.country} /> },
                  { label:'Tipe',        width:'110px', align:'center', render: o => <TipeCell type={o.service_type} /> },
                  { label:'Req Hero',    width:'110px', align:'left',   render: o => <ReqHeroCell hero={o.req_hero} lane={o.req_lane} /> },
                  { label:'Total',       width:'130px', align:'center', render: o => <TotalCell v={o.total_price} /> },
                  { label:'Profit',      width:'130px', align:'center', render: o => <ProfitCell v={o.owner_price} /> },
                  { label:'Worker',      width:'100px', align:'center', render: o => <WorkerCell name={o.worker_name} /> },
                  { label:'Tgl Order',   width:'110px', align:'center', render: o => <DateCell d={o.created_at} /> },
                  { label:'Tgl Selesai', width:'110px', align:'center', render: o => <DateCell d={o.completed_at} /> },
                ]}
                rows={mo.map(o => ({ ...o, _key: o.id }))}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}