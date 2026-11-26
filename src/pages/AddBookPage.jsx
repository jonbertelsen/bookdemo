import { useOutletContext } from 'react-router'
import BookForm from '../components/BookForm'

export default function AddBookPage() {
  const { addBook, busy } = useOutletContext()
  return <BookForm onAdd={addBook} busy={busy} />
}
