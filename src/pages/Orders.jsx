import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import OrderForm, { rankLabel } from '../components/OrderForm'
import DataTable from '../components/DataTable'
import { NoCell, RankCell, NegaraCell, TipeCell, TotalCell, ProfitCell, WorkerCell, DateCell, StatusBadge, fmtRp } from '../components/TableCells'
import { Plus, Search, Trash2 } from 'lucide-react'

export default function Orders() {
  const [orders,   setOrders]   = useState([])
  const [filtered, setFiltered] = useState([])
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    setOrders(data||[]); setLoading(false)
  }
  useEffect(()=>{ load() },[])
  useEffect(()=>{
    let r=[...orders]
    if(filter!=='all') r=r.filter(o=>o.status===filter)
    if(search.trim()) r=r.filter(o=>
      o.player_id.toLowerCase().includes(search.toLowerCase()) ||
      String(o.order_number).includes(search)
    )
    setFiltered(r)
  },[orders,search,filter])

  const updateStatus = async (id,status) => {
    const upd={status}
    if(status==='done') upd.completed_at=new Date().toISOString()
    await supabase.from('orders').update(upd).eq('id',id); load()
  }
  const del = async id => {
    if(!confirm('Hapus order ini?')) return
    await supabase.from('orders').delete().eq('id',id); load()
  }

  const totalProfit = orders.filter(o=>o.status==='done').reduce((s,o)=>s+parseFloat(o.owner_price||0),0)
  const FILTERS = [{k:'all',l:'Semua'},{k:'pending',l:'Pending'},{k:'in_progress',l:'In Progress'},{k:'done',l:'Done'}]

  return (
    <div>
      {/* Header band */}
      <div style={{
        background:'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius:16, padding:'22px 28px', marginBottom:20,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:140, height:140, borderRadius:'50%', background:'rgba(6,182,212,0.06)' }} />
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:9.5, fontWeight:800, color:'#475569', letterSpacing:'0.14em', marginBottom:5 }}>MANAJEMEN ORDER</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#fff', letterSpacing:'-0.03em', margin:0, marginBottom:3 }}>Semua Order</h2>
          <p style={{ fontSize:12, color:'#64748B', margin:0 }}>
            {orders.length} order · {orders.filter(o=>o.status!=='done').length} aktif
          </p>
        </div>
        <button className="btn-primary" onClick={()=>setShowForm(true)}>
          <Plus size={15}/> Order Baru
        </button>
      </div>

      {/* Summary */}
      <div className="summary-strip" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
        {[
          { l:'TOTAL ORDER', v:orders.length,                               c:'var(--cyan)' },
          { l:'AKTIF',       v:orders.filter(o=>o.status!=='done').length,  c:'#F59E0B'     },
          { l:'TOTAL PROFIT',v:'Rp '+totalProfit.toLocaleString('id-ID'),   c:'#10B981'     },
        ].map((s,i)=>(
          <div key={i} style={{ padding:'14px 18px', borderRadius:12, background:'var(--card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:3, height:30, borderRadius:99, background:s.c, flexShrink:0 }} />
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em', lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:9.5, fontWeight:700, color:'var(--muted)', letterSpacing:'0.08em', marginTop:3 }}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:180 }}>
          <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)' }} />
          <input className="input" style={{ paddingLeft:34, borderRadius:99, fontSize:13 }}
            placeholder="Cari username atau nomor..."
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:5 }}>
          {FILTERS.map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)}
              style={{
                padding:'8px 14px', borderRadius:99, fontSize:11.5, fontWeight:600, cursor:'pointer',
                border:'1.5px solid', transition:'all 0.15s', fontFamily:'Plus Jakarta Sans',
                borderColor: filter===f.k ? 'var(--cyan)' : 'var(--border)',
                background:  filter===f.k ? 'var(--cyan)' : 'var(--card)',
                color:       filter===f.k ? '#fff' : 'var(--muted)',
                outline: 'none',
              }}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:10, fontWeight:500 }}>
        Menampilkan <b style={{ color:'var(--text)' }}>{filtered.length}</b> dari {orders.length} order
      </div>

      <DataTable
        loading={loading}
        emptyText="Tidak ada order ditemukan"
        columns={[
          { label:'No',         width:'60px',  align:'center', render: o => <NoCell n={o.order_number} /> },
          { label:'Rank',       width:'auto',  align:'center',   render: o => <RankCell rank={o.current_rank} level={o.current_level} star={o.current_star} targetRank={o.target_rank} targetLevel={o.target_level} targetStar={o.target_star} /> },
          { label:'Negara',     width:'80px',  align:'center', render: o => <NegaraCell country={o.country} /> },
          { label:'Tipe',       width:'110px', align:'center', render: o => <TipeCell type={o.service_type} /> },
          { label:'Total',      width:'130px', align:'center',  render: o => <TotalCell v={o.total_price} /> },
          { label:'Fee Worker', width:'110px', align:'center',  render: o => <span style={{ color:'#94A3B8', fontSize:12.5 }}>{fmtRp(o.worker_price)}</span> },
          { label:'Profit',     width:'130px', align:'center',  render: o => <ProfitCell v={o.owner_price} /> },
          { label:'Worker',     width:'100px', align:'center',   render: o => <WorkerCell name={o.worker_name} /> },
          { label:'Tgl Order',  width:'110px', align:'center', render: o => <DateCell d={o.created_at} /> },
          { label:'Status',     width:'130px', align:'center', render: o => (
            <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
              style={{
                padding: '5px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                border: `1.5px solid ${{ pending:'#FDE68A', in_progress:'#BFDBFE', done:'#BBF7D0' }[o.status] || '#E5E7EB'}`,
                background: { pending:'#FFFBEB', in_progress:'#EFF6FF', done:'#F0FDF4' }[o.status] || '#F9FAFB',
                color: { pending:'#B45309', in_progress:'#1D4ED8', done:'#15803D' }[o.status] || '#6B7280',
                cursor: 'pointer', outline: 'none', fontFamily: 'Plus Jakarta Sans', width: '100%',
              }}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done ✓</option>
            </select>
          )},
          { label:'', width:'44px', align:'center', render: o => (
            <button onClick={() => del(o.id)}
              style={{ width:28, height:28, borderRadius:8, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', outline:'none', transition:'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background='#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background='none'}>
              <Trash2 size={13} color="#EF4444" />
            </button>
          )},
        ]}
        rows={filtered.map(o => ({ ...o, _key: o.id }))}
      />

      {showForm && <OrderForm onClose={()=>setShowForm(false)} onSuccess={load} />}
    </div>
  )
}