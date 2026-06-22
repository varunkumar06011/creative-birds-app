import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const [customers, setCustomers] = useState([])
  const [designers, setDesigners] = useState([])
  const [activeTab, setActiveTab] = useState('customers')
  const [editingDesigner, setEditingDesigner] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(data => setCustomers(data))
    fetch('/api/designers').then(r => r.json()).then(data => setDesigners(data))
  }, [])

  const updateDesigner = async () => {
    if (!editingDesigner) return
    try {
      const res = await fetch(`/api/designers/${editingDesigner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDesigner)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDesigners(prev => prev.map(d => d.id === data.id ? data : d))
      setEditingDesigner(null)
    } catch (err) {
      alert(err.message)
    }
  }

  if (!user || user.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Please login as admin.</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#234997' }}>Manage Users</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('customers')} style={{ padding: '0.5rem 1.2rem', background: activeTab === 'customers' ? '#234997' : '#eee', color: activeTab === 'customers' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Customers
        </button>
        <button onClick={() => setActiveTab('designers')} style={{ padding: '0.5rem 1.2rem', background: activeTab === 'designers' ? '#234997' : '#eee', color: activeTab === 'designers' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Designers
        </button>
      </div>

      {activeTab === 'customers' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#234997', color: 'white' }}>
              <th style={{ padding: '0.7rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.7rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.7rem', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '0.7rem', textAlign: 'left' }}>Total Spent</th>
              <th style={{ padding: '0.7rem', textAlign: 'left' }}>Jobs</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.7rem' }}>{c.name}</td>
                <td style={{ padding: '0.7rem' }}>{c.email}</td>
                <td style={{ padding: '0.7rem' }}>{c.phone}</td>
                <td style={{ padding: '0.7rem' }}>₹{c.totalSpent || 0}</td>
                <td style={{ padding: '0.7rem' }}>{c.totalJobs || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'designers' && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#234997', color: 'white' }}>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Employee ID</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Aadhaar</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Jobs</th>
                <th style={{ padding: '0.7rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {designers.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.7rem' }}>{d.name}</td>
                  <td style={{ padding: '0.7rem' }}>{d.email}</td>
                  <td style={{ padding: '0.7rem' }}>{d.employeeId}</td>
                  <td style={{ padding: '0.7rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '10px', background: d.status === 'active' ? '#28a745' : '#ff9800', color: 'white', fontSize: '0.75rem' }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem' }}>{d.aadhaar || '-'}</td>
                  <td style={{ padding: '0.7rem' }}>{d.totalJobs || 0}</td>
                  <td style={{ padding: '0.7rem' }}>
                    <button onClick={() => setEditingDesigner({ ...d })} style={{ padding: '0.3rem 0.8rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingDesigner && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fafafa' }}>
              <h3>Edit Designer</h3>
              <div style={{ marginBottom: '0.8rem' }}>
                <label>Name</label>
                <input type="text" value={editingDesigner.name} onChange={e => setEditingDesigner({ ...editingDesigner, name: e.target.value })} style={{ width: '100%', padding: '0.4rem' }} />
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <label>Status</label>
                <select value={editingDesigner.status} onChange={e => setEditingDesigner({ ...editingDesigner, status: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                <label>Aadhaar</label>
                <input type="text" value={editingDesigner.aadhaar} onChange={e => setEditingDesigner({ ...editingDesigner, aadhaar: e.target.value })} maxLength={12} style={{ width: '100%', padding: '0.4rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={updateDesigner} style={{ padding: '0.5rem 1.2rem', background: '#234997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditingDesigner(null)} style={{ padding: '0.5rem 1.2rem', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
