import { Route, Routes } from 'react-router'
import LibraryLayout from './layouts/LibraryLayout'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import LoansPage from './pages/LoansPage'
import AddBookPage from './pages/AddBookPage'
import NotFoundPage from './pages/NotFoundPage'
import BookDetailsPage from './pages/BookDetailsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<LibraryLayout />}>
        <Route index element={<HomePage />} />
        <Route path='books'>
          <Route index element={<BooksPage />} />
          <Route path='new' element={<AddBookPage />} />
          <Route path=':bookId' element={<BookDetailsPage />} />
        </Route>
        <Route path='loans' element={<LoansPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
