import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/payouts')
      .then(r => r.json())
      .then(data => setPayouts(data))
  }, [])

  const releasePayout = async (id) => {
    try {
      const res = await fetch(`/api/payouts/${id}/release`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'released' } : p))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Payouts</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#234997', color: 'white' }}>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Payout ID</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Designer</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Employee ID</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Release Date</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.7rem' }}>{p.id.slice(0, 8)}...</td>
              <td style={{ padding: '0.7rem' }}>{p.designerName}</td>
              <td style={{ padding: '0.7rem' }}>{p.employeeId}</td>
              <td style={{ padding: '0.7rem' }}>₹{p.amount}</td>
              <td style={{ padding: '0.7rem' }}>{new Date(p.releaseDate).toLocaleDateString()}</td>
              <td style={{ padding: '0.7rem' }}>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', background: p.status === 'released' ? '#28a745' : '#ff9800', color: 'white', fontSize: '0.75rem' }}>
                  {p.status}
                </span>
              </td>
              <td style={{ padding: '0.7rem' }}>
                {p.status === 'pending' ? (
                  <button onClick={() => releasePayout(p.id)} style={{ padding: '0.3rem 0.8rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Release
                  </button>
                ) : (
                  <span style={{ color: '#28a745', fontSize: '0.85rem' }}>Done</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
