import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-blue-600">NUGASHUB</span>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link to="/projects" className="text-gray-600 hover:text-blue-600">Projects</Link>
          <Link to="/tasks" className="text-gray-600 hover:text-blue-600">Tasks</Link>
          {user.role !== 'student' && (
            <Link to="/reports" className="text-gray-600 hover:text-blue-600">Laporan</Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.name} ({user.role})</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}