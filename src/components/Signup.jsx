import { useState } from 'react'
import { auth } from '../firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">LMS</div>
        <h1>Create Account</h1>
        <p>Lead Management System</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" type="submit">Sign Up</button>
        </form>
        <p className="auth-toggle" onClick={onSwitchToLogin}>Already have an account? Login</p>
      </div>
    </div>
  )
}