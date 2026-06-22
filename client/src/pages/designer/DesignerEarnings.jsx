import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function DesignerEarnings() {
  const [payouts, setPayouts] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    fetch('/api/payouts')
      .then(r => r.json())
      .then(data => setPayouts(data.filter(p => p.designerId === user.id)))
  }, [user])

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Earnings & Payouts</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f0f4ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>Total Earnings</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#234997' }}>₹{user.earnings}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>Pending Payout</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>₹{user.pendingPayout}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>Total Jobs</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>{user.totalJobs}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fce4ec', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666' }}>Credits</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>{user.credits}</p>
        </div>
      </div>

      <h3>Payout History</h3>
      {payouts.length === 0 && <p>No payouts yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {payouts.map(p => (
          <div key={p.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Job: {p.jobId.slice(0, 8)}...</p>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#666' }}>Release by: {new Date(p.releaseDate).toLocaleDateString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>₹{p.amount}</p>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', background: p.status === 'released' ? '#28a745' : '#ff9800', color: 'white', fontSize: '0.75rem' }}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
