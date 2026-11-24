import { Link, useOutletContext, useParams } from 'react-router'

export default function BookDetailsPage() {
  const { bookId } = useParams()
  const { books, loans, borrowBook, busy } = useOutletContext()
  const book = books.find((book) => String(book.id) === bookId)

  if (!book) {
    return (
      <section className='panel'>
        <h2>Bogen findes ikke</h2>
        <Link to='/books'>Til kataloget</Link>
      </section>
    )
  }

  const available = !loans.some(
    (loan) => loan.bookId === book.id && !loan.returned,
  )

  return (
    <section className='panel'>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <p>{available ? 'Ledig' : 'Udlånt'}</p>
      <button disabled={busy || !available} onClick={() => borrowBook(book)}>
        Lån bog
      </button>
      <p><Link to='/books'>Til kataloget</Link></p>
    </section>
  )
}
