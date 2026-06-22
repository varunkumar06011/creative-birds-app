import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AutoLoginAdmin({ children }) {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(!user || user.role !== 'admin')

  useEffect(() => {
    if (user && user.role === 'admin') {
      setLoading(false)
      return
    }

    const autoLogin = async () => {
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
          console.error('Admin auto-login failed:', data.error)
        }
      } catch (err) {
        console.error('Admin auto-login error:', err)
      } finally {
        setLoading(false)
      }
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
    return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'red' }}>Admin access failed.</div>
  }

  return children
}
