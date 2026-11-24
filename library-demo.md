---
title: Library Demo
description: "Library demo for React part III"
weight: 7
draft: false
---

In this exercise, you will build a small library application using the user stories below. The purpose is to recap the basics of React, including components, props, state, event handling, and forms. Later, you will extend the demo with routing to navigate between views such as the catalogue and current loans.

# Library user stories

### US-1 · Browse the catalogue

**As a** library member, **I want** to browse the catalogue, **so that** I can discover books I might like to read.

- **Given** that the catalogue contains books, **when** I open it, **then** I see each book’s title, author, and whether a copy is available to borrow.

### US-2 · Search for a book

**As a** library member, **I want** to search by title or author, **so that** I can find a specific book.

- **Given** that the catalogue contains *Clean Code* by Robert C. Martin, **when** I search for `clean` or `martin`, **then** *Clean Code* appears in the results.
- **Given** that no title or author matches my search, **when** I search, **then** I see a message saying that no books were found.

### US-3 · Add a book to the catalogue

**As a** librarian, **I want** to add a book to the catalogue, **so that** members can discover new acquisitions.

- **Given** that I’ve entered a title and an author, **when** I save the book, **then** it appears in the catalogue with one copy available to borrow.
- **Given** that the title is blank, **when** I try to save the book, **then** I see a message asking for a title and the book is not added.

### US-4 · Borrow a book

**As a** library member, **I want** to borrow an available copy, **so that** I can read it at home.

- **Given** that a book has one available copy, **when** I borrow it, **then** the loan is recorded under my name with a due date and the book is shown as unavailable.
- **Given** that all copies are on loan, **when** I try to borrow the book, **then** I’m told that no copy is available and no loan is created.

### US-5 · View my current loans

**As a** library member, **I want** to see my current loans and their due dates, **so that** I know when to return my books.

- **Given** that I have an active loan, **when** I open my loans, **then** I see the book’s title and the date it is due.

### US-6 · Register a return

**As a** librarian, **I want** to register a returned copy, **so that** another member can borrow it.

- **Given** that a copy is on loan, **when** I register its return, **then** the loan is closed, the book disappears from the member’s current loans, and the returned copy becomes available again.

## Documentation

### Library wireframe

![Library application wireframe](../images/library-wireframe.png)

### Library navigation

![Library application navigation](../images/library-navigation.png)

## Backend with JSON Server

Use JSON Server as the backend for this exercise. It turns a JSON file into a small REST API, so your React application can fetch and update library data. This lets you practise `useEffect`, `fetch`, and keeping state in sync with a backend. See the [course introduction to JSON Server](/toolbox/react/json-server) and the [official documentation](https://github.com/typicode/json-server) for more details.

### Set up the data

Create a file called `db.json` in the root of your React project and add the following sample data:

```json
{
  "books": [
    {
      "id": "1",
      "title": "Clean Code",
      "author": "Robert C. Martin"
    },
    {
      "id": "2",
      "title": "The Pragmatic Programmer",
      "author": "David Thomas and Andrew Hunt"
    },
    {
      "id": "3",
      "title": "Eloquent JavaScript",
      "author": "Marijn Haverbeke"
    }
  ],
  "members": [
    { "id": "1", "name": "Alex Jensen" },
    { "id": "2", "name": "Sam Nielsen" }
  ],
  "loans": [
    {
      "id": "1",
      "bookId": "2",
      "memberId": "1",
      "dueDate": "2026-12-08",
      "returned": false
    }
  ]
}
```

To keep the first version simple, each book represents one physical copy. A book is available when it has no loan with `returned: false`. In the sample data, *The Pragmatic Programmer* is on loan to Alex Jensen, while the other two books are available. Use `memberId: "1"` as the current member initially; login is outside the scope of this demo.

### Start the server

Install JSON Server and run it on port 4000:

```bash
npm install --save-dev json-server
npx json-server db.json --port 4000
```

Keep it running in a separate terminal while you run your React development server.

### Use the API from React

The API base URL is `http://localhost:4000`. Use these endpoints to implement the user stories:

| Action | Request |
| --- | --- |
| Load the catalogue | `GET /books` |
| Add a book | `POST /books` |
| Load members | `GET /members` |
| Load loans | `GET /loans` |
| Register a loan | `POST /loans` |
| Register a return | `PATCH /loans/1` with `{ "returned": true }` |

Send JSON request bodies with the header `Content-Type: application/json`. Leave out `id` when creating a record so JSON Server can generate it. Use the same string IDs when linking loans to books and members.

Start by fetching books and loans, and filter titles and authors in React for the search feature. When borrowing a book, check its availability and create a loan with `bookId`, `memberId`, a due date, and `returned: false`. For current loans, select records belonging to the current member where `returned` is `false`. After a successful borrow or return, update your React state or fetch the loans again so the views reflect the change.

JSON Server stores the records, but your React application must implement the exercise rules, such as validating a title and preventing a loan when the book is already borrowed.
