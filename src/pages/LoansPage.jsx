import { useOutletContext } from 'react-router'
import LoanList from '../components/LoanList'

export default function LoansPage() {
  const { myLoans, books, returnBook, busy } = useOutletContext()

  return <LoanList loans={myLoans} books={books} onReturn={returnBook} busy={busy} />
}
