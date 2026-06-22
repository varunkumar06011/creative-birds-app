import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function CustomerComplaint() {
  const [jobId, setJobId] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/jobs/${jobId}/complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user.id, message })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit complaint')
      setSuccess('Complaint submitted successfully.')
      setJobId('')
      setMessage('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user || user.role !== 'customer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a customer.</div>
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997', fontSize: '1.3rem' }}>Raise a Complaint</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: '#28a745' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Job ID</label>
          <input type="text" value={jobId} onChange={e => setJobId(e.target.value)} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Complaint / Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} />
        </div>
        <button type="submit" style={{ padding: '0.7rem 1.5rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Complaint
        </button>
      </form>
    </div>
  )
}
