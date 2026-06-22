import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate('/')
    }
  }, [user, navigate, allowedRoles])

  if (!user) {
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
        <p>Loading...</p>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem', color: '#e53935' }}>
        Access denied.
      </div>
    )
  }

  return children
}
