import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function DesignerOnboarding() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!termsAccepted) {
      setError('You must accept the Terms & Conditions')
      return
    }
    setError('')
    try {
      const res = await fetch('/api/designers/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designerId: user.id, aadhaar, termsAccepted })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Onboarding failed')
      updateUser(data)
      alert('Onboarding complete! You can now accept jobs.')
      navigate('/designer')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user || user.role !== 'designer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a designer.</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Designer Onboarding</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Contact Number</label>
          <input type="tel" value={contact} onChange={e => setContact(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Aadhaar Number</label>
          <input type="text" value={aadhaar} onChange={e => setAadhaar(e.target.value)} required maxLength={12} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
            <span>I accept the Terms & Conditions. I agree to the platform rules and understand that 50% of each project fee will be held for 6 days before release.</span>
          </label>
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.7rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Complete Onboarding
        </button>
      </form>
    </div>
  )
}
