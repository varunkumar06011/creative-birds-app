import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data.user)
      if (data.user.role === 'designer') navigate('/designer')
      else if (data.user.role === 'customer') navigate('/customer')
      else setError('Please use /admin URL for admin access')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #234997 0%, #3b6fd8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '420px', width: '100%', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#234997', margin: '0 0 0.3rem', fontSize: '1.5rem' }}>Creative Birds</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Welcome back! Login to continue.</p>
        </div>

        {error && <p style={{ color: '#e53935', textAlign: 'center', margin: '0 0 1rem', fontSize: '0.85rem', background: '#ffebee', padding: '0.5rem', borderRadius: '6px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '0.8rem', background: '#234997', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 12px rgba(35,73,151,0.3)' }}
          >
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.85rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#234997', fontWeight: 'bold', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
