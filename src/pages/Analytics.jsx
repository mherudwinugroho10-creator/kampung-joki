import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { rankLabel } from '../components/OrderForm'
import DataTable from '../components/DataTable'
import { NoCell, RankCell, NegaraCell, TipeCell, TotalCell, ProfitCell, WorkerCell, DateCell, StatusBadge } from '../components/TableCells'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts'
import { BarChart3, TrendingUp, Globe, Award, Filter, Calendar } from 'lucide-react'

const fmt     = n => 'Rp '+parseFloat(n||0).toLocaleString('id-ID')
const CYAN_P  = ['#06B6D4','#0891B2','#67E8F9','#0E7490','#A5F3FC']
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'10px 16px', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', fontSize:12, fontFamily:'Plus Jakarta Sans' }}>
      <div style={{ fontWeight:700, color:'#0F172A', marginBottom:6 }}>{label}</div>
      {payload.map(p=>(
        <div key={p.name} style={{ color:p.color, fontWeight:600 }}>
          {p.name}: <b>{typeof p.value==='number'&&p.value>999 ? fmt(p.value) : p.value}</b>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [orders,      setOrders]      = useState([])
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterYear,  setFilterYear]  = useState('all')

  useEffect(()=>{
    supabase.from('orders').select('*').then(({data})=>setOrders(data||[]))
  },[])

  const years = useMemo(()=>{
    const s = new Set(orders.map(o=>new Date(o.created_at).getFullYear()))
    return Array.from(s).sort((a,b)=>b-a)
  },[orders])

  const filtered = useMemo(()=>{
    return orders.filter(o=>{
      const d = new Date(o.created_at)
      if(filterYear!=='all' && d.getFullYear()!==parseInt(filterYear)) return false
      if(filterMonth!=='all' && d.getMonth()!==parseInt(filterMonth)) return false
      return true
    })
  },[orders,filterYear,filterMonth])

  const done        = filtered.filter(o=>o.status==='done')
  const totalProfit = done.reduce((s,o)=>s+parseFloat(o.owner_price||0),0)
  const totalGross  = done.reduce((s,o)=>s+parseFloat(o.total_price||0),0)
  const totalWorker = done.reduce((s,o)=>s+parseFloat(o.worker_price||0),0)

  const monthlyData = useMemo(()=>{
    const result=[]
    for(let i=5;i>=0;i--){
      const d=new Date(); d.setMonth(d.getMonth()-i)
      const label=d.toLocaleDateString('id-ID',{month:'short',year:'2-digit'})
      const mo=orders.filter(o=>{
        const od=new Date(o.created_at)
        return od.getMonth()===d.getMonth()&&od.getFullYear()===d.getFullYear()
      })
      const mdone=mo.filter(o=>o.status==='done')
      result.push({
        name:label,
        'Total':mo.length,
        'Selesai':mdone.length,
        'Profit':mdone.reduce((s,o)=>s+parseFloat(o.owner_price||0),0),
      })
    }
    return result
  },[orders])

  const countryData = [
    { name:'Indonesia 🇮🇩', value:filtered.filter(o=>o.country==='ID').length },
    { name:'Malaysia 🇲🇾',  value:filtered.filter(o=>o.country==='MY').length },
  ]
  const serviceData = [
    { name:'Joki',    value:filtered.filter(o=>o.service_type==='joki').length },
    { name:'Gendong', value:filtered.filter(o=>o.service_type==='gendong').length },
  ]

  const workerMap={}
  filtered.forEach(o=>{
    if(!o.worker_name) return
    if(!workerMap[o.worker_name]) workerMap[o.worker_name]={name:o.worker_name,total:0,done:0,earned:0}
    workerMap[o.worker_name].total++
    if(o.status==='done') workerMap[o.worker_name].done++
    workerMap[o.worker_name].earned+=parseFloat(o.worker_price||0)
  })
  const workers=Object.values(workerMap).sort((a,b)=>b.total-a.total)

  const axisStyle={ fontSize:11.5, fill:'#9CA3AF', fontFamily:'Plus Jakarta Sans' }
  const gridStyle={ stroke:'#F3F4F6' }

  const isFiltered = filterMonth!=='all' || filterYear!=='all'
  const filterLabel = [
    filterMonth!=='all' ? MONTHS_ID[parseInt(filterMonth)] : null,
    filterYear!=='all'  ? filterYear : null,
  ].filter(Boolean).join(' ') || 'Semua Waktu'

  return (
    <div style={{ width:'100%', minWidth:0 }}>
      {/* Header band */}
      <div className="page-header-band" style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', zIndex:1 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:'#64748B', letterSpacing:'0.12em', marginBottom:6 }}>LAPORAN BISNIS</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:'#fff', letterSpacing:'-0.03em', marginBottom:4 }}>Analitik</h2>
            <p style={{ fontSize:12.5, color:'#64748B' }}>
              Periode: <b style={{ color:'var(--cyan)' }}>{filterLabel}</b>
              {isFiltered && <span style={{ marginLeft:8, fontSize:11, color:'#475569' }}>({filtered.length} order)</span>}
            </p>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', justifyContent:'flex-end' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Filter size={13} color="#64748B" />
              <span style={{ fontSize:11, color:'#64748B', fontWeight:600 }}>Filter:</span>
            </div>
            <select value={filterYear} onChange={e=>setFilterYear(e.target.value)}
              style={{ padding:'8px 14px', borderRadius:99, fontSize:12, fontWeight:600, border:'1.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer', outline:'none', fontFamily:'Plus Jakarta Sans' }}>
              <option value="all" style={{ background:'#1e293b' }}>Semua Tahun</option>
              {years.map(y=><option key={y} value={y} style={{ background:'#1e293b' }}>{y}</option>)}
              {years.length===0 && <option value={new Date().getFullYear()} style={{ background:'#1e293b' }}>{new Date().getFullYear()}</option>}
            </select>
            <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}
              style={{ padding:'8px 14px', borderRadius:99, fontSize:12, fontWeight:600, border:'1.5px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.08)', color:'#fff', cursor:'pointer', outline:'none', fontFamily:'Plus Jakarta Sans' }}>
              <option value="all" style={{ background:'#1e293b' }}>Semua Bulan</option>
              {MONTHS_ID.map((m,i)=><option key={i} value={i} style={{ background:'#1e293b' }}>{m}</option>)}
            </select>
            {isFiltered && (
              <button onClick={()=>{ setFilterMonth('all'); setFilterYear('all') }}
                style={{ padding:'8px 14px', borderRadius:99, fontSize:11, fontWeight:700, border:'1.5px solid rgba(239,68,68,0.4)', background:'rgba(239,68,68,0.1)', color:'#FCA5A5', cursor:'pointer' }}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-card-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { icon:BarChart3,  label:'Total Order',   value:filtered.length,  color:'#06B6D4', bg:'#CFFAFE' },
          { icon:TrendingUp, label:'Profit Owner',  value:fmt(totalProfit), color:'#8B5CF6', bg:'#EDE9FE' },
          { icon:Globe,      label:'Gross Revenue', value:fmt(totalGross),  color:'#10B981', bg:'#D1FAE5' },
          { icon:Award,      label:'Ke Worker',     value:fmt(totalWorker), color:'#F59E0B', bg:'#FEF3C7' },
        ].map((s,i)=>{
          const Icon=s.icon
          return (
            <div key={i} className="stat-card fade-up" style={{ animationDelay:`${i*60}ms` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} style={{ color:s.color }} />
                </div>
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:'var(--text)', letterSpacing:'-0.03em', marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:10, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</div>
              <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{filterLabel}</div>
            </div>
          )
        })}
      </div>

      {/* Chart row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20, marginBottom:20 }}>
        <div className="card fade-up" style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>Tren Order 6 Bulan Terakhir</h3>
          <p style={{ fontSize:12, color:'var(--muted)', marginBottom:24 }}>Total order masuk vs selesai</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={3} barCategoryGap="38%"
              margin={{ top:4, right:8, left:8, bottom:0 }}>
              <CartesianGrid vertical={false} {...gridStyle} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40}
                allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize:11, paddingTop:12 }} />
              <Bar dataKey="Total"   fill="#E0F7FA" radius={[5,5,0,0]} />
              <Bar dataKey="Selesai" fill="#06B6D4" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card fade-up" style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>Distribusi Negara</h3>
          <p style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>{filterLabel}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={countryData} cx="50%" cy="45%" outerRadius={78} innerRadius={42} dataKey="value" paddingAngle={3}
                label={({percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {countryData.map((_,i)=><Cell key={i} fill={CYAN_P[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:8 }}>
            {countryData.map((d,i)=>(
              <div key={d.name} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:'var(--muted)' }}>
                <div style={{ width:10, height:10, borderRadius:3, background:CYAN_P[i] }} />
                {d.name} <b style={{ color:'var(--text)' }}>({d.value})</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area chart profit */}
      <div className="card fade-up" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>Profit Owner per Bulan</h3>
        <p style={{ fontSize:12, color:'var(--muted)', marginBottom:24 }}>Keuntungan bersih 6 bulan terakhir (semua data)</p>
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={monthlyData} margin={{ top:4, right:8, left:8, bottom:0 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06B6D4" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} {...gridStyle} />
            <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={52}
              tickFormatter={v=>v>=1000000?`${(v/1000000).toFixed(1)}M`:v>=1000?`${v/1000}K`:String(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Profit" stroke="#06B6D4" strokeWidth={2.5}
              fill="url(#profitGrad)" dot={{ fill:'#06B6D4', r:4 }} activeDot={{ r:6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Service + Workers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20, marginBottom:20 }}>
        <div className="card fade-up" style={{ padding:24 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>Tipe Layanan</h3>
          <p style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>{filterLabel}</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="45%" outerRadius={70} innerRadius={36} dataKey="value" paddingAngle={3}
                label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {serviceData.map((_,i)=><Cell key={i} fill={i===0?'#06B6D4':'#0891B2'} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {workers.length>0 && (
          <div className="card fade-up">
            <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>Performa Worker</h3>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{filterLabel}</p>
            </div>
            <table style={{ width:'100%' }}>
              <thead>
                <tr>
                  {['NO','Worker','Total','Done','Rate','Earned'].map(h=>(
                    <th key={h} style={{ padding:'10px 16px', fontSize:'10px', fontWeight:800, color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em', background:'#F8FAFC', borderBottom:'2px solid #E5E7EB', textAlign:'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.map((w,i)=>(
                  <tr key={w.name} style={{ borderBottom:'1px solid #F1F5F9' }}>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ fontWeight:800, color:i===0?'#D97706':i===1?'#6B7280':i===2?'#CD7F32':'var(--muted)', fontSize:13 }}>#{i+1}</span>
                    </td>
                    <td style={{ padding:'12px 16px', fontWeight:700, color:'var(--text)', fontSize:13 }}>{w.name}</td>
                    <td style={{ padding:'12px 16px', color:'var(--text-2)', fontSize:13 }}>{w.total}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ padding:'2px 8px', borderRadius:99, background:'#DCFCE7', color:'#059669', fontSize:11, fontWeight:700 }}>{w.done}</span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:60, height:5, background:'#F3F4F6', borderRadius:99 }}>
                          <div style={{ height:'100%', borderRadius:99, background:'var(--cyan)', width:`${w.total>0?(w.done/w.total)*100:0}%` }} />
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:'var(--text-2)' }}>
                          {w.total>0?Math.round((w.done/w.total)*100):0}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', fontWeight:800, color:'var(--cyan-dark)', fontSize:13 }}>{fmt(w.earned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rekap detail filtered */}
      {isFiltered && filtered.length>0 && (
        <div className="card fade-up">
          <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
            <Calendar size={15} color="var(--cyan)" />
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>Rekap Detail — {filterLabel}</h3>
              <p style={{ fontSize:12, color:'var(--muted)', marginTop:1 }}>{filtered.length} order · Gross {fmt(totalGross)} · Profit {fmt(totalProfit)}</p>
            </div>
          </div>
          <DataTable
            columns={[
              { label:'No',     width:'60px',  align:'center', render: o => <NoCell n={o.order_number} /> },
              { label:'Rank',   width:'auto',  align:'center', render: o => <RankCell rank={o.current_rank} level={o.current_level} star={o.current_star} targetRank={o.target_rank} targetLevel={o.target_level} targetStar={o.target_star} /> },
              { label:'Negara', width:'80px',  align:'center', render: o => <NegaraCell country={o.country} /> },
              { label:'Tipe',   width:'110px', align:'center', render: o => <TipeCell type={o.service_type} /> },
              { label:'Total',  width:'130px', align:'center', render: o => <TotalCell v={o.total_price} /> },
              { label:'Profit', width:'130px', align:'center', render: o => <ProfitCell v={o.owner_price} /> },
              { label:'Worker', width:'100px', align:'center', render: o => <WorkerCell name={o.worker_name} /> },
              { label:'Status', width:'110px', align:'center', render: o => <StatusBadge s={o.status} /> },
              { label:'Tgl',    width:'100px', align:'center', render: o => <DateCell d={o.created_at} /> },
            ]}
            rows={filtered.map(o => ({ ...o, _key: o.id }))}
          />
        </div>
      )}
    </div>
  )
}