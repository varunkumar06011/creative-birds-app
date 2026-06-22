import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AutoLoginAdmin({ children }) {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(!user || user.role !== 'admin')
  const [error, setError] = useState('')

  const autoLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'vijay@creativebirds.com', password: 'vijay123' })
      })
      const data = await res.json()
      if (res.ok && data.user) {
        login(data.user)
      } else {
        setError(data.error || 'Admin auto-login failed')
      }
    } catch (err) {
      setError('Server not reachable. Please make sure the backend is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === 'admin') {
      setLoading(false)
      return
    }
    autoLogin()
  }, [user, login])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', color: '#234997' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #234997',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '0 1rem' }}>
        <p style={{ color: '#e53935', marginBottom: '1rem' }}>{error || 'Admin access failed.'}</p>
        <button
          onClick={autoLogin}
          style={{ padding: '0.6rem 1.5rem', background: '#234997', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Retry
        </button>
      </div>
    )
  }

  return children
}
