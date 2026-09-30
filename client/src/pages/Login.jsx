import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginRequest } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { token, login } = useAuthStore()
  const navigate = useNavigate()

  if (token) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault() // cegah halaman reload
    setError('')
    setLoading(true)
    try {
      const data = await loginRequest({ email, password })
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Masuk</h1>

        {error && <p className="bg-red-100 text-red-600 text-sm p-2 rounded">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Demo: mhs@kampus.ac.id atau dosen@kampus.ac.id (password 123456)
        </p>
      </form>
    </div>
  )
}