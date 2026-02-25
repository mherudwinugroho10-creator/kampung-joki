export default function StatsCard({ icon: Icon, label, value, sub, color = 'var(--cyan)', bgColor, delay = 0, trend }) {
  const bg = bgColor || `${color}18`
  return (
    <div className={`stat-card fade-up delay-${delay}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div className="stat-card-icon" style={{ background: bg }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
            background: trend >= 0 ? '#ECFDF5' : '#FEF2F2',
            padding: '3px 8px', borderRadius: 99,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value" style={{ marginBottom: 8 }}>{value}</div>
      <div className="text-label">{label}</div>
      {sub && <div className="text-caption" style={{ marginTop: 4 }}>{sub}</div>}
    </div>
  )
}