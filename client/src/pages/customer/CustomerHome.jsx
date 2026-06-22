import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function CustomerHome() {
  const { user } = useAuth()

  if (!user || user.role !== 'customer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a customer.</div>
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#234997', fontSize: '1.3rem' }}>Welcome, {user.name}</h2>
      <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>Get your designs done by top professionals.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Link to="/customer/request" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '2rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>New Request</h3>
            <p>Submit your design requirements</p>
          </div>
        </Link>
        <Link to="/customer/packages" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '2rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Packages</h3>
            <p>View pricing and select a plan</p>
          </div>
        </Link>
        <Link to="/customer/tracking" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '2rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>My Jobs</h3>
            <p>Track your active and past jobs</p>
          </div>
        </Link>
        <Link to="/customer/complaint" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '2rem', border: '2px solid #234997', borderRadius: '8px', textAlign: 'center', color: '#234997', background: '#f8f9ff' }}>
            <h3>Complaint</h3>
            <p>Raise an issue or feedback</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
