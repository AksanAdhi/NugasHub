import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { getProgress, STATUS_LABEL } from '../utils/helpers'
import { getUserName } from '../data/users'
import ProgressBar from '../components/ProgressBar'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import MembersPanel from '../components/MembersPanel'
import DocumentsPanel from '../components/DocumentsPanel'
import CommentsPanel from '../components/CommentsPanel'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { projects, tasks, members, documents, comments, deleteProject } = useDataStore()
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('tasks')

  const project = projects.find((p) => p.id === Number(id))
  if (!project) return <Navigate to="/projects" replace />

  const isStudent = user.role === 'student'
  const isOwner = isStudent && project.ownerId === user.id
  const isMember = members.some((m) => m.projectId === project.id && m.userId === user.id)
  const canWork = isOwner || isMember            // task, dokumen
  const canComment = canWork || !isStudent       // anggota + dosen/admin

  // Mahasiswa yang bukan owner/anggota tidak boleh membuka project ini
  if (isStudent && !canWork) return <Navigate to="/projects" replace />

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const memberCount = members.filter((m) => m.projectId === project.id).length + 1
  const docCount = documents.filter((d) => d.projectId === project.id).length
  const commentCount = comments.filter((c) => c.projectId === project.id).length

  const tabs = [
    { key: 'tasks', label: 'Tasks', count: projectTasks.length },
    { key: 'members', label: 'Anggota', count: memberCount },
    { key: 'documents', label: 'Dokumen', count: docCount },
    { key: 'comments', label: 'Komentar', count: commentCount },
  ]

  const handleDelete = () => {
    if (window.confirm('Hapus project beserta semua isinya?')) {
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
          {isOwner && (
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

      {/* Tab */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${
              tab === t.key
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <div className="space-y-4">
          {canWork && (
            <div className="flex justify-end">
              <button onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                + Task
              </button>
            </div>
          )}
          <TaskList tasks={projectTasks} projects={[project]} canEdit={canWork} />
        </div>
      )}

      {tab === 'members' && <MembersPanel project={project} canManage={isOwner} />}
      {tab === 'documents' && <DocumentsPanel project={project} canUpload={canWork} isOwner={isOwner} />}
      {tab === 'comments' && <CommentsPanel project={project} canComment={canComment} />}

      {showForm && (
        <TaskForm projects={[project]} projectId={project.id} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}