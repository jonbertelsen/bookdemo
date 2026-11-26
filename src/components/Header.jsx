import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth'

function Header() {
  const { member, checking, logout } = useAuth()
  return (
    <header>
      <div>
        <p className='eyebrow'>React · Library demo</p>
        <h1>Det lille bibliotek</h1>
      </div>
      {!checking && (member ? <div>
        <p>Logget ind som <strong>{member.name}</strong></p>
        <button className='secondary' onClick={logout}>Log ud</button>
      </div> : <Link to='/login'>Log ind</Link>)}
    </header>
  )
}

export default Header
