import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className='panel'>
      <h2>Siden findes ikke</h2>
      <p>Kontrollér adressen, eller gå tilbage til forsiden.</p>
      <Link to='/'>Til forsiden</Link>
    </section>
  )
}
