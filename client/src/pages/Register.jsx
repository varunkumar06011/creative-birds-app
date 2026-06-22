import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      login(data.user)
      if (role === 'designer') navigate('/designer/onboarding')
      else navigate('/customer')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #234997 0%, #3b6fd8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '420px', width: '100%', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#234997', margin: '0 0 0.3rem', fontSize: '1.5rem' }}>Creative Birds</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Create your account to get started.</p>
        </div>

        {error && <p style={{ color: '#e53935', textAlign: 'center', margin: '0 0 1rem', fontSize: '0.85rem', background: '#ffebee', padding: '0.5rem', borderRadius: '6px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="10-digit mobile" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#333' }}>I want to</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box', background: 'white' }}>
              <option value="customer">Hire a Designer</option>
              <option value="designer">Work as Designer</option>
            </select>
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.8rem', background: '#234997', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 12px rgba(35,73,151,0.3)' }}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#234997', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
