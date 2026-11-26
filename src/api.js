const BASE_URL = 'http://localhost:7070/api/v1'

export async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) {
    throw new Error(`Serveren svarede med fejl ${response.status}. Prøv igen.`)
  }
  return response.json()
}

export function getDueDate() {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  // Brug den lokale kalenderdato, så tidszoner ikke flytter afleveringsdagen.
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('da-DK')
}
