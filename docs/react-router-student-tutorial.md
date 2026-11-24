---
title: "React Router: Build a library with multiple pages"
date: 2026-11-24
draft: false
description: "A step-by-step introduction to declarative routing, navigation, layouts, and shared data in React."
tags: ["react", "react-router", "routing"]
---

In this tutorial, you will turn the library demo into an app with a front page, a top menu, and separate pages for books and loans. You will reuse the existing components and data fetching code.

Work through the steps in order. Each checkpoint gives you something to try before moving on. Steps 1–7 build the basic app; steps 8–10 add details and navigation after saving. The two extensions at the end are optional. Protected routes are for a later lesson.

## Before you start

Open the existing library project in your editor. You should already be able to run it and add, borrow, and return books. You will need your knowledge of components, props, state, `useEffect`, and `async`/`await`.

Start with the original application, not an application that already has routing. Keep the existing `request()` helper and save functions. All file paths below are relative to the project root.

Your finished pages will be:

| URL | Page |
| --- | --- |
| `/` | Home |
| `/books` | Catalogue |
| `/books/new` | Add a book |
| `/books/:bookId` | Details for one book |
| `/loans` | Your loans |
| Any unmatched URL | Not found |

Routing connects a URL to a component. Navigation lets you move between those URLs. We will use React Router in **declarative mode**, defining our routes with JSX.

## 1. Install the router

From the project root:

```sh
npm install react-router
```

Use imports from `react-router` throughout this guide, matching the current declarative installation documentation.

Keep two terminals running:

```sh
npm run server
```

```sh
npm run dev
```

Open the URL printed by Vite. JSON Server runs separately on port 4000.

## 2. Give the app access to routing

In `src/main.jsx`, import `BrowserRouter` and wrap `App`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

`BrowserRouter` connects React Router to the browser URL and history. It does not define our pages. We only need one router around the application.

**Checkpoint:** the existing app should still work.

## 3. Start with two routes and ordinary links

First preserve the existing application by moving it:

1. Create the folders `src/layouts` and `src/pages`.
2. Move `src/App.jsx` to `src/layouts/LibraryLayout.jsx`.
3. Rename its exported function from `App` to `LibraryLayout`.
4. Change its imports to `../api`, `../components/BookForm`, `../components/Catalogue`, `../components/LoanList`, and `../App.css`.

For this step, leave its state, functions, and JSX unchanged.

Create `src/pages/HomePage.jsx`:

```jsx
import { Link } from 'react-router'

export default function HomePage() {
  return (
    <section className='panel'>
      <h2>Velkommen til det lille bibliotek</h2>
      <p>Find din næste bog, eller få overblik over dine lån.</p>
      <Link to='/books'>Se bøgerne</Link>
    </section>
  )
}
```

Create a new `src/App.jsx`:

```jsx
import { Route, Routes } from 'react-router'
import LibraryLayout from './layouts/LibraryLayout'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/books' element={<LibraryLayout />} />
    </Routes>
  )
}
```

This is an intermediate version: `/books` temporarily shows the entire original screen.

`Routes` selects a matching `Route`. Each route has a URL pattern (`path`) and a component to render (`element`). `Link` renders an anchor but handles normal in-app navigation without loading a new HTML document. Continue using ordinary anchors for external websites.

**Checkpoint:** open `/`, click “Se bøgerne”, and use browser Back and Forward. Predict which component each URL renders before opening it.

## 4. Introduce the shared layout, nested routes, and an index route

Create `src/pages/BooksPage.jsx` with a temporary placeholder:

```jsx
export default function BooksPage() {
  return <h2>Bøger</h2>
}
```

In `LibraryLayout.jsx`, remove the three component imports. Add:

```jsx
import { Link, Outlet } from 'react-router'
```

Keep all existing state, effects, functions, `member`, and `myLoans`. Replace the entire returned JSX with:

