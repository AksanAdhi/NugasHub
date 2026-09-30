import { useState } from 'react'
import { useMyData } from '../hooks/useMyData'
import { STATUS_LABEL } from '../utils/helpers'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'

export default function Tasks() {
  const { user, projects, tasks } = useMyData()
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const canEdit = user.role === 'student'
  const shown = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold">Semua Task</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm">
            <option value="all">Semua status</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          {canEdit && projects.length > 0 && (
            <button onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              + Task
            </button>
          )}
        </div>
      </div>

      <TaskList tasks={shown} projects={projects} canEdit={canEdit} showProject />

      {showForm && <TaskForm projects={projects} onClose={() => setShowForm(false)} />}
    </div>
  )
}