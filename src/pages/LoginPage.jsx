import { useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'

export default function LoginPage() {
  const { member, login } = useAuth()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const from = location.state?.from
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && from !== '/login' ? from : '/loans'
  if (member) return <Navigate to={destination} replace />

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try { await login(username.trim(), password) }
    catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }

  return <section className='panel login-panel'>
    <h2>Log ind</h2>
    <p>Log ind som medlem for at låne bøger og se dine lån.</p>
    <form onSubmit={submit}>
      <label htmlFor='username'>Brugernavn</label>
      <input id='username' autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)} required disabled={busy} />
      <label htmlFor='password'>Kodeord</label>
      <input id='password' type='password' autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} required disabled={busy} />
      {error && <p className='error' role='alert'>{error}</p>}
      <button disabled={busy}>{busy ? 'Logger ind…' : 'Log ind'}</button>
    </form>
  </section>
}