```jsx
return (
  <main>
    <header>
      <div>
        <p className='eyebrow'>React · Library demo</p>
        <h1>Det lille bibliotek</h1>
      </div>
      <p>Logget ind som <strong>{member?.name ?? 'Alex Jensen'}</strong></p>
    </header>

    <nav aria-label='Hovedmenu'>
      <Link to='/'>Forside</Link>
      <Link to='/books'>Bøger</Link>
    </nav>

    {error && <p className='notice error' role='alert'>{error}</p>}
    <p className='status' role='status'>{message}</p>

    {loading ? <p>Henter biblioteket…</p> : <Outlet />}

    <footer>Undervisningsdemo · Ét eksemplar pr. bog · Ingen login eller rollekontrol</footer>
  </main>
)
```

Some retained variables are temporarily unused until step 6. Finish that step before running lint.

Replace `App.jsx` with:

```jsx
import { Route, Routes } from 'react-router'
import LibraryLayout from './layouts/LibraryLayout'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'

export default function App() {
  return (
    <Routes>
      <Route element={<LibraryLayout />}>
        <Route index element={<HomePage />} />
        <Route path='books' element={<BooksPage />} />
      </Route>
    </Routes>
  )
}
```

Here is how the pieces fit together:

- The parent is a **layout route**: it has an element but no path, so it adds UI without adding a URL segment.
- Its child routes are **nested routes**.
- `Outlet` is the position where the matching child renders.
- The **index route** is the default child at the parent's URL, here `/`. It has no path and cannot have children.

**Checkpoint:** the header and footer stay visible on both pages. Temporarily remove `Outlet`. The URL still changes, but the child content disappears. Restore it before continuing.

## 5. Use NavLink for the top menu

Replace the `Link` import in `LibraryLayout` with `NavLink` and keep `Outlet`. Replace its navigation with:

```jsx
<nav aria-label='Hovedmenu'>
  <NavLink to='/' end>Forside</NavLink>
  <NavLink to='/books' end>Bøger</NavLink>
  <NavLink to='/loans'>Mine lån</NavLink>
  <NavLink to='/books/new'>Tilføj bog</NavLink>
</nav>
```

The last two destinations will be added in step 6.

Append to `src/App.css`:

```css
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}

nav a {
  color: #205c51;
  text-decoration: none;
  padding: 0.4rem 0;
}

nav a.active {
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.3rem;
}
```

`NavLink` adds an `active` class when its destination matches. `end` on `/books` prevents that menu item from staying active at `/books/new` and book detail URLs. The root link has special matching behavior; `end` makes our intent explicit.

**Checkpoint:** compare `Link` on the home page with `NavLink` in the menu. After adding the detail page, try removing `end` from the books link and compare the highlighting.

## 6. Share the existing data through outlet context

We already have the data and functions in the layout. Child pages need access to them. Replace `<Outlet />` in `LibraryLayout` with:

```jsx
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
```

Keep it inside the existing loading conditional. `context` is an object whose properties we choose. `useOutletContext()` reads the value supplied by the parent outlet.

Replace `src/pages/BooksPage.jsx`:

```jsx
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
```

Create `src/pages/LoansPage.jsx`:

```jsx
import { useOutletContext } from 'react-router'
import LoanList from '../components/LoanList'

export default function LoansPage() {
  const { myLoans, books, returnBook, busy } = useOutletContext()

  return (
    <LoanList loans={myLoans} books={books} onReturn={returnBook} busy={busy} />
  )
}
```

Create `src/pages/AddBookPage.jsx`:

```jsx
import { useOutletContext } from 'react-router'
import BookForm from '../components/BookForm'

export default function AddBookPage() {
  const { addBook, busy } = useOutletContext()
  return <BookForm onAdd={addBook} busy={busy} />
}
```

Add these imports to `App.jsx`:

```jsx
import LoansPage from './pages/LoansPage'
import AddBookPage from './pages/AddBookPage'
```

Add these routes inside the layout route, beside the books route:

```jsx
<Route path='loans' element={<LoansPage />} />
<Route path='books/new' element={<AddBookPage />} />
```

The reusable components still receive ordinary props. Only the page components know about outlet context. The shared layout stays mounted during navigation between its children, so its state survives those page changes. Local state such as the catalogue search is reset when that page unmounts.

**Checkpoint:** borrow a book, navigate to loans, return it, and revisit the catalogue. Add a book and confirm it appears in the catalogue. No new fetch logic is needed in the pages.

