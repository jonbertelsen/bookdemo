import { useEffect, useState } from 'react'
import { request } from '../api'
import { AuthContext } from './useAuth'

function clearSession() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('expiresAt')
}

export default function AuthProvider({ children }) {
  const [member, setMember] = useState(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [expiresAt, setExpiresAt] = useState(null)

  useEffect(() => {
    let active = true
    async function restore() {
      const token = sessionStorage.getItem('token')
      try {
        if (!token) return
        const current = await request('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!active) return
        let expiration = Number(sessionStorage.getItem('expiresAt'))
        if (!expiration) {
          try {
            const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
            expiration = JSON.parse(atob(payload)).exp * 1000
          } catch { /* /auth/me validerer tokenet på serveren. */ }
        }
        if (!expiration || expiration <= Date.now()) {
          clearSession()
          setError('Dit login er udløbet. Log ind igen.')
          return
        }
        setExpiresAt(expiration)
        setMember(current)
      } catch (error) {
        if (!active) return
        if (error.status === 401) clearSession()
        setError(error.status === 401
          ? 'Dit login er udløbet eller ugyldigt. Log ind igen.'
          : 'Kunne ikke kontrollere dit login. Kontrollér forbindelsen og genindlæs siden.')
      } finally {
        if (active) setChecking(false)
      }
    }
    restore()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!member || !expiresAt) return
    function checkExpiration() {
      if (Date.now() < expiresAt) return
      clearSession()
      setMember(null)
      setExpiresAt(null)
      setError('Dit login er udløbet. Log ind igen.')
    }
    const timer = setTimeout(checkExpiration, Math.max(0, expiresAt - Date.now()))
    window.addEventListener('focus', checkExpiration)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', checkExpiration)
    }
  }, [member, expiresAt])

  async function login(username, password) {
    setError('')
    try {
      const result = await request('/auth/login', {
        method: 'POST', body: JSON.stringify({ username, password }),
      })
      const expiration = Date.now() + result.expiresIn * 1000
      sessionStorage.setItem('token', result.token)
      sessionStorage.setItem('expiresAt', String(expiration))
      setExpiresAt(expiration)
      setMember(result.member)
    } catch (error) {
      throw new Error(error.status === 401 ? 'Forkert brugernavn eller kodeord.'
        : error.status === 400 ? 'Udfyld brugernavn og kodeord korrekt.'
        : error.status === 403 ? 'Du har ikke adgang til at logge ind.'
        : 'Kunne ikke logge ind. Kontrollér forbindelsen til API’et og prøv igen.', { cause: error })
    }
  }

  function logout() {
    clearSession()
    setMember(null)
    setExpiresAt(null)
    setError('')
  }

  return <AuthContext.Provider value={{ member, checking, error, login, logout,
    isAdmin: member?.roles?.includes('admin') ?? false }}>
    {children}
  </AuthContext.Provider>
}
