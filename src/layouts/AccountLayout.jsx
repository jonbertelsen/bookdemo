import { NavLink, Outlet, useOutletContext } from 'react-router'

export default function AccountLayout() {
  const library = useOutletContext()

  return (
    <section>
      <h2>Min konto</h2>
      <nav aria-label='Kontomenu'>
        <NavLink to='.' end>Overblik</NavLink>
        <NavLink to='loans'>Mine lån</NavLink>
      </nav>
      <Outlet context={library} />
    </section>
  )
}