## 7. Add a catch-all page

Create `src/pages/NotFoundPage.jsx`:

```jsx
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className='panel'>
      <h2>Siden findes ikke</h2>
      <p>Kontrollér adressen, eller gå tilbage til forsiden.</p>
      <Link to='/'>Til forsiden</Link>
    </section>
  )
}
```

Add `import NotFoundPage from './pages/NotFoundPage'` to `App.jsx`. Add this child of the layout route:

```jsx
<Route path='*' element={<NotFoundPage />} />
```

Call this a **catch-all** or **not-found route**, rather than a default route. The index route already serves as the default child. Rendering this page in a client-side app does not itself change the HTTP response status to 404.

**Checkpoint:** type `/does-not-exist` into the address bar. The not-found content should appear inside the shared layout.

**Pause and review:** explain to a partner how the URL, layout, and outlet work together before continuing.

## 8. Add a dynamic book detail route

Create `src/pages/BookDetailsPage.jsx`:

```jsx
import { Link, useOutletContext, useParams } from 'react-router'

export default function BookDetailsPage() {
  const { bookId } = useParams()
  const { books, loans, borrowBook, busy } = useOutletContext()
  const book = books.find((book) => String(book.id) === bookId)

  if (!book) {
    return (
      <section className='panel'>
        <h2>Bogen findes ikke</h2>
        <Link to='/books'>Til kataloget</Link>
      </section>
    )
  }

  const available = !loans.some(
    (loan) => loan.bookId === book.id && !loan.returned,
  )

  return (
    <section className='panel'>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <p>{available ? 'Ledig' : 'Udlånt'}</p>
      <button disabled={busy || !available} onClick={() => borrowBook(book)}>
        Lån bog
      </button>
      <p><Link to='/books'>Til kataloget</Link></p>
    </section>
  )
}
```

Add `import BookDetailsPage from './pages/BookDetailsPage'` to `App.jsx`. Add this route inside the layout route:

```jsx
<Route path='books/:bookId' element={<BookDetailsPage />} />
```

In `Catalogue.jsx`, add `import { Link } from 'react-router'`. Replace the book title heading with:

```jsx
<h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
```

`:bookId` captures one URL segment. `useParams()` returns its value as a string. A matching route does not guarantee a matching book, so the page handles an unknown ID itself. The route-level `*` does not handle this case because the dynamic route already matched.

**Checkpoint:** click an actual book, then try `/books/nonexistent`. Confirm `/books/new` still opens the form: React Router ranks the static `new` segment ahead of the dynamic segment.

## 9. Group the book routes with a route prefix

Once the flat paths work, replace the three `books...` routes with:

```jsx
<Route path='books'>
  <Route index element={<BooksPage />} />
  <Route path='new' element={<AddBookPage />} />
  <Route path=':bookId' element={<BookDetailsPage />} />
</Route>
```

The URLs stay the same. This parent adds a **path prefix**, but no layout element. It needs no additional outlet. Its index route displays the catalogue at `/books`.

Compare it with `LibraryLayout`: a pathless layout adds UI; an elementless prefix adds a URL segment.

**Checkpoint:** calculate the URL for each child before testing it.

## 10. Navigate after successfully adding a book

Use links for choosing a destination. Use `useNavigate` when navigation follows an action, such as saving a form.

Replace `AddBookPage.jsx`:

```jsx
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
```

The existing `save()` helper returns `true` or `false`. `await` waits for saving to finish. We navigate only after success, so a failed save leaves you on the form. Returning `saved` lets `BookForm` keep its existing success handling.

**Checkpoint:** save a book successfully. Then stop JSON Server and try saving another: the error should appear without navigation. Restart the server.

Use `Link` or `NavLink` when choosing a destination. Use `useNavigate` when navigation follows an action, such as a successful save.

## Completed core route configuration

After step 10, `src/App.jsx` should contain:

```jsx
import { Route, Routes } from 'react-router'
import LibraryLayout from './layouts/LibraryLayout'
import HomePage from './pages/HomePage'
import BooksPage from './pages/BooksPage'
import AddBookPage from './pages/AddBookPage'
import BookDetailsPage from './pages/BookDetailsPage'
import LoansPage from './pages/LoansPage'
import NotFoundPage from './pages/NotFoundPage'

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
```

