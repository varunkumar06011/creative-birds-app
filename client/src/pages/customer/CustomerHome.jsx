import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const QUICK_ACTIONS = [
  { label: 'New Request', icon: '✏️', desc: 'Post a design need', to: '/customer/request', color: '#234997' },
  { label: 'Packages', icon: '💎', desc: 'View pricing plans', to: '/customer/packages', color: '#3b6fd8' },
  { label: 'My Jobs', icon: '📋', desc: 'Track & manage', to: '/customer/tracking', color: '#234997' },
  { label: 'Support', icon: '💬', desc: 'Raise a complaint', to: '/customer/complaint', color: '#3b6fd8' },
]

export default function CustomerHome() {
  const { user } = useAuth()
  const [recentJobs, setRecentJobs] = useState([])

  useEffect(() => {
    if (!user) return
    fetch(`/api/jobs?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => setRecentJobs(data.slice(0, 3)))
  }, [user])

  const statusColors = {
    pending: '#ff9800',
    assigned: '#234997',
    completed: '#28a745',
    expired: '#e53935'
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', paddingBottom: '2rem' }}>
      {/* Header Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #234997 0%, #3b6fd8 100%)',
        color: 'white',
        padding: '1.5rem 1rem',
        borderRadius: '0 0 20px 20px',
        marginBottom: '1rem'
      }}>
        <p style={{ margin: '0 0 0.2rem', opacity: 0.85, fontSize: '0.85rem' }}>Welcome back,</p>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem' }}>{user.name}</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
          {recentJobs.length > 0 ? `${recentJobs.length} active job${recentJobs.length > 1 ? 's' : ''}` : 'Ready to create something amazing?'}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#234997', margin: '0 0 0.8rem', fontSize: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          {QUICK_ACTIONS.map((action, i) => (
            <Link key={i} to={action.to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: '1px solid #e0e7ff',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                transition: 'transform 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>{action.icon}</span>
                <h4 style={{ margin: '0 0 0.2rem', color: action.color, fontSize: '0.85rem' }}>{action.label}</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '0.7rem' }}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: '#f8f9ff',
          borderRadius: '12px',
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.5rem',
          textAlign: 'center'
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#234997' }}>{user.totalJobs || 0}</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: '#666' }}>Total Jobs</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#234997' }}>₹{user.totalSpent || 0}</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: '#666' }}>Spent</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>{recentJobs.filter(j => j.status === 'completed').length}</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', color: '#666' }}>Completed</p>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div style={{ padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h3 style={{ color: '#234997', margin: 0, fontSize: '1rem' }}>Recent Jobs</h3>
          <Link to="/customer/tracking" style={{ color: '#234997', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 'bold' }}>View All &rarr;</Link>
        </div>

        {recentJobs.length === 0 && (
          <div style={{
            background: '#f8f9ff',
            borderRadius: '12px',
            padding: '2rem 1rem',
            textAlign: 'center',
            border: '1px dashed #c5cae9'
          }}>
            <p style={{ margin: 0, fontSize: '1.5rem' }}>🎨</p>
            <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.85rem' }}>No jobs yet. Start your first design request!</p>
            <Link to="/customer/request">
              <button style={{
                marginTop: '0.8rem',
                padding: '0.5rem 1.2rem',
                background: '#234997',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}>Create Request</button>
            </Link>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {recentJobs.map(job => (
            <div key={job.id} style={{
              background: 'white',
              border: '1px solid #e0e7ff',
              borderRadius: '10px',
              padding: '0.8rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontWeight: 'bold', color: '#333', fontSize: '0.85rem' }}>{job.packageName}</p>
                <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>₹{job.finalPrice || job.price}</p>
              </div>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '10px',
                background: statusColors[job.status] + '20',
                color: statusColors[job.status],
                fontSize: '0.7rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
