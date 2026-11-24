import { useNavigate, useOutletContext } from 'react-router'
import BookForm from '../components/BookForm'

export default function AddBookPage() {
  const { addBook, busy } = useOutletContext()
  const navigate = useNavigate()

  async function handleAdd(book) {
    const saved = await addBook(book)
    if (saved) {
      navigate('/books')
    }
    return saved
  }

  return <BookForm onAdd={handleAdd} busy={busy} />
}
