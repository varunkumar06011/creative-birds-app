import { useState, useEffect, useRef, useCallback } from 'react'

const ALERT_DURATION = 30

export default function DesignerAlert({ job, onAccept, onReject, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(ALERT_DURATION)
  const [pulsing, setPulsing] = useState(true)
  const audioCtxRef = useRef(null)
  const intervalRef = useRef(null)
  const oscillatorRef = useRef(null)

  const stopSound = useCallback(() => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop() } catch (e) {}
      oscillatorRef.current = null
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close() } catch (e) {}
      audioCtxRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setPulsing(false)
  }, [])

  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      osc.start()
      oscillatorRef.current = osc
    } catch (e) {
      console.warn('Audio not available:', e)
    }
  }, [])

  useEffect(() => {
    playBeep()
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopSound()
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => stopSound()
  }, [playBeep, stopSound, onExpire])

  const handleAccept = () => {
    stopSound()
    onAccept()
  }

  const handleReject = () => {
    stopSound()
    onReject()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: pulsing ? 'pulseAlert 0.8s infinite alternate' : 'none'
      }}>
        <style>{`
          @keyframes pulseAlert {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(35,73,151,0.4); }
            100% { transform: scale(1.02); box-shadow: 0 0 0 20px rgba(35,73,151,0); }
          }
        `}</style>

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#ffebee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          animation: 'ring 0.5s infinite alternate'
        }}>
          <span style={{ fontSize: '2rem' }}>🔔</span>
          <style>{`
            @keyframes ring {
              0% { transform: rotate(-10deg); }
              100% { transform: rotate(10deg); }
            }
          `}</style>
        </div>

        <h3 style={{ color: '#234997', margin: '0 0 0.5rem' }}>New Job Alert!</h3>
        <p style={{ color: '#666', margin: '0 0 1rem', fontSize: '0.9rem' }}>A customer needs a design urgently</p>

        <div style={{ background: '#f0f4ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'left' }}>
          <p style={{ margin: '0 0 0.3rem', fontWeight: 'bold' }}>{job.packageName}</p>
          <p style={{ margin: '0 0 0.3rem', color: '#234997', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{job.finalPrice || job.price}</p>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>{job.requirements.substring(0, 80)}...</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '4px solid #234997',
            borderTopColor: 'transparent',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: timeLeft <= 10 ? '#e53935' : '#234997' }}>
            {timeLeft}s
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Respond before time runs out</p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={handleAccept} style={{
            flex: 1,
            padding: '0.8rem',
            background: '#234997',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            Accept
          </button>
          <button onClick={handleReject} style={{
            flex: 1,
            padding: '0.8rem',
            background: '#e53935',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
