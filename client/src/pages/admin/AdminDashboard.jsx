import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [responseMetrics, setResponseMetrics] = useState([])
  const [tips, setTips] = useState({ totalTips: 0, tipCount: 0 })
  const { user } = useAuth()
  const socket = useSocket()

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
    fetch('/api/admin/response-metrics')
      .then(r => r.json())
      .then(data => {
        setResponseMetrics(data.metrics)
        setTips({ totalTips: data.totalTips, tipCount: data.tipCount })
      })
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('jobStatusUpdate', () => {
      fetch('/api/admin/response-metrics')
        .then(r => r.json())
        .then(data => setResponseMetrics(data.metrics))
    })
    socket.on('jobTipAdded', () => {
      fetch('/api/admin/response-metrics')
        .then(r => r.json())
        .then(data => {
          setResponseMetrics(data.metrics)
          setTips({ totalTips: data.totalTips, tipCount: data.tipCount })
        })
    })
    return () => {
      socket.off('jobStatusUpdate')
      socket.off('jobTipAdded')
    }
  }, [socket])

  if (!user || user.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as admin.</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Admin Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
        <div style={{ padding: '1.2rem', background: '#f0f4ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Customers</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#234997' }}>{stats?.totalCustomers || 0}</p>
        </div>
        <div style={{ padding: '1.2rem', background: '#f0f4ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Designers</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#234997' }}>{stats?.totalDesigners || 0}</p>
        </div>
        <div style={{ padding: '1.2rem', background: '#f0f4ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Total Jobs</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#234997' }}>{stats?.totalJobs || 0}</p>
        </div>
        <div style={{ padding: '1.2rem', background: '#f0f4ff', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Revenue</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#234997' }}>₹{stats?.totalRevenue || 0}</p>
        </div>
        <div style={{ padding: '1.2rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Total Tips</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#28a745' }}>₹{tips.totalTips || 0}</p>
        </div>
        <div style={{ padding: '1.2rem', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Pending Payouts</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#ff9800' }}>₹{stats?.pendingPayouts || 0}</p>
        </div>
        <div style={{ padding: '1.2rem', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>Open Complaints</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#e53935' }}>{stats?.openComplaints || 0}</p>
        </div>
      </div>

      <h3 style={{ color: '#234997', marginTop: '2rem' }}>Designer Response Metrics</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#234997', color: 'white' }}>
              <th style={{ padding: '0.6rem', textAlign: 'left' }}>Designer</th>
              <th style={{ padding: '0.6rem', textAlign: 'left' }}>Emp ID</th>
              <th style={{ padding: '0.6rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.6rem', textAlign: 'center' }}>Viewed</th>
              <th style={{ padding: '0.6rem', textAlign: 'center' }}>Accepted</th>
              <th style={{ padding: '0.6rem', textAlign: 'center' }}>Rejected</th>
              <th style={{ padding: '0.6rem', textAlign: 'center' }}>Missed</th>
            </tr>
          </thead>
          <tbody>
            {responseMetrics.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.6rem' }}>{m.name}</td>
                <td style={{ padding: '0.6rem' }}>{m.employeeId}</td>
                <td style={{ padding: '0.6rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '8px', background: m.onlineStatus === 'online' ? '#28a745' : m.onlineStatus === 'busy' ? '#ff9800' : '#999', color: 'white', fontSize: '0.7rem' }}>
                    {m.onlineStatus}
                  </span>
                </td>
                <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 'bold' }}>{m.viewedCount}</td>
                <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 'bold', color: '#28a745' }}>{m.acceptedCount}</td>
                <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 'bold', color: '#e53935' }}>{m.rejectedCount}</td>
                <td style={{ padding: '0.6rem', textAlign: 'center', fontWeight: 'bold', color: '#ff9800' }}>{m.missedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '1.5rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Manage Users</h3>
            <p>Customers & Designers</p>
          </div>
        </Link>
        <Link to="/admin/transactions" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '1.5rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Transactions</h3>
            <p>View all payments</p>
          </div>
        </Link>
        <Link to="/admin/complaints" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '1.5rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Complaints</h3>
            <p>Customer issues</p>
          </div>
        </Link>
        <Link to="/admin/payouts" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '1.5rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Payouts</h3>
            <p>Manage designer payouts</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
