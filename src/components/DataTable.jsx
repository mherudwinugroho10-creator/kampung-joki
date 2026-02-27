export default function DataTable({ columns, rows, loading, emptyText = 'Tidak ada data' }) {
  return (
    <div style={{
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: 14,
      border: '1px solid #E5E7EB',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        minWidth: 600,
      }}>
        <colgroup>
          {columns.map((col, i) => (
            <col key={i} style={{ width: col.width || 'auto' }} />
          ))}
        </colgroup>
        <thead>
          <tr style={{ background:'#F8FAFC', borderBottom:'2px solid #E2E8F0' }}>
            {columns.map((col, i) => (
              <th key={i} style={{
                padding: '11px 14px',
                textAlign: col.align || 'left',
                fontSize: 10,
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.09em',
                whiteSpace: 'nowrap',
                fontFamily: 'Plus Jakarta Sans',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} style={{ textAlign:'center', padding:48 }}>
                <div style={{
                  width:24, height:24,
                  border:'3px solid #E5E7EB',
                  borderTopColor:'#06B6D4',
                  borderRadius:'50%',
                  animation:'spin 0.7s linear infinite',
                  margin:'0 auto',
                }} />
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ textAlign:'center', padding:48, color:'#94A3B8', fontSize:13 }}>
                {emptyText}
              </td>
            </tr>
          )}
          {!loading && rows.map((row, idx) => (
            <tr key={row._key || idx}
              style={{
                borderBottom: '1px solid #F1F5F9',
                background: idx % 2 === 0 ? '#fff' : '#FAFCFF',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0F9FF'}
              onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#FAFCFF'}
            >
              {columns.map((col, ci) => (
                <td key={ci} style={{
                  padding: '12px 14px',
                  textAlign: col.align || 'left',
                  fontSize: 13,
                  color: 'var(--text-2)',
                  verticalAlign: 'middle',
                  overflow: 'hidden',
                }}>
                  {col.render ? col.render(row, idx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}