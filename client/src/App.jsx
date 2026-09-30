import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectDetail from './pages/ProjectDetail'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import Layout from './components/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/tasks" element={<Tasks />} />

          {/* Hanya mahasiswa yang boleh buat/edit project */}
          <Route element={<RoleRoute allowed={['student']} />}>
            <Route path="/projects/new" element={<ProjectFormPage />} />
            <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
          </Route>

          <Route element={<RoleRoute allowed={['lecturer', 'admin']} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}