import { useOutletContext } from 'react-router'
import Catalogue from '../components/Catalogue'

export default function BooksPage() {
  const { books, loans, borrowBook, busy } = useOutletContext()

  return (
    <Catalogue
      books={books}
      loans={loans}
      onBorrow={borrowBook}
      busy={busy}
    />
  )
}
