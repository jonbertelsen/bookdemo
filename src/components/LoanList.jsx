import { formatDate } from '../api'

export default function LoanList({ loans, books, onReturn, busy }) {
  return (
    <section className='panel' aria-labelledby='loans-title'>
      <h2 id='loans-title'>Mine lån</h2>
      <p>Lånetiden er 14 dage. Aflevering registreres af bibliotekaren.</p>
      {loans.length === 0 && <p className='empty'>Du har ingen aktive lån.</p>}
      <ul className='book-list'>
        {loans.map((loan) => (
          <li key={loan.id}>
            <div>
              <h3>{books.find((book) => book.id === loan.bookId)?.title ?? 'Ukendt bog'}</h3>
              <p>
                Afleveres <time dateTime={loan.dueDate}>{formatDate(loan.dueDate)}</time>
              </p>
            </div>
            <button className='secondary' disabled={busy} onClick={() => onReturn(loan)}>
              Registrér aflevering
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
