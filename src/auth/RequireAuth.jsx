import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router'
import { useAuth } from './useAuth'

export default function RequireAuth({ admin = false }) {
  const { member, checking, isAdmin } = useAuth()
  const location = useLocation()
  const context = useOutletContext()
  if (checking) return <p role='status'>Kontrollerer login…</p>
  if (!member) return <Navigate to='/login' state={{ from: location.pathname }} replace />
  if (admin && !isAdmin) return <p role='alert'>Du skal være administrator for at tilføje bøger.</p>
  return <Outlet context={context} />
}
