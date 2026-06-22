import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/transactions')
      .then(r => r.json())
      .then(data => setTransactions(data))
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Transactions</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#234997', color: 'white' }}>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Transaction ID</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Customer</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Admin Share</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Designer Share</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '0.7rem', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.7rem' }}>{t.id.slice(0, 8)}...</td>
              <td style={{ padding: '0.7rem' }}>{t.customerName}</td>
              <td style={{ padding: '0.7rem' }}>₹{t.amount}</td>
              <td style={{ padding: '0.7rem' }}>₹{t.adminShare}</td>
              <td style={{ padding: '0.7rem' }}>₹{t.designerShare}</td>
              <td style={{ padding: '0.7rem' }}>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', background: t.releasedAt ? '#28a745' : '#234997', color: 'white', fontSize: '0.75rem' }}>
                  {t.releasedAt ? 'Released' : 'Held'}
                </span>
              </td>
              <td style={{ padding: '0.7rem' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
