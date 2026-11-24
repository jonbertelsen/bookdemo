import { useState } from 'react'

export default function BookForm({ onAdd, busy }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim() || !author.trim()) {
      setError(!title.trim() ? 'Indtast en titel.' : 'Indtast en forfatter.')
      return
    }
    setError('')
    const saved = await onAdd({ title: title.trim(), author: author.trim() })
    if (saved) {
      setTitle('')
      setAuthor('')
    }
  }

  return (
    <section className='panel' aria-labelledby='add-title'>
      <h2 id='add-title'>Tilføj en bog</h2>
      <p>Bibliotekar · Nye bøger får ét eksemplar.</p>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor='title'>Titel</label>
        <input id='title' value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label htmlFor='author'>Forfatter</label>
        <input id='author' value={author} onChange={(e) => setAuthor(e.target.value)} required />
        {error && (
          <p role='alert' className='error'>
            {error}
          </p>
        )}
        <button disabled={busy}>Gem bog</button>
      </form>
    </section>
  )
}
