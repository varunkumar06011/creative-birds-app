import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/complaints')
      .then(r => r.json())
      .then(data => setComplaints(data))
  }, [])

  const resolveComplaint = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c))
  }

  if (!user || user.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as admin.</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Complaints</h2>
      {complaints.length === 0 && <p>No complaints yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {complaints.map(c => (
          <div key={c.id} style={{ padding: '1.2rem', border: '1px solid #ddd', borderRadius: '8px', background: c.status === 'resolved' ? '#e8f5e9' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>Complaint: {c.id.slice(0, 8)}...</h4>
              <span style={{ padding: '0.3rem 0.8rem', borderRadius: '12px', background: c.status === 'resolved' ? '#28a745' : '#e53935', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {c.status}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0' }}><strong>Message:</strong> {c.message}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginTop: '0.8rem', padding: '0.8rem', background: '#f5f5f5', borderRadius: '6px' }}>
              <p style={{ margin: 0 }}><strong>Customer:</strong> {c.customerName}</p>
              <p style={{ margin: 0 }}><strong>Designer ID:</strong> {c.designerId?.slice(0, 8)}...</p>
              <p style={{ margin: 0 }}><strong>Designer Name:</strong> {c.designerName || 'N/A'}</p>
              <p style={{ margin: 0 }}><strong>Employee ID:</strong> {c.employeeId || 'N/A'}</p>
              <p style={{ margin: 0 }}><strong>Aadhaar:</strong> {c.designerAadhaar || 'N/A'}</p>
            </div>
            {c.status === 'open' && (
              <button onClick={() => resolveComplaint(c.id)} style={{ marginTop: '0.8rem', padding: '0.5rem 1.2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
