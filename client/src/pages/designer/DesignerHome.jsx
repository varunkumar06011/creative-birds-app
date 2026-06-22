import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function DesignerHome() {
  const { user, updateUser } = useAuth()
  const socket = useSocket()
  const [onlineStatus, setOnlineStatus] = useState(user?.onlineStatus || 'offline')

  useEffect(() => {
    if (!socket || !user || user.role !== 'designer') return
    if (user.onboardingComplete && onlineStatus === 'online') {
      socket.emit('designerOnline', { designerId: user.id })
    }
    return () => {
      if (socket && user) socket.emit('designerOffline', { designerId: user.id })
    }
  }, [socket, user])

  const toggleStatus = (status) => {
    if (!socket || !user) return
    setOnlineStatus(status)
    updateUser({ ...user, onlineStatus: status })
    if (status === 'online') {
      socket.emit('designerOnline', { designerId: user.id })
    } else if (status === 'busy') {
      socket.emit('designerBusy', { designerId: user.id })
    } else {
      socket.emit('designerOffline', { designerId: user.id })
    }
  }

  if (!user || user.role !== 'designer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a designer.</div>
  }

  if (!user.onboardingComplete) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#234997' }}>Welcome, {user.name}</h2>
        <p>Please complete your onboarding to start accepting jobs.</p>
        <Link to="/designer/onboarding">
          <button style={{ marginTop: '1rem', padding: '0.7rem 2rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Complete Onboarding
          </button>
        </Link>
      </div>
    )
  }

  const statusColors = {
    online: '#28a745',
    offline: '#999',
    busy: '#ff9800'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#234997', margin: 0 }}>Designer Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: statusColors[onlineStatus], display: 'inline-block' }}></span>
          <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{onlineStatus}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 1.5rem' }}>
        <button onClick={() => toggleStatus('online')} disabled={onlineStatus === 'online'} style={{ padding: '0.5rem 1.2rem', background: onlineStatus === 'online' ? '#28a745' : '#eee', color: onlineStatus === 'online' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Online
        </button>
        <button onClick={() => toggleStatus('busy')} disabled={onlineStatus === 'busy'} style={{ padding: '0.5rem 1.2rem', background: onlineStatus === 'busy' ? '#ff9800' : '#eee', color: onlineStatus === 'busy' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Busy
        </button>
        <button onClick={() => toggleStatus('offline')} disabled={onlineStatus === 'offline'} style={{ padding: '0.5rem 1.2rem', background: onlineStatus === 'offline' ? '#999' : '#eee', color: onlineStatus === 'offline' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Offline
        </button>
      </div>

      <p>Welcome back, {user.name}!</p>
      <p><strong>Employee ID:</strong> {user.employeeId}</p>
      <p><strong>Credits:</strong> {user.credits}</p>
      <p><strong>Earnings:</strong> ₹{user.earnings}</p>
      <p><strong>Pending Payout:</strong> ₹{user.pendingPayout}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <Link to="/designer/jobs" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '2rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Available Jobs</h3>
            <p>View and accept new jobs</p>
          </div>
        </Link>
        <Link to="/designer/earnings" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '2rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Earnings</h3>
            <p>View payouts and history</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
