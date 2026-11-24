import { useEffect, useState } from 'react'
import { getDueDate, request } from './api'
import BookForm from './components/BookForm'
import Catalogue from './components/Catalogue'
import LoanList from './components/LoanList'
import './App.css'

const CURRENT_MEMBER_ID = '1'

export default function App() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [books, members, loans] = await Promise.all([
          request('/books'),
          request('/members'),
          request('/loans'),
        ])
        setBooks(books)
        setMembers(members)
        setLoans(loans)
      } catch (error) {
        setError(
          `${error.message} Kontrollér at JSON Server kører på port 4000, og genindlæs siden.`,
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function save(action) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await action()
      return true
    } catch (error) {
      setError(error.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  function addBook(book) {
    return save(async () => {
      const created = await request('/books', { method: 'POST', body: JSON.stringify(book) })
      setBooks((previous) => [...previous, created])
      setMessage(`“${created.title}” er tilføjet til kataloget.`)
    })
  }

  function borrowBook(book) {
    return save(async () => {
      // Hent igen, så vi også opdager lån oprettet siden sidens indlæsning.
      const latestLoans = await request('/loans')
      setLoans(latestLoans)
      if (latestLoans.some((loan) => loan.bookId === book.id && !loan.returned)) {
        throw new Error('Intet eksemplar er ledigt. Bogen er allerede udlånt.')
      }
      const loan = await request('/loans', {
        method: 'POST',
        body: JSON.stringify({
          bookId: book.id,
          memberId: CURRENT_MEMBER_ID,
          dueDate: getDueDate(),
          returned: false,
        }),
      })
      setLoans((previous) => [...previous, loan])
      setMessage(`Du har lånt “${book.title}”.`)
    })
  }

  function returnBook(loan) {
    return save(async () => {
      const updated = await request(`/loans/${loan.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ returned: true }),
      })
      setLoans((previous) => previous.map((item) => (item.id === updated.id ? updated : item)))
      setMessage('Afleveringen er registreret. Bogen er ledig igen.')
    })
  }

  const member = members.find((member) => member.id === CURRENT_MEMBER_ID)
  const myLoans = loans.filter((loan) => loan.memberId === CURRENT_MEMBER_ID && !loan.returned)

  return (
    <main>
      <header>
        <div>
          <p className='eyebrow'>React · Library demo</p>
          <h1>Det lille bibliotek</h1>
        </div>
        <p>
          Logget ind som <strong>{member?.name ?? 'Alex Jensen'}</strong>
        </p>
      </header>
      <p className='intro'>
        Find din næste bog, hold styr på dine lån og gør plads til nye læseoplevelser.
      </p>
      {error && (
        <p className='notice error' role='alert'>
          {error}
        </p>
      )}
      <p className='status' role='status'>
        {message}
      </p>
      {loading ? (
        <p>Henter biblioteket…</p>
      ) : (
        member && (
          <div className='layout'>
            <div>
              <Catalogue books={books} loans={loans} onBorrow={borrowBook} busy={busy} />
              <LoanList loans={myLoans} books={books} onReturn={returnBook} busy={busy} />
            </div>
            <BookForm onAdd={addBook} busy={busy} />
          </div>
        )
      )}
      <footer>Undervisningsdemo · Ét eksemplar pr. bog · Ingen login eller rollekontrol</footer>
    </main>
  )
}