## Optional extension A: another nested layout

Try this extension after completing the main tutorial. Add an account section with a submenu that stays visible while its child changes.

Create `src/layouts/AccountLayout.jsx`:

```jsx
import { NavLink, Outlet, useOutletContext } from 'react-router'

export default function AccountLayout() {
  const library = useOutletContext()

  return (
    <section>
      <h2>Min konto</h2>
      <nav aria-label='Kontomenu'>
        <NavLink to='.' end>Overblik</NavLink>
        <NavLink to='loans'>Mine lån</NavLink>
      </nav>
      <Outlet context={library} />
    </section>
  )
}
```

Import `AccountLayout` in `App.jsx`. Add this child of `LibraryLayout`; keep the original `/loans` route working:

```jsx
<Route path='account' element={<AccountLayout />}>
  <Route index element={<p>Vælg Mine lån for at se dine aktive lån.</p>} />
  <Route path='loans' element={<LoansPage />} />
</Route>
```

Visit `/account` and `/account/loans`. Unlike the `books` prefix, this parent has an element, so it needs an outlet. It reads the library context and explicitly forwards it through its own outlet: outlet context comes from the nearest parent outlet.

The submenu introduces **relative links**: `.` targets this route and `loans` targets its child, producing `/account/loans`. Earlier links started with `/` and were absolute within the app.

## Optional extension B: optional segments

Build a small help page that works with or without a topic in its URL.

Create `src/pages/HelpPage.jsx`:

```jsx
import { Link, useParams } from 'react-router'

export default function HelpPage() {
  const { topic } = useParams()

  return (
    <section className='panel'>
      <h2>Hjælp</h2>
      {!topic && <p>Vælg et emne.</p>}
      {topic === 'borrowing' && <p>Du kan låne ledige bøger i kataloget.</p>}
      {topic && topic !== 'borrowing' && <p>Ukendt hjælpeemne.</p>}
      <Link to='/help/borrowing'>Hvordan låner jeg?</Link>
    </section>
  )
}
```

Import it into `App.jsx` and add a child of `LibraryLayout`:

```jsx
<Route path='help/:topic?' element={<HelpPage />} />
```

Both `/help` and `/help/borrowing` match. The `?` makes the segment optional; `topic` is `undefined` when absent. Compare this with the required `:bookId` segment.

## Review and troubleshooting

Run `npm run lint` and `npm run build` after completing the core steps. Then manually check all menu links, book details, adding, borrowing, returning, browser Back/Forward, and an unknown URL.

| Symptom | What to check |
| --- | --- |
| Router hook reports missing router | `BrowserRouter` wraps `App` in `main.jsx` |
| Header appears but child page does not | Layout contains `Outlet`; route is nested under it |
| Outlet context is undefined | Page renders under the outlet providing context; intermediate layouts forward it |
| Page reloads on every menu click | Use `Link` or `NavLink` for internal navigation |
| Catalogue menu item stays active on add page | Put `end` on the `/books` NavLink |
| Old imports fail after moving App | Layout imports now start with `../` |
| Unknown book does not show global not-found page | Dynamic route matched; handle missing data in the detail page |
| Data appears twice in the development Network panel | StrictMode can rerun effects in development; this is separate from routing |

Deployment note: a production static host needs a fallback to `index.html` for app routes such as `/books/1`. Otherwise, refreshing a detail page may fail before React loads.

Check your understanding:

1. Which parts of the screen come from the layout and which from the child route?
2. How does an index route differ from a catch-all route?
3. Why does a route prefix not need its own outlet?
4. Why read a book ID from the URL instead of storing the selected book only in state?
5. Why should saving fail without navigating away?

## Official references

- [Declarative installation](https://reactrouter.com/start/declarative/installation)
- [Routing: nesting, layouts, indexes, prefixes, and segments](https://reactrouter.com/start/declarative/routing)
- [Navigation: Link, NavLink, and useNavigate](https://reactrouter.com/start/declarative/navigating)
- [useOutletContext](https://reactrouter.com/api/hooks/useOutletContext)
