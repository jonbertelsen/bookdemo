import { useState } from 'react'
import { Link } from 'react-router'

export default function Catalogue({ books, loans, onBorrow, busy }) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLocaleLowerCase('da-DK')
  const visibleBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLocaleLowerCase('da-DK').includes(query),
  )

  return (
    <section className='panel' aria-labelledby='catalogue-title'>
      <div className='section-heading'>
        <h2 id='catalogue-title'>Katalog</h2>
        <span>{books.length} bøger</span>
      </div>
      <label htmlFor='search'>Søg efter titel eller forfatter</label>
      <input
        id='search'
        type='search'
        placeholder='Prøv fx clean eller martin'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {visibleBooks.length === 0 && <p className='empty'>Ingen bøger fundet.</p>}
      <ul className='book-list'>
        {visibleBooks.map((book) => {
          const available = !loans.some((loan) => loan.bookId === book.id && !loan.returned)
          return (
            <li key={book.id}>
              <div>
                <h3>
                  <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h3>
                <p>{book.author}</p>
                <span className={`badge ${available ? 'available' : ''}`}>
                  {available ? 'Ledig' : 'Udlånt'}
                </span>
              </div>
              <button
                disabled={busy}
                onClick={() => onBorrow(book)}
                aria-label={`Lån ${book.title}`}>
                Lån bog
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
