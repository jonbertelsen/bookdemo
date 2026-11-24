import { Link, useParams } from 'react-router'

export default function HelpPage() {
  const { topic } = useParams()

  return (
    <section className='panel'>
      <h2>Hjælp</h2>
      {!topic && <p>Vælg et emne.</p>}
      {topic === 'borrowing' && <p>Du kan låne ledige bøger i kataloget.</p>}
      {topic && topic !== 'borrowing' && <p>Ukendt hjælpeemne.</p>}
      <Link to='/help/borrowing'>Hvordan låner jeg?</Link>
    </section>
  )
}
