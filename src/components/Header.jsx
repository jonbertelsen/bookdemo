function Header({ member }) {
  return (
    <header>
      <div>
        <p className='eyebrow'>React · Library demo</p>
        <h1>Det lille bibliotek</h1>
      </div>
      <p>
        Logget ind som <strong>{member?.name ?? 'Alex Jensen'}</strong>
      </p>
    </header>
  )
}

export default Header
