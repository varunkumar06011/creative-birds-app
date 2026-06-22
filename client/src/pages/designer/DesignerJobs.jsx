import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function DesignerJobs() {
  const [jobs, setJobs] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [viewedJobs, setViewedJobs] = useState(new Set())
  const { user } = useAuth()
  const socket = useSocket()

  const isOnline = user?.onlineStatus === 'online'

  useEffect(() => {
    if (!user) return
    if (isOnline) {
      fetch('/api/jobs?status=pending')
        .then(r => r.json())
        .then(data => setJobs(data))
    }
    fetch(`/api/jobs?designerId=${user.id}`)
      .then(r => r.json())
      .then(data => setMyJobs(data))
  }, [user, isOnline])

  useEffect(() => {
    if (!socket || !isOnline) return
    socket.on('newJob', (job) => {
      setJobs(prev => [job, ...prev])
    })
    socket.on('jobAssigned', (job) => {
      setJobs(prev => prev.filter(j => j.id !== job.id))
      if (job.designerId === user?.id) {
        setMyJobs(prev => [job, ...prev])
      }
    })
    return () => {
      socket.off('newJob')
      socket.off('jobAssigned')
    }
  }, [socket, user, isOnline])

  const viewJob = (jobId) => {
    if (!socket || !user || viewedJobs.has(jobId)) return
    socket.emit('viewJob', { jobId, designerId: user.id })
    setViewedJobs(prev => new Set(prev).add(jobId))
  }

  const acceptJob = async (jobId) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designerId: user.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to accept job')
      setJobs(prev => prev.filter(j => j.id !== jobId))
      setMyJobs(prev => [data.job, ...prev])
      alert(`Job accepted! Meet Link: ${data.job.meetLink}\nCustomer OTP: ${data.job.otp}`)
    } catch (err) {
      alert(err.message)
    }
  }

  const rejectJob = (jobId) => {
    if (!socket || !user) return
    socket.emit('rejectJob', { jobId, designerId: user.id })
    setJobs(prev => prev.filter(j => j.id !== jobId))
  }

  const completeJob = async (jobId) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/complete`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to complete job')
      setMyJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'completed' } : j))
      alert('Job marked as completed!')
    } catch (err) {
      alert(err.message)
    }
  }

  if (!user || user.role !== 'designer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a designer.</div>
  }

  if (!isOnline) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#234997' }}>Available Jobs</h2>
        <p style={{ marginTop: '2rem', color: '#666' }}>You are currently offline. Go Online on your dashboard to receive job alerts.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Available Jobs</h2>
      {jobs.length === 0 && <p>No available jobs right now.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {jobs.map(job => (
          <div key={job.id} style={{ padding: '1.2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <h4>{job.packageName} — ₹{job.finalPrice || job.price}</h4>
            <p style={{ color: '#555' }}>{job.requirements}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => viewJob(job.id)} style={{ padding: '0.5rem 1.2rem', background: '#eee', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {viewedJobs.has(job.id) ? 'Viewed' : 'View Details'}
              </button>
              <button onClick={() => acceptJob(job.id)} style={{ padding: '0.5rem 1.2rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Accept Job
              </button>
              <button onClick={() => rejectJob(job.id)} style={{ padding: '0.5rem 1.2rem', background: '#e53935', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ color: '#234997' }}>My Jobs</h2>
      {myJobs.length === 0 && <p>No jobs assigned yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myJobs.map(job => (
          <div key={job.id} style={{ padding: '1.2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f8f9ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>{job.packageName} — ₹{job.finalPrice || job.price}</h4>
              <span style={{ padding: '0.3rem 0.8rem', borderRadius: '12px', background: job.status === 'completed' ? '#28a745' : '#234997', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {job.status}
              </span>
            </div>
            <p style={{ color: '#555' }}>{job.requirements}</p>
            <p><strong>Customer Name:</strong> {job.customerName}</p>
            {job.meetLink && (
              <p><strong>Meet Link:</strong> <a href={job.meetLink} target="_blank" rel="noreferrer" style={{ color: '#234997' }}>{job.meetLink}</a></p>
            )}
            {job.otp && <p><strong>OTP:</strong> {job.otp}</p>}
            {job.status === 'assigned' && (
              <button onClick={() => completeJob(job.id)} style={{ marginTop: '0.5rem', padding: '0.5rem 1.2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Mark as Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
