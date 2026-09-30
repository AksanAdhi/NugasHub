import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function RoleRoute({ allowed }) {
  const user = useAuthStore((s) => s.user)
  return allowed.includes(user?.role) ? <Outlet /> : <Navigate to="/dashboard" replace />
}