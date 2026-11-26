import { NavLink } from 'react-router'

function TopMenu() {
  return (
    <nav aria-label='Hovedmenu'>
      <NavLink to='/' end>
        Forside
      </NavLink>
      <NavLink to='/books' end>
        Bøger
      </NavLink>
      <NavLink to='/loans'>Mine lån</NavLink>
      <NavLink to='/books/new'>Tilføj bog</NavLink>
    </nav>
  )
}

export default TopMenu
