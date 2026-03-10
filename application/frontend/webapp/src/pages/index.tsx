import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Signup request sent successfully. Check email for confirmation.')
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Outty Signup Test</h1>

      <form onSubmit={handleSignup} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </main>
  )
}