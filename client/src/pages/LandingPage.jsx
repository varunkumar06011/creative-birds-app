import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const FEATURES = [
  { icon: '✏️', title: 'Describe Your Design', desc: 'Share your vision in English or Telugu voice/text. Our AI translates and refines your requirements.' },
  { icon: '💰', title: 'Pick a Package', desc: 'Choose from Quick, Standard, or Premium packages. Pay securely and get started instantly.' },
  { icon: '📍', title: 'Live Tracking', desc: 'Watch designers respond in real-time. See who viewed, accepted, or rejected your request.' },
  { icon: '🎨', title: 'Meet Your Designer', desc: 'Get connected via Google Meet with a secure OTP. Collaborate directly and get your design done.' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Post Request', desc: 'Enter design needs via text or voice' },
  { step: '2', title: 'Choose Package', desc: 'Select a plan and complete payment' },
  { step: '3', title: 'Designer Found', desc: 'First available designer accepts' },
  { step: '4', title: 'Design Delivered', desc: 'Meet, collaborate, and get results' },
]

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') navigate('/customer')
      else if (user.role === 'designer') navigate('/designer')
    }
  }, [user, navigate])

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #234997 0%, #3b6fd8 100%)',
        color: 'white',
        padding: '3rem 1rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>

        <h1 style={{ fontSize: '2rem', margin: '0 0 0.8rem', position: 'relative', zIndex: 1 }}>
          Creative Birds
        </h1>
        <p style={{ fontSize: '1rem', margin: '0 0 1.5rem', opacity: 0.9, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 1 }}>
          Get professional graphic designs delivered by top designers — fast, affordable, and hassle-free.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.8rem 1.8rem',
              background: 'white',
              color: '#234997',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              Get Started
            </button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '0.8rem 1.8rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}>
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '2rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#234997', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
          Why Creative Birds?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: '#f8f9ff',
              padding: '1.2rem',
              borderRadius: '12px',
              border: '1px solid #e0e7ff',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <div>
                <h4 style={{ margin: '0 0 0.3rem', color: '#234997', fontSize: '0.95rem' }}>{f.title}</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem', lineHeight: 1.4 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: '2rem 1rem', background: '#f0f4ff' }}>
        <h2 style={{ textAlign: 'center', color: '#234997', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
          How It Works
        </h2>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '1.2rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#234997',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                margin: '0 auto 0.5rem'
              }}>{step.step}</div>
              <h4 style={{ margin: '0 0 0.3rem', color: '#234997', fontSize: '0.9rem' }}>{step.title}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div style={{ padding: '2rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#234997', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
          Design Packages
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'Quick Design', hours: 1, price: 1000, color: '#234997' },
            { name: 'Standard Design', hours: 2, price: 2000, color: '#3b6fd8' },
            { name: 'Premium Design', hours: 3, price: 2500, color: '#234997' },
          ].map((pkg, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              border: `2px solid ${pkg.color}`,
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem', color: pkg.color }}>{pkg.name}</h3>
              <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: pkg.color, margin: '0 0 0.3rem' }}>₹{pkg.price}</p>
              <p style={{ margin: '0 0 1rem', color: '#666', fontSize: '0.85rem' }}>{pkg.hours} Hour{pkg.hours > 1 ? 's' : ''}</p>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: pkg.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Choose Plan
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #234997 0%, #3b6fd8 100%)',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 0.8rem', fontSize: '1.3rem' }}>Ready to get your design?</h2>
        <p style={{ margin: '0 0 1.2rem', opacity: 0.9, fontSize: '0.9rem' }}>
          Join thousands of customers who trust Creative Birds.
        </p>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '0.8rem 2rem',
            background: 'white',
            color: '#234997',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            Sign Up Now
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.8rem', background: '#f5f5f5' }}>
        <p style={{ margin: 0 }}>© 2026 Creative Birds. All rights reserved.</p>
      </div>
    </div>
  )
}
