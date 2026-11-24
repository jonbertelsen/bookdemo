import { Route, Routes } from 'react-router'
import LibraryLayout from './layouts/LibraryLayout'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import AddBookPage from './pages/AddBookPage'
import BookDetailsPage from './pages/BookDetailsPage'
import LoansPage from './pages/LoansPage'
import NotFoundPage from './pages/NotFoundPage'
import AccountLayout from './layouts/AccountLayout'
import HelpPage from './pages/HelpPage'

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
        <Route path='account' element={<AccountLayout />}>
          <Route index element={<p>Vælg Mine lån for at se dine aktive lån.</p>} />
          <Route path='loans' element={<LoansPage />} />
        </Route>
        <Route path='help/:topic?' element={<HelpPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
