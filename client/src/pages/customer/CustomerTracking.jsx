import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function CustomerTracking() {
  const [jobs, setJobs] = useState([])
  const [liveStatus, setLiveStatus] = useState({})
  const { user } = useAuth()
  const socket = useSocket()

  useEffect(() => {
    if (!user) return
    fetch(`/api/jobs?customerId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        setJobs(data)
        data.forEach(job => {
          if (job.status === 'pending') {
            fetch(`/api/jobs/${job.id}/status`)
              .then(r => r.json())
              .then(d => setLiveStatus(prev => ({ ...prev, [job.id]: d.status })))
          }
        })
      })
  }, [user])

  useEffect(() => {
    if (!socket) return
    socket.on('jobStatusUpdate', (update) => {
      setLiveStatus(prev => ({ ...prev, [update.jobId]: update }))
    })
    socket.on('jobAssigned', (job) => {
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, ...job } : j))
    })
    return () => {
      socket.off('jobStatusUpdate')
      socket.off('jobAssigned')
    }
  }, [socket])

  if (!user || user.role !== 'customer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a customer.</div>
  }

  const statusColors = {
    pending: '#ff9800',
    assigned: '#234997',
    completed: '#28a745'
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#234997', fontSize: '1.2rem' }}>My Jobs</h2>
      {jobs.length === 0 && <p style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>No jobs yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.8rem' }}>
        {jobs.map(job => {
          const live = liveStatus[job.id]
          const isPending = job.status === 'pending'
          return (
            <div key={job.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '12px', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{job.packageName}</h4>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', background: statusColors[job.status] || '#999', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {job.status}
                </span>
              </div>
              <p style={{ margin: '0.4rem 0', color: '#555', fontSize: '0.85rem' }}>{job.requirements.substring(0, 60)}...</p>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#234997', fontSize: '1rem' }}>₹{job.finalPrice || job.price}</p>

              {isPending && live && (
                <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#fff', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>Live Progress</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>Viewed</p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#234997' }}>{live.totalViewed || 0}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>Rejected</p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#e53935' }}>{live.totalRejected || 0}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#666' }}>Pending</p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#ff9800' }}>{live.totalPending || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {job.designerName && (
                <div style={{ marginTop: '0.6rem', fontSize: '0.85rem' }}>
                  <p style={{ margin: 0 }}><strong>Designer:</strong> {job.designerName}</p>
                  <p style={{ margin: '0.2rem 0' }}>ID: {job.employeeId}</p>
                </div>
              )}
              {job.meetLink && (
                <a href={job.meetLink} target="_blank" rel="noreferrer" style={{ color: '#234997', fontSize: '0.85rem', fontWeight: 'bold' }}>Join Meeting</a>
              )}
              {job.otp && (
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}><strong>OTP:</strong> {job.otp}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
