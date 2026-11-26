import { NavLink } from 'react-router'

import { useAuth } from '../auth/useAuth'

function TopMenu() {
  const { member, isAdmin } = useAuth()
  return (
    <nav aria-label='Hovedmenu'>
      <NavLink to='/' end>
        Forside
      </NavLink>
      <NavLink to='/books' end>
        Bøger
      </NavLink>
      {member && <NavLink to='/loans'>Mine lån</NavLink>}
      {isAdmin && <NavLink to='/books/new'>Tilføj bog</NavLink>}
    </nav>
  )
}

export default TopMenu
