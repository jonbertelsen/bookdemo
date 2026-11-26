import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import RequireAuth from './auth/RequireAuth'
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
          <Route element={<RequireAuth admin />} >
            <Route path='new' element={<AddBookPage />} />
          </Route>
          <Route path=':bookId' element={<BookDetailsPage />} />
        </Route>
        <Route path='login' element={<LoginPage />} />
        <Route element={<RequireAuth />} >
          <Route path='loans' element={<LoansPage />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
