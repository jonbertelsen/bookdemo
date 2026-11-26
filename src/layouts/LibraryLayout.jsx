import { useEffect, useState } from 'react'
import { getDueDate, request } from '../api'
import { Outlet, useNavigate } from 'react-router'
import Header from '../components/Header'
import TopMenu from '../components/TopMenu'
import '../styles/App.css'

import { useAuth } from '../auth/useAuth'

export default function LibraryLayout() {
  const [books, setBooks] = useState([])
  const { member, checking, error: authError, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [books, loans] = await Promise.all([
          request('/books'),
          request('/loans'),
        ])
        setBooks(books)
        setLoans(loans)
      } catch (error) {
        setError(
          `${error.message} Kontrollér at Javalin API’et kører på port 7070, og genindlæs siden.`,
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
      if (error.status === 401) {
        logout()
        setError('Dit login er udløbet eller ugyldigt. Log ind igen.')
      } else if (error.status === 403) {
        setError('Du har ikke den nødvendige rolle til at udføre denne handling.')
      } else {
        setError(error.message)
      }
      return false
    } finally {
      setBusy(false)
    }
  }

  function addBook(book) {
    return save(async () => {
      if (!isAdmin) throw new Error('Du skal være administrator for at tilføje bøger.')
      const created = await request('/books', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify(book),
      })
      setBooks((previous) => [...previous, created])
      setMessage(`“${created.title}” er tilføjet til kataloget.`)
    })
  }

  function borrowBook(book) {
    if (!member) {
      navigate('/login', { state: { from: `/books/${book.id}` } })
      return Promise.resolve(false)
    }
    return save(async () => {
      // Hent igen, så vi også opdager lån oprettet siden sidens indlæsning.
      const latestLoans = await request('/loans')
      setLoans(latestLoans)
      if (latestLoans.some((loan) => loan.bookId === book.id && !loan.returned)) {
        throw new Error('Intet eksemplar er ledigt. Bogen er allerede udlånt.')
      }
      const loan = await request('/loans', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        body: JSON.stringify({
          bookId: book.id,
          memberId: member.id,
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
      if (!member || String(loan.memberId) !== String(member.id)) {
        throw new Error('Log ind som medlemmet, der har lånt bogen.')
      }
      const updated = await request(`/loans/${loan.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ returned: true }),
      })
      setLoans((previous) => previous.map((item) => (item.id === updated.id ? updated : item)))
      setMessage('Afleveringen er registreret. Bogen er ledig igen.')
    })
  }

  const myLoans = member ? loans.filter((loan) => String(loan.memberId) === String(member.id) && !loan.returned) : []

  return (
    <main>
      <Header />
      <TopMenu />

      {authError && <p className='notice error' role='alert'>{authError}</p>}
      {error && (
        <p className='notice error' role='alert'>
          {error}
        </p>
      )}
      <p className='status' role='status'>
        {message}
      </p>

      {checking ? <p role='status'>Kontrollerer login…</p> : loading ? (
        <p>Henter biblioteket…</p>
      ) : (
        <Outlet
          context={{
            books,
            loans,
            myLoans,
            busy,
            addBook,
            borrowBook,
            returnBook,
          }}
        />
      )}

      <footer>Undervisningsdemo · Ét eksemplar pr. bog · Login med Javalin API</footer>
    </main>
  )
}
