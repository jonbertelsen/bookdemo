import { Link } from 'react-router'

export default function HomePage() {
  return (
    <section className='panel'>
      <h2>Velkommen til det lille bibliotek</h2>
      <p>Find din næste bog, eller få overblik over dine lån.</p>
      <Link to='/books'>Se bøgerne</Link>
    </section>
  )
}
