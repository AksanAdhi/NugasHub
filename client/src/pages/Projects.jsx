import { Link } from 'react-router-dom'
import { useMyData } from '../hooks/useMyData'
import { getProgress } from '../utils/helpers'
import ProgressBar from '../components/progressBar'

export default function Projects() {
  const { user, projects, tasks } = useMyData()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Daftar Project</h1>
        {user.role === 'student' && (
          <Link to="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Buat Project
          </Link>
        )}
      </div>

      {projects.length === 0 && <p className="text-gray-400">Belum ada project.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          const projectTasks = tasks.filter((t) => t.projectId === p.id)
          return (
            <Link key={p.id} to={`/projects/${p.id}`}
              className="bg-white rounded-xl shadow p-4 space-y-3 hover:shadow-md transition">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              <ProgressBar value={getProgress(projectTasks)} />
              <p className="text-xs text-gray-400">
                {projectTasks.length} task · Deadline {p.deadline || '-'}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}