import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function CustomerPackages() {
  const [packages, setPackages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeJob, setActiveJob] = useState(null)
  const [jobStatus, setJobStatus] = useState({ totalNotified: 0, totalViewed: 0, totalRejected: 0, totalPending: 0, totalMissed: 0, totalAccepted: 0 })
  const [tipAmount, setTipAmount] = useState(100)
  const [addingTip, setAddingTip] = useState(false)
  const { user } = useAuth()
  const socket = useSocket()

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(data => setPackages(data))
  }, [])

  useEffect(() => {
    if (!socket || !activeJob) return
    socket.on('jobStatusUpdate', (update) => {
      if (update.jobId === activeJob.id) {
        setJobStatus(update)
      }
    })
    socket.on('jobAssigned', (job) => {
      if (job.id === activeJob.id) {
        setActiveJob(prev => ({ ...prev, ...job, status: 'assigned' }))
      }
    })
    socket.on('jobTipAdded', ({ jobId, tip, finalPrice }) => {
      if (jobId === activeJob.id) {
        setActiveJob(prev => ({ ...prev, tip, finalPrice }))
      }
    })
    socket.on('jobExpired', ({ jobId }) => {
      if (jobId === activeJob.id) {
        setActiveJob(prev => ({ ...prev, status: 'expired' }))
      }
    })
    return () => {
      socket.off('jobStatusUpdate')
      socket.off('jobAssigned')
      socket.off('jobTipAdded')
      socket.off('jobExpired')
    }
  }, [socket, activeJob])

  const handlePay = async () => {
    if (!selected) return
    const requirements = localStorage.getItem('designRequirements') || 'No requirements provided'
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          requirements,
          packageId: selected.id,
          packageName: selected.name,
          price: selected.price
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')
      localStorage.removeItem('designRequirements')
      setActiveJob(data.job)
      if (data.status) setJobStatus(data.status)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTip = async () => {
    if (!activeJob || !tipAmount) return
    setAddingTip(true)
    try {
      const res = await fetch(`/api/jobs/${activeJob.id}/tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(tipAmount) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setActiveJob(data.job)
      alert(`Tip of ₹${tipAmount} added! New total: ₹${data.job.finalPrice}`)
    } catch (err) {
      alert(err.message)
    } finally {
      setAddingTip(false)
    }
  }

  if (!user || user.role !== 'customer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a customer.</div>
  }

  if (activeJob) {
    const isAssigned = activeJob.status === 'assigned'
    const isCompleted = activeJob.status === 'completed'
    const isExpired = activeJob.status === 'expired'

    return (
      <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ color: '#234997', textAlign: 'center' }}>
          {isExpired ? 'Request Expired' : isAssigned ? 'Designer Found!' : 'Finding Designer...'}
        </h2>

        <div style={{ background: '#f0f4ff', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{activeJob.packageName}</p>
          <p style={{ margin: '0.3rem 0 0', color: '#234997', fontSize: '1.3rem', fontWeight: 'bold' }}>₹{activeJob.finalPrice || activeJob.price}</p>
          {activeJob.tip > 0 && <p style={{ margin: '0.2rem 0 0', color: '#28a745', fontSize: '0.85rem' }}>Includes ₹{activeJob.tip} tip</p>}
        </div>

        {isExpired && (
          <div style={{ background: '#ffebee', padding: '1.2rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem' }}>
            <p style={{ margin: 0, color: '#e53935', fontWeight: 'bold', fontSize: '1.1rem' }}>No designer accepted</p>
            <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>Your request expired. Try increasing the amount or posting again.</p>
            <button onClick={() => setActiveJob(null)} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Post New Request
            </button>
          </div>
        )}

        {!isAssigned && !isCompleted && !isExpired && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Notified</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#234997' }}>{jobStatus.totalNotified}</p>
              </div>
              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Viewed</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#234997' }}>{jobStatus.totalViewed}</p>
              </div>
              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Rejected</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#e53935' }}>{jobStatus.totalRejected}</p>
              </div>
              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #eee' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>Pending</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#ff9800' }}>{jobStatus.totalPending}</p>
              </div>
            </div>

            <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Increase amount to get assigned faster:</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[100, 200, 500].map(amt => (
                  <button key={amt} onClick={() => setTipAmount(amt)} style={{ flex: 1, padding: '0.5rem', background: tipAmount === amt ? '#234997' : '#eee', color: tipAmount === amt ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    +₹{amt}
                  </button>
                ))}
              </div>
              <button onClick={addTip} disabled={addingTip} style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {addingTip ? 'Adding...' : `Add ₹${tipAmount} Tip`}
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #234997', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                {jobStatus.totalViewed > 0 ? `${jobStatus.totalViewed} of ${jobStatus.totalNotified} designers viewed` : 'Notifying designers...'}
              </p>
            </div>
          </>
        )}

        {isAssigned && (
          <div style={{ background: '#e8f5e9', padding: '1.2rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>Designer Found!</p>
            <p style={{ margin: '0.5rem 0 0' }}><strong>{activeJob.designerName}</strong></p>
            <p style={{ margin: '0.3rem 0' }}>Employee ID: {activeJob.employeeId}</p>
            <p style={{ margin: '0.3rem 0' }}>OTP: {activeJob.otp}</p>
            <a href={activeJob.meetLink} target="_blank" rel="noreferrer" style={{ color: '#234997', fontWeight: 'bold' }}>Join Meeting</a>
          </div>
        )}

        {isCompleted && (
          <div style={{ background: '#e8f5e9', padding: '1.2rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>Job Completed!</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Select a Design Package</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {packages.map(pkg => (
          <div
            key={pkg.id}
            onClick={() => setSelected(pkg)}
            style={{
              padding: '1.2rem',
              border: selected?.id === pkg.id ? '3px solid #234997' : '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              background: selected?.id === pkg.id ? '#f0f4ff' : 'white'
            }}
          >
            <h3 style={{ margin: '0 0 0.3rem' }}>{pkg.name}</h3>
            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#234997', margin: 0 }}>₹{pkg.price}</p>
            <p style={{ margin: '0.3rem 0 0', color: '#666', fontSize: '0.85rem' }}>{pkg.hours} Hour{pkg.hours > 1 ? 's' : ''}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p>You selected: <strong>{selected.name}</strong> — ₹{selected.price}</p>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{ marginTop: '0.8rem', padding: '0.8rem 2.5rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', width: '100%' }}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}
    </div>
  )
}
