import { useState } from 'react'
import Login from './Login.jsx'
import Signup from './Signup.jsx'

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false)

  if (isSignup) {
    return <Signup onSwitchToLogin={() => setIsSignup(false)} />
  }
  return <Login onSwitchToSignup={() => setIsSignup(true)} />
}