import { useState, useEffect } from 'react'
import LeadForm from './components/Leadform.jsx'
import Auth from './components/Auth.jsx'
import { auth } from './firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const API_URL = 'http://127.0.0.1:8000'

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function App() {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  // Backend se leads laao
  useEffect(() => {
    fetch(`${API_URL}/leads`)
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.log('Failed to load leads', err))
  }, [])

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || lead.email.toLowerCase().includes(search.toLowerCase()) || lead.company.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const total = leads.length
  const newCount = leads.filter((l) => l.status === 'New').length
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length
  const convertedCount = leads.filter((l) => l.status === 'Converted').length

  const handleSaveLead = async (formData) => {
    if (editingLead) {
      const res = await fetch(`${API_URL}/leads/${editingLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const updatedLead = await res.json()
      setLeads(leads.map((l) => (l.id === editingLead.id ? updatedLead : l)))
    } else {
      const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const newLead = await res.json()
      setLeads([...leads, newLead])
    }
    setShowForm(false)
    setEditingLead(null)
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead?')) {
      await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' })
      setLeads(leads.filter((l) => l.id !== id))
    }
  }

  const handleAddClick = () => {
    setEditingLead(null)
    setShowForm(true)
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>
  if (!user) return <Auth />

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo">LMS</div>
          <div>
            <h1>Lead Management System</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleAddClick}>+ Add Lead</button>
          <button className="btn-secondary" onClick={() => signOut(auth)}>Logout</button>
        </div>
      </header>

      <div className="stats">
        <div className="stat-card"><span>Total Leads</span><strong>{total}</strong><small>All time</small></div>
        <div className="stat-card"><span>New</span><strong>{newCount}</strong><small>Need follow-up</small></div>
        <div className="stat-card"><span>Contacted</span><strong>{contactedCount}</strong><small>In conversation</small></div>
        <div className="stat-card"><span>Converted</span><strong>{convertedCount}</strong><small>Closed won</small></div>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Search by name, email, company..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <div className="table-card">
        <div className="table-head">
          <h2>All Leads</h2>
          <span>{filteredLeads.length} leads</span>
        </div>
        <table className="leads-table">
          <thead>
            <tr><th>Lead</th><th>Phone</th><th>Company</th><th>Source</th><th>Status</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className="lead-cell">
                    <div className="avatar">{getInitials(lead.name)}</div>
                    <div><div className="lead-name">{lead.name}</div><div className="lead-email">{lead.email}</div></div>
                  </div>
                </td>
                <td>{lead.phone}</td>
                <td>{lead.company}</td>
                <td>{lead.source}</td>
                <td><span className={`badge status-${lead.status.toLowerCase()}`}>{lead.status}</span></td>
                <td>{lead.created}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(lead)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(lead.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeads.length === 0 && <p className="empty">No leads found.</p>}
      </div>

      {showForm && <LeadForm onClose={() => { setShowForm(false); setEditingLead(null) }} onSubmit={handleSaveLead} initialData={editingLead} />}
    </div>
  )
}