import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { getProgress, STATUS_LABEL } from '../utils/helpers'
import { getUserName } from '../data/users'
import ProgressBar from '../components/progressBar'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { projects, tasks, deleteProject } = useDataStore()
  const [showForm, setShowForm] = useState(false)

  const project = projects.find((p) => p.id === Number(id))
  if (!project) return <Navigate to="/projects" replace />

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const canEdit = user.role === 'student' && project.ownerId === user.id

  const handleDelete = () => {
    if (window.confirm('Hapus project beserta semua task-nya?')) {
      deleteProject(project.id)
      navigate('/projects')
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm text-blue-600 hover:underline">← Kembali</Link>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Pemilik: {getUserName(project.ownerId)} · Deadline {project.deadline || '-'}
            </p>
          </div>
          {canEdit && (
            <div className="flex gap-3 text-sm">
              <Link to={`/projects/${project.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
              <button onClick={handleDelete} className="text-red-500 hover:underline">Hapus</button>
            </div>
          )}
        </div>

        <ProgressBar value={getProgress(projectTasks)} />

        <div className="flex gap-4 text-sm text-gray-500">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <span key={key}>
              {label}: <b>{projectTasks.filter((t) => t.status === key).length}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {canEdit && (
          <button onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
            + Task
          </button>
        )}
      </div>

      <TaskList tasks={projectTasks} projects={[project]} canEdit={canEdit} />

      {showForm && (
        <TaskForm projects={[project]} projectId={project.id} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}