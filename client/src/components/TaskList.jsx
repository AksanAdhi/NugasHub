import { useState } from 'react'
import { useDataStore } from '../store/dataStore'
import { getUserName } from '../data/users'
import { STATUS_LABEL, isOverdue } from '../utils/helpers'
import TaskForm from './TaskForm'

export default function TaskList({ tasks, projects, canEdit, showProject = false }) {
  const { updateTaskStatus, deleteTask } = useDataStore()
  const [editing, setEditing] = useState(null)

  if (tasks.length === 0) {
    return <p className="text-gray-400 text-sm py-4">Belum ada task.</p>
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow divide-y">
        {tasks.map((t) => (
          <div key={t.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-xs text-gray-500">
                {showProject && <>{projects.find((p) => p.id === t.projectId)?.title} · </>}
                Ditugaskan ke: {getUserName(t.assigneeId)}
              </p>
              <p className={`text-xs ${isOverdue(t) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                Deadline: {t.deadline || '-'} {isOverdue(t) && '(terlambat)'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={t.status}
                onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                disabled={!canEdit}
                className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {canEdit && (
                <>
                  <button onClick={() => setEditing(t)} className="text-sm text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => window.confirm('Hapus task ini?') && deleteTask(t.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <TaskForm projects={projects} task={editing} onClose={() => setEditing(null)} />
      )}
    </>
  )
}