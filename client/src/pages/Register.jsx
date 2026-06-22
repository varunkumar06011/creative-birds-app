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
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ color: '#234997', textAlign: 'center' }}>Creative Birds</h2>
      <h3 style={{ textAlign: 'center' }}>Register</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Phone</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}>
            <option value="customer">Customer</option>
            <option value="designer">Designer</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.7rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  )
}
