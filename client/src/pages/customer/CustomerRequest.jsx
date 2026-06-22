import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TELUGU_TO_ENGLISH_MAP = {
  'లోగో': 'logo',
  'బ్యానర్': 'banner',
  'ఫ్లైయర్': 'flyer',
  'విజిటింగ్ కార్డ్': 'visiting card',
  'సోషల్ మీడియా': 'social media',
  'పోస్టర్': 'poster',
  'బ్రోచర్': 'brochure',
  'ఇలస్ట్రేషన్': 'illustration',
  'వెబ్ డిజైన్': 'web design',
  'ఆప్ డిజైన్': 'app design',
  'ఉచితం': 'free',
  'త్వరగా': 'quick',
  'అవసరం': 'need',
  'డిజైన్': 'design',
  'గ్రాఫిక్': 'graphic',
  'రంగు': 'color',
  'నీలం': 'blue',
  'ఎరుపు': 'red',
  'పచ్చ': 'green',
  'పసుపు': 'yellow',
  'నలుపు': 'black',
  'తెలుపు': 'white',
}

function translateTeluguToEnglish(text) {
  let translated = text
  for (const [te, en] of Object.entries(TELUGU_TO_ENGLISH_MAP)) {
    translated = translated.replace(new RegExp(te, 'g'), en)
  }
  if (/[\u0C00-\u0C7F]/.test(translated)) {
    return translated + ' (AI Translated to English)'
  }
  return translated
}

export default function CustomerRequest() {
  const [input, setInput] = useState('')
  const [isVoice, setIsVoice] = useState(false)
  const [translated, setTranslated] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleTranslate = () => {
    if (!input.trim()) return
    const result = translateTeluguToEnglish(input)
    setTranslated(result)
    setConfirmed(false)
  }

  const handleConfirm = () => {
    if (!translated) return
    localStorage.setItem('designRequirements', translated)
    setConfirmed(true)
  }

  const handleProceed = () => {
    navigate('/customer/packages')
  }

  if (!user || user.role !== 'customer') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as a customer.</div>
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997', fontSize: '1.3rem' }}>New Design Request</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={isVoice} onChange={e => setIsVoice(e.target.checked)} />
          <span>Voice Input (Telugu)</span>
        </label>
      </div>

      {isVoice ? (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Simulating voice input. Type Telugu text below:</p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your requirements in Telugu..."
            rows={4}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your design requirements in English or Telugu..."
            rows={4}
            style={{ width: '100%', padding: '0.7rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <button onClick={handleTranslate} style={{ padding: '0.6rem 1.5rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {isVoice ? 'Translate to English' : 'Review'}
      </button>

      {translated && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f4ff', borderRadius: '6px' }}>
          <h4>Review Requirements:</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{translated}</p>
          {!confirmed && (
            <button onClick={handleConfirm} style={{ marginTop: '0.5rem', padding: '0.5rem 1.2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Confirm
            </button>
          )}
        </div>
      )}

      {confirmed && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>Requirements confirmed!</p>
          <button onClick={handleProceed} style={{ marginTop: '0.5rem', padding: '0.7rem 2rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Select Package & Pay
          </button>
        </div>
      )}
    </div>
  )
}
